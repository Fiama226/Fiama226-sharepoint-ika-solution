import type { EventItem } from "@/types/intranet";

import { formatDate } from "@/lib/data";

export interface EventsCalendarProps {
  events: EventItem[];
  title?: string;
}

export function EventsCalendar({
  events,
  title = "Prochains événements",
}: EventsCalendarProps) {
  if (!events.length) return null;

  const items = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section aria-labelledby="events-title">
      <h2 id="events-title" className="text-lg font-semibold text-brand-navy">
        {title}
      </h2>
      <ul className="mt-4 space-y-2">
        {items.map((evt) => {
          const d = new Date(evt.date);
          const day = d.toLocaleDateString("fr-FR", { day: "2-digit" });
          const month = d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "");
          return (
            <li key={evt.id}>
              <article className="flex items-center gap-3 rounded-lg border border-brand-line bg-white p-3 transition-colors hover:border-brand-cyan">
                <span className="grid h-12 w-12 shrink-0 flex-col place-content-center rounded-md bg-brand-navy text-center text-white">
                  <span className="text-lg font-bold leading-none">{day}</span>
                  <span className="text-[10px] uppercase tracking-wide text-brand-cyan">
                    {month}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-brand-ink">{evt.title}</p>
                  <p className="mt-0.5 text-xs text-brand-muted">
                    {formatDate(evt.date)} à {evt.time} · {evt.location}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-surface px-2.5 py-0.5 text-xs font-medium text-brand-navy">
                  {evt.category}
                </span>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
