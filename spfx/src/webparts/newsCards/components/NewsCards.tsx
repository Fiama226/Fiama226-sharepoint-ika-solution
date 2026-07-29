import * as React from "react";

import { INewsCardsProps } from "./INewsCardsProps";
import {
  buildImageUrl,
  cn,
  formatDate,
  resolveUrl,
  truncate,
} from "../../../common/utils/spUtils";

const Arrow: React.FC<{ className?: string }> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
    focusable="false"
    className={props.className || "ika-h-4 ika-w-4"}
  >
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const NewsCards: React.FC<INewsCardsProps> = (props) => {
  const {
    eyebrow,
    title,
    description,
    items,
    loading,
    error,
    ctaUrl,
    ctaLabel,
  } = props;

  const renderBody = (): React.ReactElement => {
    if (loading) {
      return (
        <div
          className="ika-grid ika-grid-cols-1 ika-overflow-hidden ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white md:ika-grid-cols-2 ika-animate-pulse"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="ika-flex ika-flex-col ika-gap-5 ika-p-6 sm:ika-flex-row"
            >
              <div className="ika-h-28 ika-w-full ika-shrink-0 ika-rounded-xl ika-bg-slate-200 sm:ika-w-40" />
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
          <p className="ika-text-sm ika-font-medium ika-text-brand-navy">
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
              <div className="ika-relative ika-h-44 ika-w-full ika-shrink-0 ika-overflow-hidden ika-rounded-xl ika-bg-slate-100 sm:ika-h-28 sm:ika-w-40">
                {item.HeaderImage ? (
                  <img
                    src={buildImageUrl(item.HeaderImage, 400)}
                    alt=""
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
                    {formatDate(item.PublishDate)}
                  </time>
                </div>

                <h3 className="ika-mb-2 ika-text-lg ika-font-bold ika-leading-snug ika-text-slate-900 ika-transition-colors group-hover:ika-text-brand-accent">
                  {item.Title}
                </h3>

                <p className="ika-text-sm ika-leading-relaxed ika-text-slate-500">
                  {truncate(item.Excerpt, 130)}
                </p>

                {href ? (
                  <div className="ika-mt-4 ika-flex ika-items-center ika-gap-1 ika-text-xs ika-font-bold ika-uppercase ika-tracking-wider ika-text-slate-900 ika-opacity-0 ika-transition-all ika-duration-300 group-hover:ika-opacity-100">
                    Lire la suite
                    <Arrow className="ika-h-3.5 ika-w-3.5" />
                  </div>
                ) : null}
              </div>
            </>
          );

          const cellClass = cn(
            "ika-group ika-flex ika-flex-col ika-gap-5 ika-p-5 ika-transition-colors ika-duration-300 sm:ika-flex-row sm:ika-p-6",
            href && "hover:ika-bg-slate-50",
            !isLastRow && "md:ika-border-b md:ika-border-slate-200",
            !isRightCol && "md:ika-border-r md:ika-border-slate-200",
            index !== items.length - 1 &&
              "ika-border-b ika-border-slate-200 md:ika-border-b-0"
          );

          return href ? (
            <a
              key={item.Id}
              href={href}
              data-interception="propagate"
              className={cellClass}
            >
              {inner}
            </a>
          ) : (
            <article key={item.Id} className={cellClass}>
              {inner}
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ika-root">
      <section className="ika-w-full ika-py-10" aria-labelledby="ika-news-cards-title">
        <div className="ika-mx-auto ika-w-full ika-max-w-7xl ika-px-4 sm:ika-px-6 lg:ika-px-8">
          <div className="ika-mb-8 ika-flex ika-flex-col ika-gap-2 md:ika-flex-row md:ika-items-end md:ika-justify-between">
            <div>
              <span className="ika-text-xs ika-font-semibold ika-uppercase ika-tracking-[0.3em] ika-text-brand-accent">
                {eyebrow}
              </span>
              <h2
                id="ika-news-cards-title"
                className="ika-mt-2 ika-text-3xl ika-font-extrabold ika-tracking-tight ika-text-slate-900 md:ika-text-4xl"
              >
                {title}
              </h2>
            </div>

            {description ? (
              <p className="ika-max-w-xl ika-text-sm ika-leading-relaxed ika-text-slate-500">
                {description}
              </p>
            ) : null}
          </div>

          {renderBody()}

          {ctaUrl && !loading && !error && items.length > 0 ? (
            <div className="ika-mt-8 ika-flex ika-justify-center">
              <a
                href={ctaUrl}
                data-interception="propagate"
                className="ika-group ika-flex ika-items-center ika-gap-2 ika-rounded-full ika-border ika-border-slate-300 ika-bg-white ika-px-6 ika-py-3 ika-text-sm ika-font-bold ika-text-slate-900 ika-shadow-sm ika-transition-all ika-duration-300 hover:ika-border-brand-accent hover:ika-bg-brand-accent hover:ika-text-white"
              >
                {ctaLabel}
                <Arrow className="ika-h-4 ika-w-4 ika-transition-transform ika-duration-300 group-hover:ika-translate-x-1" />
              </a>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};
