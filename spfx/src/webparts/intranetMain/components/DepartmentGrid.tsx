import * as React from "react";

import { IDepartement } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { cn } from "../../../common/utils/spUtils";

/**
 * Palette par défaut pour les cartes départementales (quand
 * `AccentClasses` / `BadgeClasses` ne sont pas renseignés dans la liste).
 * Indexé par Slug pour rester stable quel que soit l'ordre de tri.
 */
const ACCENT_BY_SLUG: Record<
  string,
  { card: string; badge: string; iconBg: string; iconText: string; hover: string }
> = {
  comptabilite: {
    card: "hover:ika-border-emerald-400 hover:ika-shadow-emerald-100",
    badge: "ika-bg-emerald-50 ika-text-emerald-700",
    iconBg: "ika-bg-emerald-100",
    iconText: "ika-text-emerald-600",
    hover: "group-hover:ika-bg-emerald-600 group-hover:ika-text-white",
  },
  administration: {
    card: "hover:ika-border-violet-400 hover:ika-shadow-violet-100",
    badge: "ika-bg-violet-50 ika-text-violet-700",
    iconBg: "ika-bg-violet-100",
    iconText: "ika-text-violet-600",
    hover: "group-hover:ika-bg-violet-600 group-hover:ika-text-white",
  },
  commerciaux: {
    card: "hover:ika-border-orange-400 hover:ika-shadow-orange-100",
    badge: "ika-bg-orange-50 ika-text-orange-700",
    iconBg: "ika-bg-orange-100",
    iconText: "ika-text-orange-600",
    hover: "group-hover:ika-bg-orange-600 group-hover:ika-text-white",
  },
  techniciens: {
    card: "hover:ika-border-sky-400 hover:ika-shadow-sky-100",
    badge: "ika-bg-sky-50 ika-text-sky-700",
    iconBg: "ika-bg-sky-100",
    iconText: "ika-text-sky-600",
    hover: "group-hover:ika-bg-sky-600 group-hover:ika-text-white",
  },
  direction: {
    card: "hover:ika-border-brand-navy hover:ika-shadow-brand-navy/10",
    badge: "ika-bg-brand-navy/10 ika-text-brand-navy",
    iconBg: "ika-bg-brand-navy/10",
    iconText: "ika-text-brand-navy",
    hover: "group-hover:ika-bg-brand-navy group-hover:ika-text-white",
  },
};

const DEFAULT_ACCENT = {
  card: "hover:ika-border-slate-400 hover:ika-shadow-slate-100",
  badge: "ika-bg-slate-100 ika-text-slate-700",
  iconBg: "ika-bg-slate-100",
  iconText: "ika-text-slate-600",
  hover: "group-hover:ika-bg-slate-700 group-hover:ika-text-white",
};

/**
 * Construit l'URL vers la bibliothèque « Documents partagés » (Shared Documents)
 * du site départemental. Si `SiteUrl` n'est pas renseigné, repli sur le hub.
 *
 * Note : les sites français utilisent "Documents partages" (URL-encodé en
 * `Documents%20partages`). Si tes sites sont en anglais, remplace par
 * `Shared%20Documents`.
 */
function buildDocLibraryUrl(dept: IDepartement, fallbackHub: string): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const hubBase = fallbackHub || `${origin}/sites/ika-intranet`;

  if (dept.SiteUrl && dept.SiteUrl.Url) {
    const siteRel = dept.SiteUrl.Url.replace(/^https?:\/\/[^/]+/, "");
    return `${origin}${siteRel}/Documents%20partages/Forms/AllItems.aspx`;
  }

  // Fallback : slug => convention de nommage /sites/ika-<slug>.
  // Le slug "commerciaux" (avec x final) est le slug interne ; le site
  // SharePoint correspondant est typiquement nommé "ika-commerciaux" aussi.
  if (dept.Slug && dept.Slug !== "direction") {
    return `${origin}/sites/ika-${dept.Slug}/Documents%20partages/Forms/AllItems.aspx`;
  }

  return `${hubBase}/Documents%20partages/Forms/AllItems.aspx`;
}

export interface IDepartmentGridProps {
  departments: IDepartement[];
  title?: string;
  description?: string;
}

/**
 * Grille des portails départementaux.
 *
 * Chaque carte se comporte comme dans la maquette Next.js mais, au lieu
 * d'ouvrir une route `/<departement>`, elle ouvre directement la
 * **bibliothèque de documents « Documents partagés »** du site
 * départemental correspondant (comportement demandé pour SharePoint).
 */
export const DepartmentGrid: React.FC<IDepartmentGridProps> = (props) => {
  const {
    departments,
    title = "Nos départements",
    description = "Accédez directement à la bibliothèque documentaire de chaque pôle.",
  } = props;

  // Trier par SortOrder, puis par Title
  const sorted = React.useMemo(
    () =>
      [...departments].sort((a, b) => {
        const sa = a.SortOrder ?? 999;
        const sb = b.SortOrder ?? 999;
        if (sa !== sb) return sa - sb;
        return a.Title.localeCompare(b.Title);
      }),
    [departments]
  );

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const hubUrl = `${origin}/sites/ika-intranet`;

  return (
    <section
      className="ika-py-12"
      aria-labelledby="ika-dept-grid-title"
    >
      <div className="ika-mb-8">
        <h2
          id="ika-dept-grid-title"
          className="ika-text-3xl ika-font-extrabold ika-tracking-tight ika-text-slate-900"
        >
          {title}
        </h2>
        {description ? (
          <p className="ika-mt-2 ika-text-sm ika-text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      <div className="ika-grid ika-grid-cols-1 ika-gap-5 sm:ika-grid-cols-2 lg:ika-grid-cols-4">
        {sorted.map((dept) => {
          const accent =
            ACCENT_BY_SLUG[dept.Slug as string] || DEFAULT_ACCENT;
          const href = buildDocLibraryUrl(dept, hubUrl);

          return (
            <a
              key={dept.Id}
              href={href}
              data-interception="propagate"
              className={cn(
                "group ika-flex ika-flex-col ika-gap-4 ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-p-6",
                "ika-transition-all ika-duration-200 hover:ika-shadow-lg",
                accent.card,
              )}
            >
              <div className="ika-flex ika-items-start ika-justify-between">
                <span
                  className={cn(
                    "ika-inline-flex ika-h-12 ika-w-12 ika-items-center ika-justify-center ika-rounded-xl ika-transition-colors",
                    accent.iconBg,
                    accent.iconText,
                    accent.hover,
                  )}
                >
                  <Icon
                    name={dept.IconName || "FolderOpen"}
                    className="ika-h-6 ika-w-6"
                  />
                </span>

                {dept.MemberCount ? (
                  <span
                    className={cn(
                      "ika-inline-flex ika-items-center ika-gap-1 ika-rounded-full ika-px-2.5 ika-py-1 ika-text-[11px] ika-font-bold",
                      accent.badge,
                    )}
                  >
                    <Icon name="Users" className="ika-h-3 ika-w-3" />
                    {dept.MemberCount}
                  </span>
                ) : null}
              </div>

              <div>
                <h3 className="ika-text-lg ika-font-bold ika-text-slate-900 group-hover:ika-text-brand-navy">
                  {dept.Title}
                </h3>
                {dept.Tagline ? (
                  <p className="ika-mt-1 ika-text-xs ika-uppercase ika-tracking-wider ika-text-slate-400">
                    {dept.Tagline}
                  </p>
                ) : null}
                {dept.DeptDescription ? (
                  <p className="ika-mt-2 ika-text-sm ika-text-slate-500 ika-line-clamp-3">
                    {dept.DeptDescription}
                  </p>
                ) : null}
              </div>

              <div className="ika-mt-auto ika-flex ika-items-center ika-gap-1.5 ika-text-sm ika-font-semibold ika-text-brand-cyan group-hover:ika-underline">
                <Icon name="FolderOpen" className="ika-h-4 ika-w-4" />
                Ouvrir la bibliothèque
                <Icon
                  name="arrow-right"
                  className="ika-h-4 ika-w-4 ika-transition-transform group-hover:ika-translate-x-1"
                />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
