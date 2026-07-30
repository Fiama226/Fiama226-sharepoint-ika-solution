export interface IDivisionStyle {
  bg: string;
  text: string;
  border: string;
  ring: string;
  gradient: string;
  dot: string;
  icon: string;
}

const STYLES: Record<string, IDivisionStyle> = {
  "Direction Générale": {
    bg: "ika-bg-violet-50",
    text: "ika-text-violet-700",
    border: "ika-border-violet-200",
    ring: "ika-ring-violet-200",
    gradient: "ika-from-violet-600 ika-to-purple-700",
    dot: "ika-bg-violet-500",
    icon: "Building2",
  },
  Engineering: {
    bg: "ika-bg-blue-50",
    text: "ika-text-blue-700",
    border: "ika-border-blue-200",
    ring: "ika-ring-blue-200",
    gradient: "ika-from-blue-500 ika-to-cyan-600",
    dot: "ika-bg-blue-500",
    icon: "Code2",
  },
  "Ventes & Marketing": {
    bg: "ika-bg-orange-50",
    text: "ika-text-orange-700",
    border: "ika-border-orange-200",
    ring: "ika-ring-orange-200",
    gradient: "ika-from-amber-500 ika-to-orange-600",
    dot: "ika-bg-orange-500",
    icon: "Megaphone",
  },
  Comptabilité: {
    bg: "ika-bg-emerald-50",
    text: "ika-text-emerald-700",
    border: "ika-border-emerald-200",
    ring: "ika-ring-emerald-200",
    gradient: "ika-from-emerald-500 ika-to-teal-600",
    dot: "ika-bg-emerald-500",
    icon: "Calculator",
  },
  Administration: {
    bg: "ika-bg-slate-50",
    text: "ika-text-slate-700",
    border: "ika-border-slate-200",
    ring: "ika-ring-slate-200",
    gradient: "ika-from-slate-500 ika-to-slate-700",
    dot: "ika-bg-slate-500",
    icon: "Briefcase",
  },
  "Support Technique": {
    bg: "ika-bg-cyan-50",
    text: "ika-text-cyan-700",
    border: "ika-border-cyan-200",
    ring: "ika-ring-cyan-200",
    gradient: "ika-from-cyan-500 ika-to-sky-600",
    dot: "ika-bg-cyan-500",
    icon: "Headphones",
  },
};

const FALLBACK: IDivisionStyle = {
  bg: "ika-bg-slate-50",
  text: "ika-text-slate-700",
  border: "ika-border-slate-200",
  ring: "ika-ring-slate-200",
  gradient: "ika-from-slate-500 ika-to-slate-700",
  dot: "ika-bg-slate-400",
  icon: "Users",
};

export function divisionStyle(division: string | undefined): IDivisionStyle {
  if (!division) return FALLBACK;
  return STYLES[division] || FALLBACK;
}

export function divisionNames(): string[] {
  return Object.keys(STYLES);
}
