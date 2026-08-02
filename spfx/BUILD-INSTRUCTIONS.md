# Instructions de build et déploiement – Intranet IKA Solution

## Prérequis

- Node.js **18.17.1** (version LTS recommandée)
- PowerShell 7+
- SharePoint Online Management Shell + PnP.PowerShell

```powershell
Install-Module PnP.PowerShell -Scope CurrentUser
```

## 1. Build du package SPFx (sur ta machine locale)

```bash
cd spfx
npm install
npm run build
```

Le fichier généré sera :
```
spfx/solution/ika-intranet.sppkg
```

## 2. Provisioning des listes + données (à exécuter une seule fois)

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

## 3. Déploiement du package SPFx

1. Aller dans l’**App Catalog** du tenant
2. Upload du fichier `ika-intranet.sppkg`
3. Déployer l’application
4. Ajouter les web parts sur la page d’accueil du hub

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
Le client verra donc un intranet **identique** dès l’installation.

---

**Prochaine étape recommandée** : exécuter le provisioning sur le tenant de test du client.
