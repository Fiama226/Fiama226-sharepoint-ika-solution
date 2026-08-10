# Import des données SharePoint — Guide complet (août 2026)

> Ce dossier contient les **fichiers CSV** prêts à importer dans les listes et
> bibliothèques SharePoint de l'intranet IKA, généré à partir des **vraies
> données dummy** du site Next.js (`data/*.ts` + pages inline).
>
> **Objectif** : après création manuelle des listes/colonnes (voir l'audit),
> tu Importes ces CSV via la vue **Quick Edit** (Modification rapide) de chaque
> liste. Cela donne une parité 1:1 avec la maquette Next.js en quelques minutes.

---

## ⚠️ Colonnes qui NE PEUVENT PAS être importées par CSV

Ces types de colonnes SharePoint ne sont pas pris en charge par Quick Edit / Import CSV.
Elles doivent être **renseignées manuellement après import**, par item, dans l'interface web.

| Type de colonne | Listes concernées | Commentaire |
|---|---|---|
| **Image** (`Photo`, `HeaderImage`, `EventImage`, `MilestoneImage`, slides) | Collaborateurs, CollaborateurDuMois, HeroSlides, Galerie, Evenements, Histoire, Actualites | Uploader le fichier image OU saisir une URL externe (Unsplash) dans le champ — voir §3 |
| **Personne/Groupe** (`NewsAuthor`, `DocOwner`, `Organizer`, `ProjectManager`, `UserAccount`, `SalesRep`) | Actualites, Documents, Evenements, Projets, Collaborateurs, BordereauPrix | Taper le nom/email du compte M365 (recherche en ligne) |
| **Recherche/Lookup** (`Department`, `Manager`, `Employee`, `RelatedPerson`, `Quote`) | Collaborateurs, Annonces, CollaborateurDuMois, Projets, Organigramme, BordereauLignes | Sélectionner l'item référencé dans la liste cible |
| **Lien hypertexte** (`SiteUrl`, `LinkUrl`, `SlideLink`, `ExternalLink`, `LinkedInUrl`) | Departements, LiensRapides, HeroSlides, Actualites, Collaborateurs | Taper l'URL + description dans le champ lié |
| **Pièce jointe** | (non utilisé ici) | — |

> 💡 **Astuce** : les colonnes **Texte, Note, Nombre, Date, Oui/Non, Choix** s'importent
> toutes en CSV. C'est pourquoi les CSV ci-dessous ne contiennent que ces types de colonnes —
> les autres te restent à remplir après import (instructions dans le §3 ci-dessous).

---

## 1. Ordre d'import OBLIGATOIRE (respect des Lookups)

Importe les CSV **dans cet ordre**. Les listes avec lookup doivent être importées
**après** la liste qu'elles référencent.

```
 1. Departements        ← CSV : Departements.csv
 2. Missions            ← CSV : Missions.csv
 3. Indicateurs         ← CSV : Indicateurs.csv
 4. ParametresSite      ← CSV : ParametresSite.csv   (badge + footer header)
 5. LiensRapides        ← CSV : LiensRapides.csv
 6. Collaborateurs      ← CSV : Collaborateurs.csv   (lookup Department : à remplir après)
 7. Annonces            ← CSV : Annonces.csv         (lookup RelatedPerson : à remplir après)
 8. CollaborateurDuMois ← CSV : CollaborateurDuMois.csv (lookup Employee/Department : après)
 9. Projets             ← CSV : Projets.csv          (lookup Department : à remplir après)
10. Histoire            ← CSV : Histoire.csv         (Image : ajouter URL après)
11. Organigramme        ← CSV : Organigramme.csv     (lookup Department : à remplir après)
12. BordereauPrix       ← CSV : BordereauPrix.csv
13. BordereauLignes     ← CSV : BordereauLignes.csv  (lookup Quote : à remplir après)
14. DonneesFinancieres  ← CSV : DonneesFinancieres.csv
15. Evenements          ← Calendrier : saisie manuelle (voir §3) — pas de CSV
16. HeroSlides          ← Bibliothèque : upload images (voir §3) — pas de CSV
17. Galerie             ← Bibliothèque : upload images (voir §3) — pas de CSV
18. Documents_*         ← 4 bibliothèques : upload fichiers (voir §3) — pas de CSV
19. Actualites          ← CSV : Actualites.csv      (Person NewsAuthor + Image : après)
```

> ⚠️ **Evenements / HeroSlides / Galerie / Documents** sont des **calendriers et
> bibliothèques** : on **Uploade les fichiers** directement, puis on complète
> les colonnes via Quick Edit OU fiche par fiche. Pas de CSV/depuis Excel pour eux.

---

## 2. Méthode d'import (Quick Edit)

Pour chaque **Liste** (pas bibliothèque) :

1. Va sur la liste → menu **⋮** (à droite du titre de la liste) → **Modifier la vue** ou
   mieux : ⚙️ → **Modifier la vue** → choisir la vue **Tous les éléments**.
2. Clique sur le bouton **« Modifier » (crayon ✏️)** ou **« Modifier en mode Feuille »**
   (selon ta version de SharePoint : sur la liste → menu **Editer** → choisir la vue
   en grille / Quick Edit).
3. Une grille de type Excel s'ouvre. Tu peux :
   - **(A)** Copier les lignes du CSV (ouvre-le dans Excel) → Coller directement dans
     la grille. SharePoint crée les nouveaux items à la volée.
   - **(B)** Ou utiliser **Importer** depuis Excel si ta version propose le bouton.
4. **Vérifie que lesvaleurs de choix correspondent exactement** ( majuscules, accents).
5. Reviens en mode affichage normal → les items sont créés.
6. Puis **remplis les colonnes Lookup/Personne/Image/Lien manuellement** (voir §3).

> 📌 L'ouverture du CSV dans **Excel** avant copier-coller est recommandée pour
> éviter les problèmes d'encodage. Le fichier est en UTF-8 : si Excel affiche des
> accents mal décodés, ouvre avec **Données → À partir d'un texte/CSV → UTF-8**.

---

## 3. Instructions par liste pour les colonnes manuelles

### 3.1 `HeroSlides` (Bibliothèque — images carrousel)
1. Crée la bibliothèque (Gear → Add an app → Document library → « HeroSlides »).
2. Ajoute les colonnes Choice/Text/Yes-No du schéma (Caption, SubCaption, SlideLink, CtaLabel, SortOrder, IsActive, StartDate, EndDate, AltText).
3. **Upload** les 3 images depuis `public/assets/team/` :
   - `12-Modifier.jpg`, `13-Modifier.jpg`, `14-Modifier.jpg`.
4. Pour chaque image, clique sur son nom → « Modifier » (iℹ️) → remplir les colonnes :
   - `Caption`: "Construire le digital de demain, aujourd'hui." / "Des équipes expertes au service de vos projets." / "Ensemble, nous transformons les idées en solutions."
   - `SubCaption`: "Innovation · Agilité · Excellence" / "Développement · Architecture · Data" / "Cloud · IA · Cybersécurité"
   - `SortOrder`: 1, 2, 3   |   `IsActive`: Oui (les 3).

### 3.2 `Galerie` (Bibliothèque — photos)
1. Crée la bibliothèque « Galerie ». Ajoute colonnes Caption/GalleryCategory/PhotoDate/IsFeatured/AltText/SortOrder.
2. **Download & Upload** les 8 photos Unsplash depuis `data/home.ts galleryImages` :
   - https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800 — « All Hands Tech — Q2 2026 », Cat. `Événements`
   - https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800 — « Workshop Architecture Cloud », `Formation`
   - https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800 — « Sprint Review Q1 », `Projets`
   - https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800 — « Demo Day — Projets IA », `Événements`
   - https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800 — « Audit Cybersécurité S1 », `Formation`
   - https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800 — « Déploiement Infrastructure AWS », `Projets`
   - https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800 — « Soirée Annuelle Tech Awards », `Événements`
   - https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800 — « Hackathon Interne 2026 », `Projets`
3. Remplir `SortOrder` 1..8 et `IsFeatured` = Oui pour la 1ère, Non le reste.

### 3.3 `Collaborateurs.Photo` (Image)
- 8 photos disponibles dans `public/assets/team/` : DG.jpg, serge.jpg, daouda.jpg, sandrine.jpg, Martin.jpg, roukie.jpg, victorine.jpg, aminata.jpg.
- Pour chaque collaborateur, ouvrir « Modifier » → champ `Photo` → **Upload** du fichier local OU coller l'URL relative SharePoint une fois la photo upload dans une bib. « PhotosEquipe » (à créer).
- **Solo local** (workbench / SPFx local) : la WP repli sur la photo de profil M365 si `UserAccount` est renseigné — donc lier le compte M365 (`UserAccount`) évite d'avoir à uploader les photos.

### 3.4 `CollaborateurDuMois`
1. Importe le CSV (1 ligne).
2. **Après import** : ouvrir l'item → `Employee` = lookup → choix « SERGE GEDEON OUE » dans la liste Collaborateurs → enregistrer.
3. `Photo` → upload serge.jpg (cf. 3.3).

### 3.5 `ParametresSite` — pas de colonne manuelle — Import direct via CSV
Aucune colonne Lookup/Image/Person. C'est de la clé/valeur pure → Import direct depuis `ParametresSite.csv`. **Indispensable** pour le header/footer IKA.

### 3.6 `Actualites` (4 lignes home)
1. Importe `Actualites.csv`.
2. **Après** : `NewsAuthor` = Personne → taper « Awa Kaboré » (un collaborateur de la liste, ou un compte M365 fictif). La WP utilise `NewsAuthor/Title` dans la REST.
3. `HeaderImage` = Image → coller l'URL Unsplash de chaque item (du CSV `Actualites.csv` ligne `image`).

### 3.7 `Evenements` (Calendrier)
- Crée via **Gear → Add an app → Calendar**, nom « Evenements ».
- Ajoute les colonnes Location/EventCategory/EventDescription/EventImage/RegistrationLink/Organizer/IsMandatory/Scope (Choice) — voir §Evenements dans l'audit.
- **Pas de CSV**. Saisie manuelle fiche par fiche (22 événements). Source :
  `data/events.ts`. Champs : Title, EventDate (= date + time ISO), EndDate
  (= evenement ajouter 1h), Location, EventCategory, Scope.

### 3.8 `Documents_Comptabilite` / `Documents_Administration` / `Documents_Commerciaux` / `Documents_Techniciens` (Bibliothèques par département)
1. Crée les 4 bibliothèques (noms exacts ; voir audit ajusté).
2. Ajoute les colonnes DocCategory/DocDescription/Confidentiality/ExpiryDate/DocOwner/IsPinned/BusinessVersion sur chacune.
3. **Crée des fichiers placeholder** (PDF/DOCX/XLSX vides) avec le nom exact du doc
   (ex. « Charte informatique IKA Solution.pdf ») et upload. C'est SharePoint — la
   bibliothèque = fichiers. Le contenu n'a pas d'importance pour la maquette.
4. Remplir Title, DocCategory, etc., via Quick Edit.

### 3.9 `BordereauLignes.Quote` (Lookup)
Après import du CSV, ouvrir chaque ligne → `Quote` → sélectionner l'item de `BordereauPrix` correspondant.

### 3.10 Departements.SiteUrl
- **Laisser vide** dans le CSV (colonne vide). Le code SPFx reconstruit
  l'URL vers `Documents_<SlugCapitalise>` sur le site courant (voir audit ajusté).
- Si tu veux forcer, mets l'URL absolue vers `AllItems.aspx` de la bibliothèque cible.

---

## 4. Liste des fichiers CSV générés (ce dossier)

| # | Fichier | Liste cible | Lignes | Type de colonnes à remplir manuellement |
|---|---|---|---|---|
| 1 | `Departements.csv` | Departements | 4 | SiteUrl (Lien) — laisser vide recommandé |
| 2 | `Missions.csv` | Missions | 3 | aucune |
| 3 | `Indicateurs.csv` | Indicateurs | 3 | aucune |
| 4 | `ParametresSite.csv` | ParametresSite | 14 | aucune |
| 5 | `LiensRapides.csv` | LiensRapides | 30 | LinkUrl (Lien) |
| 6 | `Collaborateurs.csv` | Collaborateurs | 22 | Department (Lookup), Manager (Lookup), Photo (Image), UserAccount (Personne), LinkedInUrl (Lien) |
| 7 | `Annonces.csv` | Annonces | 4 | RelatedPerson (Lookup) |
| 8 | `CollaborateurDuMois.csv` | CollaborateurDuMois | 1 | Employee (Lookup), Department (Lookup), Photo (Image) |
| 9 | `Projets.csv` | Projets | 4 | ProjectManager (Personne), Department (Lookup) |
| 10 | `Histoire.csv` | Histoire | 6 | MilestoneImage (Image) |
| 11 | `Organigramme.csv` | Organigramme | 4 | Department (Lookup) |
| 12 | `BordereauPrix.csv` | BordereauPrix | 1 | SalesRep (Personne) |
| 13 | `BordereauLignes.csv` | BordereauLignes | 1 | Quote (Lookup) |
| 14 | `DonneesFinancieres.csv` | DonneesFinancieres | 5 charges + 5 clients | aucune |
| 15 | `Actualites.csv` | Actualites | 4 | NewsAuthor (Personne), HeaderImage (Image) |

**Bibliothèques/Calendrier** (pas de CSV) : HeroSlides, Galerie, Documents_*, Evenements.

---

## 5. Problèmes fréquents — dépannage

| Symptôme | Cause | Solution |
|---|---|---|
| Excel n'a pas de bouton pour importer le CSV | S'attendre à coller dans le mode grille | Utiliser le mode **Quick Edit** (Modifier en mode Feuille) de SharePoint, pas un import fichier |
| Accents affichés en `Ã©` ou `Ã ` | Encodage UTF-8 non détecté par Excel | Ouvrir Excel → **Données → À partir d'un texte/CSV → encodage UTF-8** |
| Les valeurs de choix échouent (lignes en erreur) | Choix pas exact (casse/accents) | Vérifier les valeurs ; recréer la colonne choice avec les valeurs exactes |
| Lookup vide après import | S'attendre à les remplir après | Les lookups ne s'importent pas en CSV ; ouvrir item par item |
| `Scope eq 'comptabilite'` renvoie 0 ligne | La valeur choice n'est pas `comptabilite` | Recréer la colonne `Scope` avec exactement `global`, `comptabilite`, `administration`, `commerciaux`, `techniciens` |
| Photos manquantes | Pas d'image uploadée | Uploader dans bib. dédiée OU lier `UserAccount` au M365 (repli automatique) |
| La home montre « Kontent momentanément indisponible » | Une liste n'existe pas encore | Créer les 13 listes « Home » au minimum ; voir ordre §1 |

---

## 6. Vérifications à la fin

1. **13 listes home** créées et peuplées (Departements, Missions, Indicateurs, ParametresSite, LiensRapides, Collaborateurs, Annonces, CollaborateurDuMois, Projets, HeroSlides, Galerie, Documents, Actualites).
2. **4 bibliothèques départementales** créées et peuplées de fichiers placeholder.
3. **Colonne `Scope`** ajoutée sur Actualites/LiensRapides avec les 5 valeurs exactes.
4. **Lookups** renseignés (Department sur Collaborateurs/Projets/Organigramme, Employee sur CollaborateurDuMois, RelatedPerson sur Annonces, Manager auto self-lookup, Quote sur BordereauLignes).
5. **ParametresSite** a 14 lignes (sinon footer header cesse d'être IKA).
6. **SiteUrl** sur Departements laissé vide (le SPFx reconstruit l'URL de bib.).

> Si ces 6 points sont en ordre, la home SharePoint rendra à l'identique de la
> maquette Next.js.
