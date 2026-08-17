# IKA Intranet — Provisioning complet pour SharePoint Online
# Ce script crée toutes les listes/bibliothèques, colonnes (y compris Lookups),
# importe les données CSV et upload les images pour reproduire la maquette Next.js.
#
# PRÉREQUIS:
#   - PnP.PowerShell 3.x installé: Install-Module PnP.PowerShell -Scope CurrentUser
#   - Être connecté au site /sites/ikareview avec des droits de création
#   - Les fichiers CSV dans ../sharepoint-ready-data/
#
# USAGE:
#   Connect-PnPOnline -Url "https://<tenant>.sharepoint.com/sites/ikareview" -Interactive
#   .\Deploy-IkaIntranet.ps1
#
# Le script est IDEMPOTENT: relancer ne duplique rien.

[CmdletBinding()]
param(
    [string]$SiteUrl = (Get-PnPProperty -ServerRelativeUrl ""),
    [switch]$SkipDataImport,
    [switch]$SkipImages,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$csvDir = Join-Path $PSScriptRoot "..\sharepoint-ready-data"
$imageDir = Join-Path $PSScriptRoot "..\public\assets"
$listOrder = @(
    "Departements", "Missions", "Indicateurs", "HeroSlides",
    "LiensRapides", "Evenements", "Documents",
    "Collaborateurs", "Annonces", "CollaborateurDuMois",
    "Projets", "Galerie",
    "Histoire", "Organigramme",
    "BordereauPrix", "BordereauLignes",
    "DonneesFinancieres", "FAQ", "ParametresSite"
)
$createdLists = @{}
$createdFields = @{}

function Write-Step($msg) { Write-Host "`n[STEP] $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "  [OK]   $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "  [WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "  [ERR]  $msg" -ForegroundColor Red }

# ─────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────

function Ensure-List {
    param(
        [string]$Title,
        [string]$Type = "GenericList",   # GenericList | DocumentLibrary | Calendar
        [string]$Description = "",
        [bool]$EnableVersioning = $false
    )
    if ($createdLists.ContainsKey($Title)) { return $createdLists[$Title] }

    Write-Host "  -> Liste: $Title ($Type)" -NoNewline
    $list = $null
    try {
        $list = Get-PnPList -Identity $Title -ErrorAction SilentlyContinue
        Write-Host " [EXISTS]" -ForegroundColor DarkGray
    } catch {}

    if (-not $list) {
        if ($DryRun) {
            Write-Host " [DRY-RUN]" -ForegroundColor Magenta
            $createdLists[$Title] = $null
            return $null
        }
        $params = @{ Title = $Title; TemplateType = 100 }
        if ($Type -eq "DocumentLibrary") { $params.TemplateType = 101 }
        elseif ($Type -eq "Calendar")    { $params.TemplateType = 106 }
        if ($Description) { $params.Description = $Description }
        $list = New-PnPList @params
        Write-Ok "créée (Id=$($list.Id))"
    }

    if ($EnableVersioning -and $list) {
        Set-PnPList -Identity $list -EnableVersioning $true -ErrorAction SilentlyContinue | Out-Null
    }

    $createdLists[$Title] = $list
    return $list
}

function Ensure-Field {
    param(
        [string]$ListTitle,
        [string]$DisplayName,
        [string]$InternalName,
        [string]$Type,            # Text | Note | Number | Boolean | DateTime | Choice | Lookup | User | URL | Counter
        [object]$Choices = $null,
        [string]$LookupList = "",
        [bool]$Required = $false,
        [string]$DefaultValue = ""
    )
    $key = "$ListTitle|$InternalName"
    if ($createdFields.ContainsKey($key)) { return $createdFields[$key] }

    Write-Host "    colonne: $DisplayName [$Type]" -NoNewline
    $list = Ensure-List -Title $ListTitle
    if (-not $list) { return $null }

    $existing = $null
    try {
        $existing = Get-PnPField -List $ListTitle -Identity $InternalName -ErrorAction SilentlyContinue
    } catch {}

    if ($existing) {
        Write-Host " [EXISTS]" -ForegroundColor DarkGray
        $createdFields[$key] = $existing
        return $existing
    }

    if ($DryRun) {
        Write-Host " [DRY-RUN]" -ForegroundColor Magenta
        $f = New-Object PSObject -Property @{ InternalName = $InternalName }
        $createdFields[$key] = $f
        return $f
    }

    $addParams = @{
        List      = $ListTitle
        DisplayName = $DisplayName
        InternalName = $InternalName
        Type      = $Type
        Required  = $Required
    }

    if ($Choices) { $addParams.Choice = $Choices }
    if ($LookupList) {
        $addParams.LookupList = $LookupList
        $addParams.LookupField = "Title"
    }
    if ($DefaultValue) { $addParams.DefaultValue = $DefaultValue }

    $field = Add-PnPField @addParams
    Write-Ok "créée (Interne: $InternalName)"
    $createdFields[$key] = $field
    return $field
}

function Add-ListItem {
    param(
        [string]$ListTitle,
        [hashtable]$Values,
        [bool]$SystemUpdate = $false
    )
    if ($DryRun) { return }
    if (-not (Test-Path variable:createdLists[$ListTitle])) { return }
    try {
        if ($SystemUpdate) {
            Set-PnPListItem -List $ListTitle -Values $Values -SystemUpdate | Out-Null
        } else {
            Add-PnPListItem -List $ListTitle -Values $Values | Out-Null
        }
    } catch {
        Write-Warn "Erreur ajout item dans $ListTitle : $_"
    }
}

function Upload-FileToLibrary {
    param(
        [string]$LibraryName,
        [string]$LocalPath,
        [hashtable]$Metadata = @{}
    )
    if ($DryRun) { return }
    if (-not (Test-Path $LocalPath)) { return }
    $fileName = Split-Path $LocalPath -Leaf
    try {
        $item = Add-PnPFile -Path $LocalPath -Folder $LibraryName -Values $Metadata
        Write-Ok "uploadé: $fileName"
        return $item
    } catch {
        Write-Warn "Upload échoué ($fileName): $_"
        return $null
    }
}

function ConvertTo-ModernImageValue {
    param(
        [object]$File,
        [string]$FieldName = "Photo"
    )
    if (-not $File) { return "" }
    Get-PnPProperty -ClientObject $File -Property Name, ServerRelativeUrl, UniqueId | Out-Null
    $web = Get-PnPWeb -Includes Url
    $authority = ([Uri]$web.Url).GetLeftPart([System.UriPartial]::Authority)
    return (@{
        type              = "thumbnail"
        fileName          = $File.Name
        fieldName         = $FieldName
        serverUrl         = $authority
        serverRelativeUrl = $File.ServerRelativeUrl
        id                = $File.UniqueId.ToString()
    } | ConvertTo-Json -Compress)
}

# ─────────────────────────────────────────────────────────────────────
# 1. LISTES DU HUB
# ─────────────────────────────────────────────────────────────────────
Write-Step "Création des listes et bibliothèques..."

# A. Departements (100)
$d = Ensure-List -Title "Departements" -Description "Référentiel des départements IKA"

# B. Missions (100)
$m = Ensure-List -Title "Missions" -Description "Mission, Vision, Valeurs"

# C. Indicateurs (100)
$i = Ensure-List -Title "Indicateurs" -Description "KPIs d'entreprise"

# D. HeroSlides (101 bibliothèque)
$hs = Ensure-List -Title "HeroSlides" -Type "DocumentLibrary" -Description "Images du carrousel d'accueil"

# E. LiensRapides (100)
$lr = Ensure-List -Title "LiensRapides" -Description "Liens rapides par département"

# F. Evenements (106 Calendrier)
$ev = Ensure-List -Title "Evenements" -Type "Calendar" -Description "Événements IKA"

# G. Documents (101) — bibliothèque globale
$doc = Ensure-List -Title "Documents" -Type "DocumentLibrary" -Description "Documents transverses"

# H. Collaborateurs (100)
$col = Ensure-List -Title "Collaborateurs" -Description "Annuaire des collaborateurs"

# I. Annonces (100)
$ann = Ensure-List -Title "Annonces" -Description "Annonces internes (bandeau défilant)"

# J. CollaborateurDuMois (100)
$cdm = Ensure-List -Title "CollaborateurDuMois" -Description "Collaborateur du mois"

# K. Projets (100)
$proj = Ensure-List -Title "Projets" -Description "Suivi de projets"

# L. Galerie (101 bibliothèque)
$gal = Ensure-List -Title "Galerie" -Type "DocumentLibrary" -Description "Photothèque"

# M. Histoire (100)
$hist = Ensure-List -Title "Histoire" -Description "Jalons chronologiques"

# N. Organigramme (100)
$org = Ensure-List -Title "Organigramme" -Description "Directions de l'entreprise"

# O. BordereauPrix (100)
$bp = Ensure-List -Title "BordereauPrix" -Description "En-têtes de bordereau"

# P. BordereauLignes (100)
$bl = Ensure-List -Title "BordereauLignes" -Description "Lignes de bordereau"

# Q. DonneesFinancieres (100)
$fin = Ensure-List -Title "DonneesFinancieres" -Description "Séries financières pour graphiques"

# R. FAQ (100)
$faq = Ensure-List -Title "FAQ" -Description "Questions fréquentes"

# S. ParametresSite (100)
$ps = Ensure-List -Title "ParametresSite" -Description "Paramètres du site (clé/valeur)"

# T. 4 bibliothèques départementales
$docComp = Ensure-List -Title "Documents_Comptabilite" -Type "DocumentLibrary" -Description "Documents de la comptabilité"
$docAdmin = Ensure-List -Title "Documents_Administration" -Type "DocumentLibrary" -Description "Documents de l'administration"
$docCom = Ensure-List -Title "Documents_Commerciaux" -Type "DocumentLibrary" -Description "Documents du service commercial"
$docTech = Ensure-List -Title "Documents_Techniciens" -Type "DocumentLibrary" -Description "Documents des techniciens"

Write-Ok "Toutes les listes/bibliothèques vérifiées/créées."

# ─────────────────────────────────────────────────────────────────────
# 2. COLONNES — schéma exact pour chaque liste
# ─────────────────────────────────────────────────────────────────────
Write-Step "Création des colonnes..."

# ── Departements ────────────────────────────────────────────────────
Ensure-Field -ListTitle "Departements" -DisplayName "Slug" -InternalName "Slug" -Type Choice `
    -Choices @("comptabilite","administration","commerciaux","techniciens") -Required
Ensure-Field -ListTitle "Departements" -DisplayName "Tagline" -InternalName "Tagline" -Type Text
Ensure-Field -ListTitle "Departements" -DisplayName "DeptDescription" -InternalName "DeptDescription" -Type Note
Ensure-Field -ListTitle "Departements" -DisplayName "HeroTitle" -InternalName "HeroTitle" -Type Text
Ensure-Field -ListTitle "Departements" -DisplayName "HeroSubtitle" -InternalName "HeroSubtitle" -Type Text
Ensure-Field -ListTitle "Departements" -DisplayName "Accent" -InternalName "Accent" -Type Choice `
    -Choices @("navy","cyan")
Ensure-Field -ListTitle "Departements" -DisplayName "IconName" -InternalName "IconName" -Type Text
Ensure-Field -ListTitle "Departements" -DisplayName "SiteUrl" -InternalName "SiteUrl" -Type URL
Ensure-Field -ListTitle "Departements" -DisplayName "AccentClasses" -InternalName "AccentClasses" -Type Text
Ensure-Field -ListTitle "Departements" -DisplayName "BadgeClasses" -InternalName "BadgeClasses" -Type Text
Ensure-Field -ListTitle "Departements" -DisplayName "MemberCount" -InternalName "MemberCount" -Type Number
Ensure-Field -ListTitle "Departements" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number -Required

# ── Missions ────────────────────────────────────────────────────────
Ensure-Field -ListTitle "Missions" -DisplayName "Tag" -InternalName "Tag" -Type Text -Required
Ensure-Field -ListTitle "Missions" -DisplayName "MissionText" -InternalName "MissionText" -Type Note -Required
Ensure-Field -ListTitle "Missions" -DisplayName "IconName" -InternalName "IconName" -Type Text -Required
Ensure-Field -ListTitle "Missions" -DisplayName "MissionType" -InternalName "MissionType" -Type Choice `
    -Choices @("Mission","Vision","Valeur") -Required
Ensure-Field -ListTitle "Missions" -DisplayName "ColorClass" -InternalName "ColorClass" -Type Text
Ensure-Field -ListTitle "Missions" -DisplayName "BgClass" -InternalName "BgClass" -Type Text
Ensure-Field -ListTitle "Missions" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number -Required

# ── Indicateurs ─────────────────────────────────────────────────────
Ensure-Field -ListTitle "Indicateurs" -DisplayName "StatValue" -InternalName "StatValue" -Type Text -Required
Ensure-Field -ListTitle "Indicateurs" -DisplayName "IconName" -InternalName "IconName" -Type Text -Required
Ensure-Field -ListTitle "Indicateurs" -DisplayName "Placement" -InternalName "Placement" -Type Choice `
    -Choices @("Hero accueil","Page histoire","Les deux") -Required
Ensure-Field -ListTitle "Indicateurs" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number -Required
Ensure-Field -ListTitle "Indicateurs" -DisplayName "IsActive" -InternalName "IsActive" -Type Boolean -Required `
    -DefaultValue "1"

# ── HeroSlides (bibliothèque) ────────────────────────────────────────
Ensure-Field -ListTitle "HeroSlides" -DisplayName "Title" -InternalName "Title" -Type Text
Ensure-Field -ListTitle "HeroSlides" -DisplayName "Caption" -InternalName "Caption" -Type Text -Required
Ensure-Field -ListTitle "HeroSlides" -DisplayName "SubCaption" -InternalName "SubCaption" -Type Text
Ensure-Field -ListTitle "HeroSlides" -DisplayName "SlideLink" -InternalName "SlideLink" -Type URL
Ensure-Field -ListTitle "HeroSlides" -DisplayName "CtaLabel" -InternalName "CtaLabel" -Type Text
Ensure-Field -ListTitle "HeroSlides" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number -Required
Ensure-Field -ListTitle "HeroSlides" -DisplayName "IsActive" -InternalName "IsActive" -Type Boolean -Required `
    -DefaultValue "1"
Ensure-Field -ListTitle "HeroSlides" -DisplayName "StartDate" -InternalName "StartDate" -Type DateTime
Ensure-Field -ListTitle "HeroSlides" -DisplayName "EndDate" -InternalName "EndDate" -Type DateTime
Ensure-Field -ListTitle "HeroSlides" -DisplayName "AltText" -InternalName "AltText" -Type Text

# ── LiensRapides ────────────────────────────────────────────────────
Ensure-Field -ListTitle "LiensRapides" -DisplayName "Scope" -InternalName "Scope" -Type Text -Required
Ensure-Field -ListTitle "LiensRapides" -DisplayName "LinkUrl" -InternalName "LinkUrl" -Type URL -Required
Ensure-Field -ListTitle "LiensRapides" -DisplayName "LinkDescription" -InternalName "LinkDescription" -Type Text
Ensure-Field -ListTitle "LiensRapides" -DisplayName "IconName" -InternalName "IconName" -Type Text -Required
Ensure-Field -ListTitle "LiensRapides" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number -Required
Ensure-Field -ListTitle "LiensRapides" -DisplayName "OpenInNewTab" -InternalName "OpenInNewTab" -Type Boolean `
    -DefaultValue "0"
Ensure-Field -ListTitle "LiensRapides" -DisplayName "LinkGroup" -InternalName "LinkGroup" -Type Text
Ensure-Field -ListTitle "LiensRapides" -DisplayName "IsActive" -InternalName "IsActive" -Type Boolean -Required `
    -DefaultValue "1"

# ── Evenements (calendrier) ─────────────────────────────────────────
# EventDate/EndDate/fAllDayEvent existent déjà sur un Calendrier
Ensure-Field -ListTitle "Evenements" -DisplayName "Location" -InternalName "Location" -Type Text
Ensure-Field -ListTitle "Evenements" -DisplayName "DisplayDate" -InternalName "DisplayDate" -Type Text
Ensure-Field -ListTitle "Evenements" -DisplayName "DisplayMonth" -InternalName "DisplayMonth" -Type Text
Ensure-Field -ListTitle "Evenements" -DisplayName "DisplayDay" -InternalName "DisplayDay" -Type Text
Ensure-Field -ListTitle "Evenements" -DisplayName "EventCategory" -InternalName "EventCategory" -Type Choice `
    -Choices @("Stratégie","Tech","Innovation","SecOps","Entreprise","Réunion","Formation","Échéance","RH","Maintenance","Astreinte","Événement","Célébration","Séminaire","Autre")
Ensure-Field -ListTitle "Evenements" -DisplayName "EventDescription" -InternalName "EventDescription" -Type Note
Ensure-Field -ListTitle "Evenements" -DisplayName "EventImage" -InternalName "EventImage" -Type Image
Ensure-Field -ListTitle "Evenements" -DisplayName "RegistrationLink" -InternalName "RegistrationLink" -Type URL
Ensure-Field -ListTitle "Evenements" -DisplayName "Organizer" -InternalName "Organizer" -Type User
Ensure-Field -ListTitle "Evenements" -DisplayName "IsMandatory" -InternalName "IsMandatory" -Type Boolean `
    -DefaultValue "0"

# ── Documents (bibliothèque globale) ────────────────────────────────
Ensure-Field -ListTitle "Documents" -DisplayName "Title" -InternalName "Title" -Type Text
Ensure-Field -ListTitle "Documents" -DisplayName "DocCategory" -InternalName "DocCategory" -Type Choice `
    -Choices @("Procédure","Modèle","Contrat","Rapport","Facture","Politique","Guide","Présentation","Formulaire","Autre") -Required
Ensure-Field -ListTitle "Documents" -DisplayName "DocDescription" -InternalName "DocDescription" -Type Note
Ensure-Field -ListTitle "Documents" -DisplayName "Confidentiality" -InternalName "Confidentiality" -Type Choice `
    -Choices @("Public","Interne","Confidentiel") -Required
Ensure-Field -ListTitle "Documents" -DisplayName "ExpiryDate" -InternalName "ExpiryDate" -Type DateTime
Ensure-Field -ListTitle "Documents" -DisplayName "DocOwner" -InternalName "DocOwner" -Type User
Ensure-Field -ListTitle "Documents" -DisplayName "IsPinned" -InternalName "IsPinned" -Type Boolean `
    -DefaultValue "0"
Ensure-Field -ListTitle "Documents" -DisplayName "BusinessVersion" -InternalName "BusinessVersion" -Type Text

# ── Collaborateurs ──────────────────────────────────────────────────
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "UserAccount" -InternalName "UserAccount" -Type User
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "JobTitle" -InternalName "JobTitle" -Type Text -Required
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "Email" -InternalName "Email" -Type Text -Required
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "Phone" -InternalName "Phone" -Type Text
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "OfficeLocation" -InternalName "OfficeLocation" -Type Text
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "Birthdate" -InternalName "Birthdate" -Type DateTime
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "Photo" -InternalName "Photo" -Type Image
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "HierarchyLevel" -InternalName "HierarchyLevel" -Type Number -Required
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "Division" -InternalName "Division" -Type Choice `
    -Choices @("Direction Générale","Engineering","Ventes & Marketing","Comptabilité","Administration","Support Technique") -Required
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "LinkedInUrl" -InternalName "LinkedInUrl" -Type URL
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "HireDate" -InternalName "HireDate" -Type DateTime
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "IsActive" -InternalName "IsActive" -Type Boolean -Required `
    -DefaultValue "1"
Ensure-Field -ListTitle "Collaborateurs" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number

# Lookup Department → Departements (créé APRÈS que Departements existe)
Write-Host "    colonne: Department [Lookup->Departements]" -NoNewline
try {
    $lookupDept = Get-PnPField -List "Collaborateurs" -Identity "Department" -ErrorAction SilentlyContinue
    if (-not $lookupDept) {
        $lookupDept = Add-PnPField -List "Collaborateurs" -DisplayName "Department" -InternalName "Department" `
            -Type Lookup -LookupList "Departements" -LookupField "Title"
        Write-Ok "créée"
    } else {
        Write-Host " [EXISTS]" -ForegroundColor DarkGray
    }
} catch {
    Write-Warn "Lookup Department sur Collaborateurs: $_ (à créer manuellement si besoin)"
}

# Lookup Manager → Collaborateurs (auto-référence)
Write-Host "    colonne: Manager [Lookup->Collaborateurs]" -NoNewline
try {
    $lookupMgr = Get-PnPField -List "Collaborateurs" -Identity "Manager" -ErrorAction SilentlyContinue
    if (-not $lookupMgr) {
        $lookupMgr = Add-PnPField -List "Collaborateurs" -DisplayName "Manager" -InternalName "Manager" `
            -Type Lookup -LookupList "Collaborateurs" -LookupField "Title"
        Write-Ok "créée"
    } else {
        Write-Host " [EXISTS]" -ForegroundColor DarkGray
    }
} catch {
    Write-Warn "Lookup Manager sur Collaborateurs: $_ (à créer manuellement si besoin)"
}

# ── Annonces ────────────────────────────────────────────────────────
Ensure-Field -ListTitle "Annonces" -DisplayName "AnnouncementType" -InternalName "AnnouncementType" -Type Choice `
    -Choices @("Mariage","Anniversaire","Naissance","Événement","Départ","Arrivée","Promotion") -Required
Ensure-Field -ListTitle "Annonces" -DisplayName "Detail" -InternalName "Detail" -Type Note -Required
Ensure-Field -ListTitle "Annonces" -DisplayName "Emoji" -InternalName "Emoji" -Type Text
Ensure-Field -ListTitle "Annonces" -DisplayName "AnnouncementDate" -InternalName "AnnouncementDate" -Type DateTime -Required
Ensure-Field -ListTitle "Annonces" -DisplayName "DisplayUntil" -InternalName "DisplayUntil" -Type DateTime -Required
Ensure-Field -ListTitle "Annonces" -DisplayName "Priority" -InternalName "Priority" -Type Choice `
    -Choices @("Basse","Normale","Haute")
Ensure-Field -ListTitle "Annonces" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number -Required

Write-Host "    colonne: RelatedPerson [Lookup->Collaborateurs]" -NoNewline
try {
    $lp = Get-PnPField -List "Annonces" -Identity "RelatedPerson" -ErrorAction SilentlyContinue
    if (-not $lp) {
        $lp = Add-PnPField -List "Annonces" -DisplayName "RelatedPerson" -InternalName "RelatedPerson" `
            -Type Lookup -LookupList "Collaborateurs" -LookupField "Title"
        Write-Ok "créée"
    } else {
        Write-Host " [EXISTS]" -ForegroundColor DarkGray
    }
} catch {
    Write-Warn "Lookup RelatedPerson: $_"
}

# ── CollaborateurDuMois ─────────────────────────────────────────────
Ensure-Field -ListTitle "CollaborateurDuMois" -DisplayName "DisplayRole" -InternalName "DisplayRole" -Type Text -Required
Ensure-Field -ListTitle "CollaborateurDuMois" -DisplayName "Quote" -InternalName "Quote" -Type Note -Required
Ensure-Field -ListTitle "CollaborateurDuMois" -DisplayName "NominatedBy" -InternalName "NominatedBy" -Type Text -Required
Ensure-Field -ListTitle "CollaborateurDuMois" -DisplayName "Photo" -InternalName "Photo" -Type Image
Ensure-Field -ListTitle "CollaborateurDuMois" -DisplayName "PeriodStart" -InternalName "PeriodStart" -Type DateTime -Required
Ensure-Field -ListTitle "CollaborateurDuMois" -DisplayName "IsCurrent" -InternalName "IsCurrent" -Type Boolean -Required `
    -DefaultValue "1"

Write-Host "    colonne: Employee [Lookup->Collaborateurs]" -NoNewline
try {
    $emp = Get-PnPField -List "CollaborateurDuMois" -Identity "Employee" -ErrorAction SilentlyContinue
    if (-not $emp) {
        $emp = Add-PnPField -List "CollaborateurDuMois" -DisplayName "Employee" -InternalName "Employee" `
            -Type Lookup -LookupList "Collaborateurs" -LookupField "Title"
        Write-Ok "créée"
    } else {
        Write-Host " [EXISTS]" -ForegroundColor DarkGray
    }
} catch { Write-Warn $_ }

Write-Host "    colonne: Department [Lookup->Departements]" -NoNewline
try {
    $deptField = Get-PnPField -List "CollaborateurDuMois" -Identity "Department" -ErrorAction SilentlyContinue
    if (-not $deptField) {
        $deptField = Add-PnPField -List "CollaborateurDuMois" -DisplayName "Department" -InternalName "Department" `
            -Type Lookup -LookupList "Departements" -LookupField "Title"
        Write-Ok "créée"
    } else {
        Write-Host " [EXISTS]" -ForegroundColor DarkGray
    }
} catch { Write-Warn $_ }

# ── Projets ─────────────────────────────────────────────────────────
Ensure-Field -ListTitle "Projets" -DisplayName "ProjectLead" -InternalName "ProjectLead" -Type Text -Required
Ensure-Field -ListTitle "Projets" -DisplayName "ProjectManager" -InternalName "ProjectManager" -Type User
Ensure-Field -ListTitle "Projets" -DisplayName "Progress" -InternalName "Progress" -Type Number -Required
Ensure-Field -ListTitle "Projets" -DisplayName "ProjectStatus" -InternalName "ProjectStatus" -Type Choice `
    -Choices @("À l'heure","À risque","En retard","Terminé") -Required
Ensure-Field -ListTitle "Projets" -DisplayName "DueDate" -InternalName "DueDate" -Type DateTime -Required
Ensure-Field -ListTitle "Projets" -DisplayName "TasksDone" -InternalName "TasksDone" -Type Number
Ensure-Field -ListTitle "Projets" -DisplayName "TasksTotal" -InternalName "TasksTotal" -Type Number
Ensure-Field -ListTitle "Projets" -DisplayName "ShowOnHome" -InternalName "ShowOnHome" -Type Boolean -Required `
    -DefaultValue "1"
Ensure-Field -ListTitle "Projets" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number

Write-Host "    colonne: Department [Lookup->Departements]" -NoNewline
try {
    $projDept = Get-PnPField -List "Projets" -Identity "Department" -ErrorAction SilentlyContinue
    if (-not $projDept) {
        $projDept = Add-PnPField -List "Projets" -DisplayName "Department" -InternalName "Department" `
            -Type Lookup -LookupList "Departements" -LookupField "Title"
        Write-Ok "créée"
    } else {
        Write-Host " [EXISTS]" -ForegroundColor DarkGray
    }
} catch { Write-Warn $_ }

# ── Galerie (bibliothèque) ──────────────────────────────────────────
Ensure-Field -ListTitle "Galerie" -DisplayName "Title" -InternalName "Title" -Type Text
Ensure-Field -ListTitle "Galerie" -DisplayName "Caption" -InternalName "Caption" -Type Text -Required
Ensure-Field -ListTitle "Galerie" -DisplayName "GalleryCategory" -InternalName "GalleryCategory" -Type Choice `
    -Choices @("Vie au bureau","Événements","Projets","Teambuilding","Formation","Autre")
Ensure-Field -ListTitle "Galerie" -DisplayName "PhotoDate" -InternalName "PhotoDate" -Type DateTime
Ensure-Field -ListTitle "Galerie" -DisplayName "IsFeatured" -InternalName "IsFeatured" -Type Boolean `
    -DefaultValue "0"
Ensure-Field -ListTitle "Galerie" -DisplayName "AltText" -InternalName "AltText" -Type Text
Ensure-Field -ListTitle "Galerie" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number

# ── Histoire ────────────────────────────────────────────────────────
Ensure-Field -ListTitle "Histoire" -DisplayName "Year" -InternalName "Year" -Type Text -Required
Ensure-Field -ListTitle "Histoire" -DisplayName "Quarter" -InternalName "Quarter" -Type Choice `
    -Choices @("T1","T2","T3","T4")
Ensure-Field -ListTitle "Histoire" -DisplayName "MilestoneDescription" -InternalName "MilestoneDescription" -Type Note -Required
Ensure-Field -ListTitle "Histoire" -DisplayName "MilestoneImage" -InternalName "MilestoneImage" -Type Image
Ensure-Field -ListTitle "Histoire" -DisplayName "IconName" -InternalName "IconName" -Type Text -Required
Ensure-Field -ListTitle "Histoire" -DisplayName "Tag" -InternalName "Tag" -Type Text
Ensure-Field -ListTitle "Histoire" -DisplayName "TagColorClass" -InternalName "TagColorClass" -Type Text
Ensure-Field -ListTitle "Histoire" -DisplayName "Side" -InternalName "Side" -Type Choice `
    -Choices @("left","right") -Required
Ensure-Field -ListTitle "Histoire" -DisplayName "Stat1Label" -InternalName "Stat1Label" -Type Text
Ensure-Field -ListTitle "Histoire" -DisplayName "Stat1Value" -InternalName "Stat1Value" -Type Text
Ensure-Field -ListTitle "Histoire" -DisplayName "Stat2Label" -InternalName "Stat2Label" -Type Text
Ensure-Field -ListTitle "Histoire" -DisplayName "Stat2Value" -InternalName "Stat2Value" -Type Text
Ensure-Field -ListTitle "Histoire" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number -Required

# ── Organigramme ────────────────────────────────────────────────────
Ensure-Field -ListTitle "Organigramme" -DisplayName "IconName" -InternalName "IconName" -Type Text -Required
Ensure-Field -ListTitle "Organigramme" -DisplayName "ColorClass" -InternalName "ColorClass" -Type Text
Ensure-Field -ListTitle "Organigramme" -DisplayName "BgColorClass" -InternalName "BgColorClass" -Type Text
Ensure-Field -ListTitle "Organigramme" -DisplayName "BorderColorClass" -InternalName "BorderColorClass" -Type Text
Ensure-Field -ListTitle "Organigramme" -DisplayName "GradientFrom" -InternalName "GradientFrom" -Type Text
Ensure-Field -ListTitle "Organigramme" -DisplayName "GradientTo" -InternalName "GradientTo" -Type Text
Ensure-Field -ListTitle "Organigramme" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number -Required

Write-Host "    colonne: Department [Lookup->Departements]" -NoNewline
try {
    $orgDept = Get-PnPField -List "Organigramme" -Identity "Department" -ErrorAction SilentlyContinue
    if (-not $orgDept) {
        $orgDept = Add-PnPField -List "Organigramme" -DisplayName "Department" -InternalName "Department" `
            -Type Lookup -LookupList "Departements" -LookupField "Title"
        Write-Ok "créée"
    } else {
        Write-Host " [EXISTS]" -ForegroundColor DarkGray
    }
} catch { Write-Warn $_ }

# ── BordereauPrix ───────────────────────────────────────────────────
Ensure-Field -ListTitle "BordereauPrix" -DisplayName "ClientName" -InternalName "ClientName" -Type Text -Required
Ensure-Field -ListTitle "BordereauPrix" -DisplayName "Subject" -InternalName "Subject" -Type Text -Required
Ensure-Field -ListTitle "BordereauPrix" -DisplayName "IssueDate" -InternalName "IssueDate" -Type DateTime -Required
Ensure-Field -ListTitle "BordereauPrix" -DisplayName "ValidUntil" -InternalName "ValidUntil" -Type DateTime
Ensure-Field -ListTitle "BordereauPrix" -DisplayName "QuoteStatus" -InternalName "QuoteStatus" -Type Choice `
    -Choices @("Brouillon","Envoyé","Accepté","Refusé","Expiré") -Required
Ensure-Field -ListTitle "BordereauPrix" -DisplayName "SubmissionAmount" -InternalName "SubmissionAmount" -Type Currency
Ensure-Field -ListTitle "BordereauPrix" -DisplayName "TotalHT" -InternalName "TotalHT" -Type Currency
Ensure-Field -ListTitle "BordereauPrix" -DisplayName "VatRate" -InternalName "VatRate" -Type Number -Required
Ensure-Field -ListTitle "BordereauPrix" -DisplayName "VatAmount" -InternalName "VatAmount" -Type Currency
Ensure-Field -ListTitle "BordereauPrix" -DisplayName "TotalTTC" -InternalName "TotalTTC" -Type Currency
Ensure-Field -ListTitle "BordereauPrix" -DisplayName "CurrencyCode" -InternalName "CurrencyCode" -Type Choice `
    -Choices @("XOF","EUR","USD") -Required
Ensure-Field -ListTitle "BordereauPrix" -DisplayName "SalesRep" -InternalName "SalesRep" -Type User

# ── BordereauLignes ─────────────────────────────────────────────────
Ensure-Field -ListTitle "BordereauLignes" -DisplayName "LineDescription" -InternalName "LineDescription" -Type Note -Required
Ensure-Field -ListTitle "BordereauLignes" -DisplayName "DeliveryDate" -InternalName "DeliveryDate" -Type DateTime
Ensure-Field -ListTitle "BordereauLignes" -DisplayName "Quantity" -InternalName "Quantity" -Type Number -Required
Ensure-Field -ListTitle "BordereauLignes" -DisplayName "UnitPrice" -InternalName "UnitPrice" -Type Currency -Required
Ensure-Field -ListTitle "BordereauLignes" -DisplayName "LineTotal" -InternalName "LineTotal" -Type Currency
Ensure-Field -ListTitle "BordereauLignes" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number -Required

Write-Host "    colonne: Quote [Lookup->BordereauPrix]" -NoNewline
try {
    $quoteLookup = Get-PnPField -List "BordereauLignes" -Identity "Quote" -ErrorAction SilentlyContinue
    if (-not $quoteLookup) {
        $quoteLookup = Add-PnPField -List "BordereauLignes" -DisplayName "Quote" -InternalName "Quote" `
            -Type Lookup -LookupList "BordereauPrix" -LookupField "Title"
        Write-Ok "créée"
    } else {
        Write-Host " [EXISTS]" -ForegroundColor DarkGray
    }
} catch { Write-Warn $_ }

# ── DonneesFinancieres ──────────────────────────────────────────────
Ensure-Field -ListTitle "DonneesFinancieres" -DisplayName "SeriesType" -InternalName "SeriesType" -Type Choice `
    -Choices @("Charges","TopClients","CA","Objectif") -Required
Ensure-Field -ListTitle "DonneesFinancieres" -DisplayName "Amount" -InternalName "Amount" -Type Currency -Required
Ensure-Field -ListTitle "DonneesFinancieres" -DisplayName "FiscalYear" -InternalName "FiscalYear" -Type Number -Required
Ensure-Field -ListTitle "DonneesFinancieres" -DisplayName "FiscalMonth" -InternalName "FiscalMonth" -Type Number
Ensure-Field -ListTitle "DonneesFinancieres" -DisplayName "FiscalQuarter" -InternalName "FiscalQuarter" -Type Choice `
    -Choices @("T1","T2","T3","T4")
Ensure-Field -ListTitle "DonneesFinancieres" -DisplayName "CurrencyCode" -InternalName "CurrencyCode" -Type Choice `
    -Choices @("XOF","EUR","USD") -Required
Ensure-Field -ListTitle "DonneesFinancieres" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number -Required

# ── FAQ ─────────────────────────────────────────────────────────────
Ensure-Field -ListTitle "FAQ" -DisplayName "Answer" -InternalName "Answer" -Type Note -Required
Ensure-Field -ListTitle "FAQ" -DisplayName "FaqCategory" -InternalName "FaqCategory" -Type Choice `
    -Choices @("Général","RH","IT","Finance","Commercial") -Required
Ensure-Field -ListTitle "FAQ" -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number -Required
Ensure-Field -ListTitle "FAQ" -DisplayName "IsActive" -InternalName "IsActive" -Type Boolean -Required `
    -DefaultValue "1"
Ensure-Field -ListTitle "FAQ" -DisplayName "ViewCount" -InternalName "ViewCount" -Type Number

Write-Host "    colonne: Department [Lookup->Departements]" -NoNewline
try {
    $faqDept = Get-PnPField -List "FAQ" -Identity "Department" -ErrorAction SilentlyContinue
    if (-not $faqDept) {
        $faqDept = Add-PnPField -List "FAQ" -DisplayName "Department" -InternalName "Department" `
            -Type Lookup -LookupList "Departements" -LookupField "Title"
        Write-Ok "créée"
    } else {
        Write-Host " [EXISTS]" -ForegroundColor DarkGray
    }
} catch { Write-Warn $_ }

# ── ParametresSite ──────────────────────────────────────────────────
Ensure-Field -ListTitle "ParametresSite" -DisplayName "SettingValue" -InternalName "SettingValue" -Type Note -Required
Ensure-Field -ListTitle "ParametresSite" -DisplayName "SettingDescription" -InternalName "SettingDescription" -Type Text
Ensure-Field -ListTitle "ParametresSite" -DisplayName "SettingCategory" -InternalName "SettingCategory" -Type Choice `
    -Choices @("company","social","feature","content") -Required

# ── Colonnes sur les bibliothèques départementales ──────────────────
foreach ($lib in @("Documents_Comptabilite","Documents_Administration","Documents_Commerciaux","Documents_Techniciens")) {
    Ensure-Field -ListTitle $lib -DisplayName "Title" -InternalName "Title" -Type Text
    Ensure-Field -ListTitle $lib -DisplayName "DocCategory" -InternalName "DocCategory" -Type Choice `
        -Choices @("Procédure","Modèle","Contrat","Rapport","Facture","Politique","Guide","Présentation","Formulaire","Autre") -Required
    Ensure-Field -ListTitle $lib -DisplayName "DocDescription" -InternalName "DocDescription" -Type Note
    Ensure-Field -ListTitle $lib -DisplayName "Confidentiality" -InternalName "Confidentiality" -Type Choice `
        -Choices @("Public","Interne","Confidentiel") -Required
    Ensure-Field -ListTitle $lib -DisplayName "ExpiryDate" -InternalName "ExpiryDate" -Type DateTime
    Ensure-Field -ListTitle $lib -DisplayName "DocOwner" -InternalName "DocOwner" -Type User
    Ensure-Field -ListTitle $lib -DisplayName "IsPinned" -InternalName "IsPinned" -Type Boolean -DefaultValue "0"
    Ensure-Field -ListTitle $lib -DisplayName "BusinessVersion" -InternalName "BusinessVersion" -Type Text
}

if (-not $DryRun) {
    foreach ($lib in @("Documents","Documents_Comptabilite","Documents_Administration","Documents_Commerciaux","Documents_Techniciens")) {
        Set-PnPField -List $lib -Identity "DocOwner" -Values @{ Required = $false } | Out-Null
    }
}

Write-Ok "Toutes les colonnes créées."

# ─────────────────────────────────────────────────────────────────────
# 3. IMPORT DES DONNÉES CSV
# ─────────────────────────────────────────────────────────────────────
if (-not $SkipDataImport) {
    Write-Step "Import des données..."

    # Helper: lit un CSV et ajoute chaque ligne dans la liste
    function Import-CsvToList {
        param(
            [string]$CsvPath,
            [string]$ListTitle,
            [hashtable]$RenameFields = @{}
        )
        if (-not (Test-Path $CsvPath)) {
            Write-Warn "CSV introuvable: $CsvPath"
            return
        }
        $rows = Import-Csv -Path $CsvPath -Encoding UTF8
        Write-Host "  [$ListTitle] $($rows.Count) lignes depuis $CsvPath"
        foreach ($row in $rows) {
            $values = @{}
            foreach ($prop in $row.PSObject.Properties) {
                $name = $prop.Name
                $val = $prop.Value
                if ($RenameFields.ContainsKey($name)) {
                    $name = $RenameFields[$name]
                }
                if ($val -ne $null -and $val -ne "") {
                    $values[$name] = $val
                }
            }
            Add-ListItem -ListTitle $ListTitle -Values $values
        }
    }

    # Departements (4 lignes — Title interne = "Nom du département" mais Title colonne = nom)
    Import-CsvToList -CsvPath (Join-Path $csvDir "Departements.csv") -ListTitle "Departements"

    # Missions (3 lignes)
    Import-CsvToList -CsvPath (Join-Path $csvDir "Missions.csv") -ListTitle "Missions"

    # Indicateurs (3 accueil + 6 histoire)
    Import-CsvToList -CsvPath (Join-Path $csvDir "Indicateurs.csv") -ListTitle "Indicateurs"

    # ParametresSite (15 clés)
    Import-CsvToList -CsvPath (Join-Path $csvDir "ParametresSite.csv") -ListTitle "ParametresSite"

    # LiensRapides (10 globaux + 24 départementaux)
    Import-CsvToList -CsvPath (Join-Path $csvDir "LiensRapides.csv") -ListTitle "LiensRapides"

    # Collaborateurs (8 profils maquette actifs + 20 profils archivés)
    Import-CsvToList -CsvPath (Join-Path $csvDir "Collaborateurs.csv") -ListTitle "Collaborateurs"

    if (-not $DryRun) {
        $collaboratorItems = Get-PnPListItem -List "Collaborateurs" -Fields "ID", "Title", "Division"
        $collaboratorByTitle = @{}
        foreach ($item in $collaboratorItems) {
            $collaboratorByTitle[$item["Title"]] = $item
        }

        $managerLinks = @{
            "Sandrine Tiahoun KINI"      = "YAYA Ouattara"
            "SERGE GEDEON OUE"           = "YAYA Ouattara"
            "Daouda DAO"                 = "SERGE GEDEON OUE"
            "Tegawende Martin YAMEOGO"   = "SERGE GEDEON OUE"
            "Aminata HEMA"               = "YAYA Ouattara"
            "Roukiatou OUEDRAOGO"        = "YAYA Ouattara"
            "Victorine BAZEMO"           = "Roukiatou OUEDRAOGO"
        }
        $departmentSlugByDivision = @{
            "Direction Générale" = "administration"
            "Engineering"        = "techniciens"
            "Comptabilité"       = "comptabilite"
            "Ventes & Marketing" = "commerciaux"
        }
        $departmentItems = Get-PnPListItem -List "Departements" -Fields "ID", "Slug"
        $departmentBySlug = @{}
        foreach ($department in $departmentItems) {
            $departmentBySlug[$department["Slug"]] = $department
        }

        foreach ($childName in $managerLinks.Keys) {
            $child = $collaboratorByTitle[$childName]
            $manager = $collaboratorByTitle[$managerLinks[$childName]]
            if ($child -and $manager) {
                Set-PnPListItem -List "Collaborateurs" -Identity $child.Id -Values @{ Manager = $manager.Id } | Out-Null
            }
        }
        foreach ($collaborator in $collaboratorItems) {
            $slug = $departmentSlugByDivision[$collaborator["Division"]]
            $department = $departmentBySlug[$slug]
            if ($department) {
                Set-PnPListItem -List "Collaborateurs" -Identity $collaborator.Id -Values @{ Department = $department.Id } | Out-Null
            }
        }
        Write-Ok "hiérarchie et départements des collaborateurs liés"
    }

    # Annonces (4 lignes)
    Import-CsvToList -CsvPath (Join-Path $csvDir "Annonces.csv") -ListTitle "Annonces"

    # CollaborateurDuMois (1 ligne)
    Import-CsvToList -CsvPath (Join-Path $csvDir "CollaborateurDuMois.csv") -ListTitle "CollaborateurDuMois"

    if (-not $DryRun) {
        $serge = Get-PnPListItem -List "Collaborateurs" -Fields "ID", "Title" | Where-Object { $_["Title"] -eq "SERGE GEDEON OUE" } | Select-Object -First 1
        $engineering = Get-PnPListItem -List "Departements" -Fields "ID", "Title", "Slug" | Where-Object { $_["Slug"] -eq "techniciens" } | Select-Object -First 1
        $currentEmployee = Get-PnPListItem -List "CollaborateurDuMois" -Fields "ID", "IsCurrent" | Where-Object { $_["IsCurrent"] -eq $true } | Select-Object -First 1
        if ($serge -and $engineering -and $currentEmployee) {
            Set-PnPListItem -List "CollaborateurDuMois" -Identity $currentEmployee.Id -Values @{
                Employee   = $serge.Id
                Department = $engineering.Id
            } | Out-Null
            Write-Ok "Collaborateur du mois lié à SERGE GEDEON OUE"
        } else {
            Write-Warn "Lookup CollaborateurDuMois non lié : vérifiez Collaborateurs, Departements et IsCurrent."
        }
    }

    # Projets (4 lignes)
    Import-CsvToList -CsvPath (Join-Path $csvDir "Projets.csv") -ListTitle "Projets"

    # Histoire (6 jalons)
    Import-CsvToList -CsvPath (Join-Path $csvDir "Histoire.csv") -ListTitle "Histoire"

    # Organigramme (4 directions)
    Import-CsvToList -CsvPath (Join-Path $csvDir "Organigramme.csv") -ListTitle "Organigramme"

    # BordereauPrix (1 ligne)
    Import-CsvToList -CsvPath (Join-Path $csvDir "BordereauPrix.csv") -ListTitle "BordereauPrix"

    # BordereauLignes (1 ligne — Quote lookup à lier après)
    Import-CsvToList -CsvPath (Join-Path $csvDir "BordereauLignes.csv") -ListTitle "BordereauLignes"

    # DonneesFinancieres (11 lignes)
    Import-CsvToList -CsvPath (Join-Path $csvDir "DonneesFinancieres.csv") -ListTitle "DonneesFinancieres"

    # Actualites (4 lignes)
    Import-CsvToList -CsvPath (Join-Path $csvDir "Actualites.csv") -ListTitle "Actualites"

    Write-Ok "Import CSV terminé."
} else {
    Write-Warn "SkipDataImport activé — pas d'import de contenu."
}

# ─────────────────────────────────────────────────────────────────────
# 4. UPLOAD DES IMAGES
# ─────────────────────────────────────────────────────────────────────
if (-not $SkipImages) {
    Write-Step "Upload des images..."

    # 4.1 HeroSlides (3 images)
    $heroImages = @(
        @{ Path = (Join-Path $imageDir "team\12-Modifier.jpg"); Meta = @{ Caption = "Construire le digital de demain, aujourd'hui."; SubCaption = "Innovation · Agilité · Excellence"; SortOrder = "1"; IsActive = "TRUE"; Title = "Hero 1" } },
        @{ Path = (Join-Path $imageDir "team\13-Modifier.jpg"); Meta = @{ Caption = "Des équipes expertes au service de vos projets."; SubCaption = "Développement · Architecture · Data"; SortOrder = "2"; IsActive = "TRUE"; Title = "Hero 2" } },
        @{ Path = (Join-Path $imageDir "team\14-Modifier.jpg"); Meta = @{ Caption = "Ensemble, nous transformons les idées en solutions."; SubCaption = "Cloud · IA · Cybersécurité"; SortOrder = "3"; IsActive = "TRUE"; Title = "Hero 3" } }
    )
    foreach ($h in $heroImages) {
        if (Test-Path $h.Path) {
            Upload-FileToLibrary -LibraryName "HeroSlides" -LocalPath $h.Path -Metadata $h.Meta
        } else {
            Write-Warn "Hero image introuvable: $($h.Path) (à uploader manuellement)"
        }
    }

    # 4.2 Galerie (8 images Unsplash — télécharger d'abord)
    $galleryUrls = @(
        @{ Url = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"; Caption = "All Hands Tech — Q2 2026"; Category = "Événements"; SortOrder = "1"; AltText = "All Hands Q2 2026" },
        @{ Url = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"; Caption = "Workshop Architecture Cloud"; Category = "Formation"; SortOrder = "2"; AltText = "Workshop Cloud" },
        @{ Url = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"; Caption = "Sprint Review Q1"; Category = "Projets"; SortOrder = "3"; AltText = "Sprint Review" },
        @{ Url = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"; Caption = "Demo Day — Projets IA"; Category = "Événements"; SortOrder = "4"; AltText = "Demo Day IA" },
        @{ Url = "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"; Caption = "Audit Cybersécurité S1"; Category = "Formation"; SortOrder = "5"; AltText = "Audit Cybersécurité" },
        @{ Url = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"; Caption = "Déploiement Infrastructure AWS"; Category = "Projets"; SortOrder = "6"; AltText = "Infrastructure AWS" },
        @{ Url = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"; Caption = "Soirée Annuelle Tech Awards"; Category = "Événements"; SortOrder = "7"; AltText = "Tech Awards" },
        @{ Url = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80"; Caption = "Hackathon Interne 2026"; Category = "Projets"; SortOrder = "8"; AltText = "Hackathon 2026" }
    )

    $galleryDir = Join-Path $env:TEMP "ika-gallery"
    if (-not (Test-Path $galleryDir)) { New-Item -ItemType Directory -Path $galleryDir -Force | Out-Null }

    $uploadedGalleryFiles = @{}
    foreach ($g in $galleryUrls) {
        $fileName = "gallery_$($g.SortOrder).jpg"
        $localPath = Join-Path $galleryDir $fileName
        if (-not (Test-Path $localPath)) {
            try {
                Invoke-WebRequest -Uri $g.Url -OutFile $localPath -UseBasicParsing | Out-Null
            } catch {
                Write-Warn "Téléchargement échoué ($($g.Caption)): $_"
                continue
            }
        }
        $meta = @{
            Caption        = $g.Caption
            GalleryCategory = $g.Category
            PhotoDate      = (Get-Date).ToString("yyyy-MM-dd")
            IsFeatured     = if ($g.SortOrder -eq "1") { "TRUE" } else { "FALSE" }
            AltText        = $g.AltText
            SortOrder      = $g.SortOrder
            Title          = $g.Caption
        }
        $galleryFile = Upload-FileToLibrary -LibraryName "Galerie" -LocalPath $localPath -Metadata $meta
        if ($galleryFile) {
            $uploadedGalleryFiles[$g.Caption] = $galleryFile
        }
    }

    $eventGalleryMap = @{
        "All Hands Tech — Q2 Review"     = "All Hands Tech — Q2 2026"
        "Workshop Architecture Cloud"    = "Workshop Architecture Cloud"
        "Demo Day — Projets IA"          = "Demo Day — Projets IA"
        "Revue Cybersécurité S1"         = "Audit Cybersécurité S1"
    }
    if (-not $DryRun) {
        foreach ($eventTitle in $eventGalleryMap.Keys) {
            $eventItem = Get-PnPListItem -List "Evenements" -Fields "ID", "Title" | Where-Object { $_["Title"] -eq $eventTitle } | Select-Object -First 1
            $eventFile = $uploadedGalleryFiles[$eventGalleryMap[$eventTitle]]
            if ($eventItem -and $eventFile) {
                $eventImageValue = ConvertTo-ModernImageValue -File $eventFile -FieldName "EventImage"
                Set-PnPListItem -List "Evenements" -Identity $eventItem.Id -Values @{ EventImage = $eventImageValue } | Out-Null
            }
        }
        Write-Ok "images des événements liées à la galerie"

        $newsGalleryMap = @{
            "Nouvelle plateforme DevOps disponible"              = "Déploiement Infrastructure AWS"
            "Lancement du programme de certification Cloud"      = "Workshop Architecture Cloud"
            "Mise à jour de la politique cybersécurité"          = "Audit Cybersécurité S1"
            "Roadmap IA et automatisation 2026"                  = "Demo Day — Projets IA"
        }
        foreach ($newsTitle in $newsGalleryMap.Keys) {
            $newsItem = Get-PnPListItem -List "Actualites" -Fields "ID", "Title" | Where-Object { $_["Title"] -eq $newsTitle } | Select-Object -First 1
            $newsFile = $uploadedGalleryFiles[$newsGalleryMap[$newsTitle]]
            if ($newsItem -and $newsFile) {
                $newsImageValue = ConvertTo-ModernImageValue -File $newsFile -FieldName "HeaderImage"
                Set-PnPListItem -List "Actualites" -Identity $newsItem.Id -Values @{ HeaderImage = $newsImageValue } | Out-Null
            }
        }
        Write-Ok "images des actualités liées à la galerie"
    }

    # 4.3 Assets du portail et photos des collaborateurs
    $logoPath = Join-Path $imageDir "logo.png"
    if (Test-Path $logoPath) {
        Upload-FileToLibrary -LibraryName "SiteAssets" -LocalPath $logoPath -Metadata @{}
    } else {
        Write-Warn "Logo introuvable: $logoPath"
    }

    $teamPhotos = @(
        @{ Name = "12-Modifier.jpg" },
        @{ Name = "13-Modifier.jpg" },
        @{ Name = "14-Modifier.jpg" },
        @{ Name = "DG.jpg";       Collaborateur = "YAYA Ouattara" },
        @{ Name = "Serge.jpg";    Collaborateur = "SERGE GEDEON OUE" },
        @{ Name = "Daouda.jpg";   Collaborateur = "Daouda DAO" },
        @{ Name = "SANDRINE.jpg"; Collaborateur = "Sandrine Tiahoun KINI" },
        @{ Name = "Martin.jpg";   Collaborateur = "Tegawende Martin YAMEOGO" },
        @{ Name = "Roukie.jpg";   Collaborateur = "Roukiatou OUEDRAOGO" },
        @{ Name = "Victorine.jpg";Collaborateur = "Victorine BAZEMO" },
        @{ Name = "aminata.jpg";  Collaborateur = "Aminata HEMA" }
    )

    $photoFolder = "SiteAssets/team"
    if (-not $DryRun) {
        Resolve-PnPFolder -SiteRelativePath $photoFolder | Out-Null
    }
    $uploadedTeamFiles = @{}

    foreach ($tp in $teamPhotos) {
        $src = Join-Path $imageDir "team\$($tp.Name)"
        if (Test-Path $src) {
            $file = Upload-FileToLibrary -LibraryName $photoFolder -LocalPath $src -Metadata @{}
            if ($file -and $tp.Collaborateur) {
                $uploadedTeamFiles[$tp.Collaborateur] = $file
                $collaborator = Get-PnPListItem -List "Collaborateurs" -Fields "ID", "Title" | Where-Object { $_["Title"] -eq $tp.Collaborateur } | Select-Object -First 1
                if ($collaborator) {
                    $imageValue = ConvertTo-ModernImageValue -File $file -FieldName "Photo"
                    Set-PnPListItem -List "Collaborateurs" -Identity $collaborator.Id -Values @{ Photo = $imageValue } | Out-Null
                    Write-Ok "photo $($tp.Name) liée à $($tp.Collaborateur)"
                } else {
                    Write-Warn "Collaborateur introuvable pour la photo: $($tp.Collaborateur)"
                }
            }
        } else {
            Write-Warn "Photo introuvable: $src"
        }
    }

    # 4.4 CollaborateurDuMois — photo Serge
    $sergeFile = $uploadedTeamFiles["SERGE GEDEON OUE"]
    if ($sergeFile) {
        $cdmItem = Get-PnPListItem -List "CollaborateurDuMois" -Fields "ID", "IsCurrent" | Where-Object { $_["IsCurrent"] -eq $true } | Select-Object -First 1
        if ($cdmItem) {
            $cdmImageValue = ConvertTo-ModernImageValue -File $sergeFile -FieldName "Photo"
            Set-PnPListItem -List "CollaborateurDuMois" -Identity $cdmItem.Id -Values @{ Photo = $cdmImageValue } | Out-Null
            Write-Ok "photo du collaborateur du mois liée à Serge.jpg"
        }
    }

    # 4.5 Fichiers placeholder pour Documents (6 globaux) + 4 bibliothèques départementales
    $docFiles = @(
        @{ Name = "Charte Développement.pdf";                    Title = "Charte Développement";   Cat = "Procédure"; Confidentiality = "Interne"; Library = "Documents" },
        @{ Name = "Architecture Patterns.pdf";                    Title = "Architecture Patterns";   Cat = "Guide";     Confidentiality = "Interne"; Library = "Documents" },
        @{ Name = "Templates de Projets.docx";                    Title = "Templates de Projets";    Cat = "Modèle";    Confidentiality = "Interne"; Library = "Documents" },
        @{ Name = "Processus CI-CD.pdf";                          Title = "Processus CI/CD";          Cat = "Procédure"; Confidentiality = "Interne"; Library = "Documents" },
        @{ Name = "Politique de Dépenses.pdf";                    Title = "Politique de Dépenses";    Cat = "Politique"; Confidentiality = "Interne"; Library = "Documents" },
        @{ Name = "Guide Cybersécurité.pdf";                      Title = "Guide Cybersécurité";      Cat = "Guide";     Confidentiality = "Interne"; Library = "Documents" },
        @{ Name = "Bilan 2025 - version finale.xlsx";           Cat = "Rapport";       Confidentiality = "Confidentiel"; Library = "Documents_Comptabilite" },
        @{ Name = "Liasse fiscale 2025.pdf";                     Cat = "Facture";       Confidentiality = "Confidentiel"; Library = "Documents_Comptabilite" },
        @{ Name = "Suivi factures fournisseurs.xlsx";           Cat = "Rapport";       Confidentiality = "Interne"; Library = "Documents_Comptabilite" },
        @{ Name = "Modèle note de frais 2026.docx";              Cat = "Modèle";        Confidentiality = "Interne"; Library = "Documents_Comptabilite" },
        @{ Name = "Reporting budget T2.xlsx";                   Cat = "Rapport";       Confidentiality = "Confidentiel"; Library = "Documents_Comptabilite" },
        @{ Name = "Modèle contrat CDI.docx";                     Cat = "Contrat";       Confidentiality = "Confidentiel"; Library = "Documents_Administration" },
        @{ Name = "Règlement intérieur 2026.pdf";               Cat = "Politique";     Confidentiality = "Interne"; Library = "Documents_Administration" },
        @{ Name = "Suivi des congés.xlsx";                       Cat = "Rapport";       Confidentiality = "Confidentiel"; Library = "Documents_Administration" },
        @{ Name = "Compte-rendu CSE juin 2026.docx";            Cat = "Rapport";       Confidentiality = "Interne"; Library = "Documents_Administration" },
        @{ Name = "Politique de recrutement.pdf";               Cat = "Politique";     Confidentiality = "Interne"; Library = "Documents_Administration" },
        @{ Name = "Catalogue services 2026.pdf";                Cat = "Présentation";  Confidentiality = "Public";  Library = "Documents_Commerciaux" },
        @{ Name = "Pipeline T3 - synthèse.xlsx";                Cat = "Rapport";       Confidentiality = "Interne"; Library = "Documents_Commerciaux" },
        @{ Name = "Gabarit proposition commerciale.docx";       Cat = "Modèle";        Confidentiality = "Interne"; Library = "Documents_Commerciaux" },
        @{ Name = "Tableau objectifs & commissions.xlsx";       Cat = "Rapport";       Confidentiality = "Interne"; Library = "Documents_Commerciaux" },
        @{ Name = "Analyse concurrentielle 2026.pptx";          Cat = "Présentation";  Confidentiality = "Interne"; Library = "Documents_Commerciaux" },
        @{ Name = "Runbook supervision - v2.pdf";               Cat = "Guide";         Confidentiality = "Interne"; Library = "Documents_Techniciens" },
        @{ Name = "Procédure intervention client.docx";         Cat = "Procédure";     Confidentiality = "Interne"; Library = "Documents_Techniciens" },
        @{ Name = "Inventaire parc matériel.xlsx";              Cat = "Rapport";       Confidentiality = "Interne"; Library = "Documents_Techniciens" },
        @{ Name = "Planning astreintes été.xlsx";               Cat = "Rapport";       Confidentiality = "Interne"; Library = "Documents_Techniciens" }
    )

    $tempDocs = Join-Path $env:TEMP "ika-docs"
    if (-not (Test-Path $tempDocs)) { New-Item -ItemType Directory -Path $tempDocs -Force | Out-Null }

    foreach ($doc in $docFiles) {
        $local = Join-Path $tempDocs $doc.Name
        if (-not (Test-Path $local)) {
            $null = New-Item -ItemType File -Path $local -Force | Out-Null
        }
        $documentTitle = if ($doc.Title) { $doc.Title } else { $doc.Name }
        $isPinned = if ($doc.Library -eq "Documents") { "TRUE" } else { "FALSE" }
        $meta = @{
            Title           = $documentTitle
            DocCategory     = $doc.Cat
            Confidentiality = $doc.Confidentiality
            IsPinned        = $isPinned
            BusinessVersion = "1.0"
        }
        Upload-FileToLibrary -LibraryName $doc.Library -LocalPath $local -Metadata $meta
    }

    Write-Ok "Upload des fichiers terminé."
} else {
    Write-Warn "SkipImages activé — pas d'upload d'images."
}

# ─────────────────────────────────────────────────────────────────────
# 5. INDEXATION (performance)
# ─────────────────────────────────────────────────────────────────────
Write-Step "Indexation des colonnes filtrées..."

$indexColumns = @{
    "Actualites"         = @("Scope","Highlighted","PublishDate")
    "Documents"          = @("DocCategory","IsPinned")
    "Evenements"         = @("EventDate")
    "LiensRapides"       = @("Scope","IsActive")
    "Annonces"           = @("SortOrder","Priority")
    "Projets"            = @("ShowOnHome")
    "HeroSlides"         = @("IsActive")
    "Indicateurs"        = @("Placement","IsActive")
    "Collaborateurs"     = @("IsActive","Division")
    "CollaborateurDuMois"= @("IsCurrent")
    "FAQ"                = @("IsActive","FaqCategory")
    "DonneesFinancieres" = @("FiscalYear")
    "Departements"       = @("Slug")
}

foreach ($listName in $indexColumns.Keys) {
    if (-not (Get-PnPList -Identity $listName -ErrorAction SilentlyContinue)) { continue }
    foreach ($col in $indexColumns[$listName]) {
        try {
            $field = Get-PnPField -List $listName -Identity $col -ErrorAction SilentlyContinue
            if ($field -and -not $field.Indexed) {
                Set-PnPField -List $listName -Identity $col -Values @{ Indexed = $true } | Out-Null
                Write-Ok "$listName::$col indexée"
            }
        } catch {
            Write-Warn "Index $listName::$col : $_"
        }
    }
}

# ─────────────────────────────────────────────────────────────────────
# 6. VUES (confort d'édition)
# ─────────────────────────────────────────────────────────────────────
Write-Step "Création des vues utiles..."

# Vue "Accueil" sur Actualites = Scope eq 'global'
try {
    $view = Add-PnPView -List "Actualites" -Title "Accueil" -Fields "Title","Excerpt","Category","PublishDate","Highlighted" -Query "<Where><Eq><FieldRef Name='Scope'/><Value Type='Choice'>global</Value></Eq></Where>" -ErrorAction SilentlyContinue
    if ($view) { Write-Ok "Vue 'Accueil' sur Actualites" }
} catch { Write-Warn "Vue Actualites/Accueil: $_" }

# Vue "Homepage" sur Projets = ShowOnHome eq 1
try {
    $view = Add-PnPView -List "Projets" -Title "Homepage" -Fields "Title","ProjectLead","Progress","ProjectStatus","DueDate" -Query "<Where><Eq><FieldRef Name='ShowOnHome'/><Value Type='Boolean'>1</Value></Eq></Where>" -ErrorAction SilentlyContinue
    if ($view) { Write-Ok "Vue 'Homepage' sur Projets" }
} catch { Write-Warn "Vue Projets/Homepage: $_" }

# ─────────────────────────────────────────────────────────────────────
# 7. THÈME IKA (optionnel — requiert droits tenant admin)
# ─────────────────────────────────────────────────────────────────────
Write-Step "Thème IKA..."
Write-Warn "Le thème requiert des droits tenant admin. Utilisez spfx/provisioning/theme/ika-theme.ps1 séparément."

# ─────────────────────────────────────────────────────────────────────
# RÉSUMÉ
# ─────────────────────────────────────────────────────────────────────
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  PROVISIONING TERMINÉ" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Listes créées        : $($createdLists.Count)" -ForegroundColor White
Write-Host "  Colonnes créées      : $($createdFields.Count)" -ForegroundColor White
Write-Host "  Images uploadées     : HeroSlides(3) + Galerie(8) + SiteAssets(1) + SiteAssets/team(11)" -ForegroundColor White
Write-Host "  Fichiers documents   : 25 placeholders uploadés" -ForegroundColor White
Write-Host "`nProchaine étape :" -ForegroundColor Yellow
Write-Host "  1. Ajouter la Web Part 'IKA — Intranet (composant principal)' sur la page d'accueil" -ForegroundColor White
Write-Host "  2. Passer la section en PLEINE LARGEUR" -ForegroundColor White
Write-Host "  3. Publier la page" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
