# Provisioning IKA Intranet — Guide d'utilisation

> Script unique : `Deploy-IkaIntranet.ps1`
> Crée toutes les listes, colonnes (y compris Lookups), importe les données CSV
> et upload les images pour reproduire **exactement** la maquette Next.js.

---

## Prérequis

| Élément | Version / détail |
|---|---|
| **PnP.PowerShell** | 3.x — `Install-Module PnP.PowerShell -Scope CurrentUser` |
| **Droits** | Propriétaire du site `/sites/ikareview` (création de listes + upload fichiers) |
| **Node.js** | v22 LTS (pour le build `.sppkg` — déjà fait) |
| **Fichiers CSV** | `../sharepoint-ready-data/*.csv` (générés) |
| **Images** | `../public/assets/team/*.jpg` (hero + collaborateurs) |

> ⚠️ Si tu n'as pas PnP.PowerShell 3.x : `Install-Module PnP.PowerShell -Scope CurrentUser -Force`

---

## Déploiement en 3 étapes

### Étape 1 — Uploader le `.sppkg` dans l'App Catalog

1. Va sur le **catalogue d'applications** de ton tenant
2. Upload `spfx/sharepoint/solution/ika-intranet.sppkg`
3. Coche **"Rendre cette solution disponible sur tous les sites"** (ou déploie site par site)
4. Clique **Déployer**

### Étape 2 — Installer l'app sur le site

1. Va sur `https://<tenant>.sharepoint.com/sites/ikareview`
2. ⚙️ → **Ajouter une application**
3. Cherche **IKA Intranet** → **Ajouter**

### Étape 3 — Lancer le provisioning (UNE SEULE FOIS)

```powershell
# Se connecter au site
Connect-PnPOnline -Url "https://<tenant>.sharepoint.com/sites/ikareview" -Interactive

# Lancer le provisioning
cd provisioning
.\Deploy-IkaIntranet.ps1
```

Le script va :
1. ✅ Créer toutes les listes et bibliothèques (19 listes + 4 bibliothèques départementales)
2. ✅ Créer toutes les colonnes avec les noms internes exacts (Text, Note, Number, Choice, Boolean, DateTime, URL, Image, Lookup, User, Currency)
3. ✅ Créer les colonnes Lookup (`Department`, `Manager`, `Employee`, `RelatedPerson`, `Quote`)
4. ✅ Importer toutes les données depuis les CSV (28 collaborateurs, 30 liens, 4 annonces, 4 projets, 6 jalons, 4 départements, etc.)
5. ✅ Upload les 3 images Hero (depuis `public/assets/team/`)
6. ✅ Télécharger et upload les 8 images Galerie (Unsplash)
7. ✅ Upload les 8 photos de collaborateurs
8. ✅ Créer 23 fichiers placeholder pour les bibliothèques Documents
9. ✅ Indexer les colonnes filtrées (performance)
10. ✅ Créer les vues utiles (Accueil sur Actualites, Homepage sur Projets)

---

## Ce que tu fais après le script

1. **Aller sur la page d'accueil** du site
2. Cliquer **Modifier** ✏️
3. Changer la section en **PLEINE LARGEUR**
4. Ajouter la Web Part : **IKA — Intranet (composant principal)**
5. Configurer : Hauteur Hero = Grande (70vh), Couleur d'accent = Orange IKA
6. **Publier**

🎉 La page est identique à la maquette Next.js.

---

## Relancer le script (idempotent)

Le script est **idempotent** : tu peux le relancer sans risque de duplication.
Utile si :
- Tu as modifié les CSV et veux réimporter
- Tu as supprimé une liste par erreur

```powershell
.\Deploy-IkaIntranet.ps1
```

Options :
- `-SkipDataImport` : ne réimporte pas les CSV (utile pour re-uploader les images seulement)
- `-SkipImages` : ne réupload pas les images (utile pour réimporter les données seulement)
- `-DryRun` : affiche ce qui serait fait sans rien modifier

---

## Dépannage

| Problème | Cause | Solution |
|---|---|---|
| `Connect-PnPOnline` échoue | Pas de PnP.PowerShell 3.x | `Install-Module PnP.PowerShell -Scope CurrentUser -Force` |
| "Access denied" sur une liste | Droits insuffisants | Vérifier que tu es propriétaire du site |
| Images Hero manquantes | Fichiers `public/assets/team/` absents | Uploader manuellement les 3 images dans `HeroSlides` |
| Galerie vide | Pas d'accès internet (Unsplash) | Télécharger les 8 images et uploader manuellement |
| Lookups vides | Les listes sources n'existent pas | Vérifier que `Departements` et `Collaborateurs` sont créées avant les Lookups |
| "Contenu momentanément indisponible" | Listes pas encore créées | Relancer le script |
| CSV non importés | Encodage UTF-8 BOM | Les CSV sont déjà en UTF-8 BOM — vérifier avec Excel |

---

## Limitations connues

| Limitation | Impact | Contournement |
|---|---|---|
| Lookups ne peuvent pas être créées avant leur liste cible | Le script les crée dans le bon ordre | Si tu modifies l'ordre, relance le script |
| Images externes (Unsplash) nécessitent internet | Si pas d'accès, uploader manuellement | Télécharger les images d'abord |
| Fichiers Documents sont des placeholders vides | Pour la maquette seulement | Remplacer par les vrais fichiers plus tard |
| Thème IKA (couleurs) nécessite droits tenant admin | Pas de script dans ce fichier | Utiliser `provisioning/theme/ika-theme.ps1` séparément |

---

## Fichiers du provisioning

```
provisioning/
├── Deploy-IkaIntranet.ps1   ← Script principal (à exécuter)
└── README.md                ← Ce fichier
```

Le script ne modifie **que** le site `/sites/ikareview`. Aucun autre site n'est affecté.
