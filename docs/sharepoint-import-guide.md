# Guide de Déploiement SharePoint — Intranet IKA Solution

Ce guide et les fichiers générés dans le dossier **`sharepoint-ready-data/`** vous permettent de créer et configurer en quelques minutes votre intranet SharePoint 100% fidèle à la maquette Next.js, **sans sous-sites par département**, en utilisant une architecture plate avec des bibliothèques de documents et listes SharePoint.

---

## 📁 1. Fichiers prêts à l'upload (`sharepoint-ready-data/`)

Tous les fichiers CSV et Excel (`.xlsx`) nécessaires ont été générés à partir des données sources de l'application :

| Fichier | Correspondance SharePoint | Description |
|---|---|---|
| `1_Company_Settings.xlsx` | Paramètres du site / Entête | Informations légales, coordonnées de IKA Solution |
| `2_Departments.xlsx` | Liste *Departments* | Définition des 4 départements (Comptabilité, Administration, Commerciaux, Techniciens) |
| `3_News.xlsx` | Liste *IKASolution_News* | Actualités globales et par département |
| `4_Documents.xlsx` | Bibliothèque *IKASolution_Documents* | Métadonnées des documents et liens utiles |
| `5_Team_Directory.xlsx` | Liste *IKASolution_Team* | Annuaire des collaborateurs par département |
| `6_Events.xlsx` | Liste *IKASolution_Events* | Agenda et événements |
| `7_Quick_Links.xlsx` | Liste *IKASolution_QuickLinks* | Accès rapides et raccourcis par espace |
| `8_Home_Collaborators.xlsx` | Liste *Home_Collaborators* | Équipe dirigeante, collaborateurs et anniversaires (Accueil) |
| `9_Home_Projects.xlsx` | Liste *Home_Projects* | Suivi des projets en cours (Accueil) |
| `10` à `13` (News, Events, Gallery, Announcements) | Listes Accueil | Éléments visuels spécifiques de la page d'accueil |
| `IKA_Solution_Intranet_Master.xlsx` | Classeur Excel Global | Regroupe tous les onglets ci-dessus dans un seul fichier |

---

## 🏛️ 2. Architecture SharePoint sans sous-sites (Dépôts de fichiers)

Pour répondre à votre exigence (**pas de sous-sites pour les départements, les départements sont des répertoires de fichiers**), l'architecture recommandée sur SharePoint est la suivante :

1. **Un Site Principal unique** : Créez un **Site de communication** SharePoint (ex: *Intranet IKA Solution*).
2. **Gestion des départements par Métadonnées (`Scope`)** :
   - Au lieu de créer des sous-sites (ex: `/sites/intranet/comptabilite`), toutes les listes (Actualités, Documents, Événements, Liens, Annuaire) possèdent une colonne de choix ou de texte appelée **`scope`** (ou `Department`).
   - Valeurs possibles : `global` (visible sur la page d'accueil et partout), `comptabilite`, `administration`, `commerciaux`, `techniciens`.
3. **Dépôts de documents (File Repositories)** :
   - Créez une bibliothèque de documents principale (ou 4 bibliothèques distinctes au niveau racine du site) :
     - 📂 `Comptabilite-Docs`
     - 📂 `Administration-Docs`
     - 📂 `Commerciaux-Docs`
     - 📂 `Techniciens-Docs`
   - Vous pouvez également utiliser une seule bibliothèque avec une colonne de métadonnées `Département` pour filtrer par vues SharePoint sans quitter le site principal.

---

## 🖼️ 3. Guide d'intégration et gestion des images

Pour que vos web parts et composants affichent les bonnes images (avatars, bannières, galeries) :

### Étape A : Préparer la bibliothèque *Site Assets* (Actifs du site)
1. Dans votre site SharePoint, allez dans **Contenu du site** > **Site Assets** (Actifs du site).
2. Créez une structure de dossiers propre :
   ```text
   SiteAssets/
   ├── assets/
       ├── team/
       │   ├── DG.jpg
       │   ├── serge.jpg
       │   ├── daouda.jpg
       │   ├── sandrine.jpg
       │   ├── Martin.jpg
       │   ├── roukie.jpg
       │   ├── victorine.jpg
       │   └── aminata.jpg
       └── news/
           └── (bannières d'actualités)
   ```

### Étape B : Uploader les images
- Uploadez vos images (comme celles présentes dans le projet Next.js sous `public/assets/team/`) dans le dossier `/SiteAssets/assets/team/`.

### Étape C : Référencer les images dans vos listes SharePoint
Dans vos listes SharePoint (créées à partir de nos fichiers Excel), la colonne `avatar` ou `image` contient des chemins relatifs ou absolus :
- **Option 1 (Chemin SharePoint)** : `/sites/VotreIntranet/SiteAssets/assets/team/serge.jpg`
- **Option 2 (URLs Externes / Unsplash)** : Les liens Unsplash utilisés dans les données d'exemple fonctionneront immédiatement.
- **Option 3 (Projet Next.js / SPFx)** : Si vous utilisez le code Next.js ou SPFx, placez vos images dans `public/assets/team/` pour qu'elles soient servies localement.

---

## 📥 4. Comment importer les fichiers Excel dans SharePoint

Pour chaque liste SharePoint que vous souhaitez créer :

1. Rendez-vous sur votre accueil SharePoint.
2. Cliquez sur **Nouveau** > **Liste**.
3. Choisissez **À partir d'Excel** (*From Excel*).
4. Sélectionnez le fichier `.xlsx` correspondant dans le dossier **`sharepoint-ready-data/`** (par exemple `3_News.xlsx` ou `IKA_Solution_Intranet_Master.xlsx`).
5. SharePoint détecte automatiquement les colonnes (titre, date, auteur, catégorie, scope...).
6. Validez les types de colonnes (Texte, Date et heure, Choix, etc.) et cliquez sur **Créer**.

---

## 🔗 5. Correspondance des champs (Schéma des listes)

### Liste `IKASolution_News` (Actualités)
- `id` : Texte (Identifiant unique)
- `scope` : Choix (`global`, `comptabilite`, `administration`, `commerciaux`, `techniciens`)
- `title` : Texte (Titre de l'actualité)
- `excerpt` : Texte multiligne (Résumé)
- `category` : Texte ou Choix (`entreprise`, `rh`, `projet`, `finance`, `admin`, `commercial`, `technique`, `evenement`)
- `author` : Texte (Auteur / Service)
- `date` : Date
- `highlighted` : Oui/Non (Booléen)

### Bibliothèque ou Liste `IKASolution_Documents`
- `id` : Texte
- `scope` : Choix (`global`, `comptabilite`, ... )
- `title` : Texte (Nom du fichier)
- `type` : Choix (`pdf`, `docx`, `xlsx`, `pptx`, `link`, `folder`)
- `modifiedAt` : Date
- `modifiedBy` : Texte
- `size` : Texte (ex: `1,4 Mo`)

### Liste `IKASolution_Team` (Annuaire)
- `id` : Texte
- `scope` : Choix
- `name` : Texte (Nom complet)
- `role` : Texte (Fonction / Poste)
- `email` : E-mail
- `phone` : Texte
- `location` : Texte (ex: `Paris (siège)`, `Ouagadougou`)

### Liste `IKASolution_Events` (Agenda)
- `id` : Texte
- `scope` : Choix
- `title` : Texte
- `date` : Date
- `time` : Texte (ex: `09:30`)
- `location` : Texte
- `category` : Texte
