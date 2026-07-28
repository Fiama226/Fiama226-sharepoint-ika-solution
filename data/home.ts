// ─── HOME- PAGE DATA ────────────────────────────────────────────
// Contenu spécifique à la page d'accueil (scope "global" maison).
// Conservé ici (et non derrière getNews('global')/getEvents('global'))
// pour préserver le contenu marketing actuel de la home — la home a un
// ton différent des pages département. Route via lib/data.ts (getters),
// jamais d'import direct depuis les composants. Types dans types/intranet.ts.

import type {
  HomeCollaborator,
  HomeDepartmentCard,
  HomeEmployeeOfMonth,
  HomeEvent,
  HomeFeaturedDoc,
  HomeGalleryImage,
  HomeHeroSlide,
  HomeHeroStat,
  HomeMission,
  HomeNewsItem,
  HomeProject,
  HomeQuickAccess,
} from "@/types/intranet";

export const heroSlides: HomeHeroSlide[] = [
  {
    image: "/assets/team/12-Modifier.jpg",
    caption: "Construire le digital de demain, aujourd'hui.",
    sub: "Innovation · Agilité · Excellence",
  },
  {
    image: "/assets/team/13-Modifier.jpg",
    caption: "Des équipes expertes au service de vos projets.",
    sub: "Développement · Architecture · Data",
  },
  {
    image: "/assets/team/14-Modifier.jpg",
    caption: "Ensemble, nous transformons les idées en solutions.",
    sub: "Cloud · IA · Cybersécurité",
  },
];

export const missions: HomeMission[] = [
  {
    tag: "Notre Mission",
    title: "Accélérer la transformation digitale",
    text: "Nous concevons des solutions technologiques sur mesure qui permettent à nos clients de gagner en efficacité, en agilité et en compétitivité sur leur marché.",
    icon: "🚀",
  },
  {
    tag: "Notre Vision",
    title: "Être le partenaire tech de référence",
    text: "Devenir l'acteur incontournable de l'ingénierie digitale en Afrique et à l'international, en plaçant l'humain et l'innovation au cœur de chaque projet.",
    icon: "🌍",
  },
  {
    tag: "Nos Valeurs",
    title: "Excellence, Intégrité, Collaboration",
    text: "Chaque ligne de code, chaque architecture, chaque livraison reflète notre engagement envers la qualité, la transparence et l'esprit d'équipe.",
    icon: "⚡",
  },
];

export const heroStats: HomeHeroStat[] = [
  { label: "Projets actifs", value: "24", icon: "📁" },
  { label: "Collaborateurs", value: "138", icon: "👥" },
  { label: "Tickets ouverts", value: "12", icon: "🎯" },
];

export const featuredDocs: HomeFeaturedDoc[] = [
  { title: "Charte Développement", icon: "Code2", href: "/techniciens" },
  { title: "Architecture Patterns", icon: "Layers", href: "/techniciens" },
  { title: "Templates de Projets", icon: "FileEdit", href: "/techniciens" },
  { title: "Processus CI/CD", icon: "GitBranch", href: "/techniciens" },
  { title: "Politique de Dépenses", icon: "CreditCard", href: "/comptabilite" },
  { title: "Guide Cybersécurité", icon: "ShieldCheck", href: "/techniciens" },
];

export const quickAccess: HomeQuickAccess[] = [
  { title: "Calcul bordereau des prix", icon: "Users", href: "/Bordereaudesprix" },
  { title: "Demande de conges", icon: "Globe", href: "/commerciaux" },
  { title: "#", icon: "Clock", href: "/administration" },
  { title: "RH & Avantages", icon: "Heart", href: "/administration" },
  { title: "Support IT", icon: "Headphones", href: "/techniciens" },
  { title: "Base de Connaissances", icon: "Database", href: "/histoire" },
  { title: "Specs Techniques", icon: "FileText", href: "/techniciens" },
  { title: "Outils DevOps", icon: "Settings", href: "/techniciens" },
  { title: "Portail Conformité", icon: "Scale", href: "/comptabilite" },
  { title: "Politique Déplacements", icon: "Plane", href: "/administration" },
];

export const homeEvents: HomeEvent[] = [
  {
    id: 1,
    month: "JUN",
    day: "10",
    title: "All Hands Tech — Q2 Review",
    date: "Mar, 10 Juin, 10:00",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&q=80",
    tag: "Stratégie",
  },
  {
    id: 2,
    month: "JUN",
    day: "18",
    title: "Workshop Architecture Cloud",
    date: "Mer, 18 Juin, 14:00",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=80&q=80",
    tag: "Tech",
  },
  {
    id: 3,
    month: "JUN",
    day: "25",
    title: "Demo Day — Projets IA",
    date: "Mer, 25 Juin, 09:00",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=80&q=80",
    tag: "Innovation",
  },
  {
    id: 4,
    month: "JUL",
    day: "3",
    title: "Revue Cybersécurité S1",
    date: "Jeu, 3 Juil, 11:00",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=80&q=80",
    tag: "SecOps",
  },
];

export const homeNews: HomeNewsItem[] = [
  {
    id: 1,
    title: "Nouvelle plateforme DevOps disponible",
    excerpt:
      "La nouvelle chaîne CI/CD est désormais accessible pour tous les projets internes afin d'accélérer les déploiements et renforcer la qualité logicielle.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
    category: "DevOps",
    date: "18 juin",
    href: "/techniciens",
  },
  {
    id: 2,
    title: "Lancement du programme de certification Cloud",
    excerpt:
      "Les collaborateurs peuvent désormais s'inscrire aux parcours AWS, Azure et Google Cloud pour renforcer nos expertises techniques.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    category: "Formation",
    date: "12 juin",
    href: "/techniciens",
  },
  {
    id: 3,
    title: "Mise à jour de la politique cybersécurité",
    excerpt:
      "De nouvelles règles de sécurité sont appliquées sur les postes, accès VPN et outils collaboratifs. Une session de sensibilisation est prévue cette semaine.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
    category: "Cybersécurité",
    date: "7 juin",
    href: "/techniciens",
  },
  {
    id: 4,
    title: "Roadmap IA et automatisation 2026",
    excerpt:
      "Découvrez les initiatives internes autour de l'intelligence artificielle, de l'automatisation métier et des assistants intelligents.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    category: "Innovation",
    date: "30 mai",
    href: "/techniciens",
  },
];

export const galleryImages: HomeGalleryImage[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    caption: "All Hands Tech — Q2 2026",
    category: "Événements",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    caption: "Workshop Architecture Cloud",
    category: "Formation",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    caption: "Sprint Review Q1",
    category: "Projets",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    caption: "Demo Day — Projets IA",
    category: "Événements",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    caption: "Audit Cybersécurité S1",
    category: "Formation",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    caption: "Déploiement Infrastructure AWS",
    category: "Projets",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    caption: "Soirée Annuelle Tech Awards",
    category: "Événements",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    caption: "Hackathon Interne 2026",
    category: "Projets",
  },
];

export const homeAnnouncements: HomeAnnouncement[] = [
  {
    id: 1,
    type: "mariage",
    title: "Mariage de Koffi et Aïcha",
    detail: "Félicitations à nos collègues du pôle Tech",
    date: "15 août 2026",
    emoji: "💍",
  },
  {
    id: 2,
    type: "anniversaire",
    title: "Anniversaire de Souleymane",
    detail: "Joyeux anniversaire au responsable QA",
    date: "22 juillet 2026",
    emoji: "🎉",
  },
  {
    id: 3,
    type: "naissance",
    title: "Bienvenue à Bébé Inès",
    detail: "Félicitations à l'équipe RH pour cette naissance",
    date: "2 septembre 2026",
    emoji: "👶",
  },
  {
    id: 4,
    type: "evenement",
    title: "Soirée d'été IKA",
    detail: "Réservez votre place pour le 10 juillet",
    date: "10 juillet 2026",
    emoji: "🌞",
  },
];

export const homeCollaborators: HomeCollaborator[] = [
  {
    id: 1,
    name: "YAYA Ouattara",
    occupation: "Directeur Général",
    department: "Direction",
    birthdate: "1989-06-14",
    location: "Ouagadougou, Burkina Faso",
    email: "y.ouattara@ikasolution.com",
    phone: "+226 70 70 70 70",
    avatar: "/assets/team/DG.jpg",
  },
  {
    id: 2,
    name: "SERGE GEDEON OUE",
    occupation: "Développeur Full Stack",
    department: "Engineering",
    birthdate: "1982-03-22",
    location: "Ouagadougou, Burkina Faso",
    email: "s.gedeon@ikasolution.com",
    phone: "+226 70 70 70 70",
    avatar: "/assets/team/serge.jpg",
  },
  {
    id: 3,
    name: "Daouda DAO",
    occupation: "Développeur Front End",
    department: "Engineering",
    birthdate: "1994-11-05",
    location: "Ouagadougou, Burkina Faso",
    email: "d.dao@ikasolution.com",
    phone: "+226 70 70 70 70",
    avatar: "/assets/team/daouda.jpg",
  },
  {
    id: 4,
    name: "Sandrine Tiahoun KINI",
    occupation: "Assistante de Direction",
    department: "Direction",
    birthdate: "1991-08-30",
    location: "Ouagadougou, Burkina Faso",
    email: "s.kini@ikasolution.com",
    phone: "+226 70 70 70 70",
    avatar: "/assets/team/sandrine.jpg",
  },
  {
    id: 5,
    name: "Tegawende Martin YAMEOGO",
    occupation: "Développeur Junior",
    department: "Engineering",
    birthdate: "1996-02-18",
    location: "Ouagadougou, Burkina Faso",
    email: "m.yameogo@ikasolution.com",
    phone: "+226 70 70 70 70",
    avatar: "/assets/team/Martin.jpg",
  },
  {
    id: 6,
    name: "Roukiatou OUEDRAOGO",
    occupation: "Commerciale",
    department: "Ventes & Marketing",
    birthdate: "1988-09-12",
    location: "Ouagadougou, Burkina Faso",
    email: "r.ouedraogo@ikasolution.com",
    phone: "+226 70 70 70 70",
    avatar: "/assets/team/roukie.jpg",
  },
  {
    id: 7,
    name: "Victorine BAZEMO",
    occupation: "Assistante Commerciale",
    department: "Ventes & Marketing",
    birthdate: "1993-04-27",
    location: "Ouagadougou, Burkina Faso",
    email: "v.bazemo@ikasolution.com",
    phone: "+226 70 70 70 70",
    avatar: "/assets/team/victorine.jpg",
  },
  {
    id: 8,
    name: "Aminata HEMA",
    occupation: "Compliance Officer",
    department: "Comptabilité",
    birthdate: "1979-12-03",
    location: "Ouagadougou, Burkina Faso",
    email: "a.hema@ikasolution.com",
    phone: "+226 70 70 70 70",
    avatar: "/assets/team/aminata.jpg",
  },
];

export const employeeOfMonth: HomeEmployeeOfMonth = {
  name: "SERGE GEDEON OUE",
  role: "Lead Software Engineer",
  department: "Ingenierie",
  quote:
    "Il s'est distingué par son excellence technique et sa capacité à livrer des solutions cloud scalables dans des délais serrés. Son leadership sur le projet de migration microservices a permis de réduire les coûts d'infrastructure de 34%. Pour son engagement constant envers la qualité et l'innovation, il est désigné Collaborateur du mois de Juin.",
  nominatedBy: "YAYA Ouattara, Directeur Général",
  avatar: "/assets/team/Serge.jpg",
  month: "Juin 2026",
};

export const projects: HomeProject[] = [
  {
    id: 1,
    name: "Migration Microservices",
    lead: "Cloud Team",
    progress: 78,
    status: "on-track",
    due: "30 juin",
    tasks: { done: 14, total: 18 },
  },
  {
    id: 2,
    name: "Portail Client v3.0",
    lead: "Frontend",
    progress: 45,
    status: "at-risk",
    due: "15 juil.",
    tasks: { done: 9, total: 20 },
  },
  {
    id: 3,
    name: "Pipeline Data IA",
    lead: "Data Team",
    progress: 92,
    status: "on-track",
    due: "28 juin",
    tasks: { done: 22, total: 24 },
  },
  {
    id: 4,
    name: "Audit Cybersécurité",
    lead: "SecOps",
    progress: 30,
    status: "delayed",
    due: "1 août",
    tasks: { done: 6, total: 20 },
  },
];

export const homeDepartments: HomeDepartmentCard[] = [
  {
    name: "Ingénierie",
    desc: "Développement logiciel, architecture, DevOps et innovation technologique",
    icon: "Code2",
    accent:
      "bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white",
    badge: "bg-blue-100 text-blue-700",
    members: 5,
    src: "/techniciens",
  },
  {
    name: "Administration",
    desc: "Gestion administrative, ressources humaines et organisation interne",
    icon: "Briefcase",
    accent:
      "bg-violet-50 text-violet-700 group-hover:bg-violet-700 group-hover:text-white",
    badge: "bg-violet-100 text-violet-700",
    members: 18,
    src: "/administration",
  },
  {
    name: "Comptabilité",
    desc: "Gestion financière, trésorerie, facturation et contrôle budgétaire",
    icon: "Calculator",
    accent:
      "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white",
    badge: "bg-emerald-100 text-emerald-700",
    members: 15,
    src: "/comptabilite",
  },
  {
    name: "Ventes & Marketing",
    desc: "Développement commercial, communication, marketing digital et relation client",
    icon: "Megaphone",
    accent:
      "bg-orange-50 text-orange-700 group-hover:bg-orange-700 group-hover:text-white",
    badge: "bg-orange-100 text-orange-700",
    members: 24,
    src: "/commerciaux",
  },
];
