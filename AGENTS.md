# AGENTS.md — IKA Solution Intranet (Next.js demo)

> **Maquette de démonstration** d'un intranet SharePoint-like pour la société d'ingénierie
> informatique **IKA Solution**. Prototype Next.js avec **dummy data**, destiné à montrer le
> rendu au client **avant migration vers SharePoint Framework (SPFx)**. Objectif : fidélité
> visuelle et navigabilité — pas la production.

## 1. Contexte & décisions

- **Structure** : 1 accueil + 4 sous-sites par département :
  - `/comptabilite` → `Finance.jpg` · `/administration` → `Administartion.jpg`
  - `/commerciaux` → `Sales-Department-Homepage-SharePoint-Maven-scaled.jpg`
  - `/techniciens` → style Administration (pas d'image fournie)
- **Palette** (logo IKA) : bleu marine `#0A2540` + cyan `#06B6D4`.
- **Langue UI + dummy data** : français. Code/identifiants : anglais.
- **Auth**: aucune — le header affiche un utilisateur fictif fixe (`Awa Kaboré`).
- **Futur** : migration SPFx → chaque composant `components/intranet/<X/>` deviendra une Web
  Part équivalente. C'est pourquoi les composants reçoivent leurs données **par props**
  (plain-serializable, pas de callbacks/contexte) et **n'importent jamais `data/`**.

## 2. Stack & versions (vérifiées dans `package.json`)

- Next.js `16.2.10` (App Router) · React `19.2.4` · Tailwind CSS v4 · TypeScript `^5`
- Dépendances runtime déjà présentes : `lucide-react` (icônes), `recharts` (graphes finance), `react-icons` (footer social), `xlsx` + `file-saver` (client Excel export)
- Polices : `next/font/google` (Geist) dans `app/layout.tsx`
- **Pas de framework de test** (jest/vitest absent). Pas de `next lint` (supprimé en Next 16).

> **ATTENTION Next.js 16** — la rétro-compat est cassée. Avant d'écrire/modifier du code
> Next.js, lire le guide embarqué dans `node_modules/next/dist/docs/01-app/`, en particulier :
> - `01-getting-started/03-layouts-and-pages.md` — **`params`/`searchParams` sont async
>   (`await` obligatoire)** ; utiliser les helpers globaux `PageProps<'/route'>` /
>   `LayoutProps<'/route'>` (pas d'import).
> - `01-getting-started/04-linking-and-navigating.md`, `13-fonts.md`, `14-metadata-and-og-images.md`
> - Config : `next.config.ts` (pas de `next.config.js` legacy). Préférer `next/image`
>   (`localPatterns` si hors `public`).

## 3. Commandes & définition de « terminé »

```bash
npm run dev      # http://localhost:3000
npm run lint     # ESLint flat config (eslint.config.mjs) — pas de wrapper next
npm run build
npm run start
```

Après toute modification, **exécuter `npm run lint` PUIS `npm run build`** avant de considérer
le travail terminé. Il n'y a pas de test unitaire : "ça passe" = lint ✓ puis build ✓.

## 4. Architecture des données (le contrat à ne pas casser)

- **Flux** : `app/*/page.tsx` (Server Components synchrones) → helpers `lib/data.ts` →
  résultats passés **en props** aux composants `components/intranet/*`.
- **`Scope` est la clé** (`'global' | DepartementSlug`, voir `types/intranet.ts`) :
  l'accueil passe `'global'`, chaque sous-site passe son slug. Tous les helpers filtrent
  par `scope`. Ajouter du contenu = écrire dans le bon `data/*.ts` avec le bon `scope`.
- **Helpers réels** (`lib/data.ts`, source de vérité — `docs/architecture.md` §3 cite
  d'anciens noms `*ByScope` **qui n'existent pas**) :
  `getCompany()` · `getDepartements()` · `getDepartement(slug)` · `getQuickLinks(scope)` ·
  `getNews(scope)` · `getDocuments(scope)` · `getTeam(scope)` · `getEvents(scope)` ·
  `formatDate(iso)` · `formatDateShort(iso)`.

## 5. Frontier client/serveur & conventions

- Server Components par défaut. Marquer `"use client"` (guillemets doubles) uniquement si
  hooks/interactivité nécessaires. Actuellement client : `components/layout/site-header.tsx`
  (usePathname + nav durcie 5 routes) et `components/intranet/live-clock.tsx`.
  **Piège** : un composant avec `useState`/`onClick` mais sans `"use client"` casse le build.
- **Navigation interne** : `<Link>` de `next/link`, jamais de `<a>`.
- **Styling** : Tailwind v4 uniquement. Tokens via `@theme inline` dans `app/globals.css` →
  `bg-brand-navy`, `text-brand-cyan`, `text-brand-muted`, `bg-brand-surface`...
  **Pas de hex brut dans le JSX**.
- **Import alias** : `@/*` → racine du repo (`tsconfig.json`). Préférer `@/...` hors Next.
- **Images** : `next/image` (le logo est sous `public/assets/`). Le markdown `{" "}{<Comp/>}{" "}`
  est toléré mais éviter les `<img>` nus (préférer `next/image`).
- **Pas de commentaires**, pas de `console.*`, pas de secrets.

## 6. Dépendances externes — règle réelle

Le repo contient déjà `lucide-react` (icônes) et `recharts` (graphes finance), donc le "pas
de deps UI externes" initial **ne s'applique qu'aux dépendances nouvelles** : ne pas en
ajouter sans validation — Tailwind + les libs déjà présentes suffisent.

## 7. Notes de migration SPFx (futur)

| Concept SharePoint | Équivalent Next.js (démo) |
|---|---|
| Site collection root | `app/page.tsx` |
| Subsite par département | `app/<departement>/page.tsx` |
| Hub navigation | `<SiteHeader/>` |
| Web Parts Hero/QuickLinks/News/Documents/Team/Events | composants `components/intranet/*` |

Chaque composant deviendra une Web Part SPFx avec les **mêmes props et dummy data** —
c'est pourquoi les props doivent rester plain-serializable.

## 8. État actuel & pièges connus

- `app/page.tsx` est l'accueil active. C'est une page client, et son design/homeflow est encore en cours de refonte. Utilise les pages départementales comme architecture de référence, et ne refonds pas l'accueil sans validation.
- `app/page to come back .tsx` est une sauvegarde obsolète. Elle n'est pas routée et ne doit pas être modifiée pour produire du contenu actif.
- `app/organigramme/page.tsx`, `app/histoire/page.tsx`, et `app/Bordereaudesprix/page.tsx` sont des pages client isolées avec données et présentation inline. Elles ne suivent pas le contrat habituel `lib/data.ts` / `scope` des pages départementales.
- `components/intranet/last_home_page section.tsx` contient un espace dans son nom et est importé par `app/page.tsx`. Ne renomme pas ce fichier sans mettre à jour l'import correspondant.
- `components/intranet/_refonte-v1/` est une archive inactive. Ne revend le code de cette archive dans la home actuelle.
- `SiteHeader` inclut des liens vers `/agenda`, `/services`, `/projects`, `/blog`, `/profile`, `/settings` qui ne sont pas tous implémentés. Si tu modifies le menu, vérifie que la page existe.

## 9. Ce qu'il ne faut PAS faire

- Ajouter de l'authentification (hors scope demo).
- Introduire un backend / API / DB — uniquement dummy data statique sous `data/`.
- Ajouter une nouvelle dépendance UI sans validation.
- Utiliser une API Next.js sans vérifier la doc embarquée 16.x (rétro-compat cassée).
- Importer `data/` directement depuis `components/intranet/*` (passer par `lib/data.ts` + props).
