import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LucideIcon } from "@/lib/lucide-icon";
import type {
  HomeEvent,
  HomeFeaturedDoc,
  HomeQuickAccess,
} from "@/types/intranet";

// Web Part SPFx ↦ « Documents clés + Accès rapide + Événements »
// Données reçues par props (plain-serializable). Les noms d'icônes
// sont des strings → résolus via LucideIcon (mapping nom→composant).

interface FirstSectionProps {
  featuredDocs: HomeFeaturedDoc[];
  quickAccess: HomeQuickAccess[];
  events: HomeEvent[];
}

const EVENT_TAG_COLORS: Record<string, string> = {
  Stratégie: "bg-blue-100 text-blue-700",
  Tech: "bg-violet-100 text-violet-700",
  Innovation: "bg-emerald-100 text-emerald-700",
  SecOps: "bg-rose-100 text-rose-700",
};

function tagColor(tag: string) {
  return EVENT_TAG_COLORS[tag] ?? "bg-slate-100 text-slate-700";
}

export default function FirstSectionA({
  featuredDocs,
  quickAccess,
  events,
}: FirstSectionProps) {
  return (
    <section className="w-full bg-slate-50 px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* ── FEATURED DOCUMENTS ── */}
        <div>
          <div className="mb-6 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-brand-accent" />
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Documents clés
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {featuredDocs.map((doc, i) => (
              <Link
                key={i}
                href={doc.href}
                className="group flex h-32 cursor-pointer flex-col justify-between rounded-2xl bg-slate-900 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
              >
                <LucideIcon
                  name={doc.icon}
                  size={26}
                  className="text-white opacity-60 transition-opacity group-hover:opacity-100"
                />
                <span className="mt-2 text-sm font-semibold leading-tight text-white">
                  {doc.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── QUICK ACCESS ── */}
        <div>
          <div className="mb-6 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-brand-accent" />
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Accès rapide
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {quickAccess.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left shadow-sm transition-all duration-200 hover:border-brand-accent/30 hover:bg-brand-accent-soft hover:shadow-md"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-accent transition-all duration-200 group-hover:scale-110">
                  <LucideIcon name={item.icon} size={16} className="text-white" />
                </div>
                <span className="text-xs font-semibold leading-tight text-slate-700 group-hover:text-brand-accent">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── EVENTS ── */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-brand-accent" />
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                Événements
              </h2>
            </div>
            <Link
              href="/histoire"
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-brand-accent"
            >
              Voir tout <ChevronRight size={13} />
            </Link>
          </div>

          {/* Event list */}
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="group flex cursor-pointer items-center gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-accent/30 hover:shadow-md"
              >
                {/* Date badge */}
                <div className="flex w-14 shrink-0 flex-col items-center justify-center bg-slate-900 py-3 text-white">
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                    {event.month}
                  </span>
                  <span className="text-2xl font-extrabold leading-tight">
                    {event.day}
                  </span>
                </div>

                {/* Image */}
                <div className="relative h-16 w-14 shrink-0 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-1 px-4 py-2">
                  <p className="text-sm font-bold leading-tight text-slate-900 transition-colors group-hover:text-brand-accent">
                    {event.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] text-slate-400">{event.date}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tagColor(event.tag)}`}
                    >
                      {event.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
