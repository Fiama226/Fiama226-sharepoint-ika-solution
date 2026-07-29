<#
.SYNOPSIS
    Publie les site scripts, cree les site designs et les applique aux sites.

.DESCRIPTION
    Etape 2 du provisioning. Cree toutes les listes decrites dans
    docs/02-listes-sharepoint.md, hors colonnes Lookup (etape 3).
    Idempotent : les scripts existants sont mis a jour, pas dupliques.

.EXAMPLE
    .\02-Deploy-SiteScripts.ps1 -TenantUrl "https://ikasolution-admin.sharepoint.com"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$TenantUrl,

    [Parameter(Mandatory = $false)]
    [string]$TenantRoot = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($TenantRoot)) {
    $TenantRoot = $TenantUrl -replace "-admin\.sharepoint\.com", ".sharepoint.com"
}

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$jsonPath   = Join-Path (Split-Path -Parent $scriptRoot) "site-scripts"

$definitions = @(
    @{
        File        = "01-departement-lists.json"
        Title       = "IKA - Listes departement"
        Description = "Actualites, Documents, Evenements, Liens rapides"
    }
    @{
        File        = "02-hub-lists.json"
        Title       = "IKA - Listes hub (1/2)"
        Description = "Departements, Collaborateurs, Annonces, Projets, Galerie, HeroSlides, Parametres, FAQ"
    }
    @{
        File        = "03-hub-lists-suite.json"
        Title       = "IKA - Listes hub (2/2)"
        Description = "Collaborateur du mois, Missions, Indicateurs, Histoire, Organigramme, Bordereaux"
    }
    @{
        File        = "04-finance-list.json"
        Title       = "IKA - Donnees financieres"
        Description = "Series chiffrees du tableau de bord comptabilite"
    }
)

Write-Host "=== Connexion au tenant ===" -ForegroundColor Cyan
Connect-PnPOnline -Url $TenantUrl -Interactive

$scriptIds = @{}

Write-Host "`n=== Publication des site scripts ===" -ForegroundColor Cyan

foreach ($def in $definitions) {
    $path = Join-Path $jsonPath $def.File

    if (-not (Test-Path $path)) {
        Write-Warning "  Fichier introuvable : $path"
        continue
    }

    $content = Get-Content -Path $path -Raw -Encoding UTF8

    try {
        $null = $content | ConvertFrom-Json
    }
    catch {
        Write-Error "  JSON invalide dans $($def.File) : $_"
        continue
    }

    $existing = Get-PnPSiteScript | Where-Object { $_.Title -eq $def.Title }

    if ($null -ne $existing) {
        Write-Host "  Mise a jour : $($def.Title)" -ForegroundColor Yellow
        Set-PnPSiteScript -Identity $existing.Id -Content $content | Out-Null
        $scriptIds[$def.Title] = $existing.Id
    }
    else {
        Write-Host "  Creation : $($def.Title)" -ForegroundColor Green
        $new = Add-PnPSiteScript -Title $def.Title `
                                 -Description $def.Description `
                                 -Content $content
        $scriptIds[$def.Title] = $new.Id
    }
}

Write-Host "`n=== Creation des site designs ===" -ForegroundColor Cyan

$designs = @(
    @{
        Title   = "IKA - Site departement"
        Scripts = @("IKA - Listes departement")
        Desc    = "Structure standard d'un site departemental IKA Solution"
    }
    @{
        Title   = "IKA - Hub intranet"
        Scripts = @("IKA - Listes hub (1/2)", "IKA - Listes hub (2/2)")
        Desc    = "Structure du hub intranet IKA Solution"
    }
    @{
        Title   = "IKA - Comptabilite"
        Scripts = @("IKA - Listes departement", "IKA - Donnees financieres")
        Desc    = "Site departement + donnees financieres"
    }
)

$designIds = @{}

foreach ($design in $designs) {
    $ids = @()
    foreach ($name in $design.Scripts) {
        if ($scriptIds.ContainsKey($name)) { $ids += $scriptIds[$name] }
    }

    if ($ids.Count -eq 0) {
        Write-Warning "  Aucun script pour $($design.Title), design ignore."
        continue
    }

    $existing = Get-PnPSiteDesign | Where-Object { $_.Title -eq $design.Title }

    if ($null -ne $existing) {
        Write-Host "  Mise a jour : $($design.Title)" -ForegroundColor Yellow
        Set-PnPSiteDesign -Identity $existing.Id `
                          -SiteScriptIds $ids `
                          -Description $design.Desc | Out-Null
        $designIds[$design.Title] = $existing.Id
    }
    else {
        Write-Host "  Creation : $($design.Title)" -ForegroundColor Green
        $new = Add-PnPSiteDesign -Title $design.Title `
                                 -SiteScriptIds $ids `
                                 -WebTemplate CommunicationSite `
                                 -Description $design.Desc
        $designIds[$design.Title] = $new.Id
    }
}

Write-Host "`n=== Application aux sites ===" -ForegroundColor Cyan

$targets = @(
    @{ Url = "$TenantRoot/sites/ika-intranet";       Design = "IKA - Hub intranet" }
    @{ Url = "$TenantRoot/sites/ika-comptabilite";   Design = "IKA - Comptabilite" }
    @{ Url = "$TenantRoot/sites/ika-administration"; Design = "IKA - Site departement" }
    @{ Url = "$TenantRoot/sites/ika-commerciaux";    Design = "IKA - Site departement" }
    @{ Url = "$TenantRoot/sites/ika-techniciens";    Design = "IKA - Site departement" }
)

foreach ($target in $targets) {
    if (-not $designIds.ContainsKey($target.Design)) {
        Write-Warning "  Design manquant : $($target.Design)"
        continue
    }

    Write-Host "  $($target.Url)" -ForegroundColor Green
    Write-Host "    -> $($target.Design)" -ForegroundColor DarkGray

    Invoke-PnPSiteDesign -Identity $designIds[$target.Design] `
                         -WebUrl $target.Url | Out-Null

    Start-Sleep -Seconds 5
}

Write-Host "`n=== Termine ===" -ForegroundColor Cyan
Write-Host "Etape suivante : .\03-Add-Lookups.ps1" -ForegroundColor Yellow
Write-Host "Les colonnes Lookup ne sont pas creables par site script." -ForegroundColor DarkGray
