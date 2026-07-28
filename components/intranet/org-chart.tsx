import type { TeamMember } from "@/types/intranet";

import { Icon } from "@/components/intranet/icon";

type Props = {
  members: TeamMember[];
};

const ROLE_LEAD_KEYWORDS = [
  "responsable",
  "directeur",
  "directrice",
  "head",
  "manager",
  "chef",
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function pickLead(members: TeamMember[]): TeamMember | undefined {
  if (members.length === 0) return undefined;
  const explicit = members.find((m) =>
    ROLE_LEAD_KEYWORDS.some((kw) => m.role.toLowerCase().includes(kw))
  );
  return explicit ?? members[0];
}

export function OrgChart({ members }: Props) {
  const lead = pickLead(members);
  if (!lead) return null;

  const reports = members.filter((m) => m.id !== lead.id);
  const headCount = members.length;

  return (
    <section
      aria-labelledby="org-chart-title"
      className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="org-chart-title"
            className="text-lg font-semibold text-brand-navy"
          >
            Organigramme de l&apos;équipe
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            {headCount} membres &middot; {reports.length} collaborateur{reports.length > 1 ? "s" : ""} rattaché{reports.length > 1 ? "s" : ""}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-surface px-3 py-1 text-xs font-medium text-brand-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-success" aria-hidden />
          Équipe en place
        </span>
      </div>

      <div className="mt-8 grid place-items-center">
        <LeadCard member={lead} />

        {reports.length > 0 && (
          <>
            <div
              className="my-2 h-8 w-px bg-brand-line"
              aria-hidden
            />

            <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((m) => (
                <ReportCard key={m.id} member={m} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Effectif" value={`${headCount}`} suffix="personnes" />
        <Stat label="Lien direct" value={`${reports.length}`} suffix="collaborateurs" />
        <Stat
          label="Présence"
          value="Paris"
          suffix="siège social"
        />
      </div>
    </section>
  );
}

function LeadCard({ member }: { member: TeamMember }) {
  return (
    <article className="group flex w-full max-w-md items-center gap-4 rounded-xl border-2 border-brand-cyan bg-gradient-to-br from-brand-navy to-brand-navy-light p-5 text-white shadow-md">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-cyan text-lg font-bold text-brand-navy shadow-inner">
        {initials(member.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-cyan">
          <Icon name="user" className="h-3 w-3" /> Responsable
        </p>
        <h3 className="mt-1 truncate text-base font-semibold leading-tight">
          {member.name}
        </h3>
        <p className="truncate text-sm text-white/85">{member.role}</p>
        <a
          href={`mailto:${member.email}`}
          className="mt-1 inline-block truncate text-xs text-white/70 hover:text-white hover:underline"
        >
          {member.email}
        </a>
      </div>
    </article>
  );
}

function ReportCard({ member }: { member: TeamMember }) {
  return (
    <article className="group flex h-full flex-col gap-2 rounded-xl border border-brand-line bg-brand-surface p-4 transition-all hover:border-brand-cyan hover:bg-white hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-brand-navy ring-1 ring-brand-line">
          {initials(member.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-brand-ink group-hover:text-brand-navy">
            {member.name}
          </h3>
          <p className="truncate text-xs text-brand-muted">{member.role}</p>
        </div>
      </div>
      <div className="mt-1 space-y-1 border-t border-brand-line pt-2 text-[11px] text-brand-muted">
        <a
          href={`mailto:${member.email}`}
          className="block truncate hover:text-brand-cyan-dark"
        >
          {member.email}
        </a>
        {member.phone && <p className="truncate">{member.phone}</p>}
        {member.location && <p className="truncate">{member.location}</p>}
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg border border-brand-line bg-brand-surface p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-brand-navy">{value}</p>
      {suffix && <p className="text-xs text-brand-muted">{suffix}</p>}
    </div>
  );
}
