# 06 — Procédure de déploiement

## 1. Prérequis

| Élément | Détail |
|---|---|
| Rôle | Administrateur SharePoint **ou** Administrateur général |
| PnP PowerShell | 3.x — `Install-Module PnP.PowerShell -Scope CurrentUser` |
| App Catalog | Créé au niveau du tenant |
| Node.js | v22 LTS |
| Licences | Microsoft 365 avec SharePoint Online |

### Consentement PnP PowerShell

Depuis septembre 2024, PnP PowerShell exige une application Entra ID
enregistrée. À faire une seule fois :

```powershell
Register-PnPEntraIDApp -ApplicationName "PnP PowerShell IKA" `
                       -Tenant ikasolution.onmicrosoft.com `
                       -Interactive
```

Noter le `ClientId` retourné, puis se connecter avec :

```powershell
Connect-PnPOnline -Url $url -Interactive -ClientId "<CLIENT_ID>"
```

> Sans cette étape, `Connect-PnPOnline -Interactive` échoue avec une erreur
> de consentement. C'est le blocage n°1 des premiers déploiements.

---

## 2. Ordre d'exécution

Les scripts sont **idempotents** : les relancer ne duplique rien.

```powershell
cd spfx/provisioning/scripts

# 1. Sites + hub + navigation           (~10 min)
.\01-Create-Sites.ps1 `
    -TenantUrl "https://ikasolution-admin.sharepoint.com" `
    -OwnerEmail "admin@ikasolution.com"

# 2. Thème IKA                          (~2 min)
..\theme\ika-theme.ps1 `
    -TenantUrl "https://ikasolution-admin.sharepoint.com"

# 3. Listes via site scripts            (~15 min)
.\02-Deploy-SiteScripts.ps1 `
    -TenantUrl "https://ikasolution-admin.sharepoint.com"

# 4. Colonnes Lookup + index            (~10 min)
.\03-Add-Lookups.ps1 `
    -HubUrl "https://ikasolution.sharepoint.com/sites/ika-intranet"

# 5. Données de référence               (~5 min)
.\04-Import-SampleData.ps1 `
    -HubUrl "https://ikasolution.sharepoint.com/sites/ika-intranet"
```

### Pourquoi cet ordre est contraint

| Étape | Dépend de | Raison |
|---|---|---|
| 2 | 1 | Le thème s'applique à des sites qui doivent exister |
| 3 | 1 | Les site designs ciblent les sites |
| 4 | 3 | Un Lookup exige le GUID de la liste cible, créée en 3 |
| 5 | 4 | L'import renseigne des colonnes Lookup créées en 4 |

---

## 3. Limites des site scripts — et comment on les contourne

| Limite | Contournement |
|---|---|
| Pas de colonnes Lookup | Script 3 en PnP PowerShell |
| Pas d'index | Script 3 (`Set-PnPField -Values @{Indexed=$true}`) |
| Pas de suppression en cascade | Script 3, via le modèle objet CSOM |
| Pas de versioning | À activer manuellement ou par script complémentaire |
| Max 300 actions par script | On a scindé les listes du hub en 2 fichiers |
| Max 100 scripts par tenant | On en utilise 4 |
| Exécution asynchrone | `Start-Sleep` entre les applications |

### Activer le versioning et l'approbation

Non couvert par les site scripts, à exécuter après l'étape 3 :

```powershell
Connect-PnPOnline -Url $hubUrl -Interactive

Set-PnPList -Identity "Actualites" `
            -EnableVersioning $true `
            -MajorVersions 50 `
            -EnableModeration $true

Set-PnPList -Identity "Annonces" `
            -EnableVersioning $true `
            -EnableModeration $true

Set-PnPList -Identity "Documents" `
            -EnableVersioning $true `
            -EnableMinorVersions $true `
            -MajorVersions 100 `
            -MinorVersions 10
```

---

## 4. Déploiement du package SPFx

```bash
cd spfx
npm install
npm run ship          # heft bundle --ship && heft package-solution --ship
```

Puis téléverser `sharepoint/solution/ika-intranet.sppkg` dans l'App Catalog
et cocher **« Rendre cette solution disponible à tous les sites »**.

```powershell
Connect-PnPOnline -Url "https://ikasolution.sharepoint.com/sites/appcatalog" -Interactive

Add-PnPApp -Path ".\sharepoint\solution\ika-intranet.sppkg" `
           -Scope Tenant `
           -Publish `
           -SkipFeatureDeployment `
           -Overwrite
```

### Activer l'Application Customizer

```powershell
$sites = @(
    "https://ikasolution.sharepoint.com/sites/ika-intranet",
    "https://ikasolution.sharepoint.com/sites/ika-comptabilite",
    "https://ikasolution.sharepoint.com/sites/ika-administration",
    "https://ikasolution.sharepoint.com/sites/ika-commerciaux",
    "https://ikasolution.sharepoint.com/sites/ika-techniciens"
)

foreach ($site in $sites) {
    Connect-PnPOnline -Url $site -Interactive
    Add-PnPCustomAction `
        -Title "IKA Chrome" `
        -Name "IkaChrome" `
        -Location "ClientSideExtension.ApplicationCustomizer" `
        -ClientSideComponentId "<GUID_EXTENSION>" `
        -ClientSideComponentProperties '{"navigationSource":"hub","showFooter":true}' `
        -Scope Web
}
```

---

## 5. Vérification post-déploiement

```powershell
# Listes du hub — 16 attendues
Connect-PnPOnline -Url $hubUrl -Interactive
Get-PnPList | Where-Object { -not $_.Hidden } |
    Select-Object Title, ItemCount, @{N="Champs";E={ $_.Fields.Count }} |
    Format-Table

# Colonnes Lookup
Get-PnPField -List "Collaborateurs" |
    Where-Object { $_.TypeAsString -eq "Lookup" } |
    Select-Object InternalName, Title

# Index
Get-PnPField -List "Actualites" |
    Where-Object { $_.Indexed } |
    Select-Object InternalName
```

### Checklist fonctionnelle

- [ ] 5 sites créés et associés au hub
- [ ] Navigation du hub visible sur les 5 sites
- [ ] Thème IKA appliqué (bandeau bleu marine)
- [ ] 16 listes sur le hub, 4 listes sur chaque site département
- [ ] `DonneesFinancieres` présente sur Comptabilité uniquement
- [ ] Colonnes Lookup fonctionnelles (test de saisie)
- [ ] Cascade active sur `BordereauLignes`
- [ ] Données de référence importées (4 départements, 12 paramètres)
- [ ] Package déployé et web parts visibles dans la boîte à outils
- [ ] Header et footer IKA affichés

---

## 6. Reprise sur incident

### Un site script échoue partiellement

```powershell
Get-PnPSiteDesignRun -WebUrl $siteUrl |
    ForEach-Object { Get-PnPSiteDesignRunStatus -Run $_ } |
    Where-Object { $_.OutcomeCode -ne 0 }
```

Les site scripts sont rejouables : corriger le JSON, relancer le script 2.

### Supprimer une liste et la recréer

```powershell
Remove-PnPList -Identity "Actualites" -Force
Invoke-PnPSiteDesign -Identity $designId -WebUrl $siteUrl
```

### Nettoyage complet (environnement de test)

```powershell
Get-PnPSiteDesign | Where-Object { $_.Title -like "IKA*" } |
    ForEach-Object { Remove-PnPSiteDesign -Identity $_.Id -Force }

Get-PnPSiteScript | Where-Object { $_.Title -like "IKA*" } |
    ForEach-Object { Remove-PnPSiteScript -Identity $_.Id -Force }
```

> **Ne jamais exécuter le nettoyage en production.** Supprimer un site design
> n'efface pas les listes déjà créées, mais casse la traçabilité.

---

## 7. Stratégie multi-environnements

| Environnement | URL | Usage |
|---|---|---|
| DEV | `/sites/ika-intranet-dev` | Développement, données jetables |
| REC | `/sites/ika-intranet-rec` | Recette métier, données réalistes |
| PROD | `/sites/ika-intranet` | Production |

Les scripts acceptent `-TenantRoot` : le même code sert les 3 environnements.
Utiliser `-SkipDemo` sur `04-Import-SampleData.ps1` en production pour
n'importer que les référentiels sans le contenu de démonstration.
