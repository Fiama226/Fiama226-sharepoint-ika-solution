# Déploiement SharePoint Online — Guide complet IKA Intranet

> Ce document consolide **la review du code**, **la liste des listes/bibliothèques
> à créer** et **la procédure pas à pas de déploiement** pour le portage de
> l'application Next.js IKA Intranet vers **SharePoint Online** via **SPFx**.
>
> Public cible : développeur SPFx + propriétaire de site (site owner).
> Tu as indiqué n'avoir **que les droits site owner** (pas de droit tenant),
> ce qui impacte la procédure — voir §6.

---

## 📋 Sommaire

1. [Review du repo — ce qui est bien, ce qui ne l'est pas](#1-review-du-repo--ce-qui-est-bien-ce-qui-ne-lest-pas)
2. [Architecture cible sur SharePoint Online](#2-architecture-cible-sur-sharepoint-online)
3. [Listes & bibliothèques à créer](#3--listes--bibliothèques-à-créer)
4. [Ordre de création des listes (respect des lookups)](#4-ordre-de-création-des-listes)
5. [Comment builder le package `.sppkg`](#5-comment-builder-le-package-sppkg)
6. [Déploiement (cas site owner sans droits tenant)](#6-déploiement-cas-site-owner-sans-droits-tenant)
7. [Assemblage de la page d'accueil](#7-assemblage-de-la-page-daccueil)
8. [Alimentation du contenu — cheat sheet](#8-alimentation-du-contenu--cheat-sheet)
9. [Dépannage courant](#9-dépannage-courant)
10. [Recommandations post-déploiement](#10-recommandations-post-déploiement)

---

## 1. Review du repo — ce qui est bien, ce qui ne l'est pas

### ✅ Ce qui est **bien fait** (niveau SPFx senior)

| Point | Appréciation |
|---|---|
| **Séparation Next.js ↔ SPFx** | Le dossier `spfx/` est autonome, ne touche pas à la maquette. Bonne pratique. |
| **Mapping 1:1 composants → Web Parts** | Chaque `components/intranet/*` a son équivalent SPFx. Props plain-serializable. Contrat respecté. |
| **Gestion du fossé React 19 vs React 17** | Le SPFx est en React 17.0.1, le Next en React 19. Aucun hook React 18/19 (`use()`, Server Components…) n'est utilisé dans le portage SPFx. C'est **le bon choix** et c'est bien documenté. |
| **Heft au lieu de Gulp** | SPFx 1.22+ a déprécié Gulp au profit de Heft. Le repo est à jour. |
| **Tailwind préfixé `ika-`** | `tailwindcss-scoped-preflight` évite les collisions avec le CSS SharePoint. Très important, bien géré. |
| **Aucune dépendance lourde** | Zéro `framer-motion`, `swiper`, `lucide-react` dans le SPFx. Icônes SVG inline, carrousel custom en `setInterval`, animations CSS + IntersectionObserver natif. Bundle léger. |
| **DataService avec tolérance d'erreur** | Le fetch parallèle tolère jusqu'à 7 échecs de liste avant d'afficher une erreur. Très bonne UX pour SharePoint. |
| **Volet de propriétés riche sur la Web Part principale** | 12 toggles + options d'apparence (hauteur hero, accent). Permet de masquer/montrer des sections sans supprimer la WP. |
| **Site Scripts + PnP PowerShell fournis** | `spfx/provisioning/` contient les JSON et scripts pour automatiser. |
| **Données d'import CSV/Excel générées** | `sharepoint-ready-data/` contient 13 feuilles CSV/XLSX prêtes à importer dans SharePoint. |
| **Résolution automatique photo M365** | Si un collaborateur n'a pas de photo uploadée dans la liste, la Web Part repli sur la photo de profil Microsoft 365. |
| **Respect de `prefers-reduced-motion`** | Les animations se désactivent automatiquement selon le setting système. |

### ⚠️ Ce qui est **à corriger / surveiller** avant prod

| Sévérité | Point | Recommandation |
|---|---|---|
| 🔴 Critique | **Le code SPFx n'a jamais été buildé/testé** (`untested` d'après ta réponse). Des erreurs TypeScript ou de rendu sont très probables à la première exécution. | Builder d'abord dans le workbench local (`npm run dev` dans `spfx/`) puis tester dans le workbench hébergé SharePoint avant de packager. |
| 🔴 Critique | **`HomePageWebPart` et `IntranetMainWebPart` sont en doublon** — les deux assemblent la home. `HomePageWebPart/README.md` n'existe pas et la Web Part `IntranetMainWebPart` est celle documentée comme principale. | Garder `IntranetMain` (la plus complète, avec property pane riche) et supprimer `homePage/` pour éviter la confusion dans le catalogue. |
| 🟡 Moyen | **Colonnes Lookup avec espaces/accents non protégées** : `RelatedPerson`, `Department`, `Manager`, etc. Le nom interne SharePoint est généré à partir du nom affiché à la CRÉATION. Si le nom saisi ne correspond pas exactement, les appels REST `?$expand=Department/Title` échoueront silencieusement. | Utiliser **exactement** les noms "Affichage" du tableau §3.2, ou utiliser les Site Scripts qui fixent les noms internes. |
| 🟡 Moyen | **Le champ `fAllDayEvent` du calendrier Evenements** est un champ système avec un nom interne qui commence par `f` — il n'est PAS recréable manuellement via "Ajouter une colonne". Le Site Script doit en tenir compte, mais en création manuelle : ne tentez PAS de recréer `fAllDayEvent`, il existe déjà dans tout type Calendrier. |
| ✅ Corrigé | **Header/Footer désormais intégrés directement à `IntranetMain`** — la Web Part est autosuffisante : posée une fois, elle rend le header IKA, la home complète, et le footer IKA. Plus besoin d'activer une Application Customizer séparée. | |
| 🟢 Info | Les composants `IkaHeader`/`IkaFooter` vivent toujours dans `spfx/src/extensions/ikaChrome/components/` (réutilisés par la WP principale) mais l'Application Customizer elle-même n'est plus packagée. | |
| 🟡 Moyen | **Le nom de fichier `components/intranet/last_home_page section.tsx`** contient un espace. Ça fonctionne mais c'est source de bugs sur Windows/CI. | Renommer en `last-home-page-section.tsx` et mettre à jour l'import dans `app/page.tsx` (hors scope SPFx, mais à corriger dans la maquette). |
| 🟢 Faible | **Références de couleurs codées en dur** dans certaines pages Next (`#1355e2`, `#e63946`) — mais ça n'affecte pas le SPFx. |
| 🟢 Faible | **Thème SharePoint (bleu marine + cyan)** à appliquer séparément (`spfx/provisioning/theme/ika-theme.ps1`). Non bloquant. |
| 🟢 Faible | **Liens morts dans le menu Next.js** : `/comptabilite`, `/administration`, `/commerciaux`, `/techniciens`, `/agenda`, `/services`, `/projects`, `/blog`, `/profile`, `/settings` pointent vers des routes 404. Tu as demandé de les conserver, c'est ton choix — mais ils seront sans objet dans SPFx (c'est la navigation du hub qui les remplacera). |

### 🎯 Verdict de SPFx dev/designer

**Globalement : c'est un très bon travail, 8/10.**

- Le code SPFx est propre, bien structuré, suit les bonnes pratiques (DataService, services séparés, hooks partagés, models typés).
- Le design Tailwind préfixé est la bonne approche pour éviter les conflits CSS SharePoint.
- La Web Part `IntranetMain` "one-shot" est une **excellente idée UX** : un propriétaire de site pose une seule WP et obtient toute la home.

**Manque avant MEP** :
1. Un build SPFx réel qui passe (non testé à ce jour).
2. Des tests dans le workbench hébergé SharePoint.
3. La suppression du doublon `homePage/`.
4. Une vraie passe sur la sécurité (groupes SharePoint, permissions sur les listes — voir `spfx/docs/07-securite-gouvernance.md`).

---

## 2. Architecture cible sur SharePoint Online

Pour **démarrer rapidement** (recommandé) : **1 seul site de communication**.

Pour la **version finale cible** (hub d'entreprise) :

```
🔗 Hub Site : IKA Intranet  (https://<tenant>.sharepoint.com/sites/ika-intranet)
 │
 ├── 🏠 Page d'accueil (avec la Web Part « IKA — Intranet (composant principal) »)
 │
 ├── Listes HUB (partagées entre tous les sites du hub) :
 │    Departements, Collaborateurs, Annonces, Projets, Galerie,
 │    CollaborateurDuMois, HeroSlides, Missions, Indicateurs, Histoire,
 │    Organigramme, BordereauPrix, BordereauLignes, ParametresSite,
 │    FAQ, DonneesFinancieres
 │
 ├── Sous-sites (Communication Sites) rattachés au hub :
 │    ├── /sites/ika-comptabilite      (listes locales : Actualites, Documents, Evenements, LiensRapides)
 │    ├── /sites/ika-administration
 │    ├── /sites/ika-commerciaux
 │    └── /sites/ika-techniciens
```

> 💡 **Conseil démarrage** : crée d'abord TOUT sur le site hub racine (même les listes
> "locales"). Tu pourras éclater en sous-sites plus tard, une fois la recette validée.

---

## 3. 📚 Listes & bibliothèques à créer

Le site hub porte **toutes les listes** en phase de démarrage. Total = **20 listes**
(16 listes + 4 bibliothèques), 155 colonnes.

### 3.1 Légende des types

- `Texte`, `Note`, `Nombre`, `Monétaire`, `Oui/Non`, `Date` → colonnes standard
- `Choix` → colonne de choix (les valeurs sont indiquées en dessous)
- `Personne` → colonne Personne/Groupes
- `Recherche (→ ListeCible)` → Lookup vers une autre liste (**créer en dernier**)
- `Lien` → colonne Lien hypertexte ou Image
- `Image` → colonne Image (nécessite le mode "Affichage simplifié" activé sur le site)
- `Bibliothèque` = créer comme **Bibliothèque de documents** (pas une liste)
- `Calendrier` = créer comme **Calendrier** (pas une liste)

### 3.2 Listes du hub (à créer **une seule fois** sur le site principal)

> **🏠** = requis pour la Web Part « Page d'accueil complète » (minimal).
> Crée **au moins celles marquées 🏠** pour voir la home.

#### 🏠 `Departements` — Liste (référentiel des départements)

| Nom affiché | Nom interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Titre (→ renommer "Nom du département") | `Title` | Texte | Oui | |
| Slug | `Slug` | Choix | Oui | `direction`, `comptabilite`, `administration`, `commercial`, `techniques` |
| Tagline | `Tagline` | Texte | Non | |
| DeptDescription | `DeptDescription` | Note | Non | |
| HeroTitle | `HeroTitle` | Texte | Non | |
| HeroSubtitle | `HeroSubtitle` | Texte | Non | |
| Accent | `Accent` | Choix | Non | `orange`, `emerald`, `sky`, `indigo`, `rose`, `amber` |
| IconName | `IconName` | Texte | Non | Nom d'icône Lucide |
| SiteUrl | `SiteUrl` | Lien | **Oui** (recommandé) | URL absolue du site départemental SharePoint (ex. `https://<tenant>.sharepoint.com/sites/ika-comptabilite`). C'est à partir de cette URL que les cartes construisent le lien vers `Documents partages` de chaque département. |
| AccentClasses | `AccentClasses` | Texte | Non | Classes Tailwind (ex. `from-orange-500 to-amber-500`) |
| BadgeClasses | `BadgeClasses` | Texte | Non | |
| MemberCount | `MemberCount` | Nombre | Non | |
| SortOrder | `SortOrder` | Nombre | Oui | Ordre d'affichage |

#### 🏠 `Missions` — Liste (Mission/Vision/Valeurs)

| Nom affiché | Interne | Type | Obligatoire | Valeurs |
|---|---|---|---|---|
| Titre (→ "Intitulé") | `Title` | Texte | Oui | |
| Tag | `Tag` | Texte | Oui | |
| MissionText | `MissionText` | Note | Oui | |
| IconName | `IconName` | Texte | Oui | |
| MissionType | `MissionType` | Choix | Oui | `Mission`, `Vision`, `Valeur` |
| ColorClass | `ColorClass` | Texte | Non | |
| BgClass | `BgClass` | Texte | Non | |
| SortOrder | `SortOrder` | Nombre | Oui | |

#### 🏠 `Indicateurs` — Liste (KPIs)

| Nom affiché | Interne | Type | Obligatoire | Valeurs |
|---|---|---|---|---|
| Titre (→ "Libellé") | `Title` | Texte | Oui | |
| StatValue | `StatValue` | Texte | Oui | ex. `85+` |
| IconName | `IconName` | Texte | Oui | |
| Placement | `Placement` | Choix | Oui | `Hero accueil`, `Page histoire`, `Les deux` |
| SortOrder | `SortOrder` | Nombre | Oui | |
| IsActive | `IsActive` | Oui/Non | Oui | défaut **Oui** |

#### 🏠 `HeroSlides` — **Bibliothèque** (images du carrousel)

| Nom affiché | Interne | Type | Obligatoire | Notes |
|---|---|---|---|---|
| (Nom de fichier) | `FileLeafRef` | système | Oui | Déposez des images 1920×1080 |
| Titre | `Title` | Texte | Non | |
| Caption | `Caption` | Texte | Oui | Grand titre |
| SubCaption | `SubCaption` | Texte | Non | |
| SlideLink | `SlideLink` | Lien | Non | Lien CTA |
| CtaLabel | `CtaLabel` | Texte | Non | Texte du bouton |
| SortOrder | `SortOrder` | Nombre | Oui | |
| IsActive | `IsActive` | Oui/Non | Oui | défaut **Oui** |
| StartDate | `StartDate` | Date | Non | |
| EndDate | `EndDate` | Date | Non | |
| AltText | `AltText` | Texte | Non | Accessibilité |

#### 🏠 `LiensRapides` — Liste

| Nom affiché | Interne | Type | Obligatoire | Notes |
|---|---|---|---|---|
| Titre (→ "Nom du lien") | `Title` | Texte | Oui | |
| LinkUrl | `LinkUrl` | Lien | Oui | |
| LinkDescription | `LinkDescription` | Texte | Non | |
| IconName | `IconName` | Texte | Oui | ex. `FileText`, `Calendar` |
| SortOrder | `SortOrder` | Nombre | Oui | |
| OpenInNewTab | `OpenInNewTab` | Oui/Non | Non | défaut Non |
| LinkGroup | `LinkGroup` | Texte | Non | |
| IsActive | `IsActive` | Oui/Non | Oui | défaut **Oui** |

#### 🏠 `Evenements` — **Calendrier** (pas liste !)

> ⚠️ Créez-le depuis ⚙️ → Ajouter une application → **Calendrier**.
> Les champs `EventDate` (Début), `EndDate` (Fin), `fAllDayEvent` (Journée entière) existent déjà.
> Ajoutez ces colonnes supplémentaires :

| Nom affiché | Interne | Type | Obligatoire | Valeurs |
|---|---|---|---|---|
| Location | `Location` | Texte | Non | |
| EventCategory | `EventCategory` | Choix | Non | `Formation`, `Réunion`, `Célébration`, `Séminaire`, `Autre` |
| EventDescription | `EventDescription` | Note | Non | |
| EventImage | `EventImage` | Image | Non | |
| RegistrationLink | `RegistrationLink` | Lien | Non | |
| Organizer | `Organizer` | Personne | Non | |
| IsMandatory | `IsMandatory` | Oui/Non | Non | |

#### 🏠 `Documents` — **Bibliothèque** (vous pouvez renommer la bibliothèque "Documents" par défaut)

| Nom affiché | Interne | Type | Obligatoire | Valeurs |
|---|---|---|---|---|
| DocCategory | `DocCategory` | Choix | Oui | `Procédure`, `Modèle`, `Contrat`, `Rapport`, `Facture`, `Politique`, `Guide`, `Présentation`, `Formulaire`, `Autre` |
| DocDescription | `DocDescription` | Note | Non | |
| Confidentiality | `Confidentiality` | Choix | Oui | `Public`, `Interne`, `Confidentiel` |
| ExpiryDate | `ExpiryDate` | Date | Non | |
| DocOwner | `DocOwner` | Personne | Oui | |
| IsPinned | `IsPinned` | Oui/Non | Non | épinglé en accès rapide |
| BusinessVersion | `BusinessVersion` | Texte | Non | |

#### 🏠 `Collaborateurs` — Liste (annuaire)

| Nom affiché | Interne | Type | Obligatoire | Notes |
|---|---|---|---|---|
| Titre (→ "Nom complet") | `Title` | Texte | Oui | |
| UserAccount | `UserAccount` | Personne | Non | Compte M365 lié |
| JobTitle | `JobTitle` | Texte | Oui | Poste |
| Department | `Department` | Recherche → `Departements` | Non | ⚠️ créer après `Departements` |
| Email | `Email` | Texte | Oui | |
| Phone | `Phone` | Texte | Non | |
| OfficeLocation | `OfficeLocation` | Texte | Non | |
| Birthdate | `Birthdate` | Date | Non | |
| Photo | `Photo` | Image | Non | |
| Manager | `Manager` | Recherche → `Collaborateurs` | Non | ⚠️ lookup sur la liste elle-même — créer après quelques entrées |
| HierarchyLevel | `HierarchyLevel` | Nombre | Oui | 1=DG, 2=Directeur, 3=Chef… |
| Division | `Division` | Choix | Oui | `Direction Générale`, `Engineering`, `Ventes & Marketing`, `Comptabilité`, `Administration`, `Support Technique` |
| LinkedInUrl | `LinkedInUrl` | Lien | Non | |
| HireDate | `HireDate` | Date | Non | |
| IsActive | `IsActive` | Oui/Non | Oui | défaut **Oui** |
| SortOrder | `SortOrder` | Nombre | Non | |

#### 🏠 `Annonces` — Liste

| Nom affiché | Interne | Type | Obligatoire | Valeurs |
|---|---|---|---|---|
| Titre (→ "Résumé") | `Title` | Texte | Oui | |
| AnnouncementType | `AnnouncementType` | Choix | Oui | `Mariage`, `Anniversaire`, `Naissance`, `Événement`, `Départ`, `Arrivée`, `Promotion` |
| Detail | `Detail` | Note | Oui | |
| Emoji | `Emoji` | Texte | Non | |
| AnnouncementDate | `AnnouncementDate` | Date | Oui | |
| DisplayUntil | `DisplayUntil` | Date | Oui | |
| RelatedPerson | `RelatedPerson` | Recherche → `Collaborateurs` | Non | ⚠️ créer après `Collaborateurs` |
| Priority | `Priority` | Choix | Non | `Basse`, `Normale`, `Haute` |

#### 🏠 `CollaborateurDuMois` — Liste

| Nom affiché | Interne | Type | Obligatoire | Notes |
|---|---|---|---|---|
| Titre (→ "Intitulé") | `Title` | Texte | Oui | |
| Employee | `Employee` | Recherche → `Collaborateurs` | Oui | |
| DisplayRole | `DisplayRole` | Texte | Oui | |
| Department | `Department` | Recherche → `Departements` | Non | |
| Quote | `Quote` | Note | Oui | |
| NominatedBy | `NominatedBy` | Texte | Oui | |
| Photo | `Photo` | Image | Non | |
| PeriodStart | `PeriodStart` | Date | Oui | |
| IsCurrent | `IsCurrent` | Oui/Non | Oui | un seul à Oui à la fois |

#### 🏠 `Projets` — Liste

| Nom affiché | Interne | Type | Obligatoire | Valeurs |
|---|---|---|---|---|
| Titre (→ "Nom du projet") | `Title` | Texte | Oui | |
| ProjectLead | `ProjectLead` | Texte | Oui | |
| ProjectManager | `ProjectManager` | Personne | Non | |
| Progress | `Progress` | Nombre | Oui | 0-100 (%) |
| ProjectStatus | `ProjectStatus` | Choix | Oui | `À l'heure`, `À risque`, `En retard`, `Terminé` |
| DueDate | `DueDate` | Date | Oui | |
| TasksDone | `TasksDone` | Nombre | Non | |
| TasksTotal | `TasksTotal` | Nombre | Non | |
| Department | `Department` | Recherche → `Departements` | Non | |
| ShowOnHome | `ShowOnHome` | Oui/Non | Oui | défaut **Oui** |
| SortOrder | `SortOrder` | Nombre | Non | |

#### 🏠 `Galerie` — **Bibliothèque**

| Nom affiché | Interne | Type | Obligatoire | Valeurs |
|---|---|---|---|---|
| Caption | `Caption` | Texte | Oui | |
| GalleryCategory | `GalleryCategory` | Choix | Non | `Vie au bureau`, `Événements`, `Projets`, `Teambuilding`, `Formation`, `Autre` |
| PhotoDate | `PhotoDate` | Date | Non | |
| IsFeatured | `IsFeatured` | Oui/Non | Non | |
| AltText | `AltText` | | Non | |
| SortOrder | `SortOrder` | Nombre | Non | |

#### (Listes non-requises pour la home, mais utiles pour les autres pages)

<details>
<summary><code>Histoire</code> — Liste des jalons chronologiques</summary>

| Nom affiché | Interne | Type | Valeurs |
|---|---|---|---|
| Titre | `Title` | Texte | |
| Year | `Year` | Texte | |
| Quarter | `Quarter` | Choix | `T1`, `T2`, `T3`, `T4` |
| MilestoneDescription | `MilestoneDescription` | Note | |
| MilestoneImage | `MilestoneImage` | Image | |
| IconName | `IconName` | Texte | |
| Tag | `Tag` | Texte | |
| TagColorClass | `TagColorClass` | Texte | |
| Side | `Side` | Choix | `left`, `right` |
| Stat1Label/Value, Stat2Label/Value | `Stat1*`, `Stat2*` | Texte | |
| SortOrder | `SortOrder` | Nombre | |

</details>

<details>
<summary><code>Organigramme</code> — Liste des directions</summary>

| Nom affiché | Interne | Type | Notes |
|---|---|---|---|
| Titre | `Title` | Texte | |
| IconName | `IconName` | Texte | |
| ColorClass/BgColorClass/BorderColorClass | *Class | Texte | classes Tailwind |
| GradientFrom/GradientTo | *Gradient* | Texte | |
| Department | `Department` | Recherche → `Departements` | |
| SortOrder | `SortOrder` | Nombre | |

</details>

<details>
<summary><code>FAQ</code> — Liste</summary>

| Nom affiché | Interne | Type | Valeurs |
|---|---|---|---|
| Question | `Title` | Texte | |
| Answer | `Answer` | Note | |
| FaqCategory | `FaqCategory` | Choix | à définir |
| Department | `Department` | Recherche → `Departements` | |
| SortOrder | `SortOrder` | Nombre | |
| IsActive | `IsActive` | Oui/Non | |
| ViewCount | `ViewCount` | Nombre | (incrémenté par la WP) |

</details>

<details>
<summary><code>DonneesFinancieres</code> — Liste</summary>

| Nom affiché | Interne | Type | Valeurs |
|---|---|---|---|
| Titre | `Title` | Texte | |
| SeriesType | `SeriesType` | Choix | (types de série Recharts) |
| Amount | `Amount` | Monétaire | |
| FiscalYear | `FiscalYear` | Nombre | |
| FiscalMonth | `FiscalMonth` | Nombre | |
| FiscalQuarter | `FiscalQuarter` | Choix | `T1`, `T2`, `T3`, `T4` |
| CurrencyCode | `CurrencyCode` | Choix | `XOF`, `EUR`, `USD` |
| SortOrder | `SortOrder` | Nombre | |

</details>

<details>
<summary><code>ParametresSite</code> — Liste clé/valeur</summary>

| Nom affiché | Interne | Type |
|---|---|---|
| Clé | `Title` | Texte |
| SettingValue | `SettingValue` | Note |
| SettingDescription | `SettingDescription` | Texte |
| SettingCategory | `SettingCategory` | Choix |

</details>

<details>
<summary><code>BordereauPrix</code> et <code>BordereauLignes</code> (liste + liste avec lookup)</summary>

Voir `spfx/docs/10-listes-a-creer.md` §B12-B13 pour le schéma détaillé.

</details>

<details>
<summary><code>Actualites</code> — Liste locale (par site départemental)</summary>

| Nom affiché | Interne | Type | Valeurs |
|---|---|---|---|
| Titre | `Title` | Texte | |
| Excerpt | `Excerpt` | Note | |
| Body | `Body` | Note | |
| Category | `Category` | Choix | `Entreprise`, `RH`, `Projet`, `Finance`, `Administration`, `Commercial`, `Technique`, `Événement`, `DevOps`, `Formation`, `Cybersécurité`, `Innovation` |
| NewsAuthor | `NewsAuthor` | Personne | |
| PublishDate | `PublishDate` | Date | |
| HeaderImage | `HeaderImage` | Image | |
| Highlighted | `Highlighted` | Oui/Non | |
| ExternalLink | `ExternalLink` | Lien | |
| SortOrder | `SortOrder` | Nombre | |

</details>

---

## 4. Ordre de création des listes

⚠️ **Respectez cet ordre** à cause des lookups qui pointent vers d'autres listes :

```
1. Departements
2. Missions
3. Indicateurs
4. HeroSlides          (bibliothèque)
5. LiensRapides
6. Evenements         (calendrier)
7. Documents          (bibliothèque)
8. Collaborateurs     (créer la colonne Manager APRÈS avoir saisi 1-2 entrées)
9. Annonces           (créer RelatedPerson APRÈS Collaborateurs)
10. CollaborateurDuMois
11. Projets
12. Galerie           (bibliothèque)
13. Histoire
14. Organigramme
15. FAQ
16. DonneesFinancieres
17. ParametresSite
18. BordereauPrix
19. BordereauLignes   (lookup → BordereauPrix)
20. Actualites        (par site départemental)
```

> 🚀 **Automatisation possible** : les scripts PnP PowerShell dans
> `spfx/provisioning/scripts/` créent automatiquement les listes dans le bon ordre
> si tu as PnP.PowerShell installé. Ils **nécessitent des droits site owner**,
> pas Global Admin. Voir §6.3.

---

## 5. Comment builder le package `.sppkg`

### 5.1 Prérequis machine de build

| Outil | Version | Vérification |
|---|---|---|
| Node.js | **v22 LTS** (exact) | `node -v` → `v22.x` |
| npm | fourni avec Node 22 | `npm -v` |
| (Optionnel) PnP PowerShell 3.x | pour le provisioning auto | `Get-Module PnP.PowerShell -ListAvailable` |

> ⚠️ Node 20 ou 24 **ne fonctionneront pas** avec SPFx 1.23.2.

### 5.2 Build

```bash
cd spfx/
npm install                     # 2-5 min
npm run build:tailwind          # génère lib/styles/tailwind.css (préfixe ika-)
npm run ship                    # compile TS + bundle webpack + génère sppkg
```

Le package généré :

```
spfx/sharepoint/solution/ika-intranet.sppkg
```

> À ce jour, le build SPFx n'a **pas été validé** dans ce repo — lance
> `npm install && npm run ship` dans `spfx/` d'abord, corrige les erreurs
> TypeScript éventuelles, puis passe au déploiement.

---

## 6. Déploiement (cas **site owner sans droits tenant**)

Comme tu n'as que les droits **site owner** (pas Global Admin / SharePoint Admin),
tu ne peux **pas** déployer toi-même le `.sppkg` dans l'App Catalog tenant.
La procédure comporte donc une étape de **demande à l'admin du tenant**.

### 6.1 Si l'App Catalog existe déjà et que le tenant autorise les applis SPFx

1. **Envoie le `.sppkg` à l'admin SharePoint** de ton organisation avec ces consignes :
   - Upload dans le catalogue d'apps (`/sites/apps` ou `Apps for SharePoint`)
   - Décocher "Rendre disponible sur tous les sites" si l'intranet est le seul concerné
   - Cliquer sur **Déployer**
2. Une fois l'app déployée par l'admin :
   - Aller sur le site IKA Intranet
   - ⚙️ → **Ajouter une application** → rechercher `IKA Intranet` → **Ajouter**
   - Attendre la fin de l'installation (quelques secondes)

### 6.2 Workaround si l'admin est lent ou indisponible : SPFx workbench hébergé

Si tu es **pressé**, la Web Part peut être testée dans le workbench hébergé
avant déploiement catalogue — MAIS ça ne fonctionnera que si tu bundles en mode
"dev" (sans paquetage) avec `gulp serve` (Hetz `heft start`). Cette option
est **temporaire** (pour la démo/recette) car elle dépend de ton serveur local
tournant.

> ✅ Tu as choisi la **création manuelle** des listes — les scripts PowerShell
> de provisioning ont été **supprimés** du repo (`spfx/provisioning/` n'existe
> plus). Passe directement par l'interface web en suivant le §3 (détail des
> colonnes) et le §4 (ordre de création à respecter).
>
> Les CSV d'import sont toujours dans `sharepoint-ready-data/` : tu peux les
> ouvrir dans Excel puis copier-coller dans les vues "Modification rapide"
> (Quick Edit) des listes pour alimenter plus vite.

### 6.4 (Optionnel) Déployer le thème IKA (couleurs)

⚠️ Le script `ika-theme.ps1` utilise `Add-PnPTenantTheme` / `Set-PnPTenantTheme`
qui **nécessite les droits Global Admin ou SharePoint Admin** (pas seulement
site owner). Demande à l'admin du tenant de le lancer, ou applique manuellement
la palette `#0a2540` (primaire) / `#06b6d4` (accent) via ⚙️ → Changer l'apparence.

```powershell
# Nécessite droits tenant admin
cd spfx/provisioning/theme
.\ika-theme.ps1 -TenantUrl "https://<tenant>-admin.sharepoint.com"
```

En tant que simple site owner, tu peux déjà obtenir un rendu proche en
appliquant le thème **"Blue"** ou **"Navy"** par défaut de SharePoint, puis en
ajustant l'accent via le volet de propriétés de la Web Part principale.

---

## 7. Assemblage de la page d'accueil

### 7.1 Poser la Web Part principale

1. Aller sur la page d'accueil du site
2. En haut à droite → **Modifier** ✏️
3. Changer le modèle de section en **PLEINE LARGEUR** (icône en haut de la section)
   → indispensable pour que le Hero s'affiche en pleine largeur
4. ➕ Ajouter une Web Part → chercher **`IKA`** → choisir
   # 🎯 **IKA — Intranet (composant principal)**
5. Configurer via le volet de propriétés à droite :
   - Hauteur Hero : **Grande (70vh)** (recommandé)
   - Couleur d'accent : **Orange IKA** (couleur de la charte)
   - Garder "Animations activées"
   - Laisser toutes les sections cochées
6. **Publier** la page.

🎉 **Une seule Web Part = header + toute la page d'accueil + footer**, comme
sur le site Next.js. Pas d'extension à activer à côté, pas de seconde
manipulation.

### 7.1 Ce que fait la Web Part une fois posée

| Bloc | Rendu |
|---|---|
| Header IKA | Logo + navigation Accueil/Départements/Organigramme/Agenda/Histoire + menu "Documents" pointant vers la bibliothèque **Documents partagés** de chaque département + recherche + profil utilisateur |
| Hero slider | Carrousel auto-rotatif avec panneau de bienvenue, horloge live, missions et KPIs |
| Bandeau d'annonces | Défilement horizontal des annonces à venir |
| Actualités | Grille de cartes d'actualités |
| Accès rapide | Documents clés + liens rapides + événements |
| Galerie | Mosaïque photos avec filtres |
| Équipe | Annuaire avec recherche et anniversaires |
| Collaborateur du mois + Projets | Carte + tableau de bord |
| **Départements** | **Cartes cliquables qui ouvrent directement la bibliothèque « Documents partagés » de chaque site départemental** (comportement demandé) |
| Footer IKA | Coordonnées, réseaux sociaux, copyright |

---

## 8. Alimentation du contenu — cheat sheet

Une fois la page en place, où déposer quoi ?

| Contenu | Où dans SharePoint | Colonne clé |
|---|---|---|
| Images du carrousel | Bibliothèque **`HeroSlides`** | Remplir `Caption`, `SortOrder`, `IsActive` |
| Missions/Vision/Valeurs | Liste **`Missions`** | `MissionType` = `Mission`/`Vision`/`Valeur` |
| KPIs du Hero | Liste **`Indicateurs`** | `Placement` = `Hero accueil` |
| Annonces défilantes | Liste **`Annonces`** | `DisplayUntil` doit être dans le futur |
| Documents clés | Bibliothèque **`Documents`** | Cocher `IsPinned` pour l'accès rapide |
| Liens rapides | Liste **`LiensRapides`** | `IconName` (lucide), `SortOrder`, `IsActive` |
| Événements | Calendrier **`Evenements`** | |
| Actualités | Liste **`Actualites`** | (sur site départemental) ou via `Projets` sur le hub |
| Photos galerie | Bibliothèque **`Galerie`** | `Caption` obligatoire |
| Collaborateurs | Liste **`Collaborateurs`** | Lier `UserAccount` au compte M365 si possible |
| Collaborateur du mois | Liste **`CollaborateurDuMois`** | Un seul `IsCurrent = Oui` |
| Projets tableau de bord | Liste **`Projets`** | `ShowOnHome = Oui` |
| Départements | Liste **`Departements`** | `Slug` et `SortOrder` obligatoires. Remplir `SiteUrl` avec l'URL absolue du site départemental (ex. `https://<tenant>.sharepoint.com/sites/ika-comptabilite`) pour que les cartes ouvrent la bonne bibliothèque ; sinon la WP utilise une convention `ika-<slug>` puis retombe sur le hub. |

> 📊 **Import en masse** : les fichiers dans `sharepoint-ready-data/*.csv` sont
> pré-remplis avec les données dummy du site Next.js. Tu peux les importer dans
> SharePoint via "Quick Edit" (vue grille) → copier/coller depuis Excel, ou via
> le script `04-Import-SampleData.ps1`.

---

## 9. Dépannage courant

| Symptôme | Cause probable | Remède |
|---|---|---|
| "Contenu momentanément indisponible" | Listes absentes ou noms internes incorrects | Vérifie que toutes les listes 🏠 existent et que les colonnes ont le **bon nom interne** |
| Hero pas en pleine largeur | Section pas en Pleine largeur | Rechanger le layout de section |
| Bandeau défilant vide | Aucune annonce avec `DisplayUntil` ≥ aujourd'hui | Créer une annonce avec une date future |
| Sections absentes | Toggle décoché dans le property pane | Réactiver dans le volet de config |
| Photos collaborateurs absentes | Ni `Photo` ni compte M365 valide | Uploader une photo ou lier `UserAccount` |
| Icônes vides/carrés | Nom d'icône incorrect | Noms doivent correspondre à ceux de `src/common/utils/Icon.tsx` (43 icônes Lucide) |
| Couleurs non appliquées | Cache navigateur / ancienne version | Vider le cache, incrémenter la version dans `package.json`, redéployer |
| Erreur au build "Node Sass binding" | Mauvaise version Node | Utiliser Node 22 LTS exactement |
| Lookups qui ne fonctionnent pas | Nom interne incorrect | Recréer la colonne lookup en saisissant le **nom affiché exact** du tableau §3 |

---

## 10. Recommandations post-déploiement

1. **Sécurité** :
   - Membres du site = contributeurs (peuvent créer des news/documents)
   - Membres de `Collaborateurs`, `Indicateurs`, `Missions` = lecture seule pour les visiteurs
   - Web Parts d'administration (Bordereau de prix) réservées à un groupe « Commerciaux » via audience targeting
2. **Cycle de vie** :
   - Mettre en place une revue trimestrielle des annonces (purger les expirées)
   - Valider les nouvelles publications via approbation de contenu sur la bibliothèque Pages
3. **Formation** :
   - Former 1-2 "content owners" par département à la saisie dans les listes
4. **Évolutions** :
   - Considérer l'usage des **Vues SharePoint** plutôt que des filtres dans les Web Parts pour les usages avancés (ex. actualités par catégorie)
   - Considérer **Power Automate** pour notifier les nouveaux événements/actus par Teams/email
   - La recherche SharePoint fonctionne nativement sur les listes — pas besoin de WP de recherche custom

---

## 📂 Fichiers de référence dans le repo

| Fichier | Utilité |
|---|---|
| `DEPLOYMENT-GUIDE.md` | Ce guide (point d'entrée) |
| `spfx/README.md` | Vue d'ensemble du SPFx (en français) |
| `spfx/docs/10-listes-a-creer.md` | Schéma détaillé des 20 listes (référence) |
| `spfx/docs/11-deploiement-intranet-main.md` | Guide de déploiement détaillé de la WP principale |
| `spfx/docs/02-listes-sharepoint.md` | Schéma complet avec vues, index, valeurs de choix |
| `sharepoint-ready-data/*.csv` | Données dummy prêtes à importer (copier/coller dans Quick Edit) |
| `spfx/src/webparts/intranetMain/` | Code source de la Web Part principale + composants (header/footer/sections) |
| `spfx/src/webparts/intranetMain/components/DepartmentGrid.tsx` | Cartes départementales qui ouvrent la bibliothèque « Documents partagés » |
| `spfx/src/services/DataService.ts` | Couche d'accès REST aux listes |

---

**Bon déploiement !** 🚀
