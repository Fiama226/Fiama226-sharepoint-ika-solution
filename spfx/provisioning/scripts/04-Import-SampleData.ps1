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

# ------------------------------------------------------------------
# News - source : data/news.ts
# ------------------------------------------------------------------
Write-Host "`n=== News ===" -ForegroundColor Cyan

$newsItems = @(
    @{ Title = "IKA Solution retient un nouveau contrat avec la Mairie de Lyon"; Excerpt = "Un projet de modernisation du SI métropolitain sur 18 mois, démarrage en septembre."; Scope = "global"; Category = "projet"; AuthorDisplay = "Direction Commerciale"; PublishDate = "2026-06-28"; Highlighted = $true }
    @{ Title = "Rentrée 2026 : nouvel open-space pôle ingénierie"; Excerpt = "Le plateau technique déménage au 4e étage. Visite guidée prévue le 5 septembre."; Scope = "global"; Category = "entreprise"; AuthorDisplay = "Direction des opérations"; PublishDate = "2026-06-21" }
    @{ Title = "Webinaire : cybersécurité et bonnes pratiques"; Excerpt = "Session obligatoire pour tous les collaborateurs, inscriptions ouvertes sur l'intranet."; Scope = "global"; Category = "evenement"; AuthorDisplay = "RSSI"; PublishDate = "2026-06-15" }
    @{ Title = "Résultats semestriels en hausse de +12 %"; Excerpt = "Le CA progresse grâce au pôle Cloud et aux missions d'infogérance."; Scope = "global"; Category = "finance"; AuthorDisplay = "Direction Générale"; PublishDate = "2026-06-10" }
    @{ Title = "Clôture annuelle 2025 : échéances et jalons"; Excerpt = "Préparation de la liasse fiscale, dates limites et points de blocage à traiter."; Scope = "comptabilite"; Category = "finance"; AuthorDisplay = "Awa Kaboré"; PublishDate = "2026-06-30"; Highlighted = $true }
    @{ Title = "Nouveau workflow de validation des notes de frais"; Excerpt = "Saisie 100 % en ligne, validation manager sous 48 h, remboursement J+3."; Scope = "comptabilite"; Category = "admin"; AuthorDisplay = "Contrôle de gestion"; PublishDate = "2026-06-22" }
    @{ Title = "Reporting mensuel : nouveau modèle Power BI"; Excerpt = "Tableaux de bord financier partagés en accès libre à la direction."; Scope = "comptabilite"; Category = "finance"; AuthorDisplay = "Contrôle de gestion"; PublishDate = "2026-06-12" }
    @{ Title = "Campagne d'entretiens annuels 2026 ouverte"; Excerpt = "Réservez votre créneau avec votre manager entre le 1er et le 30 septembre."; Scope = "administration"; Category = "rh"; AuthorDisplay = "RH"; PublishDate = "2026-06-29"; Highlighted = $true }
    @{ Title = "Mise à jour du règlement intérieur"; Excerpt = "Télétravail, plages horaires et astreintes : consultez la nouvelle version."; Scope = "administration"; Category = "rh"; AuthorDisplay = "RH"; PublishDate = "2026-06-18" }
    @{ Title = "CSE : inscriptions sortie d'été"; Excerpt = "Journée de cohésion le 12 juillet, inscriptions closes le 30 juin."; Scope = "administration"; Category = "evenement"; AuthorDisplay = "CSE"; PublishDate = "2026-06-09" }
    @{ Title = "Objectifs T3 : répartition par portefeuille"; Excerpt = "Nouveaux quotas par commercial et primes associées pour le 3e trimestre."; Scope = "commerciaux"; Category = "commercial"; AuthorDisplay = "Direction Commerciale"; PublishDate = "2026-06-27"; Highlighted = $true }
    @{ Title = "Nouveau catalogue services Cloud & Infogérance 2026"; Excerpt = "Révision des grilles tarifaires et nouvelles offres managées disponibles."; Scope = "commerciaux"; Category = "commercial"; AuthorDisplay = "Marketing"; PublishDate = "2026-06-20" }
    @{ Title = "Deal win : référence bancaire sur 3 ans"; Excerpt = "Mission d'infogérance sécurisée, démarrage Q4. Bravo à l'équipe Île-de-France."; Scope = "commerciaux"; Category = "projet"; AuthorDisplay = "Direction Commerciale"; PublishDate = "2026-06-11" }
    @{ Title = "Migration plateforme de supervision : jalon 2 atteint"; Excerpt = "Promotion des sondes en production prévue mardi 22 h, fenêtre de maintenance 2 h."; Scope = "techniciens"; Category = "technique"; AuthorDisplay = "Exploitation"; PublishDate = "2026-06-26"; Highlighted = $true }
    @{ Title = "Base de connaissance : nouveau modèle d'article"; Excerpt = "Format standardisé pour les runbooks et procédures d'intervention."; Scope = "techniciens"; Category = "technique"; AuthorDisplay = "Référent technique"; PublishDate = "2026-06-17" }
    @{ Title = "Astreintes week-end : rotation juillet-août"; Excerpt = "Planning publié, merci de confirmer vos disponibilités auprès du manager."; Scope = "techniciens"; Category = "admin"; AuthorDisplay = "Responsable exploitation"; PublishDate = "2026-06-08" }
)

foreach ($n in $newsItems) { Add-ItemIfMissing -ListName "News" -Values $n }

# ------------------------------------------------------------------
# Events - source : data/home.ts
# ------------------------------------------------------------------
Write-Host "`n=== Events ===" -ForegroundColor Cyan

$events = @(
    @{ Title = "All Hands Tech — Q2 Review"; MonthLabel = "JUN"; DayLabel = "10"; EventDate = "2026-06-10"; ImageUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&q=80"; EventTag = "Stratégie" }
    @{ Title = "Workshop Architecture Cloud"; MonthLabel = "JUN"; DayLabel = "18"; EventDate = "2026-06-18"; ImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=80&q=80"; EventTag = "Tech" }
    @{ Title = "Demo Day — Projets IA"; MonthLabel = "JUN"; DayLabel = "25"; EventDate = "2026-06-25"; ImageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=80&q=80"; EventTag = "Innovation" }
    @{ Title = "Revue Cybersécurité S1"; MonthLabel = "JUL"; DayLabel = "3"; EventDate = "2026-07-03"; ImageUrl = "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=80&q=80"; EventTag = "SecOps" }
)

foreach ($e in $events) { Add-ItemIfMissing -ListName "Events" -Values $e }

# ------------------------------------------------------------------
# QuickLinks - source : data/home.ts
# ------------------------------------------------------------------
Write-Host "`n=== QuickLinks ===" -ForegroundColor Cyan

$quickLinks = @(
    @{ Title = "Calcul bordereau des prix"; IconName = "Users"; LinkUrl = "/Bordereaudesprix"; SortOrder = 10 }
    @{ Title = "Demande de congés"; IconName = "Globe"; LinkUrl = "/commerciaux"; SortOrder = 20 }
    @{ Title = "RH & Avantages"; IconName = "Heart"; LinkUrl = "/administration"; SortOrder = 30 }
    @{ Title = "Support IT"; IconName = "Headphones"; LinkUrl = "/techniciens"; SortOrder = 40 }
    @{ Title = "Base de Connaissances"; IconName = "Database"; LinkUrl = "/histoire"; SortOrder = 50 }
    @{ Title = "Outils DevOps"; IconName = "Settings"; LinkUrl = "/techniciens"; SortOrder = 60 }
)

foreach ($q in $quickLinks) { Add-ItemIfMissing -ListName "QuickLinks" -Values $q }

# ------------------------------------------------------------------
# Annonces (bandeau) - source : data/home.ts
# ------------------------------------------------------------------
Write-Host "`n=== Annonces ===" -ForegroundColor Cyan

$announcements = @(
    @{ Title = "Mariage de Koffi et Aïcha"; Detail = "Félicitations à nos collègues du pôle Tech"; AnnouncementType = "Mariage"; Emoji = "💍"; AnnouncementDate = "2026-08-15"; DisplayUntil = "2026-08-20" }
    @{ Title = "Anniversaire de Souleymane"; Detail = "Joyeux anniversaire au responsable QA"; AnnouncementType = "Anniversaire"; Emoji = "🎉"; AnnouncementDate = "2026-07-22"; DisplayUntil = "2026-07-25" }
    @{ Title = "Bienvenue à Bébé Inès"; Detail = "Félicitations à l'équipe RH pour cette naissance"; AnnouncementType = "Naissance"; Emoji = "👶"; AnnouncementDate = "2026-09-02"; DisplayUntil = "2026-09-10" }
    @{ Title = "Soirée d'été IKA"; Detail = "Réservez votre place pour le 10 juillet"; AnnouncementType = "Événement"; Emoji = "🌞"; AnnouncementDate = "2026-07-10"; DisplayUntil = "2026-07-12" }
)

foreach ($a in $announcements) { Add-ItemIfMissing -ListName "Annonces" -Values $a }

# ------------------------------------------------------------------
# Projets - source : data/home.ts
# ------------------------------------------------------------------
Write-Host "`n=== Projets ===" -ForegroundColor Cyan

$projects = @(
    @{ Title = "Migration Microservices"; ProjectLead = "Cloud Team"; Progress = 78; ProjectStatus = "À l'heure"; DueDate = "2026-06-30"; TasksDone = 14; TasksTotal = 18; ShowOnHome = $true }
    @{ Title = "Portail Client v3.0"; ProjectLead = "Frontend"; Progress = 45; ProjectStatus = "À risque"; DueDate = "2026-07-15"; TasksDone = 9; TasksTotal = 20; ShowOnHome = $true }
    @{ Title = "Pipeline Data IA"; ProjectLead = "Data Team"; Progress = 92; ProjectStatus = "À l'heure"; DueDate = "2026-06-28"; TasksDone = 22; TasksTotal = 24; ShowOnHome = $true }
    @{ Title = "Audit Cybersécurité"; ProjectLead = "SecOps"; Progress = 30; ProjectStatus = "En retard"; DueDate = "2026-08-01"; TasksDone = 6; TasksTotal = 20; ShowOnHome = $true }
)

foreach ($p in $projects) { Add-ItemIfMissing -ListName "Projets" -Values $p }

# ------------------------------------------------------------------
# Galerie - source : data/home.ts
# ------------------------------------------------------------------
Write-Host "`n=== Galerie ===" -ForegroundColor Cyan

$gallery = @(
    @{ Title = "All Hands Tech — Q2 2026"; Caption = "All Hands Tech — Q2 2026"; GalleryCategory = "Événements"; PhotoDate = "2026-06-10"; IsFeatured = $true; AltText = "All Hands Tech Q2" }
    @{ Title = "Workshop Architecture Cloud"; Caption = "Workshop Architecture Cloud"; GalleryCategory = "Formation"; PhotoDate = "2026-06-18"; IsFeatured = $true; AltText = "Workshop Cloud" }
    @{ Title = "Demo Day — Projets IA"; Caption = "Demo Day — Projets IA"; GalleryCategory = "Événements"; PhotoDate = "2026-06-25"; IsFeatured = $true; AltText = "Demo IA" }
)

foreach ($g in $gallery) { Add-ItemIfMissing -ListName "Galerie" -Values $g }

# ------------------------------------------------------------------
# CollaborateurDuMois - source : data/home.ts
# ------------------------------------------------------------------
Write-Host "`n=== Collaborateur du mois ===" -ForegroundColor Cyan

$employeeOfMonth = @{
    Title = "SERGE GEDEON OUE"
    DisplayRole = "Lead Software Engineer"
    Quote = "Il s'est distingué par son excellence technique et sa capacité à livrer des solutions cloud scalables dans des délais serrés."
    NominatedBy = "YAYA Ouattara, Directeur Général"
    PeriodStart = "2026-06-01"
    IsCurrent = $true
}

Add-ItemIfMissing -ListName "CollaborateurDuMois" -Values $employeeOfMonth

Write-Host "`n=== Termine ===" -ForegroundColor Cyan
Write-Host "Photos, images et documents restent a televerser manuellement." -ForegroundColor Yellow
Write-Host "Etape suivante : deploiement du package SPFx (.sppkg)." -ForegroundColor Yellow
