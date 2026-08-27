# 13 — Guide : création des listes/bibliothèques & installation

> Guide **pratique pas-à-pas** pour faire fonctionner la Web Part
> **« IKA Solution — Portail Intranet »** (`IntranetMainWebPart`) sur un site
> SharePoint Online.
>
> Public cible : **site owner** (pas besoin de droits tenant — le package est
> déployé dans le catalogue d'applications du site grâce à
> `skipFeatureDeployment: true`, comme le package Coris).
>
> 📌 Ce guide cible **le composant principal** (celui qui est réellement
> packagé par `config/config.json`). Il ne couvre que les **15 listes /
> bibliothèques qu'il lit réellement** (pas les 20 du schéma complet).

---

## 0. Ce dont la Web Part a besoin (récap)

La Web Part lit les données **au chargement** (une seule requête en parallèle).
Voici les listes, **avec l'emplacement exact** où la Web Part va les chercher :

| # | Liste / Biblio | Type | Lue sur | Obligatoire |
|---|---|---|---|---|
| 1 | `Actualites` | Liste | site courant | ✅ |
| 2 | `Documents` | **Bibliothèque** | site courant | ✅ |
| 3 | `Evenements` | Liste (calendrier) | site courant | ✅ |
| 4 | `LiensRapides` | Liste | site courant | ✅ |
| 5 | `Departements` | Liste | hub | ✅ |
| 6 | `Collaborateurs` | Liste | hub | ✅ |
| 7 | `Annonces` | Liste | hub | ✅ |
| 8 | `Projets` | Liste | hub | ✅ |
| 9 | `Galerie` | **Bibliothèque** | hub | ✅ |
| 10 | `CollaborateurDuMois` | Liste | hub | ✅ |
| 11 | `HeroSlides` | **Bibliothèque** | hub | ✅ |
| 12 | `Missions` | Liste | hub | ✅ |
| 13 | `Indicateurs` | Liste | hub | ✅ |
| 14 | `Histoire` | Liste | hub | ✅ (frise) |
| 15 | `FAQ` | Liste | hub | ✅ |
| 16 | `Commentaires` | Liste | site courant | ✅ (page de détail actualité) |

> ⚠️ **Cas "démarrage rapide" (recommandé)** : créez **TOUTES** les listes sur
> le **même site** que la page (site courant = hub). La Web Part retombe alors
> naturellement sur le site courant pour les listes "hub" si le site n'est pas
> rattaché à un hub. C'est le plus simple et le plus sûr.

### 0.1 Règle d'or des noms internes

- Le **nom affiché** de chaque liste/bibliothèque doit être **exactement** celui
  du tableau (ex. `Actualites`, pas `Actualités`, pas `Actualite`).
- SharePoint génère le **nom interne** à partir du nom saisi **au moment de la
  création**. La Web Part fait `lists/getByTitle('Actualites')`.
- Les **noms de colonnes** (interne) doivent correspondre aux tableaux §2–§5 :
  - **Anglais, sans accent, sans espace** (`DocCategory`, pas `Catégorie document`).
  - Si le nom n'est pas exact → la requête échoue **silencieusement** et la Web
    Part affiche les **données de démonstration** (avec le bandeau d'avertissement).

---

## 1. Prérequis

| Élément | Comment |
|---|---|
| Compte **site owner** sur le site SharePoint | Pour créer listes + déployer le package |
| Node.js **v22 LTS** | Pour builder le `.sppkg` (voir §7) |
| Le package `.sppkg` **déjà généré** | `spfx/sharepoint/solution/ika-intranet.sppkg` |
| **Affichage simplifié** activé sur le site | Requis pour les colonnes **Image** (voir §6) |

---

## 2. Créer une **liste** simple (ex. `Actualites`, `Annonces`, `Missions`…)

1. Dans le site SharePoint → **Contenu du site** (⚙️ Réglages → Contenu du site).
2. **Nouveau → Liste** → choisir **Liste vide** (modèle « Liste vide »).
3. Nom : `Actualites` (exactement). Valider.
4. Ajouter les colonnes (voir §2.1) :
   - **+ Ajouter une colonne → Texte / Note / Choix / Date / Oui-Non / Personne**.
   - Saisir le **nom affiché** = nom interne du tableau (ex. `Excerpt`, `Category`).
5. Pour un champ **Choix**, renseigner les options (voir tableaux).
6. Pour une colonne **Personne** : type « Personne ou groupe ».
7. Terminer, puis publier un premier élément de test.

### 2.1 Colonnes pour `Actualites` (Liste)

| Nom affiché = interne | Type | Options / remarque |
|---|---|---|
| `Title` | Texte | Titre (obligatoire) |
| `Excerpt` | Note | Résumé |
| `Body` | Note | Contenu (facultatif) |
| `Category` | Choix | `Entreprise` · `RH` · `Projet` · `Finance` · `Administration` · `Commercial` · `Technique` · `Événement` · `DevOps` · `Formation` · `Cybersécurité` · `Innovation` |
| `NewsAuthor` | Personne | Auteur |
| `PublishDate` | Date | Date et heure |
| `HeaderImage` | Image | Voir §6 |
| `Highlighted` | Oui/Non | À la une |
| `ExternalLink` | Lien | Facultatif |
| `SortOrder` | Nombre | Ordre |

### 2.2 Colonnes pour `Commentaires` (Liste)

> Désactiver **versioning** et **approbation de contenu** sur cette liste
> (paramètres de la liste → Paramètres avancés) — l'inverse d'`Actualites` :
> un commentaire doit s'afficher immédiatement.

1. **Contenu du site → Nouveau → Liste → Liste vide**, nom : `Commentaires`.
2. `Title` (déjà présent) : laisser tel quel, rempli automatiquement par le
   code — ne rien saisir manuellement dessus.
3. `CommentText` : **+ Ajouter une colonne → Plusieurs lignes de texte (Note)**.
4. `NewsItem` : **+ Ajouter une colonne → Plus... → Recherche**, puis :
   - Liste source : `Actualites`
   - Colonne à afficher : `Title`
   - Cocher **Obligatoire**, puis **Indexer cette colonne** (paramètres de la
     colonne, en bas) — la Web Part filtre les commentaires par article.
5. Ne **rien** créer pour l'auteur ou la date : ce sont les champs système
   `Author`/`Created`, remplis automatiquement par SharePoint à chaque ajout.

---

## 3. Créer une **liste calendrier** (ex. `Evenements`)

> `Evenements` doit être de type **Calendrier** car la Web Part lit `EventDate`,
> `EndDate` et `fAllDayEvent` (champs système du modèle Calendrier).

1. **Contenu du site → Nouveau → Liste**.
2. Choisir le modèle **Calendrier** (pas « Liste vide »).
3. Nom : `Evenements`. Valider.
4. Ajouter les colonnes supplémentaires :
   - `Location` (Texte), `EventCategory` (Choix), `EventDescription` (Note),
     `EventImage` (Image), `RegistrationLink` (Lien), `Organizer` (Personne),
     `IsMandatory` (Oui/Non).
5. ⚠️ **Ne pas recréer** `EventDate`, `EndDate`, `fAllDayEvent` : ils existent
   déjà dans le modèle Calendrier.

---

## 4. Créer une **bibliothèque de documents** (ex. `Documents`)

> `Documents` est une **bibliothèque de documents**, pas une liste.

1. **Contenu du site → Nouveau → Bibliothèque de documents**.
2. Nom : `Documents`. Valider.
3. Ajouter les colonnes métier :

| Nom affiché = interne | Type |
|---|---|
| `Title` | Texte |
| `DocCategory` | Choix : `Procédure` · `Modèle` · `Contrat` · `Rapport` · `Facture` · `Politique` · `Guide` · `Présentation` · `Formulaire` · `Autre` |
| `DocDescription` | Note |
| `Confidentiality` | Choix : `Public` · `Interne` · `Confidentiel` |
| `ExpiryDate` | Date |
| `DocOwner` | Personne |
| `IsPinned` | Oui/Non |
| `BusinessVersion` | Texte |

4. Déposez au moins un document de test.
5. La Web Part déduit automatiquement type/date/àuteur depuis les **métadonnées
   natives** du fichier (`File_x0020_Type`, `Modified`, `Editor`) : rien à créer.

---

## 5. Créer une **bibliothèque de galerie** (ex. `Galerie`, `HeroSlides`)

> `Galerie` (photothèque) et `HeroSlides` (carrousel) sont des **bibliothèques
> de documents** où l'on **dépose des images**. `HeroSlides` ajoute des colonnes
> de carrousel.

**`Galerie` :**
1. **Contenu du site → Nouveau → Bibliothèque de documents** → nom `Galerie`.
2. Colonnes : `Caption` (Texte), `GalleryCategory` (Choix), `PhotoDate` (Date),
   `IsFeatured` (Oui/Non), `AltText` (Texte), `SortOrder` (Nombre).
3. Déposez des images (JPG/PNG).

**`HeroSlides` :**
1. **Bibliothèque de documents** → nom `HeroSlides`.
2. Colonnes : `Caption` (Texte, obligatoire), `SubCaption` (Texte),
   `SlideLink` (Lien), `CtaLabel` (Texte), `SortOrder` (Nombre),
   `IsActive` (Oui/Non, mettre **Oui**), `StartDate` (Date), `EndDate` (Date),
   `AltText` (Texte).
3. Déposez au moins une grande image de fond, et réglez `IsActive = Oui`.

> ⚠️ **`IsActive = Oui` indispensable** : la requête filtre
> `IsActive eq 1`. Sans cela le carrousel est vide → bandeau d'avertissement.

---

## 6. Activer les **colonnes Image** (mode « Affichage simplifié »)

Les colonnes de type **Image** (`HeaderImage`, `EventImage`, `Photo`, images
des bibliothèques) ne s'affichent pas si le mode « Affichage simplifié »
(*modern form mode*) est désactivé sur le site.

1. **Réglages du site → Fonctionnalités du site** (ou Settings → Site features).
2. Activer : **« Affichage simplifié »** (*Simplify page authoring and
   commenting experience* / *Modern form mode*).
3. Recharger le site.

---

## 7. Installation du package (déploiement)

### 7.1 Builder le `.sppkg` (une fois)

```bash
cd spfx
npm ci
npm run build        # génère spfx/sharepoint/solution/ika-intranet.sppkg
```

> ✅ Vérifié : le build passe et le CSS Tailwind `ika-` est bien compilé dans le
> bundle. Le `.sppkg` ne doit **pas** être commité (artefact gitignoré).

### 7.2 Déployer dans le catalogue d'applications du **site** (site owner)

1. Aller sur le site : `https://<tenant>.sharepoint.com/sites/<votre-site>`.
2. **Réglages (⚙️) → Ajouter une application** → **« Catalogue d'applications »**
   (si absent, utiliser l'URL directe du catalogue de site).
3. Dans le catalogue : **Nouveau → Fichier** → déposer
   `spfx/sharepoint/solution/ika-intranet.sppkg`.
4. Une boîte de dialogue s'ouvre : cliquer **Déployer** (Deploy).
   - Comme `skipFeatureDeployment: true`, **aucun droit tenant n'est requis**.
5. Retourner sur le site : **Ajouter une application** → rechercher
   **IKA Solution** → cliquer **Ajouter**.

> 🛠️ Si vous êtes **admin du tenant**, vous pouvez aussi déployer dans le
> **catalogue d'applications de l'organisation** pour le mettre à disposition
> sur tous les sites.

### 7.3 Ajouter la Web Part sur une page

1. Ouvrir (ou créer) une page dans le site.
2. **Modifier la page** → section **pleine largeur** (colonne unique).
   - En éditeur de page moderne : **+ (Ajouter une section) → Pleine largeur**.
3. **+ (Ajouter une Web Part)** → rechercher **IKA Solution**.
4. Choisir **« IKA Solution — Portail Intranet »**.
5. **Publier** la page.

> 💡 La Web Part est **autosuffisante** : posée une seule fois en pleine largeur,
> elle rend le header IKA, toute la page d'accueil (hero, annonces, actualités,
> accès rapide, galerie, équipe, collaborateurs du mois, projets, portails
> départementaux) et le footer IKA — **comme la maquette Next.js**.

### 7.4 Vérifier en mode lecture (pas en édition)

Le **chrome plein écran** (`fullPageChrome`) ne s'applique qu'**en mode lecture**
pour ne pas casser l'édition. Si la page semble "normale" en édition, c'est
**normal** : publiez puis ouvrez en lecture pour voir le rendu plein écran.

---

## 8. Alimenter le contenu (ordre conseillé)

| Ordre | Liste | À saisir |
|---|---|---|
| 1 | `Departements` | 4 départements + `SiteUrl` |
| 2 | `Collaborateurs` | Annuaire (remplir `Manager` pour l'organigramme) |
| 3 | `HeroSlides` | Images + `IsActive = Oui` |
| 4 | `Missions` / `Indicateurs` | Mission/vision/valeurs + KPIs |
| 5 | `Annonces` / `Actualites` | Annonces + actualités |
| 6 | `Documents` / `LiensRapides` / `Evenements` | Docs, liens, agenda |
| 7 | `Galerie` / `CollaborateurDuMois` / `Projets` / `FAQ` | Images, star du mois, projets, FAQ |
| 8 | `Histoire` | Jalons (frise) |

---

## 9. Tests de validation (à faire sur la page publiée)

| # | Test | Attendu |
|---|---|---|
| 1 | Recharger la page 3× | Rendu stable, pas de cadre vide |
| 2 | Console (F12) | Aucune erreur rouge ; `React.version` = `17.0.1` |
| 3 | État chargement | Squelette animé, puis contenu |
| 4 | Liste vide (vider une liste) | Message, pas de disparition silencieuse |
| 5 | Liste renommée (pour tester) | **Bandeau d'avertissement** visible |
| 6 | 2 Web Parts sur la même page | Aucune fuite de style |
| 7 | Responsive 320 / 768 / 1024 / 1920 px | Mise en page correcte |
| 8 | Mode édition | Poignées + volet de propriétés fonctionnels |

---

## 10. Dépannage courant

| Symptôme | Cause probable | Correctif |
|---|---|---|
| **Écran blanc** sur la Web Part | Violation des Règles des Hooks (corrigé) ; ou erreur JS | Vérifier la console, `React.version` |
| **Données de démo affichées + bandeau** | Nom de liste/colonne interne incorrect, ou liste absente | Vérifier les noms §0.1 / §2–5 |
| **Carrousel / galerie vides** | `IsActive` non réglé, ou colonne Image sans mode simplifié | Activer §6, régler `IsActive` |
| **Organigramme vide** | `Manager` non renseigné dans `Collaborateurs` | Renseigner `Manager` |
| **Logo cassé dans le header** | `logo.png` absent de `SiteAssets` | Déposer `SiteAssets/logo.png` (ou régler l'URL logo) |
| **Rendu normal en édition mais pas en lecture** | Comportement normal du chrome plein écran | Publier puis vérifier en lecture |
| **Photos/vignettes manquantes** | Mode « Affichage simplifié » inactif | §6 |

---

## 11. Pour aller plus loin

- Tables de colonnes **complètes** : `docs/10-listes-a-creer.md`.
- Schémas détaillés, vues, indexation : `docs/02-listes-sharepoint.md`.
- Sécurité & permissions des listes : `docs/07-securite-gouvernance.md`.
- Review déploiement & points corrigés : `docs/12-review-deploiement.md`.
