"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Star,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Briefcase,
} from "lucide-react";
import type {
  HomeDepartmentCard,
  HomeEmployeeOfMonth,
  HomeProject,
  HomeProjectStatus,
} from "@/types/intranet";

// Web Part SPFx ↦ « Collaborateur du mois + Tableau de bord Projets
// + Départements ». Données reçues par props (plain-serializable).

interface IntranetSectionsProps {
  employee: HomeEmployeeOfMonth;
  projects: HomeProject[];
  departments: HomeDepartmentCard[];
}

const statusConfig: Record<
  HomeProjectStatus,
  {
    label: string;
    textColor: string;
    bgColor: string;
    barColor: string;
    icon: typeof CheckCircle2;
  }
> = {
  "on-track": {
    label: "En cours",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
    barColor: "bg-emerald-500",
    icon: CheckCircle2,
  },
  "at-risk": {
    label: "À risque",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    barColor: "bg-amber-500",
    icon: AlertCircle,
  },
  delayed: {
    label: "En retard",
    textColor: "text-rose-700",
    bgColor: "bg-rose-50",
    barColor: "bg-rose-500",
    icon: Clock,
  },
};

function ProjectDashboardA({ projects }: { projects: HomeProject[] }) {
  const totalDone = projects.reduce((a, p) => a + p.tasks.done, 0);
  const totalTasks = projects.reduce((a, p) => a + p.tasks.total, 0);
  const onTrackCount = projects.filter((p) => p.status === "on-track").length;

  return (
    <section className="w-full px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <TrendingUp size={26} className="text-brand-accent" />
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Tableau de bord Projets
          </h2>
        </div>
        <p className="mb-8 text-sm text-slate-500">
          Initiatives actives sur l&apos;ensemble des pôles techniques
        </p>

        {/* Summary pills */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[
            {
              label: "Projets actifs",
              value: projects.length,
              icon: Briefcase,
              cls: "bg-slate-100 text-slate-700",
            },
            {
              label: "Dans les délais",
              value: onTrackCount,
              icon: CheckCircle2,
              cls: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Tâches réalisées",
              value: `${totalDone}/${totalTasks}`,
              icon: TrendingUp,
              cls: "bg-amber-50 text-amber-700",
            },
          ].map((pill, i) => {
            const Icon = pill.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl px-5 py-3 ${pill.cls}`}
              >
                <Icon size={18} />
                <div>
                  <p className="text-lg font-extrabold leading-none">
                    {pill.value}
                  </p>
                  <p className="mt-0.5 text-[11px] opacity-70">{pill.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Project cards grid */}
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
          {projects.map((project, i) => {
            const cfg = statusConfig[project.status];
            const StatusIcon = cfg.icon;
            const isLastRow = i >= projects.length - 2;
            const isRightCol = i % 2 === 1;

            return (
              <div
                key={project.id}
                className={`
                  group p-6 transition-colors duration-200 hover:bg-slate-50
                  ${!isLastRow ? "border-b border-slate-200" : ""}
                  ${!isRightCol ? "md:border-r md:border-slate-200" : ""}
                `}
              >
                {/* Top row */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-accent">
                      {project.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Lead : {project.lead} · Échéance {project.due}
                    </p>
                  </div>
                  <span
                    className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${cfg.textColor} ${cfg.bgColor}`}
                  >
                    <StatusIcon size={11} />
                    {cfg.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="mb-1 flex justify-between text-[11px] text-slate-400">
                    <span>Avancement</span>
                    <span className="font-bold text-slate-700">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${cfg.barColor}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">
                    <span className="font-bold text-slate-700">
                      {project.tasks.done}
                    </span>
                    /{project.tasks.total} tâches complétées
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EmployeeCardA({ employee }: { employee: HomeEmployeeOfMonth }) {
  return (
    <section className="w-full bg-brand-navy px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Award size={26} className="text-amber-400" />
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Collaborateur du mois
          </h2>
          <span className="ml-auto rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 text-xs font-bold text-amber-300">
            {employee.month}
          </span>
        </div>

        {/* Card */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm md:flex-row">
          {/* Photo */}
          <div className="relative h-72 shrink-0 md:h-auto md:w-72">
            <Image
              src={employee.avatar}
              alt={employee.name}
              fill
              sizes="(max-width: 768px) 100vw, 288px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              <Award size={11} />
              Top Performer
            </div>
            <div className="absolute bottom-4 left-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-cyan">
                {employee.department}
              </span>
              <h3 className="mt-1 text-2xl font-extrabold text-white">
                {employee.name}
              </h3>
              <p className="mb-6 mt-0.5 text-sm text-white/60">
                {employee.role}
              </p>

              {/* Quote */}
              <div className="relative rounded-xl bg-white/5 px-6 py-5">
                <span
                  className="absolute left-3 top-3 text-3xl leading-none text-amber-400/40"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="pl-4 text-sm italic leading-relaxed text-white/80">
                  {employee.quote}
                </p>
                <p className="mt-3 pl-4 text-xs font-semibold text-brand-cyan">
                  — {employee.nominatedBy}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// MAIN EXPORT
// ════════════════════════════════════════════════════════════

export default function IntranetSections({
  employee,
  projects,
  departments,
}: IntranetSectionsProps) {
  return (
    <div className="bg-white">
      <section className=" flex flex-row">
        {" "}
        <EmployeeCardA employee={employee} />
        <ProjectDashboardA projects={projects} />
      </section>
    </div>
  );
}
