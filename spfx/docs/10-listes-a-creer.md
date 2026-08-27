# 10 — Listes SharePoint à créer (référence rapide)

> **Mode d'emploi** : ce fichier liste **toutes les listes/bibliothèques à créer**
> dans SharePoint pour faire fonctionner les Web Parts IKA, avec le **nom interne**
> et le **type de colonne** de chaque champ. C'est la version condensée et
> opérationnelle de [`02-listes-sharepoint.md`](./02-listes-sharepoint.md) (qui
> contient les schémas détaillés, les vues, l'indexation et les valeurs de choix).
>
> 👉 La Web Part **« IKA — Page d'accueil complète »** (`HomePageWebPart`)
> assemble toutes ces sections en une seule page : créez au minimum les listes
> marquées **🏠** (accueil) pour la reconstituer à l'identique du site statique.

---

## 0. Conventions & types de colonnes

| Règle | Détail |
|---|---|
| Nom interne | **Anglais, sans accent ni espace**, figé à la création |
| `Title` | Toujours réutilisé (jamais dupliqué), renommé à l'affichage si besoin |
| Indexation | Uniquement les colonnes de filtre/tri (20 max par liste) |

| Type SharePoint | Abréviation ci-dessous | Équivalent TypeScript |
|---|---|---|
| `Text` | Texte | `string` (≤ 255 car.) |
| `Note` | Note | `string` (multi-lignes / HTML) |
| `Number` | Nombre | `number` |
| `Currency` | Monétaire | `number` |
| `Boolean` | Oui/Non | `boolean` |
| `DateTime` | Date | `string` (ISO) |
| `Choice` | Choix | union de littéraux |
| `Lookup` | Recherche | `{ Id, Title }` |
| `User` | Personne | `{ Id, Title, EMail }` |
| `URL` | Lien | `{ Url, Description }` |
| `Image` | Image | `{ serverUrl, serverRelativeUrl }` |

Légende « Requis » : **Oui** = obligatoire · **Non** = facultatif.

---

## PARTIE A — Listes locales (à créer sur **chaque** site département)

### A1. `Actualites` 🏠 — Actualités · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Résumé | `Excerpt` | Note | Oui |
| Contenu | `Body` | Note | Non |
| Catégorie | `Category` | Choix | Oui |
| Auteur | `NewsAuthor` | Personne | Oui |
| Date de publication | `PublishDate` | Date | Oui |
| Image | `HeaderImage` | Image | Non |
| À la une | `Highlighted` | Oui/Non | Non |
| Lien externe | `ExternalLink` | Lien | Non |
| Ordre | `SortOrder` | Nombre | Non |

Choix `Category` : `Entreprise` · `RH` · `Projet` · `Finance` · `Administration` ·
`Commercial` · `Technique` · `Événement` · `DevOps` · `Formation` · `Cybersécurité` · `Innovation`

### A1bis. `Commentaires` — Commentaires sur les actualités · *Liste (100)*

Versioning **désactivé**, approbation de contenu **désactivée** (inverse
d'`Actualites` : un commentaire doit être visible immédiatement).

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui (rempli par le code, jamais saisi) |
| Actualité | `NewsItem` | Recherche → `Actualites` | Oui |
| Commentaire | `CommentText` | Note | Oui |

Auteur/date = champs système `Author`/`Created`, pas de colonne à créer.

### A2. `Documents` 🏠 — Bibliothèque documentaire · *Bibliothèque (101)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Nom | `FileLeafRef` | Système | Oui |
| Titre | `Title` | Texte | Non |
| Catégorie | `DocCategory` | Choix | Oui |
| Description | `DocDescription` | Note | Non |
| Confidentialité | `Confidentiality` | Choix | Oui |
| Date d'expiration | `ExpiryDate` | Date | Non |
| Propriétaire | `DocOwner` | Personne | Oui |
| Épinglé | `IsPinned` | Oui/Non | Non |
| Version métier | `BusinessVersion` | Texte | Non |

Choix `DocCategory` : `Procédure` · `Modèle` · `Contrat` · `Rapport` · `Facture` ·
`Politique` · `Guide` · `Présentation` · `Formulaire` · `Autre`
Choix `Confidentiality` : `Public` · `Interne` · `Confidentiel`
*(Répliquer cette bibliothèque sous les noms `Documents_Comptabilite`,
`Documents_Administration`, `Documents_Commerciaux`, `Documents_Techniciens` sur
les sous-sites.)*

### A3. `Evenements` 🏠 — Événements · *Liste calendrier*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Début | `EventDate` | Date | Oui |
| Fin | `EndDate` | Date | Oui |
| Journée entière | `fAllDayEvent` | Oui/Non | Non |
| Lieu | `Location` | Texte | Non |
| Catégorie | `EventCategory` | Choix | Non |
| Description | `EventDescription` | Note | Non |
| Image | `EventImage` | Image | Non |
| Inscription | `RegistrationLink` | Lien | Non |
| Organisateur | `Organizer` | Personne | Non |
| Obligatoire | `IsMandatory` | Oui/Non | Non |

### A4. `LiensRapides` 🏠 — Liens rapides · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| URL | `LinkUrl` | Lien | Oui |
| Description | `LinkDescription` | Texte | Non |
| Icône | `IconName` | Texte | Oui |
| Ordre | `SortOrder` | Nombre | Oui |
| Nouvel onglet | `OpenInNewTab` | Oui/Non | Non |
| Groupe | `LinkGroup` | Texte | Non |
| Actif | `IsActive` | Oui/Non | Oui |

---

## PARTIE B — Listes du hub (créées **une seule fois** sur le hub)

### B1. `Departements` 🏠 — Référentiel des départements · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Slug | `Slug` | Choix | Oui |
| Slogan | `Tagline` | Texte | Non |
| Description | `DeptDescription` | Note | Non |
| Titre hero | `HeroTitle` | Texte | Non |
| Sous-titre hero | `HeroSubtitle` | Texte | Non |
| Accent | `Accent` | Choix | Non |
| Icône | `IconName` | Texte | Non |
| URL du site | `SiteUrl` | Lien | Non |
| Classes accent | `AccentClasses` | Texte | Non |
| Classes badge | `BadgeClasses` | Texte | Non |
| Effectif | `MemberCount` | Nombre | Non |
| Ordre | `SortOrder` | Nombre | Oui |

### B2. `Collaborateurs` 🏠 — Annuaire · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre (nom) | `Title` | Texte | Oui |
| Compte M365 | `UserAccount` | Personne | Non |
| Poste | `JobTitle` | Texte | Oui |
| Département | `Department` | Recherche → `Departements` | Non |
| Email | `Email` | Texte | Oui |
| Téléphone | `Phone` | Texte | Non |
| Bureau | `OfficeLocation` | Texte | Non |
| Anniversaire | `Birthdate` | Date | Non |
| Photo | `Photo` | Image | Non |
| Responsable | `Manager` | Recherche → `Collaborateurs` | Non |
| Niveau hiérarchique | `HierarchyLevel` | Nombre | Oui |
| Division | `Division` | Choix | Oui |
| LinkedIn | `LinkedInUrl` | Lien | Non |
| Date d'embauche | `HireDate` | Date | Non |
| Actif | `IsActive` | Oui/Non | Oui |
| Ordre | `SortOrder` | Nombre | Non |

Choix `Division` : `Direction Générale` · `Engineering` · `Ventes & Marketing` ·
`Comptabilité` · `Administration` · `Support Technique`

### B3. `Annonces` 🏠 — Annonces internes · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Type | `AnnouncementType` | Choix | Oui |
| Détail | `Detail` | Note | Oui |
| Emoji | `Emoji` | Texte | Non |
| Date | `AnnouncementDate` | Date | Oui |
| Affiché jusqu'au | `DisplayUntil` | Date | Oui |
| Personne liée | `RelatedPerson` | Recherche → `Collaborateurs` | Non |
| Priorité | `Priority` | Choix | Non |

Choix `AnnouncementType` : `Mariage` · `Anniversaire` · `Naissance` · `Événement` ·
`Départ` · `Arrivée` · `Promotion`

### B4. `Projets` 🏠 — Suivi de projets · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Chef de projet | `ProjectLead` | Texte | Oui |
| Responsable M365 | `ProjectManager` | Personne | Non |
| Avancement | `Progress` | Nombre | Oui |
| Statut | `ProjectStatus` | Choix | Oui |
| Échéance | `DueDate` | Date | Oui |
| Tâches faites | `TasksDone` | Nombre | Non |
| Tâches total | `TasksTotal` | Nombre | Non |
| Département | `Department` | Recherche → `Departements` | Non |
| Afficher accueil | `ShowOnHome` | Oui/Non | Oui |
| Ordre | `SortOrder` | Nombre | Non |

Choix `ProjectStatus` : `À l'heure` · `À risque` · `En retard` · `Terminé`

### B5. `Galerie` 🏠 — Photothèque · *Bibliothèque (101)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Nom | `FileLeafRef` | Système | Oui |
| Titre | `Title` | Texte | Non |
| Légende | `Caption` | Texte | Oui |
| Catégorie | `GalleryCategory` | Choix | Non |
| Date photo | `PhotoDate` | Date | Non |
| À la une | `IsFeatured` | Oui/Non | Non |
| Texte alternatif | `AltText` | Texte | Non |
| Ordre | `SortOrder` | Nombre | Non |

### B6. `CollaborateurDuMois` 🏠 — Employé du mois · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Collaborateur | `Employee` | Recherche → `Collaborateurs` | Oui |
| Rôle affiché | `DisplayRole` | Texte | Oui |
| Département | `Department` | Recherche → `Departements` | Non |
| Citation | `Quote` | Note | Oui |
| Proposé par | `NominatedBy` | Texte | Oui |
| Photo | `Photo` | Image | Non |
| Période début | `PeriodStart` | Date | Oui |
| En cours | `IsCurrent` | Oui/Non | Oui |

### B7. `HeroSlides` 🏠 — Carrousel d'accueil · *Bibliothèque (101)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Nom | `FileLeafRef` | Système | Oui |
| Titre | `Title` | Texte | Non |
| Chemin image | `FileRef` | Système | Oui |
| Légende | `Caption` | Texte | Oui |
| Sous-légende | `SubCaption` | Texte | Non |
| Lien | `SlideLink` | Lien | Non |
| Texte bouton | `CtaLabel` | Texte | Non |
| Ordre | `SortOrder` | Nombre | Oui |
| Actif | `IsActive` | Oui/Non | Oui |
| Début | `StartDate` | Date | Non |
| Fin | `EndDate` | Date | Non |
| Texte alt | `AltText` | Texte | Non |

### B8. `Missions` 🏠 — Mission, vision, valeurs · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Étiquette | `Tag` | Texte | Oui |
| Texte | `MissionText` | Note | Oui |
| Icône | `IconName` | Texte | Oui |
| Type | `MissionType` | Choix | Oui |
| Classe couleur | `ColorClass` | Texte | Non |
| Classe fond | `BgClass` | Texte | Non |
| Ordre | `SortOrder` | Nombre | Oui |

Choix `MissionType` : `Mission` · `Vision` · `Valeur`

### B9. `Indicateurs` 🏠 — KPI d'entreprise · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Valeur | `StatValue` | Texte | Oui |
| Icône | `IconName` | Texte | Oui |
| Emplacement | `Placement` | Choix | Oui |
| Ordre | `SortOrder` | Nombre | Oui |
| Actif | `IsActive` | Oui/Non | Oui |

Choix `Placement` : `Hero accueil` · `Page histoire` · `Les deux`

### B10. `Histoire` — Jalons chronologiques · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Année | `Year` | Texte | Oui |
| Trimestre | `Quarter` | Choix | Non |
| Description | `MilestoneDescription` | Note | Oui |
| Image | `MilestoneImage` | Image | Non |
| Icône | `IconName` | Texte | Oui |
| Étiquette | `Tag` | Texte | Non |
| Couleur étiquette | `TagColorClass` | Texte | Non |
| Côté | `Side` | Choix | Oui |
| Stat 1 libellé | `Stat1Label` | Texte | Non |
| Stat 1 valeur | `Stat1Value` | Texte | Non |
| Stat 2 libellé | `Stat2Label` | Texte | Non |
| Stat 2 valeur | `Stat2Value` | Texte | Non |
| Ordre | `SortOrder` | Nombre | Oui |

Choix `Quarter` : `T1` · `T2` · `T3` · `T4` · Choix `Side` : `left` · `right`

### B11. `Organigramme` — Directions (style des cartes) · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Icône | `IconName` | Texte | Oui |
| Classe couleur | `ColorClass` | Texte | Non |
| Classe fond | `BgColorClass` | Texte | Non |
| Classe bordure | `BorderColorClass` | Texte | Non |
| Dégradé début | `GradientFrom` | Texte | Non |
| Dégradé fin | `GradientTo` | Texte | Non |
| Département | `Department` | Recherche → `Departements` | Non |
| Ordre | `SortOrder` | Nombre | Oui |

### B12. `BordereauPrix` — En-têtes de bordereau · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Client | `ClientName` | Texte | Oui |
| Objet | `Subject` | Texte | Oui |
| Date d'émission | `IssueDate` | Date | Oui |
| Valide jusqu'au | `ValidUntil` | Date | Non |
| Statut | `QuoteStatus` | Choix | Oui |
| Montant soumission | `SubmissionAmount` | Monétaire | Non |
| Total HT | `TotalHT` | Monétaire | Non |
| Taux TVA | `VatRate` | Nombre | Oui |
| Montant TVA | `VatAmount` | Monétaire | Non |
| Total TTC | `TotalTTC` | Monétaire | Non |
| Devise | `CurrencyCode` | Choix | Oui |
| Commercial | `SalesRep` | Personne | Non |

Choix `QuoteStatus` : `Brouillon` · `Envoyé` · `Accepté` · `Refusé` · `Expiré`
Choix `CurrencyCode` : `XOF` · `EUR` · `USD`

### B13. `BordereauLignes` — Lignes de bordereau · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Bordereau | `Quote` | Recherche → `BordereauPrix` | Oui |
| Description | `LineDescription` | Note | Oui |
| Date livraison | `DeliveryDate` | Date | Non |
| Quantité | `Quantity` | Nombre | Oui |
| Prix unitaire | `UnitPrice` | Monétaire | Oui |
| Total ligne | `LineTotal` | Monétaire | Non |
| Ordre | `SortOrder` | Nombre | Oui |

### B14. `ParametresSite` — Configuration du site · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Clé | `Title` | Texte | Oui |
| Valeur | `SettingValue` | Note | Oui |
| Description | `SettingDescription` | Texte | Non |
| Catégorie | `SettingCategory` | Choix | Oui |

> Chaque ligne = un réglage (clé/valeur). Ex. `company.name`, `company.address`,
> `social.linkedin`… Voir `02-listes-sharepoint.md` §B14 pour la liste exhaustive.

### B15. `FAQ` — Questions fréquentes · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Question | `Title` | Texte | Oui |
| Réponse | `Answer` | Note | Oui |
| Catégorie | `FaqCategory` | Choix | Oui |
| Département | `Department` | Recherche → `Departements` | Non |
| Ordre | `SortOrder` | Nombre | Oui |
| Actif | `IsActive` | Oui/Non | Oui |
| Vues | `ViewCount` | Nombre | Non |

### B16. `DonneesFinancieres` — Séries pour graphiques · *Liste (100)*

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Titre | `Title` | Texte | Oui |
| Série | `SeriesType` | Choix | Oui |
| Montant | `Amount` | Monétaire | Oui |
| Exercice | `FiscalYear` | Nombre | Oui |
| Mois | `FiscalMonth` | Nombre | Non |
| Trimestre | `FiscalQuarter` | Choix | Non |
| Devise | `CurrencyCode` | Choix | Oui |
| Ordre | `SortOrder` | Nombre | Oui |

Choix `FiscalQuarter` : `T1` · `T2` · `T3` · `T4`

---

## Synthèse : listes ↔ Web Parts

| Liste | Emplacement | Type | Web Part(s) consommatrice(s) |
|---|---|---|---|
| `Actualites` 🏠 | locale | Liste | Actualités (grille accueil), Liste actualités |
| `Commentaires` | locale | Liste | Page de détail actualité |
| `Documents` 🏠 | locale | Bibliothèque | Documents, Accès rapide |
| `Evenements` 🏠 | locale | Calendrier | Événements, Accès rapide |
| `LiensRapides` 🏠 | locale | Liste | Liens rapides, Accès rapide |
| `Departements` 🏠 | hub | Liste | Bannière département, Organigramme |
| `Collaborateurs` 🏠 | hub | Liste | Annuaire, Équipe, Organigramme |
| `Annonces` 🏠 | hub | Liste | Bandeau d'annonces, Liste des annonces |
| `Projets` 🏠 | hub | Liste | Tableau de bord Projets |
| `Galerie` 🏠 | hub | Bibliothèque | Galerie photos |
| `CollaborateurDuMois` 🏠 | hub | Liste | Collaborateur du mois |
| `HeroSlides` 🏠 | hub | Bibliothèque | Carrousel d'accueil |
| `Missions` 🏠 | hub | Liste | Carrousel d'accueil |
| `Indicateurs` 🏠 | hub | Liste | Carrousel d'accueil, Frise chronologique |
| `Histoire` | hub | Liste | Frise chronologique |
| `Organigramme` | hub | Liste | Organigramme |
| `BordereauPrix` | hub | Liste | Bordereau des prix |
| `BordereauLignes` | hub | Liste | Bordereau des prix |
| `ParametresSite` | hub | Liste | Header / Footer (extension) |
| `FAQ` | hub | Liste | FAQ |
| `DonneesFinancieres` | hub | Liste | Tableau de bord financier |

> **🏠 = requise pour la Web Part « Page d'accueil complète ».**
> Total : **20 listes** (4 locales répliquées par site + 16 sur le hub).

---

## Voir aussi

- [`02-listes-sharepoint.md`](./02-listes-sharepoint.md) — schémas complets, vues,
  indexation et valeurs de choix à valider par le métier.
- [`provisioning/site-scripts/`](../provisioning/site-scripts/) — JSON de création
  automatique des listes (Site Scripts + Site Designs).
- [`provisioning/scripts/`](../provisioning/scripts/) — PowerShell de déploiement.
