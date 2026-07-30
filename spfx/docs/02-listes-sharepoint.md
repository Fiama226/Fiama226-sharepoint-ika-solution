# 02 — Listes SharePoint : schémas détaillés

> **Document à valider par le métier avant tout développement.**
> Chaque liste est dérivée d'une interface de `types/intranet.ts` ou des
> données inline des pages `organigramme`, `histoire`, `Bordereaudesprix`.

## Conventions appliquées

| Règle | Détail |
|---|---|
| Nom interne | **Anglais, sans accent ni espace**, figé à la création |
| Nom d'affichage | Français, modifiable à volonté |
| Colonne `Title` | Toujours réutilisée, jamais dupliquée — renommée si besoin |
| Indexation | Uniquement les colonnes de filtre/tri (20 max par liste) |
| Versioning | Activé sur toutes les listes de contenu éditorial |
| Approbation | Activée sur `Actualites` et `Annonces` |

### Le piège du nom interne — rappel

Créer une colonne « Catégorie » via l'interface produit le nom interne
`Cat_x00e9_gorie`. Tous les scripts fournis imposent `internalName` en anglais.
En code on écrira `item.Category`, jamais `item.Cat_x00e9_gorie`.

### Types de colonnes utilisés

| Type SharePoint | Usage | Équivalent TypeScript |
|---|---|---|
| `Text` | Texte court (255 car. max) | `string` |
| `Note` | Texte long / multi-lignes | `string` |
| `Number` | Nombre | `number` |
| `Boolean` | Oui/Non | `boolean` |
| `DateTime` | Date ou date+heure | `string` (ISO) |
| `Choice` | Liste de valeurs fixes | union de littéraux |
| `Lookup` | Référence à une autre liste | `{ Id, Title }` |
| `User` | Personne du répertoire M365 | `{ Id, Title, EMail }` |
| `URL` | Lien hypertexte ou image | `{ Url, Description }` |
| `Image` | Image moderne (JSON) | `{ serverUrl, serverRelativeUrl }` |
| `Currency` | Montant monétaire | `number` |

---

# PARTIE A — Listes locales (répliquées sur chaque site département)

Ces 4 listes sont créées **à l'identique sur les 5 sites**. Le `scope` est
implicite : c'est le site qui porte la donnée. Aucune colonne `Scope` n'est
donc nécessaire.

---

## A1. `Actualites` — Actualités

Source : `data/news.ts` → interface `News` + `HomeNewsItem`

- **Nom interne de liste** : `Actualites`
- **URL** : `Lists/Actualites`
- **Template** : 100 (Liste générique)
- **Versioning** : activé, 50 versions majeures
- **Approbation de contenu** : **activée**

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Titre | `Title` | Text | Oui | Oui | Titre de l'actualité (255 car.) |
| Résumé | `Excerpt` | Note | Oui | Non | 3 lignes, texte brut. Affiché en carte |
| Contenu | `Body` | Note | Non | Non | Texte enrichi (HTML). Page de détail |
| Catégorie | `Category` | Choice | Oui | Oui | voir valeurs ci-dessous |
| Auteur | `NewsAuthor` | User | Oui | Non | Personne unique |
| Date de publication | `PublishDate` | DateTime | Oui | Oui | Date seule, tri décroissant |
| Image | `HeaderImage` | Image | Non | Non | Bannière 16:9, 1200×675 recommandé |
| À la une | `Highlighted` | Boolean | Non | Oui | Défaut `Non`. Remonte l'item en tête |
| Lien externe | `ExternalLink` | URL | Non | Non | Si l'actu pointe hors intranet |
| Ordre d'affichage | `SortOrder` | Number | Non | Non | Défaut 100. Tri manuel si besoin |

**Valeurs de `Category`** (dérivées du type `NewsCategory`) :
`Entreprise` · `RH` · `Projet` · `Finance` · `Administration` · `Commercial` ·
`Technique` · `Événement` · `DevOps` · `Formation` · `Cybersécurité` · `Innovation`

> `NewsAuthor` et non `Author` : `Author` est un champ système SharePoint
> (créateur de l'élément) et ne peut pas être redéfini.

**Vues à créer**

| Vue | Filtre | Tri | Colonnes |
|---|---|---|---|
| `Toutes` (défaut) | — | `PublishDate` desc | Titre, Catégorie, Auteur, Date |
| `A la une` | `Highlighted = Oui` | `PublishDate` desc | Titre, Image, Date |
| `Par categorie` | — | groupé par `Category` | Titre, Date |

---

## A2. `Documents` — Bibliothèque documentaire

Source : `data/documents.ts` → interface `DocumentItem`

- **Nom interne** : `Documents`
- **Template** : 101 (Bibliothèque de documents)
- **Versioning** : majeures + mineures, 100/10
- **Extraction obligatoire** : non

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Nom | `FileLeafRef` | Système | Oui | Oui | Nom du fichier |
| Titre | `Title` | Text | Non | Non | Libellé lisible si ≠ nom de fichier |
| Catégorie documentaire | `DocCategory` | Choice | Oui | Oui | voir ci-dessous |
| Description | `DocDescription` | Note | Non | Non | Aide à la recherche |
| Confidentialité | `Confidentiality` | Choice | Oui | Oui | `Public` · `Interne` · `Confidentiel` |
| Date d'expiration | `ExpiryDate` | DateTime | Non | Oui | Déclenche une alerte de revue |
| Propriétaire | `DocOwner` | User | Oui | Non | Responsable du document |
| Épinglé | `IsPinned` | Boolean | Non | Oui | Défaut `Non`. Documents mis en avant |
| Version métier | `BusinessVersion` | Text | Non | Non | Ex. « v2.1 » — distinct du versioning SP |

**Valeurs de `DocCategory`** :
`Procédure` · `Modèle` · `Contrat` · `Rapport` · `Facture` · `Politique` ·
`Guide` · `Présentation` · `Formulaire` · `Autre`

> Les champs `type`, `modifiedAt`, `modifiedBy`, `size` de la maquette sont
> **natifs** en SharePoint : `File_x0020_Type`, `Modified`, `Editor`,
> `File_x0020_Size`. Ne pas les recréer.

**Vues**

| Vue | Filtre | Tri |
|---|---|---|
| `Tous les documents` | — | `Modified` desc |
| `Epingles` | `IsPinned = Oui` | `Modified` desc |
| `A revoir` | `ExpiryDate <= [Aujourdhui]+30` | `ExpiryDate` asc |

---

## A3. `Evenements` — Événements et échéances

Source : `data/events.ts` → interface `EventItem` + `HomeEvent`

- **Nom interne** : `Evenements`
- **Template** : 106 (Calendrier) — permet la vue calendrier native

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Titre | `Title` | Text | Oui | Oui | Intitulé de l'événement |
| Date de début | `EventDate` | DateTime | Oui | Oui | Champ natif calendrier |
| Date de fin | `EndDate` | DateTime | Oui | Non | Champ natif calendrier |
| Journée entière | `fAllDayEvent` | Boolean | Non | Non | Champ natif |
| Lieu | `Location` | Text | Non | Non | Salle, ville ou « En ligne (Teams) » |
| Catégorie | `EventCategory` | Choice | Oui | Oui | voir ci-dessous |
| Description | `EventDescription` | Note | Non | Non | Détail et ordre du jour |
| Image | `EventImage` | Image | Non | Non | Vignette 80×80 pour la liste home |
| Lien d'inscription | `RegistrationLink` | URL | Non | Non | Formulaire ou lien Teams |
| Organisateur | `Organizer` | User | Non | Non | Contact référent |
| Obligatoire | `IsMandatory` | Boolean | Non | Non | Défaut `Non` |

**Valeurs de `EventCategory`** :
`Entreprise` · `Formation` · `Réunion` · `Échéance` · `Événement` ·
`Astreinte` · `Maintenance` · `Stratégie` · `Tech` · `Innovation` · `SecOps`

> Le template 106 fournit nativement `EventDate`, `EndDate`, `Location`,
> `fAllDayEvent` et `Recurrence`. Ne pas les recréer.

---

## A4. `LiensRapides` — Liens rapides

Source : `data/quick-links.ts` → interface `QuickLink` + `HomeQuickAccess`

- **Nom interne** : `LiensRapides`
- **Template** : 100

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Libellé | `Title` | Text | Oui | Non | Texte du lien |
| Lien | `LinkUrl` | URL | Oui | Non | Interne ou externe |
| Description | `LinkDescription` | Text | Non | Non | Sous-titre de la carte |
| Icône | `IconName` | Text | Oui | Non | Nom d'icône Lucide, ex. `Calendar` |
| Ordre | `SortOrder` | Number | Oui | Oui | Croissant. Pas de 10 en 10 |
| Ouvrir dans un nouvel onglet | `OpenInNewTab` | Boolean | Non | Non | Défaut `Non` |
| Groupe | `LinkGroup` | Choice | Non | Oui | `Outils` · `RH` · `Métier` · `Support` |
| Actif | `IsActive` | Boolean | Oui | Oui | Défaut `Oui`. Désactiver sans supprimer |

> **`IconName`** : la maquette utilise `lucide-react`. Conserver exactement les
> mêmes noms (`Calendar`, `Users`, `Globe`, `Clock`, `Heart`, `Headphones`,
> `Database`, `FileText`, `Settings`, `Scale`, `Plane`, `Code2`, `Layers`,
> `FileEdit`, `GitBranch`, `CreditCard`, `ShieldCheck`). Le composant
> `lib/lucide-icon.tsx` fait déjà la résolution dynamique nom → composant.

---

# PARTIE B — Listes centralisées sur le hub

Ces listes existent **uniquement sur `/sites/ika-intranet`**. Les web parts
des sites départements les interrogent à distance. Elles portent une colonne
`Scope` quand le contenu est filtrable par département.

---

## B1. `Departements` — Référentiel des départements

Source : `data/departements.ts` → interface `Departement`

- **Nom interne** : `Departements`
- **Template** : 100
- **Volume** : 4 éléments. Référentiel de navigation.

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Nom | `Title` | Text | Oui | Oui | Ex. « Comptabilité » |
| Identifiant | `Slug` | Text | Oui | Oui | **Unique**. `comptabilite`, `administration`, `commerciaux`, `techniciens` |
| Accroche | `Tagline` | Text | Oui | Non | Ex. « Pilotage financier & reporting » |
| Description | `DeptDescription` | Note | Oui | Non | Paragraphe de présentation |
| Titre hero | `HeroTitle` | Text | Oui | Non | Ex. « Espace Comptabilité » |
| Sous-titre hero | `HeroSubtitle` | Note | Oui | Non | Phrase d'accroche de la bannière |
| Couleur d'accent | `Accent` | Choice | Oui | Non | `navy` · `cyan` |
| Icône | `IconName` | Text | Oui | Non | `finance`, `admin`, `sales`, `tech` |
| URL du site | `SiteUrl` | URL | Oui | Non | Lien vers le site SharePoint du dept |
| Classes d'accent | `AccentClasses` | Text | Non | Non | Chaîne Tailwind de `HomeDepartmentCard` |
| Classe de badge | `BadgeClasses` | Text | Non | Non | Idem, pour le badge |
| Nombre de membres | `MemberCount` | Number | Non | Non | Calculé ou saisi |
| Ordre | `SortOrder` | Number | Oui | Oui | Ordre dans la navigation |

> `Slug` doit avoir **`enforceUnique = true`**. C'est la clé de jointure avec
> le type `DepartementSlug` du code.

---

## B2. `Collaborateurs` — Annuaire

Source : `data/team.ts` (`TeamMember`) + `HomeCollaborator` + `organigramme`

- **Nom interne** : `Collaborateurs`
- **Template** : 100
- **Volume estimé** : 138 éléments

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Nom complet | `Title` | Text | Oui | Oui | Ex. « YAYA Ouattara » |
| Compte M365 | `UserAccount` | User | Non | Oui | Lien vers Entra ID. Permet la carte de contact |
| Fonction | `JobTitle` | Text | Oui | Non | Ex. « Directeur Général » |
| Département | `Department` | Lookup → `Departements.Title` | Oui | Oui | Relation |
| Email | `Email` | Text | Oui | Non | Format email |
| Téléphone | `Phone` | Text | Non | Non | Ex. « +226 70 70 70 70 » |
| Localisation | `OfficeLocation` | Text | Non | Non | Ex. « Ouagadougou, Burkina Faso » |
| Date de naissance | `Birthdate` | DateTime | Non | Oui | Alimente les anniversaires |
| Photo | `Photo` | Image | Non | Non | Portrait carré 400×400 |
| Responsable | `Manager` | Lookup → `Collaborateurs.Title` | Non | Oui | **Auto-référence** → organigramme |
| Niveau hiérarchique | `HierarchyLevel` | Number | Oui | Oui | `0`=DG, `1`=directeur, `2`=manager, `3`=collaborateur |
| Direction | `Division` | Choice | Oui | Oui | voir ci-dessous |
| LinkedIn | `LinkedInUrl` | URL | Non | Non | Profil public |
| Date d'entrée | `HireDate` | DateTime | Non | Non | Ancienneté |
| Actif | `IsActive` | Boolean | Oui | Oui | Défaut `Oui`. Ne jamais supprimer un départ |
| Ordre | `SortOrder` | Number | Non | Non | Ordre dans l'organigramme |

**Valeurs de `Division`** :
`Direction Générale` · `Engineering` · `Ventes & Marketing` · `Comptabilité` ·
`Administration` · `Support Technique`

> **`Manager` en auto-lookup** est ce qui rend l'organigramme dynamique.
> La page `app/organigramme/page.tsx` contient aujourd'hui l'arbre en dur ;
> le web part le reconstruira par récursion sur `Manager`.
>
> **Attention** : SharePoint limite à **12 colonnes Lookup** par vue. Ici on en
> a 2, aucun risque.

---

## B3. `Annonces` — Annonces internes

Source : `HomeAnnouncement` → `components/intranet/announcement-marquee.tsx`

- **Nom interne** : `Annonces`
- **Template** : 100
- **Approbation** : **activée** (contenu personnel)

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Titre | `Title` | Text | Oui | Non | Ex. « Mariage de Koffi et Aïcha » |
| Type | `AnnouncementType` | Choice | Oui | Oui | `Mariage` · `Anniversaire` · `Naissance` · `Événement` · `Départ` · `Arrivée` · `Promotion` |
| Détail | `Detail` | Note | Oui | Non | Message d'accompagnement |
| Emoji | `Emoji` | Text | Non | Non | Ex. `💍`. Fallback par type si vide |
| Date de l'événement | `AnnouncementDate` | DateTime | Oui | Oui | Date affichée |
| Date de fin d'affichage | `DisplayUntil` | DateTime | Oui | Oui | **Retrait automatique du bandeau** |
| Personne concernée | `RelatedPerson` | Lookup → `Collaborateurs.Title` | Non | Non | Lien vers l'annuaire |
| Priorité | `Priority` | Choice | Non | Oui | `Normale` · `Haute`. Défaut `Normale` |

> `DisplayUntil` évite le bandeau qui affiche encore un anniversaire de 2024.
> Le web part filtre sur `DisplayUntil >= [Aujourdhui]`.

---

## B4. `Projets` — Suivi de projets

Source : `HomeProject` → `components/intranet/last_home_page section.tsx`

- **Nom interne** : `Projets`
- **Template** : 100

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Nom du projet | `Title` | Text | Oui | Oui | Ex. « Migration Microservices » |
| Équipe responsable | `ProjectLead` | Text | Oui | Non | Ex. « Cloud Team » |
| Chef de projet | `ProjectManager` | User | Non | Non | Personne nommée |
| Avancement | `Progress` | Number | Oui | Non | 0 à 100. **Min 0 / Max 100** |
| Statut | `ProjectStatus` | Choice | Oui | Oui | `À l'heure` · `À risque` · `En retard` · `Terminé` |
| Échéance | `DueDate` | DateTime | Oui | Oui | Date de livraison cible |
| Tâches terminées | `TasksDone` | Number | Oui | Non | Entier ≥ 0 |
| Tâches totales | `TasksTotal` | Number | Oui | Non | Entier ≥ 1 |
| Département | `Department` | Lookup → `Departements.Title` | Non | Oui | Rattachement |
| Visible sur l'accueil | `ShowOnHome` | Boolean | Oui | Oui | Défaut `Oui` |
| Ordre | `SortOrder` | Number | Non | Non | Tri manuel |

> Mapping des statuts : `on-track` → `À l'heure`, `at-risk` → `À risque`,
> `delayed` → `En retard`. Le service fait la conversion pour conserver le
> type `HomeProjectStatus` côté composant.

---

## B5. `Galerie` — Photothèque

Source : `HomeGalleryImage` → `before_last_home_page_section.tsx`

- **Nom interne** : `Galerie`
- **Template** : **109 (Bibliothèque d'images)** — génère les miniatures

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Nom | `FileLeafRef` | Système | Oui | Oui | Nom du fichier image |
| Légende | `Caption` | Text | Oui | Non | Ex. « All Hands Tech — Q2 2026 » |
| Catégorie | `GalleryCategory` | Choice | Oui | Oui | `Événements` · `Formation` · `Projets` · `Équipe` · `Bureaux` |
| Date de prise de vue | `PhotoDate` | DateTime | Non | Oui | Tri chronologique |
| Mise en avant | `IsFeatured` | Boolean | Non | Oui | Défaut `Non` |
| Ordre | `SortOrder` | Number | Non | Non | Tri manuel |
| Texte alternatif | `AltText` | Text | Oui | Non | **Accessibilité RGAA** |

> Bibliothèque d'images et non liste : SharePoint génère automatiquement les
> miniatures (`/_layouts/15/getpreview.ashx`), ce qui allège fortement la home.

---

## B6. `CollaborateurDuMois`

Source : `HomeEmployeeOfMonth`

- **Nom interne** : `CollaborateurDuMois`
- **Template** : 100
- **Volume** : 1 élément actif à la fois, historisé

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Mois | `Title` | Text | Oui | Oui | Ex. « Juin 2026 » |
| Collaborateur | `Employee` | Lookup → `Collaborateurs.Title` | Oui | Oui | Référence annuaire |
| Fonction affichée | `DisplayRole` | Text | Oui | Non | Ex. « Lead Software Engineer » |
| Département | `Department` | Lookup → `Departements.Title` | Oui | Non | — |
| Citation | `Quote` | Note | Oui | Non | Texte de la nomination |
| Nommé par | `NominatedBy` | Text | Oui | Non | Ex. « YAYA Ouattara, Directeur Général » |
| Photo | `Photo` | Image | Non | Non | Sinon on reprend celle de l'annuaire |
| Période de début | `PeriodStart` | DateTime | Oui | Oui | 1er du mois |
| Actif | `IsCurrent` | Boolean | Oui | Oui | **Un seul `Oui`** — géré par flux Power Automate |

---

## B7. `HeroSlides` — Carrousel d'accueil

Source : `HomeHeroSlide` → `components/intranet/hero-slider.tsx`

- **Nom interne** : `HeroSlides`
- **Template** : **101 (Bibliothèque)** — l'image est le contenu principal

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Nom | `FileLeafRef` | Système | Oui | Non | Fichier image 1920×1080 |
| Légende | `Caption` | Text | Oui | Non | Ex. « Construire le digital de demain » |
| Sous-titre | `SubCaption` | Text | Oui | Non | Ex. « Innovation · Agilité · Excellence » |
| Lien | `SlideLink` | URL | Non | Non | CTA optionnel |
| Texte du bouton | `CtaLabel` | Text | Non | Non | Ex. « En savoir plus » |
| Ordre | `SortOrder` | Number | Oui | Oui | Ordre du carrousel |
| Actif | `IsActive` | Boolean | Oui | Oui | Défaut `Oui` |
| Date de début | `StartDate` | DateTime | Non | Non | Programmation |
| Date de fin | `EndDate` | DateTime | Non | Non | Programmation |
| Texte alternatif | `AltText` | Text | Oui | Non | Accessibilité |

---

## B8. `Missions` — Mission, vision, valeurs

Source : `HomeMission` + `values` de `app/histoire/page.tsx`

- **Nom interne** : `Missions`
- **Template** : 100

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Titre | `Title` | Text | Oui | Non | Ex. « Accélérer la transformation digitale » |
| Étiquette | `Tag` | Text | Oui | Non | Ex. « Notre Mission » |
| Texte | `MissionText` | Note | Oui | Non | Paragraphe |
| Icône | `IconName` | Text | Oui | Non | Emoji (`🚀`) ou nom Lucide (`Code2`) |
| Type | `MissionType` | Choice | Oui | Oui | `Mission` · `Vision` · `Valeur` |
| Couleur | `ColorClass` | Text | Non | Non | Classe Tailwind, ex. `text-blue-600` |
| Fond | `BgClass` | Text | Non | Non | Ex. `bg-blue-50` |
| Ordre | `SortOrder` | Oui | Oui | Number | Ordre d'affichage |

---

## B9. `Indicateurs` — KPI d'entreprise

Source : `HomeHeroStat` + `globalStats` de `app/histoire/page.tsx`

- **Nom interne** : `Indicateurs`
- **Template** : 100

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Libellé | `Title` | Text | Oui | Non | Ex. « Projets actifs » |
| Valeur | `StatValue` | Text | Oui | Non | **Text et non Number** : accepte « 200+ », « 98% » |
| Icône | `IconName` | Text | Oui | Non | Emoji ou nom Lucide |
| Emplacement | `Placement` | Choice | Oui | Oui | `Hero accueil` · `Page histoire` · `Les deux` |
| Ordre | `SortOrder` | Number | Oui | Oui | — |
| Actif | `IsActive` | Boolean | Oui | Oui | Défaut `Oui` |

> `StatValue` en `Text` est un choix délibéré : la maquette affiche `200+`,
> `98%`, `24`. Un champ `Number` casserait ces formats.

---

## B10. `Histoire` — Jalons chronologiques

Source : `milestones` de `app/histoire/page.tsx`

- **Nom interne** : `Histoire`
- **Template** : 100

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Titre du jalon | `Title` | Text | Oui | Non | Ex. « La genèse » |
| Année | `Year` | Text | Oui | Oui | Ex. « 2015 ». Text pour « 2015-2016 » |
| Trimestre | `Quarter` | Choice | Non | Non | `T1` · `T2` · `T3` · `T4` |
| Description | `MilestoneDescription` | Note | Oui | Non | Récit du jalon |
| Image | `MilestoneImage` | Image | Non | Non | Illustration 800×450 |
| Icône | `IconName` | Text | Oui | Non | Nom Lucide, ex. `Rocket`, `Award` |
| Étiquette | `Tag` | Text | Oui | Non | Ex. « Fondation », « Milestone » |
| Couleur d'étiquette | `TagColorClass` | Text | Non | Non | Ex. `bg-violet-100 text-violet-700` |
| Côté d'affichage | `Side` | Choice | Oui | Non | `left` · `right`. Timeline alternée |
| Statistique 1 — libellé | `Stat1Label` | Text | Non | Non | Ex. « Fondateurs » |
| Statistique 1 — valeur | `Stat1Value` | Text | Non | Non | Ex. « 3 » |
| Statistique 2 — libellé | `Stat2Label` | Text | Non | Non | Ex. « Projets » |
| Statistique 2 — valeur | `Stat2Value` | Text | Non | Non | Ex. « 1 » |
| Ordre | `SortOrder` | Number | Oui | Oui | Chronologique |

> Les 2 statistiques sont **aplaties** en 4 colonnes plutôt que modélisées dans
> une liste enfant : le volume est fixe (2 max) et cela évite une jointure
> coûteuse pour un gain nul.

---

## B11. `Organigramme` — Directions

Source : `directions` de `app/organigramme/page.tsx`

- **Nom interne** : `Organigramme`
- **Template** : 100
- **Rôle** : porte le **style** des blocs. Les personnes viennent de `Collaborateurs`.

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Nom de la direction | `Title` | Text | Oui | Oui | Ex. « Direction Générale » |
| Icône | `IconName` | Text | Oui | Non | Nom Lucide, ex. `Building2` |
| Classe de couleur | `ColorClass` | Text | Non | Non | Ex. `text-violet-700` |
| Classe de fond | `BgColorClass` | Text | Non | Non | Ex. `bg-violet-50` |
| Classe de bordure | `BorderColorClass` | Text | Non | Non | Ex. `border-violet-200` |
| Dégradé — début | `GradientFrom` | Text | Non | Non | Ex. `from-violet-500` |
| Dégradé — fin | `GradientTo` | Text | Non | Non | Ex. `to-purple-600` |
| Département lié | `Department` | Lookup → `Departements.Title` | Non | Oui | — |
| Ordre | `SortOrder` | Number | Oui | Oui | — |

---

## B12. `BordereauPrix` — En-têtes de bordereaux

Source : `app/Bordereaudesprix/page.tsx`

- **Nom interne** : `BordereauPrix`
- **Template** : 100

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Référence | `Title` | Text | Oui | Oui | Ex. « BP-2026-001 ». **Unique** |
| Client | `ClientName` | Text | Oui | Oui | Nom du client |
| Objet | `Subject` | Note | Oui | Non | Objet de la consultation |
| Date d'émission | `IssueDate` | DateTime | Oui | Oui | — |
| Date de validité | `ValidUntil` | DateTime | Non | Non | — |
| Statut | `QuoteStatus` | Choice | Oui | Oui | `Brouillon` · `Envoyé` · `Accepté` · `Refusé` · `Expiré` |
| Montant du marché | `SubmissionAmount` | Currency | Non | Non | Montant de soumission |
| Total HT | `TotalHT` | Currency | Non | Non | **Calculé** par le web part |
| Taux de TVA | `VatRate` | Number | Oui | Non | Défaut `18`. Pourcentage |
| Montant TVA | `VatAmount` | Currency | Non | Non | Calculé |
| Total TTC | `TotalTTC` | Currency | Non | Non | Calculé |
| Devise | `Currency` | Choice | Oui | Non | `XOF` · `EUR` · `USD`. Défaut `XOF` |
| Commercial | `SalesRep` | User | Oui | Non | — |

> Le taux de 18 % correspond à la TVA en vigueur au Burkina Faso, cohérent avec
> le code existant (`totalHT * 0.18`). Le rendre paramétrable évite un
> redéploiement en cas de changement de taux ou de client étranger.

---

## B13. `BordereauLignes` — Lignes de bordereau

- **Nom interne** : `BordereauLignes`
- **Template** : 100
- **Relation** : enfant de `BordereauPrix`

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| N° d'article | `Title` | Text | Oui | Non | Ex. « 1 », « 2 » |
| Bordereau | `Quote` | Lookup → `BordereauPrix.Title` | Oui | Oui | **Suppression en cascade** |
| Désignation | `LineDescription` | Note | Oui | Non | Ex. « Mise en place de la redondance des pare-feu » |
| Délai de livraison | `DeliveryDate` | Text | Non | Non | Ex. « 90 jours ». Text car format libre |
| Quantité | `Quantity` | Number | Oui | Non | Min 0, défaut 1 |
| Prix unitaire | `UnitPrice` | Currency | Oui | Non | Min 0, défaut 0 |
| Montant | `LineTotal` | Calculated | Non | Non | `=Quantity*UnitPrice` |
| Ordre | `SortOrder` | Number | Oui | Oui | Ordre des lignes |

> Sur le Lookup `Quote`, activer **« Supprimer en cascade »** : supprimer un
> bordereau supprime ses lignes. Sans cela, on accumule des orphelins.

---

## B14. `ParametresSite` — Configuration

Nouvelle liste — remplace `data/company.ts`

- **Nom interne** : `ParametresSite`
- **Template** : 100
- **Permissions** : lecture pour tous, écriture pour les admins uniquement

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Clé | `Title` | Text | Oui | Oui | **Unique**. Ex. `company.name` |
| Valeur | `SettingValue` | Note | Oui | Non | Valeur, éventuellement JSON |
| Description | `SettingDescription` | Text | Non | Non | À quoi sert ce paramètre |
| Catégorie | `SettingCategory` | Choice | Oui | Oui | `Société` · `Affichage` · `Contact` · `Réseaux sociaux` |

**Clés initiales**

| Clé | Valeur |
|---|---|
| `company.name` | IKA Solution |
| `company.tagline` | Ingénierie informatique & services numériques |
| `company.legalName` | IKA Solution SARL |
| `company.address` | Ouagadougou, Burkina Faso |
| `company.email` | contact@ikasolution.com |
| `company.phone` | +226 70 70 70 70 |
| `company.copyrightYears` | 2024–2026 |
| `social.facebook` | https://facebook.com/... |
| `social.linkedin` | https://linkedin.com/... |
| `social.twitter` | https://twitter.com/... |
| `social.instagram` | https://instagram.com/... |
| `social.whatsapp` | https://wa.me/... |

> Cette liste évite de redéployer le `.sppkg` pour changer un numéro de
> téléphone. Le service la met en cache 30 minutes.

---

## B15. `FAQ` — Questions fréquentes

Source : `components/intranet/faq-list.tsx`

- **Nom interne** : `FAQ`
- **Template** : 100

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Question | `Title` | Note | Oui | Non | La question posée |
| Réponse | `Answer` | Note | Oui | Non | Texte enrichi |
| Catégorie | `FaqCategory` | Choice | Oui | Oui | `RH` · `IT` · `Comptabilité` · `Général` · `Sécurité` |
| Département | `Department` | Lookup → `Departements.Title` | Non | Oui | Si spécifique |
| Ordre | `SortOrder` | Number | Oui | Oui | — |
| Actif | `IsActive` | Boolean | Oui | Oui | Défaut `Oui` |
| Nombre de vues | `ViewCount` | Number | Non | Non | Défaut 0. Popularité |

---

## B16. `DonneesFinancieres` — Séries pour graphiques

Source : `components/intranet/finance-charts.tsx` (recharts)

- **Nom interne** : `DonneesFinancieres`
- **Template** : 100

| Nom affiché | Nom interne | Type | Requis | Indexé | Détail |
|---|---|---|---|---|---|
| Période | `Title` | Text | Oui | Oui | Ex. « Janvier 2026 », « T1 2026 » |
| Type de série | `SeriesType` | Choice | Oui | Oui | `Chiffre d'affaires` · `Charges` · `Résultat` · `Trésorerie` · `Budget` |
| Valeur | `Amount` | Currency | Oui | Non | Montant |
| Année | `FiscalYear` | Number | Oui | Oui | Ex. 2026 |
| Mois | `FiscalMonth` | Number | Non | Oui | 1 à 12 |
| Trimestre | `FiscalQuarter` | Choice | Non | Oui | `T1` · `T2` · `T3` · `T4` |
| Devise | `Currency` | Choice | Oui | Non | `XOF` · `EUR` · `USD`. Défaut `XOF` |
| Ordre | `SortOrder` | Number | Oui | Oui | Ordre chronologique |

> Liste hébergée sur le **site Comptabilité** et non le hub : les données
> financières doivent rester cloisonnées.

---

# PARTIE C — Récapitulatif

## C1. Tableau de synthèse

| # | Liste | Emplacement | Template | Volume estimé | Source maquette |
|---|---|---|---|---|---|
| A1 | `Actualites` | 5 sites | 100 | ~200/site | `data/news.ts` |
| A2 | `Documents` | 5 sites | 101 | ~500/site | `data/documents.ts` |
| A3 | `Evenements` | 5 sites | 106 | ~100/site | `data/events.ts` |
| A4 | `LiensRapides` | 5 sites | 100 | ~15/site | `data/quick-links.ts` |
| B1 | `Departements` | Hub | 100 | 4 | `data/departements.ts` |
| B2 | `Collaborateurs` | Hub | 100 | ~138 | `data/team.ts` + `HomeCollaborator` |
| B3 | `Annonces` | Hub | 100 | ~50/an | `HomeAnnouncement` |
| B4 | `Projets` | Hub | 100 | ~40 | `HomeProject` |
| B5 | `Galerie` | Hub | 109 | ~300 | `HomeGalleryImage` |
| B6 | `CollaborateurDuMois` | Hub | 100 | 12/an | `HomeEmployeeOfMonth` |
| B7 | `HeroSlides` | Hub | 101 | ~5 | `HomeHeroSlide` |
| B8 | `Missions` | Hub | 100 | ~7 | `HomeMission` + `values` |
| B9 | `Indicateurs` | Hub | 100 | ~10 | `HomeHeroStat` + `globalStats` |
| B10 | `Histoire` | Hub | 100 | ~10 | `milestones` |
| B11 | `Organigramme` | Hub | 100 | ~6 | `directions` |
| B12 | `BordereauPrix` | Hub | 100 | ~100/an | `Bordereaudesprix` |
| B13 | `BordereauLignes` | Hub | 100 | ~1000/an | `Bordereaudesprix` |
| B14 | `ParametresSite` | Hub | 100 | ~15 | `data/company.ts` |
| B15 | `FAQ` | Hub | 100 | ~40 | `faq-list.tsx` |
| B16 | `DonneesFinancieres` | Comptabilité | 100 | ~200 | `finance-charts.tsx` |

**Total** : 16 définitions distinctes → **36 listes physiques**
(4 listes locales × 5 sites + 16 listes centralisées).

## C2. Colonnes de site à créer une seule fois

Pour éviter de redéfinir 5 fois les mêmes colonnes, on crée des
**colonnes de site** au niveau du hub, réutilisables partout.

| Colonne de site | Type | Réutilisée dans |
|---|---|---|
| `IkaSortOrder` | Number | 12 listes |
| `IkaIconName` | Text | 6 listes |
| `IkaIsActive` | Boolean | 6 listes |
| `IkaDepartment` | Lookup | 5 listes |
| `IkaAltText` | Text | 3 listes |

Groupe de colonnes : **« Colonnes IKA Solution »**.

## C3. Indexation — les 3 règles

1. **Indexer avant les 5 000 éléments**, jamais après : SharePoint refuse de
   créer un index sur une liste qui dépasse déjà le seuil.
2. **N'indexer que ce qui filtre ou trie** : chaque index ralentit l'écriture.
3. **Maximum 20 index par liste** — la limite est stricte.

Colonnes prioritaires : `PublishDate`, `Category`, `Highlighted`, `Scope`,
`IsActive`, `SortOrder`, `Department`, `EventDate`.

## C4. Ce qu'il ne faut PAS créer

| Champ de la maquette | Pourquoi ne pas le créer |
|---|---|
| `id` | `ID` est natif et auto-incrémenté |
| `modifiedAt` | `Modified` est natif |
| `modifiedBy` | `Editor` est natif |
| `size` | `File_x0020_Size` est natif |
| `type` (document) | `File_x0020_Type` est natif |
| `author` (système) | `Author` est natif — d'où `NewsAuthor` |
| `scope` (listes locales) | Implicite : c'est le site |

## C5. Points à valider par le métier

1. **`Confidentiality`** sur `Documents` — faut-il un 4ᵉ niveau « Secret » avec
   chiffrement Purview ?
2. **`Category`** sur `Actualites` — les 12 valeurs proposées conviennent-elles,
   ou faut-il fusionner `DevOps`/`Technique` et `Formation`/`RH` ?
3. **`Birthdate`** sur `Collaborateurs` — la date de naissance complète est une
   donnée personnelle. Un champ jour/mois seul suffit-il pour les anniversaires ?
4. **`VatRate`** — 18 % est-il le seul taux applicable ? Y a-t-il des clients
   exonérés ou hors zone UEMOA ?
5. **Rétention** — combien de temps conserve-t-on les `Annonces` et les
   `BordereauPrix` refusés ?
6. **`HierarchyLevel`** — 4 niveaux suffisent-ils pour l'organigramme cible ?
