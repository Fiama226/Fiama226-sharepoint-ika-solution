import {
  ISPImageField,
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

const IMG = (url: string): ISPImageField => ({ serverUrl: url });

export const MOCK_NEWS: INewsItem[] = [
  {
    Id: 1,
    Title: "Nouvelle plateforme DevOps disponible",
    Excerpt:
      "La nouvelle chaîne CI/CD est désormais accessible pour tous les projets internes afin d'accélérer les déploiements et renforcer la qualité logicielle.",
    Category: "DevOps",
    PublishDate: "2026-06-18",
    Highlighted: true,
    HeaderImage: IMG("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80"),
    Created: "2026-06-18",
    Modified: "2026-06-18",
    NewsAuthor: { Id: 1, Title: "YAYA Ouattara", EMail: "y.ouattara@ikasolution.com" }
  },
  {
    Id: 2,
    Title: "Lancement du programme de certification Cloud",
    Excerpt:
      "Les collaborateurs peuvent désormais s'inscrire aux parcours AWS, Azure et Google Cloud pour renforcer nos expertises techniques.",
    Category: "Formation",
    PublishDate: "2026-06-12",
    Highlighted: false,
    HeaderImage: IMG("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80"),
    Created: "2026-06-12",
    Modified: "2026-06-12",
    NewsAuthor: { Id: 2, Title: "SERGE GEDEON OUE", EMail: "s.gedeon@ikasolution.com" }
  },
  {
    Id: 3,
    Title: "Mise à jour de la politique cybersécurité",
    Excerpt:
      "De nouvelles règles de sécurité sont appliquées sur les postes, accès VPN et outils collaboratifs. Une session de sensibilisation est prévue cette semaine.",
    Category: "Cybersécurité",
    PublishDate: "2026-06-07",
    Highlighted: false,
    HeaderImage: IMG("https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80"),
    Created: "2026-06-07",
    Modified: "2026-06-07",
    NewsAuthor: { Id: 3, Title: "Daouda DAO", EMail: "d.dao@ikasolution.com" }
  },
  {
    Id: 101,
    Title: "Roadmap IA et automatisation 2026",
    Excerpt:
      "Découvrez les initiatives internes autour de l'intelligence artificielle, de l'automatisation métier et des assistants intelligents.",
    Category: "Innovation",
    PublishDate: "2026-05-30",
    Highlighted: false,
    HeaderImage: IMG("https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80"),
    Created: "2026-05-30",
    Modified: "2026-05-30",
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
    Title: "Construire le digital de demain",
    FileRef: GRAD_NAVY,
    Caption: "Construire le digital de demain, aujourd'hui.",
    SubCaption: "Innovation · Agilité · Excellence",
    SortOrder: 1,
    IsActive: true,
    AltText: "Hero IKA Solution",
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Des équipes expertes",
    FileRef: GRAD_CYAN,
    Caption: "Des équipes expertes au service de vos projets.",
    SubCaption: "Développement · Architecture · Data",
    SortOrder: 2,
    IsActive: true,
    AltText: "Départements IKA",
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Ensemble, nous transformons",
    FileRef: GRAD_EMERALD,
    Caption: "Ensemble, nous transformons les idées en solutions.",
    SubCaption: "Cloud · IA · Cybersécurité",
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
    Title: "Accélérer la transformation digitale",
    Tag: "Notre Mission",
    MissionText:
      "Nous concevons des solutions technologiques sur mesure qui permettent à nos clients de gagner en efficacité, en agilité et en compétitivité sur leur marché.",
    IconName: "🚀",
    MissionType: "Mission",
    SortOrder: 1,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Être le partenaire tech de référence",
    Tag: "Notre Vision",
    MissionText:
      "Devenir l'acteur incontournable de l'ingénierie digitale en Afrique et à l'international, en plaçant l'humain et l'innovation au cœur de chaque projet.",
    IconName: "🌍",
    MissionType: "Vision",
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Excellence, Intégrité, Collaboration",
    Tag: "Nos Valeurs",
    MissionText:
      "Chaque ligne de code, chaque architecture, chaque livraison reflète notre engagement envers la qualité, la transparence et l'esprit d'équipe.",
    IconName: "⚡",
    MissionType: "Valeur",
    SortOrder: 3,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_STATS: IIndicator[] = [
  {
    Id: 1,
    Title: "Projets actifs",
    StatValue: "24",
    IconName: "📁",
    Placement: "Hero accueil",
    SortOrder: 1,
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Collaborateurs",
    StatValue: "138",
    IconName: "👥",
    Placement: "Hero accueil",
    SortOrder: 2,
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Tickets ouverts",
    StatValue: "12",
    IconName: "🎯",
    Placement: "Hero accueil",
    SortOrder: 3,
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_ANNOUNCEMENTS: IAnnouncement[] = [
  {
    Id: 1,
    Title: "Mariage de Koffi et Aïcha",
    AnnouncementType: "Mariage",
    Detail: "Félicitations à nos collègues du pôle Tech",
    Emoji: "💍",
    AnnouncementDate: "2026-08-15",
    DisplayUntil: "2026-08-31",
    Priority: "Haute",
    Created: "2026-08-01",
    Modified: "2026-08-01"
  },
  {
    Id: 2,
    Title: "Anniversaire de Souleymane",
    AnnouncementType: "Anniversaire",
    Detail: "Joyeux anniversaire au responsable QA",
    Emoji: "🎉",
    AnnouncementDate: "2026-07-22",
    DisplayUntil: "2026-08-31",
    Priority: "Normale",
    Created: "2026-08-02",
    Modified: "2026-08-02"
  },
  {
    Id: 3,
    Title: "Bienvenue à Bébé Inès",
    AnnouncementType: "Naissance",
    Detail: "Félicitations à l'équipe RH pour cette naissance",
    Emoji: "👶",
    AnnouncementDate: "2026-09-02",
    DisplayUntil: "2026-09-30",
    Priority: "Normale",
    Created: "2026-08-03",
    Modified: "2026-08-03"
  },
  {
    Id: 4,
    Title: "Soirée d'été IKA",
    AnnouncementType: "Événement",
    Detail: "Réservez votre place pour le 10 juillet",
    Emoji: "🌞",
    AnnouncementDate: "2026-07-10",
    DisplayUntil: "2026-07-31",
    Priority: "Normale",
    Created: "2026-08-04",
    Modified: "2026-08-04"
  }
];

export const MOCK_EVENTS: IEventItem[] = [
  {
    Id: 1,
    Title: "All Hands Tech — Q2 Review",
    EventDate: "2026-06-10T10:00:00Z",
    EndDate: "2026-06-10T11:30:00Z",
    fAllDayEvent: false,
    Location: "Salle de réunion A",
    EventCategory: "Stratégie",
    EventImage: IMG("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&q=80"),
    IsMandatory: false,
    Created: "2026-08-01",
    Modified: "2026-08-01"
  },
  {
    Id: 2,
    Title: "Workshop Architecture Cloud",
    EventDate: "2026-06-18T14:00:00Z",
    EndDate: "2026-06-18T16:00:00Z",
    fAllDayEvent: false,
    Location: "Ouagadougou — Siège",
    EventCategory: "Tech",
    EventImage: IMG("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=80&q=80"),
    IsMandatory: false,
    Created: "2026-08-02",
    Modified: "2026-08-02"
  },
  {
    Id: 3,
    Title: "Demo Day — Projets IA",
    EventDate: "2026-06-25T09:00:00Z",
    EndDate: "2026-06-25T12:00:00Z",
    fAllDayEvent: false,
    Location: "Salle de réunion A",
    EventCategory: "Innovation",
    EventImage: IMG("https://images.unsplash.com/photo-1677442136019-21780ecad995?w=80&q=80"),
    IsMandatory: false,
    Created: "2026-08-03",
    Modified: "2026-08-03"
  },
  {
    Id: 4,
    Title: "Revue Cybersécurité S1",
    EventDate: "2026-07-03T11:00:00Z",
    EndDate: "2026-07-03T12:00:00Z",
    fAllDayEvent: false,
    Location: "En ligne (Teams)",
    EventCategory: "SecOps",
    EventImage: IMG("https://images.unsplash.com/photo-1563986768609-322da13575f3?w=80&q=80"),
    IsMandatory: false,
    Created: "2026-08-04",
    Modified: "2026-08-04"
  }
];

export const MOCK_QUICKLINKS: IQuickLink[] = [
  {
    Id: 1,
    Title: "Calcul bordereau des prix",
    LinkUrl: { Url: "#bordereau", Description: "Bordereau des prix" },
    LinkDescription: "Calculateur et devis en ligne",
    IconName: "Users",
    SortOrder: 1,
    OpenInNewTab: false,
    LinkGroup: "Outils",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Demande de conges",
    LinkUrl: { Url: "#commerciaux", Description: "Congés" },
    LinkDescription: "Demande de congés",
    IconName: "Globe",
    SortOrder: 2,
    OpenInNewTab: false,
    LinkGroup: "Outils",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "#",
    LinkUrl: { Url: "#administration", Description: "#" },
    LinkDescription: "",
    IconName: "Clock",
    SortOrder: 3,
    OpenInNewTab: false,
    LinkGroup: "Outils",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "RH & Avantages",
    LinkUrl: { Url: "#administration", Description: "RH" },
    LinkDescription: "Avantages collaborateurs",
    IconName: "Heart",
    SortOrder: 4,
    OpenInNewTab: false,
    LinkGroup: "Ressources",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 5,
    Title: "Support IT",
    LinkUrl: { Url: "#techniciens", Description: "Support IT" },
    LinkDescription: "Assistance technique",
    IconName: "Headphones",
    SortOrder: 5,
    OpenInNewTab: false,
    LinkGroup: "Ressources",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 6,
    Title: "Base de Connaissances",
    LinkUrl: { Url: "#histoire", Description: "Base de connaissances" },
    LinkDescription: "Documentation et guides",
    IconName: "Database",
    SortOrder: 6,
    OpenInNewTab: false,
    LinkGroup: "Ressources",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 7,
    Title: "Specs Techniques",
    LinkUrl: { Url: "#techniciens", Description: "Specs" },
    LinkDescription: "Spécifications techniques",
    IconName: "FileText",
    SortOrder: 7,
    OpenInNewTab: false,
    LinkGroup: "Ressources",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 8,
    Title: "Outils DevOps",
    LinkUrl: { Url: "#techniciens", Description: "DevOps" },
    LinkDescription: "Outils et pipelines",
    IconName: "Settings",
    SortOrder: 8,
    OpenInNewTab: false,
    LinkGroup: "Outils",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 9,
    Title: "Portail Conformité",
    LinkUrl: { Url: "#comptabilite", Description: "Conformité" },
    LinkDescription: "Politiques et conformité",
    IconName: "Scale",
    SortOrder: 9,
    OpenInNewTab: false,
    LinkGroup: "Ressources",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 10,
    Title: "Politique Déplacements",
    LinkUrl: { Url: "#administration", Description: "Déplacements" },
    LinkDescription: "Politique de déplacements",
    IconName: "Plane",
    SortOrder: 10,
    OpenInNewTab: false,
    LinkGroup: "Ressources",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  }
];

export const MOCK_GALLERY: IGalleryImage[] = [
  {
    Id: 1,
    Title: "All Hands Tech — Q2 2026",
    FileLeafRef: "all-hands.jpg",
    FileRef:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    Caption: "All Hands Tech — Q2 2026",
    GalleryCategory: "Événements",
    IsFeatured: true,
    AltText: "All Hands Tech — Q2 2026",
    SortOrder: 1,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 2,
    Title: "Workshop Architecture Cloud",
    FileLeafRef: "workshop-cloud.jpg",
    FileRef:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    Caption: "Workshop Architecture Cloud",
    GalleryCategory: "Formation",
    IsFeatured: true,
    AltText: "Workshop Architecture Cloud",
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 3,
    Title: "Sprint Review Q1",
    FileLeafRef: "sprint-review.jpg",
    FileRef:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    Caption: "Sprint Review Q1",
    GalleryCategory: "Projets",
    IsFeatured: false,
    AltText: "Sprint Review Q1",
    SortOrder: 3,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 4,
    Title: "Demo Day — Projets IA",
    FileLeafRef: "demo-day.jpg",
    FileRef:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    Caption: "Demo Day — Projets IA",
    GalleryCategory: "Événements",
    IsFeatured: false,
    AltText: "Demo Day — Projets IA",
    SortOrder: 4,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 5,
    Title: "Audit Cybersécurité S1",
    FileLeafRef: "audit-sec.jpg",
    FileRef:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    Caption: "Audit Cybersécurité S1",
    GalleryCategory: "Formation",
    IsFeatured: false,
    AltText: "Audit Cybersécurité S1",
    SortOrder: 5,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 6,
    Title: "Déploiement Infrastructure AWS",
    FileLeafRef: "deploiement-aws.jpg",
    FileRef:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    Caption: "Déploiement Infrastructure AWS",
    GalleryCategory: "Projets",
    IsFeatured: false,
    AltText: "Déploiement Infrastructure AWS",
    SortOrder: 6,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 7,
    Title: "Soirée Annuelle Tech Awards",
    FileLeafRef: "tech-awards.jpg",
    FileRef:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    Caption: "Soirée Annuelle Tech Awards",
    GalleryCategory: "Événements",
    IsFeatured: false,
    AltText: "Soirée Annuelle Tech Awards",
    SortOrder: 7,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 8,
    Title: "Hackathon Interne 2026",
    FileLeafRef: "hackathon.jpg",
    FileRef:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    Caption: "Hackathon Interne 2026",
    GalleryCategory: "Projets",
    IsFeatured: false,
    AltText: "Hackathon Interne 2026",
    SortOrder: 8,
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
