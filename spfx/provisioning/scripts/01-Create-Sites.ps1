<#
.SYNOPSIS
    Cree le hub intranet IKA Solution et les 4 sites departementaux.

.DESCRIPTION
    Etape 1 du provisioning. Idempotent : relancer le script ne recree pas
    les sites existants. A executer avant 02-Deploy-SiteScripts.ps1.

.PARAMETER TenantUrl
    URL d'administration du tenant, ex. https://ikasolution-admin.sharepoint.com

.PARAMETER OwnerEmail
    Adresse du proprietaire principal des sites.

.EXAMPLE
    .\01-Create-Sites.ps1 -TenantUrl "https://ikasolution-admin.sharepoint.com" `
                          -OwnerEmail "admin@ikasolution.com"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$TenantUrl,

    [Parameter(Mandatory = $true)]
    [string]$OwnerEmail,

    [Parameter(Mandatory = $false)]
    [string]$TenantRoot = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($TenantRoot)) {
    $TenantRoot = $TenantUrl -replace "-admin\.sharepoint\.com", ".sharepoint.com"
}

$sites = @(
    @{ Alias = "ika-intranet";       Title = "Intranet IKA Solution"; IsHub = $true  }
    @{ Alias = "ika-comptabilite";   Title = "Comptabilite";          IsHub = $false }
    @{ Alias = "ika-administration"; Title = "Administration";        IsHub = $false }
    @{ Alias = "ika-commerciaux";    Title = "Commerciaux";           IsHub = $false }
    @{ Alias = "ika-techniciens";    Title = "Techniciens";           IsHub = $false }
)

Write-Host "=== Connexion au tenant ===" -ForegroundColor Cyan
Connect-PnPOnline -Url $TenantUrl -Interactive

$hubUrl = "$TenantRoot/sites/ika-intranet"

foreach ($site in $sites) {
    $url = "$TenantRoot/sites/$($site.Alias)"
    Write-Host "`n--- $($site.Title) ---" -ForegroundColor Yellow

    $existing = Get-PnPTenantSite -Identity $url -ErrorAction SilentlyContinue

    if ($null -ne $existing) {
        Write-Host "  Site deja present, creation ignoree." -ForegroundColor DarkGray
    }
    else {
        Write-Host "  Creation du site de communication..." -ForegroundColor Green
        New-PnPSite `
            -Type CommunicationSite `
            -Title $site.Title `
            -Url $url `
            -Owner $OwnerEmail `
            -Lcid 1036 `
            -TimeZone 2 `
            -Wait | Out-Null
        Write-Host "  Site cree : $url" -ForegroundColor Green
    }
}

Write-Host "`n=== Configuration du hub ===" -ForegroundColor Cyan

$hubSite = Get-PnPHubSite -Identity $hubUrl -ErrorAction SilentlyContinue
if ($null -eq $hubSite) {
    Write-Host "  Enregistrement du hub..." -ForegroundColor Green
    Register-PnPHubSite -Site $hubUrl | Out-Null
    Start-Sleep -Seconds 10
}
else {
    Write-Host "  Hub deja enregistre." -ForegroundColor DarkGray
}

foreach ($site in $sites | Where-Object { -not $_.IsHub }) {
    $url = "$TenantRoot/sites/$($site.Alias)"
    Write-Host "  Association de $($site.Title) au hub..." -ForegroundColor Green
    Add-PnPHubSiteAssociation -Site $url -HubSite $hubUrl -ErrorAction SilentlyContinue
}

Write-Host "`n=== Navigation du hub ===" -ForegroundColor Cyan
Connect-PnPOnline -Url $hubUrl -Interactive

$navItems = @(
    @{ Title = "Accueil";        Url = $hubUrl }
    @{ Title = "Comptabilite";   Url = "$TenantRoot/sites/ika-comptabilite" }
    @{ Title = "Administration"; Url = "$TenantRoot/sites/ika-administration" }
    @{ Title = "Commerciaux";    Url = "$TenantRoot/sites/ika-commerciaux" }
    @{ Title = "Techniciens";    Url = "$TenantRoot/sites/ika-techniciens" }
)

foreach ($item in $navItems) {
    $exists = Get-PnPNavigationNode -Location TopNavigationBar |
              Where-Object { $_.Title -eq $item.Title }
    if ($null -eq $exists) {
        Add-PnPNavigationNode -Location TopNavigationBar `
                              -Title $item.Title `
                              -Url $item.Url | Out-Null
        Write-Host "  Ajoute : $($item.Title)" -ForegroundColor Green
    }
    else {
        Write-Host "  Deja present : $($item.Title)" -ForegroundColor DarkGray
    }
}

Write-Host "`n=== Termine ===" -ForegroundColor Cyan
Write-Host "Hub      : $hubUrl"
Write-Host "Etape suivante : .\02-Deploy-SiteScripts.ps1" -ForegroundColor Yellow
