import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { QuickLink } from "@/types/intranet";
import { Icon } from "@/components/intranet/icon";

type Props = {
  links: QuickLink[];
};

export function HomeQuickLinks({ links }: Props) {
  if (!links.length) return null;

  return (
    <section aria-labelledby="quick-links-title" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-brand-cyan-dark">
              Racourcis
            </p>
            <h2
              id="quick-links-title"
              className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl"
            >
              Acces rapide
            </h2>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-cyan-dark transition hover:text-brand-cyan"
          >
            Tous les outils
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <li key={link.id}>
              <Link
                href={link.href}
                className="group flex h-full items-center gap-4 rounded-2xl border border-brand-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-cyan/60 hover:shadow-md"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-surface text-brand-navy transition-colors group-hover:bg-brand-cyan group-hover:text-white">
                  <Icon name={link.icon} className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-brand-ink group-hover:text-brand-navy">
                    {link.label}
                  </span>
                  {link.description ? (
                    <span className="mt-0.5 block text-sm text-brand-muted">
                      {link.description}
                    </span>
                  ) : null}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-brand-muted transition-all group-hover:translate-x-1 group-hover:text-brand-cyan" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
