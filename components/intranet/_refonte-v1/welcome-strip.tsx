import Link from "next/link";
import {
  CalendarPlus,
  Users,
  LifeBuoy,
  FolderOpen,
  Search,
  Bell,
  ArrowRight,
} from "lucide-react";

import { LiveClock } from "@/components/intranet/live-clock";

type QuickAction = {
  label: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ACTIONS: QuickAction[] = [
  {
    label: "Demande de congés",
    href: "#",
    description: "Solde & validation",
    icon: CalendarPlus,
  },
  {
    label: "Annuaire interne",
    href: "#",
    description: "Trouver un collègue",
    icon: Users,
  },
  {
    label: "Support IT",
    href: "#",
    description: "Ouvrir un ticket",
    icon: LifeBuoy,
  },
  {
    label: "Documents",
    href: "#",
    description: "Centre documentaire",
    icon: FolderOpen,
  },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type Props = {
  userName: string;
  userRole: string;
  teamCount: number;
};

export function WelcomeStrip({ userName, userRole, teamCount }: Props) {
  return (
    <section className="relative overflow-hidden bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_2fr] lg:gap-10 lg:px-8 lg:py-10">
        <div className="flex items-center gap-5">
          <div
            aria-hidden
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-cyan text-lg font-bold tracking-wide text-white sm:h-20 sm:w-20 sm:text-2xl"
          >
            {initials(userName)}
         </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-brand-cyan">
              Bienvenue
           </p>
            <h1 className="truncate text-2xl font-bold leading-tight sm:text-3xl">
              {userName}
           </h1>
            <p className="mt-0.5 text-sm text-white/80">{userRole}</p>
            <Link
              href="#"
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-cyan transition hover:text-white"
            >
              Mon profil
              <ArrowRight className="h-3 w-3" />
           </Link>
         </div>
          <div className="ml-auto hidden border-l border-white/15 pl-5 sm:block">
            <LiveClock />
         </div>
       </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 backdrop-blur">
            <Search className="h-4 w-4 text-brand-cyan" />
            <input
              type="search"
              placeholder="Rechercher une personne, un document, une actualité…"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
              aria-label="Rechercher sur l'intranet"
            />
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white/80 transition hover:border-brand-cyan hover:text-white"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-danger px-1 text-[10px] font-bold leading-none text-white">
                3
             </span>
           </button>
         </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <li key={a.label}>
                  <Link
                    href={a.href}
                    className="group flex h-full flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-brand-cyan hover:bg-white/10"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-cyan/20 text-brand-cyan transition group-hover:bg-brand-cyan group-hover:text-white">
                      <Icon className="h-4 w-4" />
                   </span>
                    <span className="text-sm font-semibold leading-tight text-white">
                      {a.label}
                   </span>
                    <span className="text-[11px] leading-tight text-white/65">
                      {a.description}
                   </span>
                 </Link>
               </li>
              );
            })}
         </ul>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-white/70">
            <span>
              <span className="font-semibold text-white">{teamCount}</span>{" "}
              collaborateurs référencés
           </span>
            <span aria-hidden className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
            <span>
              <Link
                href="#"
                className="text-brand-cyan underline-offset-2 transition hover:text-white hover:underline"
              >
                Mon agenda du jour
             </Link>{" "}
              · 2 réunions, 1 échéance
           </span>
            <span aria-hidden className="hidden h-1 w-1 rounded-full bg-white/30 md:block" />
            <Link
              href="#"
              className="text-brand-cyan underline-offset-2 transition hover:text-white hover:underline"
            >
              Mes tâches (4)
           </Link>
         </div>
       </div>
     </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-cyan/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-cyan/10 blur-3xl"
      />
   </section>
  );
}
