<#
.SYNOPSIS
    Importe les donnees de reference et de demonstration issues de la maquette.

.DESCRIPTION
    Etape 4 du provisioning. Alimente les listes de referentiel
    (Departements, Parametres, Missions, Indicateurs, Histoire, Organigramme)
    avec le contenu reel de data/*.ts et des pages du prototype Next.js.

    Idempotent : un element portant le meme Title n'est pas recree.

.PARAMETER SkipDemo
    N'importe que les referentiels indispensables, sans le contenu de demo.

.EXAMPLE
    .\04-Import-SampleData.ps1 -HubUrl "https://ikasolution.sharepoint.com/sites/ika-intranet"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$HubUrl,

    [Parameter(Mandatory = $false)]
    [switch]$SkipDemo,

    [Parameter(Mandatory = $false)]
    [string]$TenantRoot = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($TenantRoot)) {
    $TenantRoot = ($HubUrl -split "/sites/")[0]
}

function Add-ItemIfMissing {
    param(
        [string]$ListName,
        [hashtable]$Values,
        [string]$KeyField = "Title"
    )

    $key = $Values[$KeyField]
    $safe = $key -replace "'", "''"
    $query = "<View><Query><Where><Eq><FieldRef Name='$KeyField'/>" +
             "<Value Type='Text'>$safe</Value></Eq></Where></Query></View>"

    $existing = Get-PnPListItem -List $ListName -Query $query -ErrorAction SilentlyContinue

    if ($null -ne $existing -and $existing.Count -gt 0) {
        Write-Host "    deja present : $key" -ForegroundColor DarkGray
        return
    }

    Add-PnPListItem -List $ListName -Values $Values | Out-Null
    Write-Host "    ajoute : $key" -ForegroundColor Green
}

Write-Host "=== Connexion au hub ===" -ForegroundColor Cyan
Connect-PnPOnline -Url $HubUrl -Interactive

# ------------------------------------------------------------------
# Departements - source : data/departements.ts
# ------------------------------------------------------------------
Write-Host "`n=== Departements ===" -ForegroundColor Cyan

$departements = @(
    @{
        Title         = "Comptabilite"
        Slug          = "comptabilite"
        Tagline       = "Pilotage financier & reporting"
        DeptDescription = "Suivi budgetaire, factures fournisseurs/clients, paie, declarations fiscales et reporting de gestion."
        HeroTitle     = "Espace Comptabilite"
        HeroSubtitle  = "Vos documents financiers, rapports et echeances fiscales au meme endroit."
        Accent        = "navy"
        IconName      = "Calculator"
        SiteUrl       = "$TenantRoot/sites/ika-comptabilite"
        AccentClasses = "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white"
        BadgeClasses  = "bg-emerald-100 text-emerald-700"
        MemberCount   = 15
        SortOrder     = 10
    }
    @{
        Title         = "Administration"
        Slug          = "administration"
        Tagline       = "RH, juridique & vie de l'entreprise"
        DeptDescription = "Conges, contrats, vie sociale, processus administratifs et ressources internes."
        HeroTitle     = "Espace Administration"
        HeroSubtitle  = "Gestion administrative, RH, contrats et demarches internes."
        Accent        = "cyan"
        IconName      = "Briefcase"
        SiteUrl       = "$TenantRoot/sites/ika-administration"
        AccentClasses = "bg-violet-50 text-violet-700 group-hover:bg-violet-700 group-hover:text-white"
        BadgeClasses  = "bg-violet-100 text-violet-700"
        MemberCount   = 18
        SortOrder     = 20
    }
    @{
        Title         = "Commerciaux"
        Slug          = "commerciaux"
        Tagline       = "Pipeline, devis & clients"
        DeptDescription = "Suivi commercial, opportunites, devis, clients et objectifs par equipe."
        HeroTitle     = "Espace Commerciaux"
        HeroSubtitle  = "Votre pipeline, vos opportunites et vos outils de suivi commercial."
        Accent        = "navy"
        IconName      = "Megaphone"
        SiteUrl       = "$TenantRoot/sites/ika-commerciaux"
        AccentClasses = "bg-orange-50 text-orange-700 group-hover:bg-orange-700 group-hover:text-white"
        BadgeClasses  = "bg-orange-100 text-orange-700"
        MemberCount   = 24
        SortOrder     = 30
    }
    @{
        Title         = "Techniciens"
        Slug          = "techniciens"
        Tagline       = "Support, interventions & projets"
        DeptDescription = "Tickets d'intervention, base de connaissance, planning technique et projets clients."
        HeroTitle     = "Espace Techniciens"
        HeroSubtitle  = "Suivi des interventions, ressources techniques et base de connaissance."
        Accent        = "cyan"
        IconName      = "Code2"
        SiteUrl       = "$TenantRoot/sites/ika-techniciens"
        AccentClasses = "bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white"
        BadgeClasses  = "bg-blue-100 text-blue-700"
        MemberCount   = 5
        SortOrder     = 40
    }
)

foreach ($d in $departements) { Add-ItemIfMissing -ListName "Departements" -Values $d }

# ------------------------------------------------------------------
# Parametres du site - source : data/company.ts
# ------------------------------------------------------------------
Write-Host "`n=== Parametres du site ===" -ForegroundColor Cyan

$settings = @(
    @{ Title = "company.name";           SettingValue = "IKA Solution";                                      SettingCategory = "Societe"; SettingDescription = "Nom commercial" }
    @{ Title = "company.tagline";        SettingValue = "Ingenierie informatique & services numeriques";     SettingCategory = "Societe"; SettingDescription = "Slogan" }
    @{ Title = "company.legalName";      SettingValue = "IKA Solution SARL";                                 SettingCategory = "Societe"; SettingDescription = "Raison sociale" }
    @{ Title = "company.address";        SettingValue = "Ouagadougou, Burkina Faso";                         SettingCategory = "Contact"; SettingDescription = "Adresse du siege" }
    @{ Title = "company.email";          SettingValue = "contact@ikasolution.com";                           SettingCategory = "Contact"; SettingDescription = "Email general" }
    @{ Title = "company.phone";          SettingValue = "+226 70 70 70 70";                                  SettingCategory = "Contact"; SettingDescription = "Telephone standard" }
    @{ Title = "company.copyrightYears"; SettingValue = "2024-2026";                                         SettingCategory = "Affichage"; SettingDescription = "Annees du pied de page" }
    @{ Title = "social.facebook";        SettingValue = "https://facebook.com";                              SettingCategory = "Reseaux sociaux"; SettingDescription = "Page Facebook" }
    @{ Title = "social.linkedin";        SettingValue = "https://linkedin.com";                              SettingCategory = "Reseaux sociaux"; SettingDescription = "Page LinkedIn" }
    @{ Title = "social.twitter";         SettingValue = "https://twitter.com";                               SettingCategory = "Reseaux sociaux"; SettingDescription = "Compte X" }
    @{ Title = "social.instagram";       SettingValue = "https://instagram.com";                             SettingCategory = "Reseaux sociaux"; SettingDescription = "Compte Instagram" }
    @{ Title = "social.whatsapp";        SettingValue = "https://whatsapp.com";                              SettingCategory = "Reseaux sociaux"; SettingDescription = "Contact WhatsApp" }
)

foreach ($s in $settings) { Add-ItemIfMissing -ListName "ParametresSite" -Values $s }

# ------------------------------------------------------------------
# Missions - source : data/home.ts + app/histoire/page.tsx
# ------------------------------------------------------------------
Write-Host "`n=== Missions, vision, valeurs ===" -ForegroundColor Cyan

$missions = @(
    @{ Title = "Accelerer la transformation digitale"; Tag = "Notre Mission"; MissionType = "Mission"; IconName = "Rocket"
       MissionText = "Nous concevons des solutions technologiques sur mesure qui permettent a nos clients de gagner en efficacite, en agilite et en competitivite sur leur marche."
       SortOrder = 10 }
    @{ Title = "Etre le partenaire tech de reference"; Tag = "Notre Vision"; MissionType = "Vision"; IconName = "Globe"
       MissionText = "Devenir l'acteur incontournable de l'ingenierie digitale en Afrique et a l'international, en placant l'humain et l'innovation au coeur de chaque projet."
       SortOrder = 20 }
    @{ Title = "Excellence, Integrite, Collaboration"; Tag = "Nos Valeurs"; MissionType = "Valeur"; IconName = "Zap"
       MissionText = "Chaque ligne de code, chaque architecture, chaque livraison reflete notre engagement envers la qualite, la transparence et l'esprit d'equipe."
       SortOrder = 30 }
    @{ Title = "Excellence Technique"; Tag = "Valeur"; MissionType = "Valeur"; IconName = "Code2"
       MissionText = "Chaque ligne de code reflete notre obsession de la qualite et du detail."
       ColorClass = "text-blue-600"; BgClass = "bg-blue-50"; SortOrder = 40 }
    @{ Title = "Passion & Engagement"; Tag = "Valeur"; MissionType = "Valeur"; IconName = "Heart"
       MissionText = "Nous mettons notre coeur dans chaque projet, chaque client, chaque defi."
       ColorClass = "text-rose-600"; BgClass = "bg-rose-50"; SortOrder = 50 }
    @{ Title = "Esprit d'equipe"; Tag = "Valeur"; MissionType = "Valeur"; IconName = "Users"
       MissionText = "Notre force reside dans la diversite et la complementarite de nos talents."
       ColorClass = "text-violet-600"; BgClass = "bg-violet-50"; SortOrder = 60 }
    @{ Title = "Impact africain"; Tag = "Valeur"; MissionType = "Valeur"; IconName = "Globe"
       MissionText = "Nous croyons au potentiel du numerique pour transformer l'Afrique."
       ColorClass = "text-emerald-600"; BgClass = "bg-emerald-50"; SortOrder = 70 }
)

foreach ($m in $missions) { Add-ItemIfMissing -ListName "Missions" -Values $m }

# ------------------------------------------------------------------
# Indicateurs - source : heroStats + globalStats
# ------------------------------------------------------------------
Write-Host "`n=== Indicateurs ===" -ForegroundColor Cyan

$indicateurs = @(
    @{ Title = "Projets actifs";       StatValue = "24";   IconName = "FolderOpen"; Placement = "Hero accueil";  SortOrder = 10; IsActive = $true }
    @{ Title = "Collaborateurs";       StatValue = "138";  IconName = "Users";      Placement = "Les deux";      SortOrder = 20; IsActive = $true }
    @{ Title = "Tickets ouverts";      StatValue = "12";   IconName = "Target";     Placement = "Hero accueil";  SortOrder = 30; IsActive = $true }
    @{ Title = "Pays";                 StatValue = "4";    IconName = "Globe";      Placement = "Page histoire"; SortOrder = 40; IsActive = $true }
    @{ Title = "Projets livres";       StatValue = "200+"; IconName = "Code2";      Placement = "Page histoire"; SortOrder = 50; IsActive = $true }
    @{ Title = "Satisfaction client";  StatValue = "98%";  IconName = "Star";       Placement = "Page histoire"; SortOrder = 60; IsActive = $true }
    @{ Title = "Annees d'experience";  StatValue = "9";    IconName = "Calendar";   Placement = "Page histoire"; SortOrder = 70; IsActive = $true }
    @{ Title = "Certifications";       StatValue = "12";   IconName = "Award";      Placement = "Page histoire"; SortOrder = 80; IsActive = $true }
)

foreach ($i in $indicateurs) { Add-ItemIfMissing -ListName "Indicateurs" -Values $i }

# ------------------------------------------------------------------
# Organigramme - source : app/organigramme/page.tsx
# ------------------------------------------------------------------
Write-Host "`n=== Directions de l'organigramme ===" -ForegroundColor Cyan

$directions = @(
    @{ Title = "Direction Generale"; IconName = "Building2"; ColorClass = "text-violet-700"
       BgColorClass = "bg-violet-50"; BorderColorClass = "border-violet-200"
       GradientFrom = "from-violet-500"; GradientTo = "to-purple-600"; SortOrder = 10 }
    @{ Title = "Engineering"; IconName = "Code2"; ColorClass = "text-blue-700"
       BgColorClass = "bg-blue-50"; BorderColorClass = "border-blue-200"
       GradientFrom = "from-blue-500"; GradientTo = "to-cyan-600"; SortOrder = 20 }
    @{ Title = "Ventes & Marketing"; IconName = "Megaphone"; ColorClass = "text-orange-700"
       BgColorClass = "bg-orange-50"; BorderColorClass = "border-orange-200"
       GradientFrom = "from-orange-500"; GradientTo = "to-amber-600"; SortOrder = 30 }
    @{ Title = "Comptabilite"; IconName = "ShieldCheck"; ColorClass = "text-emerald-700"
       BgColorClass = "bg-emerald-50"; BorderColorClass = "border-emerald-200"
       GradientFrom = "from-emerald-500"; GradientTo = "to-teal-600"; SortOrder = 40 }
)

foreach ($d in $directions) { Add-ItemIfMissing -ListName "Organigramme" -Values $d }

if ($SkipDemo) {
    Write-Host "`n=== Referentiels importes (mode SkipDemo) ===" -ForegroundColor Cyan
    return
}

# ------------------------------------------------------------------
# Histoire - source : app/histoire/page.tsx
# ------------------------------------------------------------------
Write-Host "`n=== Jalons de l'histoire ===" -ForegroundColor Cyan

$milestones = @(
    @{ Title = "La genese"; Year = "2015"; Quarter = "T1"; IconName = "Rocket"; Tag = "Fondation"
       TagColorClass = "bg-violet-100 text-violet-700"; Side = "right"
       MilestoneDescription = "YAYA Ouattara fonde IKA Solution dans un petit bureau de Ouagadougou avec une vision claire : democratiser l'ingenierie digitale en Afrique de l'Ouest. Les trois premiers collaborateurs rejoignent l'aventure."
       Stat1Label = "Fondateurs"; Stat1Value = "3"; Stat2Label = "Projets"; Stat2Value = "1"; SortOrder = 10 }
    @{ Title = "Premier grand contrat"; Year = "2016"; Quarter = "T3"; IconName = "Award"; Tag = "Milestone"
       TagColorClass = "bg-amber-100 text-amber-700"; Side = "left"
       MilestoneDescription = "Signature du premier contrat majeur avec une institution financiere nationale. Developpement d'une plateforme de gestion bancaire qui marque notre entree dans le secteur Fintech."
       Stat1Label = "Equipe"; Stat1Value = "8"; Stat2Label = "Clients"; Stat2Value = "4"; SortOrder = 20 }
)

foreach ($m in $milestones) { Add-ItemIfMissing -ListName "Histoire" -Values $m }

# ------------------------------------------------------------------
# Collaborateurs - source : data/home.ts (homeCollaborators)
# ------------------------------------------------------------------
Write-Host "`n=== Collaborateurs ===" -ForegroundColor Cyan

$deptLookup = @{}
foreach ($item in (Get-PnPListItem -List "Departements")) {
    $deptLookup[$item["Title"]] = $item["ID"]
}

$collaborateurs = @(
    @{ Title = "YAYA Ouattara";            JobTitle = "Directeur General";        Division = "Direction Generale";  Email = "y.ouattara@ikasolution.com"; Phone = "+226 70 70 70 70"; OfficeLocation = "Ouagadougou, Burkina Faso"; HierarchyLevel = 0; IsActive = $true; SortOrder = 10 }
    @{ Title = "SERGE GEDEON OUE";         JobTitle = "Developpeur Full Stack";   Division = "Engineering";         Email = "s.gedeon@ikasolution.com";   Phone = "+226 70 70 70 70"; OfficeLocation = "Ouagadougou, Burkina Faso"; HierarchyLevel = 2; IsActive = $true; SortOrder = 20 }
    @{ Title = "Daouda DAO";               JobTitle = "Developpeur Front End";    Division = "Engineering";         Email = "d.dao@ikasolution.com";      Phone = "+226 70 70 70 70"; OfficeLocation = "Ouagadougou, Burkina Faso"; HierarchyLevel = 3; IsActive = $true; SortOrder = 30 }
    @{ Title = "Sandrine Tiahoun KINI";    JobTitle = "Assistante de Direction";  Division = "Direction Generale";  Email = "s.kini@ikasolution.com";     Phone = "+226 70 70 70 70"; OfficeLocation = "Ouagadougou, Burkina Faso"; HierarchyLevel = 2; IsActive = $true; SortOrder = 40 }
    @{ Title = "Tegawende Martin YAMEOGO"; JobTitle = "Developpeur Junior";       Division = "Engineering";         Email = "m.yameogo@ikasolution.com";  Phone = "+226 70 70 70 70"; OfficeLocation = "Ouagadougou, Burkina Faso"; HierarchyLevel = 3; IsActive = $true; SortOrder = 50 }
    @{ Title = "Roukiatou OUEDRAOGO";      JobTitle = "Commerciale";              Division = "Ventes & Marketing";  Email = "r.ouedraogo@ikasolution.com"; Phone = "+226 70 70 70 70"; OfficeLocation = "Ouagadougou, Burkina Faso"; HierarchyLevel = 2; IsActive = $true; SortOrder = 60 }
    @{ Title = "Victorine BAZEMO";         JobTitle = "Assistante Commerciale";   Division = "Ventes & Marketing";  Email = "v.bazemo@ikasolution.com";   Phone = "+226 70 70 70 70"; OfficeLocation = "Ouagadougou, Burkina Faso"; HierarchyLevel = 3; IsActive = $true; SortOrder = 70 }
    @{ Title = "Aminata HEMA";             JobTitle = "Compliance Officer";       Division = "Comptabilite";        Email = "a.hema@ikasolution.com";     Phone = "+226 70 70 70 70"; OfficeLocation = "Ouagadougou, Burkina Faso"; HierarchyLevel = 2; IsActive = $true; SortOrder = 80 }
)

$divisionToDept = @{
    "Direction Generale" = "Administration"
    "Engineering"        = "Techniciens"
    "Ventes & Marketing" = "Commerciaux"
    "Comptabilite"       = "Comptabilite"
    "Administration"     = "Administration"
    "Support Technique"  = "Techniciens"
}

foreach ($c in $collaborateurs) {
    $deptName = $divisionToDept[$c.Division]
    if ($deptLookup.ContainsKey($deptName)) {
        $c["Department"] = $deptLookup[$deptName]
    }
    Add-ItemIfMissing -ListName "Collaborateurs" -Values $c
}

Write-Host "`n=== Termine ===" -ForegroundColor Cyan
Write-Host "Photos, images et documents restent a televerser manuellement." -ForegroundColor Yellow
Write-Host "Etape suivante : deploiement du package SPFx (.sppkg)." -ForegroundColor Yellow
