import * as React from "react";

import { IAnnouncementMarqueeProps } from "./IAnnouncementMarqueeProps";
import { IAnnouncement } from "../../../models/IIkaModels";
import { cn, formatDate } from "../../../common/utils/spUtils";

const ACCENTS = ["ika-bg-brand-cyan", "ika-bg-brand-navy/25"];

const EMOJI_BY_TYPE: Record<string, string> = {
  Mariage: "💍",
  Anniversaire: "🎉",
  Naissance: "👶",
  Événement: "📅",
  Départ: "👋",
  Arrivée: "🌟",
  Promotion: "🏆",
};

function emojiFor(item: IAnnouncement): string {
  return item.Emoji || EMOJI_BY_TYPE[item.AnnouncementType] || "📌";
}

export const AnnouncementMarquee: React.FC<IAnnouncementMarqueeProps> = (
  props
) => {
  const { eyebrow, title, announcements, loading, error, seeAllUrl } = props;

  if (loading) {
    return (
      <div className="ika-root">
        <section className="ika-mb-8 ika-overflow-hidden ika-rounded-3xl ika-bg-white ika-p-6 ika-shadow-sm">
          <div className="ika-animate-pulse ika-space-y-3" aria-hidden="true">
            <div className="ika-h-3 ika-w-24 ika-rounded ika-bg-slate-200" />
            <div className="ika-h-5 ika-w-64 ika-rounded ika-bg-slate-200" />
            <div className="ika-h-16 ika-w-full ika-rounded-2xl ika-bg-slate-100" />
          </div>
        </section>
      </div>
    );
  }

  if (error || !announcements || announcements.length === 0) {
    return null;
  }

  const doubled = announcements.concat(announcements);

  return (
    <div className="ika-root">
      <section
        className="ika-mb-8 ika-overflow-hidden ika-rounded-3xl ika-bg-white ika-shadow-sm"
        aria-labelledby="ika-marquee-title"
      >
        <div className="ika-flex ika-flex-col ika-gap-4 ika-px-4 ika-py-5 sm:ika-px-6 lg:ika-px-8">
          <div className="ika-flex ika-flex-col ika-gap-3 sm:ika-flex-row sm:ika-items-center sm:ika-justify-between">
            <div>
              <div className="ika-flex ika-items-center ika-gap-2">
                <span className="ika-relative ika-flex ika-h-1.5 ika-w-1.5">
                  <span className="ika-absolute ika-inline-flex ika-h-full ika-w-full ika-animate-ping ika-rounded-full ika-bg-brand-cyan ika-opacity-75 motion-reduce:ika-animate-none" />
                  <span className="ika-relative ika-inline-flex ika-h-1.5 ika-w-1.5 ika-rounded-full ika-bg-brand-cyan" />
                </span>
                <p className="ika-text-xs ika-font-semibold ika-uppercase ika-tracking-[0.3em] ika-text-slate-500">
                  {eyebrow}
                </p>
              </div>
              <h2
                id="ika-marquee-title"
                className="ika-mt-1 ika-text-lg ika-font-semibold ika-text-brand-navy sm:ika-text-xl"
              >
                {title}
              </h2>
            </div>

            {seeAllUrl ? (
              <a
                href={seeAllUrl}
                data-interception="propagate"
                className="ika-group ika-inline-flex ika-w-fit ika-items-center ika-gap-1.5 ika-rounded-full ika-border ika-border-slate-200 ika-bg-slate-50 ika-px-4 ika-py-2 ika-text-sm ika-font-medium ika-text-brand-navy ika-transition-colors hover:ika-border-slate-300 hover:ika-bg-slate-100"
              >
                Voir toutes les annonces
                <span
                  aria-hidden="true"
                  className="ika-transition-transform group-hover:ika-translate-x-0.5"
                >
                  →
                </span>
              </a>
            ) : null}
          </div>

          <div className="ika-group ika-relative ika-overflow-hidden ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-slate-50">
            <div
              aria-hidden="true"
              className="ika-pointer-events-none ika-absolute ika-inset-y-0 ika-left-0 ika-z-10 ika-w-10 ika-bg-gradient-to-r ika-from-slate-50 ika-to-transparent sm:ika-w-16"
            />
            <div
              aria-hidden="true"
              className="ika-pointer-events-none ika-absolute ika-inset-y-0 ika-right-0 ika-z-10 ika-w-10 ika-bg-gradient-to-l ika-from-slate-50 ika-to-transparent sm:ika-w-16"
            />

            <div
              aria-hidden="true"
              className="ika-animate-marquee ika-flex ika-items-stretch ika-gap-4 ika-whitespace-nowrap ika-py-3 group-hover:[animation-play-state:paused] motion-reduce:ika-animate-none"
            >
              {doubled.map((item, index) => (
                <div
                  key={`${item.Id}-${index}`}
                  className="ika-inline-flex ika-items-center ika-gap-4 ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-py-2.5 ika-pl-0 ika-pr-4 ika-text-sm ika-leading-tight ika-shadow-sm"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "ika-h-8 ika-w-1 ika-shrink-0 ika-self-stretch ika-rounded-full",
                      ACCENTS[index % ACCENTS.length]
                    )}
                  />
                  <span className="ika-flex ika-items-center ika-gap-2">
                    <span className="ika-text-base">{emojiFor(item)}</span>
                    <span className="ika-flex ika-flex-col">
                      <span className="ika-font-semibold ika-text-brand-navy">
                        {item.Title}
                      </span>
                      <span className="ika-text-slate-500">{item.Detail}</span>
                    </span>
                  </span>
                  <span className="ika-ml-2 ika-shrink-0 ika-rounded-full ika-bg-slate-100 ika-px-2.5 ika-py-1 ika-text-[11px] ika-font-semibold ika-uppercase ika-tracking-[0.14em] ika-text-slate-500">
                    {formatDate(item.AnnouncementDate)}
                  </span>
                </div>
              ))}
            </div>

            <ul className="ika-sr-only">
              {announcements.map((item) => (
                <li key={item.Id}>
                  {item.Title} — {item.Detail} (
                  {formatDate(item.AnnouncementDate)})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
