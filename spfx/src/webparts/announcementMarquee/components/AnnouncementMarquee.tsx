import * as React from "react";

import { IAnnouncementMarqueeProps } from "./IAnnouncementMarqueeProps";
import { IAnnouncement } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { cn, formatDate } from "../../../common/utils/spUtils";

/**
 * AnnouncementMarquee — port 1:1 de components/intranet/announcement-marquee.tsx
 * (maquette Next.js) : bandeau d'annonces défilant avec variants d'accent,
 * icônes de priorité, badge « Nouveau », bouton CTA et état vide.
 */

const ACCENT_VARIANTS = [
  {
    bg: "ika-bg-gradient-to-r ika-from-blue-500 ika-to-cyan-500",
    glow: "ika-shadow-blue-500/20",
    badge: "ika-bg-blue-50 ika-text-blue-700 ika-border-blue-200",
  },
  {
    bg: "ika-bg-gradient-to-r ika-from-purple-500 ika-to-pink-500",
    glow: "ika-shadow-purple-500/20",
    badge: "ika-bg-purple-50 ika-text-purple-700 ika-border-purple-200",
  },
  {
    bg: "ika-bg-gradient-to-r ika-from-orange-500 ika-to-red-500",
    glow: "ika-shadow-orange-500/20",
    badge: "ika-bg-orange-50 ika-text-orange-700 ika-border-orange-200",
  },
  {
    bg: "ika-bg-gradient-to-r ika-from-emerald-500 ika-to-teal-500",
    glow: "ika-shadow-emerald-500/20",
    badge: "ika-bg-emerald-50 ika-text-emerald-700 ika-border-emerald-200",
  },
];

const getPriorityIcon = (index: number): React.ReactElement => {
  if (index === 0)
    return <Icon name="fa-fire" className="ika-h-4 ika-w-4 ika-text-orange-500" />;
  if (index === 1)
    return <Icon name="fa-star" className="ika-h-4 ika-w-4 ika-text-yellow-500" />;
  return <Icon name="fa-bullhorn" className="ika-h-4 ika-w-4 ika-text-slate-400" />;
};

export const AnnouncementMarquee: React.FC<IAnnouncementMarqueeProps> = (
  props
) => {
  const { eyebrow, title, announcements, loading, error, seeAllUrl } = props;

  if (loading) {
    return (
      <div className="ika-root">
        <section className="ika-mb-8 ika-overflow-hidden ika-rounded-2xl ika-bg-white ika-p-6 ika-shadow-sm">
          <div className="ika-animate-pulse ika-space-y-3" aria-hidden="true">
            <div className="ika-h-3 ika-w-24 ika-rounded ika-bg-slate-200" />
            <div className="ika-h-5 ika-w-64 ika-rounded ika-bg-slate-200" />
            <div className="ika-h-16 ika-w-full ika-rounded-xl ika-bg-slate-100" />
          </div>
        </section>
      </div>
    );
  }

  const hasAnnouncements =
    !error && announcements && announcements.length > 0;

  return (
    <div className="ika-root">
      <section className="ika-mb-8 ika-overflow-hidden ika-rounded-2xl ika-border ika-border-slate-200/60 ika-bg-gradient-to-br ika-from-white ika-via-slate-50/50 ika-to-white ika-shadow-lg ika-shadow-slate-900/5 ika-backdrop-blur-sm">
        <div className="ika-flex ika-flex-col ika-gap-5 ika-px-4 ika-py-6 sm:ika-px-6 lg:ika-px-8">
          {/* Header */}
          <div className="ika-flex ika-flex-col ika-gap-4 sm:ika-flex-row sm:ika-items-center sm:ika-justify-between">
            <div className="ika-space-y-2">
              {/* Badge animé */}
              <div className="ika-inline-flex ika-items-center ika-gap-2.5 ika-rounded-full ika-border ika-border-brand-cyan/20 ika-bg-gradient-to-r ika-from-brand-cyan/10 ika-to-blue-500/10 ika-px-3.5 ika-py-1.5">
                <span className="ika-relative ika-flex ika-h-2 ika-w-2">
                  <span className="ika-absolute ika-inline-flex ika-h-full ika-w-full ika-animate-ping ika-rounded-full ika-bg-brand-cyan ika-opacity-75 motion-reduce:ika-animate-none" />
                  <span className="ika-relative ika-inline-flex ika-h-2 ika-w-2 ika-rounded-full ika-bg-brand-cyan ika-shadow-lg ika-shadow-brand-cyan/50" />
                </span>
                <span className="ika-text-xs ika-font-bold ika-uppercase ika-tracking-[0.2em] ika-text-brand-navy/80">
                  {eyebrow || "Annonces"}
                </span>
                <span className="ika-rounded-full ika-bg-brand-cyan/20 ika-px-2 ika-py-0.5 ika-text-[10px] ika-font-bold ika-text-brand-navy">
                  {hasAnnouncements ? announcements.length : 0}
                </span>
              </div>

              {/* Titre */}
              <div className="ika-flex ika-items-center ika-gap-2.5">
                <div className="ika-rounded-lg ika-bg-gradient-to-br ika-from-brand-cyan ika-to-blue-500 ika-p-2 ika-shadow-lg ika-shadow-brand-cyan/30">
                  <Icon name="fa-bullhorn" className="ika-h-4 ika-w-4 ika-text-white" />
                </div>
                <h2 className="ika-bg-gradient-to-r ika-from-brand-navy ika-to-brand-navy/70 ika-bg-clip-text ika-text-xl ika-font-bold ika-text-transparent sm:ika-text-2xl">
                  {title || "Célébrations & événements"}
                </h2>
              </div>
            </div>

            {/* CTA */}
            <a
              href={seeAllUrl || "#annonces"}
              data-interception="propagate"
              onClick={(e) => {
                if (!seeAllUrl) {
                  e.preventDefault();
                  window.location.hash = "#annonces";
                }
              }}
              className="ika-group ika-relative ika-inline-flex ika-w-fit ika-items-center ika-gap-2.5 ika-overflow-hidden ika-rounded-xl ika-bg-gradient-to-r ika-from-brand-navy ika-to-brand-navy/90 ika-px-5 ika-py-2.5 ika-text-sm ika-font-semibold ika-text-white ika-shadow-lg ika-shadow-brand-navy/25 ika-transition-all hover:ika-scale-105 hover:ika-shadow-xl hover:ika-shadow-brand-navy/40 active:ika-scale-95"
            >
              <span
                aria-hidden="true"
                className="ika-absolute ika-inset-0 ika-bg-gradient-to-r ika-from-transparent ika-via-white/20 ika-to-transparent ika-translate-x-[-200%] ika-transition-transform ika-duration-1000 group-hover:ika-translate-x-[200%]"
              />
              <span className="ika-relative ika-flex ika-items-center ika-gap-2">
                Toutes les annonces
                <Icon
                  name="fa-arrow-right"
                  className="ika-h-3.5 ika-w-3.5 ika-transition-transform group-hover:ika-translate-x-1"
                />
              </span>
            </a>
          </div>

          {/* Marquee */}
          {hasAnnouncements ? (
            <div className="ika-group ika-relative ika-overflow-hidden ika-rounded-xl ika-border ika-border-slate-200/80 ika-bg-gradient-to-br ika-from-slate-50 ika-to-white ika-shadow-inner">
              {/* Gradients de fade */}
              <div
                aria-hidden="true"
                className="ika-pointer-events-none ika-absolute ika-inset-y-0 ika-left-0 ika-z-20 ika-w-12 ika-bg-gradient-to-r ika-from-white ika-via-slate-50/90 ika-to-transparent sm:ika-w-20"
              />
              <div
                aria-hidden="true"
                className="ika-pointer-events-none ika-absolute ika-inset-y-0 ika-right-0 ika-z-20 ika-w-12 ika-bg-gradient-to-l ika-from-white ika-via-slate-50/90 ika-to-transparent sm:ika-w-20"
              />

              <div
                aria-hidden="true"
                className="ika-animate-marquee ika-flex ika-items-stretch ika-gap-4 ika-whitespace-nowrap ika-px-2 ika-py-4 group-hover:[animation-play-state:paused] motion-reduce:ika-animate-none"
              >
                {announcements.concat(announcements).map((announcement, i) => {
                  const variant = ACCENT_VARIANTS[i % ACCENT_VARIANTS.length];
                  const originalIndex = i % announcements.length;

                  return (
                    <div
                      key={`${announcement.Id}-${i}`}
                      className={cn(
                        "ika-group/card ika-relative ika-inline-flex ika-items-center ika-gap-4",
                        "ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white",
                        "ika-py-3 ika-pl-1 ika-pr-4 ika-text-sm ika-leading-tight",
                        "ika-shadow-md ika-transition-all ika-duration-300",
                        "hover:ika-scale-105 hover:-ika-translate-y-1 hover:ika-shadow-xl",
                        variant.glow,
                        "ika-cursor-pointer"
                      )}
                    >
                      {/* Barre d'accent */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "ika-h-12 ika-w-1.5 ika-shrink-0 ika-self-stretch ika-rounded-full ika-shadow-lg",
                          variant.bg
                        )}
                      />

                      {/* Icône de priorité */}
                      <div className="ika-flex ika-h-8 ika-w-8 ika-items-center ika-justify-center ika-rounded-lg ika-border ika-border-slate-200 ika-bg-slate-50 ika-transition-transform group-hover/card:ika-scale-110">
                        {getPriorityIcon(originalIndex)}
                      </div>

                      {/* Contenu */}
                      <span className="ika-flex ika-min-w-0 ika-flex-col ika-gap-1">
                        <span className="ika-flex ika-items-center ika-gap-2 ika-font-bold ika-text-brand-navy">
                          {announcement.Title}
                          {originalIndex === 0 && (
                            <span className="ika-inline-flex ika-animate-pulse ika-items-center ika-gap-1 ika-rounded-full ika-border ika-border-red-200 ika-bg-red-50 ika-px-2 ika-py-0.5 ika-text-[10px] ika-font-bold ika-uppercase ika-tracking-wider ika-text-red-600">
                              <span className="ika-h-1 ika-w-1 ika-rounded-full ika-bg-red-500" />
                              Nouveau
                            </span>
                          )}
                        </span>
                        <span className="ika-text-xs ika-leading-relaxed ika-text-slate-600">
                          {announcement.Detail}
                        </span>
                      </span>

                      {/* Badge de date */}
                      <span
                        className={cn(
                          "ika-ml-2 ika-inline-flex ika-shrink-0 ika-items-center ika-gap-1.5",
                          "ika-rounded-lg ika-border ika-px-3 ika-py-1.5",
                          "ika-text-[11px] ika-font-bold ika-uppercase ika-tracking-wider",
                          "ika-transition-all group-hover/card:ika-scale-105",
                          variant.badge
                        )}
                      >
                        <Icon name="fa-calendar-day" className="ika-h-2.5 ika-w-2.5" />
                        {formatDate(announcement.AnnouncementDate)}
                      </span>

                      {/* Effet de brillance */}
                      <span className="ika-pointer-events-none ika-absolute ika-inset-0 ika-rounded-xl ika-bg-gradient-to-r ika-from-transparent ika-via-white/40 ika-to-transparent ika-opacity-0 ika-transition-opacity group-hover/card:ika-opacity-100" />
                    </div>
                  );
                })}
              </div>

              {/* Liste accessible */}
              <ul className="ika-sr-only">
                {announcements.map((announcement) => (
                  <li key={announcement.Id}>
                    <strong>{announcement.Title}</strong> —{" "}
                    {announcement.Detail} (
                    {formatDate(announcement.AnnouncementDate)})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            /* État vide */
            <div className="ika-flex ika-flex-col ika-items-center ika-justify-center ika-rounded-xl ika-border-2 ika-border-dashed ika-border-slate-200 ika-bg-slate-50/50 ika-px-4 ika-py-12">
              <div className="ika-mb-4 ika-rounded-full ika-bg-slate-100 ika-p-4">
                <Icon name="fa-bullhorn" className="ika-h-8 ika-w-8 ika-text-slate-400" />
              </div>
              <p className="ika-mb-1 ika-font-medium ika-text-slate-500">
                Aucune annonce pour le moment
              </p>
              <p className="ika-text-sm ika-text-slate-400">
                Les nouvelles actualités apparaîtront ici
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
