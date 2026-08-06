# Déploiement — Composant principal « IKA — Intranet »

> **Objectif** : obtenir sur SharePoint Online, en **une seule Web Part**
> ajoutée sur une page, la même page d'accueil (même design, mêmes animations,
> même UX/UI) que la maquette Next.js du repo.
>
> Build : **Heft** (Gulp n'est plus utilisé depuis SPFx 1.22).
>
> Web Part livrée : **`IKA — Intranet (composant principal)`**
> (`IntranetMainWebPart`)

---

## 🎯 Vue d'ensemble

| Étape | Durée estimée |
|---|---|
| 1. Préparer l'environnement de build | 15 min |
| 2. Vérifier la structure de sites (Hub + site d'accueil) | 10 min |
| 3. Créer les listes et bibliothèques à la main | 45 min |
| 4. Builder le package `.sppkg` avec Heft | 5 min |
| 5. Uploader dans le catalogue d'apps | 5 min |
| 6. Installer l'app sur le site | 5 min |
| 7. Ajouter la Web Part principale sur la page d'accueil | 5 min |
| 8. Alimenter les listes (contenu) | à votre rythme |

⏱️ **Total mise en route** : ~1h30.

---

## 📋 Prérequis

| Outil | Version exacte | Vérification |
|---|---|---|
| Node.js | **v22 LTS** | `node -v` → `v22.x` |
| npm | fourni avec Node 22 | `npm -v` |
| SPFx | **1.23.2** (déjà dans `package.json`) | — |
| React | **17.0.1** (imposé par SPFx) | — |
| Heft | **1.2.22** (déjà dans `package.json`) | — |
| Navigateur | Chrome ou Edge | — |
| Droits SP | **Administrateur de collection** de sites sur le hub, ou **Global Admin / SharePoint Admin** M365 | — |

> ⚠️ **Node 20 ou Node 24 cassent le build SPFx 1.23.2** : utilisez **exactement Node 22 LTS**.

---

## 1. Préparer l'environnement de build

Ouvrez un terminal et placez-vous dans le dossier `spfx/` :

```bash
cd /chemin/vers/Fiama226-sharepoint-ika-solution/spfx
```

Installez les dépendances (une seule fois) :

```bash
npm install
```

> L'install dure 2 à 5 minutes selon votre connexion.
> Si vous avez une erreur liée à `node-sass` ou `fibers`, vous n'êtes pas sur
> Node 22 : revérifiez avec `node -v`.

(Optionnel mais recommandé) Installez Heft en global pour pouvoir l'appeler
directement, sinon utilisez `npx heft` ou les scripts `npm run …` :

```bash
npm install -g @rushstack/heft
```

(Une fois par poste) Faites confiance au certificat de dev :

```bash
npm run trust-cert
```

Vérifiez que le projet compile :

```bash
npm run build:tailwind        # Génère lib/styles/tailwind.css
npm run build                 # heft test --clean --production + package-solution
```

Si la commande se termine sans erreur rouge, vous obtenez le package :

```
sharepoint/solution/ika-intranet.sppkg
```

---

## 2. Préparer la structure de sites dans SharePoint

Le design de l'app prévoit un **Hub Site** + 1 site de communication par
département. Pour démarrer, créez **au minimum** :

1. Un **site de communication** racine (par exemple le site d'accueil du hub,
   ex. `https://<tenant>.sharepoint.com/sites/ika-intranet`).
2. (Optionnel) Associez-le comme **Hub Site** depuis le centre d'administration
   SharePoint.
3. (Optionnel) Créez les sites départementaux (`-comptabilite`, `-commercial`,
   etc.) et raccordez-les au hub.

> 💡 **Astuce de démarrage** : vous pouvez tout d'abord tout déployer sur un
> seul site de communication, puis éclater par département plus tard. C'est
> ce qui est recommandé pour la phase de recette.

---

## 3. Créer les listes à la main (procédure 100% interface)

La Web Part principale consomme **12 listes/bibliothèques** marquées 🏠 ci-dessous.
Créez-les **sur le site hub** (le site qui porte la page d'accueil).

### 3.1 Ordre de création (important pour les lookups)

Les colonnes de type **Recherche/Lookup** pointent vers d'autres listes qui
doivent donc exister d'abord. Respectez **strictement** cet ordre :

1. `Departements`
2. `Missions`
3. `Indicateurs`
4. `HeroSlides` (bibliothèque)
5. `Annonces`
6. `LiensRapides`
7. `Evenements` (créez-la en **Calendrier**, pas en Liste personnalisée)
8. `Documents` (bibliothèque)
9. `Collaborateurs`
10. `CollaborateurDuMois`
11. `Projets`
12. `Galerie` (bibliothèque)

---

### 3.2 Mode d'emploi : créer une liste / une colonne

Pour **chaque** liste ci-dessous :

1. Sur le site hub, cliquez sur ⚙️ → **Contenus du site** → **Nouveau** →
   **Liste** (ou **Bibliothèque de documents** ou **Calendrier** selon le type).
2. Dans le champ **Nom**, entrez **exactement** le nom indiqué (l'internal name
   est créé à la création — respectez majuscules/minuscules et absence
   d'espaces).
3. Cliquez sur **Créer**.
4. Une fois la liste ouverte, cliquez sur **➕ Ajouter une colonne** et créez
   chaque colonne avec le **type** et le **nom affiché** indiqués dans les
   tableaux ci-dessous.
   - Le **nom interne** (colonne `Interne`) est généré automatiquement par
     SharePoint à partir du nom affiché que vous saisissez à la création :
     entrez donc **exactement** le nom affiché.
   - Après création, vous pouvez renommer la colonne `Title` en « Titre » (ça
     ne change pas le nom interne).
5. Pour les colonnes **Recherche** (Lookup), sélectionnez dans la liste
   déroulante la liste cible (ex. `Departements`) et la colonne source
   (`Title`), puis cochez les champs complémentaires si besoin.

> 📌 **Type de liste « Calendrier »** pour `Evenements` : cliquez sur
> ⚙️ → **Contenus du site** → **Nouveau** → **Application**, cherchez
> **Calendrier**, et créez l'app sous le nom `Evenements`.

---

### 3.3 Détail de chaque liste

#### 🏠 `Departements` — Référentiel des départements · Liste

| Affichage | Interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Titre | `Title` | Texte | Oui | Renommez en « Nom du département » |
| Slug | `Slug` | Choix | Oui | Valeurs : `direction`, `comptabilite`, `administration`, `commercial`, `techniques` |
| Tagline | `Tagline` | Texte | Non | Slogan court |
| DeptDescription | `DeptDescription` | Note | Non | Description longue |
| HeroTitle | `HeroTitle` | Texte | Non | Titre de la bannière |
| HeroSubtitle | `HeroSubtitle` | Texte | Non | Sous-titre de la bannière |
| Accent | `Accent` | Choix | Non | `orange`, `emerald`, `sky`, `indigo`, `rose`, `amber` |
| IconName | `IconName` | Texte | Non | Nom d'icône Lucide (ex. `Building2`) |
| SiteUrl | `SiteUrl` | Lien | Non | URL du site départemental |
| AccentClasses | `AccentClasses` | Texte | Non | Classes Tailwind (ex. `from-orange-500 to-amber-500`) |
| BadgeClasses | `BadgeClasses` | Texte | Non | Classes Tailwind |
| MemberCount | `MemberCount` | Nombre | Non | Effectif |
| SortOrder | `SortOrder` | Nombre | Oui | Ordre d'affichage (1, 2, 3…) |

---

#### 🏠 `Missions` — Mission / Vision / Valeurs · Liste

| Affichage | Interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Titre | `Title` | Texte | Oui | Renommez en « Intitulé » |
| Tag | `Tag` | Texte | Oui | Étiquette (ex. « NOTRE MISSION ») |
| MissionText | `MissionText` | Note | Oui | Texte descriptif |
| IconName | `IconName` | Texte | Oui | Icône Lucide |
| MissionType | `MissionType` | Choix | Oui | `Mission`, `Vision`, `Valeur` |
| ColorClass | `ColorClass` | Texte | Non | Couleur du texte (Tailwind) |
| BgClass | `BgClass` | Texte | Non | Couleur de fond |
| SortOrder | `SortOrder` | Nombre | Oui | Ordre d'affichage |

---

#### 🏠 `Indicateurs` — KPIs d'entreprise · Liste

| Affichage | Interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Titre | `Title` | Texte | Oui | Renommez en « Libellé » (ex. « Collaborateurs ») |
| StatValue | `StatValue` | Texte | Oui | Valeur affichée (ex. `85+`) |
| IconName | `IconName` | Texte | Oui | Icône Lucide |
| Placement | `Placement` | Choix | Oui | `Hero accueil`, `Page histoire`, `Les deux` |
| SortOrder | `SortOrder` | Nombre | Oui | Ordre |
| IsActive | `IsActive` | Oui/Non | Oui | Valeur par défaut : **Oui** |

---

#### 🏠 `HeroSlides` — Carrousel d'accueil · Bibliothèque de documents

| Affichage | Interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Nom | `FileLeafRef` | système | Oui | Déposez ici vos images JPG/PNG (1920×1080 recommandé) |
| Titre | `Title` | Texte | Non | — |
| Caption | `Caption` | Texte | Oui | Grand titre de la diapositive |
| SubCaption | `SubCaption` | Texte | Non | Sur-titre (petit, en accent) |
| SlideLink | `SlideLink` | Lien | Non | Cible du bouton CTA |
| CtaLabel | `CtaLabel` | Texte | Non | Texte du bouton (ex. « Découvrir ») |
| SortOrder | `SortOrder` | Nombre | Oui | Ordre 1, 2, 3… |
| IsActive | `IsActive` | Oui/Non | Oui | Défaut **Oui** |
| StartDate | `StartDate` | Date | Non | Date de début d'affichage |
| EndDate | `EndDate` | Date | Non | Date de fin d'affichage |
| AltText | `AltText` | Texte | Non | Texte alternatif d'accessibilité |

> 💡 Déposez au moins **3 images** de bonne qualité pour que le carrousel
> démarre.

---

#### 🏠 `Annonces` — Bandeau défilant · Liste

| Affichage | Interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Titre | `Title` | Texte | Oui | Renommez en « Résumé de l'annonce » |
| AnnouncementType | `AnnouncementType` | Choix | Oui | `Mariage`, `Anniversaire`, `Naissance`, `Événement`, `Départ`, `Arrivée`, `Promotion` |
| Detail | `Detail` | Note | Oui | Détail court |
| Emoji | `Emoji` | Texte | Non | Emoji/icône affiché (ex. `🎉`) |
| AnnouncementDate | `AnnouncementDate` | Date | Oui | Date de l'annonce |
| DisplayUntil | `DisplayUntil` | Date | Oui | Date de fin d'affichage dans le bandeau |
| RelatedPerson | `RelatedPerson` | Recherche → `Collaborateurs` | Non | Personne concernée |
| Priority | `Priority` | Choix | Non | `Basse`, `Normale`, `Haute` |

> ⚠️ La colonne `RelatedPerson` ne peut être créée qu'**après** la liste
> `Collaborateurs`. Recréez `Annonces` après `Collaborateurs` OU créez cette
> colonne à la fin.

---

#### 🏠 `LiensRapides` — Liens rapides · Liste

| Affichage | Interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Titre | `Title` | Texte | Oui | Renommez en « Nom du lien » |
| LinkUrl | `LinkUrl` | Lien | Oui | URL cible |
| LinkDescription | `LinkDescription` | Texte | Non | Description courte |
| IconName | `IconName` | Texte | Oui | Icône Lucide (ex. `FileText`, `Calendar`) |
| SortOrder | `SortOrder` | Nombre | Oui | Ordre |
| OpenInNewTab | `OpenInNewTab` | Oui/Non | Non | Défaut **Non** |
| LinkGroup | `LinkGroup` | Texte | Non | Groupe de liens |
| IsActive | `IsActive` | Oui/Non | Oui | Défaut **Oui** |

---

#### 🏠 `Evenements` — Événements · **Calendrier** (pas Liste)

Créez un **Calendrier** nommé `Evenements`. Ajoutez les colonnes :

| Affichage | Interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Titre | `Title` | Texte | Oui | Déjà présent (renommez en « Événement ») |
| EventDate | `EventDate` | Date | Oui | Déjà présent comme « Heure de début » |
| EndDate | `EndDate` | Date | Oui | Déjà présent comme « Heure de fin » |
| Location | `Location` | Texte | Non | Lieu |
| EventCategory | `EventCategory` | Choix | Non | `Formation`, `Réunion`, `Célébration`, `Séminaire`, `Autre` |
| EventDescription | `EventDescription` | Note | Non | Description |
| EventImage | `EventImage` | Image | Non | Visuel |
| RegistrationLink | `RegistrationLink` | Lien | Non | Lien d'inscription |
| Organizer | `Organizer` | Personne | Non | Organisateur |
| IsMandatory | `IsMandatory` | Oui/Non | Non | Présence obligatoire ? Défaut **Non** |

---

#### 🏠 `Documents` — Bibliothèque documentaire · Bibliothèque

| Affichage | Interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Nom | `FileLeafRef` | système | Oui | Bibliothèque Documents existante, renommez-la |
| Title | `Title` | Texte | Non | Déjà présent |
| DocCategory | `DocCategory` | Choix | Oui | `Procédure`, `Modèle`, `Contrat`, `Rapport`, `Facture`, `Politique`, `Guide`, `Présentation`, `Formulaire`, `Autre` |
| DocDescription | `DocDescription` | Note | Non | Description |
| Confidentiality | `Confidentiality` | Choix | Oui | `Public`, `Interne`, `Confidentiel` |
| ExpiryDate | `ExpiryDate` | Date | Non | Date d'expiration |
| DocOwner | `DocOwner` | Personne | Oui | Propriétaire |
| IsPinned | `IsPinned` | Oui/Non | Non | Épinglé en page d'accueil ? Défaut **Non** |
| BusinessVersion | `BusinessVersion` | Texte | Non | Version métier |

---

#### 🏠 `Collaborateurs` — Annuaire · Liste

| Affichage | Interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Titre | `Title` | Texte | Oui | Renommez en « Nom complet » |
| UserAccount | `UserAccount` | Personne | Non | Compte M365 (compte AD lié) |
| JobTitle | `JobTitle` | Texte | Oui | Poste |
| Department | `Department` | Recherche → `Departements` | Non | Département |
| Email | `Email` | Texte | Oui | Adresse email pro |
| Phone | `Phone` | Texte | Non | Téléphone |
| OfficeLocation | `OfficeLocation` | Texte | Non | Bureau |
| Birthdate | `Birthdate` | Date | Non | Anniversaire |
| Photo | `Photo` | Image | Non | Portrait |
| Manager | `Manager` | Recherche → `Collaborateurs` | Non | Responsable hiérarchique |
| HierarchyLevel | `HierarchyLevel` | Nombre | Oui | 1 = DG, 2 = Directeur, 3 = Chef d'équipe… |
| Division | `Division` | Choix | Oui | `Direction Générale`, `Engineering`, `Ventes & Marketing`, `Comptabilité`, `Administration`, `Support Technique` |
| LinkedInUrl | `LinkedInUrl` | Lien | Non | Lien LinkedIn |
| HireDate | `HireDate` | Date | Non | Date d'embauche |
| IsActive | `IsActive` | Oui/Non | Oui | Défaut **Oui** |
| SortOrder | `SortOrder` | Nombre | Non | Ordre |

---

#### 🏠 `CollaborateurDuMois` · Liste

| Affichage | Interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Titre | `Title` | Texte | Oui | Renommez en « Intitulé » (ex. « Collaborateur du mois d'août ») |
| Employee | `Employee` | Recherche → `Collaborateurs` | Oui | Collaborateur sélectionné |
| DisplayRole | `DisplayRole` | Texte | Oui | Poste affiché sur la carte |
| Department | `Department` | Recherche → `Departements` | Non | Département |
| Quote | `Quote` | Note | Oui | Citation/témoignage |
| NominatedBy | `NominatedBy` | Texte | Oui | Nommant |
| Photo | `Photo` | Image | Non | Photo spécifique (sinon photo de profil M365) |
| PeriodStart | `PeriodStart` | Date | Oui | Début de période |
| IsCurrent | `IsCurrent` | Oui/Non | Oui | Défaut **Oui** (un seul à Oui à la fois) |

---

#### 🏠 `Projets` · Liste

| Affichage | Interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Titre | `Title` | Texte | Oui | Renommez en « Nom du projet » |
| ProjectLead | `ProjectLead` | Texte | Oui | Nom du chef de projet |
| ProjectManager | `ProjectManager` | Personne | Non | Compte M365 associé |
| Progress | `Progress` | Nombre | Oui | % avancement (0-100) |
| ProjectStatus | `ProjectStatus` | Choix | Oui | `À l'heure`, `À risque`, `En retard`, `Terminé` |
| DueDate | `DueDate` | Date | Oui | Échéance |
| TasksDone | `TasksDone` | Nombre | Non | Tâches terminées |
| TasksTotal | `TasksTotal` | Nombre | Non | Tâches totales |
| Department | `Department` | Recherche → `Departements` | Non | Département pilote |
| ShowOnHome | `ShowOnHome` | Oui/Non | Oui | Afficher sur la page d'accueil ? Défaut **Oui** |
| SortOrder | `SortOrder` | Nombre | Non | Ordre d'affichage |

---

#### 🏠 `Galerie` · Bibliothèque

| Affichage | Interne | Type | Obligatoire | Valeurs / Notes |
|---|---|---|---|---|
| Nom | `FileLeafRef` | système | Oui | Déposez les photos dans la bibliothèque |
| Title | `Title` | Texte | Non | — |
| Caption | `Caption` | Texte | Oui | Légende affichée sous la photo |
| GalleryCategory | `GalleryCategory` | Choix | Non | `Vie au bureau`, `Événements`, `Projets`, `Teambuilding`, `Formation`, `Autre` |
| PhotoDate | `PhotoDate` | Date | Non | Date de la photo |
| IsFeatured | `IsFeatured` | Oui/Non | Non | Photo à la une ? Défaut **Non** |
| AltText | `AltText` | Texte | Non | Texte alternatif |
| SortOrder | `SortOrder` | Nombre | Non | Ordre |

---

### 3.4 Colonnes « Actualités » et « Actus » héritées

Si vous avez aussi créé une liste `Actualites` (pour les pages d'actualités
secondaires), le schéma est dans `10-listes-a-creer.md` section A1.
**La Web Part principale ne la consomme pas directement** (elle utilise le
composant `NewsCards` qui lit `Actualites` de la même façon). Créez-la si vous
voulez afficher plus de 4 actualités.

---

## 4. Builder le package (Heft, pas Gulp)

Dans le dossier `spfx/` :

```bash
# 1) Génère le CSS Tailwind préfixé ika-
npm run build:tailwind

# 2) Compile TypeScript + bundle webpack + génère le .sppkg
npm run ship
```

(équivalent manuel : `heft test --clean --production && heft package-solution --production`)

Le fichier de livrable est :

```
sharepoint/solution/ika-intranet.sppkg
```

> 🚫 **N'utilisez surtout pas `gulp bundle` ou `gulp package-solution`** : Gulp
> a été retiré de SPFx depuis la version 1.22. Toutes les commandes passent par
> **Heft** (scripts `npm run …`).

### En cas d'erreur de build

| Erreur | Cause / solution |
|---|---|
| `Node Sass could not find a matching binding` | Mauvaise version Node → utiliser Node 22 |
| `Cannot find module 'react'` | `npm install` à relancer |
| `error TS2345 … DataService` | Vérifiez que tous les noms de méthodes appelés existent dans `src/services/DataService.ts` |
| Erreur Tailwind (`ika-*` inconnu) | Lancez `npm run build:tailwind` avant `npm run ship` |

---

## 5. Uploader l'application dans le catalogue d'apps

### 5.1 Créer le catalogue d'apps (si pas encore fait)

1. Ouvrez le **Centre d'administration SharePoint** :
   `https://admin.microsoft.com` → **Centres d'administration** → **SharePoint**
2. Cliquez sur **Autres fonctionnalités** → **Applications** → **Ouvrir le catalogue d'applications**
3. Si aucun catalogue n'existe, créez-en un (choisissez une URL dédiée comme
   `/sites/apps`). Attendez la fin du provisioning (~5 min).

### 5.2 Uploader le `.sppkg`

1. Ouvrez le **catalogue d'apps** (bibliothèque **Apps pour SharePoint**).
2. Cliquez sur **Télécharger** et sélectionnez :
   `spfx/sharepoint/solution/ika-intranet.sppkg`
3. Dans la boîte de dialogue « Voulez-vous approuver cette application ? » :
   - Cochez **« Rendre cette solution disponible sur tous les sites de l'organisation »**
     (déploiement tentant-wide) **pour une installation simplifiée**,
     OU décochez et installez l'app site par site.
   - Cliquez sur **Déployer**.

L'application apparaît dans la bibliothèque comme **Déployée**.

---

## 6. Installer l'app sur le site hub

1. Allez sur votre site d'accueil (`https://<tenant>.sharepoint.com/sites/ika-intranet`).
2. Cliquez sur ⚙️ → **Ajouter une application**
3. Dans **Mes applications**, recherchez **IKA Intranet** (ou `ika-intranet`).
4. Cliquez sur **Ajouter**. Attendez la fin de l'installation (quelques secondes).

---

## 7. Ajouter la Web Part principale sur la page d'accueil

C'est l'étape finale, celle qui « pose » le composant principal sur la page :

1. Sur le site, cliquez sur **Accueil** (ou une page dédiée « Home.aspx »).
2. Cliquez en haut à droite sur **Modifier** ✏️.
3. Passez la page en mode **Pleine largeur** :
   - En haut de la page, cliquez sur l'icône du modèle de section et
     sélectionnez la section **PLEINE LARGEUR** (section qui traverse tout
     l'écran — c'est essentiel pour que le Hero s'affiche sur toute la
     largeur comme dans l'app Next.js).
4. Cliquez sur le **➕** à l'intérieur de la section pleine largeur pour
   ajouter une Web Part.
5. Dans la barre de recherche, tapez **`IKA`** : vous voyez la catégorie
   **IKA Solution**.
6. Sélectionnez la Web Part :
   # 🎯 **IKA — Intranet (composant principal)**
   C'est celle avec l'icône 🌐 (`Globe2`).

👉 **Une seule Web Part ajoutée** = toute la page d'accueil est reconstituée.

### 7.1 Configurer via le volet de propriétés

Une fois la Web Part posée, un volet de configuration s'ouvre à droite :

- **Hauteur du carrousel Hero** : choisissez *Grande (70vh)* (recommandé) ou
  *Plein écran*.
- **Couleur d'accent** : choisissez la couleur principale (Orange IKA par
  défaut, conformément à la charte).
- **Animations** : laissez coché « Animations activées » pour retrouver
  l'auto-rotation, le bandeau défilant et les fade-in au scroll (ces
  animations respectent le paramètre système « Réduire les animations »).
- **Sections** : vous pouvez masquer/afficher chaque section indépendamment
  (Hero, horloge, panneau de bienvenue, bandeau annonces, actualités, accès
  rapide, galerie, équipe, collaborateur du mois, projets).

Cliquez en haut à droite sur **Publier** (ou **Republier**).

🎉 **Votre page d'accueil a désormais le même design, les mêmes animations et
la même UX que l'app Next.js.**

---

## 8. Où déposer vos fichiers — Cheat sheet rapide

| Contenu à déposer | Lieu de dépôt dans SharePoint |
|---|---|
| Images du carrousel | Bibliothèque **`HeroSlides`** (renseignez les colonnes Caption, CtaLabel, SortOrder) |
| Photos de la galerie | Bibliothèque **`Galerie`** |
| Documents clés | Bibliothèque **`Documents`** (cochez `IsPinned` pour qu'ils remontent dans l'accès rapide) |
| Événements | Calendrier **`Evenements`** |
| Liens rapides | Liste **`LiensRapides`** |
| Annonces (défilement bandeau) | Liste **`Annonces`** |
| Collaborateurs | Liste **`Collaborateurs`** (la photo est déduite du compte M365 si pas de Photo uploadée) |
| Collaborateur du mois | Liste **`CollaborateurDuMois`** (un seul enregistrement avec `IsCurrent = Oui`) |
| Projets | Liste **`Projets`** (cochez `ShowOnHome = Oui`) |
| Missions / Vision / Valeurs | Liste **`Missions`** |
| Indicateurs / KPIs (hero) | Liste **`Indicateurs`** (`Placement = Hero accueil`) |
| Départements | Liste **`Departements`** |

---

## 9. Pour résumer — Ordre des dossiers dans le code SPFx

Si vous ajoutez/modifiez des fichiers source, voici la structure attendue
(le build Heft + Tailwind s'appuie dessus) :

```
spfx/
├── config/
│   ├── config.json                 ← déclaration des bundles (déjà à jour)
│   ├── package-solution.json       ← métadonnées du .sppkg
│   ├── tailwind.config.js          ← config Tailwind, préfixe ika-
│   ├── build-tailwind.js           ← compilation Tailwind (commande node)
│   └── heft.json                   ← configuration Heft
├── src/
│   ├── webparts/
│   │   ├── intranetMain/           ← ⭐ NOTRE COMPOSANT PRINCIPAL
│   │   │   ├── IntranetMainWebPart.ts
│   │   │   ├── IntranetMainWebPart.manifest.json
│   │   │   └── components/
│   │   │       ├── IntranetMain.tsx
│   │   │       └── IIntranetMainProps.ts
│   │   ├── heroSlider/             ← section Hero
│   │   ├── announcementMarquee/    ← bandeau annonces
│   │   ├── newsCards/              ← actus en cartes
│   │   ├── quickAccessPanel/       ← accès rapide
│   │   ├── gallery/                ← galerie photos
│   │   ├── teamHome/               ← équipe
│   │   └── intranetSections/       ← collaborateur du mois + projets
│   ├── extensions/ikaChrome/       ← header/footer global (à activer séparément)
│   ├── services/DataService.ts     ← accès aux listes SharePoint (REST)
│   ├── models/IIkaModels.ts        ← interfaces TypeScript des listes
│   ├── common/                     ← hooks (useLiveClock, usePrefersReducedMotion…)
│   │                              ← et utilitaires (cn, Icon, dates…)
│   └── styles/tailwind.css         ← point d'entrée Tailwind (préfixe ika-)
└── sharepoint/solution/
    └── ika-intranet.sppkg          ← ← ← FICHIER À UPLOADER
```

**Dépendances externes** : zéro. Pas de `framer-motion`, pas de `swiper`, pas
de `lucide-react` : tout est embarqué (icônes SVG inline, animations CSS
Tailwind + `IntersectionObserver` natif, carrousel custom en React avec
`setInterval`). Ça garantit un bundle léger qui tient dans SharePoint.

---

## 10. Dépannage

| Symptôme | Diagnostic / remède |
|---|---|
| La Web Part affiche « Contenu momentanément indisponible » | Les listes du hub sont manquantes ou inaccessibles. Vérifiez l'étape 3. |
| Le Hero ne s'affiche pas en pleine largeur | La page n'est pas dans une **section Pleine largeur** (étape 7.3). |
| Le bandeau défilant est vide | La liste `Annonces` ne contient pas d'enregistrements avec `DisplayUntil` dans le futur. |
| Les couleurs d'accent ne changent pas | Videz le cache navigateur + redéployez le sppkg (incrémentez la version dans `package.json`). |
| Les animations ne jouent pas | Vérifiez le réglage « Animations » dans le volet de propriétés ET le paramètre système « Réduire les animations » de l'OS. |
| La photo du collaborateur n'apparaît pas | Vérifiez que la colonne `Employee` pointe bien vers un collaborateur qui a une photo dans `Collaborateurs` ou un compte M365 valide. |
| Les icônes ne s'affichent pas (carrés vides) | Les noms d'icônes doivent correspondre aux icônes du fichier `src/common/utils/Icon.tsx` (43 icônes Lucide embarquées). |

---

## 11. Commandes Heft utiles (pour mémoire)

| Action | Commande |
|---|---|
| Démarrer le workbench local | `npm run start` (→ https://localhost:4321) |
| Builder en mode dev | `npm run dev` |
| Builder en production + sppkg | `npm run ship` |
| Nettoyer les artefacts | `npm run clean` |
| Générer Tailwind seul | `npm run build:tailwind` |
| Faire confiance au certificat dev | `npm run trust-cert` |
| Valider les schémas (listes) | `npm run validate` |

---

✅ **Fin de la procédure.** Si vous avez suivi ces étapes, en posant la seule
Web Part **IKA — Intranet (composant principal)** sur une section pleine
largeur d'une page du hub, vous obtenez une page d'accueil rigoureusement
identique à la maquette Next.js, avec :

- ✅ Hero slider auto-rotatif (5s) avec panneau de bienvenue, horloge temps
  réel, missions rotatives et KPIs
- ✅ Bandeau d'annonces défilant horizontalement
- ✅ Grille d'actualités avec effet hover
- ✅ Panneau d'accès rapide (documents épinglés + liens rapides + événements à
  venir)
- ✅ Galerie photos en mosaïque avec filtres
- ✅ Annuaire équipe avec recherche et anniversaires du mois
- ✅ Carte « Collaborateur du mois » + tableau de bord projets
- ✅ Animations de reveal au scroll
- ✅ Squelettes de chargement pendant le fetch
- ✅ Gestion gracieuse des listes vides
- ✅ Tailwind préfixé `ika-` (zéro conflit avec le CSS SharePoint)
