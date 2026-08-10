import {
  INewsItem,
  IDocumentItem,
  IEventItem,
  IQuickLink,
  IDepartement,
  ICollaborateur,
  IHeroSlide,
  IIndicator,
  IMission,
  IFaqItem,
  IProject,
  ICompanyInfo,
  IAnnouncement,
  IEmployeeOfMonth,
  IGalleryImage,
  IMilestone
} from "../models/IIkaModels";

const GRAD_NAVY =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230A2540'/%3E%3Cstop offset='1' stop-color='%2306B6D4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23g)'/%3E%3C/svg%3E";
const GRAD_CYAN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2306B6D4'/%3E%3Cstop offset='1' stop-color='%230A2540'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23g)'/%3E%3C/svg%3E";
const GRAD_EMERALD =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2310B981'/%3E%3Cstop offset='1' stop-color='%230A2540'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23g)'/%3E%3C/svg%3E";

export const MOCK_NEWS: INewsItem[] = [
  {
    Id: 1,
    Title: "IKA Solution : vers une nouvelle ère de services numériques",
    Excerpt: "Nous accélérons notre transformation pour mieux accompagner nos clients dans leurs défis technologiques.",
    Category: "Entreprise",
    PublishDate: "2026-06-25",
    Highlighted: true,
    Created: "2026-06-25",
    Modified: "2026-06-25",
    NewsAuthor: { Id: 1, Title: "YAYA Ouattara", EMail: "y.ouattara@ikasolution.com" }
  },
  {
    Id: 2,
    Title: "Lancement du nouveau pôle DevOps & Cloud",
    Excerpt: "Une équipe dédiée pour optimiser vos infrastructures et accélérer vos déploiements.",
    Category: "Projet",
    PublishDate: "2026-06-20",
    Highlighted: false,
    Created: "2026-06-20",
    Modified: "2026-06-20",
    NewsAuthor: { Id: 2, Title: "SERGE GEDEON OUE", EMail: "s.gedeon@ikasolution.com" }
  },
  {
    Id: 3,
    Title: "Webinaire : Sécurité des données en 2026",
    Excerpt: "Rejoignez nos experts pour un tour d'horizon des nouvelles menaces et solutions.",
    Category: "Événement",
    PublishDate: "2026-06-15",
    Highlighted: false,
    Created: "2026-06-15",
    Modified: "2026-06-15",
    NewsAuthor: { Id: 3, Title: "Daouda DAO", EMail: "d.dao@ikasolution.com" }
  },
  {
    Id: 101,
    Title: "Résultats T2 : une croissance record",
    Excerpt: "Nos objectifs annuels sont en avance grâce à l'engagement de toutes les équipes.",
    Category: "Finance",
    PublishDate: "2026-06-29",
    Highlighted: true,
    Created: "2026-06-29",
    Modified: "2026-06-29",
    NewsAuthor: { Id: 4, Title: "Aminata HEMA", EMail: "a.hema@ikasolution.com" }
  }
];

export const MOCK_DOCUMENTS: IDocumentItem[] = [
  {
    Id: 1,
    Title: "Charte informatique IKA Solution.pdf",
    FileRef: "/sites/ikareview/Documents/Charte informatique IKA Solution.pdf",
    FileLeafRef: "Charte informatique IKA Solution.pdf",
    DocCategory: "Procédure",
    Confidentiality: "Public",
    IsPinned: true,
    Modified: "2026-06-20",
    Created: "2026-06-20",
    Editor: { Id: 5, Title: "Direction Technique" }
  },
  {
    Id: 2,
    Title: "Guide du nouvel arrivant.docx",
    FileRef: "/sites/ikareview/Documents/Guide du nouvel arrivant.docx",
    FileLeafRef: "Guide du nouvel arrivant.docx",
    DocCategory: "Guide",
    Confidentiality: "Interne",
    IsPinned: true,
    Modified: "2026-06-05",
    Created: "2026-06-05",
    Editor: { Id: 6, Title: "RH" }
  },
  {
    Id: 3,
    Title: "Modele_Bordereau_Prix_2026.xlsx",
    FileRef: "/sites/ikareview/Documents/Modele_Bordereau_Prix_2026.xlsx",
    FileLeafRef: "Modele_Bordereau_Prix_2026.xlsx",
    DocCategory: "Commercial",
    Confidentiality: "Interne",
    IsPinned: false,
    Modified: "2026-05-18",
    Created: "2026-05-18",
    Editor: { Id: 7, Title: "Direction Commerciale" }
  },
  {
    Id: 4,
    Title: "Politique_Securite_SI.pdf",
    FileRef: "/sites/ikareview/Documents/Politique_Securite_SI.pdf",
    FileLeafRef: "Politique_Securite_SI.pdf",
    DocCategory: "Cybersécurité",
    Confidentiality: "Confidentiel",
    IsPinned: false,
    Modified: "2026-04-12",
    Created: "2026-04-12",
    Editor: { Id: 5, Title: "Direction Technique" }
  }
];

export const MOCK_DEPARTEMENTS: IDepartement[] = [
  {
    Id: 1,
    Title: "Comptabilité",
    Slug: "comptabilite",
    Tagline: "Pilotage financier & reporting",
    DeptDescription: "Suivi budgétaire, factures fournisseurs/clients, paie, déclarations fiscales et reporting de gestion.",
    HeroTitle: "Espace Comptabilité",
    HeroSubtitle: "Vos documents financiers, rapports et échéances fiscales au même endroit.",
    Accent: "navy",
    IconName: "finance",
    SiteUrl: { Url: "#documents", Description: "Comptabilité" },
    AccentClasses: "bg-brand-navy text-white",
    BadgeClasses: "bg-blue-100 text-blue-800",
    MemberCount: 12,
    SortOrder: 1,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Administration",
    Slug: "administration",
    Tagline: "RH, juridique & vie de l'entreprise",
    DeptDescription: "Congés, contrats, vie sociale, processus administratifs et ressources internes.",
    HeroTitle: "Espace Administration",
    HeroSubtitle: "Gestion administrative, RH, contrats et démarches internes.",
    Accent: "cyan",
    IconName: "admin",
    SiteUrl: { Url: "#documents", Description: "Administration" },
    AccentClasses: "bg-brand-cyan text-white",
    BadgeClasses: "bg-cyan-100 text-cyan-800",
    MemberCount: 8,
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Commerciaux",
    Slug: "commerciaux",
    Tagline: "Développement & relations clients",
    DeptDescription: "Bordereaux de prix, propositions commerciales, suivi des opportunités et partenariats.",
    HeroTitle: "Espace Commercial",
    HeroSubtitle: "Bordereaux de prix, offres et relations clients.",
    Accent: "navy",
    IconName: "Users",
    SiteUrl: { Url: "#bordereau", Description: "Commerciaux" },
    AccentClasses: "bg-amber-600 text-white",
    BadgeClasses: "bg-amber-100 text-amber-800",
    MemberCount: 15,
    SortOrder: 3,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "Techniciens",
    Slug: "techniciens",
    Tagline: "Ingénierie & infrastructure",
    DeptDescription: "Développement logiciel, administration systèmes, cloud DevOps et cybersécurité.",
    HeroTitle: "Espace Technique",
    HeroSubtitle: "Architecture logicielle, cloud et déploiements.",
    Accent: "cyan",
    IconName: "Settings",
    SiteUrl: { Url: "#organigramme", Description: "Techniciens" },
    AccentClasses: "bg-blue-600 text-white",
    BadgeClasses: "bg-blue-100 text-blue-800",
    MemberCount: 35,
    SortOrder: 4,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_COMPANY: ICompanyInfo = {
  name: "IKA Solution",
  tagline: "Ingénierie informatique & solutions sur mesure",
  legalName: "IKA Solution SARL",
  address: "Ouagadougou, Burkina Faso",
  email: "contact@ikasolution.com",
  phone: "+226 70 70 70 70",
  copyrightYears: "2015–2026",
  social: {
    facebook: "#",
    linkedin: "#",
    twitter: "#",
    instagram: "#",
    whatsapp: "#"
  }
};

export const MOCK_SLIDES: IHeroSlide[] = [
  {
    Id: 1,
    Title: "Bienvenue sur l'intranet IKA Solution",
    FileRef: GRAD_NAVY,
    Caption: "Votre espace de travail collaboratif",
    SubCaption:
      "Actualités, documents, bordereaux de prix, organigramme et équipe réunis au même endroit.",
    CtaLabel: "Découvrir",
    SortOrder: 1,
    IsActive: true,
    AltText: "Hero IKA Solution",
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Nos départements & expertises",
    FileRef: GRAD_CYAN,
    Caption: "Ingénierie digitale & services technologiques",
    SubCaption:
      "Direction Générale, Direction Technique, Comptabilité et Direction Commerciale à votre service.",
    CtaLabel: "Explorer",
    SortOrder: 2,
    IsActive: true,
    AltText: "Départements IKA",
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Rejoignez la dynamique IKA",
    FileRef: GRAD_EMERALD,
    Caption: "Collaboration & excellence",
    SubCaption:
      "Galerie photos, annonces et collaborateur du mois pour une culture d'entreprise vivante.",
    CtaLabel: "Y participer",
    SortOrder: 3,
    IsActive: true,
    AltText: "Communauté IKA",
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_MISSIONS: IMission[] = [
  {
    Id: 1,
    Title: "Notre mission",
    Tag: "Mission",
    MissionText:
      "Accompagner la transformation numérique avec rigueur, excellence et proximité.",
    IconName: "Target",
    MissionType: "Mission",
    SortOrder: 1,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Notre vision",
    Tag: "Vision",
    MissionText:
      "Devenir la référence de l'ingénierie informatique et de l'innovation technologique.",
    IconName: "Eye",
    MissionType: "Vision",
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Nos valeurs",
    Tag: "Valeurs",
    MissionText:
      "Excellence, intégrité, collaboration et passion au service de chaque projet.",
    IconName: "Heart",
    MissionType: "Valeur",
    SortOrder: 3,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_STATS: IIndicator[] = [
  {
    Id: 1,
    Title: "Collaborateurs",
    StatValue: "138",
    IconName: "Users",
    Placement: "Hero accueil",
    SortOrder: 1,
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Projets livrés",
    StatValue: "200+",
    IconName: "Briefcase",
    Placement: "Hero accueil",
    SortOrder: 2,
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Pays d'implantation",
    StatValue: "4",
    IconName: "Building",
    Placement: "Hero accueil",
    SortOrder: 3,
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "Satisfaction client",
    StatValue: "98%",
    IconName: "Calendar",
    Placement: "Hero accueil",
    SortOrder: 4,
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_ANNOUNCEMENTS: IAnnouncement[] = [
  {
    Id: 1,
    Title: "Anniversaire de Daouda DAO",
    AnnouncementType: "Anniversaire",
    Detail: "Toute l'équipe IKA Solution lui souhaite un joyeux anniversaire !",
    Emoji: "🎂",
    AnnouncementDate: "2026-08-10",
    DisplayUntil: "2026-08-31",
    Priority: "Normale",
    Created: "2026-08-01",
    Modified: "2026-08-01"
  },
  {
    Id: 2,
    Title: "Arrivée de Victorine BAZEMO",
    AnnouncementType: "Arrivée",
    Detail: "Bienvenue à notre nouvelle assistante commerciale !",
    Emoji: "👋",
    AnnouncementDate: "2026-08-05",
    DisplayUntil: "2026-08-31",
    Priority: "Haute",
    Created: "2026-08-02",
    Modified: "2026-08-02"
  },
  {
    Id: 3,
    Title: "Séminaire annuel IKA 2026",
    AnnouncementType: "Événement",
    Detail: "Save the date : notre grand séminaire annuel aura lieu fin septembre.",
    Emoji: "📅",
    AnnouncementDate: "2026-08-08",
    DisplayUntil: "2026-09-30",
    Priority: "Haute",
    Created: "2026-08-03",
    Modified: "2026-08-03"
  }
];

export const MOCK_EVENTS: IEventItem[] = [
  {
    Id: 1,
    Title: "Webinaire — Sécurité des données 2026",
    EventDate: "2026-08-20T10:00:00Z",
    EndDate: "2026-08-20T11:30:00Z",
    fAllDayEvent: false,
    Location: "En ligne (Teams)",
    EventCategory: "Formation",
    IsMandatory: false,
    Created: "2026-08-01",
    Modified: "2026-08-01"
  },
  {
    Id: 2,
    Title: "Petit-déjeuner d'équipe & Welcome Day",
    EventDate: "2026-08-22T08:30:00Z",
    EndDate: "2026-08-22T09:30:00Z",
    fAllDayEvent: false,
    Location: "Ouagadougou — Siège",
    EventCategory: "Événement",
    IsMandatory: false,
    Created: "2026-08-02",
    Modified: "2026-08-02"
  },
  {
    Id: 3,
    Title: "Comité de direction",
    EventDate: "2026-08-25T14:00:00Z",
    EndDate: "2026-08-25T16:00:00Z",
    fAllDayEvent: false,
    Location: "Salle de réunion A",
    EventCategory: "Réunion",
    IsMandatory: true,
    Created: "2026-08-03",
    Modified: "2026-08-03"
  },
  {
    Id: 4,
    Title: "Afterwork IKA Solution",
    EventDate: "2026-08-28T18:00:00Z",
    EndDate: "2026-08-28T21:00:00Z",
    fAllDayEvent: false,
    Location: "Espace convivialité",
    EventCategory: "Événement",
    IsMandatory: false,
    Created: "2026-08-04",
    Modified: "2026-08-04"
  }
];

export const MOCK_QUICKLINKS: IQuickLink[] = [
  {
    Id: 1,
    Title: "Bordereau des prix",
    LinkUrl: { Url: "#bordereau", Description: "Bordereau des prix" },
    LinkDescription: "Calculateur et devis en ligne",
    IconName: "xlsx",
    SortOrder: 1,
    OpenInNewTab: false,
    LinkGroup: "Outils",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Organigramme",
    LinkUrl: { Url: "#organigramme", Description: "Organigramme" },
    LinkDescription: "Structure hiérarchique et équipes",
    IconName: "GitBranch",
    SortOrder: 2,
    OpenInNewTab: false,
    LinkGroup: "Outils",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Bibliothèque documentaire",
    LinkUrl: { Url: "#documents", Description: "Documents" },
    LinkDescription: "Tous les documents et procédures",
    IconName: "FolderOpen",
    SortOrder: 3,
    OpenInNewTab: false,
    LinkGroup: "Ressources",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "Notre Histoire",
    LinkUrl: { Url: "#histoire", Description: "Histoire" },
    LinkDescription: "Origines et jalons clés depuis 2015",
    IconName: "book",
    SortOrder: 4,
    OpenInNewTab: false,
    LinkGroup: "Ressources",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 5,
    Title: "Toutes les annonces",
    LinkUrl: { Url: "#annonces", Description: "Annonces" },
    LinkDescription: "Événements, naissances et arrivées",
    IconName: "megaphone",
    SortOrder: 5,
    OpenInNewTab: false,
    LinkGroup: "Vie d'équipe",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_GALLERY: IGalleryImage[] = [
  {
    Id: 1,
    Title: "Séminaire Annuel",
    FileLeafRef: "seminaire.jpg",
    FileRef: GRAD_NAVY,
    Caption: "Séminaire annuel des équipes IKA",
    GalleryCategory: "Événements",
    IsFeatured: true,
    AltText: "Séminaire IKA",
    SortOrder: 1,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Atelier Technique & Cloud",
    FileLeafRef: "atelier.jpg",
    FileRef: GRAD_CYAN,
    Caption: "Atelier DevOps & architectures résilientes",
    GalleryCategory: "Technique",
    IsFeatured: true,
    AltText: "Atelier technique",
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Team Building",
    FileLeafRef: "teambuilding.jpg",
    FileRef: GRAD_EMERALD,
    Caption: "Journée de cohésion et d'échange",
    GalleryCategory: "Événements",
    IsFeatured: false,
    AltText: "Team building",
    SortOrder: 3,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "Célébration des réussites",
    FileLeafRef: "prix.jpg",
    FileRef: GRAD_CYAN,
    Caption: "Remise des prix d'excellence",
    GalleryCategory: "Vie interne",
    IsFeatured: false,
    AltText: "Remise de prix",
    SortOrder: 4,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_COLLABORATORS: ICollaborateur[] = [
  {
    Id: 1,
    Title: "YAYA Ouattara",
    JobTitle: "Directeur Général",
    Email: "y.ouattara@ikasolution.com",
    Phone: "+226 70 70 70 70",
    HierarchyLevel: 1,
    Division: "Direction Générale",
    IsActive: true,
    SortOrder: 1,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Sandrine T. KINI",
    JobTitle: "Assistante de Direction",
    Email: "s.kini@ikasolution.com",
    Phone: "+226 70 70 70 70",
    HierarchyLevel: 2,
    Division: "Direction Générale",
    Manager: { Id: 1, Title: "YAYA Ouattara" },
    IsActive: true,
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "SERGE GEDEON OUE",
    JobTitle: "Ingénieur Principal",
    Email: "s.gedeon@ikasolution.com",
    Phone: "+226 70 70 70 70",
    HierarchyLevel: 2,
    Division: "Engineering",
    Manager: { Id: 1, Title: "YAYA Ouattara" },
    IsActive: true,
    SortOrder: 3,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "Daouda DAO",
    JobTitle: "Développeur Front End",
    Email: "d.dao@ikasolution.com",
    Phone: "+226 70 70 70 70",
    HierarchyLevel: 3,
    Division: "Engineering",
    Manager: { Id: 3, Title: "SERGE GEDEON OUE" },
    IsActive: true,
    SortOrder: 4,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 5,
    Title: "Tegawende M. YAMEOGO",
    JobTitle: "Développeur Junior",
    Email: "m.yameogo@ikasolution.com",
    Phone: "+226 70 70 70 70",
    HierarchyLevel: 3,
    Division: "Engineering",
    Manager: { Id: 3, Title: "SERGE GEDEON OUE" },
    IsActive: true,
    SortOrder: 5,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 6,
    Title: "Aminata HEMA",
    JobTitle: "Comptable",
    Email: "a.hema@ikasolution.com",
    Phone: "+226 70 70 70 70",
    HierarchyLevel: 2,
    Division: "Comptabilité",
    Manager: { Id: 1, Title: "YAYA Ouattara" },
    IsActive: true,
    SortOrder: 6,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 7,
    Title: "Roukiatou OUEDRAOGO",
    JobTitle: "Responsable Commerciale",
    Email: "r.ouedraogo@ikasolution.com",
    Phone: "+226 70 70 70 70",
    HierarchyLevel: 2,
    Division: "Ventes & Marketing",
    Manager: { Id: 1, Title: "YAYA Ouattara" },
    IsActive: true,
    SortOrder: 7,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 8,
    Title: "Victorine BAZEMO",
    JobTitle: "Assistante Commerciale",
    Email: "v.bazemo@ikasolution.com",
    Phone: "+226 70 70 70 70",
    HierarchyLevel: 3,
    Division: "Ventes & Marketing",
    Manager: { Id: 7, Title: "Roukiatou OUEDRAOGO" },
    IsActive: true,
    SortOrder: 8,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_EMPLOYEE: IEmployeeOfMonth = {
  Id: 1,
  Title: "Collaborateur du mois — Août 2026",
  Employee: { Id: 4, Title: "Daouda DAO" },
  DisplayRole: "Développeur Front End",
  Department: { Id: 4, Title: "Engineering" },
  Quote:
    "Construire des interfaces fluides, intuitives et performantes pour nos collaborateurs et clients est ma plus grande fierté.",
  NominatedBy: "SERGE GEDEON OUE",
  PeriodStart: "2026-08-01",
  IsCurrent: true,
  Created: "2026-08-01",
  Modified: "2026-08-01"
};

export const MOCK_PROJECTS: IProject[] = [
  {
    Id: 1,
    Title: "Portail Intranet SharePoint IKA",
    ProjectLead: "SERGE GEDEON OUE",
    Progress: 85,
    ProjectStatus: "À l'heure",
    DueDate: "2026-09-30",
    TasksDone: 17,
    TasksTotal: 20,
    ShowOnHome: true,
    SortOrder: 1,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Plateforme Fintech Régionale",
    ProjectLead: "Daouda DAO",
    Progress: 60,
    ProjectStatus: "À l'heure",
    DueDate: "2026-10-15",
    TasksDone: 12,
    TasksTotal: 20,
    ShowOnHome: true,
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Automatisation Bordereaux & Devis",
    ProjectLead: "Roukiatou OUEDRAOGO",
    Progress: 45,
    ProjectStatus: "À risque",
    DueDate: "2026-08-31",
    TasksDone: 9,
    TasksTotal: 20,
    ShowOnHome: true,
    SortOrder: 3,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "Certification ISO 27001 Audit 2026",
    ProjectLead: "YAYA Ouattara",
    Progress: 95,
    ProjectStatus: "À l'heure",
    DueDate: "2026-08-20",
    TasksDone: 19,
    TasksTotal: 20,
    ShowOnHome: true,
    SortOrder: 4,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_MILESTONES: IMilestone[] = [
  {
    Id: 1,
    Year: "2015",
    Quarter: "T1",
    Title: "La genèse",
    MilestoneDescription:
      "YAYA Ouattara fonde IKA Solution dans un bureau de Ouagadougou avec une vision claire : démocratiser l'ingénierie digitale en Afrique de l'Ouest.",
    IconName: "Rocket",
    Tag: "Fondation",
    TagColorClass: "ika-bg-violet-100 ika-text-violet-700",
    Side: "right",
    Stat1Label: "Fondateurs",
    Stat1Value: "3",
    Stat2Label: "Projets",
    Stat2Value: "1",
    SortOrder: 1,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Year: "2016",
    Quarter: "T3",
    Title: "Premier grand contrat",
    MilestoneDescription:
      "Signature du premier contrat majeur avec une institution financière. Développement d'une plateforme bancaire marquant notre entrée dans la Fintech.",
    IconName: "Award",
    Tag: "Fintech",
    TagColorClass: "ika-bg-amber-100 ika-text-amber-700",
    Side: "left",
    Stat1Label: "Équipe",
    Stat1Value: "8",
    Stat2Label: "Clients",
    Stat2Value: "4",
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Year: "2018",
    Quarter: "T2",
    Title: "Expansion régionale",
    MilestoneDescription:
      "Ouverture de notre deuxième bureau régional à Abidjan. Lancement du pôle Cloud & Data et accélération des déploiements.",
    IconName: "Globe",
    Tag: "Expansion",
    TagColorClass: "ika-bg-blue-100 ika-text-blue-700",
    Side: "right",
    Stat1Label: "Équipe",
    Stat1Value: "25",
    Stat2Label: "Pays",
    Stat2Value: "2",
    SortOrder: 3,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Year: "2020",
    Quarter: "T1",
    Title: "Pivot digital & résilience",
    MilestoneDescription:
      "Accompagnement d'urgence des entreprises vers le travail collaboratif et les infrastructures cloud hautement disponibles.",
    IconName: "Zap",
    Tag: "Innovation",
    TagColorClass: "ika-bg-emerald-100 ika-text-emerald-700",
    Side: "left",
    Stat1Label: "Équipe",
    Stat1Value: "40",
    Stat2Label: "Projets actifs",
    Stat2Value: "18",
    SortOrder: 4,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 5,
    Year: "2022",
    Quarter: "T4",
    Title: "Certification & excellence",
    MilestoneDescription:
      "Obtention de la certification ISO 27001 en cybersécurité et lancement du programme IKA Academy pour la formation des talents.",
    IconName: "ShieldCheck",
    Tag: "Certification",
    TagColorClass: "ika-bg-rose-100 ika-text-rose-700",
    Side: "right",
    Stat1Label: "Certifiés",
    Stat1Value: "12",
    Stat2Label: "Formés",
    Stat2Value: "80+",
    SortOrder: 5,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 6,
    Year: "2026",
    Quarter: "T2",
    Title: "IKA Solution aujourd'hui",
    MilestoneDescription:
      "Plus de 138 collaborateurs, présents dans 4 pays avec plus de 200 projets technologiques livrés avec succès.",
    IconName: "TrendingUp",
    Tag: "Aujourd'hui",
    TagColorClass: "ika-bg-brand-cyan/20 ika-text-brand-cyan-dark",
    Side: "left",
    Stat1Label: "Collaborateurs",
    Stat1Value: "138",
    Stat2Label: "Projets livrés",
    Stat2Value: "200+",
    SortOrder: 6,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_FAQ: IFaqItem[] = [
  {
    Id: 1,
    Title: "Comment demander des congés ou une absence ?",
    Answer:
      "Rendez-vous dans la section Administration / RH ou utilisez le lien dédié dans l'accès rapide pour soumettre votre formulaire de demande.",
    FaqCategory: "RH",
    SortOrder: 1,
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Comment exporter un bordereau de prix ?",
    Answer:
      "Dans l'onglet Bordereau des prix, saisissez vos articles puis cliquez sur le bouton 'Exporter (CSV)' pour télécharger votre fichier exploitable dans Excel.",
    FaqCategory: "Commercial",
    SortOrder: 2,
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Qui contacter pour un support informatique interne ?",
    Answer:
      "L'équipe Technique est joignable via l'organigramme ou à l'adresse support@ikasolution.com.",
    FaqCategory: "Technique",
    SortOrder: 3,
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];
