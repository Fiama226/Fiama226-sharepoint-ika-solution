import type { Metadata } from "next";
import { getHomeAnnouncements } from "@/lib/data";

export const metadata: Metadata = {
  title: "Annonces — IKA Solution",
  description:
    "Toutes les annonces internes : mariages, anniversaires, événements et plus.",
};

export default function AnnouncementsPage() {
  const announcements = getHomeAnnouncements();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-cyan">
          Annonces
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-brand-navy">
          Toutes les annonces
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-muted">
          Retrouvez ici les événements internes, célébrations et messages
          d’équipe.
        </p>
      </header>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <article
            key={announcement.id}
            className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start gap-3">
              <span className="text-3xl" aria-hidden>
                {announcement.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold text-brand-navy">
                  {announcement.title}
                </h2>
                <p className="mt-1 text-sm text-brand-muted">
                  {announcement.date}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-brand-ink">
              {announcement.detail}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
