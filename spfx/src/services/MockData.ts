import {
  ISPImageField,
  INewsItem,
  IComment,
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
  IMilestone,
  ISearchResult,
  ICalendarEntry,
  ITeamMemberBusy,
  IListColumn,
  IListRow,
  IListTableData
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
    Body:
      "<p>La nouvelle chaîne CI/CD est désormais accessible pour tous les projets internes afin d'accélérer les déploiements et renforcer la qualité logicielle.</p>" +
      "<p>Elle intègre des pipelines de build, de tests automatisés et de déploiement continu, avec des environnements de staging isolés par équipe. " +
      "Chaque projet peut désormais livrer en production plusieurs fois par jour, avec des rollbacks automatiques en cas d'échec des tests.</p>" +
      "<p>Une session de formation sera organisée la semaine prochaine pour accompagner les équipes dans la migration de leurs pipelines existants.</p>",
    Category: "DevOps",
    PublishDate: "2026-06-18",
    Highlighted: true,
    HeaderImage: IMG("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80"),
    Created: "2026-06-18",
    Modified: "2026-06-20",
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

export const MOCK_COMMENTS: IComment[] = [
  {
    Id: 1001,
    Title: "Excellente nouvelle, merci pour le partage !",
    CommentText: "Excellente nouvelle, merci pour le partage !",
    Created: "2026-06-18T14:12:00Z",
    Modified: "2026-06-18T14:12:00Z",
    NewsItem: { Id: 1, Title: "Nouvelle plateforme DevOps disponible" },
    Author: { Id: 10, Title: "Fatou Ky", EMail: "f.ky@ikasolution.com" }
  },
  {
    Id: 1002,
    Title: "La formation de la semaine prochaine tombe à pic.",
    CommentText: "La formation de la semaine prochaine tombe à pic, on en avait besoin sur mon projet.",
    Created: "2026-06-19T09:03:00Z",
    Modified: "2026-06-19T09:03:00Z",
    NewsItem: { Id: 1, Title: "Nouvelle plateforme DevOps disponible" },
    Author: { Id: 11, Title: "Boubacar Sanou", EMail: "b.sanou@ikasolution.com" }
  },
  {
    Id: 1003,
    Title: "Je me suis déjà inscrit au parcours AWS.",
    CommentText: "Je me suis déjà inscrit au parcours AWS, hâte de commencer !",
    Created: "2026-06-13T16:40:00Z",
    Modified: "2026-06-13T16:40:00Z",
    NewsItem: { Id: 2, Title: "Lancement du programme de certification Cloud" },
    Author: { Id: 12, Title: "Aïcha Traoré", EMail: "a.traore@ikasolution.com" }
  }
];

export const MOCK_DOCUMENTS: IDocumentItem[] = [
  {
    Id: 100,
    Title: "Procédures",
    FileRef: "/sites/ikareview/Documents/Procedures",
    FileLeafRef: "Procedures",
    FSObjType: 1,
    DocCategory: "Procédure",
    Confidentiality: "Interne",
    IsPinned: false,
    Modified: "2026-06-18",
    Created: "2025-01-10",
    Editor: { Id: 5, Title: "Direction Technique" }
  },
  {
    Id: 101,
    Title: "RH",
    FileRef: "/sites/ikareview/Documents/RH",
    FileLeafRef: "RH",
    FSObjType: 1,
    DocCategory: "Guide",
    Confidentiality: "Interne",
    IsPinned: false,
    Modified: "2026-06-01",
    Created: "2025-01-10",
    Editor: { Id: 6, Title: "RH" }
  },
  {
    Id: 1,
    Title: "Charte informatique IKA Solution.pdf",
    FileRef: "/sites/ikareview/Documents/Charte informatique IKA Solution.pdf",
    FileLeafRef: "Charte informatique IKA Solution.pdf",
    FSObjType: 0,
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
    SiteUrl: { Url: "/sites/ika-comptabilite", Description: "Comptabilité" },
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
    SiteUrl: { Url: "/sites/ika-administration", Description: "Administration" },
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
    SiteUrl: { Url: "/sites/ika-commerciaux", Description: "Commerciaux" },
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
    SiteUrl: { Url: "/sites/ika-techniciens", Description: "Techniciens" },
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
  },
  {
    Id: 11,
    Title: "Fournisseurs",
    LinkUrl: { Url: "#fournisseurs", Description: "Fournisseurs" },
    LinkDescription: "Répertoire des fournisseurs référencés",
    IconName: "Briefcase",
    SortOrder: 11,
    OpenInNewTab: false,
    LinkGroup: "Ressources",
    IsActive: true,
    Created: "2026-01-01",
    Modified: "2026-01-01"
  },
  {
    Id: 12,
    Title: "Équipements",
    LinkUrl: { Url: "#equipements", Description: "Équipements" },
    LinkDescription: "Parc d'équipements de l'entreprise",
    IconName: "Wrench",
    SortOrder: 12,
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

/**
 * Jeu de résultats factices pour la recherche globale.
 *
 * Indispensable : le Workbench tourne sur localhost, donc `SearchService`
 * bascule en mode mock — sans ces entrées la barre de recherche serait
 * inerte pendant tout le développement. On couvre les cinq verticales
 * (dont e-mails et messages Teams) pour pouvoir vérifier les onglets sans
 * dépendre d'une approbation d'administrateur.
 *
 * Les `summary` contiennent volontairement des `<mark>` : ils imitent le
 * surlignage déjà converti et assaini par `SearchService`.
 */
export const MOCK_SEARCH_RESULTS: ISearchResult[] = [
  {
    id: "/sites/ika/Documents/Budget-previsionnel-2026.xlsx",
    kind: "file",
    title: "Budget prévisionnel 2026.xlsx",
    url: "/sites/ika/Documents/Budget-previsionnel-2026.xlsx",
    summary:
      "Répartition du <mark>budget</mark> par département pour l'exercice 2026, validée en comité de direction.",
    author: "Awa Kaboré",
    modified: "2026-08-21T09:12:00Z",
    siteTitle: "Comptabilité",
    fileExtension: "xlsx",
    sizeBytes: 184320
  },
  {
    id: "/sites/ika/Documents/Budgets",
    kind: "folder",
    title: "Budgets",
    url: "/sites/ika/Documents/Budgets",
    summary: "Dossier — archives des <mark>budget</mark>s annuels depuis 2019.",
    modified: "2026-07-30T16:45:00Z",
    siteTitle: "Comptabilité"
  },
  {
    id: "/sites/ika/SitePages/Revision-budgetaire-T3.aspx",
    kind: "news",
    title: "Révision budgétaire du troisième trimestre",
    url: "/sites/ika/SitePages/Revision-budgetaire-T3.aspx",
    summary:
      "La direction financière annonce une révision du <mark>budget</mark> de fonctionnement à compter de septembre.",
    author: "Direction financière",
    modified: "2026-08-18T11:00:00Z",
    siteTitle: "Actualités"
  },
  {
    id: "/sites/ika/Documents/Procedure-achats.docx",
    kind: "file",
    title: "Procédure achats et engagements.docx",
    url: "/sites/ika/Documents/Procedure-achats.docx",
    summary:
      "Circuit de validation des engagements de dépense au-delà du seuil <mark>budget</mark>aire de 500 000 XOF.",
    author: "Ibrahim Traoré",
    modified: "2026-06-04T08:30:00Z",
    siteTitle: "Administration",
    fileExtension: "docx",
    sizeBytes: 47104
  },
  {
    id: "/sites/ika/Lists/Projets/12",
    kind: "listItem",
    title: "Refonte du portail intranet",
    url: "/sites/ika/Lists/Projets/DispForm.aspx?ID=12",
    summary:
      "Projet en cours — enveloppe <mark>budget</mark>aire allouée, livraison prévue au quatrième trimestre.",
    author: "Landry Kaboré",
    modified: "2026-08-25T14:20:00Z",
    siteTitle: "Projets"
  },
  {
    id: "awa.kabore@ikasolution.com",
    kind: "person",
    title: "Awa Kaboré",
    url: "#",
    author: "Responsable comptabilité · Comptabilité",
    siteTitle: "awa.kabore@ikasolution.com"
  },
  {
    id: "ibrahim.traore@ikasolution.com",
    kind: "person",
    title: "Ibrahim Traoré",
    url: "#",
    author: "Directeur administratif · Administration",
    siteTitle: "ibrahim.traore@ikasolution.com"
  },
  {
    id: "mock-email-1",
    kind: "email",
    title: "Validation du budget prévisionnel 2026",
    url: "#",
    summary:
      "Bonjour, merci de me retourner vos arbitrages sur le <mark>budget</mark> avant vendredi.",
    author: "Awa Kaboré",
    modified: "2026-08-22T07:41:00Z"
  },
  {
    id: "mock-email-2",
    kind: "email",
    title: "RE : Engagements de dépense — seuil de validation",
    url: "#",
    summary:
      "Le seuil reste inchangé pour ce cycle <mark>budget</mark>aire, voir la procédure jointe.",
    author: "Ibrahim Traoré",
    modified: "2026-08-19T15:08:00Z"
  },
  {
    id: "mock-chat-1",
    kind: "chat",
    title: "Message Teams",
    url: "#",
    summary:
      "@Landry le fichier <mark>budget</mark> est à jour dans la bibliothèque Comptabilité 👍",
    author: "Awa Kaboré",
    modified: "2026-08-25T10:03:00Z"
  },
  {
    id: "mock-chat-2",
    kind: "chat",
    title: "Message Teams",
    url: "#",
    summary:
      "On cale le point <mark>budget</mark> mardi 10h ? J'invite la direction financière.",
    author: "Fatou Sanogo",
    modified: "2026-08-24T17:26:00Z"
  },
  {
    id: "/sites/ika",
    kind: "site",
    title: "IKA Solution — Intranet",
    url: "/sites/ika",
    summary: "Site racine du portail collaboratif IKA Solution.",
    siteTitle: "IKA Solution"
  }
];

/* ------------------------------------------------------------------ */
/* Agenda — calendrier personnel & disponibilité équipe                */
/* ------------------------------------------------------------------ */

/**
 * Les rendez-vous sont calés sur la date du jour : sans cela, le Workbench
 * afficherait un agenda vide dès que les dates codées en dur sont dépassées.
 */
function atDay(offsetDays: number, hour: number, minutes: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hour, minutes, 0, 0);
  return date.toISOString();
}

export const MOCK_MY_CALENDAR: ICalendarEntry[] = [
  {
    Id: "me-1",
    Title: "Point hebdomadaire — Pôle Engineering",
    Start: atDay(0, 9, 30),
    End: atDay(0, 10, 30),
    IsAllDay: false,
    Location: "Teams",
    Organizer: "SERGE GEDEON OUE",
    Source: "outlook"
  },
  {
    Id: "me-2",
    Title: "Revue de code — module facturation",
    Start: atDay(0, 14, 0),
    End: atDay(0, 15, 0),
    IsAllDay: false,
    Location: "Salle B",
    Organizer: "Sandrine T. KINI",
    Source: "outlook"
  },
  {
    Id: "me-3",
    Title: "Entretien candidat — développeur SPFx",
    Start: atDay(1, 11, 0),
    End: atDay(1, 12, 0),
    IsAllDay: false,
    Location: "Ouagadougou — Siège",
    Organizer: "YAYA Ouattara",
    Source: "outlook"
  },
  {
    Id: "me-4",
    Title: "Congé posé",
    Start: atDay(3, 0, 0),
    End: atDay(4, 0, 0),
    IsAllDay: true,
    Source: "outlook"
  },
  {
    Id: "me-5",
    Title: "Atelier client — cadrage besoins",
    Start: atDay(5, 10, 0),
    End: atDay(5, 12, 30),
    IsAllDay: false,
    Location: "Visioconférence",
    Organizer: "SERGE GEDEON OUE",
    Source: "outlook"
  }
];

export const MOCK_TEAM_BUSY: ITeamMemberBusy[] = [
  {
    Email: "y.ouattara@ikasolution.com",
    DisplayName: "YAYA Ouattara",
    Slots: [
      { Start: atDay(0, 9, 0), End: atDay(0, 11, 0), Status: "busy" },
      { Start: atDay(0, 15, 0), End: atDay(0, 16, 0), Status: "tentative" }
    ]
  },
  {
    Email: "s.kini@ikasolution.com",
    DisplayName: "Sandrine T. KINI",
    Slots: [
      { Start: atDay(0, 14, 0), End: atDay(0, 15, 0), Status: "busy" },
      { Start: atDay(1, 9, 30), End: atDay(1, 12, 0), Status: "busy" }
    ]
  },
  {
    Email: "s.oue@ikasolution.com",
    DisplayName: "SERGE GEDEON OUE",
    Slots: [
      { Start: atDay(0, 9, 30), End: atDay(0, 10, 30), Status: "busy" },
      { Start: atDay(0, 13, 0), End: atDay(0, 17, 0), Status: "oof" }
    ]
  },
  {
    Email: "a.kabore@ikasolution.com",
    DisplayName: "Awa Kaboré",
    Slots: []
  }
];

/* ───────────────────────────────────────────────────────────────────────────
 * Listes génériques (Fournisseurs, Équipements)
 *
 * Le Workbench local force `_useMocks` sans échappatoire (`DataService`), donc
 * la détection réelle de schéma y est inaccessible : ces jeux de démonstration
 * sont le seul moyen de développer et de relire la vue sans site SharePoint.
 * Ils sont toujours restitués avec `isDemo: true`, jamais comme repli d'erreur.
 * ────────────────────────────────────────────────────────────────────────── */

export const MOCK_FOURNISSEURS_COLUMNS: IListColumn[] = [
  { internalName: "Title", displayName: "Fournisseur", kind: "text", spType: "Text", numeric: false },
  { internalName: "Categorie", displayName: "Catégorie", kind: "choice", spType: "Choice", numeric: false },
  { internalName: "Contact", displayName: "Contact", kind: "text", spType: "Text", numeric: false },
  { internalName: "Telephone", displayName: "Téléphone", kind: "text", spType: "Text", numeric: false },
  { internalName: "MontantContrat", displayName: "Montant du contrat", kind: "currency", spType: "Currency", numeric: true, currencyCode: "XOF" },
  { internalName: "DateContrat", displayName: "Date du contrat", kind: "date", spType: "DateTime", numeric: false },
  { internalName: "Actif", displayName: "Actif", kind: "boolean", spType: "Boolean", numeric: false }
];

export const MOCK_FOURNISSEURS_ROWS: IListRow[] = [
  { Id: 1, Title: "Sahel Informatique SARL", Categorie: "Matériel", Contact: "Boubacar Traoré", Telephone: "+226 25 30 12 40", MontantContrat: 18500000, DateContrat: "2026-01-15", Actif: true },
  { Id: 2, Title: "Faso Energie", Categorie: "Énergie", Contact: "Aminata Ouédraogo", Telephone: "+226 25 31 88 02", MontantContrat: 7200000, DateContrat: "2025-11-03", Actif: true },
  { Id: 3, Title: "Cabinet Zongo & Associés", Categorie: "Conseil", Contact: "Idrissa Zongo", Telephone: "+226 25 36 44 17", MontantContrat: 4300000, DateContrat: "2026-02-28", Actif: true },
  { Id: 4, Title: "TransOuest Logistique", Categorie: "Transport", Contact: "Salif Compaoré", Telephone: "+226 25 39 21 76", MontantContrat: 2650000, DateContrat: "2025-08-19", Actif: false },
  { Id: 5, Title: "NetSecure Afrique", Categorie: "Services", Contact: "Fatoumata Diallo", Telephone: "+226 25 33 57 90", MontantContrat: 11900000, DateContrat: "2026-03-10", Actif: true },
  { Id: 6, Title: "Papeterie du Centre", Categorie: "Fournitures", Contact: "Rasmané Kaboré", Telephone: "+226 25 30 74 55", MontantContrat: 890000, DateContrat: "2025-06-02", Actif: true }
];

export const MOCK_EQUIPEMENTS_COLUMNS: IListColumn[] = [
  { internalName: "Title", displayName: "Équipement", kind: "text", spType: "Text", numeric: false },
  { internalName: "NumeroSerie", displayName: "N° de série", kind: "text", spType: "Text", numeric: false },
  { internalName: "TypeEquipement", displayName: "Type", kind: "choice", spType: "Choice", numeric: false },
  { internalName: "Localisation", displayName: "Localisation", kind: "text", spType: "Text", numeric: false },
  { internalName: "Attribue", displayName: "Attribué à", kind: "user", spType: "User", numeric: false },
  { internalName: "DateAchat", displayName: "Date d'achat", kind: "date", spType: "DateTime", numeric: false },
  { internalName: "Valeur", displayName: "Valeur", kind: "currency", spType: "Currency", numeric: true, currencyCode: "XOF" },
  { internalName: "SousGarantie", displayName: "Sous garantie", kind: "boolean", spType: "Boolean", numeric: false }
];

export const MOCK_EQUIPEMENTS_ROWS: IListRow[] = [
  { Id: 1, Title: "Dell Latitude 5540", NumeroSerie: "DL5540-0231", TypeEquipement: "Ordinateur portable", Localisation: "Siège — 2e étage", Attribue: { Id: 3, Title: "Awa Kaboré", EMail: "awa.kabore@ikasolution.com" }, DateAchat: "2026-01-08", Valeur: 780000, SousGarantie: true },
  { Id: 2, Title: "HP LaserJet M480", NumeroSerie: "HPM480-1187", TypeEquipement: "Imprimante", Localisation: "Siège — Accueil", Attribue: undefined, DateAchat: "2025-04-22", Valeur: 495000, SousGarantie: false },
  { Id: 3, Title: "Cisco Catalyst 9200", NumeroSerie: "C9200-0044", TypeEquipement: "Réseau", Localisation: "Salle serveurs", Attribue: undefined, DateAchat: "2025-09-30", Valeur: 2350000, SousGarantie: true },
  { Id: 4, Title: "Onduleur APC 3000VA", NumeroSerie: "APC3000-0876", TypeEquipement: "Énergie", Localisation: "Salle serveurs", Attribue: undefined, DateAchat: "2024-12-11", Valeur: 1120000, SousGarantie: false },
  { Id: 5, Title: "MacBook Pro 14", NumeroSerie: "MBP14-0509", TypeEquipement: "Ordinateur portable", Localisation: "Siège — 3e étage", Attribue: { Id: 7, Title: "Idrissa Sawadogo", EMail: "idrissa.sawadogo@ikasolution.com" }, DateAchat: "2026-02-17", Valeur: 1450000, SousGarantie: true },
  { Id: 6, Title: "Vidéoprojecteur Epson EB-L200", NumeroSerie: "EBL200-0312", TypeEquipement: "Audiovisuel", Localisation: "Salle de réunion A", Attribue: undefined, DateAchat: "2025-07-05", Valeur: 640000, SousGarantie: true }
];

const MOCK_GENERIC_COLUMNS: IListColumn[] = [
  { internalName: "Title", displayName: "Titre", kind: "text", spType: "Text", numeric: false },
  { internalName: "Modified", displayName: "Modifié le", kind: "date", spType: "DateTime", numeric: false }
];

const MOCK_GENERIC_ROWS: IListRow[] = [
  { Id: 1, Title: "Premier élément", Modified: "2026-03-01" },
  { Id: 2, Title: "Deuxième élément", Modified: "2026-02-14" },
  { Id: 3, Title: "Troisième élément", Modified: "2026-01-27" }
];

/**
 * Jeu de démonstration pour la vue tableau générique. Un titre inconnu renvoie
 * un tableau générique à deux colonnes plutôt qu'un écran vide : dans le
 * Workbench, un écran vide se confond avec un bug.
 */
export function mockListTable(listTitle: string): IListTableData {
  const key = (listTitle || "").trim().toLowerCase();

  let columns = MOCK_GENERIC_COLUMNS;
  let rows = MOCK_GENERIC_ROWS;

  if (key.indexOf("fournisseur") === 0) {
    columns = MOCK_FOURNISSEURS_COLUMNS;
    rows = MOCK_FOURNISSEURS_ROWS;
  } else if (key.indexOf("equipement") === 0 || key.indexOf("équipement") === 0) {
    columns = MOCK_EQUIPEMENTS_COLUMNS;
    rows = MOCK_EQUIPEMENTS_ROWS;
  }

  return {
    listTitle,
    columns,
    rows,
    isDemo: true,
    truncated: false,
    totalColumns: columns.length
  };
}
