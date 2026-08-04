# Intranet IKA Solution — Template SPFx

> Dossier de conception et d'implémentation pour le portage de la maquette
> **Next.js** (racine du repo) vers **SharePoint Online / SPFx**.

Ce dossier est **auto-portant** : il contient les spécifications, les schémas de
listes, les scripts de provisioning et le squelette de la solution SPFx.
Il ne modifie **aucun** fichier de la maquette Next.js existante.

---

## 1. Décisions d'architecture validées

| Sujet | Décision | Fichier de référence |
|---|---|---|
| Plateforme cible | SharePoint Online (Microsoft 365) | `docs/01-architecture.md` |
| Architecture de sites | Hub Site + 1 site de communication par département | `docs/01-architecture.md` |
| Provisioning | Site Scripts + Site Designs (JSON natif) | `provisioning/` |
| Styling | Tailwind CSS compilé dans le bundle SPFx | `docs/04-styling-tailwind.md` |
| Header / Footer | SPFx Application Customizer (Top + Bottom) | `docs/05-extensions.md` |
| Périmètre | Doc + scripts + code SPFx + portage UI | ce dossier |

---

## 2. Contrainte n°1 à connaître avant de coder

> **SPFx 1.23.2 impose React 17.0.1. La maquette est en React 19.2.4.**

Ce n'est pas un détail de configuration : utiliser React 18 ou 19 dans un
web part SPFx provoque des **écrans blancs silencieux en production**, sans
erreur console, alors que tout fonctionne en développement local.

Le support de React 18 était annoncé pour SPFx 1.24 (juin 2026) puis
**retiré du calendrier** par Microsoft en mai 2026, sans nouvelle date.

**Conséquence concrète sur le portage** — détaillée dans
`docs/03-migration-composants.md` :

- Pas de `use()`, `useOptimistic`, `useActionState`, Server Components
- Pas d'Actions ni de `<form action={fn}>`
- `ReactDOM.render()` au lieu de `createRoot()`
- Les 3 composants `"use client"` actuels deviennent la norme : **tout** est
  client-side dans SPFx

---

## 3. Arborescence

```
spfx/
├── README.md                       ← vous êtes ici
├── docs/
│   ├── 01-architecture.md          Architecture hub + sites + sécurité
│   ├── 02-listes-sharepoint.md     ★ Schémas détaillés des 16 listes
│   ├── 03-migration-composants.md  Mapping 1:1 Next.js → Web Parts
│   ├── 04-styling-tailwind.md      Intégration Tailwind dans SPFx
│   ├── 05-extensions.md            Application Customizer header/footer
│   ├── 06-provisioning.md          Procédure de déploiement pas à pas
│   ├── 07-securite-gouvernance.md  Permissions, groupes, cycle de vie
│   ├── 08-plan-migration.md        Phasage, charges, risques
│   └── 09-lot1-demarrage.md        ★ Démarrage et tests de validation
├── provisioning/
│   ├── site-scripts/               JSON de création des listes
│   ├── site-designs/               Association scripts → designs
│   ├── scripts/                    PowerShell de déploiement
│   └── theme/                      Thème SharePoint IKA
├── src/
│   ├── webparts/                   Web Parts (1 dossier par composant)
│   ├── extensions/                 Application Customizer
│   ├── models/                     Interfaces TypeScript
│   ├── services/                   Accès données SharePoint
│   └── common/                     Hooks et utilitaires
├── config/                         Configuration solution SPFx
└── assets/                         Logo, images de référence
```

---

## 4. Par où commencer

1. **Lire** `docs/01-architecture.md` — comprendre la cible
2. **Valider** `docs/02-listes-sharepoint.md` — c'est le document à faire
   approuver par le métier avant tout développement
3. **Exécuter** `provisioning/scripts/` — créer les sites et les listes
4. **Développer** en suivant `docs/03-migration-composants.md`

### Outils fournis

```bash
# Valider tous les artefacts avant deploiement
node spfx/config/validate.js

# Prefixer les classes Tailwind d'un composant porte
node spfx/config/prefix-classes.js <fichier.tsx>          # simulation
node spfx/config/prefix-classes.js <fichier.tsx> --write  # application
```

État actuel de la validation : **20 listes, 155 champs, 0 erreur**.

---

## 4 bis. État d'avancement du code

### Livré — Socle (phase 2)

| Élément | Rôle |
|---|---|
| `IkaChrome` | Application Customizer — header + footer sur tous les sites |
| `DataService` | Accès REST aux listes + cache session |
| `NavigationService` | Navigation du hub + repli statique |
| `Icon` | 43 icônes SVG inline, zéro dépendance |
| `spUtils` | Dates, images, devises, `cn()` |
| `useClickOutside` / `useLiveClock` | Hooks partagés |

### Livré — Lot 1 (validation de la stack)

| Web Part | Liste lue |
|---|---|
| IKA — Actualités | `Actualites` |
| IKA — Liens rapides | `LiensRapides` |
| IKA — Documents | `Documents` |
| IKA — Événements | `Evenements` |
| IKA — Annuaire équipe | `Collaborateurs` |

### Livré — Lot 2 (sites départementaux)

| Web Part | Liste lue |
|---|---|
| IKA — Bannière département | `Departements` |
| IKA — En-tête de page | — (propriétés) |
| IKA — FAQ | `FAQ` |
| IKA — Bandeau d'annonces | `Annonces` |
| IKA — Liste des annonces | `Annonces` |

### Livré — Lots 3 et 4 (page d'accueil complète)

| Web Part | Listes lues |
|---|---|
| IKA — Carrousel d'accueil | `HeroSlides`, `Missions`, `Indicateurs` |
| IKA — Actualités (grille accueil) | `Actualites` |
| IKA — Panneau d'accès rapide | `Documents`, `LiensRapides`, `Evenements` |
| IKA — Galerie photos | `Galerie` |
| IKA — Notre équipe (accueil) | `Collaborateurs` |
| IKA — Collaborateur du mois & Projets | `CollaborateurDuMois`, `Projets` |

La page d'accueil est **intégralement portée**.

```bash
npm install --no-save typescript@5.8 @types/react@17 @types/react-dom@17
npx tsc -p config/typecheck/tsconfig.json
```

Voir `docs/09-lot1-demarrage.md` pour l'installation et les tests de recette.

### Livré — Lots 5 et 6 (pages dédiées)

| Web Part | Listes lues |
|---|---|
| IKA — Organigramme | `Collaborateurs` |
| IKA — Frise chronologique | `Histoire`, `Missions`, `Indicateurs` |
| IKA — Tableau de bord financier | `DonneesFinancieres` |
| IKA — Bordereau des prix | — (saisie en page) |

**20 Web Parts + 1 extension — portage terminé.**
**79 fichiers TypeScript compilés en `strict` : 0 erreur, 0 dépendance externe.**

Un aperçu statique du design de l'organigramme est disponible dans
`docs/orgchart-preview.html` (à ouvrir dans un navigateur).

---

## 5. Environnement de développement requis

| Outil | Version exacte | Vérification |
|---|---|---|
| Node.js | v22 LTS | `node -v` |
| SPFx | 1.23.2 | `npm ls @microsoft/sp-core-library` |
| React / ReactDOM | 17.0.1 (exact) | `npm ls react` |
| TypeScript | 5.8 | `tsc -v` |
| Toolchain | Heft (Gulp supprimé) | `heft --help` |
| PnP PowerShell | 3.x | `Get-Module PnP.PowerShell` |

```bash
npm install @rushstack/heft --global   # optionnel mais pratique
npm install
npm run trust-cert   # une fois : certificat dev
npm run start        # → https://localhost:4321
```

> **Attention** : Gulp est supprimé depuis SPFx 1.22 au profit de **Heft**.
> Les commandes `gulp serve` / `gulp bundle` n'existent plus :
> `heft start`, `heft bundle --production`, `heft package-solution --production`.

### Alternative 100% conteneurisée (Docker)

```bash
docker compose up -d spfx-workbench
# Workbench : https://localhost:4321/_layouts/15/workbench.aspx
```

Voir [`BUILD-INSTRUCTIONS.md`](./BUILD-INSTRUCTIONS.md) pour le détail.

---

## 6. Sources de vérité

Les données de la maquette (`data/*.ts`) sont la **spécification fonctionnelle**
des listes SharePoint. Toute liste du document `02-listes-sharepoint.md`
correspond à une interface de `types/intranet.ts`.

| Maquette Next.js | Liste SharePoint |
|---|---|
| `data/news.ts` | `Actualites` |
| `data/documents.ts` | `Documents` (bibliothèque) |
| `data/team.ts` + `HomeCollaborator` | `Collaborateurs` |
| `data/events.ts` | `Evenements` |
| `data/quick-links.ts` | `LiensRapides` |
| `data/departements.ts` | `Departements` |
| `HomeAnnouncement` | `Annonces` |
| `HomeProject` | `Projets` |
| `HomeGalleryImage` | `Galerie` (bibliothèque) |
| `HomeEmployeeOfMonth` | `CollaborateurDuMois` |
| `HomeHeroSlide` | `HeroSlides` (bibliothèque) |
| `HomeMission` | `Missions` |
| `HomeHeroStat` | `Indicateurs` |
| `organigramme/page.tsx` | `Organigramme` |
| `histoire/page.tsx` | `Histoire` |
| `Bordereaudesprix/page.tsx` | `BordereauPrix` + `BordereauLignes` |
