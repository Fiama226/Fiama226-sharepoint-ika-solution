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
  IAnnouncement
} from "../models/IIkaModels";

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
    FileRef: "/sites/ika-intranet/Documents/Charte informatique IKA Solution.pdf",
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
    FileRef: "/sites/ika-intranet/Documents/Guide du nouvel arrivant.docx",
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
    SiteUrl: { Url: "/sites/ika-intranet/SitePages/Comptabilite.aspx", Description: "Comptabilité" },
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
    SiteUrl: { Url: "/sites/ika-intranet/SitePages/Administration.aspx", Description: "Administration" },
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
