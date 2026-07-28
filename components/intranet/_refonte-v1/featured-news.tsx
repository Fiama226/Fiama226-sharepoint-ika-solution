import Link from "next/link";
import { Megaphone, ArrowRight, Sparkles } from "lucide-react";

import type { News } from "@/types/intranet";
import { formatDate } from "@/lib/data";

const CATEGORY_LABEL: Record<string, string> = {
  projet: "Projet",
  entreprise: "Entreprise",
  evenement: "Événement",
  finance: "Finance",
  rh: "RH",
  admin: "Admin",
  commercial: "Commercial",
  technique: "Technique",
};

type Props = {
  news: News[];
};

export function FeaturedNews({ news }: Props) {
  const featured = news.find((n) => n.highlighted) ?? news[0];
  if (!featured) return null;

  const others = news.filter((n) => n.id !== featured.id).slice(0, 3);

  return (
    <section aria-labelledby="featured-news-title" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-cyan-dark">
              <Sparkles className="h-3.5 w-3.5" /> À la une
          </p>
            <h2
              id="featured-news-title"
              className="mt-2 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl"
            >
              Actualité phare
          </h2>
        </div>
          <Link
            href="#"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-cyan-dark transition hover:text-brand-cyan"
          >
            Toutes les actualités
            <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <article className="group relative overflow-hidden rounded-2xl border border-brand-line bg-brand-navy text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-navy-dark via-brand-navy to-brand-navy-light" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-cyan/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-brand-cyan/10 blur-3xl"
            />

            <div className="relative grid h-full gap-6 p-8 lg:grid-cols-1">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-cyan/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-cyan">
                <Megaphone className="h-3.5 w-3.5" />
                {CATEGORY_LABEL[featured.category] ?? featured.category}
            </span>

              <div>
                <h3 className="text-2xl font-bold leading-tight sm:text-3xl">
                  {featured.title}
              </h3>
                <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
                  {featured.excerpt}
              </p>
            </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
                <div className="text-sm text-white/70">
                  <span className="font-medium text-white">{featured.author}</span>
                  <span aria-hidden className="mx-2">·</span>
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>
              </div>
                <Link
                  href="#"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-cyan px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-cyan-dark"
                >
                  Lire l&rsquo;article
                  <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>

          <ul className="grid gap-3">
            {others.map((item) => (
              <li key={item.id}>
                <Link
                  href="#"
                  className="group flex h-full flex-col gap-2 rounded-2xl border border-brand-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-cyan/60 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-brand-muted">
                    <span className="rounded-full bg-brand-surface px-2 py-0.5 text-brand-cyan-dark">
                      {CATEGORY_LABEL[item.category] ?? item.category}
                  </span>
                    <time dateTime={item.date} className="text-brand-muted">
                      {formatDate(item.date)}
                  </time>
                </div>
                  <h4 className="text-base font-bold leading-tight text-brand-navy transition group-hover:text-brand-cyan-dark">
                    {item.title}
                </h4>
                  <p className="text-sm text-brand-muted line-clamp-2">
                    {item.excerpt}
                </p>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-cyan-dark">
                    Lire
                    <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </li>
            ))}
        </ul>
      </div>
    </div>
  </section>
  );
}
