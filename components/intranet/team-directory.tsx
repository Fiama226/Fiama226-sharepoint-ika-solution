import type { TeamMember } from "@/types/intranet";

import { Icon } from "./icon";

export interface TeamDirectoryProps {
  members: TeamMember[];
  title?: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TeamDirectory({ members, title = "Équipe" }: TeamDirectoryProps) {
  if (!members.length) return null;

  return (
    <section aria-labelledby="team-title">
      <h2 id="team-title" className="text-lg font-semibold text-brand-navy">
        {title}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <li key={m.id}>
            <article className="flex h-full items-start gap-3 rounded-lg border border-brand-line bg-white p-4 transition-colors hover:border-brand-cyan">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-navy text-sm font-semibold text-white">
                {initials(m.name)}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-brand-ink">{m.name}</p>
                <p className="text-sm text-brand-muted">{m.role}</p>
                <dl className="mt-2 space-y-0.5 text-xs text-brand-muted">
                  <div className="flex items-center gap-1.5">
                    <Icon name="invoice" className="h-3.5 w-3.5" />
                    <dd>
                      <a href={`mailto:${m.email}`} className="hover:text-brand-cyan-dark hover:underline">
                        {m.email}
                      </a>
                    </dd>
                  </div>
                  {m.phone ? (
                    <div className="flex items-center gap-1.5">
                      <Icon name="people" className="h-3.5 w-3.5" />
                      <dd>{m.phone}</dd>
                    </div>
                  ) : null}
                  {m.location ? (
                    <div className="flex items-center gap-1.5">
                      <Icon name="tag" className="h-3.5 w-3.5" />
                      <dd>{m.location}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
