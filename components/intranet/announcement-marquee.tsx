import Link from "next/link";
import type { HomeAnnouncement } from "@/types/intranet";

interface AnnouncementMarqueeProps {
  announcements: HomeAnnouncement[];
}

// Alternating accent tones so cards read as distinct without relying on
// emoji. Kept subtle to stay corporate rather than playful.
const ACCENTS = ["bg-brand-cyan", "bg-brand-navy/25"];

export default function AnnouncementMarquee({
  announcements,
}: AnnouncementMarqueeProps) {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl border-none bg-white shadow-sm shadow-slate-900/5">
      <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cyan opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-cyan" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Annonces
              </p>
            </div>
            <h2 className="mt-1 text-lg font-semibold text-brand-navy sm:text-xl">
              Célébrations &amp; événements
            </h2>
          </div>

          <Link
            href="/annonces"
            className="group inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-brand-navy transition-colors hover:border-slate-300 hover:bg-slate-100"
          >
            Voir toutes les annonces
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>

        {/* Marquee */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {/* Edge fades signal continuous scroll instead of an abrupt cut */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-slate-50 to-transparent sm:w-16"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-slate-50 to-transparent sm:w-16"
          />

          <div
            className="animate-marquee flex items-stretch gap-4 whitespace-nowrap py-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
            aria-hidden="true"
          >
            {[...announcements, ...announcements].map((announcement, i) => (
              <div
                key={`${announcement.id}-${i}`}
                className="inline-flex items-center gap-4 rounded-xl border border-slate-200 bg-white py-2.5 pl-0 pr-4 text-sm leading-tight shadow-sm shadow-slate-900/5"
              >
                <span
                  className={`h-8 w-1 shrink-0 self-stretch rounded-full ${
                    ACCENTS[i % ACCENTS.length]
                  }`}
                  aria-hidden
                />
                <span className="flex flex-col">
                  <span className="font-semibold text-brand-navy">
                    {announcement.title}
                  </span>
                  <span className="text-slate-500">{announcement.detail}</span>
                </span>
                <span className="ml-2 shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {announcement.date}
                </span>
              </div>
            ))}
          </div>

          {/* Accessible fallback: the scrolling row above is decorative and
              hidden from assistive tech; screen reader users get a static list. */}
          <ul className="sr-only">
            {announcements.map((announcement) => (
              <li key={announcement.id}>
                {announcement.title} — {announcement.detail} (
                {announcement.date})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
