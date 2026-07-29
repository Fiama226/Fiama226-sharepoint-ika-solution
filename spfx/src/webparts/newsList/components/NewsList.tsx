import * as React from "react";

import { INewsListProps } from "./INewsListProps";
import {
  buildImageUrl,
  cn,
  formatDate,
  truncate,
} from "../../../common/utils/spUtils";

const CATEGORY_STYLES: Record<string, string> = {
  Entreprise: "ika-bg-blue-100 ika-text-blue-700",
  RH: "ika-bg-violet-100 ika-text-violet-700",
  Projet: "ika-bg-amber-100 ika-text-amber-700",
  Finance: "ika-bg-emerald-100 ika-text-emerald-700",
  Administration: "ika-bg-slate-100 ika-text-slate-700",
  Commercial: "ika-bg-orange-100 ika-text-orange-700",
  Technique: "ika-bg-cyan-100 ika-text-cyan-700",
  DevOps: "ika-bg-indigo-100 ika-text-indigo-700",
  Formation: "ika-bg-teal-100 ika-text-teal-700",
  Innovation: "ika-bg-fuchsia-100 ika-text-fuchsia-700",
};

const DEFAULT_CATEGORY_STYLE = "ika-bg-slate-100 ika-text-slate-700";

const Skeleton: React.FC = () => (
  <div className="ika-animate-pulse ika-space-y-4" aria-hidden="true">
    {[0, 1, 2].map((index) => (
      <div
        key={index}
        className="ika-flex ika-gap-4 ika-rounded-2xl ika-bg-white ika-p-4"
      >
        <div className="ika-h-20 ika-w-28 ika-rounded-xl ika-bg-slate-200" />
        <div className="ika-flex-1 ika-space-y-2">
          <div className="ika-h-4 ika-w-3/4 ika-rounded ika-bg-slate-200" />
          <div className="ika-h-3 ika-w-full ika-rounded ika-bg-slate-100" />
          <div className="ika-h-3 ika-w-2/3 ika-rounded ika-bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState: React.FC = () => (
  <div className="ika-rounded-2xl ika-border ika-border-dashed ika-border-slate-300 ika-bg-white ika-p-10 ika-text-center">
    <p className="ika-text-sm ika-font-medium ika-text-brand-navy">
      Aucune actualité pour le moment
    </p>
    <p className="ika-mt-1 ika-text-sm ika-text-brand-muted">
      Les nouvelles publications apparaîtront ici.
    </p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = (props) => (
  <div
    role="alert"
    className="ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
  >
    <p className="ika-text-sm ika-font-medium ika-text-red-800">
      {props.message}
    </p>
  </div>
);

export const NewsList: React.FC<INewsListProps> = (props) => {
  const { title, items, loading, error, showImages, layout, seeAllUrl } = props;

  const renderBody = (): React.ReactElement => {
    if (loading) return <Skeleton />;
    if (error) return <ErrorState message={error} />;
    if (!items || items.length === 0) return <EmptyState />;

    return (
      <div
        className={cn(
          layout === "cards"
            ? "ika-grid ika-gap-5 sm:ika-grid-cols-2 lg:ika-grid-cols-4"
            : "ika-space-y-4"
        )}
      >
        {items.map((item) => {
          const badgeStyle =
            CATEGORY_STYLES[item.Category] || DEFAULT_CATEGORY_STYLE;

          return (
            <article
              key={item.Id}
              className={cn(
                "ika-group ika-overflow-hidden ika-rounded-2xl ika-bg-white ika-shadow-sm",
                "ika-ring-1 ika-ring-slate-200 ika-transition hover:ika-shadow-md",
                layout === "list" && "ika-flex ika-gap-4 ika-p-4"
              )}
            >
              {showImages && item.HeaderImage ? (
                <img
                  src={buildImageUrl(item.HeaderImage, 600)}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "ika-object-cover",
                    layout === "cards"
                      ? "ika-h-40 ika-w-full"
                      : "ika-h-20 ika-w-28 ika-flex-shrink-0 ika-rounded-xl"
                  )}
                />
              ) : null}

              <div
                className={cn(
                  layout === "cards" ? "ika-p-5" : "ika-min-w-0 ika-flex-1"
                )}
              >
                <div className="ika-flex ika-flex-wrap ika-items-center ika-gap-2">
                  <span
                    className={cn(
                      "ika-rounded-full ika-px-2.5 ika-py-0.5 ika-text-xs ika-font-medium",
                      badgeStyle
                    )}
                  >
                    {item.Category}
                  </span>
                  {item.Highlighted ? (
                    <span className="ika-rounded-full ika-bg-brand-accent-soft ika-px-2.5 ika-py-0.5 ika-text-xs ika-font-medium ika-text-brand-accent">
                      À la une
                    </span>
                  ) : null}
                </div>

                <h3 className="ika-mt-2 ika-text-base ika-font-semibold ika-leading-snug ika-text-brand-navy">
                  {item.Title}
                </h3>

                <p className="ika-mt-1 ika-text-sm ika-leading-6 ika-text-brand-muted">
                  {truncate(item.Excerpt, 140)}
                </p>

                <div className="ika-mt-3 ika-flex ika-items-center ika-gap-2 ika-text-xs ika-text-slate-500">
                  {item.NewsAuthor ? (
                    <span>{item.NewsAuthor.Title}</span>
                  ) : null}
                  {item.NewsAuthor ? <span aria-hidden="true">·</span> : null}
                  <time dateTime={item.PublishDate}>
                    {formatDate(item.PublishDate)}
                  </time>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ika-root">
      <section className="ika-w-full">
        <header className="ika-mb-5 ika-flex ika-items-end ika-justify-between ika-gap-4">
          <div>
            <span className="ika-block ika-h-1 ika-w-10 ika-rounded ika-bg-brand-cyan" />
            <h2 className="ika-mt-3 ika-text-xl ika-font-semibold ika-text-brand-navy">
              {title}
            </h2>
          </div>

          {seeAllUrl ? (
            <a
              href={seeAllUrl}
              data-interception="propagate"
              className="ika-text-sm ika-font-medium ika-text-brand-cyan hover:ika-text-brand-cyan-dark"
            >
              Tout voir
            </a>
          ) : null}
        </header>

        {renderBody()}
      </section>
    </div>
  );
};
