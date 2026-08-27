# 18 — Fournisseurs & Équipements : vues de liste dynamiques

> Plan d'implémentation. Deux nouvelles routes du portail affichant des listes
> SharePoint dont les colonnes sont découvertes à l'exécution.

## Contexte

Deux listes SharePoint (`Fournisseurs`, `Equipements`) ont été créées dans **Contenu du site** du site local. Il faut pouvoir les consulter depuis l'intranet, via des liens rapides, **en conservant le header et le footer IKA**.

Une page SharePoint native avec un composant « Liste » ne convient pas : l'Application Customizer `ikaChrome` — le seul mécanisme qui injecte le header/footer sur *toutes* les pages du site — **n'est pas embarqué dans le build** (aucun `IkaChromeApplicationCustomizer.manifest.json`, absent de `config/config.json`, absent de `dist/`). Une page `/Lists/Fournisseurs/AllItems.aspx` afficherait donc le chrome SharePoint natif, pas celui d'IKA.

La solution retenue : **deux nouvelles routes hash `#fournisseurs` et `#equipements`** dans le web part `IntranetMain` (le seul composant réellement déployé — cf. `config/config.json`). Le header et le footer sont rendus *en dehors* de `renderCurrentView()` (`IntranetMain.tsx:658-708`) — ils persistent donc automatiquement sur toute nouvelle route.

Les colonnes ne sont **pas** codées en dur : elles sont découvertes à l'exécution depuis le schéma de la liste. Le repo ne possède aucun renderer générique aujourd'hui — c'est le seul vrai nouveau pattern de ce chantier.

### Décisions actées

| Sujet | Choix |
|---|---|
| Destination du clic | Vue React intégrée à l'app (route hash), pas de page SharePoint |
| Colonnes | Auto-détectées depuis la vue par défaut + `/fields` |
| Noms des listes | `Fournisseurs` / `Equipements` (sans accent, conforme au §46-55 de `docs/13`) |
| Emplacement | Site local → `this._webUrl` |
| Chargement | **Paresseux** (à l'ouverture de la route), pas dans le `Promise.all` de l'accueil |
| Données de démo | Marquées `isDemo` + bandeau visible ; **jamais** de faux fournisseurs sur une vraie erreur |

---

## 1. Détection dynamique du schéma

Trois requêtes REST, deux vagues, via les helpers privés existants `_get<T>` / `_getOne<T>` de `DataService` (qui préfixent déjà `${siteUrl}/_api/web/`).

```
1. lists/getByTitle('${esc}')/fields?$filter=Hidden eq false&$top=500     → _get
2. lists/getByTitle('${esc}')/DefaultView/ViewFields                      → _getOne
   (1 et 2 lancés en Promise.all)
3. lists/getByTitle('${esc}')/items?$select=${select}&$expand=${expand}&$top=200
```

**Pièges à respecter :**

- **Aucun `$select` sur l'appel `/fields`.** `LookupField`, `CurrencyLocaleId`, `ShowAsPercentage`… vivent sur les sous-types (`SP.FieldLookup`, `SP.FieldCurrency`), pas sur `SP.Field`. Un `$select` sur une collection hétérogène renvoie **400**. On prend tout le payload et on le type avec ces propriétés **optionnelles**.
- Filtrer sur `Hidden` **uniquement** — pas `ReadOnlyField eq false`, sinon on perd les colonnes calculées.
- `ViewFields` renvoie un objet `{ Items: [...] }`, pas `{ value: [...] }` → `_getOne`. Parser de façon défensive : `Array.isArray(raw) ? raw : raw?.results ?? []`.
- Si l'appel 2 échoue ou renvoie `[]` (403 sur la vue, vue calendrier…) → repli sur l'ordre du payload `/fields`. Même logique d'échelle de replis que `getGalleryImages` (`DataService.ts:813-849`).
- Alias des noms calculés : `LinkTitle`/`LinkTitleNoMenu` → `Title`, `LinkFilename*` → `FileLeafRef` ; on **ignore** `DocIcon`, `Edit`, `SelectTitle`, `ItemChildCount` et tout nom commençant par `_`.
- **Pas de `$orderby`** : un tri non indexé sur une liste de plus de 5000 éléments déclenche l'erreur de seuil d'affichage. On charge `$top=200` non trié et on trie côté client, avec un drapeau `truncated` quand on atteint 200.

`RenderListDataAsStream` (une seule requête) a été écarté : il renvoie des **chaînes formatées selon la locale du site**, ce qui casse le tri numérique/date et l'export CSV, et exigerait un helper `_post` hors du grain de `DataService`. À documenter en commentaire comme porte de sortie si le plafond de lookups devient gênant.

**Cache :** `listtable.schema.${listTitle}` (TTL 30 min, comme `getDepartements`) et `listtable.items.${listTitle}.${top}` (TTL 5 min par défaut). Un retour sur la route ne coûte aucune requête.

**Types exclus du `$select`** (ils font échouer *toute* la requête) : `Computed` (sauf les alias ci-dessus), `Attachments`, `ContentType(Id)`, `File`, `Recurrence`, `Geolocation`, tout nom en `_`, et tout `Lookup`/`User` **non expandé**. Plafonds : `MAX_COLUMNS = 20`, `MAX_EXPANDS = 8` (seuil dur SharePoint : 12 lookups), `MAX_ROWS = 200`.

**Formatage par `TypeAsString`** (français) : `Number` → `Intl.NumberFormat("fr-FR")` ; `Currency` → `formatCurrency()` existant, défaut **XOF (F CFA)**, exceptions via `CurrencyLocaleId` (1033→USD, 1036→EUR, 2057→GBP) ; `DateTime` → `formatDateShort()` (+ heure si `DisplayFormat === 1`) ; `Boolean` → Oui/Non ; `Choice`/`MultiChoice` → pastilles (max 3 puis `+N`) ; `Lookup` → projeter `field.LookupField || "Title"` ; `User` → `Title` + avatar via `buildUserPhotoUrl()` ; `Note` → `truncate(stripHtml(v), 140)` ; `Calculated` → retirer le préfixe `/^\w+;#/` ; `Thumbnail` → `buildImageUrl()`.

---

## 2. Fichiers à modifier

### `src/models/IIkaModels.ts` — ajouter en fin de fichier
Nouvelle section « Vue générique liste » : `ListColumnKind`, `IListColumn` (`internalName`, `displayName`, `kind`, `spType`, `lookupField?`, `numeric`, `currencyCode?`), `IListRow { Id: number; [k: string]: unknown }`, `IListTableData` (`listTitle`, `columns`, `rows`, `isDemo`, `error?`, `truncated`, `totalColumns`), et `ISPFieldSchema` (sous-ensemble de `SP.Field` + propriétés de sous-types **toutes optionnelles**).

### `src/services/DataService.ts`
- Ajouter une classe `SPRequestError extends Error` portant `status`, et l'utiliser dans les deux `throw new Error(...)` de `_get`/`_getOne` (`:134-180`). Message identique → non cassant ; permet de distinguer 404 / 403.
- `public async getListTable(listTitle: string, top = 200): Promise<IListTableData>` sur `this._webUrl`.
  - Échappement, **dans cet ordre** : `encodeURIComponent(listTitle.replace(/'/g, "''"))` — échappement OData d'abord (précédent `getFaq` `:952-954`), encodage URL ensuite.
  - `if (this._useMocks) return Mocks.mockListTable(listTitle);`
  - `catch` → renvoie `{ columns: [], rows: [], isDemo: false, error: <message FR> }`, **pas de mock** :
    - 404 → « La liste « X » est introuvable sur ce site. Vérifiez son nom exact dans Contenus du site. »
    - 401/403 → « Vous n'avez pas l'autorisation de consulter la liste « X ». »
    - autre → « Impossible de charger la liste « X » (erreur N). »
  - Journaliser le `$select`/`$expand` généré via `console.warn` dans le catch — sans cela, un 400 sur l'appel items est indébuggable en production.
  - *Justification du refus de mock sur erreur :* `getComments` (`:431-438`) et `getFinanceData` (`:898-916`) refusent déjà de fabriquer des données, avec le motif écrit en commentaire. Une liste de fournisseurs (noms, contacts, montants) relève de la même classe — et ici c'est pire, puisque le schéma factice ne peut pas correspondre au vrai : on afficherait des colonnes inexistantes.
- Helpers privés : `_getListSchema()`, `static _mapFieldToColumn()`, `static _buildQueryParts()`.

### `src/services/MockData.ts` — ajouter
`MOCK_FOURNISSEURS_COLUMNS` / `_ROWS` et `MOCK_EQUIPEMENTS_COLUMNS` / `_ROWS` (6 lignes chacun, couvrant text / choice / currency / date / boolean / user), plus `export function mockListTable(listTitle): IListTableData` avec `isDemo: true`. Indispensable : le Workbench local force `_useMocks` sans échappatoire (`DataService.ts:70-86`).
Ajouter aussi deux entrées à `MOCK_QUICKLINKS` (`:514-645`), `Id` et `SortOrder` 11 et 12.

### `src/webparts/listTable/components/` — nouveau composant (2 fichiers, **pas** de `*WebPart.ts` ni de manifest)
Précédents de dossiers « composant seul » : `groupCalendar/`, `searchResults/`.

- `IListTableProps.ts` : `{ title, description?, listTitle, iconName?, getListTable: (t: string) => Promise<IListTableData>, showSearch?, showExport? }`.
- `ListTable.tsx` : commence par `import "../../../styles/tailwind.css";`.
  - **Fetch paresseux** : reprendre à l'identique l'idiome de `SearchResults.tsx:30-59` — `React.useRef<number>` comme ticket de séquence pour ignorer les réponses obsolètes, `useEffect` sur `[listTitle, getListTable]`.
  - États : squelette → erreur (`role="alert"`, carte rouge — `DocumentsList.tsx:114-123`) → vide (« Aucun élément dans cette liste. », neutre — `DocumentsList.tsx:125-131`) → tableau. Plus un bandeau ambre si `isDemo`, et une note de pied si `truncated` ou si `totalColumns > columns.length`.
  - Recherche : un `<input>` filtrant sur la concaténation des valeurs **formatées** (pour qu'une recherche « Oui » ou « 27/08/2026 » trouve ce qui est affiché).
  - Tri : `<th>` cliquable avec `aria-sort`, comparateur choisi selon `column.kind` (comparaison numérique, `Date.parse`, sinon `localeCompare(…, "fr")`). Purement client.
  - Markup du tableau : reprendre `PriceSheet.tsx:199-401` (`<div className="ika-overflow-x-auto">` + `ika-min-w-[720px]` + `<caption className="ika-sr-only">` + `<th scope="col">` + `ika-text-right ika-tabular-nums` sur les cellules numériques), mais avec la palette douce `ika-border-brand-line` / `ika-bg-brand-surface` plutôt que le `border-gray-800` du bordereau : cette grille lourde convient à un formulaire, pas à un tableau de données. Ajouter `role="region" aria-label tabIndex={0}` sur le conteneur scrollable.
  - Export CSV : `csvEscape` et `exportCsv` de `PriceSheet.tsx` sont privés au module → **recopier** (séparateur `;` + BOM `﻿` pour Excel-FR), en exportant les valeurs **brutes** pour les nombres et les dates.
  - **Sécurité** : les colonnes `URL` sont des données utilisateur rendues en `<a href>`, et `resolveUrl` (`spUtils.ts:68`) ne vérifie aucun schéma. Filtrer par liste blanche `/^(https?:|mailto:|tel:|#|\/)/i`, sinon rendre en texte inerte. Pour les `Note` en texte riche : `stripHtml`, jamais `dangerouslySetInnerHTML` dans un `<td>`.

### `src/webparts/intranetMain/components/IIntranetMainProps.ts`
Ajouter `fournisseursListTitle: string`, `equipementsListTitle: string`, `getListTable: (listTitle: string) => Promise<IListTableData>` (**requis**, comme `getNewsDetail`/`getComments` — ce sont de simples appels `DataService`, contrairement à `search?`/`agenda?` qui dépendent d'un consentement Graph).

### `src/webparts/intranetMain/IntranetMainWebPart.ts`
- `:13-18` — ajouter `PropertyPaneTextField` à l'import (déjà déclaré ligne 5 du stub `config/typecheck/stubs/@microsoft/sp-property-pane/index.d.ts` → aucune modification de stub).
- `:62-77` — `fournisseursListTitle?: string; equipementsListTitle?: string;`
- Près de `_suggestFn`/`_agendaFn` (`:90-114`) — lier une fois en champ fléché, pour la raison déjà commentée dans le fichier (identité stable, sinon le `useEffect` enfant se relance à chaque rendu) :
  `private readonly _listTableFn = (t: string) => this._service.getListTable(t);`
- `render()` (`:150-227`) — passer `this.properties.fournisseursListTitle || "Fournisseurs"`, `|| "Equipements"`, et `getListTable: this._listTableFn`.
- `_load()` (`:232-309`) — **inchangé** (chargement paresseux, voir ci-dessous).
- `:283` — `.slice(0, 10)` → **`.slice(0, 12)`** avec commentaire. Sinon les deux nouveaux liens rapides (`SortOrder` 11-12) sont **silencieusement supprimés** : les 10 places sont déjà saturées. 12 donne 6 rangées propres dans la grille `grid-cols-2`.
- Volet de propriétés (`:410-507`) — nouveau groupe « Listes personnalisées » avec deux `PropertyPaneTextField`. **Aucune garde `_loadedFor`** n'est nécessaire (contrairement à `DocumentsListWebPart.ts:38-45`) : rien n'est préchargé dans un champ du web part, le titre circule `properties → render() → props → deps du useEffect`, donc une modification dans le volet déclenche naturellement un rechargement.

**Pourquoi paresseux plutôt qu'eager.** Rejoindre le `Promise.all` de l'accueil ajouterait **6** requêtes HTTP (2 schémas + 1 items × 2 listes) aux 15 déjà déclenchées à *chaque* arrivée sur le portail — environ +40 % — pour deux routes secondaires que la plupart des visiteurs n'ouvriront jamais, et la transition squelette → contenu attendrait la plus lente de 21 requêtes au lieu de 15. Le repo possède déjà le contre-pattern : `getNewsDetail`, `getComments` et `agenda` sont passés en callbacks et invoqués par le `useEffect` de la vue. Le coût est un spinner d'environ 400 ms à la première ouverture — le même compromis que `#recherche` et `#agenda`.

### `src/webparts/intranetMain/components/IntranetMain.tsx`
Ajouter l'import et **deux `case`** dans `renderCurrentView()`, avant `case "accueil": default:` (`:496`) :

```tsx
case "fournisseurs":
case "fournisseur":
  return (
    <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
      <ListTable title="Fournisseurs" description="…" iconName="Briefcase"
                 listTitle={props.fournisseursListTitle}
                 getListTable={props.getListTable} showSearch showExport />
    </div>
  );
case "equipements":
case "equipement":   // idem, iconName="Wrench", listTitle={props.equipementsListTitle}
```

Contraintes respectées :
- `renderCurrentView` est une fonction ordinaire appelée depuis le JSX, **pas un hook** → ajouter des `case` ne peut pas changer le nombre de hooks. Rien n'est ajouté au-dessus du retour anticipé `if (props.loading)` (`:310-312`), donc le crash React 17 « Rendered more hooks » documenté à `:233-236` est hors d'atteinte. Tous les nouveaux hooks vivent dans `ListTable`, qui ne se monte que sur sa route.
- **Les noms de route restent en ASCII.** `parseHashRoute` (`:37-65`) passe le hash en minuscules ; un navigateur encode `#équipements` en `%C3%A9quipements` → `%c3%a9quipements`, qui ne correspond à rien. La route est `#equipements` ; « Équipements » n'est qu'un libellé.
- Les doubles `case` reprennent le motif existant `bordereau`/`bordereaudesprix` et `actualites`/`news`.
- `ListTable` ne reçoit pas de prop `loading` : il possède son propre état, comme `SearchResults` — et non comme `DocumentsList`, qui reçoit `loading={false}`.

### `src/services/NavigationService.ts`
Ajouter à `STATIC_SECONDARY_NAV` (`:61-65`, passé inconditionnellement à `IntranetMain.tsx:666`, donc toujours visible — contrairement à `STATIC_PRIMARY_NAV`, simple repli quand aucun département n'est chargé) :

```ts
{ key: "fournisseurs", label: "Fournisseurs", url: "#fournisseurs", iconName: "Briefcase" },
{ key: "equipements", label: "Équipements", url: "#equipements", iconName: "Wrench" },
```

`Briefcase` (`Icon.tsx:122`) et `Wrench` (`:159`) existent bien dans le registre — un nom inconnu rendrait `null` en silence. Ajouter aussi les deux slugs à `ICON_BY_SLUG` (`:27-45`) pour la nav hub dynamique, sans quoi ils héritent de l'icône générique `tag`.

⚠️ La barre secondaire passe de 3 à 5 entrées : vérifier le point de rupture tablette dans `IkaHeader`.

### Liens rapides — aucune modification de code
Ajouter deux éléments à la liste **`LiensRapides`** du site local. `getQuickLinks()` (`:565-580`) remonte tout ce qui a `IsActive eq 1`, et `QuickAccessPanel.tsx:138-158` rend un `<a href="#fournisseurs" data-interception="propagate">` sans `onClick` — le changement de hash déclenche l'écouteur `hashchange` déjà en place (`:194-205`).

| Champ | Fournisseurs | Équipements |
|---|---|---|
| `Title` | Fournisseurs | Équipements |
| `LinkUrl` | `#fournisseurs` | `#equipements` |
| `LinkDescription` | Répertoire des fournisseurs | Parc d'équipements |
| `IconName` | `Briefcase` | `Wrench` |
| `SortOrder` | 11 | 12 |
| `LinkGroup` | Ressources | Ressources |
| `IsActive` | Oui | Oui |

---

## 3. Ordre d'exécution

1. Modèles (`IIkaModels.ts`) → `npx tsc -p config/typecheck/tsconfig.json`
2. `MockData.ts` + `mockListTable()` → typecheck
3. `DataService.ts` (`SPRequestError`, helpers, `getListTable`) → typecheck
4. `ListTable.tsx` + props, développé contre les mocks → typecheck
5. Câblage : `IIntranetMainProps` → `IntranetMainWebPart` → `IntranetMain` → typecheck
6. Nav + liens rapides + passage à `.slice(0, 12)`
7. `npm run build:tailwind` puis `npm run build`

---

## 4. Vérification

**Typecheck et build** (la porte de sortie du projet — il n'y a pas de tests) :

```bash
cd spfx
npx tsc -p config/typecheck/tsconfig.json   # attendu : aucune erreur
npm run build:tailwind
npm run build
```

**Workbench local** (`npm run dev`) — valide uniquement la branche mock et le rendu : `#fournisseurs` et `#equipements` s'affichent avec le bandeau « données de démonstration », header et footer présents, tri, recherche, export CSV, scroll horizontal en fenêtre étroite.

⚠️ `_useMocks` est **inconditionnellement vrai** sur localhost (`DataService.ts:70-86`, aucun `?useMocks=0`) : le chemin de détection de schéma est **inaccessible en local**. Le cache est également désactivé sur localhost.

**Workbench hébergé** (`https://<tenant>.sharepoint.com/_layouts/15/workbench.aspx`) ou page réelle — la seule façon d'exercer le vrai chemin. À vérifier sur une liste comportant au moins une colonne Choice, User, Lookup, Currency, DateTime et Calculated :

- `#fournisseurs` saisi dans la barre d'adresse → tableau réel, colonnes dans l'ordre de la vue par défaut
- clic sur la tuile de lien rapide, puis sur le lien de la nav secondaire
- boutons Précédent/Suivant du navigateur (`hashchange`)
- header et footer IKA toujours présents sur les deux routes
- titre volontairement erroné dans le volet de propriétés → message 404 explicite, et **pas** de faux fournisseurs
- liste sans droit de lecture → message 403 distinct
- CSV ouvert dans Excel-FR (accents et colonnes corrects)
- affichage mobile : scroll horizontal du tableau, pas de débordement de la page

---

## 5. État d'implémentation

Implémenté et vérifié (`npx tsc -p config/typecheck/tsconfig.json`, `npm run build:tailwind`, `npm run build` — tous propres, `sharepoint/solution/ika-intranet.sppkg` régénéré) :

| Fichier | Changement |
|---|---|
| `src/models/IIkaModels.ts` | `ListColumnKind`, `IListColumn`, `IListRow`, `IListTableData`, `ISPFieldSchema` |
| `src/services/DataService.ts` | `SPRequestError` (porte le code HTTP), `getListTable()`, `_getListSchema()`, `_mapFieldToColumn()`, `_buildQueryParts()` |
| `src/services/MockData.ts` | jeux de démonstration + `mockListTable()`, et deux entrées dans `MOCK_QUICKLINKS` |
| `src/webparts/listTable/components/` | `ListTable.tsx` et `IListTableProps.ts` (nouveau composant générique) |
| `src/common/utils/Icon.tsx` | icônes `ChevronUp` et `ChevronsUpDown` (indicateurs de tri) |
| `src/webparts/intranetMain/components/IIntranetMainProps.ts` | `fournisseursListTitle`, `equipementsListTitle`, `getListTable` |
| `src/webparts/intranetMain/IntranetMainWebPart.ts` | `_listTableFn`, props de rendu, groupe « Listes personnalisées » du volet, plafond des liens rapides porté à 12 |
| `src/webparts/intranetMain/components/IntranetMain.tsx` | routes `#fournisseurs` et `#equipements` |
| `src/services/NavigationService.ts` | deux entrées de nav secondaire + deux slugs dans `ICON_BY_SLUG` |

## 6. À faire côté SharePoint (hors code)

1. **Déployer** `sharepoint/solution/ika-intranet.sppkg` dans le catalogue d'applications, puis mettre à jour l'application sur le site.
2. **Ajouter deux éléments à la liste `LiensRapides`** du site local (voir le tableau du §2). Aucune modification de code n'est nécessaire : `getQuickLinks()` remonte tout élément dont `IsActive` vaut Oui.
3. **Vérifier le titre exact des listes.** Le code interroge `getByTitle('Fournisseurs')` et `getByTitle('Equipements')`. Si vos listes portent un autre nom d'affichage, corrigez-le dans le volet de propriétés du web part (groupe « Listes personnalisées ») plutôt que dans le code.
4. **Contrôler l'ordre des colonnes** dans la vue par défaut de chaque liste : c'est lui qui détermine l'ordre des colonnes du tableau. Les colonnes retirées de la vue n'apparaissent pas.
