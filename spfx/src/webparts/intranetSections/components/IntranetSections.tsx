import * as React from "react";

import { IIntranetSectionsProps } from "./IIntranetSectionsProps";
import {
  IEmployeeOfMonth,
  IProject,
  ProjectStatus,
} from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { cn, buildImageUrl } from "../../../common/utils/spUtils";

/**
 * IntranetSections — port 1:1 de components/intranet/last_home_page section.tsx
 * (maquette Next.js) : Collaborateur du mois + Tableau de bord Projets.
 */

type StatusStyle = {
  label: string;
  textColor: string;
  bgColor: string;
  barColor: string;
  icon: string;
};

const STATUS_CONFIG: Record<string, StatusStyle> = {
  "À l'heure": {
    label: "En cours",
    textColor: "ika-text-emerald-700",
    bgColor: "ika-bg-emerald-50",
    barColor: "ika-bg-emerald-500",
    icon: "CheckCircle2",
  },
  "À risque": {
    label: "À risque",
    textColor: "ika-text-amber-700",
    bgColor: "ika-bg-amber-50",
    barColor: "ika-bg-amber-500",
    icon: "AlertCircle",
  },
  "En retard": {
    label: "En retard",
    textColor: "ika-text-rose-700",
    bgColor: "ika-bg-rose-50",
    barColor: "ika-bg-rose-500",
    icon: "Clock",
  },
  Terminé: {
    label: "Terminé",
    textColor: "ika-text-emerald-700",
    bgColor: "ika-bg-emerald-50",
    barColor: "ika-bg-emerald-500",
    icon: "CheckCircle2",
  },
};

function statusFor(status: ProjectStatus): StatusStyle {
  return STATUS_CONFIG[status] || STATUS_CONFIG["À l'heure"];
}

function formatDue(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
  return `${date.getDate()} ${cap(
    date.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")
  )}`;
}

function formatMonth(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
  return cap(
    date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
  );
}

const ProjectDashboard: React.FC<{ projects: IProject[] }> = (props) => {
  const { projects } = props;
  const totalDone = projects.reduce((a, p) => a + (p.TasksDone || 0), 0);
  const totalTasks = projects.reduce((a, p) => a + (p.TasksTotal || 0), 0);
  const onTrackCount = projects.filter(
    (p) => p.ProjectStatus === "À l'heure" || p.ProjectStatus === "Terminé"
  ).length;

  return (
    <section className="ika-w-full ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
      <div className="ika-mx-auto ika-max-w-7xl">
        {/* Header */}
        <div className="ika-mb-2 ika-flex ika-flex-wrap ika-items-center ika-gap-3">
          <Icon name="TrendingUp" className="ika-h-[26px] ika-w-[26px] ika-text-brand-accent" />
          <h2 className="ika-text-3xl ika-font-extrabold ika-tracking-tight ika-text-slate-900">
            Tableau de bord Projets
          </h2>
        </div>
        <p className="ika-mb-8 ika-text-sm ika-text-slate-500">
          Initiatives actives sur l&apos;ensemble des pôles techniques
        </p>

        {/* Pills récapitulatives */}
        <div className="ika-mb-8 ika-flex ika-flex-wrap ika-gap-3">
          {[
            {
              label: "Projets actifs",
              value: projects.length,
              icon: "Briefcase",
              cls: "ika-bg-slate-100 ika-text-slate-700",
            },
            {
              label: "Dans les délais",
              value: onTrackCount,
              icon: "CheckCircle2",
              cls: "ika-bg-emerald-50 ika-text-emerald-700",
            },
            {
              label: "Tâches réalisées",
              value: `${totalDone}/${totalTasks}`,
              icon: "TrendingUp",
              cls: "ika-bg-amber-50 ika-text-amber-700",
            },
          ].map((pill, i) => (
            <div
              key={i}
              className={cn(
                "ika-flex ika-items-center ika-gap-3 ika-rounded-xl ika-px-5 ika-py-3",
                pill.cls
              )}
            >
              <Icon name={pill.icon} className="ika-h-[18px] ika-w-[18px]" />
              <div>
                <p className="ika-text-lg ika-font-extrabold ika-leading-none">
                  {pill.value}
                </p>
                <p className="ika-mt-0.5 ika-text-[11px] ika-opacity-70">
                  {pill.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Grille de cartes projets */}
        <div className="ika-grid ika-grid-cols-1 ika-overflow-hidden ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-shadow-sm md:ika-grid-cols-2">
          {projects.map((project, i) => {
            const cfg = statusFor(project.ProjectStatus);
            const isLastRow = i >= projects.length - 2;
            const isRightCol = i % 2 === 1;

            return (
              <div
                key={project.Id}
                className={cn(
                  "ika-group ika-p-6 ika-transition-colors ika-duration-200 hover:ika-bg-slate-50",
                  !isLastRow ? "ika-border-b ika-border-slate-200" : "",
                  !isRightCol ? "md:ika-border-r md:ika-border-slate-200" : ""
                )}
              >
                {/* Ligne supérieure */}
                <div className="ika-mb-4 ika-flex ika-items-start ika-justify-between ika-gap-3">
                  <div>
                    <h3 className="ika-font-bold ika-leading-snug ika-text-slate-900 ika-transition-colors group-hover:ika-text-brand-accent">
                      {project.Title}
                    </h3>
                    <p className="ika-mt-0.5 ika-text-[11px] ika-text-slate-400">
                      Lead : {project.ProjectLead} · Échéance{" "}
                      {formatDue(project.DueDate)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "ika-flex ika-shrink-0 ika-items-center ika-gap-1 ika-rounded-full ika-px-2.5 ika-py-1 ika-text-[11px] ika-font-bold",
                      cfg.textColor,
                      cfg.bgColor
                    )}
                  >
                    <Icon name={cfg.icon} className="ika-h-[11px] ika-w-[11px]" />
                    {cfg.label}
                  </span>
                </div>

                {/* Barre de progression */}
                <div className="ika-mb-3">
                  <div className="ika-mb-1 ika-flex ika-justify-between ika-text-[11px] ika-text-slate-400">
                    <span>Avancement</span>
                    <span className="ika-font-bold ika-text-slate-700">
                      {project.Progress}%
                    </span>
                  </div>
                  <div className="ika-h-1.5 ika-w-full ika-overflow-hidden ika-rounded-full ika-bg-slate-100">
                    <div
                      className={cn(
                        "ika-h-full ika-rounded-full ika-transition-all ika-duration-700",
                        cfg.barColor
                      )}
                      style={{ width: `${project.Progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Pied de carte */}
                <div className="ika-flex ika-items-center ika-justify-between">
                  <p className="ika-text-[11px] ika-text-slate-400">
                    <span className="ika-font-bold ika-text-slate-700">
                      {project.TasksDone}
                    </span>
                    /{project.TasksTotal} tâches complétées
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const EmployeeCard: React.FC<{
  employeeTitle: string;
  employee: IEmployeeOfMonth | undefined;
  photoUrl: string;
}> = (props) => {
  const { employeeTitle, employee, photoUrl } = props;

  const name = employee && employee.Employee ? employee.Employee.Title : "";
  const department =
    employee && employee.Department ? employee.Department.Title : "";
  const photo =
    (employee && employee.Photo ? buildImageUrl(employee.Photo, 600) : "") ||
    photoUrl;
  const initials = name
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <section className="ika-w-full ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
      <div className="ika-mx-auto ika-max-w-7xl">
        {/* Header */}
        <div className="ika-mb-8 ika-flex ika-flex-wrap ika-items-center ika-gap-3">
          <Icon name="Award" className="ika-h-[26px] ika-w-[26px] ika-text-amber-400" />
          <h2 className="ika-text-3xl ika-font-extrabold ika-tracking-tight">
            {employeeTitle || "Collaborateur du mois"}
          </h2>
          {employee ? (
            <span className="ika-ml-auto ika-rounded-full ika-border ika-border-amber-400/40 ika-bg-amber-400/10 ika-px-4 ika-py-1 ika-text-xs ika-font-bold ika-text-amber-300">
              {formatMonth(employee.PeriodStart)}
            </span>
          ) : null}
        </div>

        {/* Carte */}
        <div className="ika-flex ika-flex-col ika-overflow-hidden ika-rounded-2xl ika-border ika-border-white/10 ika-bg-brand-navy ika-shadow-sm md:ika-flex-row">
          {/* Photo */}
          <div className="ika-relative ika-h-72 ika-shrink-0 md:ika-h-auto md:ika-w-72">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="ika-h-full ika-w-full ika-object-cover ika-object-top"
              />
            ) : (
              <div
                aria-hidden="true"
                className="ika-flex ika-h-full ika-w-full ika-items-center ika-justify-center ika-bg-white/10 ika-text-3xl ika-font-bold ika-text-white/60"
              >
                {initials || "IK"}
              </div>
            )}
            <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-t ika-from-black/60 ika-via-transparent ika-to-transparent" />
            <div className="ika-absolute ika-left-4 ika-top-4 ika-flex ika-items-center ika-gap-1 ika-rounded-full ika-bg-amber-500 ika-px-3 ika-py-1 ika-text-[10px] ika-font-bold ika-uppercase ika-tracking-widest ika-text-white">
              <Icon name="Award" className="ika-h-[11px] ika-w-[11px]" />
              Top Performer
            </div>
            <div className="ika-absolute ika-bottom-4 ika-left-4 ika-flex ika-gap-1">
              {[...Array(5)].map((_unused, i) => (
                <Icon
                  key={i}
                  name="Star"
                  className="ika-h-[13px] ika-w-[13px] ika-fill-amber-400 ika-text-amber-400"
                />
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div className="ika-flex ika-flex-1 ika-flex-col ika-justify-between ika-p-8">
            <div>
              <span className="ika-text-[11px] ika-font-bold ika-uppercase ika-tracking-widest ika-text-brand-cyan">
                {department}
              </span>
              <h3 className="ika-mt-1 ika-text-2xl ika-font-extrabold ika-text-white">
                {name}
              </h3>
              <p className="ika-mb-6 ika-mt-0.5 ika-text-sm ika-text-white/60">
                {employee ? employee.DisplayRole : ""}
              </p>

              {/* Citation */}
              <div className="ika-relative ika-rounded-xl ika-bg-white/5 ika-px-6 ika-py-5">
                <span
                  aria-hidden="true"
                  className="ika-absolute ika-left-3 ika-top-3 ika-text-3xl ika-leading-none ika-text-amber-400/40"
                >
                  &ldquo;
                </span>
                <p className="ika-pl-4 ika-text-sm ika-italic ika-leading-relaxed ika-text-white/80">
                  {employee ? employee.Quote : ""}
                </p>
                <p className="ika-mt-3 ika-pl-4 ika-text-xs ika-font-semibold ika-text-brand-cyan">
                  — {employee ? employee.NominatedBy : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const IntranetSections: React.FC<IIntranetSectionsProps> = (props) => {
  const {
    employeeTitle,
    employee,
    employeePhotoUrl,
    projects,
    loading,
    error,
    showEmployee,
    showProjects,
  } = props;

  if (loading) {
    return (
      <div className="ika-root">
        <div className="ika-bg-white">
          <div className="ika-flex ika-flex-row ika-animate-pulse">
            <div className="ika-h-[420px] ika-w-1/2 ika-bg-slate-100" />
            <div className="ika-h-[420px] ika-w-1/2 ika-bg-slate-50" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ika-root">
        <div
          role="alert"
          className="ika-mx-auto ika-mt-6 ika-max-w-7xl ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ika-root">
      <div className="ika-bg-white">
        <div className="ika-flex ika-flex-row">
          {showEmployee ? (
              <EmployeeCard
                employeeTitle={employeeTitle}
                employee={employee}
                photoUrl={employeePhotoUrl || ""}
              />
          ) : null}
          {showProjects ? <ProjectDashboard projects={projects} /> : null}
        </div>
      </div>
    </div>
  );
};
