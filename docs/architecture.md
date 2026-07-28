# Architecture — Intranet IKA Solution (démo Next.js)

Document de référence pour tous les agents/contributeurs. À lire avant de
toucher au code.

## 1. But du projet

Prototype visuel d'un intranet SharePoint-like pour **IKA Solution**
(société d'ingénierie informatique). Données **dummy**, pas de backend.

La maquette sert de **référence visuelle** pour la future migration vers
SharePoint Framework (SPFx). Chaque composant `components/intranet/*`
correspond à une future Web Part SPFx. Ne pas casser ce mapping.

## 2. Pages (routes App Router)

| Route | Rôle | Design de référence |
|---|---|---|
| `/` | Accueil central de l'intranet | `Homepage.jpg` |
| `/comptabilite` | Sous-site comptabilité | `Finance.jpg` |
| `/administration` | Sous-site administration | `Administartion.jpg` |
| `/commerciaux` | Sous-site commerciaux | `Sales-Department-Homepage-SharePoint-Maven-scaled.jpg` |
| `/techniciens` | Sous-site techniciens | style Administration (pas d'image fournie) |

Toutes les pages sont des **Server Components** synchrones (pas de params).
On y compose les `components/intranet/*` avec les dummy data du `data/`.

## 3. Source de vérité des données

- `data/*.ts` exportent des objets typés (company, departements, news,
  documents, team, events, quick-links).
- `lib/data.ts` expose des helpers d'accès : `getCompany()`,
  `getDepartements()`, `getDepartement(slug)`, `getNewsByScope(scope)`,
  `getDocumentsByScope(scope)`, `getTeamByScope(scope)`,
  `getEventsByScope(scope)`, `getQuickLinksByScope(scope)`.
- `types/intranet.ts` contient tous les types partagés.

Scope = `'global' | DepartementSlug`. Les pages département utilisent leur
slug ; l'accueil utilise `'global'`.

## 4. Thème (Tailwind v4)

Config dans `app/globals.css` via `@theme inline`. Tokens exposés :

- `--color-brand-navy: #0A2540`
- `--color-brand-navy-light: #173b66`
- `--color-brand-cyan: #06B6D4`
- `--color-brand-cyan-dark: #0891b2`
- `--color-brand-ink: #0f172a` (texte)
- `--color-brand-surface: #f1f5f9` (fond clair)
- ... (voir `globals.css`)

Utiliser **toujours** les classes dérivées (`bg-brand-navy`, `text-brand-cyan`).
Ne pas coder des hex en dur dans le JSX.

## 5. Composants `components/intranet/*`

Tous sont des **Server Components** (pas de `'use client'` sauf nécessité),
prennent leurs données via **props** (jamais d'import direct de `data/` dans
le composant — c'est la page qui injecte). Cela garantit la réutilisabilité
en SPFx (chaque Web Part reçoit ses props).

| Composant | Props clés | Futur Web Part |
|---|---|---|
| `<Hero/>` | `title`, `subtitle`, `scope` | Hero |
| `<PageHeader/>` | `title`, `description`, `breadcrumb` | (en-tête de sous-site) |
| `<QuickLinks/>` | `links: QuickLink[]` | Quick Links |
| `<NewsList/>` | `news: News[]`, `title?` | News |
| `<DocumentsList/>` | `documents: Document[]` | Documents |
| `<TeamDirectory/>` | `members: TeamMember[]` | People |
| `<EventsCalendar/>` | `events: EventItem[]` | Events |

## 6. Layout partagé

`app/layout.tsx` (root) :
- `<html lang="fr">`, polices via `next/font/google` (Geist).
- `<SiteHeader/>` (logo + hub nav + user fixe).
- `<main>{children}</main>`.
- `<SiteFooter/>`.

## 7. Convention de nommage

- Fichiers/variables : **anglais** (kebab-case pour fichiers).
- UI + dummy data : **français**.
- Composants : PascalCase (`<NewsList/>`).
- Pas de commentaires, pas de `console.*`.

## 8. Mapping SharePoint (rappel)

Voir `AGENTS.md` §7. Chaque composant intranet = 1 Web Part SPFx future.
Respecter **props pures** (sérialisables) — pas de fonctions ni de contexte
React implicite.

## 9. Limites/Hors-scope (rappel)

- Pas d'auth, pas de backend, pas de DB, pas d'API.
- Pas de dépendances UI externes non validées.
- Pas de dark mode demandé (interface claire).
