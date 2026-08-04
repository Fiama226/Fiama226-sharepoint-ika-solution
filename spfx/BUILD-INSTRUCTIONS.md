# Instructions de build et déploiement – Intranet IKA Solution

## Prérequis

- **Node.js 22 LTS** (version exacte recommandée : `22.11.0`)
- **npm 10+**
- PowerShell 7+ (pour le provisioning)
- SharePoint Online Management Shell + PnP.PowerShell
- **Docker 24+** (optionnel, pour le workbench conteneurisé)

```powershell
Install-Module PnP.PowerShell -Scope CurrentUser
```

> ⚠️ L'environnement est désormais orchestré par **Heft** (Rush Stack),
> plus par Gulp. Les commandes `gulp serve` / `gulp bundle` n'existent plus.

---

## 1. Build du package SPFx

### Option A — Build local avec Node

```bash
cd spfx
npm install
npm run build        # équivalent à : heft test --production && heft package-solution --production
```

Le fichier généré est :
```
spfx/sharepoint/solution/ika-intranet.sppkg
```

### Option B — Build dans Docker (sans rien installer sur la machine)

```bash
cd spfx

# 1) Construire l'image de prod
docker build -t ika-spfx:builder --target builder .

# 2) Extraire le .sppkg
mkdir -p out
docker run --rm \
  -v "$(pwd)/out:/out" \
  ika-spfx:builder \
  sh -c "cp -v /app/sharepoint/solution/*.sppkg /out/"

ls -la out/
```

---

## 2. Lancer le workbench en local (dev)

### Option A — Heft directement (mode natif)

```bash
cd spfx
npm install
npm run trust-cert        # une seule fois : génère le certificat dev
npm run start             # → https://localhost:4321
```

Puis ouvrir dans le navigateur :
```
https://localhost:4321/_layouts/15/workbench.aspx
```

> Le workbench charge le bundle depuis le dev-server Heft et permet
> de tester les web parts sans les déployer sur SharePoint.

### Option B — Docker (workbench isolé, identique à tous les postes)

```bash
cd spfx

# Premier lancement (construit l'image dev)
docker compose up -d spfx-workbench

# Voir les logs
docker compose logs -f spfx-workbench

# Ouvrir : https://localhost:4321/_layouts/15/workbench.aspx
```

Modifier un fichier sous `spfx/src/` → Heft recompile automatiquement
(montage en volume `bind` dans `docker-compose.yml`).

Pour rebuild Tailwind à la volée après modif du `tailwind.config.js` :
```bash
docker compose exec spfx-workbench npm run build:tailwind
```

> 💡 Adapter la cible SharePoint via les variables d'environnement
> `TENANT_URL` et `HUB_URL` du `docker-compose.yml` (ou un fichier
> `.env` à côté).

### Shell interactif (debug, eject-webpack, etc.)

```bash
docker compose run --rm --profile shell spfx-shell
# dans le conteneur :
heft eject-webpack
```

---

## 3. Provisioning des listes + données (à exécuter une seule fois)

```powershell
cd spfx/provisioning/scripts

# 1. Créer le hub + listes
.\01-Create-Sites.ps1 -HubUrl "https://ikasolution.sharepoint.com/sites/ika-intranet"

# 2. Déployer les Site Scripts
.\02-Deploy-SiteScripts.ps1 -HubUrl "https://ikasolution.sharepoint.com/sites/ika-intranet"

# 3. Ajouter les lookups
.\03-Add-Lookups.ps1 -HubUrl "https://ikasolution.sharepoint.com/sites/ika-intranet"

# 4. Importer toutes les données (News, Events, QuickLinks, Annonces, Projets, Galerie, etc.)
.\04-Import-SampleData.ps1 -HubUrl "https://ikasolution.sharepoint.com/sites/ika-intranet"
```

---

## 4. Déploiement du package SPFx

1. Aller dans l'**App Catalog** du tenant
2. Upload du fichier `ika-intranet.sppkg`
3. Déployer l'application
4. Ajouter les web parts sur la page d'accueil du hub

---

## Commandes npm utiles

| Commande | Effet |
|---|---|
| `npm run clean` | Supprime `lib/`, `temp/`, etc. |
| `npm run build:tailwind` | Compile `src/styles/tailwind.css` → `lib/styles/tailwind.css` |
| `npm run test` | Lance `heft test` (lint + TS) |
| `npm run build` | Build de production (test + package-solution) |
| `npm run bundle` | Génère le bundle JS sans packager |
| `npm run package` | Crée le `.sppkg` à partir d'un bundle existant |
| `npm run start` | Lance le workbench Heft |
| `npm run dev` | `build:tailwind` + `start` |
| `npm run ship` | Pipeline complet production (test + bundle + package) |
| `npm run trust-cert` | Génère le certificat dev (à faire 1 fois) |
| `npm run eject-webpack` | Exporte la config webpack du rig pour customization lourde |
| `npm run validate` | Valide les artefacts de provisioning |

---

## Web Parts disponibles

- `HeroSlider`
- `NewsCards`
- `QuickAccessPanel`
- `AnnouncementMarquee`
- `EventsCalendar`
- `Gallery`
- `TeamDirectory`
- `OrgChart`
- `IntranetSections`
- `DocumentsList`
- etc.

## Note importante

Le provisioning crée **toutes** les listes et les remplit avec les mêmes données que le site Next.js.
Le client verra donc un intranet **identique** dès l'installation.

---

**Prochaine étape recommandée** : exécuter le provisioning sur le tenant de test du client.
