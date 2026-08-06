# `IntranetMain` — Composant principal

C'est le **composant React assembleur unique** demandé. Une seule Web Part
posée sur la page d'accueil SharePoint reconstruit la page d'accueil Next.js
à l'identique (même design, mêmes animations, même UX).

## Fichiers

| Fichier | Rôle |
|---|---|
| `IntranetMainWebPart.ts` | Classe SPFx de la Web Part (chargement parallèle des listes, volet de propriétés) |
| `IntranetMainWebPart.manifest.json` | Manifeste SPFx (id unique, catégorie « IKA Solution ») |
| `components/IntranetMain.tsx` | Composant React principal : composition des sections + animations |
| `components/IIntranetMainProps.ts` | Interface des props |

## Sections assemblées (dans l'ordre du Next.js `app/page.tsx`)

1. `HeroSlider` — carrousel auto-rotatif (5s), panneau de bienvenue, horloge temps réel, missions rotatives, KPIs
2. `AnnouncementMarquee` — bandeau d'annonces défilant horizontalement
3. `NewsCards` — grille d'actualités
4. `QuickAccessPanel` — documents clés + liens rapides + événements à venir
5. `Gallery` — galerie photos en mosaïque (filtres par catégorie)
6. `TeamHome` — annuaire avec recherche + anniversaires du mois
7. `IntranetSections` — collaborateur du mois + tableau de bord projets

## Listes SharePoint consommées

Voir [`docs/11-deploiement-intranet-main.md`](../../../docs/11-deploiement-intranet-main.md) :
les 12 listes marquées 🏠 doivent exister sur le site hub.

## Comment choisir ce composant sur une page

1. Éditez la page.
2. Ajoutez une section **Pleine largeur** (requise pour le Hero).
3. Cliquez sur ➕ → cherchez **`IKA — Intranet (composant principal)`**.
4. Une seule Web Part = toute la page.
5. Configurez l'apparence (hauteur, couleur accent, sections) dans le volet de
   propriétés à droite.
6. Republiez.

## Build

```bash
npm run build:tailwind
npm run ship
```

→ `sharepoint/solution/ika-intranet.sppkg` à uploader dans le catalogue d'apps.
Build avec **Heft** (Gulp non utilisé).
