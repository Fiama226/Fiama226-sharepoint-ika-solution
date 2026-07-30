import * as React from "react";

import { IAnnouncementsListProps } from "./IAnnouncementsListProps";
import { IAnnouncement } from "../../../models/IIkaModels";
import { cn, formatDate } from "../../../common/utils/spUtils";

const EMOJI_BY_TYPE: Record<string, string> = {
  Mariage: "💍",
  Anniversaire: "🎉",
  Naissance: "👶",
  Événement: "📅",
  Départ: "👋",
  Arrivée: "🌟",
  Promotion: "🏆",
};

const TYPE_STYLE: Record<string, string> = {
  Mariage: "ika-bg-rose-50 ika-text-rose-700",
  Anniversaire: "ika-bg-amber-50 ika-text-amber-700",
  Naissance: "ika-bg-sky-50 ika-text-sky-700",
  Événement: "ika-bg-violet-50 ika-text-violet-700",
  Départ: "ika-bg-slate-100 ika-text-slate-700",
  Arrivée: "ika-bg-emerald-50 ika-text-emerald-700",
  Promotion: "ika-bg-indigo-50 ika-text-indigo-700",
};

const ALL = "__all__";

export const AnnouncementsList: React.FC<IAnnouncementsListProps> = (props) => {
  const {
    eyebrow,
    title,
    description,
    announcements,
    loading,
    error,
    showFilters,
  } = props;

  const [filter, setFilter] = React.useState<string>(ALL);

  const types: string[] = [];
  announcements.forEach((item) => {
    if (types.indexOf(item.AnnouncementType) === -1) {
      types.push(item.AnnouncementType);
    }
  });

  const visible: IAnnouncement[] =
    filter === ALL
      ? announcements
      : announcements.filter((item) => item.AnnouncementType === filter);

  const renderBody = (): React.ReactElement => {
    if (loading) {
      return (
        <div className="ika-space-y-4 ika-animate-pulse" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-p-6"
            >
              <div className="ika-h-5 ika-w-1/2 ika-rounded ika-bg-slate-200" />
              <div className="ika-mt-3 ika-h-3 ika-w-1/4 ika-rounded ika-bg-slate-100" />
              <div className="ika-mt-4 ika-h-3 ika-w-full ika-rounded ika-bg-slate-100" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div
          role="alert"
          className="ika-rounded-3xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      );
    }

    if (visible.length === 0) {
      return (
        <div className="ika-rounded-3xl ika-border ika-border-dashed ika-border-brand-navy/20 ika-bg-white ika-p-10 ika-text-center">
          <p className="ika-text-sm ika-font-medium ika-text-brand-navy">
            Aucune annonce à afficher
          </p>
          <p className="ika-mt-1 ika-text-sm ika-text-brand-muted">
            {filter === ALL
              ? "Les prochaines célébrations apparaîtront ici."
              : "Aucune annonce dans cette catégorie."}
          </p>
        </div>
      );
    }

    return (
      <div className="ika-space-y-4">
        {visible.map((item) => (
          <article
            key={item.Id}
            className="ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-p-6 ika-shadow-sm"
          >
            <div className="ika-flex ika-flex-wrap ika-items-start ika-gap-3">
              <span className="ika-text-3xl" aria-hidden="true">
                {item.Emoji || EMOJI_BY_TYPE[item.AnnouncementType] || "📌"}
              </span>

              <div className="ika-min-w-0 ika-flex-1">
                <div className="ika-flex ika-flex-wrap ika-items-center ika-gap-2">
                  <h2 className="ika-text-xl ika-font-semibold ika-text-brand-navy">
                    {item.Title}
                  </h2>
                  <span
                    className={cn(
                      "ika-rounded-full ika-px-2.5 ika-py-0.5 ika-text-xs ika-font-medium",
                      TYPE_STYLE[item.AnnouncementType] ||
                        "ika-bg-slate-100 ika-text-slate-700"
                    )}
                  >
                    {item.AnnouncementType}
                  </span>
                </div>
                <p className="ika-mt-1 ika-text-sm ika-text-brand-muted">
                  <time dateTime={item.AnnouncementDate}>
                    {formatDate(item.AnnouncementDate)}
                  </time>
                </p>
              </div>
            </div>

            <p className="ika-mt-4 ika-text-sm ika-leading-6 ika-text-brand-ink">
              {item.Detail}
            </p>
          </article>
        ))}
      </div>
    );
  };

  return (
    <div className="ika-root">
      <section className="ika-mx-auto ika-max-w-6xl ika-px-4 ika-py-10 sm:ika-px-6 lg:ika-px-8">
        <header className="ika-mb-8">
          <p className="ika-text-sm ika-uppercase ika-tracking-[0.3em] ika-text-brand-cyan-dark">
            {eyebrow}
          </p>
          <h1 className="ika-mt-3 ika-text-3xl ika-font-semibold ika-text-brand-navy">
            {title}
          </h1>
          {description ? (
            <p className="ika-mt-2 ika-max-w-2xl ika-text-sm ika-text-brand-muted">
              {description}
            </p>
          ) : null}
        </header>

        {showFilters && types.length > 1 && !loading && !error ? (
          <div
            role="group"
            aria-label="Filtrer par type"
            className="ika-mb-6 ika-flex ika-flex-wrap ika-gap-2"
          >
            <button
              type="button"
              onClick={() => setFilter(ALL)}
              aria-pressed={filter === ALL}
              className={cn(
                "ika-rounded-full ika-px-4 ika-py-1.5 ika-text-sm ika-font-medium ika-transition-colors",
                filter === ALL
                  ? "ika-bg-brand-navy ika-text-white"
                  : "ika-bg-white ika-text-brand-navy ika-ring-1 ika-ring-slate-200 hover:ika-bg-slate-50"
              )}
            >
              Toutes
            </button>

            {types.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilter(type)}
                aria-pressed={filter === type}
                className={cn(
                  "ika-rounded-full ika-px-4 ika-py-1.5 ika-text-sm ika-font-medium ika-transition-colors",
                  filter === type
                    ? "ika-bg-brand-navy ika-text-white"
                    : "ika-bg-white ika-text-brand-navy ika-ring-1 ika-ring-slate-200 hover:ika-bg-slate-50"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        ) : null}

        {renderBody()}
      </section>
    </div>
  );
};
