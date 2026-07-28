"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Megaphone,
  BarChart3,
  FileText,
  Mail,
  Phone,
  Globe,
  Plus,
  Search,
  Filter,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit3,
  Trash2,
  X,
  Bell,
  Download,
  CalendarDays,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  MapPin,
  Send,
  PieChart,
  Activity,
  ShoppingBag,
  Handshake,
  CircleDollarSign,
  Zap,
  Award,
  ThumbsUp,
  MessageSquare,
  Image,
  Calendar,
  ArrowRight,
  XCircle,
  Percent,
  Home,
  Settings,
  Info,
  AlertTriangle,
  UserCheck,
  Briefcase,
  MoreHorizontal,
  Hash,
  ExternalLink,
  Receipt,
  BookOpen,
  Layers,
  Copy,
  Heart,
  Share2,
  DollarSign,
  UserPlus,
  Repeat,
  Flag,
  Bookmark,
  Timer,
  CircleDot,
  Sparkles,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────

type StadeLead =
  | "prospect"
  | "qualification"
  | "proposition"
  | "negociation"
  | "gagne"
  | "perdu";
type StatutCampagne = "active" | "en_pause" | "brouillon" | "terminee";
type StatutContenu = "planifie" | "brouillon" | "confirme" | "publie";
type TypeContenu =
  | "post"
  | "email"
  | "evenement"
  | "campagne"
  | "video"
  | "article";
type CanalMarketing =
  | "linkedin"
  | "instagram"
  | "twitter"
  | "youtube"
  | "email"
  | "site_web"
  | "facebook";
type PrioriteObjectif = "critique" | "haute" | "normale";

type Lead = {
  id: string;
  entreprise: string;
  contact: string;
  email: string;
  telephone: string;
  projet: string;
  valeur: number;
  source: string;
  stade: StadeLead;
  score: number;
  assigneA: string;
  dateCreation: string;
  dernierContact: string;
  prochaineSuivi: string;
  notes: string;
  secteur: string;
};

type Campagne = {
  id: string;
  nom: string;
  canal: CanalMarketing;
  statut: StatutCampagne;
  budget: number;
  depense: number;
  leads: number;
  clics: number;
  impressions: number;
  tauxConversion: number;
  dateDebut: string;
  dateFin: string;
  responsable: string;
  objectif: string;
  coutParLead: number;
};

type ContenuPlanifie = {
  id: string;
  titre: string;
  type: TypeContenu;
  canal: CanalMarketing;
  statut: StatutContenu;
  datePublication: string;
  responsable: string;
  description: string;
  priorite: PrioriteObjectif;
};

type ObjectifCommercial = {
  id: string;
  intitule: string;
  type: "ca" | "leads" | "conversion" | "deals" | "panier" | "retention";
  cible: number;
  realise: number;
  unite: string;
  periode: string;
  priorite: PrioriteObjectif;
  responsable: string;
};

type Proposition = {
  id: string;
  reference: string;
  client: string;
  intitule: string;
  montant: number;
  dateEnvoi: string;
  dateEcheance: string;
  statut: "envoyee" | "en_revision" | "acceptee" | "refusee" | "expiree";
  responsable: string;
  produit: string;
};

type ActiviteRecente = {
  id: string;
  type: "appel" | "email" | "reunion" | "note" | "relance" | "deal";
  description: string;
  lead: string;
  date: string;
  auteur: string;
};

type MembreEquipe = {
  id: string;
  nom: string;
  poste: string;
  avatar: string;
  deals: number;
  ca: number;
  objectifCA: number;
  leadsActifs: number;
  tauxConversion: number;
  statut: "present" | "conge" | "mission" | "absent";
};

// ─── DONNÉES ─────────────────────────────────────────────────

const equipe: MembreEquipe[] = [
  {
    id: "eq1",
    nom: "Roukiatou OUEDRAOGO",
    poste: "Responsable Commerciale",
    avatar: "/assets/team/roukie.jpg",
    deals: 8,
    ca: 94000000,
    objectifCA: 100000000,
    leadsActifs: 14,
    tauxConversion: 38,
    statut: "present",
  },
  {
    id: "eq2",
    nom: "Victorine BAZEMO",
    poste: "Assistante Commerciale",
    avatar: "/assets/team/victorine.jpg",
    deals: 4,
    ca: 48500000,
    objectifCA: 60000000,
    leadsActifs: 9,
    tauxConversion: 29,
    statut: "present",
  },
];

const leadsData: Lead[] = [
  {
    id: "LD-001",
    entreprise: "Brakina Faso SA",
    contact: "Moussa Traoré",
    email: "m.traore@brakina.bf",
    telephone: "+226 70 11 22 33",
    projet: "ERP Cloud complet",
    valeur: 28000000,
    source: "LinkedIn",
    stade: "qualification",
    score: 82,
    assigneA: "Roukiatou OUEDRAOGO",
    dateCreation: "2025-06-01",
    dernierContact: "2025-07-12",
    prochaineSuivi: "2025-07-18",
    notes: "Intéressé par la migration complète de leur SI vers le cloud",
    secteur: "Agroalimentaire",
  },
  {
    id: "LD-002",
    entreprise: "Société Générale BF",
    contact: "Aïssata Kaboré",
    email: "a.kabore@sgbf.com",
    telephone: "+226 70 22 33 44",
    projet: "Application Mobile Banking",
    valeur: 55500000,
    source: "Référence client",
    stade: "proposition",
    score: 91,
    assigneA: "Victorine BAZEMO",
    dateCreation: "2025-06-03",
    dernierContact: "2025-07-14",
    prochaineSuivi: "2025-07-16",
    notes: "Proposition envoyée, en attente de validation DG",
    secteur: "Banque & Finance",
  },
  {
    id: "LD-003",
    entreprise: "Air Burkina",
    contact: "Jean-Pierre Sawadogo",
    email: "jp.sawadogo@airbf.com",
    telephone: "+226 70 33 44 55",
    projet: "Portail digital voyageurs",
    valeur: 42000000,
    source: "Salon SITIC",
    stade: "negociation",
    score: 76,
    assigneA: "Roukiatou OUEDRAOGO",
    dateCreation: "2025-06-05",
    dernierContact: "2025-07-07",
    prochaineSuivi: "2025-07-15",
    notes: "Négociation prix en cours, demande 15% de remise",
    secteur: "Transport aérien",
  },
  {
    id: "LD-004",
    entreprise: "ONATEL",
    contact: "Fatimata Ouédraogo",
    email: "f.ouedraogo@onatel.bf",
    telephone: "+226 70 44 55 66",
    projet: "Audit cybersécurité + formation",
    valeur: 19200000,
    source: "Formulaire site web",
    stade: "prospect",
    score: 58,
    assigneA: "Victorine BAZEMO",
    dateCreation: "2025-06-08",
    dernierContact: "2025-07-10",
    prochaineSuivi: "2025-07-20",
    notes: "Premier contact établi, demande de documentation",
    secteur: "Télécommunications",
  },
  {
    id: "LD-005",
    entreprise: "BOA Burkina",
    contact: "Ibrahim Compaoré",
    email: "i.compaore@boabf.com",
    telephone: "+226 70 55 66 77",
    projet: "Plateforme Data Analytics",
    valeur: 33000000,
    source: "LinkedIn",
    stade: "gagne",
    score: 95,
    assigneA: "Roukiatou OUEDRAOGO",
    dateCreation: "2025-05-28",
    dernierContact: "2025-07-14",
    prochaineSuivi: "—",
    notes: "Contrat signé le 14/07 — Transfert à l'ingénierie",
    secteur: "Banque & Finance",
  },
  {
    id: "LD-006",
    entreprise: "Faso Coton",
    contact: "Mariam Diallo",
    email: "m.diallo@fasocoton.bf",
    telephone: "+226 70 66 77 88",
    projet: "Système de gestion RH",
    valeur: 8500000,
    source: "Cold email",
    stade: "perdu",
    score: 30,
    assigneA: "Victorine BAZEMO",
    dateCreation: "2025-05-20",
    dernierContact: "2025-06-25",
    prochaineSuivi: "—",
    notes: "Budget insuffisant — reporter au Q1 2026",
    secteur: "Agriculture",
  },
  {
    id: "LD-007",
    entreprise: "SONABEL",
    contact: "Pascal Zongo",
    email: "p.zongo@sonabel.bf",
    telephone: "+226 70 77 88 99",
    projet: "Application gestion compteurs intelligents",
    valeur: 68000000,
    source: "Appel entrant",
    stade: "qualification",
    score: 72,
    assigneA: "Roukiatou OUEDRAOGO",
    dateCreation: "2025-07-08",
    dernierContact: "2025-07-13",
    prochaineSuivi: "2025-07-17",
    notes: "Très intéressé, demande de démo technique prévue",
    secteur: "Énergie",
  },
  {
    id: "LD-008",
    entreprise: "Coris Bank International",
    contact: "Aminata Sanogo",
    email: "a.sanogo@coris.bf",
    telephone: "+226 70 88 99 00",
    projet: "IKA Cloud — déploiement multi-agences",
    valeur: 45000000,
    source: "Référence client",
    stade: "proposition",
    score: 88,
    assigneA: "Victorine BAZEMO",
    dateCreation: "2025-07-02",
    dernierContact: "2025-07-14",
    prochaineSuivi: "2025-07-19",
    notes: "Proposition envoyée pour 12 agences, décision fin juillet",
    secteur: "Banque & Finance",
  },
];

const campagnesData: Campagne[] = [
  {
    id: "CAM-001",
    nom: "Digital Transformation BF 2025",
    canal: "linkedin",
    statut: "active",
    budget: 2500000,
    depense: 1800000,
    leads: 34,
    clics: 1240,
    impressions: 48000,
    tauxConversion: 2.7,
    dateDebut: "2025-06-01",
    dateFin: "2025-06-30",
    responsable: "Roukiatou OUEDRAOGO",
    objectif: "Génération de leads B2B qualifiés dans le secteur public",
    coutParLead: 52941,
  },
  {
    id: "CAM-002",
    nom: "IKA Academy — Recrutement Talents Tech",
    canal: "instagram",
    statut: "active",
    budget: 1200000,
    depense: 890000,
    leads: 18,
    clics: 3420,
    impressions: 112000,
    tauxConversion: 0.5,
    dateDebut: "2025-06-10",
    dateFin: "2025-07-10",
    responsable: "Victorine BAZEMO",
    objectif: "Attirer des candidatures développeurs et commerciaux",
    coutParLead: 49444,
  },
  {
    id: "CAM-003",
    nom: "Webinar Cloud & IA pour entreprises africaines",
    canal: "email",
    statut: "active",
    budget: 450000,
    depense: 450000,
    leads: 22,
    clics: 890,
    impressions: 5200,
    tauxConversion: 17.1,
    dateDebut: "2025-06-15",
    dateFin: "2025-06-15",
    responsable: "Roukiatou OUEDRAOGO",
    objectif: "Conversion directe et démonstration d'expertise",
    coutParLead: 20454,
  },
  {
    id: "CAM-004",
    nom: "Brand Awareness Afrique de l'Ouest",
    canal: "twitter",
    statut: "en_pause",
    budget: 800000,
    depense: 320000,
    leads: 8,
    clics: 2100,
    impressions: 89000,
    tauxConversion: 0.4,
    dateDebut: "2025-05-01",
    dateFin: "2025-07-01",
    responsable: "Victorine BAZEMO",
    objectif: "Notoriété de marque dans la sous-région",
    coutParLead: 40000,
  },
  {
    id: "CAM-005",
    nom: "Témoignages Clients — Série vidéo",
    canal: "youtube",
    statut: "brouillon",
    budget: 3000000,
    depense: 0,
    leads: 0,
    clics: 0,
    impressions: 0,
    tauxConversion: 0,
    dateDebut: "2025-07-01",
    dateFin: "2025-09-01",
    responsable: "Victorine BAZEMO",
    objectif: "Crédibilité et preuve sociale par des cas réels",
    coutParLead: 0,
  },
  {
    id: "CAM-006",
    nom: "Newsletter IKA Insights — Mensuelle",
    canal: "email",
    statut: "active",
    budget: 150000,
    depense: 120000,
    leads: 12,
    clics: 456,
    impressions: 3200,
    tauxConversion: 14.2,
    dateDebut: "2025-01-01",
    dateFin: "2025-12-31",
    responsable: "Roukiatou OUEDRAOGO",
    objectif: "Fidélisation et nurturing des prospects",
    coutParLead: 10000,
  },
];

const contenusData: ContenuPlanifie[] = [
  {
    id: "CT-001",
    titre: "Étude de cas — BOA Burkina × IKA Cloud",
    type: "article",
    canal: "linkedin",
    statut: "planifie",
    datePublication: "2025-07-20",
    responsable: "Victorine BAZEMO",
    description:
      "Article détaillé sur l'implémentation d'IKA Cloud chez BOA Burkina",
    priorite: "haute",
  },
  {
    id: "CT-002",
    titre: "Newsletter IKA Insights — Juillet 2025",
    type: "email",
    canal: "email",
    statut: "brouillon",
    datePublication: "2025-07-22",
    responsable: "Roukiatou OUEDRAOGO",
    description: "Actualités, nouveaux produits et témoignages clients",
    priorite: "normale",
  },
  {
    id: "CT-003",
    titre: "Webinar — Cloud souverain pour le secteur public",
    type: "evenement",
    canal: "site_web",
    statut: "confirme",
    datePublication: "2025-07-25",
    responsable: "Roukiatou OUEDRAOGO",
    description:
      "Présentation live avec démo IKA Cloud pour les administrations",
    priorite: "critique",
  },
  {
    id: "CT-004",
    titre: "Carrousel Instagram — L'équipe IKA au quotidien",
    type: "post",
    canal: "instagram",
    statut: "brouillon",
    datePublication: "2025-07-28",
    responsable: "Victorine BAZEMO",
    description: "5 slides présentant l'ambiance et la culture d'entreprise",
    priorite: "normale",
  },
  {
    id: "CT-005",
    titre: "Lancement campagne vidéo YouTube — Témoignages clients",
    type: "video",
    canal: "youtube",
    statut: "planifie",
    datePublication: "2025-08-01",
    responsable: "Victorine BAZEMO",
    description: "Première vidéo : témoignage BOA Burkina, 3 min",
    priorite: "haute",
  },
  {
    id: "CT-006",
    titre: "Thread Twitter/X — 10 raisons de passer au cloud en 2025",
    type: "post",
    canal: "twitter",
    statut: "planifie",
    datePublication: "2025-07-18",
    responsable: "Victorine BAZEMO",
    description: "Thread éducatif avec statistiques et CTA vers le site",
    priorite: "normale",
  },
];

const objectifsData: ObjectifCommercial[] = [
  {
    id: "obj1",
    intitule: "Chiffre d'affaires mensuel",
    type: "ca",
    cible: 160000000,
    realise: 142500000,
    unite: "FCFA",
    periode: "Juillet 2025",
    priorite: "critique",
    responsable: "Roukiatou OUEDRAOGO",
  },
  {
    id: "obj2",
    intitule: "Nouveaux leads qualifiés",
    type: "leads",
    cible: 100,
    realise: 84,
    unite: "leads",
    periode: "Juillet 2025",
    priorite: "haute",
    responsable: "Victorine BAZEMO",
  },
  {
    id: "obj3",
    intitule: "Taux de conversion global",
    type: "conversion",
    cible: 40,
    realise: 34.2,
    unite: "%",
    periode: "Juillet 2025",
    priorite: "haute",
    responsable: "Roukiatou OUEDRAOGO",
  },
  {
    id: "obj4",
    intitule: "Deals signés",
    type: "deals",
    cible: 15,
    realise: 12,
    unite: "contrats",
    periode: "Juillet 2025",
    priorite: "critique",
    responsable: "Roukiatou OUEDRAOGO",
  },
  {
    id: "obj5",
    intitule: "Panier moyen par contrat",
    type: "panier",
    cible: 15000000,
    realise: 11800000,
    unite: "FCFA",
    periode: "Juillet 2025",
    priorite: "normale",
    responsable: "Victorine BAZEMO",
  },
  {
    id: "obj6",
    intitule: "Taux de rétention clients",
    type: "retention",
    cible: 92,
    realise: 89,
    unite: "%",
    periode: "S1 2025",
    priorite: "haute",
    responsable: "Roukiatou OUEDRAOGO",
  },
];

const propositionsData: Proposition[] = [
  {
    id: "PROP-2025-042",
    reference: "PROP-2025-042",
    client: "Société Générale BF",
    intitule: "Application Mobile Banking — Phase 1",
    montant: 55500000,
    dateEnvoi: "2025-07-10",
    dateEcheance: "2025-07-25",
    statut: "envoyee",
    responsable: "Victorine BAZEMO",
    produit: "Développement sur mesure",
  },
  {
    id: "PROP-2025-041",
    reference: "PROP-2025-041",
    client: "Coris Bank International",
    intitule: "IKA Cloud — Déploiement 12 agences",
    montant: 45000000,
    dateEnvoi: "2025-07-08",
    dateEcheance: "2025-07-30",
    statut: "envoyee",
    responsable: "Victorine BAZEMO",
    produit: "IKA Cloud",
  },
  {
    id: "PROP-2025-040",
    reference: "PROP-2025-040",
    client: "Air Burkina",
    intitule: "Portail digital voyageurs — v2",
    montant: 42000000,
    dateEnvoi: "2025-07-05",
    dateEcheance: "2025-07-20",
    statut: "en_revision",
    responsable: "Roukiatou OUEDRAOGO",
    produit: "Développement web",
  },
  {
    id: "PROP-2025-039",
    reference: "PROP-2025-039",
    client: "BOA Burkina",
    intitule: "Plateforme Data Analytics",
    montant: 33000000,
    dateEnvoi: "2025-06-28",
    dateEcheance: "2025-07-12",
    statut: "acceptee",
    responsable: "Roukiatou OUEDRAOGO",
    produit: "Data & IA",
  },
  {
    id: "PROP-2025-038",
    reference: "PROP-2025-038",
    client: "Faso Coton",
    intitule: "Système de gestion RH",
    montant: 8500000,
    dateEnvoi: "2025-06-15",
    dateEcheance: "2025-06-30",
    statut: "refusee",
    responsable: "Victorine BAZEMO",
    produit: "IKA Cloud",
  },
];

const activitesRecentes: ActiviteRecente[] = [
  {
    id: "a1",
    type: "deal",
    description: "Contrat BOA Burkina signé — 33 000 000 FCFA",
    lead: "BOA Burkina",
    date: "2025-07-14",
    auteur: "Roukiatou OUEDRAOGO",
  },
  {
    id: "a2",
    type: "email",
    description: "Proposition envoyée à Coris Bank International",
    lead: "Coris Bank",
    date: "2025-07-14",
    auteur: "Victorine BAZEMO",
  },
  {
    id: "a3",
    type: "reunion",
    description: "Démo IKA Cloud pour SONABEL — très intéressés",
    lead: "SONABEL",
    date: "2025-07-13",
    auteur: "Roukiatou OUEDRAOGO",
  },
  {
    id: "a4",
    type: "appel",
    description: "Relance téléphonique Air Burkina — en négociation",
    lead: "Air Burkina",
    date: "2025-07-12",
    auteur: "Roukiatou OUEDRAOGO",
  },
  {
    id: "a5",
    type: "note",
    description: "Note interne : ONATEL demande documentation cybersécurité",
    lead: "ONATEL",
    date: "2025-07-10",
    auteur: "Victorine BAZEMO",
  },
  {
    id: "a6",
    type: "relance",
    description: "Email de relance envoyé à Brakina Faso SA",
    lead: "Brakina Faso",
    date: "2025-07-09",
    auteur: "Victorine BAZEMO",
  },
];

// ─── CONFIGS ─────────────────────────────────────────────────

function formatMontant(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(d: string) {
  if (d === "—") return d;
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const stadeConfig: Record<
  StadeLead,
  {
    label: string;
    couleur: string;
    bg: string;
    bordure: string;
    icone: React.ElementType;
  }
> = {
  prospect: {
    label: "Prospect",
    couleur: "text-slate-700",
    bg: "bg-slate-100",
    bordure: "border-slate-200",
    icone: UserPlus,
  },
  qualification: {
    label: "Qualification",
    couleur: "text-blue-700",
    bg: "bg-blue-50",
    bordure: "border-blue-200",
    icone: Star,
  },
  proposition: {
    label: "Proposition",
    couleur: "text-violet-700",
    bg: "bg-violet-50",
    bordure: "border-violet-200",
    icone: FileText,
  },
  negociation: {
    label: "Négociation",
    couleur: "text-amber-700",
    bg: "bg-amber-50",
    bordure: "border-amber-200",
    icone: Handshake,
  },
  gagne: {
    label: "Gagné ✓",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50",
    bordure: "border-emerald-200",
    icone: CheckCircle2,
  },
  perdu: {
    label: "Perdu",
    couleur: "text-red-700",
    bg: "bg-red-50",
    bordure: "border-red-200",
    icone: XCircle,
  },
};

const statutCampagneConfig: Record<
  StatutCampagne,
  { label: string; couleur: string; bg: string }
> = {
  active: { label: "Active", couleur: "text-emerald-700", bg: "bg-emerald-50" },
  en_pause: { label: "En pause", couleur: "text-amber-700", bg: "bg-amber-50" },
  brouillon: {
    label: "Brouillon",
    couleur: "text-slate-600",
    bg: "bg-slate-100",
  },
  terminee: { label: "Terminée", couleur: "text-blue-700", bg: "bg-blue-50" },
};

const statutContenuConfig: Record<
  StatutContenu,
  { label: string; couleur: string; bg: string }
> = {
  planifie: { label: "Planifié", couleur: "text-blue-700", bg: "bg-blue-50" },
  brouillon: {
    label: "Brouillon",
    couleur: "text-slate-600",
    bg: "bg-slate-100",
  },
  confirme: {
    label: "Confirmé",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  publie: { label: "Publié", couleur: "text-violet-700", bg: "bg-violet-50" },
};

const canalConfig: Record<
  CanalMarketing,
  { label: string; couleur: string; bg: string; gradient: string }
> = {
  linkedin: {
    label: "LinkedIn",
    couleur: "text-blue-700",
    bg: "bg-blue-50",
    gradient: "from-blue-600 to-blue-700",
  },
  instagram: {
    label: "Instagram",
    couleur: "text-pink-700",
    bg: "bg-pink-50",
    gradient: "from-pink-500 to-rose-600",
  },
  twitter: {
    label: "Twitter / X",
    couleur: "text-slate-700",
    bg: "bg-slate-100",
    gradient: "from-slate-700 to-slate-900",
  },
  youtube: {
    label: "YouTube",
    couleur: "text-red-700",
    bg: "bg-red-50",
    gradient: "from-red-500 to-red-700",
  },
  email: {
    label: "Email",
    couleur: "text-orange-700",
    bg: "bg-orange-50",
    gradient: "from-orange-500 to-amber-600",
  },
  site_web: {
    label: "Site Web",
    couleur: "text-teal-700",
    bg: "bg-teal-50",
    gradient: "from-teal-500 to-emerald-600",
  },
  facebook: {
    label: "Facebook",
    couleur: "text-indigo-700",
    bg: "bg-indigo-50",
    gradient: "from-indigo-500 to-blue-600",
  },
};

const propositionStatutConfig: Record<
  string,
  { label: string; couleur: string; bg: string }
> = {
  envoyee: { label: "Envoyée", couleur: "text-blue-700", bg: "bg-blue-50" },
  en_revision: {
    label: "En révision",
    couleur: "text-amber-700",
    bg: "bg-amber-50",
  },
  acceptee: {
    label: "Acceptée ✓",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  refusee: { label: "Refusée", couleur: "text-red-700", bg: "bg-red-50" },
  expiree: { label: "Expirée", couleur: "text-slate-600", bg: "bg-slate-100" },
};

const activiteTypeConfig: Record<
  string,
  { label: string; couleur: string; bg: string; icone: React.ElementType }
> = {
  appel: {
    label: "Appel",
    couleur: "text-blue-600",
    bg: "bg-blue-50",
    icone: Phone,
  },
  email: {
    label: "Email",
    couleur: "text-orange-600",
    bg: "bg-orange-50",
    icone: Mail,
  },
  reunion: {
    label: "Réunion",
    couleur: "text-violet-600",
    bg: "bg-violet-50",
    icone: Users,
  },
  note: {
    label: "Note",
    couleur: "text-slate-600",
    bg: "bg-slate-100",
    icone: FileText,
  },
  relance: {
    label: "Relance",
    couleur: "text-amber-600",
    bg: "bg-amber-50",
    icone: Repeat,
  },
  deal: {
    label: "Deal signé",
    couleur: "text-emerald-600",
    bg: "bg-emerald-50",
    icone: Handshake,
  },
};

const sourceConfig: Record<string, { couleur: string; bg: string }> = {
  LinkedIn: { couleur: "text-blue-700", bg: "bg-blue-100" },
  "Référence client": { couleur: "text-violet-700", bg: "bg-violet-100" },
  "Salon SITIC": { couleur: "text-amber-700", bg: "bg-amber-100" },
  "Cold email": { couleur: "text-slate-700", bg: "bg-slate-200" },
  "Formulaire site web": { couleur: "text-teal-700", bg: "bg-teal-100" },
  "Appel entrant": { couleur: "text-emerald-700", bg: "bg-emerald-100" },
};

const statutPresenceConfig: Record<string, { label: string; point: string }> = {
  present: { label: "Présent", point: "bg-emerald-500" },
  conge: { label: "En congé", point: "bg-blue-500" },
  mission: { label: "En mission", point: "bg-amber-500" },
  absent: { label: "Absent", point: "bg-red-500" },
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
    message: "Contrat BOA Burkina signé — 33 000 000 FCFA 🎉",
    date: "2025-07-14",
    type: "succes",
    lue: false,
  },
  {
    id: "n2",
    message: "Lead Air Burkina — relance urgente requise (J+7)",
    date: "2025-07-14",
    type: "alerte",
    lue: false,
  },
  {
    id: "n3",
    message: "Campagne LinkedIn à 72% du budget — fin le 30 juin",
    date: "2025-07-13",
    type: "alerte",
    lue: false,
  },
  {
    id: "n4",
    message: "Nouveau lead entrant : SONABEL via appel téléphonique",
    date: "2025-07-12",
    type: "info",
    lue: true,
  },
  {
    id: "n5",
    message: "Proposition Coris Bank envoyée — suivi à J+5",
    date: "2025-07-10",
    type: "info",
    lue: true,
  },
];

// ─── NAVIGATION ──────────────────────────────────────────────

type OngletId =
  | "tableau_bord"
  | "crm"
  | "campagnes"
  | "pipeline"
  | "propositions"
  | "contenu"
  | "objectifs"
  | "equipe";

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
    label: "Commercial",
    items: [
      { id: "crm", label: "CRM / Leads", icone: Users },
      { id: "pipeline", label: "Pipeline", icone: Activity },
      { id: "propositions", label: "Propositions", icone: FileText },
      { id: "objectifs", label: "Objectifs", icone: Target },
    ],
  },
  {
    label: "Marketing",
    items: [
      { id: "campagnes", label: "Campagnes", icone: Megaphone },
      { id: "contenu", label: "Calendrier contenu", icone: Calendar },
    ],
  },
];

// ════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ════════════════════════════════════════════════════════════

export default function IntranetCommercial() {
  const [ongletActif, setOngletActif] = useState<OngletId>("tableau_bord");
  const [recherche, setRecherche] = useState("");
  const [notifOuverte, setNotifOuverte] = useState(false);
  const [filtreStade, setFiltreStade] = useState<"tous" | StadeLead>("tous");
  const [filtreStatutCampagne, setFiltreStatutCampagne] = useState<
    "tous" | StatutCampagne
  >("tous");
  const [leadSelectionne, setLeadSelectionne] = useState<Lead | null>(null);

  const notifsNonLues = notifications.filter((n) => !n.lue).length;

  const leadsFiltres = useMemo(() => {
    let l = leadsData;
    if (filtreStade !== "tous") l = l.filter((ld) => ld.stade === filtreStade);
    if (recherche.length > 1)
      l = l.filter(
        (ld) =>
          ld.entreprise.toLowerCase().includes(recherche.toLowerCase()) ||
          ld.contact.toLowerCase().includes(recherche.toLowerCase()) ||
          ld.projet.toLowerCase().includes(recherche.toLowerCase()),
      );
    return l;
  }, [filtreStade, recherche]);

  const campagnesFiltrees = useMemo(() => {
    if (filtreStatutCampagne === "tous") return campagnesData;
    return campagnesData.filter((c) => c.statut === filtreStatutCampagne);
  }, [filtreStatutCampagne]);

  const pipelineStages = [
    {
      stade: "prospect" as StadeLead,
      leads: leadsData.filter((l) => l.stade === "prospect"),
    },
    {
      stade: "qualification" as StadeLead,
      leads: leadsData.filter((l) => l.stade === "qualification"),
    },
    {
      stade: "proposition" as StadeLead,
      leads: leadsData.filter((l) => l.stade === "proposition"),
    },
    {
      stade: "negociation" as StadeLead,
      leads: leadsData.filter((l) => l.stade === "negociation"),
    },
    {
      stade: "gagne" as StadeLead,
      leads: leadsData.filter((l) => l.stade === "gagne"),
    },
  ];

  const stats = {
    caTotal: 142500000,
    caObjectif: 160000000,
    leadsTotal: leadsData.length,
    leadsActifs: leadsData.filter(
      (l) => l.stade !== "gagne" && l.stade !== "perdu",
    ).length,
    dealsGagnes: leadsData.filter((l) => l.stade === "gagne").length,
    tauxConversion: 34.2,
    panierMoyen: 11800000,
    pipelineTotal: leadsData
      .filter((l) => l.stade !== "gagne" && l.stade !== "perdu")
      .reduce((s, l) => s + l.valeur, 0),
    campagnesActives: campagnesData.filter((c) => c.statut === "active").length,
    propositionsEnCours: propositionsData.filter(
      (p) => p.statut === "envoyee" || p.statut === "en_revision",
    ).length,
    totalLeadsCampagnes: campagnesData.reduce((s, c) => s + c.leads, 0),
  };

  const ongletLabel =
    groupesNav.flatMap((g) => g.items).find((o) => o.id === ongletActif)
      ?.label ?? "";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/20 font-sans">
      {/* ══════ SIDEBAR ══════ */}
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 shadow-lg shadow-orange-200">
            <Megaphone size={17} className="text-white" />
            <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900">
              Ventes & Marketing
            </h1>
            <p className="text-[10px] font-medium text-slate-400">
              IKA Solution — Intranet
            </p>
          </div>
        </div>

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
                    item.id === "crm"
                      ? stats.leadsActifs
                      : item.id === "propositions"
                        ? stats.propositionsEnCours
                        : 0;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setOngletActif(item.id)}
                      className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all duration-150 ${
                        actif
                          ? "bg-gradient-to-r from-orange-50 to-rose-50 text-orange-700 shadow-sm ring-1 ring-orange-200/60"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-all ${actif ? "bg-orange-100" : "group-hover:bg-slate-100"}`}
                      >
                        <Icone
                          size={13}
                          className={
                            actif
                              ? "text-orange-600"
                              : "text-slate-400 group-hover:text-slate-600"
                          }
                        />
                      </div>
                      <span className="flex-1 truncate">{item.label}</span>
                      {badge > 0 && (
                        <span
                          className={`flex min-w-[18px] items-center justify-center rounded-full px-1 py-0.5 text-[9px] font-black ${actif ? "bg-orange-200 text-orange-800" : "bg-blue-100 text-blue-700"}`}
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
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <main className="flex-1 p-6">
          {/* ════ TABLEAU DE BORD ════ */}
          {ongletActif === "tableau_bord" && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  {
                    label: "Chiffre d'affaires",
                    valeur: formatMontant(stats.caTotal),
                    icone: CircleDollarSign,
                    gradient: "from-emerald-500 to-teal-600",
                    bg: "bg-emerald-50",
                    sous: `Objectif : ${formatMontant(stats.caObjectif)}`,
                    sousCouleur: "text-emerald-600",
                    change: "+18.4%",
                    up: true,
                  },
                  {
                    label: "Pipeline actif",
                    valeur: formatMontant(stats.pipelineTotal),
                    icone: Activity,
                    gradient: "from-violet-500 to-purple-600",
                    bg: "bg-violet-50",
                    sous: `${stats.leadsActifs} leads en cours`,
                    sousCouleur: "text-violet-600",
                    change: "+12%",
                    up: true,
                  },
                  {
                    label: "Taux de conversion",
                    valeur: `${stats.tauxConversion}%`,
                    icone: Percent,
                    gradient: "from-amber-500 to-orange-600",
                    bg: "bg-amber-50",
                    sous: "Objectif : 40%",
                    sousCouleur: "text-amber-600",
                    change: "-2.3%",
                    up: false,
                  },
                  {
                    label: "Deals signés",
                    valeur: String(stats.dealsGagnes),
                    icone: Handshake,
                    gradient: "from-rose-500 to-pink-600",
                    bg: "bg-rose-50",
                    sous: "ce mois-ci",
                    sousCouleur: "text-rose-600",
                    change: "+4",
                    up: true,
                  },
                ].map((kpi, i) => {
                  const SIcon = kpi.icone;
                  return (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div
                        className={`absolute -right-5 -top-5 h-24 w-24 rounded-full ${kpi.bg} opacity-50 transition-transform duration-500 group-hover:scale-150`}
                      />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.gradient} shadow-md`}
                          >
                            <SIcon size={17} className="text-white" />
                          </div>
                          <span
                            className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${kpi.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                          >
                            {kpi.up ? (
                              <ArrowUpRight size={10} />
                            ) : (
                              <ArrowDownRight size={10} />
                            )}
                            {kpi.change}
                          </span>
                        </div>
                        <p className="text-xl font-black text-slate-900">
                          {kpi.valeur}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-600">
                          {kpi.label}
                        </p>
                        <p
                          className={`mt-0.5 text-[10px] font-semibold ${kpi.sousCouleur}`}
                        >
                          {kpi.sous}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* KPIs secondaires */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  {
                    label: "Leads totaux",
                    val: stats.leadsTotal,
                    icone: Users,
                    couleur: "text-blue-600",
                    bg: "bg-blue-50",
                    bordure: "border-blue-200",
                    sous: `${stats.leadsActifs} actifs`,
                  },
                  {
                    label: "Panier moyen",
                    val: formatMontant(stats.panierMoyen),
                    icone: ShoppingBag,
                    couleur: "text-rose-600",
                    bg: "bg-rose-50",
                    bordure: "border-rose-200",
                    sous: "par contrat",
                  },
                  {
                    label: "Campagnes actives",
                    val: stats.campagnesActives,
                    icone: Megaphone,
                    couleur: "text-orange-600",
                    bg: "bg-orange-50",
                    bordure: "border-orange-200",
                    sous: `${stats.totalLeadsCampagnes} leads générés`,
                  },
                  {
                    label: "Propositions en cours",
                    val: stats.propositionsEnCours,
                    icone: FileText,
                    couleur: "text-violet-600",
                    bg: "bg-violet-50",
                    bordure: "border-violet-200",
                    sous: "à suivre",
                  },
                ].map((stat, i) => {
                  const SIcon = stat.icone;
                  return (
                    <div
                      key={i}
                      className={`rounded-2xl border ${stat.bordure} ${stat.bg} p-4`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <SIcon size={14} className={stat.couleur} />
                        <p className={`text-[10px] font-bold ${stat.couleur}`}>
                          {stat.label}
                        </p>
                      </div>
                      <p className="text-xl font-black text-slate-900">
                        {stat.val}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {stat.sous}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Grille 3 colonnes */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Pipeline résumé */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-orange-500" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Pipeline commercial
                      </h3>
                    </div>
                    <button
                      onClick={() => setOngletActif("pipeline")}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-800"
                    >
                      Voir tout →
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    {pipelineStages.map((ps) => {
                      const cfg = stadeConfig[ps.stade];
                      const totalVal = ps.leads.reduce(
                        (s, l) => s + l.valeur,
                        0,
                      );
                      const maxLeads = Math.max(
                        ...pipelineStages.map((p) => p.leads.length),
                        1,
                      );
                      const width = Math.round(
                        (ps.leads.length / maxLeads) * 100,
                      );
                      return (
                        <div key={ps.stade}>
                          <div className="mb-1 flex items-center justify-between">
                            <span
                              className={`text-[10px] font-bold ${cfg.couleur}`}
                            >
                              {cfg.label}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {ps.leads.length} · {formatMontant(totalVal)}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full transition-all ${cfg.bg === "bg-emerald-50" ? "bg-emerald-400" : cfg.bg === "bg-blue-50" ? "bg-blue-400" : cfg.bg === "bg-violet-50" ? "bg-violet-400" : cfg.bg === "bg-amber-50" ? "bg-amber-400" : "bg-slate-400"}`}
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Activités récentes */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-orange-500" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Activités récentes
                      </h3>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {activitesRecentes.slice(0, 5).map((a) => {
                      const cfg = activiteTypeConfig[a.type];
                      const AIcon = cfg.icone;
                      return (
                        <div
                          key={a.id}
                          className="flex items-start gap-3 px-5 py-3"
                        >
                          <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}
                          >
                            <AIcon size={12} className={cfg.couleur} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-slate-700 line-clamp-1">
                              {a.description}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2">
                              <span className="text-[10px] text-slate-400">
                                {formatDate(a.date)}
                              </span>
                              <span className="text-[10px] text-slate-300">
                                ·
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500">
                                {a.auteur.split(" ")[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Prochains contenus */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-orange-500" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Contenu à publier
                      </h3>
                    </div>
                    <button
                      onClick={() => setOngletActif("contenu")}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-800"
                    >
                      Voir tout →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {contenusData.slice(0, 4).map((c) => {
                      const sCfg = statutContenuConfig[c.statut];
                      const cCfg = canalConfig[c.canal];
                      return (
                        <div
                          key={c.id}
                          className="flex items-start gap-3 px-5 py-3"
                        >
                          <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${cCfg.gradient}`}
                          >
                            <Globe size={12} className="text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-slate-900">
                              {c.titre}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2">
                              <span className="text-[10px] text-slate-400">
                                {formatDate(c.datePublication)}
                              </span>
                              <span
                                className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${sCfg.bg} ${sCfg.couleur}`}
                              >
                                {sCfg.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Objectifs commerciaux */}
              <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-orange-500" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Objectifs — Juillet 2025
                    </h3>
                  </div>
                  <button
                    onClick={() => setOngletActif("objectifs")}
                    className="text-[10px] font-bold text-orange-600 hover:text-orange-800"
                  >
                    Voir tout →
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-0 divide-y divide-slate-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {objectifsData.slice(0, 3).map((obj) => {
                    const pct = Math.round((obj.realise / obj.cible) * 100);
                    const atteint = pct >= 100;
                    return (
                      <div key={obj.id} className="p-5">
                        <p className="text-xs font-bold text-slate-600">
                          {obj.intitule}
                        </p>
                        <p className="mt-1 text-xl font-black text-slate-900">
                          {obj.type === "ca" || obj.type === "panier"
                            ? formatMontant(obj.realise)
                            : `${obj.realise}${obj.unite === "%" ? "%" : ""}`}
                        </p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${atteint ? "bg-emerald-400" : pct >= 80 ? "bg-orange-400" : "bg-red-400"}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            Cible :{" "}
                            {obj.type === "ca" || obj.type === "panier"
                              ? formatMontant(obj.cible)
                              : `${obj.cible}${obj.unite === "%" ? "%" : ` ${obj.unite}`}`}
                          </span>
                          <span
                            className={`text-[10px] font-bold ${atteint ? "text-emerald-600" : pct >= 80 ? "text-orange-600" : "text-red-600"}`}
                          >
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ════ CRM / LEADS ════ */}
          {ongletActif === "crm" && (
            <div className="space-y-5">
              {/* Filtres stades */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setFiltreStade("tous")}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${filtreStade === "tous" ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}
                >
                  Tous ({leadsData.length})
                </button>
                {Object.entries(stadeConfig).map(([key, cfg]) => {
                  const count = leadsData.filter((l) => l.stade === key).length;
                  const StadeIcon = cfg.icone;
                  return (
                    <button
                      key={key}
                      onClick={() =>
                        setFiltreStade(
                          filtreStade === (key as StadeLead)
                            ? "tous"
                            : (key as StadeLead),
                        )
                      }
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${filtreStade === key ? `${cfg.bg} ${cfg.couleur} ring-1 ${cfg.bordure}` : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}
                    >
                      <StadeIcon size={11} />
                      {cfg.label}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] ${cfg.bg} ${cfg.couleur}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-200">
                  <Plus size={13} />
                  Nouveau lead
                </button>
                <div className="ml-auto text-xs text-slate-400">
                  {leadsFiltres.length} résultat
                  {leadsFiltres.length > 1 ? "s" : ""}
                </div>
              </div>

              {/* Grille leads */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {leadsFiltres.map((lead) => {
                  const cfg = stadeConfig[lead.stade];
                  const StadeIcon = cfg.icone;
                  const srcCfg = sourceConfig[lead.source] ?? {
                    couleur: "text-slate-600",
                    bg: "bg-slate-100",
                  };
                  return (
                    <div
                      key={lead.id}
                      onClick={() => setLeadSelectionne(lead)}
                      className={`group cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${cfg.bordure}`}
                    >
                      <div className="p-5">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                              <Building2 size={16} className="text-slate-500" />
                            </div>
                            <div>
                              <p className="text-sm font-extrabold text-slate-900 transition-colors group-hover:text-orange-600">
                                {lead.entreprise}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {lead.contact} · {lead.secteur}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${cfg.bg} ${cfg.couleur}`}
                          >
                            <StadeIcon size={9} />
                            {cfg.label}
                          </span>
                        </div>
                        <div className="mb-3 rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-semibold text-slate-500">
                            {lead.projet}
                          </p>
                          <p className="mt-0.5 text-lg font-black text-slate-900">
                            {formatMontant(lead.valeur)}
                          </p>
                        </div>
                        {/* Score */}
                        <div className="mb-3">
                          <div className="mb-1 flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-slate-500">
                              Score de qualification
                            </span>
                            <span
                              className={`font-black ${lead.score >= 80 ? "text-emerald-600" : lead.score >= 60 ? "text-amber-600" : "text-red-500"}`}
                            >
                              {lead.score}/100
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${lead.score >= 80 ? "bg-emerald-400" : lead.score >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${srcCfg.bg} ${srcCfg.couleur}`}
                            >
                              {lead.source}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {formatDate(lead.dateCreation)}
                          </span>
                        </div>
                      </div>
                      {lead.prochaineSuivi !== "—" && (
                        <div className="border-t border-slate-50 bg-slate-50/50 px-5 py-2">
                          <div className="flex items-center gap-1.5">
                            <Clock size={10} className="text-amber-500" />
                            <span className="text-[10px] text-slate-500">
                              Prochain suivi :{" "}
                              <span className="font-semibold text-amber-600">
                                {formatDate(lead.prochaineSuivi)}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ PIPELINE ════ */}
          {ongletActif === "pipeline" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {pipelineStages.map((ps) => {
                  const cfg = stadeConfig[ps.stade];
                  const totalVal = ps.leads.reduce((s, l) => s + l.valeur, 0);
                  return (
                    <div
                      key={ps.stade}
                      className={`rounded-2xl border ${cfg.bordure} ${cfg.bg} p-4`}
                    >
                      <p className={`text-[10px] font-bold ${cfg.couleur}`}>
                        {cfg.label}
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900">
                        {ps.leads.length}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500">
                        {formatMontant(totalVal)}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* Kanban simplifié */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
                {pipelineStages.map((ps) => {
                  const cfg = stadeConfig[ps.stade];
                  const SIcon = cfg.icone;
                  return (
                    <div key={ps.stade} className="space-y-2">
                      <div
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 ${cfg.bg}`}
                      >
                        <SIcon size={12} className={cfg.couleur} />
                        <span className={`text-xs font-bold ${cfg.couleur}`}>
                          {cfg.label}
                        </span>
                        <span className="ml-auto rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-600 shadow-sm">
                          {ps.leads.length}
                        </span>
                      </div>
                      {ps.leads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => setLeadSelectionne(lead)}
                          className={`cursor-pointer rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md ${cfg.bordure}`}
                        >
                          <p className="truncate text-xs font-bold text-slate-900">
                            {lead.entreprise}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] text-slate-400">
                            {lead.projet}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] font-black text-slate-700">
                              {formatMontant(lead.valeur)}
                            </span>
                            <div
                              className={`h-1.5 w-8 rounded-full ${lead.score >= 80 ? "bg-emerald-400" : lead.score >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ PROPOSITIONS ════ */}
          {ongletActif === "propositions" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-200">
                  <Plus size={13} />
                  Nouvelle proposition
                </button>
              </div>
              <div className="space-y-3">
                {propositionsData.map((p) => {
                  const sCfg = propositionStatutConfig[p.statut];
                  return (
                    <div
                      key={p.id}
                      className="group flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                        <FileText size={16} className="text-violet-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-orange-700">
                            {p.reference}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${sCfg.bg} ${sCfg.couleur}`}
                          >
                            {sCfg.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm font-bold text-slate-900">
                          {p.intitule}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {p.client} · {p.produit}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Montant
                        </p>
                        <p className="text-lg font-black text-slate-900">
                          {formatMontant(p.montant)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Envoyée le
                        </p>
                        <p className="text-xs font-semibold text-slate-700">
                          {formatDate(p.dateEnvoi)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Échéance
                        </p>
                        <p className="text-xs font-semibold text-amber-600">
                          {formatDate(p.dateEcheance)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {[Eye, Edit3, Download].map((Icon, i) => (
                          <button
                            key={i}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                          >
                            <Icon size={13} />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ OBJECTIFS ════ */}
          {ongletActif === "objectifs" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {objectifsData.map((obj) => {
                  const pct = Math.round((obj.realise / obj.cible) * 100);
                  const atteint = pct >= 100;
                  const priorCfg =
                    obj.priorite === "critique"
                      ? {
                          label: "Critique",
                          couleur: "text-red-700",
                          bg: "bg-red-50",
                        }
                      : obj.priorite === "haute"
                        ? {
                            label: "Haute",
                            couleur: "text-orange-700",
                            bg: "bg-orange-50",
                          }
                        : {
                            label: "Normale",
                            couleur: "text-slate-600",
                            bg: "bg-slate-100",
                          };
                  return (
                    <div
                      key={obj.id}
                      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
                    >
                      <div
                        className={`border-b px-5 py-3 ${atteint ? "bg-emerald-50 border-emerald-100" : pct >= 80 ? "bg-orange-50 border-orange-100" : "bg-red-50 border-red-100"}`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-600">
                            {obj.intitule}
                          </p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${priorCfg.bg} ${priorCfg.couleur}`}
                          >
                            {priorCfg.label}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-end justify-between gap-2">
                          <div>
                            <p className="text-2xl font-black text-slate-900">
                              {obj.type === "ca" || obj.type === "panier"
                                ? formatMontant(obj.realise)
                                : `${obj.realise}${obj.unite === "%" ? "%" : ""}`}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              sur{" "}
                              {obj.type === "ca" || obj.type === "panier"
                                ? formatMontant(obj.cible)
                                : `${obj.cible}${obj.unite === "%" ? "%" : ` ${obj.unite}`}`}
                            </p>
                          </div>
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full ${atteint ? "bg-emerald-50" : pct >= 80 ? "bg-orange-50" : "bg-red-50"}`}
                          >
                            <span
                              className={`text-sm font-black ${atteint ? "text-emerald-600" : pct >= 80 ? "text-orange-600" : "text-red-600"}`}
                            >
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all ${atteint ? "bg-emerald-400" : pct >= 80 ? "bg-orange-400" : "bg-red-400"}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            {obj.periode}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Resp : {obj.responsable.split(" ")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ CAMPAGNES ════ */}
          {ongletActif === "campagnes" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-200">
                  <Plus size={13} />
                  Nouvelle campagne
                </button>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      "tous",
                      "active",
                      "en_pause",
                      "brouillon",
                      "terminee",
                    ] as const
                  ).map((f) => {
                    const actif = filtreStatutCampagne === f;
                    const label =
                      f === "tous" ? "Toutes" : statutCampagneConfig[f].label;
                    return (
                      <button
                        key={f}
                        onClick={() => setFiltreStatutCampagne(f)}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${actif ? "bg-orange-100 text-orange-700 ring-1 ring-orange-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {campagnesFiltrees.map((cam) => {
                  const canCfg = canalConfig[cam.canal];
                  const statCfg = statutCampagneConfig[cam.statut];
                  const pctBudget =
                    cam.budget > 0
                      ? Math.round((cam.depense / cam.budget) * 100)
                      : 0;
                  return (
                    <div
                      key={cam.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div
                        className={`bg-gradient-to-r ${canCfg.gradient} px-5 py-3`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Globe size={14} className="text-white/80" />
                            <span className="text-xs font-bold text-white">
                              {canCfg.label}
                            </span>
                          </div>
                          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                            {cam.id}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-orange-600">
                            {cam.nom}
                          </h4>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold ${statCfg.bg} ${statCfg.couleur}`}
                          >
                            {statCfg.label}
                          </span>
                        </div>
                        <p className="mb-3 text-[11px] text-slate-500">
                          {cam.objectif}
                        </p>
                        <div className="mb-3 grid grid-cols-4 gap-2">
                          {[
                            { label: "Leads", val: cam.leads },
                            {
                              label: "Clics",
                              val: cam.clics.toLocaleString("fr-FR"),
                            },
                            {
                              label: "Impressions",
                              val:
                                cam.impressions > 1000
                                  ? `${Math.round(cam.impressions / 1000)}K`
                                  : cam.impressions,
                            },
                            {
                              label: "Taux conv.",
                              val: `${cam.tauxConversion}%`,
                            },
                          ].map((st, i) => (
                            <div
                              key={i}
                              className="rounded-xl bg-slate-50 p-2.5 text-center"
                            >
                              <p className="text-sm font-black text-slate-900">
                                {st.val}
                              </p>
                              <p className="text-[9px] text-slate-400">
                                {st.label}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mb-3">
                          <div className="mb-1 flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-slate-500">
                              Budget consommé
                            </span>
                            <span className="font-bold text-slate-700">
                              {pctBudget}%
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${pctBudget >= 90 ? "bg-red-400" : pctBudget >= 70 ? "bg-amber-400" : "bg-emerald-400"}`}
                              style={{ width: `${pctBudget}%` }}
                            />
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{formatMontant(cam.depense)}</span>
                            <span>/ {formatMontant(cam.budget)}</span>
                          </div>
                        </div>
                        {cam.coutParLead > 0 && (
                          <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                            <CircleDollarSign
                              size={12}
                              className="text-blue-600"
                            />
                            <span className="text-[10px] font-bold text-blue-700">
                              Coût par lead : {formatMontant(cam.coutParLead)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={10} className="text-slate-400" />
                            <span className="text-[10px] text-slate-400">
                              {formatDate(cam.dateDebut)} →{" "}
                              {formatDate(cam.dateFin)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            {[Eye, Edit3, BarChart3].map((Icon, i) => (
                              <button
                                key={i}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                              >
                                <Icon size={12} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ CALENDRIER CONTENU ════ */}
          {ongletActif === "contenu" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-200">
                  <Plus size={13} />
                  Planifier un contenu
                </button>
              </div>
              <div className="space-y-3">
                {contenusData.map((c) => {
                  const sCfg = statutContenuConfig[c.statut];
                  const cCfg = canalConfig[c.canal];
                  const priorCfg =
                    c.priorite === "critique"
                      ? {
                          label: "Critique",
                          couleur: "text-red-700",
                          bg: "bg-red-50",
                        }
                      : c.priorite === "haute"
                        ? {
                            label: "Haute",
                            couleur: "text-orange-700",
                            bg: "bg-orange-50",
                          }
                        : {
                            label: "Normale",
                            couleur: "text-slate-600",
                            bg: "bg-slate-100",
                          };
                  return (
                    <div
                      key={c.id}
                      className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow-lg">
                        <span className="text-lg font-black leading-none">
                          {new Date(c.datePublication).getDate()}
                        </span>
                        <span className="text-[9px] font-bold uppercase">
                          {new Date(c.datePublication).toLocaleDateString(
                            "fr-FR",
                            { month: "short" },
                          )}
                        </span>
                      </div>
                      <div
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cCfg.gradient}`}
                      >
                        <Globe size={15} className="text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-orange-600">
                            {c.titre}
                          </h4>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${sCfg.bg} ${sCfg.couleur}`}
                          >
                            {sCfg.label}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${priorCfg.bg} ${priorCfg.couleur}`}
                          >
                            {priorCfg.label}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                          {c.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${cCfg.bg} ${cCfg.couleur}`}
                          >
                            {cCfg.label}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                            {c.type}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Resp : {c.responsable.split(" ")[0]}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {[Edit3, Trash2].map((Icon, i) => (
                          <button
                            key={i}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                          >
                            <Icon size={13} />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ ÉQUIPE ════ */}
          {ongletActif === "equipe" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {equipe.map((m) => {
                  const pctCA = Math.round((m.ca / m.objectifCA) * 100);
                  const statCfg = statutPresenceConfig[m.statut];
                  return (
                    <div
                      key={m.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-lg"
                    >
                      <div className="relative bg-gradient-to-r from-orange-500 to-rose-600 px-5 pb-12 pt-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/10" />
                        <div className="relative flex items-center justify-between">
                          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur-sm">
                            {m.poste}
                          </span>
                          <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2 py-0.5 backdrop-blur-sm">
                            <div
                              className={`h-2 w-2 rounded-full ${statCfg.point}`}
                            />
                            <span className="text-[9px] font-bold text-white">
                              {statCfg.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative -mt-8 flex justify-center">
                        <div className="relative rounded-full bg-white p-1.5 shadow-xl ring-2 ring-orange-100">
                          <div className="h-16 w-16 overflow-hidden rounded-full">
                            <img
                              src={m.avatar}
                              alt={m.nom}
                              className="h-full w-full object-cover object-top"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="px-5 pb-5 pt-2 text-center">
                        <h4 className="text-sm font-extrabold text-slate-900">
                          {m.nom}
                        </h4>
                        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                          {[
                            { label: "Deals", val: m.deals },
                            { label: "Leads actifs", val: m.leadsActifs },
                            {
                              label: "Taux conv.",
                              val: `${m.tauxConversion}%`,
                            },
                          ].map((st, i) => (
                            <div key={i} className="text-center">
                              <p className="text-lg font-black text-slate-900">
                                {st.val}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {st.label}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <div className="mb-1 flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-slate-500">
                              CA réalisé vs objectif
                            </span>
                            <span
                              className={`font-black ${pctCA >= 100 ? "text-emerald-600" : pctCA >= 80 ? "text-orange-600" : "text-red-600"}`}
                            >
                              {pctCA}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${pctCA >= 100 ? "bg-emerald-400" : pctCA >= 80 ? "bg-orange-400" : "bg-red-400"}`}
                              style={{ width: `${Math.min(pctCA, 100)}%` }}
                            />
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{formatMontant(m.ca)}</span>
                            <span>/ {formatMontant(m.objectifCA)}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-center gap-2">
                          {[Mail, Phone, MessageSquare].map((Icon, i) => (
                            <button
                              key={i}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors hover:bg-orange-50 hover:text-orange-600"
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
        </main>
      </div>

      {/* ══════ MODAL LEAD ══════ */}
      {leadSelectionne && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setLeadSelectionne(null)}
        >
          <div
            className="h-full w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const cfg = stadeConfig[leadSelectionne.stade];
              const SIcon = cfg.icone;
              return (
                <>
                  <div className={`relative px-6 pb-6 pt-6 ${cfg.bg}`}>
                    <button
                      onClick={() => setLeadSelectionne(null)}
                      className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-slate-600 hover:bg-white"
                    >
                      <X size={15} />
                    </button>
                    <div
                      className={`mb-2 flex w-fit items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold ${cfg.couleur}`}
                    >
                      <SIcon size={9} />
                      {cfg.label}
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {leadSelectionne.entreprise}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {leadSelectionne.projet}
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-900">
                      {formatMontant(leadSelectionne.valeur)}
                    </p>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Informations
                    </h3>
                    {[
                      {
                        icone: Users,
                        label: "Contact",
                        valeur: leadSelectionne.contact,
                      },
                      {
                        icone: Mail,
                        label: "Email",
                        valeur: leadSelectionne.email,
                      },
                      {
                        icone: Phone,
                        label: "Téléphone",
                        valeur: leadSelectionne.telephone,
                      },
                      {
                        icone: Building2,
                        label: "Secteur",
                        valeur: leadSelectionne.secteur,
                      },
                      {
                        icone: MapPin,
                        label: "Source",
                        valeur: leadSelectionne.source,
                      },
                      {
                        icone: Users,
                        label: "Assigné à",
                        valeur: leadSelectionne.assigneA,
                      },
                      {
                        icone: Clock,
                        label: "Prochain suivi",
                        valeur:
                          leadSelectionne.prochaineSuivi === "—"
                            ? "Aucun"
                            : formatDate(leadSelectionne.prochaineSuivi),
                      },
                    ].map((row, i) => {
                      const RIcon = row.icone;
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}
                          >
                            <RIcon size={13} className={cfg.couleur} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {row.label}
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                              {row.valeur}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div className="mt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                        Score de qualification
                      </p>
                      <div className="mb-1 flex justify-between text-[11px]">
                        <span className="font-semibold text-slate-500">
                          Score
                        </span>
                        <span
                          className={`font-black ${leadSelectionne.score >= 80 ? "text-emerald-600" : leadSelectionne.score >= 60 ? "text-amber-600" : "text-red-500"}`}
                        >
                          {leadSelectionne.score}/100
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${leadSelectionne.score >= 80 ? "bg-emerald-500" : leadSelectionne.score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${leadSelectionne.score}%` }}
                        />
                      </div>
                    </div>
                    {leadSelectionne.notes && (
                      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">
                          Notes
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          {leadSelectionne.notes}
                        </p>
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 py-2.5 text-sm font-bold text-white shadow-lg">
                        <Send size={13} />
                        Contacter
                      </button>
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-500">
                        <Edit3 size={14} />
                      </button>
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-red-500 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
