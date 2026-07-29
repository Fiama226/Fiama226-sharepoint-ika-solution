<#
.SYNOPSIS
    Ajoute les colonnes Lookup et les index, non supportes par les site scripts.

.DESCRIPTION
    Etape 3 du provisioning. Les colonnes de type Lookup exigent le GUID de la
    liste cible, inconnu au moment de l'ecriture d'un site script : elles sont
    donc creees ici, apres que toutes les listes existent.

    Cree egalement les index sur les colonnes de filtre et de tri.
    Idempotent : une colonne deja presente est ignoree.

.EXAMPLE
    .\03-Add-Lookups.ps1 -HubUrl "https://ikasolution.sharepoint.com/sites/ika-intranet"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$HubUrl,

    [Parameter(Mandatory = $false)]
    [string]$TenantRoot = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($TenantRoot)) {
    $TenantRoot = ($HubUrl -split "/sites/")[0]
}

function Add-LookupField {
    param(
        [string]$ListName,
        [string]$FieldName,
        [string]$DisplayName,
        [string]$TargetList,
        [string]$TargetField = "Title",
        [bool]$Required = $false,
        [bool]$Indexed = $false
    )

    $existing = Get-PnPField -List $ListName -Identity $FieldName -ErrorAction SilentlyContinue
    if ($null -ne $existing) {
        Write-Host "    $FieldName : deja present" -ForegroundColor DarkGray
        return
    }

    $target = Get-PnPList -Identity $TargetList -ErrorAction SilentlyContinue
    if ($null -eq $target) {
        Write-Warning "    Liste cible introuvable : $TargetList"
        return
    }

    $req = if ($Required) { "TRUE" } else { "FALSE" }
    $idx = if ($Indexed) { "TRUE" } else { "FALSE" }
    $guid = [guid]::NewGuid().ToString("B")

    $xml = "<Field Type='Lookup' ID='$guid' Name='$FieldName' StaticName='$FieldName' " +
           "DisplayName='$DisplayName' List='$($target.Id)' ShowField='$TargetField' " +
           "Required='$req' Indexed='$idx' />"

    Add-PnPFieldFromXml -List $ListName -FieldXml $xml | Out-Null
    Write-Host "    $FieldName -> $TargetList" -ForegroundColor Green
}

function Add-FieldIndex {
    param(
        [string]$ListName,
        [string]$FieldName
    )

    try {
        $field = Get-PnPField -List $ListName -Identity $FieldName -ErrorAction Stop
        if ($field.Indexed) {
            Write-Host "    $FieldName : deja indexe" -ForegroundColor DarkGray
            return
        }
        Set-PnPField -List $ListName -Identity $FieldName -Values @{ Indexed = $true } | Out-Null
        Write-Host "    $FieldName indexe" -ForegroundColor Green
    }
    catch {
        Write-Warning "    Index impossible sur $ListName/$FieldName : $_"
    }
}

Write-Host "=== Connexion au hub ===" -ForegroundColor Cyan
Connect-PnPOnline -Url $HubUrl -Interactive

Write-Host "`n=== Colonnes Lookup du hub ===" -ForegroundColor Cyan

Write-Host "  Collaborateurs" -ForegroundColor Yellow
Add-LookupField -ListName "Collaborateurs" -FieldName "Department" `
                -DisplayName "Departement" -TargetList "Departements" `
                -Required $true -Indexed $true
Add-LookupField -ListName "Collaborateurs" -FieldName "Manager" `
                -DisplayName "Responsable" -TargetList "Collaborateurs" `
                -Required $false -Indexed $true

Write-Host "  Annonces" -ForegroundColor Yellow
Add-LookupField -ListName "Annonces" -FieldName "RelatedPerson" `
                -DisplayName "Personne concernee" -TargetList "Collaborateurs"

Write-Host "  Projets" -ForegroundColor Yellow
Add-LookupField -ListName "Projets" -FieldName "Department" `
                -DisplayName "Departement" -TargetList "Departements" -Indexed $true

Write-Host "  CollaborateurDuMois" -ForegroundColor Yellow
Add-LookupField -ListName "CollaborateurDuMois" -FieldName "Employee" `
                -DisplayName "Collaborateur" -TargetList "Collaborateurs" `
                -Required $true -Indexed $true
Add-LookupField -ListName "CollaborateurDuMois" -FieldName "Department" `
                -DisplayName "Departement" -TargetList "Departements" -Required $true

Write-Host "  Organigramme" -ForegroundColor Yellow
Add-LookupField -ListName "Organigramme" -FieldName "Department" `
                -DisplayName "Departement lie" -TargetList "Departements" -Indexed $true

Write-Host "  FAQ" -ForegroundColor Yellow
Add-LookupField -ListName "FAQ" -FieldName "Department" `
                -DisplayName "Departement" -TargetList "Departements" -Indexed $true

Write-Host "  BordereauLignes" -ForegroundColor Yellow
Add-LookupField -ListName "BordereauLignes" -FieldName "Quote" `
                -DisplayName "Bordereau" -TargetList "BordereauPrix" `
                -Required $true -Indexed $true

Write-Host "`n  Activation de la suppression en cascade sur BordereauLignes/Quote" -ForegroundColor Yellow
try {
    $f = Get-PnPField -List "BordereauLignes" -Identity "Quote"
    $f.Context.Load($f)
    $f.Context.ExecuteQuery()
    $lookup = [Microsoft.SharePoint.Client.FieldLookup]$f
    $lookup.RelationshipDeleteBehavior = [Microsoft.SharePoint.Client.RelationshipDeleteBehaviorType]::Cascade
    $lookup.Update()
    $f.Context.ExecuteQuery()
    Write-Host "    Cascade activee" -ForegroundColor Green
}
catch {
    Write-Warning "    Cascade non appliquee : $_"
    Write-Warning "    A configurer manuellement dans les parametres de la colonne."
}

Write-Host "`n=== Index du hub ===" -ForegroundColor Cyan

$hubIndexes = @{
    "Collaborateurs"      = @("Birthdate", "IsActive", "Division", "HierarchyLevel")
    "Annonces"            = @("AnnouncementType", "AnnouncementDate", "DisplayUntil")
    "Projets"             = @("ProjectStatus", "DueDate", "ShowOnHome")
    "Galerie"             = @("GalleryCategory", "PhotoDate", "IsFeatured")
    "HeroSlides"          = @("SortOrder", "IsActive")
    "Departements"        = @("SortOrder")
    "Histoire"            = @("SortOrder")
    "Missions"            = @("MissionType", "SortOrder")
    "Indicateurs"         = @("Placement", "SortOrder", "IsActive")
    "FAQ"                 = @("FaqCategory", "SortOrder", "IsActive")
    "BordereauPrix"       = @("QuoteStatus", "IssueDate", "ClientName")
    "ParametresSite"      = @("SettingCategory")
}

foreach ($list in $hubIndexes.Keys) {
    Write-Host "  $list" -ForegroundColor Yellow
    foreach ($field in $hubIndexes[$list]) {
        Add-FieldIndex -ListName $list -FieldName $field
    }
}

Write-Host "`n=== Index des sites departementaux ===" -ForegroundColor Cyan

$deptSites = @("ika-comptabilite", "ika-administration", "ika-commerciaux", "ika-techniciens")

$deptIndexes = @{
    "Actualites"   = @("Category", "PublishDate", "Highlighted")
    "Documents"    = @("DocCategory", "Confidentiality", "ExpiryDate", "IsPinned")
    "Evenements"   = @("EventCategory")
    "LiensRapides" = @("SortOrder", "LinkGroup", "IsActive")
}

foreach ($alias in $deptSites) {
    $url = "$TenantRoot/sites/$alias"
    Write-Host "`n  $alias" -ForegroundColor Yellow
    Connect-PnPOnline -Url $url -Interactive

    foreach ($list in $deptIndexes.Keys) {
        foreach ($field in $deptIndexes[$list]) {
            Add-FieldIndex -ListName $list -FieldName $field
        }
    }
}

Write-Host "`n=== Comptabilite : donnees financieres ===" -ForegroundColor Cyan
Connect-PnPOnline -Url "$TenantRoot/sites/ika-comptabilite" -Interactive
foreach ($field in @("SeriesType", "FiscalYear", "FiscalMonth", "FiscalQuarter", "SortOrder")) {
    Add-FieldIndex -ListName "DonneesFinancieres" -FieldName $field
}

Write-Host "`n=== Termine ===" -ForegroundColor Cyan
Write-Host "Etape suivante : .\04-Import-SampleData.ps1" -ForegroundColor Yellow
