import type { News } from "@/types/intranet";

import { formatDate } from "@/lib/data";

export interface NewsListProps {
  news: News[];
  title?: string;
  limit?: number;
}
const CATEGORY_LABEL: Record<string, string> = {
  entreprise: "Entreprise",
  rh: "RH",
  projet: "Projet",
  finance: "Finance",
  admin: "Administration",
  commercial: "Commercial",
  technique: "Technique",
  evenement: "Événement",
};

export function NewsList({ news, title = "Actualités", limit }: NewsListProps) {
  const items = limit ? news.slice(0, limit) : news;

  if (!items.length) return null;

  const [highlighted, ...rest] = items;

  return (
    <section aria-labelledby="news-title">
      <div className="flex items-baseline justify-between">
        <h2 id="news-title" className="text-lg font-semibold text-brand-navy">
          {title}
        </h2>
        <span className="text-sm font-medium text-brand-cyan-dark">Voir tout</span>
      </div>

      <div className="mt-4 grid gap-4">
        {highlighted ? (
          <article className="overflow-hidden rounded-xl border border-brand-line bg-white shadow-sm">
            <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand-cyan/15 px-2.5 py-0.5 text-xs font-semibold text-brand-cyan-dark">
                    {CATEGORY_LABEL[highlighted.category] ?? highlighted.category}
                  </span>
                  {highlighted.highlighted ? (
                    <span className="rounded-full bg-brand-navy px-2.5 py-0.5 text-xs font-semibold text-white">
                      À la une
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-brand-ink">
                  {highlighted.title}
                </h3>
                <p className="mt-1 text-sm text-brand-muted">{highlighted.excerpt}</p>
              </div>
            </div>
            <div className="border-t border-brand-line bg-brand-surface/60 px-5 py-3 text-xs text-brand-muted">
              {highlighted.author} · {formatDate(highlighted.date)}
            </div>
          </article>
        ) : null}

        <ul className="grid gap-3 sm:grid-cols-2">
          {rest.map((item) => (
            <li key={item.id}>
              <article className="flex h-full flex-col rounded-lg border border-brand-line bg-white p-4 transition-colors hover:border-brand-cyan">
                <span className="inline-flex w-fit rounded-full bg-brand-surface px-2.5 py-0.5 text-xs font-medium text-brand-navy">
                  {CATEGORY_LABEL[item.category] ?? item.category}
                </span>
                <h3 className="mt-2 font-medium text-brand-ink">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-brand-muted">{item.excerpt}</p>
                <span className="mt-3 text-xs text-brand-muted">
                  {item.author} · {formatDate(item.date)}
                </span>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
