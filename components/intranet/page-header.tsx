import Link from "next/link";

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export function PageHeader({
  title,
  description,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {breadcrumb?.length ? (
          <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-white/70">
            <ol className="flex flex-wrap items-center gap-1">
              {breadcrumb.map((b, i) => {
                const last = i === breadcrumb.length - 1;
                return (
                  <li key={i} className="flex items-center gap-1">
                    {b.href && !last ? (
                      <Link href={b.href} className="hover:text-white hover:underline">
                        {b.label}
                      </Link>
                    ) : (
                      <span className={last ? "text-white" : ""}>{b.label}</span>
                    )}
                    {!last && <span aria-hidden>/</span>}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base text-white/80">{description}</p>
        ) : null}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-cyan/20 blur-2xl"
      />
    </section>
  );
}
