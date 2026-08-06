import * as React from "react";

import { IIntranetSectionsProps } from "./IIntranetSectionsProps";
import { IProject } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { cn, formatDate } from "../../../common/utils/spUtils";

interface IStatusConfig {
  textColor: string;
  bgColor: string;
  barColor: string;
  icon: string;
}

const STATUS_CONFIG: Record<string, IStatusConfig> = {
  "À l'heure": {
    textColor: "ika-text-emerald-700",
    bgColor: "ika-bg-emerald-50",
    barColor: "ika-bg-emerald-500",
    icon: "ShieldCheck",
  },
  "À risque": {
    textColor: "ika-text-amber-700",
    bgColor: "ika-bg-amber-50",
    barColor: "ika-bg-amber-500",
    icon: "target",
  },
  "En retard": {
    textColor: "ika-text-rose-700",
    bgColor: "ika-bg-rose-50",
    barColor: "ika-bg-rose-500",
    icon: "Clock",
  },
  Terminé: {
    textColor: "ika-text-slate-700",
    bgColor: "ika-bg-slate-100",
    barColor: "ika-bg-slate-500",
    icon: "ShieldCheck",
  },
};

const FALLBACK_STATUS: IStatusConfig = {
  textColor: "ika-text-slate-700",
  bgColor: "ika-bg-slate-100",
  barColor: "ika-bg-slate-400",
  icon: "tag",
};

function statusFor(status: string): IStatusConfig {
  return STATUS_CONFIG[status] || FALLBACK_STATUS;
}

function clampPercent(value: number): number {
  if (isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Math.round(value);
}

const EmployeeCard: React.FC<{
  title: string;
  employee: NonNullable<IIntranetSectionsProps["employee"]>;
  photoUrl: string;
}> = (props) => {
  const { title, employee, photoUrl } = props;

  return (
    <section
      className="ika-w-full ika-bg-brand-navy ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8"
      aria-labelledby="ika-employee-title"
    >
      <div className="ika-mx-auto ika-max-w-7xl">
        <div className="ika-mb-8 ika-flex ika-flex-wrap ika-items-center ika-gap-3">
          <span className="ika-text-amber-400">
            <Icon name="Award" className="ika-h-6 ika-w-6" />
          </span>
          <h2
            id="ika-employee-title"
            className="ika-text-3xl ika-font-extrabold ika-tracking-tight ika-text-white"
          >
            {title}
          </h2>
          <span className="ika-ml-auto ika-rounded-full ika-border ika-border-amber-400/40 ika-bg-amber-400/10 ika-px-4 ika-py-1 ika-text-xs ika-font-bold ika-text-amber-300">
            {employee.Title}
          </span>
        </div>

        <div className="ika-flex ika-flex-col ika-overflow-hidden ika-rounded-2xl ika-border ika-border-white/10 ika-bg-white/5 md:ika-flex-row">
          <div className="ika-relative ika-h-72 ika-shrink-0 md:ika-h-auto md:ika-w-72">
            <img
              src={photoUrl}
              alt=""
              className="ika-h-full ika-w-full ika-object-cover ika-object-top"
            />
            <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-t ika-from-black/60 ika-via-transparent ika-to-transparent" />
            <span className="ika-absolute ika-left-4 ika-top-4 ika-flex ika-items-center ika-gap-1 ika-rounded-full ika-bg-amber-500 ika-px-3 ika-py-1 ika-text-[10px] ika-font-bold ika-uppercase ika-tracking-widest ika-text-white">
              <Icon name="Award" className="ika-h-3 ika-w-3" />
              Top performer
            </span>
          </div>

          <div className="ika-flex ika-flex-1 ika-flex-col ika-justify-between ika-p-8">
            <div>
              <span className="ika-text-[11px] ika-font-bold ika-uppercase ika-tracking-widest ika-text-brand-cyan">
                {employee.Department ? employee.Department.Title : ""}
              </span>
              <h3 className="ika-mt-1 ika-text-2xl ika-font-extrabold ika-text-white">
                {employee.Employee ? employee.Employee.Title : ""}
              </h3>
              <p className="ika-mb-6 ika-mt-0.5 ika-text-sm ika-text-white/60">
                {employee.DisplayRole}
              </p>

              <blockquote className="ika-relative ika-rounded-xl ika-bg-white/5 ika-px-6 ika-py-5">
                <span
                  aria-hidden="true"
                  className="ika-absolute ika-left-3 ika-top-3 ika-text-3xl ika-leading-none ika-text-amber-400/40"
                >
                  &ldquo;
                </span>
                <p className="ika-pl-4 ika-text-sm ika-italic ika-leading-relaxed ika-text-white/80">
                  {employee.Quote}
                </p>
                <footer className="ika-mt-3 ika-pl-4 ika-text-xs ika-font-semibold ika-text-brand-cyan">
                  — {employee.NominatedBy}
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectDashboard: React.FC<{
  title: string;
  description: string;
  projects: IProject[];
}> = (props) => {
  const { title, description, projects } = props;

  const totalDone = projects.reduce((sum, p) => sum + (p.TasksDone || 0), 0);
  const totalTasks = projects.reduce((sum, p) => sum + (p.TasksTotal || 0), 0);
  const onTrack = projects.filter(
    (p) => p.ProjectStatus === "À l'heure",
  ).length;

  const pills = [
    {
      label: "Projets actifs",
      value: String(projects.length),
      icon: "Briefcase",
      cls: "ika-bg-slate-100 ika-text-slate-700",
    },
    {
      label: "Dans les délais",
      value: String(onTrack),
      icon: "ShieldCheck",
      cls: "ika-bg-emerald-50 ika-text-emerald-700",
    },
    {
      label: "Tâches réalisées",
      value: `${totalDone}/${totalTasks}`,
      icon: "chart",
      cls: "ika-bg-amber-50 ika-text-amber-700",
    },
  ];

  return (
    <section
      className="ika-w-full ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8"
      aria-labelledby="ika-projects-title"
    >
      <div className="ika-mx-auto ika-max-w-7xl">
        <div className="ika-mb-2 ika-flex ika-flex-wrap ika-items-center ika-gap-3">
          <span className="ika-text-brand-accent">
            <Icon name="chart" className="ika-h-6 ika-w-6" />
          </span>
          <h2
            id="ika-projects-title"
            className="ika-text-3xl ika-font-extrabold ika-tracking-tight ika-text-slate-900"
          >
            {title}
          </h2>
        </div>

        {description ? (
          <p className="ika-mb-8 ika-text-sm ika-text-slate-500">
            {description}
          </p>
        ) : null}

        <div className="ika-mb-8 ika-flex ika-flex-wrap ika-gap-3">
          {pills.map((pill) => (
            <div
              key={pill.label}
              className={cn(
                "ika-flex ika-items-center ika-gap-3 ika-rounded-xl ika-px-5 ika-py-3",
                pill.cls,
              )}
            >
              <Icon name={pill.icon} className="ika-h-4 ika-w-4" />
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

        <div className="ika-grid ika-grid-cols-1 ika-gap-4 md:ika-grid-cols-2">
          {projects.map((project) => {
            const cfg = statusFor(project.ProjectStatus);
            const progress = clampPercent(project.Progress);

            return (
              <article
                key={project.Id}
                className="ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-p-5 ika-shadow-sm"
              >
                <div className="ika-mb-4 ika-flex ika-items-start ika-justify-between ika-gap-3">
                  <div className="ika-min-w-0">
                    <h3 className="ika-truncate ika-font-bold ika-text-slate-900">
                      {project.Title}
                    </h3>
                    <p className="ika-mt-0.5 ika-text-xs ika-text-slate-400">
                      {project.ProjectLead}
                      {project.DueDate
                        ? ` · échéance ${formatDate(project.DueDate)}`
                        : ""}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "ika-flex ika-shrink-0 ika-items-center ika-gap-1 ika-rounded-full ika-px-2.5 ika-py-1 ika-text-[11px] ika-font-bold",
                      cfg.bgColor,
                      cfg.textColor,
                    )}
                  >
                    <Icon name={cfg.icon} className="ika-h-3 ika-w-3" />
                    {project.ProjectStatus}
                  </span>
                </div>

                <div className="ika-mb-3">
                  <div className="ika-mb-1 ika-flex ika-items-center ika-justify-between ika-text-[11px] ika-text-slate-400">
                    <span>Avancement</span>
                    <span className="ika-font-bold ika-text-slate-700">
                      {progress}%
                    </span>
                  </div>
                  <div
                    className="ika-h-1.5 ika-w-full ika-overflow-hidden ika-rounded-full ika-bg-slate-100"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Avancement de ${project.Title}`}
                  >
                    <div
                      className={cn(
                        "ika-h-full ika-rounded-full ika-transition-all ika-duration-700",
                        cfg.barColor,
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <p className="ika-text-[11px] ika-text-slate-400">
                  <span className="ika-font-bold ika-text-slate-700">
                    {project.TasksDone}
                  </span>
                  /{project.TasksTotal} tâches complétées
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const IntranetSections: React.FC<IIntranetSectionsProps> = (props) => {
  const {
    employeeTitle,
    projectsTitle,
    projectsDescription,
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
        <div className="ika-animate-pulse" aria-hidden="true">
          <div className="ika-h-72 ika-w-full ika-bg-brand-navy" />
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-12">
            <div className="ika-h-6 ika-w-64 ika-rounded ika-bg-slate-200" />
            <div className="ika-mt-8 ika-grid ika-gap-4 md:ika-grid-cols-2">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="ika-h-32 ika-rounded-2xl ika-bg-slate-100"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ika-root">
        <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-12">
          <div
            role="alert"
            className="ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
          >
            <p className="ika-text-sm ika-font-medium ika-text-red-800">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ika-root">
      <div className="ika-bg-white">
        {showEmployee && employee ? (
          <EmployeeCard
            title={employeeTitle}
            employee={employee}
            photoUrl={employeePhotoUrl || ""}
          />
        ) : null}

        {showProjects && projects.length > 0 ? (
          <ProjectDashboard
            title={projectsTitle}
            description={projectsDescription}
            projects={projects}
          />
        ) : null}
      </div>
    </div>
  );
};
