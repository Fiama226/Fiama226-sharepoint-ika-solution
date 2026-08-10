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
  IGalleryImage
} from "../models/IIkaModels";

// Dégradés hors-ligne (data URI) pour que la prévisualisation Workbench
// affiche un rendu complet sans dépendre d'images SharePoint.
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
    NewsAuthor: { Id: 1, Title: "Mehdi Benali", EMail: "mehdi.benali@ika-solution.fr" }
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
    NewsAuthor: { Id: 2, Title: "Référent technique", EMail: "tech@ika-solution.fr" }
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
    NewsAuthor: { Id: 3, Title: "RSSI", EMail: "rssi@ika-solution.fr" }
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
    NewsAuthor: { Id: 4, Title: "Direction Financière", EMail: "finance@ika-solution.fr" }
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
    Editor: { Id: 5, Title: "RSSI" }
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
    SiteUrl: { Url: "/sites/ikareview/SitePages/Comptabilite.aspx", Description: "Comptabilité" },
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
    SiteUrl: { Url: "/sites/ikareview/SitePages/Administration.aspx", Description: "Administration" },
    AccentClasses: "bg-brand-cyan text-white",
    BadgeClasses: "bg-cyan-100 text-cyan-800",
    MemberCount: 8,
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_COMPANY: ICompanyInfo = {
  name: "IKA Solution",
  tagline: "Ingénierie informatique & services numériques",
  legalName: "IKA Solution SARL",
  address: "12 rue de l'Innovation, 75012 Paris, France",
  email: "contact@ika-solution.fr",
  phone: "+33 1 23 45 67 89",
  copyrightYears: "2024–2026",
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
    Title: "Bienvenue sur l'intranet IKA",
    FileRef: GRAD_NAVY,
    Caption: "Votre espace de travail collaboratif",
    SubCaption:
      "Actualités, documents et équipe réunis au même endroit, dans un design fidèle à l'application.",
    CtaLabel: "Découvrir",
    SortOrder: 1,
    IsActive: true,
    AltText: "Hero IKA Solution",
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Nos départements",
    FileRef: GRAD_CYAN,
    Caption: "Ingénierie informatique & services numériques",
    SubCaption:
      "Comptabilité, Administration, Commerciaux et Techniciens : tout votre périmètre métier.",
    CtaLabel: "Explorer",
    SortOrder: 2,
    IsActive: true,
    AltText: "Départements IKA",
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Rejoignez la communauté",
    FileRef: GRAD_EMERALD,
    Caption: "Partagez et collaborez",
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
      "Accompagner la transformation numérique de nos clients avec rigueur et proximité.",
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
      "Devenir la référence de l'ingénierie informatique en Afrique et en Europe.",
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
      "Excellence, intégrité, collaboration et innovation au service de chaque projet.",
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
    StatValue: "120+",
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
    StatValue: "350+",
    IconName: "Briefcase",
    Placement: "Hero accueil",
    SortOrder: 2,
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Clients accompagnés",
    StatValue: "60+",
    IconName: "Building",
    Placement: "Hero accueil",
    SortOrder: 3,
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "Années d'expérience",
    StatValue: "12",
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
    Title: "Anniversaire de Aminata Traoré",
    AnnouncementType: "Anniversaire",
    Detail: "Toute l'équipe lui souhaite un excellent anniversaire !",
    Emoji: "🎂",
    AnnouncementDate: "2026-08-10",
    DisplayUntil: "2026-08-31",
    Priority: "Normale",
    Created: "2026-08-01",
    Modified: "2026-08-01"
  },
  {
    Id: 2,
    Title: "Arrivée de Karim Ouattara",
    AnnouncementType: "Arrivée",
    Detail: "Bienvenue à notre nouveau consultant DevOps !",
    Emoji: "👋",
    AnnouncementDate: "2026-08-05",
    DisplayUntil: "2026-08-31",
    Priority: "Haute",
    Created: "2026-08-02",
    Modified: "2026-08-02"
  },
  {
    Id: 3,
    Title: "Séminaire annuel",
    AnnouncementType: "Événement",
    Detail: "Save the date : notre séminaire se tiendra fin septembre.",
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
    Title: "Petit-déjeuner d'équipe",
    EventDate: "2026-08-22T08:30:00Z",
    EndDate: "2026-08-22T09:30:00Z",
    fAllDayEvent: false,
    Location: "Paris — Open space",
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
    Title: "Afterwork IKA",
    EventDate: "2026-08-28T18:00:00Z",
    EndDate: "2026-08-28T21:00:00Z",
    fAllDayEvent: false,
    Location: "Paris — Rooftop",
    EventCategory: "Événement",
    IsMandatory: false,
    Created: "2026-08-04",
    Modified: "2026-08-04"
  }
];

export const MOCK_QUICKLINKS: IQuickLink[] = [
  {
    Id: 1,
    Title: "Portail RH",
    LinkUrl: { Url: "#", Description: "Portail RH" },
    LinkDescription: "Congés, fiches de paie, demandes",
    IconName: "User",
    SortOrder: 1,
    OpenInNewTab: false,
    LinkGroup: "Outils",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Helpdesk",
    LinkUrl: { Url: "#", Description: "Helpdesk" },
    LinkDescription: "Ouvrir un ticket support",
    IconName: "Help",
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
    LinkUrl: { Url: "#", Description: "Documents" },
    LinkDescription: "Tous les documents partagés",
    IconName: "Document",
    SortOrder: 3,
    OpenInNewTab: false,
    LinkGroup: "Ressources",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "Annuaire",
    LinkUrl: { Url: "#", Description: "Annuaire" },
    LinkDescription: "Trouver un collaborateur",
    IconName: "AddressBook",
    SortOrder: 4,
    OpenInNewTab: false,
    LinkGroup: "Ressources",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 5,
    Title: "Espace Comptabilité",
    LinkUrl: { Url: "#", Description: "Comptabilité" },
    LinkDescription: "Reporting et échéances",
    IconName: "Calculator",
    SortOrder: 5,
    OpenInNewTab: false,
    LinkGroup: "Départements",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 6,
    Title: "Espace Commercial",
    LinkUrl: { Url: "#", Description: "Commerciaux" },
    LinkDescription: "Pipelines et devis",
    IconName: "Cart",
    SortOrder: 6,
    OpenInNewTab: false,
    LinkGroup: "Départements",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_GALLERY: IGalleryImage[] = [
  {
    Id: 1,
    Title: "Séminaire 2025",
    FileLeafRef: "seminaire.jpg",
    FileRef: GRAD_NAVY,
    Caption: "Séminaire annuel d'équipe",
    GalleryCategory: "Événements",
    IsFeatured: true,
    AltText: "Séminaire IKA",
    SortOrder: 1,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Atelier technique",
    FileLeafRef: "atelier.jpg",
    FileRef: GRAD_CYAN,
    Caption: "Atelier DevOps",
    GalleryCategory: "Technique",
    IsFeatured: true,
    AltText: "Atelier technique",
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Team building",
    FileLeafRef: "teambuilding.jpg",
    FileRef: GRAD_EMERALD,
    Caption: "Team building à la montagne",
    GalleryCategory: "Événements",
    IsFeatured: false,
    AltText: "Team building",
    SortOrder: 3,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "Remise de prix",
    FileLeafRef: "prix.jpg",
    FileRef: GRAD_CYAN,
    Caption: "Collaborateur du mois",
    GalleryCategory: "Vie interne",
    IsFeatured: false,
    AltText: "Remise de prix",
    SortOrder: 4,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 5,
    Title: "Open space",
    FileLeafRef: "openspace.jpg",
    FileRef: GRAD_NAVY,
    Caption: "Notre open space parisien",
    GalleryCategory: "Locaux",
    IsFeatured: false,
    AltText: "Open space",
    SortOrder: 5,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 6,
    Title: "Conférence cliente",
    FileLeafRef: "conference.jpg",
    FileRef: GRAD_EMERALD,
    Caption: "Présentation chez un client",
    GalleryCategory: "Technique",
    IsFeatured: false,
    AltText: "Conférence",
    SortOrder: 6,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_COLLABORATORS: ICollaborateur[] = [
  {
    Id: 1,
    Title: "Awa Kaboré",
    JobTitle: "Directrice Générale",
    Email: "awa.kabore@ika-solution.fr",
    HierarchyLevel: 1,
    Division: "Direction Générale",
    IsActive: true,
    SortOrder: 1,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Mehdi Benali",
    JobTitle: "Directeur Technique",
    Email: "mehdi.benali@ika-solution.fr",
    HierarchyLevel: 2,
    Division: "Engineering",
    Manager: { Id: 1, Title: "Awa Kaboré" },
    IsActive: true,
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Fatou Diallo",
    JobTitle: "Responsable Comptabilité",
    Email: "fatou.diallo@ika-solution.fr",
    HierarchyLevel: 2,
    Division: "Comptabilité",
    Manager: { Id: 1, Title: "Awa Kaboré" },
    IsActive: true,
    SortOrder: 3,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "Koffi Mensah",
    JobTitle: "Ingénieur DevOps",
    Email: "koffi.mensah@ika-solution.fr",
    HierarchyLevel: 3,
    Division: "Engineering",
    Manager: { Id: 2, Title: "Mehdi Benali" },
    IsActive: true,
    SortOrder: 4,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 5,
    Title: "Sandra Lopez",
    JobTitle: "Business Developer",
    Email: "sandra.lopez@ika-solution.fr",
    HierarchyLevel: 3,
    Division: "Ventes & Marketing",
    Manager: { Id: 1, Title: "Awa Kaboré" },
    IsActive: true,
    SortOrder: 5,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 6,
    Title: "Yacine Cherif",
    JobTitle: "Support Technique",
    Email: "yacine.cherif@ika-solution.fr",
    HierarchyLevel: 3,
    Division: "Support Technique",
    Manager: { Id: 2, Title: "Mehdi Benali" },
    IsActive: true,
    SortOrder: 6,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_EMPLOYEE: IEmployeeOfMonth = {
  Id: 1,
  Title: "Collaborateur du mois — Août 2026",
  Employee: { Id: 4, Title: "Koffi Mensah" },
  DisplayRole: "Ingénieur DevOps",
  Department: { Id: 2, Title: "Engineering" },
  Quote:
    "J'aime transformer la complexité en automatisations simples et fiables pour toute l'équipe.",
  NominatedBy: "Mehdi Benali",
  PeriodStart: "2026-08-01",
  IsCurrent: true,
  Created: "2026-08-01",
  Modified: "2026-08-01"
};

export const MOCK_PROJECTS: IProject[] = [
  {
    Id: 1,
    Title: "Migration SharePoint IKA",
    ProjectLead: "Mehdi Benali",
    Progress: 75,
    ProjectStatus: "À l'heure",
    DueDate: "2026-09-30",
    TasksDone: 15,
    TasksTotal: 20,
    ShowOnHome: true,
    SortOrder: 1,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Plateforme DevOps interne",
    ProjectLead: "Koffi Mensah",
    Progress: 40,
    ProjectStatus: "À risque",
    DueDate: "2026-10-15",
    TasksDone: 8,
    TasksTotal: 20,
    ShowOnHome: true,
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Refonte du portail client",
    ProjectLead: "Sandra Lopez",
    Progress: 20,
    ProjectStatus: "En retard",
    DueDate: "2026-08-31",
    TasksDone: 4,
    TasksTotal: 20,
    ShowOnHome: true,
    SortOrder: 3,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "Reporting financier automatisé",
    ProjectLead: "Fatou Diallo",
    Progress: 90,
    ProjectStatus: "À l'heure",
    DueDate: "2026-08-20",
    TasksDone: 18,
    TasksTotal: 20,
    ShowOnHome: true,
    SortOrder: 4,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];
