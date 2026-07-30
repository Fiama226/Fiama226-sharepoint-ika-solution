# 01 — Architecture cible SharePoint Online

## 1. Vue d'ensemble

L'intranet IKA Solution est construit sur une **architecture Hub Site**, qui est
la recommandation Microsoft depuis l'abandon des sous-sites classiques.

```
                    ┌─────────────────────────────────┐
                    │   IKA-Intranet-Hub              │
                    │   Site de communication         │
                    │   (site racine du hub)          │
                    │                                 │
                    │   = app/page.tsx (Accueil)      │
                    └────────────┬────────────────────┘
                                 │ navigation hub partagée
         ┌───────────────┬───────┴───────┬───────────────┐
         │               │               │               │
┌────────▼──────┐┌───────▼──────┐┌───────▼──────┐┌───────▼──────┐
│ IKA-Compta    ││ IKA-Admin    ││ IKA-Commerce ││ IKA-Tech     │
│ Communication ││ Communication││ Communication││ Communication│
│               ││              ││              ││              │
│ /comptabilite ││/administration││ /commerciaux││ /techniciens │
└───────────────┘└──────────────┘└──────────────┘└──────────────┘
```

### Pourquoi un hub plutôt qu'un site unique

| Critère | Hub + sites | Site unique |
|---|---|---|
| Sécurité par département | Native (par site) | Permissions par item — ingérable |
| Limite de 5 000 éléments | Répartie sur 5 sites | Concentrée sur 1 site |
| Recherche fédérée | Automatique via le hub | Manuelle |
| Navigation commune | Héritée du hub | À recoder |
| Autonomie des équipes | Chaque dept a son owner | Tout remonte à l'admin |
| Thème commun | Propagé par le hub | Natif |

### Pourquoi pas de sous-sites

Microsoft déconseille les sous-sites depuis 2019 : ils héritent des permissions
de façon rigide, ne peuvent pas être déplacés, ne bénéficient pas des
fonctionnalités modernes (Viva Connections, hub associations) et compliquent la
gouvernance du cycle de vie.

---

## 2. Inventaire des sites

| Site | URL relative | Modèle | Correspondance maquette |
|---|---|---|---|
| Hub intranet | `/sites/ika-intranet` | Communication (SITEPAGEPUBLISHING#0) | `app/page.tsx` |
| Comptabilité | `/sites/ika-comptabilite` | Communication | `app/comptabilite` |
| Administration | `/sites/ika-administration` | Communication | `app/administration` |
| Commerciaux | `/sites/ika-commerciaux` | Communication | `app/commerciaux` |
| Techniciens | `/sites/ika-techniciens` | Communication | `app/techniciens` |

### Pages du site hub

| Page SharePoint | Route Next.js | Web Parts utilisées |
|---|---|---|
| `Accueil.aspx` | `/` | HeroSlider, AnnouncementMarquee, News, FirstSection, GalleryAndTeam, IntranetSections |
| `Organigramme.aspx` | `/organigramme` | OrgChart |
| `Histoire.aspx` | `/histoire` | Timeline |
| `Annonces.aspx` | `/annonces` | AnnouncementsList |
| `BordereauPrix.aspx` | `/Bordereaudesprix` | PriceSheet |

### Pages type d'un site département

| Page | Web Parts |
|---|---|
| `Accueil.aspx` | DeptHero, QuickLinks, NewsList, DocumentsList, EventsCalendar, TeamDirectory |
| `Documents.aspx` | DocumentsList (vue étendue) |
| `Equipe.aspx` | TeamDirectory (vue étendue) |

---

## 3. Le concept de `Scope` — traduction SharePoint

La maquette repose sur un discriminant `Scope = 'global' | DepartementSlug`
qui filtre toutes les données. En SharePoint, **deux stratégies coexistent** :

### Stratégie A — Listes locales par site (retenue par défaut)

Chaque site département possède ses propres listes `Actualites`, `Documents`,
`Evenements`, etc. Le `scope` est **implicite** : c'est le site lui-même.

- Sécurité naturelle, pas de filtrage applicatif
- Limite des 5 000 éléments répartie
- Le web part lit `this.context.pageContext.web.absoluteUrl`

### Stratégie B — Listes centralisées sur le hub (pour le contenu transverse)

Les listes `Departements`, `Collaborateurs`, `Annonces`, `Projets`,
`CollaborateurDuMois`, `Missions`, `Indicateurs`, `Histoire` vivent
**uniquement sur le hub**, avec une colonne `Scope` de type `Choice`.

- Une seule source pour l'annuaire et l'organigramme
- Les web parts des sites départements interrogent le hub par API
- Nécessite un accès en lecture du hub pour tous

### Règle de décision

| Type de contenu | Stratégie | Justification |
|---|---|---|
| Actualités | A — locale | Volume élevé, rédaction décentralisée |
| Documents | A — locale | Sécurité et versioning par département |
| Événements | A — locale | Agenda propre à chaque équipe |
| Liens rapides | A — locale | Outils métier spécifiques |
| Collaborateurs | B — hub | Annuaire unique, organigramme global |
| Départements | B — hub | Référentiel de navigation |
| Annonces | B — hub | Diffusion à toute l'entreprise |
| Projets | B — hub | Vue transverse direction |
| Galerie | B — hub | Album d'entreprise |
| Collaborateur du mois | B — hub | Une seule valeur active |
| Missions / Indicateurs | B — hub | Contenu institutionnel |
| Histoire | B — hub | Contenu institutionnel |
| Bordereau de prix | B — hub | Outil commercial partagé |

---

## 4. Architecture technique de la solution SPFx

```
ika-intranet.sppkg  (1 package, déployé globalement)
│
├── Web Parts (18)
│   ├── Hub uniquement (12)
│   └── Départements (6)
│
├── Extension Application Customizer (1)
│   └── IkaChrome — header + footer sur tous les sites
│
└── Ressources partagées
    ├── services/  — couche d'accès aux données
    ├── models/    — interfaces (portées de types/intranet.ts)
    └── styles/    — Tailwind compilé
```

### Déploiement

Le package est déployé **globalement** (`skipFeatureDeployment: true`) dans
l'App Catalog du tenant : toutes les web parts et l'extension sont disponibles
sur les 5 sites sans installation individuelle.

---

## 5. Couche d'accès aux données

La maquette utilise `lib/data.ts` comme unique point d'accès. On conserve
exactement ce contrat, mais l'implémentation interroge SharePoint.

```
Composant React  ←── props sérialisables ──  Web Part (.ts)
                                                   │
                                                   ▼
                                          services/DataService.ts
                                                   │
                                     ┌─────────────┴─────────────┐
                                     ▼                           ▼
                              PnPjs / SPHttpClient        Cache session
                                     │
                                     ▼
                            Listes SharePoint
```

### Règle d'or conservée

> Les composants React reçoivent leurs données **par props sérialisables**
> et n'appellent **jamais** le service directement.

C'est déjà la règle dans `AGENTS.md` §4. Elle reste valable : le web part
(`.ts`) appelle le service, gère le chargement et injecte les props dans le
composant (`.tsx`). Cela permet de tester les composants isolément et de
conserver la compatibilité avec la maquette.

---

## 6. Thème et identité visuelle

| Token maquette | Valeur | Usage SharePoint |
|---|---|---|
| `--color-brand-navy` | `#0A2540` | `themePrimary` |
| `--color-brand-navy-light` | `#173B66` | `themeDarkAlt` |
| `--color-brand-navy-dark` | `#061A33` | `themeDarker` |
| `--color-brand-cyan` | `#06B6D4` | `accent` |
| `--color-brand-cyan-dark` | `#0891B2` | `themeSecondary` |
| `--color-brand-ink` | `#0F172A` | `neutralPrimary` |
| `--color-brand-muted` | `#475569` | `neutralSecondary` |
| `--color-brand-surface` | `#F1F5F9` | `neutralLighter` |

Le thème SharePoint (`provisioning/theme/`) habille le chrome natif
(barre de suite, en-tête de site). Tailwind habille l'intérieur des web parts.
Les deux partagent la même palette pour une cohérence parfaite.

---

## 7. Contraintes de plateforme à intégrer dès la conception

| Contrainte | Valeur | Impact |
|---|---|---|
| List View Threshold | 5 000 éléments | Indexer les colonnes de filtre |
| Colonnes indexées | 20 max par liste | Prioriser `Scope`, `Date`, `Categorie` |
| Taille bundle web part | ~1 Mo conseillé | Externaliser `recharts` |
| Requêtes REST | 2 000/min/user | Mettre en cache côté session |
| Champ `Title` | Obligatoire, non supprimable | Le réutiliser plutôt que créer un doublon |
| Nom interne de colonne | Figé à la création | Créer en anglais sans accent, puis renommer |
| Profondeur de dossier | 400 caractères d'URL | Éviter les arborescences profondes |

### Le piège du nom interne

Créer une colonne nommée « Catégorie » en français produit un nom interne
`Cat_x00e9_gorie`, illisible et pénible en code. **Toujours** créer la colonne
avec un nom interne anglais (`Category`) puis modifier son nom d'affichage
en français. Les scripts de provisioning fournis appliquent cette règle via
l'attribut `internalName`.
