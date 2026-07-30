<#
.SYNOPSIS
    Cree et applique le theme SharePoint IKA Solution.

.DESCRIPTION
    Palette derivee du logo IKA et alignee sur les tokens de app/globals.css :
    bleu marine #0A2540 (primaire) et cyan #06B6D4 (accent).

    Le theme habille le chrome natif SharePoint. Tailwind habille l'interieur
    des web parts. Les deux partagent la meme palette.

.EXAMPLE
    .\ika-theme.ps1 -TenantUrl "https://ikasolution-admin.sharepoint.com"
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

$themeName = "IKA Solution"

$palette = @{
    "themePrimary"         = "#0a2540"
    "themeLighterAlt"      = "#f2f6fa"
    "themeLighter"         = "#cfdeeb"
    "themeLight"           = "#a9c3da"
    "themeTertiary"        = "#5e8cb5"
    "themeSecondary"       = "#255f93"
    "themeDarkAlt"         = "#173b66"
    "themeDark"            = "#0f2f52"
    "themeDarker"          = "#061a33"
    "accent"               = "#06b6d4"
    "neutralLighterAlt"    = "#fafafa"
    "neutralLighter"       = "#f1f5f9"
    "neutralLight"         = "#e2e8f0"
    "neutralQuaternaryAlt" = "#d8dde3"
    "neutralQuaternary"    = "#cbd5e1"
    "neutralTertiaryAlt"   = "#94a3b8"
    "neutralTertiary"      = "#64748b"
    "neutralSecondary"     = "#475569"
    "neutralPrimaryAlt"    = "#334155"
    "neutralPrimary"       = "#0f172a"
    "neutralDark"          = "#0b1220"
    "black"                = "#000000"
    "white"                = "#ffffff"
}

Write-Host "=== Connexion au tenant ===" -ForegroundColor Cyan
Connect-PnPOnline -Url $TenantUrl -Interactive

Write-Host "`n=== Theme '$themeName' ===" -ForegroundColor Cyan

$existing = Get-PnPTenantTheme -Name $themeName -ErrorAction SilentlyContinue

if ($null -ne $existing) {
    Write-Host "  Mise a jour du theme existant..." -ForegroundColor Yellow
    Set-PnPTenantTheme -Identity $themeName -Palette $palette -IsInverted $false | Out-Null
}
else {
    Write-Host "  Creation du theme..." -ForegroundColor Green
    Add-PnPTenantTheme -Identity $themeName -Palette $palette -IsInverted $false | Out-Null
}

Write-Host "`n=== Application aux sites ===" -ForegroundColor Cyan

$sites = @(
    "$TenantRoot/sites/ika-intranet"
    "$TenantRoot/sites/ika-comptabilite"
    "$TenantRoot/sites/ika-administration"
    "$TenantRoot/sites/ika-commerciaux"
    "$TenantRoot/sites/ika-techniciens"
)

foreach ($site in $sites) {
    try {
        Connect-PnPOnline -Url $site -Interactive
        Set-PnPWebTheme -Theme $themeName -WebUrl $site
        Write-Host "  Applique : $site" -ForegroundColor Green
    }
    catch {
        Write-Warning "  Echec sur $site : $_"
    }
}

Write-Host "`n=== Termine ===" -ForegroundColor Cyan
