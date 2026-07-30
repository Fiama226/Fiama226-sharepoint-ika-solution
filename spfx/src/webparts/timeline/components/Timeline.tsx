import * as React from "react";

import { ITimelineProps } from "./ITimelineProps";
import { Icon } from "../../../common/utils/Icon";
import { buildImageUrl, cn } from "../../../common/utils/spUtils";

const Milestone: React.FC<{
  item: ITimelineProps["milestones"][0];
  index: number;
}> = (props) => {
  const { item, index } = props;
  const left = item.Side === "left";

  const stats = [
    { label: item.Stat1Label, value: item.Stat1Value },
    { label: item.Stat2Label, value: item.Stat2Value },
  ].filter((stat) => !!stat.label && !!stat.value);

  const card = (
    <div className="ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-p-6 ika-shadow-sm ika-transition-shadow hover:ika-shadow-md">
      <div className="ika-mb-3 ika-flex ika-flex-wrap ika-items-center ika-gap-2">
        <span
          className={cn(
            "ika-rounded-full ika-px-2.5 ika-py-0.5 ika-text-[11px] ika-font-bold",
            item.TagColorClass || "ika-bg-slate-100 ika-text-slate-700"
          )}
        >
          {item.Tag}
        </span>
        {item.Quarter ? (
          <span className="ika-text-[11px] ika-font-medium ika-text-slate-400">
            {item.Quarter}
          </span>
        ) : null}
      </div>

      <h3 className="ika-text-xl ika-font-extrabold ika-tracking-tight ika-text-brand-navy">
        {item.Title}
      </h3>

      <p className="ika-mt-2 ika-text-sm ika-leading-relaxed ika-text-slate-500">
        {item.MilestoneDescription}
      </p>

      {item.MilestoneImage ? (
        <img
          src={buildImageUrl(item.MilestoneImage, 800)}
          alt=""
          loading="lazy"
          className="ika-mt-4 ika-h-40 ika-w-full ika-rounded-xl ika-object-cover"
        />
      ) : null}

      {stats.length > 0 ? (
        <dl className="ika-mt-4 ika-flex ika-gap-6 ika-border-t ika-border-slate-100 ika-pt-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="ika-text-[11px] ika-uppercase ika-tracking-wider ika-text-slate-400">
                {stat.label}
              </dt>
              <dd className="ika-text-lg ika-font-extrabold ika-text-brand-navy">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );

  const marker = (
    <div className="ika-flex ika-shrink-0 ika-flex-col ika-items-center">
      <div className="ika-grid ika-h-12 ika-w-12 ika-place-items-center ika-rounded-full ika-bg-gradient-to-br ika-from-brand-navy ika-to-brand-cyan-dark ika-text-white ika-shadow-lg ika-ring-4 ika-ring-white">
        <Icon name={item.IconName} className="ika-h-5 ika-w-5" />
      </div>
      <span className="ika-mt-2 ika-text-lg ika-font-extrabold ika-tabular-nums ika-text-brand-navy">
        {item.Year}
      </span>
    </div>
  );

  return (
    <li className="ika-relative">
      <div className="ika-flex ika-flex-col ika-gap-4 md:ika-hidden">
        <div className="ika-flex ika-items-center ika-gap-3">{marker}</div>
        {card}
      </div>

      <div className="ika-hidden md:ika-grid md:ika-grid-cols-[1fr_auto_1fr] md:ika-items-start md:ika-gap-8">
        <div className={left ? "" : "ika-invisible"} aria-hidden={!left}>
          {left ? card : null}
        </div>

        {marker}

        <div className={left ? "ika-invisible" : ""} aria-hidden={left}>
          {!left ? card : null}
        </div>
      </div>

      {index === 0 ? null : null}
    </li>
  );
};

export const Timeline: React.FC<ITimelineProps> = (props) => {
  const {
    eyebrow,
    title,
    description,
    milestones,
    values,
    stats,
    loading,
    error,
    showValues,
    showStats,
  } = props;

  if (loading) {
    return (
      <div className="ika-root">
        <section className="ika-mx-auto ika-max-w-6xl ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
          <div className="ika-animate-pulse ika-space-y-8" aria-hidden="true">
            <div className="ika-h-8 ika-w-64 ika-rounded ika-bg-slate-200" />
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="ika-h-40 ika-rounded-2xl ika-bg-slate-100"
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ika-root">
        <section className="ika-mx-auto ika-max-w-6xl ika-px-4 ika-py-12">
          <div
            role="alert"
            className="ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
          >
            <p className="ika-text-sm ika-font-medium ika-text-red-800">
              {error}
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ika-root">
      <section
        className="ika-mx-auto ika-max-w-6xl ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8"
        aria-labelledby="ika-timeline-title"
      >
        <header className="ika-mb-12 ika-text-center">
          <span className="ika-text-xs ika-font-semibold ika-uppercase ika-tracking-[0.3em] ika-text-brand-accent">
            {eyebrow}
          </span>
          <h2
            id="ika-timeline-title"
            className="ika-mt-3 ika-text-3xl ika-font-extrabold ika-tracking-tight ika-text-brand-navy md:ika-text-4xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="ika-mx-auto ika-mt-3 ika-max-w-2xl ika-text-sm ika-leading-relaxed ika-text-slate-500">
              {description}
            </p>
          ) : null}
        </header>

        {showStats && stats.length > 0 ? (
          <dl className="ika-mb-14 ika-grid ika-grid-cols-2 ika-gap-4 md:ika-grid-cols-3 lg:ika-grid-cols-6">
            {stats.map((stat) => (
              <div
                key={stat.Id}
                className="ika-flex ika-flex-col ika-items-center ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-p-4 ika-text-center"
              >
                <span className="ika-text-brand-cyan-dark">
                  <Icon name={stat.IconName} className="ika-h-5 ika-w-5" />
                </span>
                <dd className="ika-mt-2 ika-text-2xl ika-font-extrabold ika-text-brand-navy">
                  {stat.StatValue}
                </dd>
                <dt className="ika-mt-0.5 ika-text-[11px] ika-leading-tight ika-text-slate-400">
                  {stat.Title}
                </dt>
              </div>
            ))}
          </dl>
        ) : null}

        {milestones.length === 0 ? (
          <div className="ika-rounded-2xl ika-border ika-border-dashed ika-border-slate-300 ika-bg-white ika-p-10 ika-text-center">
            <p className="ika-text-sm ika-font-medium ika-text-brand-navy">
              Aucun jalon renseigné
            </p>
            <p className="ika-mt-1 ika-text-sm ika-text-slate-500">
              Ajoutez des éléments dans la liste « Histoire ».
            </p>
          </div>
        ) : (
          <div className="ika-relative">
            <div
              aria-hidden="true"
              className="ika-absolute ika-left-6 ika-top-0 ika-hidden ika-h-full ika-w-px ika-bg-gradient-to-b ika-from-brand-cyan ika-via-slate-300 ika-to-transparent md:ika-left-1/2 md:ika-block"
            />
            <ol className="ika-space-y-12">
              {milestones.map((item, index) => (
                <Milestone key={item.Id} item={item} index={index} />
              ))}
            </ol>
          </div>
        )}

        {showValues && values.length > 0 ? (
          <div className="ika-mt-16">
            <h3 className="ika-mb-6 ika-text-center ika-text-2xl ika-font-extrabold ika-tracking-tight ika-text-brand-navy">
              Nos valeurs
            </h3>
            <div className="ika-grid ika-gap-4 sm:ika-grid-cols-2 lg:ika-grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.Id}
                  className="ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-p-5"
                >
                  <span
                    className={cn(
                      "ika-grid ika-h-10 ika-w-10 ika-place-items-center ika-rounded-xl",
                      value.BgClass || "ika-bg-slate-50",
                      value.ColorClass || "ika-text-brand-navy"
                    )}
                  >
                    <Icon name={value.IconName} className="ika-h-5 ika-w-5" />
                  </span>
                  <h4 className="ika-mt-3 ika-font-bold ika-text-brand-navy">
                    {value.Title}
                  </h4>
                  <p className="ika-mt-1 ika-text-sm ika-leading-relaxed ika-text-slate-500">
                    {value.MissionText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};
