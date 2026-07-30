# 03 — Migration des composants Next.js vers les Web Parts SPFx

## 1. Le point bloquant : React 19 → React 17

### Ce que dit Microsoft

SPFx 1.23.2 impose **React 17.0.1 exactement**. La documentation officielle
avertit :

> Using incompatible React versions can cause silent runtime failures without
> clear error messages during the build process.

Le symptôme typique : le web part fonctionne en local (`heft start`) puis
s'affiche en **cadre blanc vide** une fois déployé, sans aucune erreur console.

Le support de React 18 était annoncé pour SPFx 1.24 en juin 2026, puis retiré
du calendrier par Microsoft en mai 2026 sans nouvelle date. **On ne peut pas
construire un projet sur cette promesse.**

```bash
npm install react@17.0.1 react-dom@17.0.1 --save-exact
```

Le flag `--save-exact` est obligatoire : sans lui, npm installera un patch
supérieur et cassera le rendu en production.

### Inventaire des incompatibilités

| API utilisée dans la maquette | Statut SPFx 1.23 | Remplacement |
|---|---|---|
| Server Components | Indisponible | Tout devient client |
| `async` page components | Indisponible | `useEffect` + état de chargement |
| `use()` | Indisponible | `useEffect` |
| `useActionState` | Indisponible | `useState` + handler |
| `useOptimistic` | Indisponible | `useState` manuel |
| `<form action={fn}>` | Indisponible | `onSubmit` classique |
| `createRoot()` | Indisponible | `ReactDOM.render()` |
| `next/image` | Indisponible | `<img>` + CDN SharePoint |
| `next/link` | Indisponible | `<a>` + `UrlUtils` |
| `next/font` | Indisponible | `@font-face` ou police du thème |
| `usePathname()` | Indisponible | `context.pageContext.web.serverRelativeUrl` |
| `Metadata` export | Indisponible | Propriétés de page SharePoint |
| `"use client"` | Sans objet | À supprimer |
| Hooks React 17 (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`) | **Compatible** | Aucun changement |

### Ce qui ne change pas

Bonne nouvelle : le contrat d'architecture de `AGENTS.md` §4 — **props
sérialisables, aucun import de `data/` dans les composants** — est exactement
ce qu'il faut pour SPFx. Le JSX et les classes Tailwind se portent tels quels.
L'essentiel du travail porte sur la couche d'accès aux données, pas sur l'UI.

---

## 2. Anatomie d'un Web Part

Chaque web part suit strictement le même découpage en 4 fichiers.

```
src/webparts/newsList/
├── NewsListWebPart.ts              Orchestration : données → props
├── NewsListWebPart.manifest.json   Identité, icône, groupe
├── components/
│   ├── NewsList.tsx                Composant de présentation (JSX porté)
│   └── INewsListProps.ts           Contrat de props
└── loc/                            Chaînes localisées
```

### Rôle de chaque fichier

| Fichier | Responsabilité | Interdictions |
|---|---|---|
| `*WebPart.ts` | Appelle le service, gère chargement/erreur, injecte les props | Aucun JSX métier |
| `*.tsx` | Rendu pur à partir des props | **Aucun appel réseau**, aucun accès au contexte SPFx |
| `I*Props.ts` | Types sérialisables uniquement | Pas de fonctions ni de classes |
| `*.manifest.json` | Métadonnées et propriétés par défaut | — |

> Cette séparation reproduit exactement le rapport
> `app/*/page.tsx` ↔ `components/intranet/*` de la maquette.

---

## 3. Table de correspondance complète

### 3.1 Web Parts du hub (accueil)

| # | Composant Next.js | Web Part SPFx | Listes lues | Complexité |
|---|---|---|---|---|
| 1 | `hero-slider.tsx` (265 l.) | `IkaHeroSlider` | `HeroSlides`, `Missions`, `Indicateurs` | Élevée |
| 2 | `announcement-marquee.tsx` (103 l.) | `IkaAnnouncementMarquee` | `Annonces` | Faible |
| 3 | `News.tsx` (111 l.) | `IkaNewsCards` | `Actualites` | Moyenne |
| 4 | `firstSection.tsx` (162 l.) | `IkaQuickAccessPanel` | `Documents`, `LiensRapides`, `Evenements` | Moyenne |
| 5 | `before_last_home_page_section.tsx` (512 l.) | `IkaGalleryTeam` | `Galerie`, `Collaborateurs` | **Très élevée** |
| 6 | `last_home_page section.tsx` (286 l.) | `IkaIntranetSections` | `CollaborateurDuMois`, `Projets`, `Departements` | Élevée |

> **Le fichier `last_home_page section.tsx` contient un espace dans son nom.**
> `AGENTS.md` §8 avertit de ne pas le renommer sans mettre à jour l'import.
> En SPFx, ce nom est **invalide** : le web part s'appellera
> `IkaIntranetSections`. C'est une correction, pas une régression.

> **`before_last_home_page_section.tsx` (512 lignes)** est le plus gros
> composant. Recommandation : le scinder en **deux web parts distinctes**
> (`IkaGallery` et `IkaTeamDirectory`) pour rester sous la limite de bundle et
> permettre un placement indépendant sur la page.

### 3.2 Web Parts des sites départements

| # | Composant Next.js | Web Part SPFx | Listes lues | Complexité |
|---|---|---|---|---|
| 7 | `dept-hero.tsx` (91 l.) | `IkaDeptHero` | `Departements` | Faible |
| 8 | `page-header.tsx` (51 l.) | `IkaPageHeader` | — (propriétés) | Faible |
| 9 | `quick-links.tsx` (47 l.) | `IkaQuickLinks` | `LiensRapides` | Faible |
| 10 | `news-list.tsx` (83 l.) | `IkaNewsList` | `Actualites` | Faible |
| 11 | `documents-list.tsx` (59 l.) | `IkaDocumentsList` | `Documents` | Moyenne |
| 12 | `team-directory.tsx` (66 l.) | `IkaTeamDirectory` | `Collaborateurs` | Faible |
| 13 | `events-calendar.tsx` (55 l.) | `IkaEventsCalendar` | `Evenements` | Faible |
| 14 | `faq-list.tsx` (41 l.) | `IkaFaqList` | `FAQ` | Faible |
| 15 | `finance-charts.tsx` (193 l.) | `IkaFinanceCharts` | `DonneesFinancieres` | Élevée |

### 3.3 Web Parts de pages dédiées

| # | Page Next.js | Web Part SPFx | Listes lues | Complexité |
|---|---|---|---|---|
| 16 | `organigramme/page.tsx` (767 l.) | `IkaOrgChart` | `Collaborateurs`, `Organigramme` | **Très élevée** |
| 17 | `histoire/page.tsx` (646 l.) | `IkaTimeline` | `Histoire`, `Missions`, `Indicateurs` | Élevée |
| 18 | `Bordereaudesprix/page.tsx` (387 l.) | `IkaPriceSheet` | `BordereauPrix`, `BordereauLignes` | **Très élevée** |
| 19 | `annonces/page.tsx` (55 l.) | `IkaAnnouncementsList` | `Annonces` | Faible |

### 3.4 Extension

| Composant Next.js | Extension SPFx | Type |
|---|---|---|
| `site-header.tsx` (393 l.) + `site-footer.tsx` (88 l.) | `IkaChrome` | Application Customizer |

Détaillé dans `05-extensions.md`.

### 3.5 Utilitaires portés

| Fichier Next.js | Destination SPFx |
|---|---|
| `lib/data.ts` | `src/services/DataService.ts` |
| `lib/cn.ts` | `src/common/utils/cn.ts` — inchangé |
| `lib/lucide-icon.tsx` | `src/common/utils/LucideIcon.tsx` — inchangé |
| `types/intranet.ts` | `src/models/` — un fichier par domaine |
| `components/intranet/icon.tsx` (170 l.) | `src/common/utils/Icon.tsx` |
| `components/intranet/live-clock.tsx` | `src/common/hooks/useLiveClock.ts` |

### 3.6 Ce qui est explicitement exclu

| Élément | Raison |
|---|---|
| `components/intranet/_refonte-v1/` | Archive inactive — `AGENTS.md` §8 |
| `app/page to come back .tsx` | Sauvegarde obsolète non routée |
| `app/error.tsx`, `app/loading.tsx` | Gérés nativement par SPFx |
| `app/layout.tsx` | Remplacé par l'Application Customizer |

---

## 4. Recettes de portage

### 4.1 Page Server Component → Web Part

**Avant** — `app/comptabilite/page.tsx`
```tsx
export default function ComptabilitePage() {
  const news = getNews("comptabilite");
  return <NewsList news={news} />;
}
```

**Après** — `IkaNewsListWebPart.ts`
```ts
export default class IkaNewsListWebPart extends BaseClientSideWebPart<IIkaNewsListWebPartProps> {
  private _items: INewsItem[] = [];
  private _loading = true;
  private _error?: string;

  protected async onInit(): Promise<void> {
    await super.onInit();
    this._service = new NewsService(this.context);
  }

  public render(): void {
    if (this._loading) {
      this._renderElement(React.createElement(Spinner));
      void this._load();
      return;
    }
    this._renderElement(
      React.createElement(NewsList, {
        items: this._items,
        title: this.properties.title,
        maxItems: this.properties.maxItems,
        error: this._error,
      })
    );
  }

  private async _load(): Promise<void> {
    try {
      this._items = await this._service.getNews(this.properties.maxItems);
    } catch (e) {
      this._error = "Impossible de charger les actualités.";
    } finally {
      this._loading = false;
      this.render();
    }
  }

  private _renderElement(element: React.ReactElement): void {
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
```

> `ReactDom.render` et non `createRoot`. `onDispose` est **obligatoire** :
> sans lui, chaque re-render en mode édition fuit de la mémoire.

### 4.2 `next/image` → image SharePoint

**Avant**
```tsx
<Image src="/assets/team/DG.jpg" alt="DG" width={400} height={400} />
```

**Après**
```tsx
<img
  src={buildImageUrl(item.Photo, 400)}
  alt={item.AltText ?? item.Title}
  width={400}
  height={400}
  loading="lazy"
  className="rounded-full object-cover"
/>
```

```ts
export function buildImageUrl(field: ISPImageField | undefined, width?: number): string {
  if (!field?.serverRelativeUrl) return "/_layouts/15/images/person.gif";
  const base = field.serverRelativeUrl;
  return width
    ? `/_layouts/15/getpreview.ashx?path=${encodeURIComponent(base)}&resolution=${width}`
    : base;
}
```

> `getpreview.ashx` est le mécanisme natif de miniatures SharePoint. Il
> remplace l'optimisation de `next/image` sans coût supplémentaire.

### 4.3 `next/link` → lien SharePoint

**Avant**
```tsx
<Link href="/comptabilite">Comptabilité</Link>
```

**Après**
```tsx
<a href={resolveUrl("/sites/ika-comptabilite")} data-interception="propagate">
  Comptabilité
</a>
```

> `data-interception="propagate"` demande à SharePoint d'intercepter le clic
> et de naviguer **sans rechargement complet**. C'est l'équivalent le plus
> proche du routage client de `next/link`. L'omettre provoque un rechargement
> complet à chaque clic.

### 4.4 Composant client → composant SPFx

**Avant**
```tsx
"use client";
import { useState } from "react";
export function LiveClock() { /* ... */ }
```

**Après**
```tsx
import * as React from "react";
export const LiveClock: React.FC<ILiveClockProps> = (props) => { /* ... */ };
```

Changements : supprimer `"use client"`, utiliser `import * as React`
(imposé par la configuration TypeScript de SPFx), typer explicitement.

### 4.5 `recharts` et `xlsx` — remplacés, pas externalisés

La conception initiale prévoyait d'externaliser ces deux librairies via CDN.
**Le portage a retenu une autre solution : les supprimer.**

| Librairie | Poids | Décision |
|---|---|---|
| `recharts` | ~500 Ko | Remplacée par des **graphiques SVG natifs** |
| `xlsx` | ~900 Ko | Remplacée par un **export CSV natif** |
| `file-saver` | ~5 Ko | Remplacée par `Blob` + `URL.createObjectURL` |
| `lucide-react` | ~50 Ko | Remplacée par `common/utils/Icon.tsx` |
| `react-icons` | ~30 Ko | Remplacée par `SocialIcon.tsx` |

Pourquoi ne pas externaliser :

1. **`recharts` v3 exige React 18** — incompatible avec SPFx 1.23.2. Il aurait
   fallu figer la v2, non maintenue à terme.
2. **Les CDN externes sont souvent bloqués** par les politiques de sécurité
   tenant. Le repli (héberger dans `SiteAssets`) ajoute une étape de
   déploiement manuel à chaque montée de version.
3. **Le bundle est téléchargé sur chaque page.** ~1,5 Mo évités.

`src/webparts/financeCharts/components/charts.tsx` fournit `AreaChart`,
`DonutChart` et `BarList` en SVG pur — avec `role="img"`, `aria-label`
descriptif et `<title>` sur chaque segment, ce que `recharts` ne fait pas
nativement.

**Résultat : le code SPFx n'a aucune dépendance externe.** Seuls les paquets
`@microsoft/sp-*` et React sont requis.

#### Export CSV plutôt qu'Excel

`saveAs()` de `file-saver` est **bloqué dans l'onglet Teams**. L'export CSV
utilise l'API navigateur standard (`Blob` + ancre temporaire) avec un BOM
UTF-8 pour qu'Excel ouvre correctement les accents. Le séparateur est le
point-virgule, attendu par Excel en locale française.

## 5. Ordre de développement recommandé

| Lot | Web Parts | Pourquoi cet ordre |
|---|---|---|
| 0 | Socle : services, modèles, Tailwind, `IkaChrome` | Rien ne compile sans lui |
| 1 | `IkaNewsList`, `IkaQuickLinks`, `IkaDocumentsList`, `IkaEventsCalendar`, `IkaTeamDirectory` | Composants simples : valident la chaîne complète |
| 2 | `IkaDeptHero`, `IkaPageHeader`, `IkaFaqList`, `IkaAnnouncementMarquee`, `IkaAnnouncementsList` | Complètent les sites départements |
| 3 | `IkaHeroSlider`, `IkaNewsCards`, `IkaQuickAccessPanel` | Home : haute visibilité |
| 4 | `IkaGallery`, `IkaTeamDirectoryHome`, `IkaIntranetSections` | Home : gros composants |
| 5 | `IkaOrgChart`, `IkaTimeline` | Pages dédiées complexes |
| 6 | `IkaFinanceCharts`, `IkaPriceSheet` | Externalisation + logique métier |

Le lot 1 est le **lot de validation** : s'il passe en production sans écran
blanc, la stack est saine et le reste s'enchaîne.

---

## 6. Checklist par web part

- [ ] `manifest.json` : `id` GUID unique, `group` = « IKA Solution »
- [ ] Props strictement sérialisables — aucune fonction
- [ ] Aucun appel réseau dans le `.tsx`
- [ ] `onDispose()` avec `unmountComponentAtNode`
- [ ] État de chargement + état d'erreur + **état vide**
- [ ] `aria-label` sur les contrôles interactifs
- [ ] Testé à 320 px, 768 px, 1024 px, 1920 px
- [ ] Testé dans le volet de propriétés en mode édition
- [ ] `React.version === "17.0.1"` vérifié après build
- [ ] Bundle < 1 Mo (`heft bundle --ship` puis inspection)
