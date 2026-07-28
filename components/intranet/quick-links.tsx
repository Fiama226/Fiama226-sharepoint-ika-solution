import Link from "next/link";

import type { QuickLink } from "@/types/intranet";

import { Icon } from "./icon";

export interface QuickLinksProps {
  links: QuickLink[];
  title?: string;
}

export function QuickLinks({ links, title = "Accès rapide" }: QuickLinksProps) {
  if (!links.length) return null;

  return (
    <section aria-labelledby="quick-links-title">
      <h2 id="quick-links-title" className="text-lg font-semibold text-brand-navy">
        {title}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.id}>
            <Link
              href={link.href}
              prefetch
              className="group flex h-full items-start gap-3 rounded-lg border border-brand-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-cyan hover:shadow-sm"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-surface text-brand-navy transition-colors group-hover:bg-brand-cyan group-hover:text-white">
                <Icon name={link.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-brand-ink group-hover:text-brand-navy">
                  {link.label}
                </span>
                {link.description ? (
                  <span className="mt-0.5 block text-sm text-brand-muted">
                    {link.description}
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
