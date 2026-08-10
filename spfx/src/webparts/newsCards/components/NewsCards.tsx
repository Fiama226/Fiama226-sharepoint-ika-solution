import * as React from "react";

import { INewsCardsProps } from "./INewsCardsProps";
import {
  buildImageUrl,
  cn,
  resolveUrl,
} from "../../../common/utils/spUtils";
import { Icon } from "../../../common/utils/Icon";

/**
 * NewsCards — port 1:1 de components/intranet/News.tsx (maquette Next.js) :
 * grille d'actualités 2 colonnes avec image, catégorie/date, extrait et
 * bouton CTA « Voir toutes les actualités ».
 */

function formatDayMonth(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export const NewsCards: React.FC<INewsCardsProps> = (props) => {
  const { eyebrow, title, description, items, loading, error, ctaUrl, ctaLabel } =
    props;

  const renderBody = (): React.ReactElement => {
    if (loading) {
      return (
        <div
          className="ika-grid ika-grid-cols-1 ika-overflow-hidden ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-animate-pulse md:ika-grid-cols-2"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="ika-flex ika-flex-col ika-gap-5 ika-p-5 sm:ika-flex-row sm:ika-p-6"
            >
              <div className="ika-h-44 ika-w-full ika-shrink-0 ika-rounded-xl ika-bg-slate-200 sm:ika-h-28 sm:ika-w-40" />
              <div className="ika-flex-1 ika-space-y-3">
                <div className="ika-h-3 ika-w-24 ika-rounded ika-bg-slate-200" />
                <div className="ika-h-5 ika-w-3/4 ika-rounded ika-bg-slate-200" />
                <div className="ika-h-3 ika-w-full ika-rounded ika-bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div
          role="alert"
          className="ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="ika-rounded-2xl ika-border ika-border-dashed ika-border-slate-300 ika-bg-white ika-p-10 ika-text-center">
          <p className="ika-text-sm ika-font-medium ika-text-slate-900">
            Aucune actualité publiée
          </p>
          <p className="ika-mt-1 ika-text-sm ika-text-slate-500">
            Les nouvelles publications apparaîtront ici.
          </p>
        </div>
      );
    }

    return (
      <div className="ika-grid ika-grid-cols-1 ika-overflow-hidden ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-shadow-sm md:ika-grid-cols-2">
        {items.map((item, index) => {
          const isLastRow = index >= items.length - 2;
          const isRightCol = index % 2 === 1;
          const href = item.ExternalLink
            ? resolveUrl(item.ExternalLink)
            : undefined;

          const inner = (
            <>
              <div className="ika-relative ika-h-44 ika-w-full ika-shrink-0 ika-overflow-hidden ika-rounded-xl ika-bg-slate-100 ika-shadow-sm sm:ika-h-28 sm:ika-w-40">
                {item.HeaderImage ? (
                  <img
                    src={buildImageUrl(item.HeaderImage, 400)}
                    alt={item.Title}
                    loading="lazy"
                    className="ika-h-full ika-w-full ika-object-cover ika-transition-transform ika-duration-500 group-hover:ika-scale-105"
                  />
                ) : null}
              </div>

              <div className="ika-flex ika-min-w-0 ika-flex-1 ika-flex-col">
                <div className="ika-mb-2 ika-flex ika-items-center ika-gap-2">
                  <span className="ika-text-[11px] ika-font-bold ika-uppercase ika-tracking-widest ika-text-brand-accent">
                    {item.Category}
                  </span>
                  <span aria-hidden="true" className="ika-text-xs ika-text-slate-300">
                    ·
                  </span>
                  <time
                    dateTime={item.PublishDate}
                    className="ika-text-[11px] ika-font-medium ika-text-slate-400"
                  >
                    {formatDayMonth(item.PublishDate)}
                  </time>
                </div>

                <h2 className="ika-mb-2 ika-text-lg ika-font-bold ika-leading-snug ika-text-slate-900 ika-transition-colors ika-duration-300 group-hover:ika-text-brand-accent">
                  {item.Title}
                </h2>

                <p className="ika-line-clamp-2 ika-text-sm ika-leading-relaxed ika-text-slate-500">
                  {item.Excerpt}
                </p>

                <div className="ika-mt-4 ika-flex ika-translate-x-[-4px] ika-items-center ika-gap-1 ika-text-xs ika-font-bold ika-uppercase ika-tracking-wider ika-text-slate-900 ika-opacity-0 ika-transition-all ika-duration-300 group-hover:ika-translate-x-0 group-hover:ika-opacity-100">
                  Lire la suite
                  <Icon name="fa-arrow-right" className="ika-h-3.5 ika-w-3.5" />
                </div>
              </div>
            </>
          );

          return (
            <a
              key={item.Id}
              href={href || "#actualites"}
              data-interception="propagate"
              onClick={(e) => {
                if (!href) {
                  e.preventDefault();
                  window.location.hash = "#actualites";
                }
              }}
              className={cn(
                "ika-group ika-flex ika-cursor-pointer ika-flex-col ika-gap-5 ika-p-5 ika-transition-colors ika-duration-300 hover:ika-bg-slate-50 sm:ika-flex-row sm:ika-p-6",
                !isLastRow ? "md:ika-border-b md:ika-border-slate-200" : "",
                !isRightCol ? "md:ika-border-r md:ika-border-slate-200" : "",
                index !== items.length - 1
                  ? "ika-border-b ika-border-slate-200 md:ika-border-b-0"
                  : ""
              )}
            >
              {inner}
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ika-root">
      <section className="ika-w-full ika-py-10">
        <div className="ika-mx-auto ika-w-full ika-max-w-7xl ika-px-4 sm:ika-px-6 lg:ika-px-8">
          {/* Header */}
          <div className="ika-mb-8 ika-flex ika-flex-col ika-gap-2 md:ika-flex-row md:ika-items-end md:ika-justify-between">
            <div>
              <span className="ika-text-xs ika-font-semibold ika-uppercase ika-tracking-[0.3em] ika-text-brand-accent">
                {eyebrow || "Vie interne"}
              </span>
              <h1 className="ika-mt-2 ika-text-3xl ika-font-extrabold ika-tracking-tight ika-text-slate-900 md:ika-text-4xl">
                {title || "Actualités de l'entreprise"}
              </h1>
            </div>

            {description ? (
              <p className="ika-max-w-xl ika-text-sm ika-leading-relaxed ika-text-slate-500">
                {description}
              </p>
            ) : null}
          </div>

          {renderBody()}

          {/* Footer */}
          <div className="ika-mt-8 ika-flex ika-justify-center">
            <a
              href={ctaUrl || "#actualites"}
              data-interception="propagate"
              onClick={(e) => {
                if (!ctaUrl) {
                  e.preventDefault();
                  window.location.hash = "#actualites";
                }
              }}
              className="ika-group ika-flex ika-items-center ika-gap-2 ika-rounded-full ika-border ika-border-slate-300 ika-bg-white ika-px-6 ika-py-3 ika-text-sm ika-font-bold ika-text-slate-900 ika-shadow-sm ika-transition-all ika-duration-300 hover:ika-border-brand-accent hover:ika-bg-brand-accent hover:ika-text-white"
            >
              {ctaLabel || "Voir toutes les actualités"}
              <Icon
                name="fa-arrow-right"
                className="ika-h-4 ika-w-4 ika-transition-transform ika-duration-300 group-hover:ika-translate-x-1"
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
