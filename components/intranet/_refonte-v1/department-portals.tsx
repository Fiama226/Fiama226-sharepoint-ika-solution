import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Departement } from "@/types/intranet";
import { Icon } from "@/components/intranet/icon";

type Props = {
  departments: Departement[];
};

export function DepartmentPortals({ departments }: Props) {
  if (!departments.length) return null;

  return (
    <section
      aria-labelledby="portals-title"
      className="border-t border-brand-line bg-brand-surface"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-brand-cyan-dark">
            Sous-sites
          </p>
          <h2
            id="portals-title"
            className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl"
          >
            Portails départementaux
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Accédez directement à l&rsquo;espace de votre département.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/${d.slug}`}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-brand-line bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-cyan/60 hover:shadow-lg"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-navy text-white transition-colors group-hover:bg-brand-cyan">
                  <Icon name={d.icon} className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-tight text-brand-navy group-hover:text-brand-cyan-dark">
                    {d.name}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-brand-ink">{d.tagline}</p>
                </div>
                <p className="text-xs leading-relaxed text-brand-muted">{d.description}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-cyan-dark transition-all group-hover:gap-2">
                  Ouvrir le portail
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
