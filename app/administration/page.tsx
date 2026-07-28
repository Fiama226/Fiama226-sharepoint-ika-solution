"use client";

import { useState, useMemo } from "react";
import {
  Building2,
  Users,
  FileText,
  Calendar,
  Clock,
  Bell,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Timer,
  CalendarDays,
  UserCheck,
  Coffee,
  MapPin,
  Phone,
  Mail,
  X,
  FolderOpen,
  ClipboardList,
  MessageSquare,
  Settings,
  Home,
  AlertTriangle,
  Info,
  Inbox,
  Send,
  TrendingUp,
  TrendingDown,
  DollarSign,
  GraduationCap,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Banknote,
  Receipt,
  FileCheck,
  Star,
  Package,
  Briefcase,
  ChevronDown,
  MoreHorizontal,
  Printer,
  Archive,
  RefreshCw,
  PieChart,
  Landmark,
  CreditCard,
  CircleDollarSign,
  BookOpen,
  FileSpreadsheet,
  Stamp,
  Hash,
  Target,
  Wallet,
  ArrowRight,
  CheckSquare,
  User,
  Building,
  Layers,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────

type StatutConge = "approuve" | "en_attente" | "refuse";
type StatutDocument = "valide" | "en_revision" | "brouillon" | "expire";
type PrioriteTicket = "haute" | "moyenne" | "basse";
type StatutTicket = "ouvert" | "en_cours" | "resolu" | "ferme";
type StatutCourrier = "traite" | "en_attente" | "archive" | "urgent";
type StatutStage = "en_cours" | "termine" | "a_venir" | "annule";
type CategorieDepense =
  | "fournitures"
  | "prestation"
  | "travaux"
  | "equipement"
  | "autre";
type StatutDepense = "paye" | "en_attente" | "en_litige" | "annule";

type Employe = {
  id: string;
  nom: string;
  poste: string;
  direction: string;
  email: string;
  telephone: string;
  avatar: string;
  dateEmbauche: string;
  statut: "present" | "conge" | "mission" | "absent";
  congesRestants: number;
};

type DemandeConge = {
  id: string;
  employeId: string;
  employeNom: string;
  employeAvatar: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  jours: number;
  motif: string;
  statut: StatutConge;
  dateDemande: string;
};

type DocumentAdmin = {
  id: string;
  titre: string;
  categorie: string;
  dateCreation: string;
  dateMaj: string;
  auteur: string;
  statut: StatutDocument;
  taille: string;
  format: string;
};

type Evenement = {
  id: string;
  titre: string;
  date: string;
  heure: string;
  lieu: string;
  type: "reunion" | "formation" | "evenement" | "deadline";
  participants: number;
};

type Notification = {
  id: string;
  message: string;
  date: string;
  type: "info" | "alerte" | "succes" | "erreur";
  lue: boolean;
};

type Ticket = {
  id: string;
  titre: string;
  description: string;
  demandeur: string;
  dateCreation: string;
  priorite: PrioriteTicket;
  statut: StatutTicket;
  categorie: string;
};

type CourrierArrive = {
  id: string;
  reference: string;
  expediteur: string;
  objet: string;
  dateReception: string;
  dateEnvoi: string;
  statut: StatutCourrier;
  priorite: "normal" | "urgent" | "confidentiel";
  destinataire: string;
  nature: string;
  fichier?: string;
};

type CourrierSortant = {
  id: string;
  reference: string;
  destinataire: string;
  objet: string;
  dateEnvoi: string;
  expediteur: string;
  statut: StatutCourrier;
  nature: string;
  copie?: string;
  fichier?: string;
};

type EtatFinancier = {
  id: string;
  intitule: string;
  periode: string;
  montantPrevu: number;
  montantRealise: number;
  ecart: number;
  tauxExecution: number;
  categorie: "recettes" | "depenses" | "investissement";
  statut: "valide" | "en_cours" | "en_revision";
};

type Stagiaire = {
  id: string;
  nom: string;
  prenom: string;
  avatar: string;
  etablissement: string;
  filiere: string;
  niveauEtude: string;
  encadrant: string;
  dateDebut: string;
  dateFin: string;
  sujet: string;
  statut: StatutStage;
  note?: number;
};

type DepenseMarche = {
  id: string;
  reference: string;
  intitule: string;
  fournisseur: string;
  categorie: CategorieDepense;
  montantHT: number;
  tva: number;
  montantTTC: number;
  dateBon: string;
  dateEcheance: string;
  statut: StatutDepense;
  description: string;
  responsable: string;
};

// ─── DONNÉES ─────────────────────────────────────────────────

const employes: Employe[] = [
  {
    id: "e1",
    nom: "YAYA Ouattara",
    poste: "Directeur Général",
    direction: "Direction Générale",
    email: "y.ouattara@ikasolution.com",
    telephone: "+226 70 00 00 01",
    avatar: "/assets/team/DG.jpg",
    dateEmbauche: "2018-01-15",
    statut: "present",
    congesRestants: 18,
  },
  {
    id: "e2",
    nom: "Sandrine T. KINI",
    poste: "Assistante de Direction",
    direction: "Direction Générale",
    email: "s.kini@ikasolution.com",
    telephone: "+226 70 00 00 02",
    avatar: "/assets/team/sandrine.jpg",
    dateEmbauche: "2019-03-20",
    statut: "present",
    congesRestants: 12,
  },
  {
    id: "e3",
    nom: "SERGE GEDEON OUE",
    poste: "Ingénieur Principal",
    direction: "Direction Technique",
    email: "s.gedeon@ikasolution.com",
    telephone: "+226 70 00 00 03",
    avatar: "/assets/team/serge.jpg",
    dateEmbauche: "2019-06-01",
    statut: "present",
    congesRestants: 15,
  },
  {
    id: "e4",
    nom: "Daouda DAO",
    poste: "Développeur Front End",
    direction: "Direction Technique",
    email: "d.dao@ikasolution.com",
    telephone: "+226 70 00 00 04",
    avatar: "/assets/team/daouda.jpg",
    dateEmbauche: "2021-02-10",
    statut: "conge",
    congesRestants: 5,
  },
  {
    id: "e5",
    nom: "Tegawende M. YAMEOGO",
    poste: "Développeur Junior",
    direction: "Direction Technique",
    email: "m.yameogo@ikasolution.com",
    telephone: "+226 70 00 00 05",
    avatar: "/assets/team/Martin.jpg",
    dateEmbauche: "2023-09-01",
    statut: "present",
    congesRestants: 22,
  },
  {
    id: "e6",
    nom: "Aminata HEMA",
    poste: "Comptable",
    direction: "Direction Comptabilité",
    email: "a.hema@ikasolution.com",
    telephone: "+226 70 00 00 06",
    avatar: "/assets/team/aminata.jpg",
    dateEmbauche: "2020-01-06",
    statut: "mission",
    congesRestants: 10,
  },
  {
    id: "e7",
    nom: "Roukiatou OUEDRAOGO",
    poste: "Responsable Commerciale",
    direction: "Direction Commerciale",
    email: "r.ouedraogo@ikasolution.com",
    telephone: "+226 70 00 00 07",
    avatar: "/assets/team/roukie.jpg",
    dateEmbauche: "2020-07-15",
    statut: "present",
    congesRestants: 14,
  },
  {
    id: "e8",
    nom: "Victorine BAZEMO",
    poste: "Assistante Commerciale",
    direction: "Direction Commerciale",
    email: "v.bazemo@ikasolution.com",
    telephone: "+226 70 00 00 08",
    avatar: "/assets/team/victorine.jpg",
    dateEmbauche: "2022-04-01",
    statut: "absent",
    congesRestants: 8,
  },
];

const demandesConge: DemandeConge[] = [
  {
    id: "c1",
    employeId: "e4",
    employeNom: "Daouda DAO",
    employeAvatar: "/assets/team/daouda.jpg",
    type: "Congé annuel",
    dateDebut: "2025-07-15",
    dateFin: "2025-07-25",
    jours: 8,
    motif: "Vacances familiales",
    statut: "approuve",
    dateDemande: "2025-06-20",
  },
  {
    id: "c2",
    employeId: "e7",
    employeNom: "Roukiatou OUEDRAOGO",
    employeAvatar: "/assets/team/roukie.jpg",
    type: "Congé maladie",
    dateDebut: "2025-07-28",
    dateFin: "2025-07-30",
    jours: 3,
    motif: "Consultation médicale",
    statut: "en_attente",
    dateDemande: "2025-07-10",
  },
  {
    id: "c3",
    employeId: "e5",
    employeNom: "Tegawende M. YAMEOGO",
    employeAvatar: "/assets/team/Martin.jpg",
    type: "Congé personnel",
    dateDebut: "2025-08-01",
    dateFin: "2025-08-05",
    jours: 5,
    motif: "Événement familial",
    statut: "en_attente",
    dateDemande: "2025-07-12",
  },
  {
    id: "c4",
    employeId: "e8",
    employeNom: "Victorine BAZEMO",
    employeAvatar: "/assets/team/victorine.jpg",
    type: "Congé annuel",
    dateDebut: "2025-07-01",
    dateFin: "2025-07-05",
    jours: 5,
    motif: "Repos",
    statut: "refuse",
    dateDemande: "2025-06-15",
  },
  {
    id: "c5",
    employeId: "e2",
    employeNom: "Sandrine T. KINI",
    employeAvatar: "/assets/team/sandrine.jpg",
    type: "Congé maternité",
    dateDebut: "2025-09-01",
    dateFin: "2025-11-30",
    jours: 90,
    motif: "Maternité",
    statut: "en_attente",
    dateDemande: "2025-07-14",
  },
];

const documentsAdmin: DocumentAdmin[] = [
  {
    id: "d1",
    titre: "Règlement intérieur 2025",
    categorie: "Réglementaire",
    dateCreation: "2025-01-10",
    dateMaj: "2025-03-15",
    auteur: "Sandrine T. KINI",
    statut: "valide",
    taille: "2.4 Mo",
    format: "PDF",
  },
  {
    id: "d2",
    titre: "Politique de confidentialité",
    categorie: "Juridique",
    dateCreation: "2024-06-01",
    dateMaj: "2025-01-20",
    auteur: "YAYA Ouattara",
    statut: "valide",
    taille: "1.8 Mo",
    format: "PDF",
  },
  {
    id: "d3",
    titre: "Manuel des procédures RH",
    categorie: "Ressources Humaines",
    dateCreation: "2025-02-15",
    dateMaj: "2025-07-01",
    auteur: "Sandrine T. KINI",
    statut: "en_revision",
    taille: "5.2 Mo",
    format: "DOCX",
  },
  {
    id: "d4",
    titre: "Charte informatique",
    categorie: "Informatique",
    dateCreation: "2024-03-10",
    dateMaj: "2024-03-10",
    auteur: "SERGE GEDEON OUE",
    statut: "expire",
    taille: "890 Ko",
    format: "PDF",
  },
  {
    id: "d5",
    titre: "Plan de formation 2025",
    categorie: "Formation",
    dateCreation: "2025-06-01",
    dateMaj: "2025-06-01",
    auteur: "Sandrine T. KINI",
    statut: "brouillon",
    taille: "1.1 Mo",
    format: "XLSX",
  },
  {
    id: "d6",
    titre: "Contrat type prestataire",
    categorie: "Juridique",
    dateCreation: "2025-04-20",
    dateMaj: "2025-05-10",
    auteur: "Aminata HEMA",
    statut: "valide",
    taille: "340 Ko",
    format: "DOCX",
  },
];

const evenements: Evenement[] = [
  {
    id: "ev1",
    titre: "Réunion de direction",
    date: "2025-07-16",
    heure: "09:00",
    lieu: "Salle de conférence A",
    type: "reunion",
    participants: 5,
  },
  {
    id: "ev2",
    titre: "Formation cybersécurité",
    date: "2025-07-18",
    heure: "14:00",
    lieu: "Salle de formation",
    type: "formation",
    participants: 8,
  },
  {
    id: "ev3",
    titre: "Anniversaire entreprise",
    date: "2025-07-25",
    heure: "17:00",
    lieu: "Terrasse",
    type: "evenement",
    participants: 8,
  },
  {
    id: "ev4",
    titre: "Clôture comptable Q2",
    date: "2025-07-31",
    heure: "23:59",
    lieu: "—",
    type: "deadline",
    participants: 2,
  },
  {
    id: "ev5",
    titre: "Point projet client ALPHA",
    date: "2025-07-17",
    heure: "10:30",
    lieu: "Visioconférence",
    type: "reunion",
    participants: 4,
  },
  {
    id: "ev6",
    titre: "Entretiens annuels",
    date: "2025-08-04",
    heure: "08:00",
    lieu: "Bureau DG",
    type: "reunion",
    participants: 8,
  },
];

const notifications: Notification[] = [
  {
    id: "n1",
    message: "Nouvelle demande de congé de Sandrine T. KINI (maternité)",
    date: "2025-07-14",
    type: "alerte",
    lue: false,
  },
  {
    id: "n2",
    message: "Courrier urgent reçu de la DGTCP — réponse requise sous 48h",
    date: "2025-07-14",
    type: "erreur",
    lue: false,
  },
  {
    id: "n3",
    message: "État financier Q2 validé et signé",
    date: "2025-07-13",
    type: "succes",
    lue: false,
  },
  {
    id: "n4",
    message: "La charte informatique a expiré — renouvellement requis",
    date: "2025-07-10",
    type: "erreur",
    lue: false,
  },
  {
    id: "n5",
    message: "Nouveau stagiaire prévu le 21 juillet — dossier à compléter",
    date: "2025-07-09",
    type: "info",
    lue: true,
  },
  {
    id: "n6",
    message: "Bon de commande MRC-2025-018 en attente de validation",
    date: "2025-07-08",
    type: "alerte",
    lue: true,
  },
];

const tickets: Ticket[] = [
  {
    id: "t1",
    titre: "Problème d'accès au VPN",
    description: "Impossible de se connecter au VPN depuis ce matin",
    demandeur: "Aminata HEMA",
    dateCreation: "2025-07-14",
    priorite: "haute",
    statut: "ouvert",
    categorie: "Informatique",
  },
  {
    id: "t2",
    titre: "Demande de fournitures bureau",
    description: "Besoin de ramettes de papier A4 et cartouches d'encre",
    demandeur: "Victorine BAZEMO",
    dateCreation: "2025-07-13",
    priorite: "basse",
    statut: "en_cours",
    categorie: "Logistique",
  },
  {
    id: "t3",
    titre: "Mise à jour poste de travail",
    description: "Windows update bloqué depuis 3 jours",
    demandeur: "Tegawende M. YAMEOGO",
    dateCreation: "2025-07-12",
    priorite: "moyenne",
    statut: "resolu",
    categorie: "Informatique",
  },
  {
    id: "t4",
    titre: "Climatisation bureau 2B",
    description: "La climatisation ne fonctionne plus dans le bureau 2B",
    demandeur: "Roukiatou OUEDRAOGO",
    dateCreation: "2025-07-11",
    priorite: "moyenne",
    statut: "ouvert",
    categorie: "Maintenance",
  },
  {
    id: "t5",
    titre: "Création compte email nouveau stagiaire",
    description: "Créer un compte email pour le stagiaire arrivant le 21/07",
    demandeur: "Sandrine T. KINI",
    dateCreation: "2025-07-14",
    priorite: "haute",
    statut: "en_cours",
    categorie: "Informatique",
  },
];

const courriersArrive: CourrierArrive[] = [
  {
    id: "ca1",
    reference: "CA-2025-0142",
    expediteur: "Ministère de l'Économie",
    objet: "Convocation à la réunion de coordination budgétaire 2025",
    dateReception: "2025-07-14",
    dateEnvoi: "2025-07-11",
    statut: "urgent",
    priorite: "urgent",
    destinataire: "YAYA Ouattara",
    nature: "Convocation",
  },
  {
    id: "ca2",
    reference: "CA-2025-0141",
    expediteur: "BCEAO Ouagadougou",
    objet: "Notification de mise à jour des procédures de conformité bancaire",
    dateReception: "2025-07-13",
    dateEnvoi: "2025-07-10",
    statut: "en_attente",
    priorite: "confidentiel",
    destinataire: "Aminata HEMA",
    nature: "Notification",
  },
  {
    id: "ca3",
    reference: "CA-2025-0140",
    expediteur: "ANPTIC",
    objet: "Approbation de la demande d'agrément numérique N°2025-847",
    dateReception: "2025-07-12",
    dateEnvoi: "2025-07-08",
    statut: "traite",
    priorite: "normal",
    destinataire: "Sandrine T. KINI",
    nature: "Décision",
  },
  {
    id: "ca4",
    reference: "CA-2025-0139",
    expediteur: "Client ALPHA SARL",
    objet: "Demande de renouvellement contrat de maintenance annuelle",
    dateReception: "2025-07-10",
    dateEnvoi: "2025-07-09",
    statut: "en_attente",
    priorite: "normal",
    destinataire: "Roukiatou OUEDRAOGO",
    nature: "Demande",
  },
  {
    id: "ca5",
    reference: "CA-2025-0138",
    expediteur: "DGI Burkina Faso",
    objet: "Rappel déclaration fiscale trimestrielle — échéance 31 juillet",
    dateReception: "2025-07-09",
    dateEnvoi: "2025-07-07",
    statut: "en_attente",
    priorite: "urgent",
    destinataire: "Aminata HEMA",
    nature: "Rappel",
  },
  {
    id: "ca6",
    reference: "CA-2025-0137",
    expediteur: "CNSS Burkina",
    objet: "Attestation de cotisation sociale — 2ème trimestre 2025",
    dateReception: "2025-07-07",
    dateEnvoi: "2025-07-05",
    statut: "traite",
    priorite: "normal",
    destinataire: "Aminata HEMA",
    nature: "Attestation",
  },
];

const courriersSortants: CourrierSortant[] = [
  {
    id: "cs1",
    reference: "CS-2025-0098",
    destinataire: "Ministère de l'Économie",
    objet:
      "Réponse à la convocation budgétaire — confirmation de participation",
    dateEnvoi: "2025-07-14",
    expediteur: "YAYA Ouattara",
    statut: "traite",
    nature: "Réponse",
    copie: "Sandrine T. KINI",
  },
  {
    id: "cs2",
    reference: "CS-2025-0097",
    destinataire: "Client BETA Industries",
    objet: "Proposition commerciale — solution ERP intégrée 2025",
    dateEnvoi: "2025-07-13",
    expediteur: "Roukiatou OUEDRAOGO",
    statut: "traite",
    nature: "Proposition",
  },
  {
    id: "cs3",
    reference: "CS-2025-0096",
    destinataire: "ONEA",
    objet: "Demande de partenariat pour projet de digitalisation",
    dateEnvoi: "2025-07-12",
    expediteur: "YAYA Ouattara",
    statut: "en_attente",
    nature: "Demande",
    copie: "Sandrine T. KINI",
  },
  {
    id: "cs4",
    reference: "CS-2025-0095",
    destinataire: "Cabinet Juridique SOMA",
    objet: "Transmission des documents contractuels — dossier prestataire",
    dateEnvoi: "2025-07-10",
    expediteur: "Aminata HEMA",
    statut: "traite",
    nature: "Transmission",
  },
  {
    id: "cs5",
    reference: "CS-2025-0094",
    destinataire: "Mairie de Ouagadougou",
    objet: "Demande d'autorisation d'occupation temporaire des locaux",
    dateEnvoi: "2025-07-09",
    expediteur: "Sandrine T. KINI",
    statut: "en_attente",
    nature: "Demande",
  },
];

const etatsFinanciers: EtatFinancier[] = [
  {
    id: "ef1",
    intitule: "Budget de fonctionnement",
    periode: "S1 2025",
    montantPrevu: 45000000,
    montantRealise: 38750000,
    ecart: -6250000,
    tauxExecution: 86.1,
    categorie: "depenses",
    statut: "valide",
  },
  {
    id: "ef2",
    intitule: "Chiffre d'affaires",
    periode: "S1 2025",
    montantPrevu: 120000000,
    montantRealise: 134500000,
    ecart: 14500000,
    tauxExecution: 112.1,
    categorie: "recettes",
    statut: "valide",
  },
  {
    id: "ef3",
    intitule: "Budget d'investissement",
    periode: "S1 2025",
    montantPrevu: 25000000,
    montantRealise: 18200000,
    ecart: -6800000,
    tauxExecution: 72.8,
    categorie: "investissement",
    statut: "en_revision",
  },
  {
    id: "ef4",
    intitule: "Charges salariales",
    periode: "S1 2025",
    montantPrevu: 28000000,
    montantRealise: 27350000,
    ecart: -650000,
    tauxExecution: 97.7,
    categorie: "depenses",
    statut: "valide",
  },
  {
    id: "ef5",
    intitule: "Recettes prestations",
    periode: "Q2 2025",
    montantPrevu: 60000000,
    montantRealise: 71200000,
    ecart: 11200000,
    tauxExecution: 118.7,
    categorie: "recettes",
    statut: "en_cours",
  },
  {
    id: "ef6",
    intitule: "Achats matériels IT",
    periode: "Q2 2025",
    montantPrevu: 8500000,
    montantRealise: 6100000,
    ecart: -2400000,
    tauxExecution: 71.8,
    categorie: "investissement",
    statut: "en_cours",
  },
];

const stagiaires: Stagiaire[] = [
  {
    id: "s1",
    nom: "KABORE",
    prenom: "Fati",
    avatar: "/assets/team/sandrine.jpg",
    etablissement: "Université Ouaga II",
    filiere: "Informatique de Gestion",
    niveauEtude: "Licence 3",
    encadrant: "SERGE GEDEON OUE",
    dateDebut: "2025-06-02",
    dateFin: "2025-08-29",
    statut: "en_cours",
    sujet: "Développement d'un module de gestion des stocks en temps réel",
  },
  {
    id: "s2",
    nom: "TRAORE",
    prenom: "Moussa",
    avatar: "/assets/team/daouda.jpg",
    etablissement: "ISGE Ouagadougou",
    filiere: "Finance & Comptabilité",
    niveauEtude: "Master 1",
    encadrant: "Aminata HEMA",
    dateDebut: "2025-07-07",
    dateFin: "2025-09-26",
    statut: "en_cours",
    sujet: "Analyse de la performance financière et tableau de bord de gestion",
  },
  {
    id: "s3",
    nom: "OUEDRAOGO",
    prenom: "Awa",
    avatar: "/assets/team/victorine.jpg",
    etablissement: "ESTM",
    filiere: "Marketing Digital",
    niveauEtude: "BTS 2",
    encadrant: "Roukiatou OUEDRAOGO",
    dateDebut: "2025-04-01",
    dateFin: "2025-06-30",
    statut: "termine",
    sujet: "Stratégie de présence sur les réseaux sociaux pour une PME tech",
    note: 16.5,
  },
  {
    id: "s4",
    nom: "ZONGO",
    prenom: "Hermann",
    avatar: "/assets/team/Martin.jpg",
    etablissement: "2iE Ouagadougou",
    filiere: "Génie Informatique",
    niveauEtude: "Master 2",
    encadrant: "SERGE GEDEON OUE",
    dateDebut: "2025-09-01",
    dateFin: "2025-12-31",
    statut: "a_venir",
    sujet: "Architecture microservices et mise en place d'un pipeline CI/CD",
  },
];

const depensesMarche: DepenseMarche[] = [
  {
    id: "dm1",
    reference: "MRC-2025-018",
    intitule: "Acquisition serveurs cloud haute disponibilité",
    fournisseur: "DATATECH SARL",
    categorie: "equipement",
    montantHT: 12500000,
    tva: 2250000,
    montantTTC: 14750000,
    dateBon: "2025-07-01",
    dateEcheance: "2025-07-31",
    statut: "en_attente",
    description: "2 serveurs Dell PowerEdge R750 + licences VMware 3 ans",
    responsable: "SERGE GEDEON OUE",
  },
  {
    id: "dm2",
    reference: "MRC-2025-017",
    intitule: "Prestation de nettoyage et maintenance locaux",
    fournisseur: "PROPRETE PLUS BF",
    categorie: "prestation",
    montantHT: 1800000,
    tva: 324000,
    montantTTC: 2124000,
    dateBon: "2025-06-01",
    dateEcheance: "2025-06-30",
    statut: "paye",
    description: "Nettoyage quotidien + maintenance mensuelle — Juin 2025",
    responsable: "Sandrine T. KINI",
  },
  {
    id: "dm3",
    reference: "MRC-2025-016",
    intitule: "Fournitures et consommables de bureau",
    fournisseur: "BUREAU PLUS AFRIQUE",
    categorie: "fournitures",
    montantHT: 650000,
    tva: 117000,
    montantTTC: 767000,
    dateBon: "2025-06-15",
    dateEcheance: "2025-07-15",
    statut: "paye",
    description:
      "Papier A4, cartouches, stylos, classeurs et fournitures diverses",
    responsable: "Victorine BAZEMO",
  },
  {
    id: "dm4",
    reference: "MRC-2025-015",
    intitule: "Travaux de rénovation bureau direction",
    fournisseur: "BATIK CONSTRUCTION",
    categorie: "travaux",
    montantHT: 4200000,
    tva: 756000,
    montantTTC: 4956000,
    dateBon: "2025-05-20",
    dateEcheance: "2025-06-20",
    statut: "en_litige",
    description: "Peinture, faux-plafond et revêtement de sol bureau DG",
    responsable: "Sandrine T. KINI",
  },
  {
    id: "dm5",
    reference: "MRC-2025-014",
    intitule: "Licences Microsoft Office 365 Business",
    fournisseur: "MICROSYS BURKINA",
    categorie: "equipement",
    montantHT: 2800000,
    tva: 504000,
    montantTTC: 3304000,
    dateBon: "2025-07-10",
    dateEcheance: "2025-08-10",
    statut: "en_attente",
    description: "10 licences Microsoft 365 Business Premium — 1 an",
    responsable: "SERGE GEDEON OUE",
  },
  {
    id: "dm6",
    reference: "MRC-2025-013",
    intitule: "Formation certifiante cybersécurité équipe technique",
    fournisseur: "INFOSEC ACADEMY BF",
    categorie: "prestation",
    montantHT: 3500000,
    tva: 630000,
    montantTTC: 4130000,
    dateBon: "2025-07-05",
    dateEcheance: "2025-07-25",
    statut: "paye",
    description: "Formation CompTIA Security+ pour 3 ingénieurs — 5 jours",
    responsable: "SERGE GEDEON OUE",
  },
];

// ─── UTILITAIRES ─────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMontant(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(n);
}

const statutCongeConfig: Record<
  StatutConge,
  { label: string; couleur: string; bg: string; icone: React.ElementType }
> = {
  approuve: {
    label: "Approuvé",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50",
    icone: CheckCircle2,
  },
  en_attente: {
    label: "En attente",
    couleur: "text-amber-700",
    bg: "bg-amber-50",
    icone: Timer,
  },
  refuse: {
    label: "Refusé",
    couleur: "text-red-700",
    bg: "bg-red-50",
    icone: XCircle,
  },
};

const statutDocConfig: Record<
  StatutDocument,
  { label: string; couleur: string; bg: string }
> = {
  valide: { label: "Validé", couleur: "text-emerald-700", bg: "bg-emerald-50" },
  en_revision: {
    label: "En révision",
    couleur: "text-blue-700",
    bg: "bg-blue-50",
  },
  brouillon: {
    label: "Brouillon",
    couleur: "text-slate-600",
    bg: "bg-slate-100",
  },
  expire: { label: "Expiré", couleur: "text-red-700", bg: "bg-red-50" },
};

const statutPresenceConfig: Record<
  string,
  { label: string; couleur: string; bg: string; point: string }
> = {
  present: {
    label: "Présent",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50",
    point: "bg-emerald-500",
  },
  conge: {
    label: "En congé",
    couleur: "text-blue-700",
    bg: "bg-blue-50",
    point: "bg-blue-500",
  },
  mission: {
    label: "En mission",
    couleur: "text-amber-700",
    bg: "bg-amber-50",
    point: "bg-amber-500",
  },
  absent: {
    label: "Absent",
    couleur: "text-red-700",
    bg: "bg-red-50",
    point: "bg-red-500",
  },
};

const typeEvenementConfig: Record<
  string,
  { couleur: string; bg: string; icone: React.ElementType }
> = {
  reunion: { couleur: "text-blue-700", bg: "bg-blue-50", icone: Users },
  formation: {
    couleur: "text-purple-700",
    bg: "bg-purple-50",
    icone: ClipboardList,
  },
  evenement: { couleur: "text-pink-700", bg: "bg-pink-50", icone: Star },
  deadline: { couleur: "text-red-700", bg: "bg-red-50", icone: AlertTriangle },
};

const prioriteConfig: Record<
  PrioriteTicket,
  { label: string; couleur: string; bg: string }
> = {
  haute: { label: "Haute", couleur: "text-red-700", bg: "bg-red-50" },
  moyenne: { label: "Moyenne", couleur: "text-amber-700", bg: "bg-amber-50" },
  basse: { label: "Basse", couleur: "text-emerald-700", bg: "bg-emerald-50" },
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

const statutCourrierConfig: Record<
  StatutCourrier,
  { label: string; couleur: string; bg: string; bordure: string }
> = {
  traite: {
    label: "Traité",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50",
    bordure: "border-emerald-200",
  },
  en_attente: {
    label: "En attente",
    couleur: "text-amber-700",
    bg: "bg-amber-50",
    bordure: "border-amber-200",
  },
  archive: {
    label: "Archivé",
    couleur: "text-slate-600",
    bg: "bg-slate-100",
    bordure: "border-slate-200",
  },
  urgent: {
    label: "Urgent",
    couleur: "text-red-700",
    bg: "bg-red-50",
    bordure: "border-red-200",
  },
};

const prioriteCourrierConfig: Record<
  string,
  { label: string; couleur: string; bg: string }
> = {
  normal: { label: "Normal", couleur: "text-slate-600", bg: "bg-slate-100" },
  urgent: { label: "Urgent", couleur: "text-red-700", bg: "bg-red-50" },
  confidentiel: {
    label: "Confidentiel",
    couleur: "text-purple-700",
    bg: "bg-purple-50",
  },
};

const categorieFinConfig: Record<
  string,
  { label: string; couleur: string; bg: string; icone: React.ElementType }
> = {
  recettes: {
    label: "Recettes",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50",
    icone: TrendingUp,
  },
  depenses: {
    label: "Dépenses",
    couleur: "text-red-700",
    bg: "bg-red-50",
    icone: TrendingDown,
  },
  investissement: {
    label: "Investissement",
    couleur: "text-blue-700",
    bg: "bg-blue-50",
    icone: Target,
  },
};

const statutStageConfig: Record<
  StatutStage,
  { label: string; couleur: string; bg: string; point: string }
> = {
  en_cours: {
    label: "En cours",
    couleur: "text-blue-700",
    bg: "bg-blue-50",
    point: "bg-blue-500",
  },
  termine: {
    label: "Terminé",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50",
    point: "bg-emerald-500",
  },
  a_venir: {
    label: "À venir",
    couleur: "text-purple-700",
    bg: "bg-purple-50",
    point: "bg-purple-500",
  },
  annule: {
    label: "Annulé",
    couleur: "text-red-700",
    bg: "bg-red-50",
    point: "bg-red-500",
  },
};

const categorieDepenseConfig: Record<
  CategorieDepense,
  { label: string; couleur: string; bg: string; icone: React.ElementType }
> = {
  fournitures: {
    label: "Fournitures",
    couleur: "text-blue-700",
    bg: "bg-blue-50",
    icone: Package,
  },
  prestation: {
    label: "Prestation",
    couleur: "text-purple-700",
    bg: "bg-purple-50",
    icone: Briefcase,
  },
  travaux: {
    label: "Travaux",
    couleur: "text-orange-700",
    bg: "bg-orange-50",
    icone: Building,
  },
  equipement: {
    label: "Équipement",
    couleur: "text-cyan-700",
    bg: "bg-cyan-50",
    icone: Layers,
  },
  autre: {
    label: "Autre",
    couleur: "text-slate-600",
    bg: "bg-slate-100",
    icone: MoreHorizontal,
  },
};

const statutDepenseConfig: Record<
  StatutDepense,
  { label: string; couleur: string; bg: string }
> = {
  paye: { label: "Payé", couleur: "text-emerald-700", bg: "bg-emerald-50" },
  en_attente: {
    label: "En attente",
    couleur: "text-amber-700",
    bg: "bg-amber-50",
  },
  en_litige: { label: "En litige", couleur: "text-red-700", bg: "bg-red-50" },
  annule: { label: "Annulé", couleur: "text-slate-600", bg: "bg-slate-100" },
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

// ─── NAVIGATION ──────────────────────────────────────────────

type OngletId =
  | "tableau_bord"
  | "employes"
  | "conges"
  | "documents"
  | "tickets"
  | "calendrier"
  | "courrier_arrive"
  | "courrier_sortant"
  | "etats_financiers"
  | "stages"
  | "depenses_marche";

type GroupeNav = {
  label: string;
  items: { id: OngletId; label: string; icone: React.ElementType }[];
};

const groupesNav: GroupeNav[] = [
  {
    label: "Tableau de bord",
    items: [{ id: "tableau_bord", label: "Vue d'ensemble", icone: Home }],
  },
  {
    label: "Ressources Humaines",
    items: [
      { id: "employes", label: "Collaborateurs", icone: Users },
      { id: "conges", label: "Congés", icone: Calendar },
      { id: "stages", label: "Stages", icone: GraduationCap },
    ],
  },
  {
    label: "Courrier",
    items: [
      { id: "courrier_arrive", label: "Courrier arrivé", icone: Inbox },
      { id: "courrier_sortant", label: "Courrier sortant", icone: Send },
    ],
  },
  {
    label: "Finance & Marchés",
    items: [
      { id: "etats_financiers", label: "États financiers", icone: BarChart3 },
      { id: "depenses_marche", label: "Dépenses marchés", icone: ShoppingCart },
    ],
  },
  {
    label: "Gestion",
    items: [
      { id: "documents", label: "Documents", icone: FolderOpen },
      { id: "tickets", label: "Demandes", icone: MessageSquare },
      { id: "calendrier", label: "Calendrier", icone: CalendarDays },
    ],
  },
];

// ════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ════════════════════════════════════════════════════════════

export default function AdministrationComptabilite() {
  const [ongletActif, setOngletActif] = useState<OngletId>("tableau_bord");
  const [recherche, setRecherche] = useState("");
  const [notifOuverte, setNotifOuverte] = useState(false);
  const [employeSelectionne, setEmployeSelectionne] = useState<Employe | null>(
    null,
  );
  const [filtreDirection, setFiltreDirection] = useState("Toutes");
  const [filtreStatutConge, setFiltreStatutConge] = useState<
    "tous" | StatutConge
  >("tous");
  const [filtreStatutTicket, setFiltreStatutTicket] = useState<
    "tous" | StatutTicket
  >("tous");
  const [filtreCategorieFin, setFiltreCategorieFin] = useState<"tous" | string>(
    "tous",
  );
  const [filtreStatutDepense, setFiltreStatutDepense] = useState<
    "tous" | StatutDepense
  >("tous");

  const notifsNonLues = notifications.filter((n) => !n.lue).length;

  const directionsUniques = [
    "Toutes",
    ...Array.from(new Set(employes.map((e) => e.direction))),
  ];

  const employesFiltres = useMemo(() => {
    let liste = employes;
    if (filtreDirection !== "Toutes")
      liste = liste.filter((e) => e.direction === filtreDirection);
    if (recherche.length > 1) {
      liste = liste.filter(
        (e) =>
          e.nom.toLowerCase().includes(recherche.toLowerCase()) ||
          e.poste.toLowerCase().includes(recherche.toLowerCase()) ||
          e.direction.toLowerCase().includes(recherche.toLowerCase()),
      );
    }
    return liste;
  }, [filtreDirection, recherche]);

  const congesFiltres = useMemo(() => {
    if (filtreStatutConge === "tous") return demandesConge;
    return demandesConge.filter((c) => c.statut === filtreStatutConge);
  }, [filtreStatutConge]);

  const ticketsFiltres = useMemo(() => {
    if (filtreStatutTicket === "tous") return tickets;
    return tickets.filter((t) => t.statut === filtreStatutTicket);
  }, [filtreStatutTicket]);

  const etatsFiltres = useMemo(() => {
    if (filtreCategorieFin === "tous") return etatsFinanciers;
    return etatsFinanciers.filter((e) => e.categorie === filtreCategorieFin);
  }, [filtreCategorieFin]);

  const depensesFiltres = useMemo(() => {
    if (filtreStatutDepense === "tous") return depensesMarche;
    return depensesMarche.filter((d) => d.statut === filtreStatutDepense);
  }, [filtreStatutDepense]);

  const stats = {
    totalEmployes: employes.length,
    presents: employes.filter((e) => e.statut === "present").length,
    enConge: employes.filter((e) => e.statut === "conge").length,
    enMission: employes.filter((e) => e.statut === "mission").length,
    absents: employes.filter((e) => e.statut === "absent").length,
    congesEnAttente: demandesConge.filter((c) => c.statut === "en_attente")
      .length,
    documentsValides: documentsAdmin.filter((d) => d.statut === "valide")
      .length,
    ticketsOuverts: tickets.filter(
      (t) => t.statut === "ouvert" || t.statut === "en_cours",
    ).length,
    courriersNonTraites: courriersArrive.filter(
      (c) => c.statut !== "traite" && c.statut !== "archive",
    ).length,
    courriersSortantsEnAttente: courriersSortants.filter(
      (c) => c.statut === "en_attente",
    ).length,
    stagiairesActifs: stagiaires.filter((s) => s.statut === "en_cours").length,
    depensesEnAttente: depensesMarche.filter((d) => d.statut === "en_attente")
      .length,
    totalDepensesPayees: depensesMarche
      .filter((d) => d.statut === "paye")
      .reduce((s, d) => s + d.montantTTC, 0),
    totalCA: etatsFinanciers
      .filter((e) => e.categorie === "recettes")
      .reduce((s, e) => s + e.montantRealise, 0),
  };

  const ongletLabel =
    groupesNav.flatMap((g) => g.items).find((o) => o.id === ongletActif)
      ?.label ?? "";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans">
      {/* ══════ SIDEBAR ══════ */}
      <aside className="sticky top-0 flex h-screen w-64 flex-shrink-0 flex-col overflow-hidden border-r border-slate-200/80  shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-lg shadow-violet-200">
            <Landmark size={17} className="text-white" />
            <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900">
              Administration
            </h1>
            <p className="text-[10px] font-medium text-slate-400">
              IKA Solution — Intranet
            </p>
          </div>
        </div>

        {/* Navigation groupée */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {groupesNav.map((groupe) => (
            <div key={groupe.label}>
              <p className="mb-1 px-3 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                {groupe.label}
              </p>
              <div className="space-y-0.5">
                {groupe.items.map((item) => {
                  const Icone = item.icone;
                  const actif = ongletActif === item.id;
                  const badge =
                    item.id === "conges"
                      ? stats.congesEnAttente
                      : item.id === "tickets"
                        ? stats.ticketsOuverts
                        : item.id === "courrier_arrive"
                          ? stats.courriersNonTraites
                          : item.id === "depenses_marche"
                            ? stats.depensesEnAttente
                            : 0;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setOngletActif(item.id)}
                      className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all duration-150 ${
                        actif
                          ? "bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 shadow-sm ring-1 ring-violet-200/60"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-all ${actif ? "bg-violet-100" : "group-hover:bg-slate-100"}`}
                      >
                        <Icone
                          size={13}
                          className={
                            actif
                              ? "text-violet-600"
                              : "text-slate-400 group-hover:text-slate-600"
                          }
                        />
                      </div>
                      <span className="flex-1 truncate">{item.label}</span>
                      {badge > 0 && (
                        <span
                          className={`flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1 text-[9px] font-black ${
                            actif
                              ? "bg-violet-200 text-violet-800"
                              : "bg-red-100 text-red-700"
                          }`}
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

      {/* ══════ CONTENU PRINCIPAL ══════ */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* ══════ CONTENU ══════ */}
        <main className="flex-1 p-6">
          {/* ════ TABLEAU DE BORD ════ */}
          {ongletActif === "tableau_bord" && (
            <div className="space-y-6">
              {/* KPI row 1 */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  {
                    label: "Dépenses payées",
                    valeur: formatMontant(stats.totalDepensesPayees),
                    icone: CreditCard,
                    sous: "marchés soldés",
                    sousCouleur: "text-rose-600",
                  },
                  {
                    label: "Courriers en attente",
                    valeur: String(stats.courriersNonTraites),
                    icone: Inbox,
                    gradient: "from-amber-500 to-orange-600",
                    sous: "à traiter",
                    sousCouleur: "text-amber-600",
                  },
                  {
                    label: "Stagiaires actifs",
                    valeur: String(stats.stagiairesActifs),
                    icone: GraduationCap,
                    gradient: "from-violet-500 to-purple-600",
                    sous: "en formation",
                    sousCouleur: "text-violet-600",
                  },
                ].map((stat, i) => {
                  const SIcon = stat.icone;
                  return (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div
                        className={`absolute -right-5 -top-5 h-24 w-24 rounded-full ${stat.bg} opacity-40 transition-transform duration-500 group-hover:scale-150`}
                      />
                      <div className="relative">
                        <div
                          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}
                        >
                          <SIcon size={17} className="text-white" />
                        </div>
                        <p className="text-xl font-black text-slate-900 leading-none">
                          {stat.valeur}
                        </p>
                        <p className="mt-1.5 text-xs font-bold text-slate-600">
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

              {/* KPI row 2 */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  {
                    label: "Collaborateurs",
                    valeur: stats.totalEmployes,
                    icone: Users,
                    couleur: "text-indigo-600",
                    gradient: "from-indigo-500 to-blue-600",
                    sous: `${stats.presents} présents`,
                  },
                  {
                    label: "Congés en attente",
                    valeur: stats.congesEnAttente,
                    icone: Calendar,
                    couleur: "text-amber-600",
                    gradient: "from-amber-500 to-orange-500",
                    sous: "à valider",
                  },
                  {
                    label: "Marchés en attente",
                    valeur: stats.depensesEnAttente,
                    icone: ShoppingCart,
                    couleur: "text-cyan-600",
                    gradient: "from-cyan-500 to-blue-500",
                    sous: "bons à approuver",
                  },
                  {
                    label: "Demandes ouvertes",
                    valeur: stats.ticketsOuverts,
                    icone: MessageSquare,
                    couleur: "text-rose-600",
                    gradient: "from-rose-500 to-pink-500",
                    sous: "à traiter",
                  },
                ].map((stat, i) => {
                  const SIcon = stat.icone;
                  return (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200/80  p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm`}
                        >
                          <SIcon size={15} className="text-white" />
                        </div>
                        <div>
                          <p className="text-xl font-black text-slate-900 leading-none">
                            {stat.valeur}
                          </p>
                          <p className="text-[10px] font-bold text-slate-500">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`mt-2 text-[10px] font-semibold ${stat.couleur}`}
                      >
                        {stat.sous}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Grille 3 colonnes */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Présences */}
                <div className="rounded-2xl border border-slate-200/80  shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-violet-500" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Présence du jour
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-700">
                        En direct
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-4 flex h-2.5 overflow-hidden rounded-full">
                      {[
                        {
                          w: (stats.presents / stats.totalEmployes) * 100,
                          c: "bg-emerald-400",
                        },
                        {
                          w: (stats.enConge / stats.totalEmployes) * 100,
                          c: "bg-blue-400",
                        },
                        {
                          w: (stats.enMission / stats.totalEmployes) * 100,
                          c: "bg-amber-400",
                        },
                        {
                          w: (stats.absents / stats.totalEmployes) * 100,
                          c: "bg-red-400",
                        },
                      ].map((seg, i) => (
                        <div
                          key={i}
                          className={`${seg.c} transition-all`}
                          style={{ width: `${seg.w}%` }}
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      {Object.entries(statutPresenceConfig).map(
                        ([statut, cfg]) => {
                          const count = employes.filter(
                            (e) => e.statut === statut,
                          ).length;
                          return (
                            <div
                              key={statut}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2.5 w-2.5 rounded-full ${cfg.point}`}
                                />
                                <span className="text-xs font-medium text-slate-600">
                                  {cfg.label}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-slate-900">
                                {count}
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Présents
                      </p>
                      <div className="flex -space-x-2">
                        {employes
                          .filter((e) => e.statut === "present")
                          .map((e) => (
                            <div
                              key={e.id}
                              className="h-7 w-7 overflow-hidden rounded-full border-2 border-white shadow-sm"
                              title={e.nom}
                            >
                              <img
                                src={e.avatar}
                                alt={e.nom}
                                className="h-full w-full object-cover object-top"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Courriers récents */}
                <div className="rounded-2xl border border-slate-200/80  shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Inbox size={14} className="text-violet-500" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Courriers récents
                      </h3>
                    </div>
                    <button
                      onClick={() => setOngletActif("courrier_arrive")}
                      className="text-[10px] font-bold text-violet-600 hover:text-violet-800"
                    >
                      Voir tout →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {courriersArrive.slice(0, 4).map((c) => {
                      const sCfg = statutCourrierConfig[c.statut];
                      return (
                        <div
                          key={c.id}
                          className="flex items-start gap-3 px-5 py-3"
                        >
                          <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${sCfg.bg}`}
                          >
                            <Inbox size={12} className={sCfg.couleur} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-slate-900">
                              {c.expediteur}
                            </p>
                            <p className="truncate text-[10px] text-slate-400">
                              {c.objet}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${sCfg.bg} ${sCfg.couleur}`}
                          >
                            {sCfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dépenses récentes */}
                <div className="rounded-2xl border border-slate-200/80  shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={14} className="text-violet-500" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Marchés récents
                      </h3>
                    </div>
                    <button
                      onClick={() => setOngletActif("depenses_marche")}
                      className="text-[10px] font-bold text-violet-600 hover:text-violet-800"
                    >
                      Voir tout →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {depensesMarche.slice(0, 4).map((d) => {
                      const sCfg = statutDepenseConfig[d.statut];
                      const cCfg = categorieDepenseConfig[d.categorie];
                      return (
                        <div
                          key={d.id}
                          className="flex items-center gap-3 px-5 py-3"
                        >
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cCfg.bg}`}
                          >
                            <cCfg.icone size={12} className={cCfg.couleur} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-slate-900">
                              {d.intitule}
                            </p>
                            <p className="text-[10px] font-semibold text-slate-500">
                              {formatMontant(d.montantTTC)}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${sCfg.bg} ${sCfg.couleur}`}
                          >
                            {sCfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* États financiers aperçu */}
              <div className="rounded-2xl border border-slate-200/80  shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={14} className="text-violet-500" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Aperçu financier — S1 2025
                    </h3>
                  </div>
                  <button
                    onClick={() => setOngletActif("etats_financiers")}
                    className="text-[10px] font-bold text-violet-600 hover:text-violet-800"
                  >
                    Voir tout →
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-0 divide-y divide-slate-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {etatsFinanciers
                    .filter((e) => e.statut === "valide")
                    .slice(0, 3)
                    .map((ef) => {
                      const cfg = categorieFinConfig[ef.categorie];
                      const excedent = ef.ecart >= 0;
                      return (
                        <div key={ef.id} className="p-5">
                          <div className="mb-3 flex items-center gap-2">
                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-lg ${cfg.bg}`}
                            >
                              <cfg.icone size={13} className={cfg.couleur} />
                            </div>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${cfg.couleur}`}
                            >
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-600">
                            {ef.intitule}
                          </p>
                          <p className="mt-1 text-lg font-black text-slate-900">
                            {formatMontant(ef.montantRealise)}
                          </p>
                          <div className="mt-2 flex items-center gap-1">
                            {excedent ? (
                              <ArrowUpRight
                                size={13}
                                className="text-emerald-600"
                              />
                            ) : (
                              <ArrowDownRight
                                size={13}
                                className="text-red-500"
                              />
                            )}
                            <span
                              className={`text-[10px] font-bold ${excedent ? "text-emerald-600" : "text-red-500"}`}
                            >
                              {formatMontant(Math.abs(ef.ecart))} vs prévu
                            </span>
                          </div>
                          {/* Barre taux */}
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full `}
                              style={{
                                width: `${Math.min(ef.tauxExecution, 100)}%`,
                              }}
                            />
                          </div>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {ef.tauxExecution}% d'exécution
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ════ COLLABORATEURS ════ */}
          {ongletActif === "employes" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200  px-3 py-2 shadow-sm">
                  <Filter size={13} className="text-slate-400" />
                  <select
                    value={filtreDirection}
                    onChange={(e) => setFiltreDirection(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
                  >
                    {directionsUniques.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ml-auto text-xs text-slate-400">
                  {employesFiltres.length} résultat
                  {employesFiltres.length > 1 ? "s" : ""}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {employesFiltres.map((emp) => {
                  const sCfg = statutPresenceConfig[emp.statut];
                  return (
                    <div
                      key={emp.id}
                      onClick={() => setEmployeSelectionne(emp)}
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80  shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative bg-gradient-to-br from-violet-500 to-indigo-600 px-4 pb-10 pt-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/15" />
                        <div className="relative flex items-center justify-between">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${sCfg.bg} ${sCfg.couleur}`}
                          >
                            {sCfg.label}
                          </span>
                          <span className="rounded-full /20 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                            {emp.direction.replace("Direction ", "")}
                          </span>
                        </div>
                      </div>
                      <div className="relative -mt-8 flex justify-center">
                        <div className="relative rounded-full  p-1 shadow-md">
                          <div className="h-14 w-14 overflow-hidden rounded-full">
                            <img
                              src={emp.avatar}
                              alt={emp.nom}
                              className="h-full w-full object-cover object-top"
                            />
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${sCfg.point}`}
                          />
                        </div>
                      </div>
                      <div className="px-4 pb-4 pt-2 text-center">
                        <h4 className="text-sm font-bold text-slate-900">
                          {emp.nom}
                        </h4>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {emp.poste}
                        </p>
                        <div className="mt-3 flex items-center justify-center gap-2">
                          {[Mail, Phone, Eye].map((Icon, i) => (
                            <button
                              key={i}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-600"
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

          {/* ════ CONGÉS ════ */}
          {ongletActif === "conges" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {(["tous", "en_attente", "approuve", "refuse"] as const).map(
                  (filtre) => {
                    const actif = filtreStatutConge === filtre;
                    const label =
                      filtre === "tous"
                        ? "Tous"
                        : statutCongeConfig[filtre].label;
                    return (
                      <button
                        key={filtre}
                        onClick={() => setFiltreStatutConge(filtre)}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${actif ? "bg-violet-600 text-white shadow-lg shadow-violet-200" : "border border-slate-200  text-slate-500 hover:bg-slate-50"}`}
                      >
                        {label}
                        {filtre === "en_attente" &&
                          stats.congesEnAttente > 0 && (
                            <span
                              className={`ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${actif ? "/20 text-white" : "bg-amber-100 text-amber-700"}`}
                            >
                              {stats.congesEnAttente}
                            </span>
                          )}
                      </button>
                    );
                  },
                )}
              </div>
              <div className="space-y-3">
                {congesFiltres.map((c) => {
                  const sCfg = statutCongeConfig[c.statut];
                  const SIcon = sCfg.icone;
                  return (
                    <div
                      key={c.id}
                      className="group flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/80  p-5 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-100">
                        <img
                          src={c.employeAvatar}
                          alt={c.employeNom}
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900">
                          {c.employeNom}
                        </p>
                        <p className="text-xs text-slate-400">{c.type}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Période
                        </p>
                        <p className="text-xs font-semibold text-slate-700">
                          {formatDate(c.dateDebut)} → {formatDate(c.dateFin)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Durée
                        </p>
                        <p className="text-sm font-black text-slate-900">
                          {c.jours}j
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Motif
                        </p>
                        <p className="text-xs text-slate-600">{c.motif}</p>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${sCfg.bg}`}
                      >
                        <SIcon size={12} className={sCfg.couleur} />
                        <span className={`text-xs font-bold ${sCfg.couleur}`}>
                          {sCfg.label}
                        </span>
                      </div>
                      {c.statut === "en_attente" && (
                        <div className="flex items-center gap-2">
                          <button className="flex h-8 items-center gap-1.5 rounded-xl bg-emerald-50 px-3 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100">
                            <CheckCircle2 size={12} />
                            Approuver
                          </button>
                          <button className="flex h-8 items-center gap-1.5 rounded-xl bg-red-50 px-3 text-xs font-bold text-red-700 transition-colors hover:bg-red-100">
                            <XCircle size={12} />
                            Refuser
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ COURRIER ARRIVÉ ════ */}
          {ongletActif === "courrier_arrive" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-200 transition-all hover:bg-violet-700">
                  <Plus size={13} />
                  Enregistrer un courrier
                </button>
                <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
                  <Inbox size={13} />
                  {courriersArrive.length} courriers reçus
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200/80  shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60">
                        {[
                          "Référence",
                          "Expéditeur",
                          "Objet",
                          "Nature",
                          "Destinataire",
                          "Reçu le",
                          "Priorité",
                          "Statut",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {courriersArrive.map((c) => {
                        const sCfg = statutCourrierConfig[c.statut];
                        const pCfg = prioriteCourrierConfig[c.priorite];
                        return (
                          <tr
                            key={c.id}
                            className="group transition-colors hover:bg-violet-50/30"
                          >
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                                  <Hash size={11} className="text-violet-600" />
                                </div>
                                <span className="text-xs font-bold text-violet-700">
                                  {c.reference}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="text-xs font-semibold text-slate-900">
                                {c.expediteur}
                              </p>
                            </td>
                            <td className="max-w-xs px-4 py-3.5">
                              <p className="truncate text-xs text-slate-600">
                                {c.objet}
                              </p>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                {c.nature}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-600">
                              {c.destinataire}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500">
                              {formatDate(c.dateReception)}
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${pCfg.bg} ${pCfg.couleur}`}
                              >
                                {pCfg.label}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${sCfg.bg} ${sCfg.couleur}`}
                              >
                                {sCfg.label}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                {[Eye, Edit3, Archive].map((Icon, i) => (
                                  <button
                                    key={i}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Icon size={12} />
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ COURRIER SORTANT ════ */}
          {ongletActif === "courrier_sortant" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-200 transition-all hover:bg-violet-700">
                  <Plus size={13} />
                  Enregistrer un envoi
                </button>
                <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
                  <Send size={13} />
                  {courriersSortants.length} courriers envoyés
                </div>
              </div>
              <div className="space-y-3">
                {courriersSortants.map((c) => {
                  const sCfg = statutCourrierConfig[c.statut];
                  return (
                    <div
                      key={c.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200/80  shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center gap-4 p-5">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${sCfg.bg}`}
                        >
                          <Send size={15} className={sCfg.couleur} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-violet-700">
                              {c.reference}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                              {c.nature}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm font-bold text-slate-900">
                            {c.objet}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Destinataire
                          </p>
                          <p className="text-xs font-semibold text-slate-700">
                            {c.destinataire}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Expéditeur
                          </p>
                          <p className="text-xs font-semibold text-slate-700">
                            {c.expediteur}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Envoyé le
                          </p>
                          <p className="text-xs font-semibold text-slate-700">
                            {formatDate(c.dateEnvoi)}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${sCfg.bg}`}
                        >
                          <span className={`text-xs font-bold ${sCfg.couleur}`}>
                            {sCfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {[Eye, Printer, Archive].map((Icon, i) => (
                            <button
                              key={i}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Icon size={13} />
                            </button>
                          ))}
                        </div>
                      </div>
                      {c.copie && (
                        <div className="border-t border-slate-50 bg-slate-50/60 px-5 py-2">
                          <span className="text-[10px] text-slate-400">
                            CC :{" "}
                            <span className="font-semibold text-slate-600">
                              {c.copie}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ ÉTATS FINANCIERS ════ */}
          {ongletActif === "etats_financiers" && (
            <div className="space-y-5">
              {/* Résumé */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    cat: "recettes",
                    label: "Total Recettes",
                    icone: TrendingUp,
                    gradient: "from-emerald-500 to-teal-600",
                  },
                  {
                    cat: "depenses",
                    label: "Total Dépenses",
                    icone: TrendingDown,
                    gradient: "from-red-500 to-rose-600",
                  },
                  {
                    cat: "investissement",
                    label: "Investissements",
                    icone: Target,
                    gradient: "from-blue-500 to-indigo-600",
                  },
                ].map((row) => {
                  const total = etatsFinanciers
                    .filter((e) => e.categorie === row.cat)
                    .reduce((s, e) => s + e.montantRealise, 0);
                  const prevu = etatsFinanciers
                    .filter((e) => e.categorie === row.cat)
                    .reduce((s, e) => s + e.montantPrevu, 0);
                  const taux =
                    prevu > 0 ? ((total / prevu) * 100).toFixed(1) : "0";
                  const SIcon = row.icone;
                  return (
                    <div
                      key={row.cat}
                      className="overflow-hidden rounded-2xl border border-slate-200/80  shadow-sm"
                    >
                      <div
                        className={`bg-gradient-to-r ${row.gradient} px-5 py-4`}
                      >
                        <div className="flex items-center gap-2">
                          <SIcon size={15} className="text-white" />
                          <p className="text-xs font-bold text-white/90">
                            {row.label}
                          </p>
                        </div>
                        <p className="mt-1 text-xl font-black text-white">
                          {formatMontant(total)}
                        </p>
                      </div>
                      <div className="px-5 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            Taux d'exécution
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {taux}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${row.gradient}`}
                            style={{ width: `${Math.min(Number(taux), 100)}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400">
                          Prévu : {formatMontant(prevu)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Filtres */}
              <div className="flex flex-wrap gap-2">
                {(
                  ["tous", "recettes", "depenses", "investissement"] as const
                ).map((f) => {
                  const actif = filtreCategorieFin === f;
                  const label =
                    f === "tous" ? "Tous" : (categorieFinConfig[f]?.label ?? f);
                  return (
                    <button
                      key={f}
                      onClick={() => setFiltreCategorieFin(f)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${actif ? "bg-violet-600 text-white shadow-lg shadow-violet-200" : "border border-slate-200  text-slate-500 hover:bg-slate-50"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Tableau */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/80  shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60">
                        {[
                          "Intitulé",
                          "Période",
                          "Catégorie",
                          "Prévu",
                          "Réalisé",
                          "Écart",
                          "Taux",
                          "Statut",
                        ].map((h) => (
                          <th
                            key={h}
                            className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {etatsFiltres.map((ef) => {
                        const cfg = categorieFinConfig[ef.categorie];
                        const excedent = ef.ecart >= 0;
                        const statutCfg =
                          ef.statut === "valide"
                            ? {
                                label: "Validé",
                                couleur: "text-emerald-700",
                                bg: "bg-emerald-50",
                              }
                            : ef.statut === "en_revision"
                              ? {
                                  label: "En révision",
                                  couleur: "text-blue-700",
                                  bg: "bg-blue-50",
                                }
                              : {
                                  label: "En cours",
                                  couleur: "text-amber-700",
                                  bg: "bg-amber-50",
                                };
                        return (
                          <tr
                            key={ef.id}
                            className="group transition-colors hover:bg-violet-50/20"
                          >
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}
                                >
                                  <cfg.icone
                                    size={12}
                                    className={cfg.couleur}
                                  />
                                </div>
                                <p className="text-xs font-bold text-slate-900">
                                  {ef.intitule}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-500">
                              {ef.periode}
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${cfg.bg} ${cfg.couleur}`}
                              >
                                {cfg.label}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-xs font-semibold text-slate-700">
                              {formatMontant(ef.montantPrevu)}
                            </td>
                            <td className="px-4 py-3.5 text-xs font-bold text-slate-900">
                              {formatMontant(ef.montantRealise)}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1">
                                {excedent ? (
                                  <ArrowUpRight
                                    size={12}
                                    className="text-emerald-600"
                                  />
                                ) : (
                                  <ArrowDownRight
                                    size={12}
                                    className="text-red-500"
                                  />
                                )}
                                <span
                                  className={`text-xs font-bold ${excedent ? "text-emerald-700" : "text-red-700"}`}
                                >
                                  {formatMontant(Math.abs(ef.ecart))}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className={`h-full rounded-full ${ef.tauxExecution >= 100 ? "bg-emerald-400" : "bg-violet-400"}`}
                                    style={{
                                      width: `${Math.min(ef.tauxExecution, 100)}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-slate-700">
                                  {ef.tauxExecution}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statutCfg.bg} ${statutCfg.couleur}`}
                              >
                                {statutCfg.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ STAGES ════ */}
          {ongletActif === "stages" && (
            <div className="space-y-5">
              {/* Résumé */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { statut: "en_cours", icone: BookOpen },
                  { statut: "termine", icone: CheckSquare },
                  { statut: "a_venir", icone: Timer },
                  { statut: "annule", icone: XCircle },
                ].map((row) => {
                  const cfg = statutStageConfig[row.statut as StatutStage];
                  const count = stagiaires.filter(
                    (s) => s.statut === row.statut,
                  ).length;
                  const SIcon = row.icone;
                  return (
                    <div
                      key={row.statut}
                      className={`rounded-2xl border p-4 ${cfg.bg} border-opacity-50`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${cfg.point}`}
                        />
                        <span className={`text-xs font-bold ${cfg.couleur}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="mt-2 text-2xl font-black text-slate-900">
                        {count}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        stagiaire{count > 1 ? "s" : ""}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-200 transition-all hover:bg-violet-700">
                  <Plus size={13} />
                  Nouveau stagiaire
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {stagiaires.map((s) => {
                  const sCfg = statutStageConfig[s.statut];
                  const dureeMs =
                    new Date(s.dateFin).getTime() -
                    new Date(s.dateDebut).getTime();
                  const ecouleeMs =
                    Date.now() - new Date(s.dateDebut).getTime();
                  const progression =
                    s.statut === "termine"
                      ? 100
                      : s.statut === "a_venir"
                        ? 0
                        : Math.min(
                            Math.max((ecouleeMs / dureeMs) * 100, 0),
                            100,
                          );
                  return (
                    <div
                      key={s.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200/80  shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-4 p-5">
                        <div className="relative shrink-0">
                          <div className="h-14 w-14 overflow-hidden rounded-2xl shadow-sm">
                            <img
                              src={s.avatar}
                              alt={`${s.prenom} ${s.nom}`}
                              className="h-full w-full object-cover object-top"
                            />
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${sCfg.point}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">
                                {s.prenom} {s.nom}
                              </h4>
                              <p className="text-[11px] text-slate-500">
                                {s.filiere} · {s.niveauEtude}
                              </p>
                              <p className="text-[11px] font-semibold text-violet-600">
                                {s.etablissement}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${sCfg.bg} ${sCfg.couleur}`}
                              >
                                {sCfg.label}
                              </span>
                              {s.note && (
                                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                  ⭐ {s.note}/20
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-slate-50 bg-slate-50/50 px-5 py-3">
                        <p className="mb-2 text-[10px] font-bold text-slate-600 line-clamp-2">
                          {s.sujet}
                        </p>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5">
                            <User size={10} className="text-slate-400" />
                            <span className="text-[10px] text-slate-500">
                              Encadrant :{" "}
                              <span className="font-semibold">
                                {s.encadrant}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CalendarDays
                              size={10}
                              className="text-slate-400"
                            />
                            <span className="text-[10px] text-slate-500">
                              {formatDate(s.dateDebut)} →{" "}
                              {formatDate(s.dateFin)}
                            </span>
                          </div>
                        </div>
                        {s.statut === "en_cours" && (
                          <div className="mt-2">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400">
                                Progression
                              </span>
                              <span className="text-[10px] font-bold text-violet-600">
                                {progression.toFixed(0)}%
                              </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-500"
                                style={{ width: `${progression}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ DÉPENSES MARCHÉS ════ */}
          {ongletActif === "depenses_marche" && (
            <div className="space-y-5">
              {/* Résumé */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { statut: "paye" as StatutDepense, icone: CheckCircle2 },
                  { statut: "en_attente" as StatutDepense, icone: Timer },
                  {
                    statut: "en_litige" as StatutDepense,
                    icone: AlertTriangle,
                  },
                  { statut: "annule" as StatutDepense, icone: XCircle },
                ].map((row) => {
                  const cfg = statutDepenseConfig[row.statut];
                  const items = depensesMarche.filter(
                    (d) => d.statut === row.statut,
                  );
                  const total = items.reduce((s, d) => s + d.montantTTC, 0);
                  const SIcon = row.icone;
                  return (
                    <div
                      key={row.statut}
                      className={`rounded-2xl border border-slate-200/80  p-4 shadow-sm`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${cfg.bg}`}
                        >
                          <SIcon size={13} className={cfg.couleur} />
                        </div>
                        <span className={`text-xs font-bold ${cfg.couleur}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="mt-2 text-lg font-black text-slate-900">
                        {items.length}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500">
                        {formatMontant(total)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Filtres + action */}
              <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-200 transition-all hover:bg-violet-700">
                  <Plus size={13} />
                  Nouveau bon de commande
                </button>
                <div className="ml-4 flex flex-wrap gap-2">
                  {(
                    [
                      "tous",
                      "paye",
                      "en_attente",
                      "en_litige",
                      "annule",
                    ] as const
                  ).map((f) => {
                    const actif = filtreStatutDepense === f;
                    const label =
                      f === "tous" ? "Tous" : statutDepenseConfig[f].label;
                    return (
                      <button
                        key={f}
                        onClick={() => setFiltreStatutDepense(f)}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${actif ? "bg-violet-100 text-violet-700" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Liste */}
              <div className="space-y-3">
                {depensesFiltres.map((d) => {
                  const sCfg = statutDepenseConfig[d.statut];
                  const cCfg = categorieDepenseConfig[d.categorie];
                  return (
                    <div
                      key={d.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200/80  shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-start gap-4 p-5">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cCfg.bg}`}
                        >
                          <cCfg.icone size={18} className={cCfg.couleur} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-violet-700">
                              {d.reference}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${cCfg.bg} ${cCfg.couleur}`}
                            >
                              {cCfg.label}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${sCfg.bg} ${sCfg.couleur}`}
                            >
                              {sCfg.label}
                            </span>
                          </div>
                          <h4 className="mt-0.5 text-sm font-bold text-slate-900">
                            {d.intitule}
                          </h4>
                          <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                            {d.description}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <Building2 size={10} className="text-slate-400" />
                              <span className="text-[10px] text-slate-500">
                                Fournisseur :{" "}
                                <span className="font-semibold text-slate-700">
                                  {d.fournisseur}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <User size={10} className="text-slate-400" />
                              <span className="text-[10px] text-slate-500">
                                Responsable :{" "}
                                <span className="font-semibold text-slate-700">
                                  {d.responsable}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CalendarDays
                                size={10}
                                className="text-slate-400"
                              />
                              <span className="text-[10px] text-slate-500">
                                Échéance :{" "}
                                <span className="font-semibold text-slate-700">
                                  {formatDate(d.dateEcheance)}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Montant TTC
                          </p>
                          <p className="text-lg font-black text-slate-900">
                            {formatMontant(d.montantTTC)}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            HT : {formatMontant(d.montantHT)} · TVA :{" "}
                            {formatMontant(d.tva)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {[Eye, Edit3, Printer, Download].map((Icon, i) => (
                            <button
                              key={i}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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

          {/* ════ DOCUMENTS ════ */}
          {ongletActif === "documents" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-200 transition-all hover:bg-violet-700">
                  <Plus size={13} />
                  Nouveau document
                </button>
                <div className="ml-auto text-xs text-slate-400">
                  {documentsAdmin.length} documents
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200/80  shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60">
                        {[
                          "Document",
                          "Catégorie",
                          "Auteur",
                          "Dernière MAJ",
                          "Taille",
                          "Statut",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {documentsAdmin.map((doc) => {
                        const dCfg = statutDocConfig[doc.statut];
                        return (
                          <tr
                            key={doc.id}
                            className="group transition-colors hover:bg-violet-50/20"
                          >
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                                  <FileText
                                    size={13}
                                    className="text-violet-600"
                                  />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-900">
                                    {doc.titre}
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    {doc.format}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                                {doc.categorie}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-600">
                              {doc.auteur}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-500">
                              {formatDate(doc.dateMaj)}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-500">
                              {doc.taille}
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${dCfg.bg} ${dCfg.couleur}`}
                              >
                                {dCfg.label}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                {[Eye, Download, Edit3].map((Icon, i) => (
                                  <button
                                    key={i}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Icon size={12} />
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ TICKETS ════ */}
          {ongletActif === "tickets" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-200 transition-all hover:bg-violet-700">
                  <Plus size={13} />
                  Nouvelle demande
                </button>
                <div className="ml-4 flex gap-2">
                  {(
                    ["tous", "ouvert", "en_cours", "resolu", "ferme"] as const
                  ).map((f) => {
                    const actif = filtreStatutTicket === f;
                    const label =
                      f === "tous" ? "Tous" : statutTicketConfig[f].label;
                    return (
                      <button
                        key={f}
                        onClick={() => setFiltreStatutTicket(f)}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${actif ? "bg-violet-100 text-violet-700" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-3">
                {ticketsFiltres.map((t) => {
                  const pCfg = prioriteConfig[t.priorite];
                  const sCfg = statutTicketConfig[t.statut];
                  return (
                    <div
                      key={t.id}
                      className="group rounded-2xl border border-slate-200/80  p-5 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-start gap-4">
                        <div
                          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${pCfg.bg}`}
                        >
                          <MessageSquare size={15} className={pCfg.couleur} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {t.titre}
                            </h4>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${pCfg.bg} ${pCfg.couleur}`}
                            >
                              {pCfg.label}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${sCfg.bg} ${sCfg.couleur}`}
                            >
                              {sCfg.label}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {t.description}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-[10px] text-slate-400">
                              Par{" "}
                              <span className="font-semibold text-slate-600">
                                {t.demandeur}
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-300">
                              ·
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatDate(t.dateCreation)}
                            </span>
                            <span className="text-[10px] text-slate-300">
                              ·
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                              {t.categorie}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {[Eye, Edit3].map((Icon, i) => (
                            <button
                              key={i}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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

          {/* ════ CALENDRIER ════ */}
          {ongletActif === "calendrier" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {evenements.map((ev) => {
                const evCfg = typeEvenementConfig[ev.type];
                const EvIcon = evCfg.icone;
                return (
                  <div
                    key={ev.id}
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200/80  p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg">
                      <span className="text-lg font-black leading-none">
                        {new Date(ev.date).getDate()}
                      </span>
                      <span className="text-[9px] font-bold uppercase">
                        {new Date(ev.date).toLocaleDateString("fr-FR", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {ev.titre}
                        </h4>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${evCfg.bg} ${evCfg.couleur}`}
                        >
                          <EvIcon size={9} className="mr-1 inline" />
                          {ev.type === "reunion"
                            ? "Réunion"
                            : ev.type === "formation"
                              ? "Formation"
                              : ev.type === "evenement"
                                ? "Événement"
                                : "Échéance"}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        {[
                          { Icon: Clock, val: ev.heure },
                          { Icon: MapPin, val: ev.lieu },
                          {
                            Icon: Users,
                            val: `${ev.participants} participant${ev.participants > 1 ? "s" : ""}`,
                          },
                        ].map((row, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <row.Icon size={11} className="text-slate-400" />
                            <span className="text-[11px] text-slate-500">
                              {row.val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ══════ MODAL EMPLOYÉ ══════ */}
      {employeSelectionne && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setEmployeSelectionne(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl  shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 px-6 pb-16 pt-6">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <button
                onClick={() => setEmployeSelectionne(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full /20 text-white backdrop-blur-sm transition-colors hover:/30"
              >
                <X size={15} />
              </button>
              <div className="relative text-center">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${statutPresenceConfig[employeSelectionne.statut].bg} ${statutPresenceConfig[employeSelectionne.statut].couleur}`}
                >
                  {statutPresenceConfig[employeSelectionne.statut].label}
                </span>
              </div>
            </div>
            <div className="relative -mt-12 flex justify-center">
              <div className="relative rounded-full  p-1.5 shadow-xl">
                <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-violet-100">
                  <img
                    src={employeSelectionne.avatar}
                    alt={employeSelectionne.nom}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div
                  className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white ${statutPresenceConfig[employeSelectionne.statut].point}`}
                />
              </div>
            </div>
            <div className="px-6 pt-3 text-center">
              <h3 className="text-xl font-extrabold text-slate-900">
                {employeSelectionne.nom}
              </h3>
              <p className="mt-0.5 text-sm font-semibold text-violet-600">
                {employeSelectionne.poste}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {employeSelectionne.direction}
              </p>
            </div>
            <div className="space-y-2.5 px-6 pb-6 pt-5">
              {[
                {
                  icone: Mail,
                  label: "Email",
                  valeur: employeSelectionne.email,
                },
                {
                  icone: Phone,
                  label: "Téléphone",
                  valeur: employeSelectionne.telephone,
                },
                {
                  icone: CalendarDays,
                  label: "Date d'embauche",
                  valeur: formatDate(employeSelectionne.dateEmbauche),
                },
                {
                  icone: Coffee,
                  label: "Congés restants",
                  valeur: `${employeSelectionne.congesRestants} jours`,
                },
              ].map((ligne, i) => {
                const LIcon = ligne.icone;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-3.5 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                      <LIcon size={14} className="text-violet-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {ligne.label}
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {ligne.valeur}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
