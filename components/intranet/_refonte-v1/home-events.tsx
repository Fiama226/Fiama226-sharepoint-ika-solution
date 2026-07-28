import Link from "next/link";
import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";

import type { EventItem } from "@/types/intranet";
import { formatDate } from "@/lib/data";

type Props = {
  events: EventItem[];
};

export function HomeEvents({ events }: Props) {
  if (!events.length) return null;

  const items = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <section aria-labelledby="events-title" className="bg-white">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-cyan-dark">
            <CalendarDays className="h-4 w-4" /> Agenda
          </p>
          <h2
            id="events-title"
            className="mt-1 text-xl font-bold tracking-tight text-brand-navy sm:text-2xl"
          >
            Événements à venir
          </h2>
        </div>
        <Link
          href="#"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-cyan-dark transition hover:text-brand-cyan"
        >
          Calendrier complet
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((evt) => {
          const d = new Date(evt.date);
          const day = d.toLocaleDateString("fr-FR", { day: "2-digit" });
          const month = d
            .toLocaleDateString("fr-FR", { month: "short" })
            .replace(".", "");
          return (
            <li key={evt.id}>
              <article className="group flex h-full items-center gap-4 rounded-2xl border border-brand-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-cyan/60 hover:shadow-md">
                <span className="grid h-14 w-14 shrink-0 flex-col place-content-center rounded-xl bg-brand-navy text-center text-white transition-colors group-hover:bg-brand-cyan">
                  <span className="text-xl font-bold leading-none">{day}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-cyan group-hover:text-white">
                    {month}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex w-fit rounded-full bg-brand-surface px-2 py-0.5 text-[11px] font-medium text-brand-navy">
                    {evt.category}
                  </span>
                  <h3 className="mt-1 font-semibold leading-tight text-brand-ink group-hover:text-brand-navy">
                    {evt.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-brand-muted">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(evt.date)} · {evt.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {evt.location}
                    </span>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
