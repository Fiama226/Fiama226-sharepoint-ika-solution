import { Users, Briefcase, Wallet, Building2 } from "lucide-react";

type Kpi = {
  label: string;
  value: string;
  sub: string;
  trend: string;
  up: boolean;
  icon: React.ComponentType<{ className?: string }>;
};

const KPIS: Kpi[] = [
  {
    label: "Effectif total",
    value: "156",
    sub: "Collaborateurs en poste",
    trend: "+8 ce trimestre",
    up: true,
    icon: Users,
  },
  {
    label: "Projets en cours",
    value: "27",
    sub: "16 clients actifs",
    trend: "4 en lancement",
    up: true,
    icon: Briefcase,
  },
  {
    label: "Chiffre d'affaires YTD",
    value: "4,82 M€",
    sub: "Objectif annuel 5,10 M€",
    trend: "+12,4 % vs N-1",
    up: true,
    icon: Wallet,
  },
  {
    label: "Clients actifs",
    value: "84",
    sub: "12 grands comptes",
    trend: "5 signatures T2",
    up: true,
    icon: Building2,
  },
];

export function KpiBand() {
  return (
    <section aria-labelledby="kpi-title" className="border-y border-brand-line bg-brand-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-brand-cyan-dark">
              Tableau de bord
           </p>
            <h2
              id="kpi-title"
              className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl"
            >
              IKA Solution en chiffres
           </h2>
         </div>
          <p className="text-sm text-brand-muted">Données arrêtées au 30 juin 2026</p>
       </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k) => {
            const Ico = k.icon;
            return (
              <li
                key={k.label}
                className="group rounded-2xl border border-brand-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-cyan/50 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-navy text-white transition group-hover:bg-brand-cyan">
                    <Ico className="h-5 w-5" />
                 </span>
                  {k.up ? (
                    <span className="inline-flex items-center rounded-full bg-brand-success/10 px-2 py-0.5 text-[11px] font-semibold text-brand-success">
                      {k.trend}
                   </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-brand-danger/10 px-2 py-0.5 text-[11px] font-semibold text-brand-danger">
                      {k.trend}
                   </span>
                  )}
               </div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-brand-ink">{k.value}</p>
                <p className="mt-1 text-sm font-semibold text-brand-navy">{k.label}</p>
                <p className="mt-0.5 text-xs text-brand-muted">{k.sub}</p>
             </li>
            );
          })}
       </ul>
     </div>
   </section>
  );
}
