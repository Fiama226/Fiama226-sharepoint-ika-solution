import Link from "next/link";
import {
  FaBullhorn,
  FaCalendarDay,
  FaArrowRight,
  FaStar,
  FaFire,
} from "react-icons/fa6";
import type { HomeAnnouncement } from "@/types/intranet";

interface AnnouncementMarqueeProps {
  announcements: HomeAnnouncement[];
}

// Palette de couleurs variées pour distinguer visuellement les annonces
const ACCENT_VARIANTS = [
  {
    bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    bg: "bg-gradient-to-r from-purple-500 to-pink-500",
    glow: "shadow-purple-500/20",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    bg: "bg-gradient-to-r from-orange-500 to-red-500",
    glow: "shadow-orange-500/20",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    bg: "bg-gradient-to-r from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

// Détermine le niveau d'importance d'une annonce (peut être ajouté au type)
const getPriorityIcon = (index: number) => {
  if (index === 0) return <FaFire className="text-orange-500" />;
  if (index === 1) return <FaStar className="text-yellow-500" />;
  return <FaBullhorn className="text-slate-400" />;
};

export default function AnnouncementMarquee({
  announcements,
}: AnnouncementMarqueeProps) {
  const hasAnnouncements = announcements.length > 0;

  return (
    <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white border border-slate-200/60 shadow-lg shadow-slate-900/5 backdrop-blur-sm">
      <div className="flex flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header amélioré */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            {/* Badge animé */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-cyan/10 to-blue-500/10 px-3.5 py-1.5 border border-brand-cyan/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cyan opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-cyan shadow-lg shadow-brand-cyan/50" />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/80">
                Actualités
              </span>
              <span className="rounded-full bg-brand-cyan/20 px-2 py-0.5 text-[10px] font-bold text-brand-navy">
                {announcements.length}
              </span>
            </div>

            {/* Titre avec icône */}
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-gradient-to-br from-brand-cyan to-blue-500 p-2 shadow-lg shadow-brand-cyan/30">
                <FaBullhorn className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-brand-navy sm:text-2xl bg-gradient-to-r from-brand-navy to-brand-navy/70 bg-clip-text text-transparent">
                Célébrations & événements
              </h2>
            </div>
          </div>

          {/* Bouton CTA amélioré */}
          <Link
            href="/annonces"
            className="group relative inline-flex w-fit items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-navy/25 transition-all hover:shadow-xl hover:shadow-brand-navy/40 hover:scale-105 active:scale-95"
          >
            {/* Effet de brillance au survol */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

            <span className="relative flex items-center gap-2">
              Toutes les annonces
              <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        {/* Marquee avec design amélioré */}
        {hasAnnouncements ? (
          <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white shadow-inner">
            {/* Gradients de fade améliorés */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-white via-slate-50/90 to-transparent sm:w-20"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-white via-slate-50/90 to-transparent sm:w-20"
            />

            {/* Conteneur du marquee */}
            <div
              className="animate-marquee flex items-stretch gap-4 whitespace-nowrap py-4 px-2 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
              aria-hidden="true"
            >
              {[...announcements, ...announcements].map((announcement, i) => {
                const variant = ACCENT_VARIANTS[i % ACCENT_VARIANTS.length];
                const originalIndex = i % announcements.length;

                return (
                  <div
                    key={`${announcement.id}-${i}`}
                    className={`
                      group/card relative inline-flex items-center gap-4 
                      rounded-xl border border-slate-200 bg-white 
                      py-3 pl-1 pr-4 text-sm leading-tight 
                      shadow-md ${variant.glow}
                      transition-all duration-300
                      hover:shadow-xl hover:scale-105 hover:-translate-y-1
                      cursor-pointer
                    `}
                  >
                    {/* Barre d'accent avec gradient */}
                    <span
                      className={`h-12 w-1.5 shrink-0 self-stretch rounded-full ${variant.bg} shadow-lg`}
                      aria-hidden
                    />

                    {/* Icône de priorité */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 group-hover/card:scale-110 transition-transform">
                      {getPriorityIcon(originalIndex)}
                    </div>

                    {/* Contenu */}
                    <span className="flex flex-col gap-1 min-w-0">
                      <span className="font-bold text-brand-navy flex items-center gap-2">
                        {announcement.title}
                        {originalIndex === 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-[10px] font-bold text-red-600 uppercase tracking-wider animate-pulse">
                            <span className="w-1 h-1 rounded-full bg-red-500" />
                            Nouveau
                          </span>
                        )}
                      </span>
                      <span className="text-slate-600 text-xs leading-relaxed">
                        {announcement.detail}
                      </span>
                    </span>

                    {/* Badge de date amélioré */}
                    <span
                      className={`
                      ml-2 shrink-0 inline-flex items-center gap-1.5
                      rounded-lg border px-3 py-1.5
                      text-[11px] font-bold uppercase tracking-wider
                      ${variant.badge}
                      transition-all group-hover/card:scale-105
                    `}
                    >
                      <FaCalendarDay className="h-2.5 w-2.5" />
                      {announcement.date}
                    </span>

                    {/* Effet de brillance sur hover */}
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                );
              })}
            </div>

            {/* Liste accessible (inchangée mais améliorée) */}
            <ul className="sr-only">
              {announcements.map((announcement) => (
                <li key={announcement.id}>
                  <strong>{announcement.title}</strong> — {announcement.detail}
                  <time dateTime={announcement.date}>
                    {" "}
                    ({announcement.date})
                  </time>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // État vide élégant
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <FaBullhorn className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium mb-1">
              Aucune annonce pour le moment
            </p>
            <p className="text-slate-400 text-sm">
              Les nouvelles actualités apparaîtront ici
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
