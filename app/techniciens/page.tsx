"use client";

import { useState, useMemo } from "react";
import {
  Code2,
  Bell,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit3,
  CheckCircle2,
  XCircle,
  Timer,
  CalendarDays,
  Phone,
  Mail,
  X,
  MessageSquare,
  Settings,
  Home,
  AlertTriangle,
  Info,
  Send,
  TrendingUp,
  TrendingDown,
  GraduationCap,
  ShoppingCart,
  BarChart3,
  Briefcase,
  ChevronDown,
  MoreHorizontal,
  Printer,
  Archive,
  RefreshCw,
  Landmark,
  CircleDollarSign,
  BookOpen,
  Hash,
  Target,
  Wallet,
  ArrowRight,
  CheckSquare,
  User,
  Building,
  Layers,
  Globe,
  Cpu,
  GitBranch,
  GitPullRequest,
  Server,
  Database,
  Cloud,
  Headphones,
  FileCode,
  Terminal,
  Zap,
  Shield,
  Activity,
  Clock,
  Package,
  Star,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  FileText,
  Calendar,
  FolderOpen,
  MapPin,
  Building2,
  Coffee,
  ClipboardList,
  CheckCircle,
  Circle,
  Inbox,
  Layout,
  Smartphone,
  Monitor,
  Layers2,
  Rocket,
  Bug,
  TestTube,
  GitMerge,
  Wifi,
  HardDrive,
  Lock,
  Key,
  UserCheck,
  TrendingUp as Trend,
  PieChart,
  FileSpreadsheet,
  Milestone,
  Flag,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Wrench,
  Gauge,
  BadgeCheck,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────

type StatutProjet =
  | "en_cours"
  | "termine"
  | "en_attente"
  | "suspendu"
  | "en_review";
type TypeProjet =
  | "site_web"
  | "application"
  | "api"
  | "mobile"
  | "ecommerce"
  | "portail";
type PrioriteProjet = "critique" | "haute" | "normale" | "basse";
type StatutMarche = "depot" | "en_cours" | "gagne" | "perdu" | "annule";
type TypeMarche = "appel_offre" | "gre_a_gre" | "consultation" | "demande_prix";
type StatutTicket = "ouvert" | "en_cours" | "resolu" | "ferme";
type PrioriteTicket = "urgente" | "haute" | "normale" | "basse";
type Application = "IKA_CLOUD" | "IKA_COURRIER" | "IKA_PORTAIL" | "IKA_ARCHIVE";
type StatutSprint = "actif" | "termine" | "planifie";
type NiveauSeverite = "critique" | "majeur" | "mineur" | "info";

type Membre = {
  id: string;
  nom: string;
  poste: string;
  avatar: string;
  competences: string[];
  statut: "present" | "conge" | "mission" | "absent";
  projetsActifs: number;
  ticketsAssignes: number;
};

type Projet = {
  id: string;
  nom: string;
  client: string;
  type: TypeProjet;
  description: string;
  statut: StatutProjet;
  priorite: PrioriteProjet;
  dateDebut: string;
  dateLivraison: string;
  progression: number;
  budget: number;
  budgetUtilise: number;
  equipe: string[];
  responsable: string;
  technologies: string[];
  tachesTotal: number;
  tachesTerminees: number;
  lienDemo?: string;
};

type MarchePublic = {
  id: string;
  reference: string;
  intitule: string;
  autorite: string;
  type: TypeMarche;
  statut: StatutMarche;
  montantEstime: number;
  montantSoumis?: number;
  montantAttribue?: number;
  dateDepot: string;
  dateOuverture?: string;
  dateResultat?: string;
  responsable: string;
  description: string;
  documents: string[];
  phase: string;
};

type MarcheExecution = {
  id: string;
  reference: string;
  intitule: string;
  client: string;
  montantContrat: number;
  montantEncaisse: number;
  dateDebut: string;
  dateFin: string;
  progression: number;
  responsable: string;
  statut: "en_cours" | "retard" | "suspendu" | "livre" | "accepte";
  livrables: { nom: string; statut: "livre" | "en_cours" | "en_attente" }[];
  prochainJalon: string;
  prochainJalonDate: string;
};

type TicketSupport = {
  id: string;
  titre: string;
  description: string;
  client: string;
  application: Application;
  priorite: PrioriteTicket;
  statut: StatutTicket;
  dateCreation: string;
  dateEcheance: string;
  assigneA: string;
  severite: NiveauSeverite;
  categorie: "bug" | "evolution" | "question" | "acces" | "performance";
  tempsEstime: number;
  tempsRealise: number;
};

type Sprint = {
  id: string;
  nom: string;
  projetId: string;
  projetNom: string;
  dateDebut: string;
  dateFin: string;
  statut: StatutSprint;
  tachesTotal: number;
  tachesTerminees: number;
  velocity: number;
  objectif: string;
};

type Bug = {
  id: string;
  titre: string;
  projetNom: string;
  application?: Application;
  severite: NiveauSeverite;
  statut: "ouvert" | "en_cours" | "teste" | "ferme";
  signalePar: string;
  assigneA: string;
  dateSignalement: string;
  environnement: "production" | "staging" | "developpement";
  description: string;
};

type StatutServeur =
  | "operationnel"
  | "degradé"
  | "hors_service"
  | "maintenance";

type Serveur = {
  id: string;
  nom: string;
  application: Application;
  type: "web" | "api" | "bdd" | "stockage" | "cache";
  statut: StatutServeur;
  cpu: number;
  ram: number;
  disque: number;
  uptime: string;
  ip: string;
  region: string;
};

// ─── DONNÉES ─────────────────────────────────────────────────

const membres: Membre[] = [
  {
    id: "m1",
    nom: "SERGE GEDEON OUE",
    poste: "Ingénieur Principal",
    avatar: "/assets/team/serge.jpg",
    competences: ["Architecture", "Node.js", "AWS", "DevOps"],
    statut: "present",
    projetsActifs: 3,
    ticketsAssignes: 5,
  },
  {
    id: "m2",
    nom: "Daouda DAO",
    poste: "Développeur Front End",
    avatar: "/assets/team/daouda.jpg",
    competences: ["React", "TypeScript", "Tailwind", "Next.js"],
    statut: "conge",
    projetsActifs: 2,
    ticketsAssignes: 3,
  },
  {
    id: "m3",
    nom: "Tegawende M. YAMEOGO",
    poste: "Développeur Junior",
    avatar: "/assets/team/Martin.jpg",
    competences: ["JavaScript", "Vue.js", "PHP", "MySQL"],
    statut: "present",
    projetsActifs: 2,
    ticketsAssignes: 7,
  },
];

const projets: Projet[] = [
  {
    id: "p1",
    nom: "Portail Citoyen MAECR",
    client: "Ministère MAECR",
    type: "portail",
    description:
      "Portail de services administratifs en ligne pour les citoyens burkinabè.",
    statut: "en_cours",
    priorite: "critique",
    dateDebut: "2025-04-01",
    dateLivraison: "2025-09-30",
    progression: 62,
    budget: 45000000,
    budgetUtilise: 28500000,
    equipe: ["m1", "m2", "m3"],
    responsable: "SERGE GEDEON OUE",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Docker"],
    tachesTotal: 84,
    tachesTerminees: 52,
    lienDemo: "https://demo.portail-maecr.bf",
  },
  {
    id: "p2",
    nom: "IKA CLOUD v3.0",
    client: "Interne — IKA Solution",
    type: "application",
    description:
      "Refonte complète de la plateforme IKA CLOUD avec nouvelles fonctionnalités.",
    statut: "en_cours",
    priorite: "haute",
    dateDebut: "2025-05-15",
    dateLivraison: "2025-10-15",
    progression: 38,
    budget: 28000000,
    budgetUtilise: 11200000,
    equipe: ["m1", "m2"],
    responsable: "SERGE GEDEON OUE",
    technologies: ["React", "FastAPI", "MongoDB", "Redis", "AWS S3"],
    tachesTotal: 60,
    tachesTerminees: 23,
  },
  {
    id: "p3",
    nom: "Site e-commerce SOMIKA",
    client: "SOMIKA BF",
    type: "ecommerce",
    description:
      "Boutique en ligne avec paiement mobile money et gestion des stocks.",
    statut: "en_review",
    priorite: "haute",
    dateDebut: "2025-02-01",
    dateLivraison: "2025-07-20",
    progression: 91,
    budget: 12000000,
    budgetUtilise: 10800000,
    equipe: ["m2", "m3"],
    responsable: "Daouda DAO",
    technologies: ["Next.js", "Stripe", "Tailwind", "Supabase"],
    tachesTotal: 42,
    tachesTerminees: 38,
    lienDemo: "https://demo.somika-shop.bf",
  },
  {
    id: "p4",
    nom: "Application RH ONEA",
    client: "ONEA",
    type: "application",
    description: "Système de gestion RH, paie et présences pour l'ONEA.",
    statut: "en_attente",
    priorite: "normale",
    dateDebut: "2025-08-01",
    dateLivraison: "2025-12-31",
    progression: 0,
    budget: 35000000,
    budgetUtilise: 0,
    equipe: ["m1", "m3"],
    responsable: "SERGE GEDEON OUE",
    technologies: ["React", "Django", "PostgreSQL"],
    tachesTotal: 70,
    tachesTerminees: 0,
  },
  {
    id: "p5",
    nom: "Site vitrine Agence FUTUR",
    client: "Agence FUTUR",
    type: "site_web",
    description: "Site vitrine moderne avec CMS headless et blog intégré.",
    statut: "termine",
    priorite: "normale",
    dateDebut: "2025-01-10",
    dateLivraison: "2025-03-31",
    progression: 100,
    budget: 4500000,
    budgetUtilise: 4200000,
    equipe: ["m2"],
    responsable: "Daouda DAO",
    technologies: ["Astro", "Sanity CMS", "Tailwind"],
    tachesTotal: 28,
    tachesTerminees: 28,
    lienDemo: "https://www.agence-futur.bf",
  },
];

const marchesPublics: MarchePublic[] = [
  {
    id: "mp1",
    reference: "AOOD-2025-0142",
    intitule:
      "Développement système d'information pour la gestion des marchés publics",
    autorite: "Direction Générale du Contrôle des Marchés Publics",
    type: "appel_offre",
    statut: "depot",
    montantEstime: 95000000,
    montantSoumis: 87500000,
    dateDepot: "2025-07-25",
    dateOuverture: "2025-08-05",
    responsable: "SERGE GEDEON OUE",
    description:
      "Système complet de gestion et de suivi des marchés publics avec tableau de bord analytique.",
    documents: [
      "Offre technique",
      "Offre financière",
      "Références",
      "Attestations",
    ],
    phase: "Préparation du dossier",
  },
  {
    id: "mp2",
    reference: "DGTTM-2025-0089",
    intitule: "Plateforme numérique de suivi du transport et de la mobilité",
    autorite: "DGTTM — Ministère des Transports",
    type: "appel_offre",
    statut: "en_cours",
    montantEstime: 65000000,
    dateDepot: "2025-06-30",
    dateOuverture: "2025-07-10",
    responsable: "SERGE GEDEON OUE",
    description:
      "Application web et mobile de suivi en temps réel des transports en commun.",
    documents: ["Offre technique", "Offre financière"],
    phase: "Évaluation en cours",
  },
  {
    id: "mp3",
    reference: "MARAH-2024-0211",
    intitule: "Portail de collecte et d'analyse des données agricoles",
    autorite: "Ministère de l'Agriculture",
    type: "gre_a_gre",
    statut: "gagne",
    montantEstime: 42000000,
    montantSoumis: 38500000,
    montantAttribue: 38500000,
    dateDepot: "2024-10-15",
    dateOuverture: "2024-11-01",
    dateResultat: "2024-12-01",
    responsable: "SERGE GEDEON OUE",
    description:
      "Portail de saisie et visualisation des données agricoles nationales.",
    documents: [
      "Contrat signé",
      "PV attribution",
      "Caution de bonne exécution",
    ],
    phase: "Contrat signé — Exécution en cours",
  },
  {
    id: "mp4",
    reference: "CNSS-2025-0047",
    intitule: "Refonte du système de gestion des cotisants CNSS",
    autorite: "Caisse Nationale de Sécurité Sociale",
    type: "consultation",
    statut: "perdu",
    montantEstime: 120000000,
    montantSoumis: 108000000,
    dateDepot: "2025-03-20",
    dateOuverture: "2025-04-02",
    dateResultat: "2025-05-15",
    responsable: "SERGE GEDEON OUE",
    description:
      "Refonte complète du système informatique de gestion des cotisants.",
    documents: ["Offre technique", "Offre financière", "PV d'ouverture"],
    phase: "Attribution à un concurrent",
  },
  {
    id: "mp5",
    reference: "MENA-2025-0098",
    intitule: "Application de gestion scolaire pour écoles primaires",
    autorite: "Ministère de l'Éducation Nationale",
    type: "demande_prix",
    statut: "en_cours",
    montantEstime: 18000000,
    dateDepot: "2025-07-10",
    responsable: "Daouda DAO",
    description:
      "Outil de gestion des effectifs, notes et bulletins pour 500 écoles primaires.",
    documents: ["Offre technique", "Devis"],
    phase: "Soumission déposée",
  },
];

const marchesExecution: MarcheExecution[] = [
  {
    id: "me1",
    reference: "MARAH-2024-0211",
    intitule: "Portail agricole MARAH",
    client: "Ministère de l'Agriculture",
    montantContrat: 38500000,
    montantEncaisse: 15400000,
    dateDebut: "2025-01-15",
    dateFin: "2025-09-30",
    progression: 45,
    responsable: "SERGE GEDEON OUE",
    statut: "en_cours",
    livrables: [
      { nom: "Analyse & spécifications", statut: "livre" },
      { nom: "Maquettes validées", statut: "livre" },
      { nom: "Module saisie données", statut: "en_cours" },
      { nom: "Module visualisation", statut: "en_attente" },
      { nom: "Formation utilisateurs", statut: "en_attente" },
    ],
    prochainJalon: "Livraison module saisie",
    prochainJalonDate: "2025-08-15",
  },
  {
    id: "me2",
    reference: "MUN-2024-0178",
    intitule: "Système de gestion communale — Mairie de Koudougou",
    client: "Mairie de Koudougou",
    montantContrat: 22000000,
    montantEncaisse: 22000000,
    dateDebut: "2024-09-01",
    dateFin: "2025-03-31",
    progression: 100,
    responsable: "Daouda DAO",
    statut: "accepte",
    livrables: [
      { nom: "Analyse & spécifications", statut: "livre" },
      { nom: "Développement", statut: "livre" },
      { nom: "Tests & recette", statut: "livre" },
      { nom: "Déploiement", statut: "livre" },
      { nom: "Formation", statut: "livre" },
    ],
    prochainJalon: "Garantie maintenance",
    prochainJalonDate: "2026-03-31",
  },
  {
    id: "me3",
    reference: "MEF-2025-0032",
    intitule: "Module de suivi budgétaire MEF",
    client: "Ministère de l'Économie et des Finances",
    montantContrat: 55000000,
    montantEncaisse: 0,
    dateDebut: "2025-07-01",
    dateFin: "2026-01-31",
    progression: 8,
    responsable: "SERGE GEDEON OUE",
    statut: "en_cours",
    livrables: [
      { nom: "Kick-off & plan de projet", statut: "livre" },
      { nom: "Analyse fonctionnelle", statut: "en_cours" },
      { nom: "Développement", statut: "en_attente" },
      { nom: "Tests", statut: "en_attente" },
      { nom: "Déploiement", statut: "en_attente" },
    ],
    prochainJalon: "Validation analyse fonctionnelle",
    prochainJalonDate: "2025-08-01",
  },
];

const ticketsSupport: TicketSupport[] = [
  {
    id: "ts1",
    titre: "Impossible de téléverser des fichiers > 10 Mo",
    description:
      "Les utilisateurs reçoivent une erreur 413 lors du téléversement de fichiers dépassant 10 Mo.",
    client: "DGTCP",
    application: "IKA_ARCHIVE",
    priorite: "urgente",
    statut: "en_cours",
    dateCreation: "2025-07-14",
    dateEcheance: "2025-07-15",
    assigneA: "SERGE GEDEON OUE",
    severite: "critique",
    categorie: "bug",
    tempsEstime: 4,
    tempsRealise: 2,
  },
  {
    id: "ts2",
    titre: "Délai de réponse anormalement long sur IKA CLOUD",
    description:
      "Le tableau de bord met plus de 15 secondes à charger pour les comptes avec beaucoup de données.",
    client: "ONEA",
    application: "IKA_CLOUD",
    priorite: "haute",
    statut: "en_cours",
    dateCreation: "2025-07-13",
    dateEcheance: "2025-07-17",
    assigneA: "SERGE GEDEON OUE",
    severite: "majeur",
    categorie: "performance",
    tempsEstime: 8,
    tempsRealise: 3,
  },
  {
    id: "ts3",
    titre: "Demande d'ajout d'un module statistiques",
    description:
      "Besoin d'un tableau de bord statistique sur le volume de courriers traités par mois.",
    client: "Mairie de Ouaga",
    application: "IKA_COURRIER",
    priorite: "normale",
    statut: "ouvert",
    dateCreation: "2025-07-12",
    dateEcheance: "2025-07-31",
    assigneA: "Daouda DAO",
    severite: "mineur",
    categorie: "evolution",
    tempsEstime: 16,
    tempsRealise: 0,
  },
  {
    id: "ts4",
    titre: "Accès refusé à certains rôles utilisateur",
    description:
      "Les utilisateurs avec rôle « Lecteur » ne peuvent pas accéder aux archives antérieures à 2023.",
    client: "MEF",
    application: "IKA_PORTAIL",
    priorite: "haute",
    statut: "resolu",
    dateCreation: "2025-07-10",
    dateEcheance: "2025-07-12",
    assigneA: "Tegawende M. YAMEOGO",
    severite: "majeur",
    categorie: "acces",
    tempsEstime: 3,
    tempsRealise: 2.5,
  },
  {
    id: "ts5",
    titre: "Notification email non envoyée à la validation",
    description:
      "Le mail de confirmation n'est pas envoyé lorsqu'un courrier est validé.",
    client: "ANPTIC",
    application: "IKA_COURRIER",
    priorite: "normale",
    statut: "ouvert",
    dateCreation: "2025-07-11",
    dateEcheance: "2025-07-20",
    assigneA: "Tegawende M. YAMEOGO",
    severite: "mineur",
    categorie: "bug",
    tempsEstime: 4,
    tempsRealise: 0,
  },
  {
    id: "ts6",
    titre: "Demande de formation sur IKA Archive",
    description:
      "L'équipe souhaite une session de formation sur les nouvelles fonctionnalités v2.4.",
    client: "CNSS",
    application: "IKA_ARCHIVE",
    priorite: "basse",
    statut: "ouvert",
    dateCreation: "2025-07-09",
    dateEcheance: "2025-07-28",
    assigneA: "Daouda DAO",
    severite: "info",
    categorie: "question",
    tempsEstime: 8,
    tempsRealise: 0,
  },
];

const sprints: Sprint[] = [
  {
    id: "sp1",
    nom: "Sprint 8",
    projetId: "p1",
    projetNom: "Portail Citoyen MAECR",
    dateDebut: "2025-07-07",
    dateFin: "2025-07-20",
    statut: "actif",
    tachesTotal: 12,
    tachesTerminees: 8,
    velocity: 34,
    objectif: "Finaliser le module authentification biométrique",
  },
  {
    id: "sp2",
    nom: "Sprint 4",
    projetId: "p2",
    projetNom: "IKA CLOUD v3.0",
    dateDebut: "2025-07-07",
    dateFin: "2025-07-20",
    statut: "actif",
    tachesTotal: 10,
    tachesTerminees: 4,
    velocity: 28,
    objectif: "Implémenter l'API de synchronisation multi-tenant",
  },
  {
    id: "sp3",
    nom: "Sprint 7",
    projetId: "p1",
    projetNom: "Portail Citoyen MAECR",
    dateDebut: "2025-06-23",
    dateFin: "2025-07-06",
    statut: "termine",
    tachesTotal: 11,
    tachesTerminees: 11,
    velocity: 38,
    objectif: "Module gestion des demandes citoyens",
  },
  {
    id: "sp4",
    nom: "Sprint 5",
    projetId: "p3",
    projetNom: "Site e-commerce SOMIKA",
    dateDebut: "2025-07-07",
    dateFin: "2025-07-20",
    statut: "actif",
    tachesTotal: 8,
    tachesTerminees: 7,
    velocity: 22,
    objectif: "Finalisation paiement & recette client",
  },
];

const bugs: Bug[] = [
  {
    id: "b1",
    titre: "Crash application iOS 17 — module scan documents",
    projetNom: "IKA CLOUD v3.0",
    application: "IKA_CLOUD",
    severite: "critique",
    statut: "en_cours",
    signalePar: "Client ONEA",
    assigneA: "SERGE GEDEON OUE",
    dateSignalement: "2025-07-14",
    environnement: "production",
    description:
      "L'application se ferme inopinément lors de l'utilisation du scanner sur iOS 17+.",
  },
  {
    id: "b2",
    titre: "Calcul incorrect des taxes TVA 18%",
    projetNom: "Site e-commerce SOMIKA",
    severite: "majeur",
    statut: "teste",
    signalePar: "Recette client",
    assigneA: "Daouda DAO",
    dateSignalement: "2025-07-13",
    environnement: "staging",
    description:
      "La TVA est calculée à 17.5% au lieu de 18% pour certaines catégories de produits.",
  },
  {
    id: "b3",
    titre: "Pagination incorrecte sur liste courriers > 1000 items",
    projetNom: "IKA COURRIER",
    application: "IKA_COURRIER",
    severite: "majeur",
    statut: "ouvert",
    signalePar: "Mairie de Ouaga",
    assigneA: "Tegawende M. YAMEOGO",
    dateSignalement: "2025-07-12",
    environnement: "production",
    description:
      "La pagination saute des pages lorsque la liste dépasse 1000 courriers.",
  },
  {
    id: "b4",
    titre: "Champ recherche sensible à la casse",
    projetNom: "Portail Citoyen MAECR",
    severite: "mineur",
    statut: "ferme",
    signalePar: "Équipe QA",
    assigneA: "Tegawende M. YAMEOGO",
    dateSignalement: "2025-07-10",
    environnement: "staging",
    description:
      "La recherche ne trouve pas les résultats si la casse ne correspond pas exactement.",
  },
];

const serveurs: Serveur[] = [
  {
    id: "srv1",
    nom: "IKA-CLOUD-PROD-01",
    application: "IKA_CLOUD",
    type: "web",
    statut: "operationnel",
    cpu: 34,
    ram: 58,
    disque: 42,
    uptime: "99.98%",
    ip: "10.0.1.10",
    region: "Paris (EU-West)",
  },
  {
    id: "srv2",
    nom: "IKA-CLOUD-DB-01",
    application: "IKA_CLOUD",
    type: "bdd",
    statut: "operationnel",
    cpu: 22,
    ram: 71,
    disque: 67,
    uptime: "99.99%",
    ip: "10.0.1.11",
    region: "Paris (EU-West)",
  },
  {
    id: "srv3",
    nom: "IKA-COURRIER-PROD",
    application: "IKA_COURRIER",
    type: "web",
    statut: "degradé",
    cpu: 87,
    ram: 92,
    disque: 55,
    uptime: "98.71%",
    ip: "10.0.2.10",
    region: "Francfort (EU-Central)",
  },
  {
    id: "srv4",
    nom: "IKA-PORTAIL-PROD",
    application: "IKA_PORTAIL",
    type: "api",
    statut: "operationnel",
    cpu: 18,
    ram: 44,
    disque: 31,
    uptime: "99.95%",
    ip: "10.0.3.10",
    region: "Paris (EU-West)",
  },
  {
    id: "srv5",
    nom: "IKA-ARCHIVE-STOR-01",
    application: "IKA_ARCHIVE",
    type: "stockage",
    statut: "operationnel",
    cpu: 12,
    ram: 38,
    disque: 81,
    uptime: "100%",
    ip: "10.0.4.10",
    region: "Amsterdam (EU-North)",
  },
  {
    id: "srv6",
    nom: "IKA-ARCHIVE-API",
    application: "IKA_ARCHIVE",
    type: "api",
    statut: "maintenance",
    cpu: 0,
    ram: 0,
    disque: 81,
    uptime: "—",
    ip: "10.0.4.11",
    region: "Amsterdam (EU-North)",
  },
];

// ─── CONFIG ───────────────────────────────────────────────────

function formatMontant(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const appConfig: Record<
  Application,
  {
    label: string;
    couleur: string;
    icone: React.ElementType;
    gradient: string;
  }
> = {
  IKA_CLOUD: {
    label: "IKA CLOUD",
    couleur: "text-sky-700",
    icone: Cloud,
    gradient: "from-sky-500 to-cyan-600",
  },
  IKA_COURRIER: {
    label: "IKA Courrier",
    couleur: "text-violet-700",
    icone: Inbox,
    gradient: "from-violet-500 to-purple-600",
  },
  IKA_PORTAIL: {
    label: "IKA Portail",
    couleur: "text-emerald-700",
    icone: Globe,
    gradient: "from-emerald-500 to-teal-600",
  },
  IKA_ARCHIVE: {
    label: "IKA Archive",
    couleur: "text-amber-700",
    icone: Archive,
    gradient: "from-amber-500 to-orange-600",
  },
};

const typeProjetConfig: Record<
  TypeProjet,
  { label: string; couleur: string; bg: string; icone: React.ElementType }
> = {
  site_web: {
    label: "Site Web",
    couleur: "text-blue-700",
    bg: "bg-blue-50",
    icone: Globe,
  },
  application: {
    label: "Application",
    couleur: "text-purple-700",
    bg: "bg-purple-50",
    icone: Monitor,
  },
  api: {
    label: "API",
    couleur: "text-slate-700",
    bg: "bg-slate-100",
    icone: Terminal,
  },
  mobile: {
    label: "Mobile",
    couleur: "text-pink-700",
    bg: "bg-pink-50",
    icone: Smartphone,
  },
  ecommerce: {
    label: "E-commerce",
    couleur: "text-orange-700",
    bg: "bg-orange-50",
    icone: ShoppingCart,
  },
  portail: {
    label: "Portail",
    couleur: "text-indigo-700",
    bg: "bg-indigo-50",
    icone: Layout,
  },
};

const statutProjetConfig: Record<
  StatutProjet,
  { label: string; couleur: string; bg: string; icone: React.ElementType }
> = {
  en_cours: {
    label: "En cours",
    couleur: "text-blue-700",
    bg: "bg-blue-50",
    icone: PlayCircle,
  },
  termine: {
    label: "Terminé",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50",
    icone: CheckCircle,
  },
  en_attente: {
    label: "En attente",
    couleur: "text-slate-600",
    bg: "bg-slate-100",
    icone: PauseCircle,
  },
  suspendu: {
    label: "Suspendu",
    couleur: "text-red-700",
    bg: "bg-red-50",
    icone: StopCircle,
  },
  en_review: {
    label: "En review",
    couleur: "text-amber-700",
    bg: "bg-amber-50",
    icone: Eye,
  },
};

const prioriteProjetConfig: Record<
  PrioriteProjet,
  { label: string; couleur: string; bg: string }
> = {
  critique: { label: "Critique", couleur: "text-red-700", bg: "bg-red-50" },
  haute: { label: "Haute", couleur: "text-orange-700", bg: "bg-orange-50" },
  normale: { label: "Normale", couleur: "text-blue-700", bg: "bg-blue-50" },
  basse: { label: "Basse", couleur: "text-slate-600", bg: "bg-slate-100" },
};

const statutMarcheConfig: Record<
  StatutMarche,
  { label: string; couleur: string; bg: string; icone: React.ElementType }
> = {
  depot: {
    label: "En dépôt",
    couleur: "text-blue-700",
    bg: "bg-blue-50",
    icone: Send,
  },
  en_cours: {
    label: "Évaluation",
    couleur: "text-amber-700",
    bg: "bg-amber-50",
    icone: Timer,
  },
  gagne: {
    label: "Gagné ✓",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50",
    icone: BadgeCheck,
  },
  perdu: {
    label: "Perdu",
    couleur: "text-red-700",
    bg: "bg-red-50",
    icone: XCircle,
  },
  annule: {
    label: "Annulé",
    couleur: "text-slate-600",
    bg: "bg-slate-100",
    icone: XCircle,
  },
};

const executionStatutConfig: Record<
  string,
  { label: string; couleur: string; bg: string }
> = {
  en_cours: { label: "En cours", couleur: "text-blue-700", bg: "bg-blue-50" },
  retard: { label: "En retard", couleur: "text-red-700", bg: "bg-red-50" },
  suspendu: { label: "Suspendu", couleur: "text-amber-700", bg: "bg-amber-50" },
  livre: { label: "Livré", couleur: "text-purple-700", bg: "bg-purple-50" },
  accepte: {
    label: "Accepté ✓",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50",
  },
};

const severiteConfig: Record<
  NiveauSeverite,
  { label: string; couleur: string; bg: string; point: string }
> = {
  critique: {
    label: "Critique",
    couleur: "text-red-700",
    bg: "bg-red-50",
    point: "bg-red-500",
  },
  majeur: {
    label: "Majeur",
    couleur: "text-orange-700",
    bg: "bg-orange-50",
    point: "bg-orange-500",
  },
  mineur: {
    label: "Mineur",
    couleur: "text-amber-700",
    bg: "bg-amber-50",
    point: "bg-amber-400",
  },
  info: {
    label: "Info",
    couleur: "text-blue-600",
    bg: "bg-blue-50",
    point: "bg-blue-400",
  },
};

const statutTicketConfig: Record<
  StatutTicket,
  { label: string; couleur: string; bg: string }
> = {
  ouvert: { label: "Ouvert", couleur: "text-blue-700", bg: "bg-blue-50" },
  en_cours: { label: "En cours", couleur: "text-amber-700", bg: "bg-amber-50" },
  resolu: { label: "Résolu", couleur: "text-emerald-700", bg: "bg-emerald-50" },
  ferme: { label: "Fermé", couleur: "text-slate-600", bg: "bg-slate-100" },
};

const categorieTicketConfig: Record<
  string,
  { label: string; icone: React.ElementType; couleur: string; bg: string }
> = {
  bug: { label: "Bug", icone: Bug, couleur: "text-red-700", bg: "bg-red-50" },
  evolution: {
    label: "Évolution",
    icone: Zap,
    couleur: "text-purple-700",
    bg: "bg-purple-50",
  },
  question: {
    label: "Question",
    icone: MessageSquare,
    couleur: "text-blue-700",
    bg: "bg-blue-50",
  },
  acces: {
    label: "Accès",
    icone: Key,
    couleur: "text-amber-700",
    bg: "bg-amber-50",
  },
  performance: {
    label: "Performance",
    icone: Gauge,
    couleur: "text-rose-700",
    bg: "bg-rose-50",
  },
};

const serveurStatutConfig: Record<
  StatutServeur,
  { label: string; couleur: string; bg: string; point: string }
> = {
  operationnel: {
    label: "Opérationnel",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50",
    point: "bg-emerald-500",
  },
  degradé: {
    label: "Dégradé",
    couleur: "text-amber-700",
    bg: "bg-amber-50",
    point: "bg-amber-500",
  },
  hors_service: {
    label: "Hors service",
    couleur: "text-red-700",
    bg: "bg-red-50",
    point: "bg-red-500",
  },
  maintenance: {
    label: "Maintenance",
    couleur: "text-blue-700",
    bg: "bg-blue-50",
    point: "bg-blue-500",
  },
};

const notifIcones: Record<string, React.ElementType> = {
  info: Info,
  alerte: AlertTriangle,
  succes: CheckCircle2,
  erreur: XCircle,
};
const notifCouleurs: Record<string, { couleur: string; bg: string }> = {
  info: { couleur: "text-blue-600", bg: "bg-blue-50" },
  alerte: { couleur: "text-amber-600", bg: "bg-amber-50" },
  succes: { couleur: "text-emerald-600", bg: "bg-emerald-50" },
  erreur: { couleur: "text-red-600", bg: "bg-red-50" },
};

const notifications = [
  {
    id: "n1",
    message: "Bug critique signalé sur IKA CLOUD — iOS crash en production",
    date: "2025-07-14",
    type: "erreur",
    lue: false,
  },
  {
    id: "n2",
    message: "Serveur IKA-COURRIER-PROD CPU à 87% — intervention requise",
    date: "2025-07-14",
    type: "alerte",
    lue: false,
  },
  {
    id: "n3",
    message: "Sprint 7 (Portail MAECR) terminé avec succès — velocity : 38 pts",
    date: "2025-07-13",
    type: "succes",
    lue: false,
  },
  {
    id: "n4",
    message: "Dépôt marché AOOD-2025-0142 à finaliser avant le 25 juillet",
    date: "2025-07-12",
    type: "alerte",
    lue: true,
  },
  {
    id: "n5",
    message: "Site e-commerce SOMIKA en phase de recette — review client",
    date: "2025-07-11",
    type: "info",
    lue: true,
  },
];

// ─── NAVIGATION ──────────────────────────────────────────────

type OngletId =
  | "tableau_bord"
  | "equipe"
  | "projets"
  | "sprints"
  | "bugs"
  | "marches_depot"
  | "marches_execution"
  | "support"
  | "infrastructure"
  | "documents";

type GroupeNav = {
  label: string;
  items: { id: OngletId; label: string; icone: React.ElementType }[];
};

const groupesNav: GroupeNav[] = [
  {
    label: "Vue globale",
    items: [{ id: "tableau_bord", label: "Tableau de bord", icone: Home }],
  },
  {
    label: "Développement",
    items: [
      { id: "projets", label: "Projets", icone: GitBranch },
      { id: "sprints", label: "Sprints & Tâches", icone: Milestone },
      { id: "bugs", label: "Bugs & QA", icone: Bug },
    ],
  },
  {
    label: "Marchés publics",
    items: [
      { id: "marches_depot", label: "Dépôts de marchés", icone: FileText },
      {
        id: "marches_execution",
        label: "Exécution marchés",
        icone: CheckSquare,
      },
    ],
  },
  {
    label: "Produits IKA",
    items: [
      { id: "support", label: "Support clients", icone: Headphones },
      { id: "infrastructure", label: "Infrastructure", icone: Server },
    ],
  },
  {
    label: "Ressources",
    items: [
      { id: "equipe", label: "Équipe", icone: Users },
      { id: "documents", label: "Documentation", icone: BookOpen },
    ],
  },
];

// ════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ════════════════════════════════════════════════════════════

export default function IntranetIngenierie() {
  const [ongletActif, setOngletActif] = useState<OngletId>("tableau_bord");
  const [recherche, setRecherche] = useState("");
  const [notifOuverte, setNotifOuverte] = useState(false);
  const [filtreStatutProjet, setFiltreStatutProjet] = useState<
    "tous" | StatutProjet
  >("tous");
  const [filtreStatutMarche, setFiltreStatutMarche] = useState<
    "tous" | StatutMarche
  >("tous");
  const [filtreApp, setFiltreApp] = useState<"tous" | Application>("tous");
  const [filtreStatutTicket, setFiltreStatutTicket] = useState<
    "tous" | StatutTicket
  >("tous");

  const notifsNonLues = notifications.filter((n) => !n.lue).length;

  const projetsFiltres = useMemo(() => {
    let l = projets;
    if (filtreStatutProjet !== "tous")
      l = l.filter((p) => p.statut === filtreStatutProjet);
    if (recherche.length > 1)
      l = l.filter(
        (p) =>
          p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
          p.client.toLowerCase().includes(recherche.toLowerCase()),
      );
    return l;
  }, [filtreStatutProjet, recherche]);

  const marchesFiltres = useMemo(() => {
    if (filtreStatutMarche === "tous") return marchesPublics;
    return marchesPublics.filter((m) => m.statut === filtreStatutMarche);
  }, [filtreStatutMarche]);

  const ticketsFiltres = useMemo(() => {
    let l = ticketsSupport;
    if (filtreStatutTicket !== "tous")
      l = l.filter((t) => t.statut === filtreStatutTicket);
    if (filtreApp !== "tous") l = l.filter((t) => t.application === filtreApp);
    return l;
  }, [filtreStatutTicket, filtreApp]);

  const stats = {
    projetsActifs: projets.filter((p) => p.statut === "en_cours").length,
    projetsEnReview: projets.filter((p) => p.statut === "en_review").length,
    marchesSoumis: marchesPublics.filter(
      (m) => m.statut === "depot" || m.statut === "en_cours",
    ).length,
    marchesGagnes: marchesPublics.filter((m) => m.statut === "gagne").length,
    ticketsOuverts: ticketsSupport.filter(
      (t) => t.statut === "ouvert" || t.statut === "en_cours",
    ).length,
    ticketsCritiques: ticketsSupport.filter(
      (t) => t.severite === "critique" && t.statut !== "ferme",
    ).length,
    bugsOuverts: bugs.filter((b) => b.statut !== "ferme").length,
    serveursAlerte: serveurs.filter(
      (s) => s.statut === "degradé" || s.statut === "hors_service",
    ).length,
    caTotal: marchesExecution.reduce((s, m) => s + m.montantContrat, 0),
    caEncaisse: marchesExecution.reduce((s, m) => s + m.montantEncaisse, 0),
    sprintsActifs: sprints.filter((s) => s.statut === "actif").length,
  };

  const ongletLabel =
    groupesNav.flatMap((g) => g.items).find((o) => o.id === ongletActif)
      ?.label ?? "";

  // ─── RENDER ──────────────────────────────────────────────

  return (
    <div className="theme-light flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans text-slate-900">
      <style jsx global>{`
        .theme-light {
          color: #0f172a;
          background-color: #f8fafc;
        }
        .theme-light [class*="bg-slate-950"],
        .theme-light [class*="bg-slate-900"] {
          background-color: #ffffff !important;
          background-image: none !important;
        }
        .theme-light [class*="bg-slate-800"],
        .theme-light [class*="bg-slate-700"] {
          background-color: #f1f5f9 !important;
          background-image: none !important;
        }
        .theme-light [class*="border-slate-800"],
        .theme-light [class*="border-slate-700"] {
          border-color: #cbd5e1 !important;
        }
        .theme-light [class*="text-slate-100"] {
          color: #0f172a !important;
        }
        .theme-light [class*="text-slate-200"] {
          color: #0f172a !important;
        }
        .theme-light [class*="text-slate-300"] {
          color: #475569 !important;
        }
        .theme-light [class*="text-slate-400"] {
          color: #64748b !important;
        }
        .theme-light [class*="placeholder-slate-600"]::placeholder {
          color: #94a3b8 !important;
        }
      `}</style>
      {/* ══════ SIDEBAR ══════ */}
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-slate-800/60 bg-slate-900/80 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-slate-800/60 px-5 py-4">
          <div>
            <h1 className="text-Xl font-extrabold tracking-tight ">
              Ingénierie
            </h1>
            <p className="text-[10px] font-medium text-slate-500">
              IKA Solution — Tech Hub
            </p>
          </div>
        </div>

        {/* Nav groupée */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {groupesNav.map((groupe) => (
            <div key={groupe.label}>
              <p className="mb-1 px-3 text-[9px] font-black uppercase tracking-[0.18em] text-slate-600">
                {groupe.label}
              </p>
              <div className="space-y-0.5">
                {groupe.items.map((item) => {
                  const Icone = item.icone;
                  const actif = ongletActif === item.id;
                  const badge =
                    item.id === "bugs"
                      ? stats.bugsOuverts
                      : item.id === "support"
                        ? stats.ticketsOuverts
                        : item.id === "infrastructure"
                          ? stats.serveursAlerte
                          : item.id === "projets"
                            ? stats.projetsEnReview
                            : 0;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setOngletActif(item.id)}
                      className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all duration-150 `}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-all `}
                      >
                        <Icone
                          size={13}
                          className={
                            actif
                              ? "text-cyan-400"
                              : "text-slate-500 group-hover:text-slate-300"
                          }
                        />
                      </div>
                      <span className="flex-1 truncate">{item.label}</span>
                      {badge > 0 && (
                        <span
                          className={`flex min-w-[18px] items-center justify-center rounded-full px-1 py-0.5 text-[9px] font-black `}
                        >
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* ══════ CONTENU ══════ */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* ══════ ONGLETS ══════ */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* ════ TABLEAU DE BORD ════ */}
          {ongletActif === "tableau_bord" && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  {
                    label: "Projets actifs",
                    valeur: stats.projetsActifs,
                    icone: GitBranch,
                    gradient: "from-cyan-500 to-blue-600",
                    sous: `${stats.projetsEnReview} en review`,
                    sousCouleur: "text-amber-400",
                  },
                  {
                    label: "CA Marchés",
                    valeur: formatMontant(stats.caTotal),
                    icone: CircleDollarSign,
                    gradient: "from-emerald-500 to-teal-600",
                    sous: `${formatMontant(stats.caEncaisse)} encaissé`,
                    sousCouleur: "text-emerald-400",
                  },
                  {
                    label: "Tickets support",
                    valeur: stats.ticketsOuverts,
                    icone: Headphones,
                    gradient: "from-rose-500 to-pink-600",
                    sous: `${stats.ticketsCritiques} critique${stats.ticketsCritiques > 1 ? "s" : ""}`,
                    sousCouleur: "text-red-400",
                  },
                  {
                    label: "Serveurs alertes",
                    valeur: stats.serveursAlerte,
                    icone: Server,
                    gradient: "from-amber-500 to-orange-600",
                    sous: `${serveurs.length} serveurs total`,
                    sousCouleur: "text-amber-400",
                  },
                ].map((stat, i) => {
                  const SIcon = stat.icone;
                  return (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-slate-700/60 hover:shadow-lg"
                    >
                      <div
                        className={`absolute -right-5 -top-5 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 transition-transform duration-500 group-hover:scale-150`}
                      />
                      <div className="relative">
                        <div
                          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                        >
                          <SIcon size={17} className="" />
                        </div>
                        <p className="text-2xl font-black  leading-none">
                          {stat.valeur}
                        </p>
                        <p className="mt-1.5 text-xs font-bold text-slate-400">
                          {stat.label}
                        </p>
                        <p
                          className={`mt-0.5 text-[10px] font-semibold ${stat.sousCouleur}`}
                        >
                          {stat.sous}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  {
                    label: "Marchés soumis",
                    valeur: stats.marchesSoumis,
                    icone: FileText,
                    couleur: "text-violet-400",
                    sous: `${stats.marchesGagnes} gagné${stats.marchesGagnes > 1 ? "s" : ""}`,
                  },
                  {
                    label: "Sprints actifs",
                    valeur: stats.sprintsActifs,
                    icone: Milestone,
                    couleur: "text-cyan-400",
                    sous: `${sprints.length} sprints total`,
                  },
                  {
                    label: "Bugs ouverts",
                    valeur: stats.bugsOuverts,
                    icone: Bug,
                    couleur: "text-red-400",
                    sous: `${bugs.filter((b) => b.severite === "critique").length} critique${bugs.filter((b) => b.severite === "critique").length > 1 ? "s" : ""}`,
                  },
                  {
                    label: "Membres équipe",
                    valeur: membres.length,
                    icone: Users,
                    couleur: "text-emerald-400",
                    sous: `${membres.filter((m) => m.statut === "present").length} présents`,
                  },
                ].map((stat, i) => {
                  const SIcon = stat.icone;
                  return (
                    <div
                      key={i}
                      className={`rounded-2xl border-none p-4 ${stat.bg} backdrop-blur-sm`}
                    >
                      <div className="flex items-center gap-3">
                        <SIcon size={16} className={stat.couleur} />
                        <p className="text-xl font-black ">{stat.valeur}</p>
                      </div>
                      <p className="mt-2 text-xs font-bold text-slate-400">
                        {stat.label}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-600">
                        {stat.sous}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Grille 3 colonnes */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Projets en cours */}
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b border-slate-800/60 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <GitBranch size={14} className="text-cyan-400" />
                      <h3 className="text-sm font-bold ">Projets en cours</h3>
                    </div>
                    <button
                      onClick={() => setOngletActif("projets")}
                      className="text-[10px] font-bold text-cyan-500 hover:text-cyan-300"
                    >
                      Voir tout →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-800/40">
                    {projets
                      .filter(
                        (p) =>
                          p.statut === "en_cours" || p.statut === "en_review",
                      )
                      .map((p) => {
                        const cfg = statutProjetConfig[p.statut];
                        return (
                          <div key={p.id} className="px-5 py-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-xs font-bold text-slate-200">
                                {p.nom}
                              </p>
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${cfg.bg} bg-opacity-20 ${cfg.couleur}`}
                              >
                                {cfg.label}
                              </span>
                            </div>
                            <p className="mt-0.5 truncate text-[10px] text-slate-600">
                              {p.client}
                            </p>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                style={{ width: `${p.progression}%` }}
                              />
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-[10px] text-slate-600">
                                {p.technologies.slice(0, 2).join(" · ")}
                              </span>
                              <span className="text-[10px] font-bold text-cyan-400">
                                {p.progression}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Sprints actifs */}
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b border-slate-800/60 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Milestone size={14} className="text-cyan-400" />
                      <h3 className="text-sm font-bold ">Sprints actifs</h3>
                    </div>
                    <button
                      onClick={() => setOngletActif("sprints")}
                      className="text-[10px] font-bold text-cyan-500 hover:text-cyan-300"
                    >
                      Voir tout →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-800/40">
                    {sprints
                      .filter((s) => s.statut === "actif")
                      .map((sp) => {
                        const pct = Math.round(
                          (sp.tachesTerminees / sp.tachesTotal) * 100,
                        );
                        return (
                          <div key={sp.id} className="px-5 py-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-slate-200">
                                {sp.nom}
                              </p>
                              <span className="rounded-full  px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                                Actif
                              </span>
                            </div>
                            <p className="mt-0.5 text-[10px] text-slate-600">
                              {sp.projetNom}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-500 line-clamp-1">
                              {sp.objectif}
                            </p>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-[10px] text-slate-600">
                                {sp.tachesTerminees}/{sp.tachesTotal} tâches ·
                                V:{sp.velocity}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-400">
                                {pct}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Statut infrastructure */}
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b border-slate-800/60 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Server size={14} className="text-cyan-400" />
                      <h3 className="text-sm font-bold ">Infrastructure</h3>
                    </div>
                    <button
                      onClick={() => setOngletActif("infrastructure")}
                      className="text-[10px] font-bold text-cyan-500 hover:text-cyan-300"
                    >
                      Voir tout →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-800/40">
                    {Object.entries(appConfig).map(([appKey, appCfg]) => {
                      const appServeurs = serveurs.filter(
                        (s) => s.application === appKey,
                      );
                      const alert = appServeurs.some(
                        (s) =>
                          s.statut === "degradé" ||
                          s.statut === "hors_service" ||
                          s.statut === "maintenance",
                      );
                      const AppIcon = appCfg.icone;
                      return (
                        <div
                          key={appKey}
                          className="flex items-center gap-3 px-5 py-3"
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${appCfg.bg} bg-opacity-20`}
                          >
                            <AppIcon size={14} className={appCfg.couleur} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-200">
                              {appCfg.label}
                            </p>
                            <p className="text-[10px] text-slate-600">
                              {appServeurs.length} serveur
                              {appServeurs.length > 1 ? "s" : ""}
                            </p>
                          </div>
                          <div
                            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 `}
                          >
                            <div
                              className={`h-1.5 w-1.5 rounded-full ${alert ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`}
                            />
                            <span
                              className={`text-[10px] font-bold ${alert ? "text-amber-400" : "text-emerald-400"}`}
                            >
                              {alert ? "Alerte" : "OK"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tickets critiques */}
              <div className="rounded-2xl border border-none ">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} />
                    <h3 className="text-sm font-bold ">
                      Tickets critiques & bugs ouverts
                    </h3>
                  </div>
                  <button
                    onClick={() => setOngletActif("support")}
                    className="text-[10px] font-bold text-red-400 hover:text-red-300"
                  >
                    Voir tout →
                  </button>
                </div>
                <div className="divide-y divide-red-900/20">
                  {[
                    ...ticketsSupport.filter(
                      (t) => t.severite === "critique" && t.statut !== "ferme",
                    ),
                    ...bugs.filter(
                      (b) => b.severite === "critique" && b.statut !== "ferme",
                    ),
                  ]
                    .slice(0, 3)
                    .map((item, i) => {
                      const isTicket =
                        "application" in item && "client" in item;
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-4 px-5 py-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-900/40">
                            {isTicket ? (
                              <Headphones size={13} className="text-red-400" />
                            ) : (
                              <Bug size={13} className="text-red-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-slate-200">
                              {(item as any).titre}
                            </p>
                            <p className="text-[10px] text-slate-600">
                              {isTicket
                                ? (item as TicketSupport).client
                                : (item as Bug).projetNom}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-red-900/50 px-2.5 py-1 text-[10px] font-bold text-red-300">
                            Critique
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ════ PROJETS ════ */}
          {ongletActif === "projets" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-bold  shadow-lg shadow-cyan-900/50 transition-all hover:from-cyan-500 hover:to-blue-500">
                  <Plus size={13} />
                  Nouveau projet
                </button>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      "tous",
                      "en_cours",
                      "en_review",
                      "en_attente",
                      "termine",
                      "suspendu",
                    ] as const
                  ).map((f) => {
                    const actif = filtreStatutProjet === f;
                    const label =
                      f === "tous" ? "Tous" : statutProjetConfig[f].label;
                    return (
                      <button
                        key={f}
                        onClick={() => setFiltreStatutProjet(f)}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${actif ? "bg-cyan-900/60 text-cyan-300 ring-1 ring-cyan-500/40" : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {projetsFiltres.map((p) => {
                  const sCfg = statutProjetConfig[p.statut];
                  const pCfg = prioriteProjetConfig[p.priorite];
                  const tCfg = typeProjetConfig[p.type];
                  const SIcon = sCfg.icone;
                  const TIcon = tCfg.icone;
                  return (
                    <div
                      key={p.id}
                      className="group overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm transition-all hover:border-slate-700/60 hover:shadow-xl"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 border-b border-slate-800/40 px-5 py-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <TIcon size={13} className={tCfg.couleur} />
                            <h4 className="truncate text-sm font-bold ">
                              {p.nom}
                            </h4>
                          </div>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {p.client}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${pCfg.bg} bg-opacity-20 ${pCfg.couleur}`}
                          >
                            {pCfg.label}
                          </span>
                          <span
                            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold ${sCfg.bg} bg-opacity-20 ${sCfg.couleur}`}
                          >
                            <SIcon size={9} />
                            {sCfg.label}
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="px-5 py-4">
                        <p className="mb-3 text-[11px] leading-relaxed text-slate-500">
                          {p.description}
                        </p>

                        {/* Progression */}
                        <div className="mb-3">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500">
                              Progression
                            </span>
                            <span className="text-[10px] font-black text-cyan-400">
                              {p.progression}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all`}
                              style={{ width: `${p.progression}%` }}
                            />
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[10px] text-slate-600">
                              {p.tachesTerminees}/{p.tachesTotal} tâches
                            </span>
                            <span className="text-[10px] text-slate-600">
                              Livraison : {formatDate(p.dateLivraison)}
                            </span>
                          </div>
                        </div>

                        {/* Budget */}
                        <div className="mb-3">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500">
                              Budget
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {formatMontant(p.budgetUtilise)} /{" "}
                              {formatMontant(p.budget)}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className={`h-full rounded-full ${p.budgetUtilise / p.budget > 0.9 ? "bg-red-500" : "bg-emerald-500"}`}
                              style={{
                                width: `${Math.min((p.budgetUtilise / p.budget) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-1">
                          {p.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-slate-800/40 bg-slate-900/40 px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <User size={11} className="text-slate-600" />
                          <span className="text-[10px] text-slate-500">
                            {p.responsable}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {p.lienDemo && (
                            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-cyan-400">
                              <Globe size={12} />
                            </button>
                          )}
                          {[Eye, Edit3, MoreHorizontal].map((Icon, i) => (
                            <button
                              key={i}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
                            >
                              <Icon size={12} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ SPRINTS ════ */}
          {ongletActif === "sprints" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-bold  shadow-lg shadow-cyan-900/50">
                  <Plus size={13} />
                  Nouveau sprint
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {sprints.map((sp) => {
                  const pct = Math.round(
                    (sp.tachesTerminees / sp.tachesTotal) * 100,
                  );
                  const statCfg =
                    sp.statut === "actif"
                      ? {
                          label: "Actif",
                          couleur: "text-emerald-400",
                        }
                      : sp.statut === "termine"
                        ? {
                            label: "Terminé",
                            couleur: "text-slate-400",
                          }
                        : {
                            label: "Planifié",
                            couleur: "text-blue-400",
                          };
                  return (
                    <div
                      key={sp.id}
                      className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-slate-700/60"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-cyan-400">
                              {sp.nom}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${statCfg.bg} ${statCfg.couleur}`}
                            >
                              {statCfg.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {sp.projetNom}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black ">{pct}%</p>
                          <p className="text-[10px] text-slate-600">complété</p>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
                        🎯 {sp.objectif}
                      </p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-3 border-t border-slate-800/40 pt-3">
                        {[
                          {
                            label: "Tâches",
                            val: `${sp.tachesTerminees}/${sp.tachesTotal}`,
                          },
                          { label: "Velocity", val: `${sp.velocity} pts` },
                          {
                            label: "Durée",
                            val: `${Math.round((new Date(sp.dateFin).getTime() - new Date(sp.dateDebut).getTime()) / (1000 * 60 * 60 * 24))}j`,
                          },
                        ].map((row, i) => (
                          <div key={i} className="text-center">
                            <p className="text-sm font-black ">{row.val}</p>
                            <p className="text-[10px] text-slate-600">
                              {row.label}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Clock size={10} className="text-slate-600" />
                          <span className="text-[10px] text-slate-600">
                            {formatDate(sp.dateDebut)} →{" "}
                            {formatDate(sp.dateFin)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ BUGS ════ */}
          {ongletActif === "bugs" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(
                  ["critique", "majeur", "mineur", "info"] as NiveauSeverite[]
                ).map((sev) => {
                  const cfg = severiteConfig[sev];
                  const count = bugs.filter(
                    (b) => b.severite === sev && b.statut !== "ferme",
                  ).length;
                  return (
                    <div
                      key={sev}
                      className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${cfg.point}`}
                        />
                        <span className={`text-xs font-bold ${cfg.couleur}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="mt-2 text-2xl font-black ">{count}</p>
                      <p className="text-[10px] text-slate-600">
                        bug{count > 1 ? "s" : ""} actif{count > 1 ? "s" : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-3">
                {bugs.map((b) => {
                  const sevCfg = severiteConfig[b.severite];
                  const envCfg =
                    b.environnement === "production"
                      ? {
                          label: "Production",
                          couleur: "text-red-400",
                          bg: "bg-red-900/40",
                        }
                      : b.environnement === "staging"
                        ? {
                            label: "Staging",
                            couleur: "text-amber-400",
                            bg: "bg-amber-900/40",
                          }
                        : {
                            label: "Dev",
                            couleur: "text-slate-400",
                            bg: "bg-slate-800/60",
                          };
                  const statCfg =
                    b.statut === "ouvert"
                      ? {
                          label: "Ouvert",
                          couleur: "text-blue-400",
                          bg: "bg-blue-900/40",
                        }
                      : b.statut === "en_cours"
                        ? {
                            label: "En cours",
                            couleur: "text-amber-400",
                            bg: "bg-amber-900/40",
                          }
                        : b.statut === "teste"
                          ? {
                              label: "En test",
                              couleur: "text-purple-400",
                              bg: "bg-purple-900/40",
                            }
                          : {
                              label: "Fermé",
                              couleur: "text-slate-400",
                              bg: "bg-slate-800/60",
                            };
                  return (
                    <div
                      key={b.id}
                      className="group overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-slate-700/60"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-opacity-20 ${sevCfg.bg}`}
                        >
                          <Bug size={15} className={sevCfg.couleur} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="text-sm font-bold ">{b.titre}</h4>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold bg-opacity-20 ${sevCfg.bg} ${sevCfg.couleur}`}
                            >
                              {sevCfg.label}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${statCfg.bg} ${statCfg.couleur}`}
                            >
                              {statCfg.label}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${envCfg.bg} ${envCfg.couleur}`}
                            >
                              {envCfg.label}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {b.description}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <span className="text-[10px] text-slate-600">
                              Projet :{" "}
                              <span className="font-semibold text-slate-400">
                                {b.projetNom}
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-600">
                              Assigné :{" "}
                              <span className="font-semibold text-slate-400">
                                {b.assigneA}
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-600">
                              Signalé :{" "}
                              <span className="font-semibold text-slate-400">
                                {formatDate(b.dateSignalement)}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {[Eye, Edit3].map((Icon, i) => (
                            <button
                              key={i}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-800 hover:text-slate-200"
                            >
                              <Icon size={13} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ MARCHÉS DÉPÔT ════ */}
          {ongletActif === "marches_depot" && (
            <div className="space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {(
                  [
                    "depot",
                    "en_cours",
                    "gagne",
                    "perdu",
                    "annule",
                  ] as StatutMarche[]
                ).map((s) => {
                  const cfg = statutMarcheConfig[s];
                  const count = marchesPublics.filter(
                    (m) => m.statut === s,
                  ).length;
                  const SIcon = cfg.icone;
                  return (
                    <div
                      key={s}
                      className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4"
                    >
                      <div className="flex items-center gap-1.5">
                        <SIcon size={12} className={cfg.couleur} />
                        <span
                          className={`text-[10px] font-bold ${cfg.couleur}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <p className="mt-2 text-xl font-black ">{count}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-bold  shadow-lg shadow-cyan-900/50">
                  <Plus size={13} />
                  Nouveau dossier
                </button>
                <div className="flex flex-wrap gap-1.5 ml-2">
                  {(
                    ["tous", "depot", "en_cours", "gagne", "perdu"] as const
                  ).map((f) => {
                    const actif = filtreStatutMarche === f;
                    const label =
                      f === "tous" ? "Tous" : statutMarcheConfig[f].label;
                    return (
                      <button
                        key={f}
                        onClick={() => setFiltreStatutMarche(f)}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${actif ? "bg-cyan-900/60 text-cyan-300 ring-1 ring-cyan-500/40" : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                {marchesFiltres.map((m) => {
                  const sCfg = statutMarcheConfig[m.statut];
                  const SIcon = sCfg.icone;
                  return (
                    <div
                      key={m.id}
                      className="group overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm transition-all hover:border-slate-700/60"
                    >
                      <div className="flex flex-wrap items-start gap-4 p-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-900/40">
                          <FileText size={17} className="text-violet-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black text-cyan-400">
                              {m.reference}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold bg-opacity-20 ${sCfg.bg} ${sCfg.couleur}`}
                            >
                              {sCfg.label}
                            </span>
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                              {m.type.replace("_", " ").toUpperCase()}
                            </span>
                          </div>
                          <h4 className="mt-1 text-sm font-bold ">
                            {m.intitule}
                          </h4>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {m.autorite}
                          </p>
                          <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                            {m.description}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-4">
                            <span className="text-[10px] text-slate-600">
                              Responsable :{" "}
                              <span className="font-semibold text-slate-400">
                                {m.responsable}
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-600">
                              Dépôt :{" "}
                              <span className="font-semibold text-slate-400">
                                {formatDate(m.dateDepot)}
                              </span>
                            </span>
                            {m.dateOuverture && (
                              <span className="text-[10px] text-slate-600">
                                Ouverture :{" "}
                                <span className="font-semibold text-slate-400">
                                  {formatDate(m.dateOuverture)}
                                </span>
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {m.documents.map((doc) => (
                              <span
                                key={doc}
                                className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-slate-500"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                            Estimé
                          </p>
                          <p className="text-base font-black ">
                            {formatMontant(m.montantEstime)}
                          </p>
                          {m.montantSoumis && (
                            <p className="text-[10px] text-slate-600">
                              Soumis : {formatMontant(m.montantSoumis)}
                            </p>
                          )}
                          {m.montantAttribue && (
                            <p className="text-[10px] font-bold text-emerald-400">
                              Attribué : {formatMontant(m.montantAttribue)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-slate-800/40 bg-slate-900/40 px-5 py-2.5 flex items-center justify-between">
                        <p className="text-[10px] text-slate-600">
                          Phase :{" "}
                          <span className="font-semibold text-slate-400">
                            {m.phase}
                          </span>
                        </p>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {[Eye, Edit3, Printer].map((Icon, i) => (
                            <button
                              key={i}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-800 hover:text-slate-200"
                            >
                              <Icon size={12} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ MARCHÉS EXÉCUTION ════ */}
          {ongletActif === "marches_execution" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "CA Total contrats",
                    val: formatMontant(stats.caTotal),
                    icone: CircleDollarSign,
                    couleur: "text-emerald-400",
                    sub: "tous marchés confondus",
                  },
                  {
                    label: "Montant encaissé",
                    val: formatMontant(stats.caEncaisse),
                    icone: Wallet,
                    couleur: "text-cyan-400",
                    sub: `${Math.round((stats.caEncaisse / stats.caTotal) * 100)}% du CA total`,
                  },
                  {
                    label: "Reste à encaisser",
                    val: formatMontant(stats.caTotal - stats.caEncaisse),
                    icone: TrendingUp,
                    couleur: "text-amber-400",
                    sub: "en attente de règlement",
                  },
                ].map((row, i) => {
                  const RIcon = row.icone;
                  return (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5"
                    >
                      <div className="flex items-center gap-2">
                        <RIcon size={16} className={row.couleur} />
                        <p className="text-[11px] font-bold text-slate-400">
                          {row.label}
                        </p>
                      </div>
                      <p className="mt-2 text-xl font-black ">{row.val}</p>
                      <p className="mt-0.5 text-[10px] text-slate-600">
                        {row.sub}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4">
                {marchesExecution.map((me) => {
                  const sCfg = executionStatutConfig[me.statut];
                  const pctEncaisse = Math.round(
                    (me.montantEncaisse / me.montantContrat) * 100,
                  );
                  return (
                    <div
                      key={me.id}
                      className="group overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm transition-all hover:border-slate-700/60"
                    >
                      <div className="border-b border-slate-800/40 px-5 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-cyan-400">
                                {me.reference}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-1 text-[9px] font-bold bg-opacity-20 ${sCfg.bg} ${sCfg.couleur}`}
                              >
                                {sCfg.label}
                              </span>
                            </div>
                            <h4 className="mt-1 text-sm font-bold ">
                              {me.intitule}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              {me.client} · Resp : {me.responsable}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-slate-600">
                              Contrat
                            </p>
                            <p className="text-lg font-black ">
                              {formatMontant(me.montantContrat)}
                            </p>
                            <p
                              className={`text-[10px] font-bold ${pctEncaisse >= 100 ? "text-emerald-400" : "text-amber-400"}`}
                            >
                              {formatMontant(me.montantEncaisse)} encaissé (
                              {pctEncaisse}%)
                            </p>
                          </div>
                        </div>

                        {/* Progression */}
                        <div className="mt-3">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500">
                              Avancement
                            </span>
                            <span className="text-[10px] font-black text-cyan-400">
                              {me.progression}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                              style={{ width: `${me.progression}%` }}
                            />
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[10px] text-slate-600">
                              {formatDate(me.dateDebut)} →{" "}
                              {formatDate(me.dateFin)}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Flag size={10} className="text-amber-500" />
                              <span className="text-[10px] text-amber-400">
                                {me.prochainJalon} —{" "}
                                {formatDate(me.prochainJalonDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Livrables */}
                      <div className="px-5 py-3">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          Livrables
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {me.livrables.map((l, i) => {
                            const lCfg =
                              l.statut === "livre"
                                ? {
                                    couleur: "text-emerald-400",
                                    bg: "bg-emerald-900/40",
                                    icone: CheckCircle,
                                  }
                                : l.statut === "en_cours"
                                  ? {
                                      couleur: "text-amber-400",
                                      bg: "bg-amber-900/40",
                                      icone: Circle,
                                    }
                                  : {
                                      couleur: "text-slate-500",
                                      bg: "bg-slate-800/60",
                                      icone: Circle,
                                    };
                            const LIcon = lCfg.icone;
                            return (
                              <div
                                key={i}
                                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${lCfg.bg}`}
                              >
                                <LIcon size={10} className={lCfg.couleur} />
                                <span
                                  className={`text-[10px] font-semibold ${lCfg.couleur}`}
                                >
                                  {l.nom}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ SUPPORT ════ */}
          {ongletActif === "support" && (
            <div className="space-y-5">
              {/* Résumé par app */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Object.entries(appConfig).map(([appKey, appCfg]) => {
                  const count = ticketsSupport.filter(
                    (t) => t.application === appKey && t.statut !== "ferme",
                  ).length;
                  const AppIcon = appCfg.icone;
                  return (
                    <div
                      key={appKey}
                      className={`rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${appCfg.gradient} bg-opacity-20`}
                        >
                          <AppIcon size={13} className="" />
                        </div>
                        <span
                          className={`text-[10px] font-bold ${appCfg.couleur}`}
                        >
                          {appCfg.label}
                        </span>
                      </div>
                      <p className="mt-2 text-2xl font-black ">{count}</p>
                      <p className="text-[10px] text-slate-600">
                        ticket{count > 1 ? "s" : ""} ouvert
                        {count > 1 ? "s" : ""}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Filtres */}
              <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-bold  shadow-lg shadow-cyan-900/50">
                  <Plus size={13} />
                  Nouveau ticket
                </button>
                <div className="flex flex-wrap gap-1.5">
                  {(["tous", "ouvert", "en_cours", "resolu"] as const).map(
                    (f) => {
                      const actif = filtreStatutTicket === f;
                      const label =
                        f === "tous" ? "Tous" : statutTicketConfig[f].label;
                      return (
                        <button
                          key={f}
                          onClick={() => setFiltreStatutTicket(f)}
                          className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${actif ? "bg-cyan-900/60 text-cyan-300 ring-1 ring-cyan-500/40" : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"}`}
                        >
                          {label}
                        </button>
                      );
                    },
                  )}
                </div>
                <select
                  value={filtreApp}
                  onChange={(e) => setFiltreApp(e.target.value as any)}
                  className="ml-auto rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                >
                  <option value="tous">Toutes les apps</option>
                  {Object.entries(appConfig).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tickets */}
              <div className="space-y-3">
                {ticketsFiltres.map((t) => {
                  const appCfg = appConfig[t.application];
                  const sevCfg = severiteConfig[t.severite];
                  const statCfg = statutTicketConfig[t.statut];
                  const catCfg = categorieTicketConfig[t.categorie];
                  const CatIcon = catCfg.icone;
                  const AppIcon = appCfg.icone;
                  const tempsRestant = t.tempsEstime - t.tempsRealise;
                  return (
                    <div
                      key={t.id}
                      className="group overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm transition-all hover:border-slate-700/60"
                    >
                      <div className="flex flex-wrap items-start gap-4 p-5">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${appCfg.gradient} bg-opacity-20`}
                        >
                          <AppIcon size={16} className="" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold bg-opacity-20 ${appCfg.bg} ${appCfg.couleur}`}
                            >
                              <AppIcon size={8} />
                              {appCfg.label}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold bg-opacity-20 ${sevCfg.bg} ${sevCfg.couleur}`}
                            >
                              {sevCfg.label}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${statCfg.bg} bg-opacity-20 ${statCfg.couleur}`}
                            >
                              {statCfg.label}
                            </span>
                            <span
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold bg-opacity-20 ${catCfg.bg} ${catCfg.couleur}`}
                            >
                              <CatIcon size={8} />
                              {catCfg.label}
                            </span>
                          </div>
                          <h4 className="mt-1.5 text-sm font-bold ">
                            {t.titre}
                          </h4>
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                            {t.description}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <span className="text-[10px] text-slate-600">
                              Client :{" "}
                              <span className="font-semibold text-slate-400">
                                {t.client}
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-600">
                              Assigné :{" "}
                              <span className="font-semibold text-slate-400">
                                {t.assigneA}
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-600">
                              Échéance :{" "}
                              <span className="font-semibold text-amber-400">
                                {formatDate(t.dateEcheance)}
                              </span>
                            </span>
                          </div>
                          {/* Temps */}
                          <div className="mt-2">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-[10px] text-slate-600">
                                Temps : {t.tempsRealise}h / {t.tempsEstime}h
                                estimé
                              </span>
                              <span
                                className={`text-[10px] font-bold ${tempsRestant < 0 ? "text-red-400" : "text-slate-500"}`}
                              >
                                {tempsRestant >= 0
                                  ? `${tempsRestant}h restant`
                                  : `${Math.abs(tempsRestant)}h dépassé`}
                              </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className={`h-full rounded-full ${tempsRestant < 0 ? "bg-red-500" : "bg-cyan-500"}`}
                                style={{
                                  width: `${Math.min((t.tempsRealise / t.tempsEstime) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {[Eye, Edit3].map((Icon, i) => (
                            <button
                              key={i}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-800 hover:text-slate-200"
                            >
                              <Icon size={13} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ INFRASTRUCTURE ════ */}
          {ongletActif === "infrastructure" && (
            <div className="space-y-5">
              {/* Statut global */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Object.entries(serveurStatutConfig).map(([s, cfg]) => {
                  const count = serveurs.filter(
                    (srv) => srv.statut === s,
                  ).length;
                  return (
                    <div
                      key={s}
                      className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${cfg.point} ${s === "degradé" ? "animate-pulse" : ""}`}
                        />
                        <span
                          className={`text-[10px] font-bold ${cfg.couleur}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <p className="mt-2 text-2xl font-black ">{count}</p>
                      <p className="text-[10px] text-slate-600">
                        serveur{count > 1 ? "s" : ""}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Serveurs par app */}
              {Object.entries(appConfig).map(([appKey, appCfg]) => {
                const appServeurs = serveurs.filter(
                  (s) => s.application === appKey,
                );
                const AppIcon = appCfg.icone;
                return (
                  <div
                    key={appKey}
                    className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm"
                  >
                    <div
                      className={`flex items-center gap-3 border-b border-slate-800/40 px-5 py-3.5 bg-gradient-to-r ${appCfg.gradient} bg-opacity-10`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                        <AppIcon size={15} className="" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold ">{appCfg.label}</h3>
                        <p className="text-[10px] /60">
                          {appServeurs.length} serveur
                          {appServeurs.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-800/40">
                      {appServeurs.map((srv) => {
                        const sCfg = serveurStatutConfig[srv.statut];
                        return (
                          <div
                            key={srv.id}
                            className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-6"
                          >
                            <div className="sm:col-span-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${sCfg.point} ${srv.statut === "degradé" ? "animate-pulse" : ""}`}
                                />
                                <p className="text-xs font-bold text-slate-200">
                                  {srv.nom}
                                </p>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold bg-opacity-20 ${sCfg.bg} ${sCfg.couleur}`}
                                >
                                  {sCfg.label}
                                </span>
                                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                                  {srv.type.toUpperCase()}
                                </span>
                              </div>
                              <p className="mt-1 text-[10px] text-slate-600">
                                {srv.ip} · {srv.region}
                              </p>
                            </div>
                            {[
                              {
                                label: "CPU",
                                val: srv.cpu,
                                couleur:
                                  srv.cpu > 80
                                    ? "bg-red-500"
                                    : srv.cpu > 60
                                      ? "bg-amber-500"
                                      : "bg-cyan-500",
                              },
                              {
                                label: "RAM",
                                val: srv.ram,
                                couleur:
                                  srv.ram > 80
                                    ? "bg-red-500"
                                    : srv.ram > 60
                                      ? "bg-amber-500"
                                      : "bg-violet-500",
                              },
                              {
                                label: "Disque",
                                val: srv.disque,
                                couleur:
                                  srv.disque > 85
                                    ? "bg-red-500"
                                    : srv.disque > 70
                                      ? "bg-amber-500"
                                      : "bg-emerald-500",
                              },
                            ].map((metric) => (
                              <div
                                key={metric.label}
                                className="flex flex-col justify-center"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-600">
                                    {metric.label}
                                  </span>
                                  <span
                                    className={`text-[10px] font-black ${metric.val > 80 ? "text-red-400" : "text-slate-300"}`}
                                  >
                                    {metric.val}%
                                  </span>
                                </div>
                                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                                  <div
                                    className={`h-full rounded-full ${metric.couleur}`}
                                    style={{ width: `${metric.val}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                            <div className="flex flex-col justify-center">
                              <span className="text-[10px] font-bold text-slate-600">
                                Uptime
                              </span>
                              <span className="text-sm font-black text-emerald-400">
                                {srv.uptime}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ════ ÉQUIPE ════ */}
          {ongletActif === "equipe" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {membres.map((m) => {
                  const statCfg =
                    m.statut === "present"
                      ? {
                          label: "Présent",
                          point: "bg-emerald-400",
                          couleur: "text-emerald-400",
                          bg: "bg-emerald-900/40",
                        }
                      : m.statut === "conge"
                        ? {
                            label: "En congé",
                            point: "bg-blue-400",
                            couleur: "text-blue-400",
                            bg: "bg-blue-900/40",
                          }
                        : m.statut === "mission"
                          ? {
                              label: "En mission",
                              point: "bg-amber-400",
                              couleur: "text-amber-400",
                              bg: "bg-amber-900/40",
                            }
                          : {
                              label: "Absent",
                              point: "bg-red-400",
                              couleur: "text-red-400",
                              bg: "bg-red-900/40",
                            };
                  return (
                    <div
                      key={m.id}
                      className="group overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm transition-all hover:border-slate-700/60 hover:shadow-xl"
                    >
                      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 px-4 pb-10 pt-4">
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${statCfg.bg} ${statCfg.couleur}`}
                          >
                            {statCfg.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                              {m.projetsActifs} projets
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative -mt-8 flex justify-center">
                        <div className="relative rounded-full bg-slate-900 p-1 shadow-xl ring-2 ring-slate-700/60">
                          <div className="h-16 w-16 overflow-hidden rounded-full">
                            <img
                              src={m.avatar}
                              alt={m.nom}
                              className="h-full w-full object-cover object-top"
                            />
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-slate-900 ${statCfg.point}`}
                          />
                        </div>
                      </div>
                      <div className="px-5 pb-5 pt-2 text-center">
                        <h4 className="text-sm font-bold ">{m.nom}</h4>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {m.poste}
                        </p>
                        <div className="mt-3 flex flex-wrap justify-center gap-1">
                          {m.competences.map((c) => (
                            <span
                              key={c}
                              className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800/40 pt-4">
                          <div>
                            <p className="text-lg font-black ">
                              {m.projetsActifs}
                            </p>
                            <p className="text-[10px] text-slate-600">
                              Projets actifs
                            </p>
                          </div>
                          <div>
                            <p className="text-lg font-black ">
                              {m.ticketsAssignes}
                            </p>
                            <p className="text-[10px] text-slate-600">
                              Tickets assignés
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-center gap-2">
                          {[Mail, Phone, MessageSquare].map((Icon, i) => (
                            <button
                              key={i}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-500 transition-colors hover:bg-slate-700 hover:text-cyan-400"
                            >
                              <Icon size={13} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ DOCUMENTATION ════ */}
          {ongletActif === "documents" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-bold  shadow-lg shadow-cyan-900/50">
                  <Plus size={13} />
                  Nouvelle doc
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    titre: "Architecture système IKA CLOUD v3",
                    categorie: "Architecture",
                    maj: "2025-07-10",
                    format: "MD",
                    icone: Layers,
                    couleur: "text-sky-400",
                    bg: "bg-sky-900/30",
                  },
                  {
                    titre: "Guide déploiement Docker — Environnements",
                    categorie: "DevOps",
                    maj: "2025-07-08",
                    format: "MD",
                    icone: Server,
                    couleur: "text-emerald-400",
                    bg: "bg-emerald-900/30",
                  },
                  {
                    titre: "API Reference IKA Courrier v2.4",
                    categorie: "API",
                    maj: "2025-07-05",
                    format: "YAML",
                    icone: Terminal,
                    couleur: "text-violet-400",
                    bg: "bg-violet-900/30",
                  },
                  {
                    titre: "Standards de code — Front End",
                    categorie: "Qualité",
                    maj: "2025-06-28",
                    format: "MD",
                    icone: FileCode,
                    couleur: "text-cyan-400",
                    bg: "bg-cyan-900/30",
                  },
                  {
                    titre: "Procédure de gestion des incidents",
                    categorie: "Ops",
                    maj: "2025-06-20",
                    format: "PDF",
                    icone: Wrench,
                    couleur: "text-amber-400",
                    bg: "bg-amber-900/30",
                  },
                  {
                    titre: "Charte sécurité & bonnes pratiques",
                    categorie: "Sécurité",
                    maj: "2025-05-15",
                    format: "PDF",
                    icone: Shield,
                    couleur: "text-red-400",
                    bg: "bg-red-900/30",
                  },
                ].map((doc, i) => {
                  const DIcon = doc.icone;
                  return (
                    <div
                      key={i}
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-slate-700/60 hover:shadow-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${doc.bg}`}
                        >
                          <DIcon size={17} className={doc.couleur} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold  leading-tight">
                            {doc.titre}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                              {doc.categorie}
                            </span>
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                              {doc.format}
                            </span>
                          </div>
                          <p className="mt-1.5 text-[10px] text-slate-600">
                            Mis à jour : {formatDate(doc.maj)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {[Eye, Download, Edit3].map((Icon, j) => (
                          <button
                            key={j}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-800 hover:text-slate-200"
                          >
                            <Icon size={12} />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
