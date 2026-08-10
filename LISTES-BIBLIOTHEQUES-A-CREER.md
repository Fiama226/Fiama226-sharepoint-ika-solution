# 🗂️ Listes & Bibliothèques à créer pour l'intranet IKA (SharePoint)

> Ce document explique **quoi créer** dans SharePoint Online pour que la Web Part
> **« IKA Solution — Portail Intranet »** affiche exactement la maquette Next.js :
> les **bibliothèques** (documents, galerie, visuels du carrousel) et les **listes**
> (actualités, annonces, équipe, projets…), avec leur emplacement, leurs colonnes
> et les fichiers à y déposer.
>
> 📄 Détails complets (colonnes, choix, vues, indexation) : [`spfx/docs/02-listes-sharepoint.md`](spfx/docs/02-listes-sharepoint.md)
> · Mode d'emploi pas-à-pas : [`spfx/docs/10-listes-a-creer.md`](spfx/docs/10-listes-a-creer.md) · [`spfx/docs/13-guide-creation-listes-installation.md`](spfx/docs/13-guide-creation-listes-installation.md)
> · Import des données : [`sharepoint-ready-data/README-IMPORT-2026.md`](sharepoint-ready-data/README-IMPORT-2026.md)

---

## 1. Vue d'ensemble

L'intranet est organisé en **1 site hub** (accueil) + **1 site de communication par département**
(Comptabilité, Administration, Commerciaux, Techniciens).

| Où ? | Ce qu'on y crée |
|---|---|
| **Site hub** (accueil) | `Documents`, `Galerie`, `HeroSlides` (bibliothèques) + 15 listes |
| **Chaque site département** | `Documents_<Département>` (bibliothèque) + listes locales `Actualites`, `Evenements`, `LiensRapides` |
| **Tous les sites** | Les fichiers de marque dans `SiteAssets` (logo, photos) |

> 💡 **Minimum vital pour l'accueil** : les éléments marqués **🏠** suffisent pour
> reconstituer la page d'accueil de la maquette. Le reste alimente les vues
> (Histoire, Organigramme, Bordereau…) et les sites départementaux.

---

## 2. Les bibliothèques (repositories) à créer

### 2.1 `SiteAssets` — Logo & photos de marque *(existe déjà, à alimenter)*

Bibliothèque **par défaut** de chaque site (ne rien créer, juste **uploader des fichiers**).

| Fichier | Emplacement cible | Utilisé par |
|---|---|---|
| `public/assets/logo.png` | `SiteAssets/logo.png` | Header (logo 64 px) + Footer |
| `public/assets/team/DG.jpg` | `SiteAssets/team/DG.jpg` | Fondateur (Histoire), collaborateur YAYA Ouattara |
| `public/assets/team/Serge.jpg` | `SiteAssets/team/Serge.jpg` | **Collaborateur du mois** (carte navy) |
| `public/assets/team/serge.jpg`, `daouda.jpg`, `sandrine.jpg`, `Martin.jpg`, `roukie.jpg`, `victorine.jpg`, `aminata.jpg`, `landry.jpeg` | `SiteAssets/team/` | Cartes « Notre équipe » + profil header |
| `public/assets/team/12-Modifier.jpg`, `13-Modifier.jpg`, `14-Modifier.jpg` | `SiteAssets/team/` | Visuels du **carrousel** (référence via `HeroSlides`) |

> 📁 Les fichiers sources se trouvent dans `public/assets/` du dépôt. Le
> checklist de recette (`spfx/docs/14-design-fidelity-checklist.md` §0.4) détaille
> l'upload.

---

### 2.2 `Documents` — Bibliothèque documentaire *(template 101)*

| Élément | Valeur |
|---|---|
| Type | Bibliothèque de documents (template **101**) |
| Emplacement | **Hub** : `Documents` · **Sous-sites** : `Documents_Comptabilite`, `Documents_Administration`, `Documents_Commerciaux`, `Documents_Techniciens` |
| Rôle | Alimente la section **« Documents clés »** de l'accueil (documents épinglés) et la vue **Documents** |

**Colonnes à ajouter** (en plus de `Title` / `FileLeafRef` système) :

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Catégorie | `DocCategory` | Choix : `Procédure` · `Modèle` · `Contrat` · `Rapport` · `Facture` · `Politique` · `Guide` · `Présentation` · `Formulaire` · `Autre` | Oui |
| Description | `DocDescription` | Note | Non |
| Confidentialité | `Confidentiality` | Choix : `Public` · `Interne` · `Confidentiel` | Oui |
| Date d'expiration | `ExpiryDate` | Date | Non |
| Propriétaire | `DocOwner` | Personne | Oui |
| Épinglé | `IsPinned` | Oui/Non | Non (mettre **Oui** sur les 6 documents « clés » à afficher sur l'accueil) |
| Version métier | `BusinessVersion` | Texte | Non |

**Fichiers d'exemple à déposer** (contenu initial, depuis `sharepoint-ready-data/Documents.csv`) :
`charte-dev.pdf` (Charte Développement), `patterns-archi.pdf` (Architecture Patterns),
`templates-projets.docx` (Templates de Projets), `pipeline-ci-cd.pdf` (Processus CI/CD),
`politique-depenses.pdf` (Politique de Dépenses), `guide-cybersecurite.pdf` (Guide Cybersécurité).

---

### 2.3 `Galerie` — Photothèque *(template 109 — Bibliothèque d'images)*

| Élément | Valeur |
|---|---|
| Type | **Bibliothèque d'images** (template **109**) — génère les miniatures automatiquement |
| Emplacement | **Hub uniquement** |
| Rôle | Alimente la section **« Galerie »** de l'accueil (mosaïque + lightbox) |

**Colonnes à ajouter** :

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Légende | `Caption` | Texte | Oui |
| Catégorie | `GalleryCategory` | Choix : `Événements` · `Formation` · `Projets` | Non |
| Date photo | `PhotoDate` | Date | Non |
| À la une | `IsFeatured` | Oui/Non | Non |
| Texte alternatif | `AltText` | Texte | Non |
| Ordre | `SortOrder` | Nombre | Non |

**Contenu initial** (8 photos, références Unsplash dans `sharepoint-ready-data/Galerie.csv`) :
All Hands Tech — Q2 2026, Workshop Architecture Cloud, Sprint Review Q1, Demo Day — Projets IA,
Audit Cybersécurité S1, Déploiement Infrastructure AWS, Soirée Annuelle Tech Awards, Hackathon Interne 2026.

---

### 2.4 `HeroSlides` — Carrousel d'accueil *(template 101)*

| Élément | Valeur |
|---|---|
| Type | Bibliothèque (template **101**) — l'image est le contenu principal |
| Emplacement | **Hub uniquement** |
| Rôle | Alimente le **hero slider** de l'accueil (3 diapositives plein écran) |

**Colonnes à ajouter** :

| Affichage | Interne | Type | Requis |
|---|---|---|---|
| Légende | `Caption` | Texte | Oui |
| Sous-légende | `SubCaption` | Texte | Non |
| Lien | `SlideLink` | Lien | Non |
| Texte bouton | `CtaLabel` | Texte | Non |
| Ordre | `SortOrder` | Nombre | Oui |
| Actif | `IsActive` | Oui/Non | Oui |
| Début / Fin | `StartDate` / `EndDate` | Date | Non |
| Texte alt | `AltText` | Texte | Non |

**Contenu initial** (3 diapositives) :
1. `12-Modifier.jpg` — « Construire le digital de demain, aujourd'hui. » (Innovation · Agilité · Excellence)
2. `13-Modifier.jpg` — « Des équipes expertes au service de vos projets. » (Développement · Architecture · Data)
3. `14-Modifier.jpg` — « Ensemble, nous transformons les idées en solutions. » (Cloud · IA · Cybersécurité)

> 💡 Les visuels peuvent être uploadés dans cette bibliothèque (colonne `FileRef`)
> **ou** référencés par URL externe (les fichiers `12/13/14-Modifier.jpg` de
> `SiteAssets/team/` conviennent aussi).

---

## 3. Les listes à créer (17 listes)

| # | Liste | Type | Emplacement | Rôle / Web Part utilisatrice | CSV d'import |
|---|---|---|---|---|---|
| 1 | `Actualites` 🏠 | Liste (100) | Hub + chaque département | Actualités (grille accueil + vue Actualités) | `Actualites.csv` |
| 2 | `Annonces` 🏠 | Liste (100) | Hub | Bandeau défilant + vue Annonces | `Annonces.csv` |
| 3 | `Departements` 🏠 | Liste (100) | Hub | Référentiel départements (menu, cartes) | `Departements.csv` |
| 4 | `Collaborateurs` 🏠 | Liste (100) | Hub | Annuaire « Notre équipe », organigramme, profil | `Collaborateurs.csv` |
| 5 | `CollaborateurDuMois` 🏠 | Liste (100) | Hub | Carte navy « Collaborateur du mois » | `CollaborateurDuMois.csv` |
| 6 | `Projets` 🏠 | Liste (100) | Hub | Tableau de bord Projets | `Projets.csv` |
| 7 | `Galerie` 🏠 | **Bibliothèque** (109) | Hub | Section Galerie (voir §2.3) | `Galerie.csv` |
| 8 | `HeroSlides` 🏠 | **Bibliothèque** (101) | Hub | Hero slider (voir §2.4) | `HeroSlides.csv` |
| 9 | `Missions` 🏠 | Liste (100) | Hub | Mission / Vision / Valeurs (panneau hero) | `Missions.csv` |
| 10 | `Indicateurs` 🏠 | Liste (100) | Hub | KPI hero + chiffres clés Histoire | `Indicateurs.csv` |
| 11 | `Evenements` 🏠 | Liste calendrier | Hub + chaque département | Événements (accès rapide + vue Agenda) | `Evenements.csv` |
| 12 | `LiensRapides` 🏠 | Liste (100) | Hub + chaque département | Colonne « Accès rapide » | `LiensRapides.csv` |
| 13 | `Histoire` | Liste (100) | Hub | Frise chronologique (vue Histoire) | `Histoire.csv` |
| 14 | `Organigramme` | Liste (100) | Hub | Directions (style des cartes) de l'organigramme | `Organigramme.csv` |
| 15 | `BordereauPrix` | Liste (100) | Hub | En-têtes des bordereaux de prix | `BordereauPrix.csv` |
| 16 | `BordereauLignes` | Liste (100) | Hub | Lignes des bordereaux | `BordereauLignes.csv` |
| 17 | `ParametresSite` | Liste (100) | Hub | Configuration du site | `ParametresSite.csv` |
| 18 | `FAQ` | Liste (100) | Hub | Foire aux questions (vue FAQ) | — (à saisir) |
| 19 | `DonneesFinancieres` | Liste (100) | Hub | Séries des graphiques financiers | `DonneesFinancieres.csv` |
| 20 | `Documents` 🏠 | **Bibliothèque** (101) | Hub + sous-sites | Documents clés + vue Documents (voir §2.2) | `Documents.csv` |

> **Légende** : 🏠 = requis pour la page d'accueil · Les schémas complets de colonnes
> sont dans [`spfx/docs/10-listes-a-creer.md`](spfx/docs/10-listes-a-creer.md)
> (Partie A : listes locales département · Partie B : listes du hub).

---

## 4. Ordre de création recommandé

1. **Sites** : créer le site hub + les 4 sites de communication départements, les associer au hub.
2. **Bibliothèques** : créer `Documents` (hub + sous-sites), `Galerie`, `HeroSlides`.
3. **Listes référentielles** : `Departements`, `Collaborateurs` (elles servent de cibles aux Recherches/Lookup).
4. **Listes de contenu** : `Actualites`, `Annonces`, `Evenements`, `LiensRapides`, `Missions`, `Indicateurs`, `Projets`, `CollaborateurDuMois`, `Histoire`, `Organigramme`, `FAQ`, `ParametresSite`, `DonneesFinancieres`, `BordereauPrix`, `BordereauLignes`.
5. **SiteAssets** : uploader `logo.png` + photos `team/` (voir §2.1).
6. **Importer les données** : pour chaque liste, utiliser la **Modification rapide** (Quick Edit) avec le CSV correspondant de `sharepoint-ready-data/` — suivre [`sharepoint-ready-data/README-IMPORT-2026.md`](sharepoint-ready-data/README-IMPORT-2026.md) (colonnes Image/Personne/Lookup/Lien à renseigner à la main après import).
7. **Déployer la Web Part** et vérifier avec la [checklist de fidélité](spfx/docs/14-design-fidelity-checklist.md).

---

## 5. Récapitulatif rapide (à coller dans un ticket)

```
Bibliothèques :
☐ SiteAssets        → logo.png + team/*.jpg          (existe déjà)
☐ Documents         → 101 · hub + Documents_<Département> sur chaque sous-site
☐ Galerie           → 109 (bibliothèque d'images) · hub
☐ HeroSlides        → 101 · hub

Listes :
☐ Departements  ☐ Collaborateurs  ☐ Actualites  ☐ Annonces  ☐ Evenements
☐ LiensRapides  ☐ Missions        ☐ Indicateurs  ☐ Projets   ☐ CollaborateurDuMois
☐ Histoire      ☐ Organigramme    ☐ FAQ          ☐ ParametresSite
☐ DonneesFinancieres  ☐ BordereauPrix  ☐ BordereauLignes

Import : sharepoint-ready-data/*.csv via Modification rapide (19 fichiers)
```
