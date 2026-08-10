# 12 — Review du composant SPFx & recommandations déploiement

> Revue technique du composant SharePoint **IKA Solution** (Web Part principale
> `IntranetMainWebPart`) dans le but :
> 1. d'**éviter tout problème au déploiement et à la création de page** ;
> 2. d'obtenir un rendu **identique à la maquette Next.js**.
>
> Modèle de référence : le package **Coris Meso Finance** (`Intranet-Coris-mesofinance.zip`)
> qui fonctionne correctement en production.
>
> Les points **🔴 corrigés dans ce commit** sont vérifiés par un **build de
> production réel** (`npm ci && npm run build` → `.sppkg` généré, CSS Tailwind
> réellement compilé dans le bundle). Les autres points sont des
> **recommandations** classées par priorité.

---

## 1. Ce qui fonctionne déjà (vérifié par un build réel)

| Élément | Verdict |
|---|---|
| `npm ci` + `npm run build` | ✅ **Passe** et génère `spfx/sharepoint/solution/ika-intranet.sppkg` |
| TypeScript (20 web parts, config `config/typecheck`) | ✅ **0 erreur de type** |
| Bundle : Tailwind préfixé `ika-` | ✅ 710 règles CSS `ika-*` réellement compilées dans le JS (`ika-intranet-web-parts_*.js`) |
| Isolation CSS | ✅ `tailwindcss-scoped-preflight` + `prefix-classes.js` → ne casse pas le chrome SharePoint |
| `skipFeatureDeployment: true` | ✅ Un **site owner** peut déployer le `.sppkg` sans être admin du tenant (comme Coris) |
| `supportsFullBleed` + section pleine largeur | ✅ |
| `fullPageChrome()` qui **respecte le mode édition** | ✅ Ne masque pas les barres d'édition quand on édite la page |
| Aucune dépendance lourde (pas de swiper/framer/lucide) | ✅ Bundle léger, compatible React 17 |

---

## 2. 🔴 Bugs critiques corrigés dans ce commit

### 2.1 Écran blanc au chargement — violation des Règles des Hooks (React 17)

**Fichier** : `src/webparts/intranetMain/components/IntranetMain.tsx`

**Problème** : les `useMemo` `chromeContext` et `documentsNav` étaient placés
**après** le `return` anticipé du squelette :

```tsx
if (props.loading) {                    // ← return anticipé
  return <IntranetMainSkeleton ... />;
}
const chromeContext = React.useMemo(...); // ← hooks APRÈS un return
const documentsNav = React.useMemo(...);  // ← hooks APRÈS un return
```

Pendant le chargement (loading=true) le composant appelle **3 hooks** ; au
passage `loading=false` il en appelle **5**. React 17 lève alors l'erreur
fatale **« Rendered more hooks than during the previous render »** et
**démonte l'arbre** → **section Web Part vide / écran blanc**, silencieux,
typiquement au moment où les données arrivent.

**Correctif appliqué** : l'early-return du squelette est déplacé **après
tous les hooks** (les `useMemo` sont désormais inconditionnels).

> ⚠️ C'est très probablement la cause n°1 de « la page est blanche après
> déploiement alors que le workbench semble OK ». À vérifier absolument.

### 2.2 Erreur d'accès aux listes jamais affichée

**Fichiers** : `IntranetMainWebPart.ts` + `IntranetMain.tsx`

**Problème** : dans `_load()`, le `catch` réaffectait `this._error = undefined`,
et `props.error` n'était **jamais lu** dans le composant. En cas de liste
manquante ou de nom interne incorrect, la Web Part retombait **silencieusement**
sur les données factices (mock) → le site owner ne comprend pas pourquoi ses
listes ne s'affichent pas.

**Correctif appliqué** :
- `catch` positionne maintenant un message d'erreur explicite ;
- ajout d'un **bandeau d'avertissement** visible sous le header quand
  `loading === false && error` est défini (avec repli gracieux, ne casse rien).

---

## 3. 🟠 Recommandations importantes avant mise en production

### 3.1 Nombre réel de Web Parts déployées ≠ « 20 Web Parts »

`config/config.json` ne déclare **qu'une seule** bundle/entry point :
`IntranetMainWebPart`. Les ~19 autres dossiers `src/webparts/*` ne sont
**pas enregistrés** : seuls les composants importés par `IntranetMain`
atteignent le bundle. La doc (README, `03-migration-composants.md`) parle de
« 20 Web Parts — portage terminé », ce qui prête à confusion.

**Choix à trancher explicitement :**
- **(a)** Architecture « 1 seule Web Part » (style Coris) — **recommandé**
  pour une page identique à Next.js en un seul clic, et zéro friction de
  création de page. Mettre alors la doc à jour (retirer « 20 Web Parts »).
- **(b)** Enregistrer chaque Web Part indépendante dans `config.json` — plus
  modulaire, mais multiplie les points de défaillance et l'effort de création
  de page.

### 3.2 Fragilité des noms internes SharePoint (lookups)

La Web Part lit 15+ listes via REST `lists/getByTitle('...')` avec des
`$select`/`$filter`/`$expand` écrits à la main (`Manager`, `Department`,
`NewsAuthor`, `Scope`, `fAllDayEvent`…). Tout nom interne qui ne correspond
pas **exactement** à la création de la liste fait échouer la requête →
repli silencieux sur les mocks.

Recommandations :
- Créer les listes en suivant **exactement** les noms affichés de
  `docs/10-listes-a-creer.md` (c'est le contrat).
- Pour les lookups (`Department`, `Manager`, `RelatedPerson`), vérifier que le
  **nom interne** généré correspond (espaces/accents), sinon le
  `$expand=Department/Title` échoue sans erreur.
- Le bandeau d'avertissement (correctif 2.2) rend désormais ces échecs visibles
  au lieu d'être muets.

### 3.3 Chemin de hub codé en dur — corrigé

`DataService._resolveHubUrl()` retombait sur un chemin **codé en dur**
`/sites/ikareview` quand l'URL de hub n'était pas fournie. Sur un site non
rattaché à ce hub, **toutes** les lectures « hub » échouaient en silence.

**Correctif appliqué** : repli sur `_webUrl` (le site courant), plus robuste
et prévisible. Prévoir aussi une **propriété du volet de propriétés** pour
saisir l'URL du hub, plutôt que de la déduire.

### 3.4 Rendu « identique à Next.js »

- **Police** : la maquette utilise Geist via `next/font`. Le bundle SPFx ne
  charge aucune Google Font → la typographie diffère du mockup. Ajouter
  `@font-face`/`<link>` Geist (ou accepter la police système) pour la fidélité.
- **Logo** : l'URL par défaut est `${hubUrl}/SiteAssets/logo.png`. Si ce
  fichier n'existe pas, le header affiche un logo cassé. Ajouter un champ
  « URL du logo » dans le volet de propriétés (équivalent de
  `public/assets/logo`).
- **Images** : les colonnes Image (`HeroSlides`, `Galerie`, photos) reposent
  sur `buildImageUrl` ; s'assurer que les bibliothèques et le mode « Affichage
  simplifié » sont activés, sinon les vignettes sont vides.

### 3.5 Manifest : hôtes Teams superflus

`supportedHosts` inclut `TeamsPersonalApp` / `TeamsTab`, mais le composant fait
du chrome SharePoint plein écran (`fullPageChrome`) et des lectures de listes
du site. Pour éviter une expérience Teams confuse, restreindre à
`SharePointWebPart` + `SharePointFullPage`.

### 3.6 Erreur globale (error boundary)

Un seul sous-composant en erreur (ex. Organigramme) ne doit pas faire tomber
toute la Web Part. Ajouter un **error boundary** au niveau `IntranetMain` qui
affiche un message local plutôt qu'un écran blanc.

---

## 4. Checklist finale avant déploiement (à faire sur un vrai site)

1. `cd spfx && npm ci` puis `npm run build` → **doit générer
   `sharepoint/solution/ika-intranet.sppkg`** (✅ vérifié ici).
2. Déployer le `.sppkg` : App Catalog **de site** (site owner, grâce à
   `skipFeatureDeployment`) puis « Ajouter une application » sur le site.
3. Créer les listes/bibliothèques **avec les noms exacts** (`docs/10-listes-a-creer.md`).
4. Sur une page, ajouter la Web Part **IKA Solution — Portail Intranet** dans
   une **section pleine largeur** (colonne unique).
5. Vérifier la **console (F12)** :
   - aucune erreur rouge ;
   - `React.version` = `17.0.1` ;
   - aucun message « Rendered more hooks… ».
6. Tester les 4 états : **chargement** (squelette), **données** (listes
   remplies), **vide** (liste vide → message), **erreur** (liste renommée →
   bandeau d'avertissement).
7. Contrôle visuel vs maquette Next.js : header, hero, annonces, actualités,
   galerie, équipe, projets, footer, responsive 320/768/1024/1920 px.
8. Vérifier que le **mode édition** de la page reste fonctionnel (poignées,
   bordures, volet de propriétés).

---

## 5. Fichiers modifiés dans ce commit

| Fichier | Correction |
|---|---|
| `spfx/src/webparts/intranetMain/components/IntranetMain.tsx` | Règles des Hooks respectées (early-return après tous les hooks) + bandeau d'avertissement erreur |
| `spfx/src/webparts/intranetMain/IntranetMainWebPart.ts` | `_error` réellement renseigné dans le `catch` |
| `spfx/src/services/DataService.ts` | `_resolveHubUrl()` : plus de chemin `/sites/ikareview` codé en dur (repli sur le site courant) |
| `spfx/config/typecheck/stubs/@microsoft/sp-property-pane/index.d.ts` | Ajout de `PropertyPaneLabel` manquant au stub (permet le typecheck complet) |

---

*Revue réalisée sur le dépôt à l'état courant ; le `.sppkg` de production est
régénéré et ne doit **pas** être commité (artefact gitignoré).*
