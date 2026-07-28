"use client";
import { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  FileText,
  Upload,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  Wallet,
  Receipt,
  PieChart,
  CalendarDays,
  Building2,
  CreditCard,
  Bell,
  Eye,
  Send,
  X,
  CircleDollarSign,
  Banknote,
  ShieldCheck,
  Landmark,
  Copy,
  Check,
  ScrollText,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────

const kpis = [
  {
    label: "Chiffre d'affaires",
    value: "142 500 000",
    unit: "FCFA",
    change: "+12.4%",
    trend: "up",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    sub: "vs mois précédent",
  },
  {
    label: "Dépenses totales",
    value: "68 200 000",
    unit: "FCFA",
    change: "-3.1%",
    trend: "down",
    icon: TrendingDown,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    sub: "vs mois précédent",
  },
  {
    label: "Résultat net",
    value: "74 300 000",
    unit: "FCFA",
    change: "+18.2%",
    trend: "up",
    icon: Wallet,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    sub: "vs mois précédent",
  },
  {
    label: "Factures en attente",
    value: "23",
    unit: "factures",
    change: "8 urgentes",
    trend: "alert",
    icon: Receipt,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    sub: "à traiter cette semaine",
  },
];

const invoices = [
  {
    id: "INV-2025-089",
    client: "Orange Burkina Faso",
    project: "Plateforme CRM v2",
    amount: "18 500 000",
    date: "2025-06-01",
    due: "2025-06-30",
    status: "pending",
  },
  {
    id: "INV-2025-088",
    client: "Banque Atlantique",
    project: "Audit Cybersécurité",
    amount: "9 200 000",
    date: "2025-05-20",
    due: "2025-06-19",
    status: "paid",
  },
  {
    id: "INV-2025-087",
    client: "Ministère du Numérique",
    project: "Portail Citoyen Digital",
    amount: "42 000 000",
    date: "2025-05-10",
    due: "2025-06-09",
    status: "overdue",
  },
  {
    id: "INV-2025-086",
    client: "SONABHY",
    project: "ERP Cloud Migration",
    amount: "27 800 000",
    date: "2025-04-28",
    due: "2025-05-28",
    status: "paid",
  },
  {
    id: "INV-2025-085",
    client: "Coris Bank",
    project: "Application Mobile Banking",
    amount: "15 600 000",
    date: "2025-04-15",
    due: "2025-05-15",
    status: "review",
  },
  {
    id: "INV-2025-084",
    client: "Groupe CFAO",
    project: "Tableau de bord Analytics",
    amount: "11 400 000",
    date: "2025-04-01",
    due: "2025-05-01",
    status: "overdue",
  },
];

const expenses = [
  {
    id: "EXP-001",
    label: "Licences logicielles",
    category: "IT",
    amount: "4 200 000",
    date: "2025-06-05",
    submittedBy: "Daouda DAO",
    status: "approved",
  },
  {
    id: "EXP-002",
    label: "Déplacement Abidjan",
    category: "Voyage",
    amount: "850 000",
    date: "2025-06-08",
    submittedBy: "SERGE GEDEON",
    status: "pending",
  },
  {
    id: "EXP-003",
    label: "Serveurs AWS – Juin",
    category: "Cloud",
    amount: "2 100 000",
    date: "2025-06-10",
    submittedBy: "Système",
    status: "approved",
  },
  {
    id: "EXP-004",
    label: "Formation certifications",
    category: "RH",
    amount: "1 500 000",
    date: "2025-06-12",
    submittedBy: "Aminata HEMA",
    status: "rejected",
  },
  {
    id: "EXP-005",
    label: "Équipements bureau",
    category: "Logistique",
    amount: "680 000",
    date: "2025-06-14",
    submittedBy: "Sandrine KINI",
    status: "pending",
  },
];

const documents = [
  {
    name: "Bilan S1 2025",
    type: "PDF",
    size: "2.4 MB",
    date: "2025-06-15",
    category: "Bilan",
  },
  {
    name: "Compte de résultat Mai 2025",
    type: "XLSX",
    size: "890 KB",
    date: "2025-06-01",
    category: "Résultat",
  },
  {
    name: "Budget prévisionnel 2025",
    type: "XLSX",
    size: "1.2 MB",
    date: "2025-01-05",
    category: "Budget",
  },
  {
    name: "Rapport audit interne Q1",
    type: "PDF",
    size: "3.1 MB",
    date: "2025-04-10",
    category: "Audit",
  },
  {
    name: "Déclaration TVA Mai",
    type: "PDF",
    size: "540 KB",
    date: "2025-06-10",
    category: "Fiscal",
  },
  {
    name: "Journal des achats Juin",
    type: "CSV",
    size: "210 KB",
    date: "2025-06-18",
    category: "Achats",
  },
];

// Comptes bancaires de l'entreprise, avec solde — alimente l'onglet Banque et l'onglet RIB
const bankAccounts = [
  {
    bank: "Coris Bank",
    iban: "BF43 CB01 0001 2345 6789 0123 45",
    account: "1234 5678 9012 3456",
    currency: "FCFA",
    balance: 24500000,
    status: "Validé",
    updated: "2025-05-20",
  },
  {
    bank: "Banque Atlantique",
    iban: "BF12 BA02 0009 8765 4321 0987 65",
    account: "9876 5432 1098 7654",
    currency: "FCFA",
    balance: 18200000,
    status: "En attente",
    updated: "2025-06-02",
  },
];

// Derniers mouvements bancaires — vue simple pour l'onglet Banque
const bankTransactions = [
  {
    id: "TX-3391",
    date: "2025-06-18",
    label: "Virement reçu — Banque Atlantique",
    account: "Banque Atlantique",
    amount: "9 200 000",
    type: "credit",
  },
  {
    id: "TX-3390",
    date: "2025-06-16",
    label: "Paiement fournisseur AWS",
    account: "Coris Bank",
    amount: "2 100 000",
    type: "debit",
  },
  {
    id: "TX-3389",
    date: "2025-06-14",
    label: "Frais bancaires mensuels",
    account: "Coris Bank",
    amount: "45 000",
    type: "debit",
  },
  {
    id: "TX-3388",
    date: "2025-06-10",
    label: "Virement client — SONABHY",
    account: "Coris Bank",
    amount: "27 800 000",
    type: "credit",
  },
  {
    id: "TX-3387",
    date: "2025-06-08",
    label: "Prélèvement assurance locaux",
    account: "Banque Atlantique",
    amount: "320 000",
    type: "debit",
  },
];

const bankDocs = [
  {
    name: "Relevé Banque Atlantique — Juin",
    type: "PDF",
    size: "320 KB",
    date: "2025-06-15",
    category: "Banque",
  },
  {
    name: "Relevé Coris Bank — Juin",
    type: "PDF",
    size: "298 KB",
    date: "2025-06-15",
    category: "Banque",
  },
  {
    name: "Justificatif virement client",
    type: "PDF",
    size: "210 KB",
    date: "2025-06-12",
    category: "Banque",
  },
];

const taxReports = [
  {
    name: "Déclaration TVA Mai",
    type: "PDF",
    size: "540 KB",
    date: "2025-06-10",
    category: "Fiscal",
  },
  {
    name: "Déclaration IS 2025",
    type: "PDF",
    size: "1.1 MB",
    date: "2025-05-20",
    category: "Fiscal",
  },
];

const statutItems = [
  {
    label: "Documents validés",
    value: "88%",
    detail: "Conformité en cours",
  },
  {
    label: "Contrats à suivre",
    value: "12",
    detail: "Suivi prioritaire",
  },
  {
    label: "Rapports en attente",
    value: "4",
    detail: "A finaliser",
  },
];

const statutDocuments = [
  {
    title: "Certificat de conformité fiscale",
    status: "Validé",
    date: "2025-06-10",
  },
  {
    title: "Attestation de régularité sociale (CNSS)",
    status: "En attente",
    date: "2025-06-05",
  },
  {
    title: "Attestation de non-condamnation",
    status: "Validé",
    date: "2025-05-18",
  },
  {
    title: "Quitus fiscal 2024",
    status: "Expire bientôt",
    date: "2025-04-30",
  },
];

const rccmDocuments = [
  {
    name: "Extrait RCCM actif",
    type: "PDF",
    size: "760 KB",
    date: "2025-04-01",
    category: "RCCM",
  },
  {
    name: "Attestation sociale 2025",
    type: "PDF",
    size: "420 KB",
    date: "2025-03-15",
    category: "RCCM",
  },
  {
    name: "Statuts de la société (dernière version)",
    type: "PDF",
    size: "1.4 MB",
    date: "2024-11-02",
    category: "RCCM",
  },
  {
    name: "Numéro IFU — attestation",
    type: "PDF",
    size: "180 KB",
    date: "2024-09-20",
    category: "RCCM",
  },
];

const budgetCategories = [
  {
    label: "Engineering",
    budget: 35000000,
    spent: 28400000,
    color: "bg-blue-500",
  },
  {
    label: "Marketing",
    budget: 12000000,
    spent: 9800000,
    color: "bg-violet-500",
  },
  {
    label: "Infrastructure",
    budget: 20000000,
    spent: 18200000,
    color: "bg-amber-500",
  },
  {
    label: "RH & Formation",
    budget: 15000000,
    spent: 7600000,
    color: "bg-emerald-500",
  },
  {
    label: "Administratif",
    budget: 8000000,
    spent: 4100000,
    color: "bg-rose-500",
  },
];

// ─── STATUS CONFIG ────────────────────────────────────────────

const invoiceStatus: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  paid: {
    label: "Payée",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    icon: CheckCircle2,
  },
  pending: {
    label: "En attente",
    color: "text-amber-700",
    bg: "bg-amber-50",
    icon: Clock,
  },
  overdue: {
    label: "En retard",
    color: "text-red-700",
    bg: "bg-red-50",
    icon: XCircle,
  },
  review: {
    label: "En révision",
    color: "text-blue-700",
    bg: "bg-blue-50",
    icon: Eye,
  },
};

const expenseStatus: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  approved: {
    label: "Approuvée",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  pending: {
    label: "En attente",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  rejected: {
    label: "Rejetée",
    color: "text-red-700",
    bg: "bg-red-50",
  },
};

// Statuts génériques (RIB, Statut légal) — un seul endroit à mettre à jour
const genericStatus: Record<
  string,
  { color: string; bg: string; icon: React.ElementType }
> = {
  Validé: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    icon: CheckCircle2,
  },
  "En attente": { color: "text-amber-700", bg: "bg-amber-50", icon: Clock },
  "Expire bientôt": {
    color: "text-orange-700",
    bg: "bg-orange-50",
    icon: AlertCircle,
  },
  Rejeté: { color: "text-red-700", bg: "bg-red-50", icon: XCircle },
};

const alertStyle: Record<string, string> = {
  danger: "border-red-200 bg-red-50 text-red-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
};

const docTypeColor: Record<string, string> = {
  PDF: "bg-red-100 text-red-700",
  XLSX: "bg-emerald-100 text-emerald-700",
  CSV: "bg-blue-100 text-blue-700",
};

const categoryColor: Record<string, string> = {
  Bilan: "bg-violet-100 text-violet-700",
  Résultat: "bg-blue-100 text-blue-700",
  Budget: "bg-amber-100 text-amber-700",
  Audit: "bg-rose-100 text-rose-700",
  Fiscal: "bg-orange-100 text-orange-700",
  Achats: "bg-teal-100 text-teal-700",
  Banque: "bg-cyan-100 text-cyan-700",
  RIB: "bg-indigo-100 text-indigo-700",
  RCCM: "bg-slate-100 text-slate-700",
  Statut: "bg-amber-100 text-amber-700",
};

// ─── TABS ─────────────────────────────────────────────────────

const tabs = [
  { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
  { id: "invoices", label: "Factures", icon: Receipt },
  { id: "expenses", label: "Dépenses", icon: CreditCard },
  { id: "documents", label: "Autres Documents", icon: FileText },
  { id: "budget", label: "Budget", icon: PieChart },
  { id: "banque", label: "Banque", icon: Banknote },
  { id: "impot", label: "Impôt", icon: ShieldCheck },
  { id: "rib", label: "RIB", icon: Building2 },
  { id: "statut", label: "Statut", icon: CheckCircle2 },
  { id: "rccm", label: "RCCM", icon: FileText },
];

// ─── HELPERS ──────────────────────────────────────────────────

function toNumber(v: string) {
  return parseInt(v.replace(/[^\d-]/g, ""), 10) || 0;
}

function formatFCFA(n: number) {
  return n.toLocaleString("fr-FR");
}

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: React.ElementType;
  message: string;
}) {
  return (
    <div className="py-16 text-center">
      <Icon size={36} className="mx-auto mb-3 text-slate-300" />
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}

function DocumentCard({
  doc,
}: {
  doc: {
    name: string;
    type: string;
    size: string;
    date: string;
    category: string;
  };
}) {
  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50">
          <FileText size={22} className="text-slate-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-slate-900">{doc.name}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${docTypeColor[doc.type] ?? "bg-slate-100 text-slate-600"}`}
            >
              {doc.type}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${categoryColor[doc.category] ?? "bg-slate-100 text-slate-600"}`}
            >
              {doc.category}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-[11px] text-slate-400">{doc.date}</p>
          <p className="text-[10px] text-slate-300">{doc.size}</p>
        </div>
        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-brand-accent hover:text-brand-accent">
            <Eye size={14} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600">
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════════════════════════

function Sidebar({
  active,
  setActive,
}: {
  active: string;
  setActive: (id: string) => void;
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Logo area */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent">
          <CircleDollarSign size={20} className="text-white" />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            IKA Solution
          </p>
          <p className="font-extrabold text-slate-900">Comptabilité</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Navigation
        </p>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-brand-accent text-white shadow-md shadow-brand-accent/30"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={17} />
              {tab.label}
              {tab.id === "invoices" && (
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}
                >
                  23
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

// ════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ════════════════════════════════════════════════════════════

function Dashboard({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-8">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${kpi.border}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.bg}`}
                >
                  <Icon size={20} className={kpi.color} />
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    kpi.trend === "up"
                      ? "bg-emerald-50 text-emerald-700"
                      : kpi.trend === "down"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {kpi.trend === "up" && <ArrowUpRight size={11} />}
                  {kpi.trend === "down" && <ArrowDownRight size={11} />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {kpi.value}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-slate-400">
                {kpi.unit}
              </p>
              <p className="mt-3 text-[11px] text-slate-400">{kpi.label}</p>
              <p className="text-[10px] text-slate-300">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Recent invoices + budget overview */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent invoices */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="font-extrabold text-slate-900">Factures récentes</h3>
            <button
              onClick={() => onNavigate("invoices")}
              className="flex items-center gap-1 text-xs font-semibold text-brand-accent hover:underline"
            >
              Voir tout <ChevronRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {invoices.slice(0, 4).map((inv) => {
              const cfg = invoiceStatus[inv.status];
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={inv.id}
                  className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-slate-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {inv.client}
                    </p>
                    <p className="text-[11px] text-slate-400">{inv.id}</p>
                  </div>
                  <p className="shrink-0 text-sm font-extrabold text-slate-900">
                    {inv.amount}{" "}
                    <span className="text-[10px] font-semibold text-slate-400">
                      FCFA
                    </span>
                  </p>
                  <span
                    className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${cfg.color} ${cfg.bg}`}
                  >
                    <StatusIcon size={10} />
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget overview */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="font-extrabold text-slate-900">
              Budget par département
            </h3>
            <button
              onClick={() => onNavigate("budget")}
              className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-200"
            >
              Juin 2025
            </button>
          </div>
          <div className="flex flex-col gap-5 px-6 py-5">
            {budgetCategories.map((cat, i) => {
              const pct = Math.round((cat.spent / cat.budget) * 100);
              return (
                <div key={i}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">
                      {cat.label}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${cat.color} ${pct > 85 ? "opacity-100" : "opacity-80"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                    <span>
                      {(cat.spent / 1000000).toFixed(1)}M FCFA dépensés
                    </span>
                    <span>Budget: {(cat.budget / 1000000).toFixed(0)}M</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// INVOICES TAB
// ════════════════════════════════════════════════════════════

function Invoices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = useMemo(
    () => filtered.reduce((a, inv) => a + toNumber(inv.amount), 0),
    [filtered],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Rechercher une facture…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:border-brand-accent focus:outline-none"
          />
        </div>

        <div className="relative">
          <Filter
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-700 shadow-sm focus:border-brand-accent focus:outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="paid">Payées</option>
            <option value="pending">En attente</option>
            <option value="overdue">En retard</option>
            <option value="review">En révision</option>
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-accent/30 transition-all hover:bg-brand-accent-dark"
        >
          <Plus size={15} />
          Nouvelle facture
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  "Référence",
                  "Client",
                  "Projet",
                  "Montant",
                  "Date",
                  "Échéance",
                  "Statut",
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((inv) => {
                const cfg = invoiceStatus[inv.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr
                    key={inv.id}
                    className="group transition-colors hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-mono text-xs font-bold text-slate-600">
                      {inv.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{inv.client}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{inv.project}</td>
                    <td className="px-5 py-4 font-extrabold text-slate-900">
                      {inv.amount}{" "}
                      <span className="text-[10px] font-semibold text-slate-400">
                        FCFA
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{inv.date}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`font-semibold ${
                          inv.status === "overdue"
                            ? "text-red-600"
                            : "text-slate-500"
                        }`}
                      >
                        {inv.due}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${cfg.color} ${cfg.bg}`}
                      >
                        <StatusIcon size={11} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-brand-accent hover:text-brand-accent">
                          <Eye size={13} />
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-500">
                          <Send size={13} />
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-500">
                          <Download size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-slate-100 bg-slate-50/60">
                  <td
                    colSpan={3}
                    className="px-5 py-3 text-xs font-bold text-slate-500"
                  >
                    {filtered.length} facture{filtered.length > 1 ? "s" : ""}
                  </td>
                  <td className="px-5 py-3 font-extrabold text-slate-900">
                    {formatFCFA(total)}{" "}
                    <span className="text-[10px] font-semibold text-slate-400">
                      FCFA
                    </span>
                  </td>
                  <td colSpan={4} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {filtered.length === 0 && (
          <EmptyState icon={Receipt} message="Aucune facture trouvée" />
        )}
      </div>

      {/* New invoice modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-extrabold text-slate-900">
                Nouvelle facture
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-900"
              >
                <X size={15} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6">
              {[
                {
                  label: "Client",
                  placeholder: "Nom du client",
                  span: "col-span-2",
                },
                {
                  label: "Projet",
                  placeholder: "Nom du projet",
                  span: "col-span-2",
                },
                {
                  label: "Montant (FCFA)",
                  placeholder: "0",
                  span: "col-span-1",
                },
                {
                  label: "Échéance",
                  placeholder: "YYYY-MM-DD",
                  span: "col-span-1",
                },
              ].map((field, i) => (
                <div key={i} className={field.span}>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    {field.label}
                  </label>
                  <input
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:border-brand-accent focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button className="rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-accent-dark">
                Créer la facture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// EXPENSES TAB
// ════════════════════════════════════════════════════════════

function Expenses() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = expenses.filter((exp) => {
    const matchSearch =
      exp.label.toLowerCase().includes(search.toLowerCase()) ||
      exp.id.toLowerCase().includes(search.toLowerCase()) ||
      exp.submittedBy.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || exp.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingTotal = useMemo(
    () =>
      expenses
        .filter((e) => e.status === "pending")
        .reduce((a, e) => a + toNumber(e.amount), 0),
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5">
        <Clock size={16} className="shrink-0 text-amber-600" />
        <p className="text-sm font-semibold text-amber-800">
          {formatFCFA(pendingTotal)} FCFA en attente de validation sur{" "}
          {expenses.filter((e) => e.status === "pending").length} dépense(s)
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Rechercher une dépense…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:border-brand-accent focus:outline-none"
          />
        </div>

        <div className="relative">
          <Filter
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-700 shadow-sm focus:border-brand-accent focus:outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="approved">Approuvées</option>
            <option value="pending">En attente</option>
            <option value="rejected">Rejetées</option>
          </select>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-accent/30 hover:bg-brand-accent-dark">
          <Plus size={15} />
          Soumettre une dépense
        </button>
      </div>

      {/* Cards grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((exp) => {
            const cfg = expenseStatus[exp.status];
            return (
              <div
                key={exp.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Top */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-900">{exp.label}</p>
                    <p className="mt-0.5 text-[11px] font-mono text-slate-400">
                      {exp.id}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${cfg.color} ${cfg.bg}`}
                  >
                    {cfg.label}
                  </span>
                </div>

                {/* Amount */}
                <p className="mb-4 text-2xl font-extrabold text-slate-900">
                  {exp.amount}{" "}
                  <span className="text-xs font-semibold text-slate-400">
                    FCFA
                  </span>
                </p>

                {/* Meta */}
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                    {exp.category}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">
                    {exp.date}
                  </span>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="text-[11px] text-slate-400">
                    Soumis par{" "}
                    <span className="font-bold text-slate-700">
                      {exp.submittedBy}
                    </span>
                  </p>
                  {exp.status === "pending" && (
                    <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100">
                        Approuver
                      </button>
                      <button className="rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100">
                        Rejeter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EmptyState icon={CreditCard} message="Aucune dépense trouvée" />
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// DOCUMENTS TAB
// ════════════════════════════════════════════════════════════

function Documents() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = Array.from(new Set(documents.map((d) => d.category)));

  const filtered = documents.filter((doc) => {
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "all" || doc.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Upload zone */}
      <div className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white py-10 text-center transition-colors hover:border-brand-accent hover:bg-red-50/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
          <Upload size={22} className="text-slate-500" />
        </div>
        <div>
          <p className="font-bold text-slate-700">Déposer un document ici</p>
          <p className="mt-0.5 text-sm text-slate-400">
            PDF, XLSX, CSV — max 20 MB
          </p>
        </div>
        <button className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-brand-accent hover:text-brand-accent">
          Parcourir les fichiers
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Rechercher un document…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:border-brand-accent focus:outline-none"
          />
        </div>
        <div className="relative">
          <Filter
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-700 shadow-sm focus:border-brand-accent focus:outline-none"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((doc, i) => (
            <DocumentCard key={i} doc={doc} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EmptyState icon={FileText} message="Aucun document trouvé" />
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// BUDGET TAB
// ════════════════════════════════════════════════════════════

function Budget() {
  const totalBudget = budgetCategories.reduce((a, c) => a + c.budget, 0);
  const totalSpent = budgetCategories.reduce((a, c) => a + c.spent, 0);
  const globalPct = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* Global card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Budget global — Juin 2025
            </p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {(totalBudget / 1000000).toFixed(0)}M{" "}
              <span className="text-lg font-semibold text-slate-400">FCFA</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Consommé
            </p>
            <p className="mt-1 text-3xl font-extrabold text-brand-accent">
              {globalPct}%
            </p>
          </div>
        </div>

        {/* Global bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              globalPct > 80 ? "bg-brand-accent" : "bg-emerald-500"
            }`}
            style={{ width: `${globalPct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>{(totalSpent / 1000000).toFixed(1)}M FCFA dépensés</span>
          <span>
            Restant : {((totalBudget - totalSpent) / 1000000).toFixed(1)}M FCFA
          </span>
        </div>
      </div>

      {/* Department breakdown */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {budgetCategories.map((cat, i) => {
          const pct = Math.round((cat.spent / cat.budget) * 100);
          const isOver = pct > 85;
          return (
            <div
              key={i}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isOver ? "border-red-200" : "border-slate-200"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="font-extrabold text-slate-900">{cat.label}</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    isOver
                      ? "bg-red-50 text-red-700"
                      : pct > 60
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {pct}%
                </span>
              </div>

              <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isOver ? "bg-red-500" : cat.color
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-extrabold text-slate-900">
                    {(cat.spent / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-[10px] text-slate-400">FCFA consommés</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-500">
                    / {(cat.budget / 1000000).toFixed(0)}M
                  </p>
                  <p className="text-[10px] text-slate-400">budget alloué</p>
                </div>
              </div>

              {isOver && (
                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700">
                  <AlertCircle size={12} />
                  Budget presque épuisé
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// BANQUE TAB
// ════════════════════════════════════════════════════════════

function Banque() {
  const totalBalance = bankAccounts.reduce((a, acc) => a + acc.balance, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Total + per-account balance */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-brand-accent/30 bg-brand-accent/5 p-5 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent/10">
            <Wallet size={20} className="text-brand-accent" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {formatFCFA(totalBalance)}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-slate-400">FCFA</p>
          <p className="mt-3 text-[11px] text-slate-400">
            Solde total — {bankAccounts.length} comptes
          </p>
        </div>

        {bankAccounts.map((acc, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50">
                <Landmark size={20} className="text-cyan-600" />
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${genericStatus[acc.status]?.bg} ${genericStatus[acc.status]?.color}`}
              >
                {acc.status}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {formatFCFA(acc.balance)}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">
              {acc.currency}
            </p>
            <p className="mt-3 text-[11px] font-bold text-slate-600">
              {acc.bank}
            </p>
            <p className="text-[10px] text-slate-300">
              Mis à jour le {acc.updated}
            </p>
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="flex items-center gap-2 font-extrabold text-slate-900">
            <ArrowRightLeft size={16} className="text-slate-400" />
            Derniers mouvements
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {bankTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-slate-50"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  tx.type === "credit" ? "bg-emerald-50" : "bg-red-50"
                }`}
              >
                {tx.type === "credit" ? (
                  <ArrowDownRight size={16} className="text-emerald-600" />
                ) : (
                  <ArrowUpRight size={16} className="text-red-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">
                  {tx.label}
                </p>
                <p className="text-[11px] text-slate-400">
                  {tx.account} · {tx.date}
                </p>
              </div>
              <p
                className={`shrink-0 text-sm font-extrabold ${
                  tx.type === "credit" ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {tx.type === "credit" ? "+" : "-"}
                {tx.amount}{" "}
                <span className="text-[10px] font-semibold text-slate-400">
                  FCFA
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bank documents */}
      <div>
        <h3 className="mb-3 font-extrabold text-slate-900">
          Relevés bancaires
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {bankDocs.map((doc, i) => (
            <DocumentCard key={i} doc={doc} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// IMPOT TAB
// ════════════════════════════════════════════════════════════

function Impot() {
  const [impots] = useState([
    {
      id: 1,
      type: "Impôt sur le revenu",
      montant: "12 500 000",
      devise: "FCFA",
      dateEchéance: "2025-07-31",
      statut: "payé",
      datePaiement: "2025-07-15",
    },
    {
      id: 2,
      type: "Taxe professionnelle",
      montant: "8 750 000",
      devise: "FCFA",
      dateEchéance: "2025-09-30",
      statut: "en attente",
      datePaiement: null,
    },
    {
      id: 3,
      type: "TVA",
      montant: "5 200 000",
      devise: "FCFA",
      dateEchéance: "2025-08-20",
      statut: "payé",
      datePaiement: "2025-08-18",
    },
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Impôts</h3>
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            <Plus size={18} />
            Ajouter un impôt
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Montant
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Échéance
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Date de paiement
                </th>
              </tr>
            </thead>
            <tbody>
              {impots.map((impot) => (
                <tr
                  key={impot.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {impot.type}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {impot.montant} {impot.devise}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {impot.dateEchéance}
                  </td>
                  <td className="px-4 py-3">
                    {impot.statut === "payé" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        <CheckCircle2 size={12} />
                        Payé
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        <Clock size={12} />
                        En attente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {impot.datePaiement || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax reports */}
      <div>
        <h3 className="mb-3 font-extrabold text-slate-900">
          Déclarations fiscales
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {taxReports.map((doc, i) => (
            <DocumentCard key={i} doc={doc} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// RIB TAB
// ════════════════════════════════════════════════════════════

function RIB() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, i: number) => {
    navigator.clipboard?.writeText(text.replace(/\s/g, ""));
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Relevés d'identité bancaire enregistrés pour l'entreprise
        </p>
        <button className="flex items-center gap-2 rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-accent/30 hover:bg-brand-accent-dark">
          <Plus size={15} />
          Ajouter un compte
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {bankAccounts.map((acc, i) => {
          const cfg = genericStatus[acc.status];
          const StatusIcon = cfg?.icon ?? CheckCircle2;
          return (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 font-extrabold text-indigo-600">
                    {acc.bank.charAt(0)}
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900">{acc.bank}</p>
                    <p className="text-[11px] text-slate-400">
                      Mis à jour le {acc.updated}
                    </p>
                  </div>
                </div>
                <span
                  className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${cfg?.bg} ${cfg?.color}`}
                >
                  <StatusIcon size={11} />
                  {acc.status}
                </span>
              </div>

              <div className="mb-2 rounded-xl bg-slate-50 p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Numéro de compte
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-sm font-bold text-slate-700">
                    {acc.account}
                  </p>
                  <button
                    onClick={() => handleCopy(acc.account, i)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-brand-accent hover:text-brand-accent"
                  >
                    {copiedIndex === i ? (
                      <Check size={13} className="text-emerald-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  IBAN
                </p>
                <p className="font-mono text-xs font-semibold text-slate-600">
                  {acc.iban}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// STATUT TAB
// ════════════════════════════════════════════════════════════

function Statut() {
  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statutItems.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-2xl font-extrabold text-slate-900">
              {item.value}
            </p>
            <p className="mt-2 text-sm font-bold text-slate-700">
              {item.label}
            </p>
            <p className="text-[11px] text-slate-400">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Compliance documents */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-extrabold text-slate-900">
            Documents de conformité
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {statutDocuments.map((doc, i) => {
            const cfg =
              genericStatus[doc.status] ?? genericStatus["En attente"];
            const StatusIcon = cfg.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                  <ScrollText size={16} className="text-slate-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {doc.title}
                  </p>
                  <p className="text-[11px] text-slate-400">{doc.date}</p>
                </div>
                <span
                  className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${cfg.bg} ${cfg.color}`}
                >
                  <StatusIcon size={10} />
                  {doc.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// RCCM TAB
// ════════════════════════════════════════════════════════════

function RCCM() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Registre du commerce et pièces légales de l'entreprise
        </p>
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-brand-accent hover:text-brand-accent">
          <Upload size={15} />
          Demander une mise à jour
        </button>
      </div>

      {rccmDocuments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rccmDocuments.map((doc, i) => (
            <DocumentCard key={i} doc={doc} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EmptyState icon={FileText} message="Aucun document RCCM trouvé" />
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════

export default function ComptabilitePage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabContent: Record<string, React.ReactNode> = {
    dashboard: <Dashboard onNavigate={setActiveTab} />,
    invoices: <Invoices />,
    expenses: <Expenses />,
    documents: <Documents />,
    budget: <Budget />,
    banque: <Banque />,
    impot: <Impot />,
    rib: <RIB />,
    statut: <Statut />,
    rccm: <RCCM />,
  };

  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar */}
      <Sidebar active={activeTab} setActive={setActiveTab} />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                  activeTab === tab.id
                    ? "bg-brand-accent text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {tabContent[activeTab]}
        </main>
      </div>
    </div>
  );
}
