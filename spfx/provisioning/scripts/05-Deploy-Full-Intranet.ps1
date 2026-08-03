<#
.SYNOPSIS
    Provisionnement complet de l'Intranet IKA Solution sur un site unique.

.DESCRIPTION
    Ce script automatise :
    1. La création du site hub unique.
    2. Le déploiement de toutes les listes (News, Documents, Collaborateurs, etc.).
    3. La création des bibliothèques de documents par département.
    4. La création des pages (Comptabilité, Administration, etc.).
    5. Le placement et la configuration des Web Parts SPFx sur les pages.
    6. L'importation des données de démonstration.

.EXAMPLE
    .\05-Deploy-Full-Intranet.ps1 -TenantUrl "https://votre-tenant-admin.sharepoint.com" -OwnerEmail "admin@votre-tenant.com"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$TenantUrl,

    [Parameter(Mandatory = $true)]
    [string]$OwnerEmail,

    [Parameter(Mandatory = $false)]
    [string]$SiteAlias = "ika-intranet-v2"
)

$ErrorActionPreference = "Stop"
$TenantRoot = $TenantUrl -replace "-admin\.sharepoint\.com", ".sharepoint.com"
$SiteUrl = "$TenantRoot/sites/$SiteAlias"

Write-Host "=== 1. Création du Site Hub Unique ===" -ForegroundColor Cyan
Connect-PnPOnline -Url $TenantUrl -Interactive
$existing = Get-PnPTenantSite -Identity $SiteUrl -ErrorAction SilentlyContinue
if ($null -eq $existing) {
    New-PnPSite -Type CommunicationSite -Title "IKA Solution Intranet" -Url $SiteUrl -Owner $OwnerEmail -Lcid 1036 -TimeZone 2 -Wait | Out-Null
    Write-Host "Site créé : $SiteUrl" -ForegroundColor Green
} else {
    Write-Host "Site déjà existant." -ForegroundColor DarkGray
}

Write-Host "`n=== 2. Déploiement des Listes via Site Scripts ===" -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$jsonDir = Join-Path (Split-Path -Parent $scriptRoot) "site-scripts"
$scripts = @("01-departement-lists.json", "02-hub-lists.json", "03-hub-lists-suite.json", "04-finance-list.json", "05-consolidated-site.json")

foreach ($s in $scripts) {
    $content = Get-Content (Join-Path $jsonDir $s) -Raw -Encoding UTF8
    $title = "IKA-Temp-$s"
    $script = Add-PnPSiteScript -Title $title -Content $content
    Invoke-PnPSiteDesign -Identity (Add-PnPSiteDesign -Title $title -SiteScriptIds $script.Id -WebTemplate CommunicationSite).Id -WebUrl $SiteUrl | Out-Null
    # Clean up temp designs/scripts if needed, but keeping them for now is fine for demo
}

Write-Host "`n=== 3. Création des Pages et Web Parts ===" -ForegroundColor Cyan

# Web Part IDs
$wpIds = @{
    "HeroSlider" = "7e3a2b5d-1c4f-4d8a-ea21-9b5c3d7e8f02"
    "NewsList"   = "6f2b1c48-0d3a-4e7b-9a15-8c4d2e6f7a91"
    "DeptHero"   = "2f8b7c0e-6d9a-4e3b-f57c-4c0d8e2f3a57"
    "DocsList"   = "8b4d3e6a-2f5c-4a9d-b137-0e6f4a8b9c13"
    "Finance"    = "5a1c0d3f-9e2b-4f6c-a209-7d3e1f5a6b8a"
}

function Setup-Page {
    param($Name, $Title, $Slug, $DocsList)
    
    Write-Host "  Configuration de la page : $Title" -ForegroundColor Green
    $page = Add-PnPPage -Name $Name -LayoutType Article -Title $Title -ErrorAction SilentlyContinue
    if ($null -eq $page) { $page = Get-PnPPage -Identity $Name }
    
    # Add DeptHero
    Add-PnPPageWebPart -Page $page -DefaultWebPartType Custom -WebPartId $wpIds["DeptHero"] -WebPartProperties @{departementSlug=$Slug} -Section 1 -Column 1
    
    # Add News specific to dept
    Add-PnPPageWebPart -Page $page -DefaultWebPartType Custom -WebPartId $wpIds["NewsList"] -WebPartProperties @{scope=$Slug; title="Actualités du département"} -Section 2 -Column 1
    
    # Add Documents
    Add-PnPPageWebPart -Page $page -DefaultWebPartType Custom -WebPartId $wpIds["DocsList"] -WebPartProperties @{listName=$DocsList; title="Documents $Title"} -Section 2 -Column 2
}

Setup-Page -Name "Comptabilite.aspx" -Title "Comptabilité" -Slug "comptabilite" -DocsList "Documents_Comptabilite"
Setup-Page -Name "Administration.aspx" -Title "Administration" -Slug "administration" -DocsList "Documents_Administration"
Setup-Page -Name "Commerciaux.aspx" -Title "Commerciaux" -Slug "commerciaux" -DocsList "Documents_Commerciaux"
Setup-Page -Name "Techniciens.aspx" -Title "Techniciens" -Slug "techniciens" -DocsList "Documents_Techniciens"

Write-Host "`n=== 4. Importation des Données === " -ForegroundColor Cyan
# On réutilise le script existant en adaptant l'URL
& (Join-Path $scriptRoot "04-Import-SampleData.ps1") -HubUrl $SiteUrl

Write-Host "`n=== Provisionnement Terminé ===" -ForegroundColor Green
Write-Host "Accédez à votre intranet : $SiteUrl"
