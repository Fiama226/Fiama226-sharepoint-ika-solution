import * as React from "react";

import { ITimelineProps } from "./ITimelineProps";
import { Icon } from "../../../common/utils/Icon";
import { buildImageUrl, cn } from "../../../common/utils/spUtils";

/**
 * Timeline — port 1:1 de la page Next.js app/histoire/page.tsx :
 * Hero, Fondateur, Frise chronologique, Valeurs, Chiffres clés et CTA final.
 */

const VALUE_STYLES = [
  { icon: "Code2", color: "ika-text-blue-600", bg: "ika-bg-blue-50" },
  { icon: "Heart", color: "ika-text-rose-600", bg: "ika-bg-rose-50" },
  { icon: "Users", color: "ika-text-violet-600", bg: "ika-bg-violet-50" },
  { icon: "Globe", color: "ika-text-emerald-600", bg: "ika-bg-emerald-50" },
];

const STAT_ICONS = ["Users", "Globe", "Code2", "Star", "Calendar", "Award"];

const HISTORY_VALUES: ITimelineProps["values"] = [
  {
    Id: -1,
    Title: "Excellence Technique",
    Tag: "",
    MissionText: "Chaque ligne de code reflète notre obsession de la qualité et du détail.",
    IconName: "Code2",
    MissionType: "Valeur",
    SortOrder: 1,
    Created: "2026-01-01",
    Modified: "2026-01-01",
  },
  {
    Id: -2,
    Title: "Passion & Engagement",
    Tag: "",
    MissionText: "Nous mettons notre cœur dans chaque projet, chaque client, chaque défi.",
    IconName: "Heart",
    MissionType: "Valeur",
    SortOrder: 2,
    Created: "2026-01-01",
    Modified: "2026-01-01",
  },
  {
    Id: -3,
    Title: "Esprit d'équipe",
    Tag: "",
    MissionText: "Notre force réside dans la diversité et la complémentarité de nos talents.",
    IconName: "Users",
    MissionType: "Valeur",
    SortOrder: 3,
    Created: "2026-01-01",
    Modified: "2026-01-01",
  },
  {
    Id: -4,
    Title: "Impact africain",
    Tag: "",
    MissionText: "Nous croyons au potentiel du numérique pour transformer l'Afrique.",
    IconName: "Globe",
    MissionType: "Valeur",
    SortOrder: 4,
    Created: "2026-01-01",
    Modified: "2026-01-01",
  },
];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80";
const STATS_BG_IMAGE =
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80";

const MILESTONE_IMAGE_BY_YEAR: Record<string, string> = {
  "2015": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  "2016": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  "2018": "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  "2020": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
  "2022": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  "2024": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  "2026": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
};

const TAG_STYLE: Record<string, string> = {
  "bg-violet-100": "ika-bg-violet-100",
  "text-violet-700": "ika-text-violet-700",
  "bg-amber-100": "ika-bg-amber-100",
  "text-amber-700": "ika-text-amber-700",
  "bg-blue-100": "ika-bg-blue-100",
  "text-blue-700": "ika-text-blue-700",
  "bg-emerald-100": "ika-bg-emerald-100",
  "text-emerald-700": "ika-text-emerald-700",
  "bg-rose-100": "ika-bg-rose-100",
  "text-rose-700": "ika-text-rose-700",
  "bg-brand-accent/10": "ika-bg-brand-accent/10",
  "text-brand-accent": "ika-text-brand-accent",
};

function tagStyle(value: string | undefined): string {
  if (!value) return "ika-bg-slate-100 ika-text-slate-700";
  const classes = value
    .split(/\s+/)
    .map((token) => TAG_STYLE[token] || (token.indexOf("ika-") === 0 ? token : ""))
    .filter(Boolean);
  return classes.length > 0
    ? classes.join(" ")
    : "ika-bg-slate-100 ika-text-slate-700";
}

const FOUNDER_AVATAR = "/SiteAssets/team/DG.jpg";

const Hero: React.FC<{ stats: ITimelineProps["stats"] }> = (props) => {
  const { stats } = props;

  return (
    <section className="ika-relative ika-min-h-[92vh] ika-w-full ika-overflow-hidden">
      <img
        src={HERO_IMAGE}
        alt="hero"
        className="ika-absolute ika-inset-0 ika-h-full ika-w-full ika-object-cover"
      />
      <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-r ika-from-slate-950/95 ika-via-slate-900/80 ika-to-slate-900/40" />
      <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-t ika-from-slate-950/80 ika-via-transparent ika-to-transparent" />

      <div className="ika-relative ika-z-10 ika-flex ika-min-h-[92vh] ika-flex-col ika-justify-center ika-px-6 sm:ika-px-12 lg:ika-px-20">
        <div className="ika-max-w-3xl">
          <div className="ika-mb-6 ika-flex ika-items-center ika-gap-3">
            <span aria-hidden="true" className="ika-h-px ika-w-12 ika-bg-brand-accent" />
            <span className="ika-text-xs ika-font-bold ika-uppercase ika-tracking-[0.3em] ika-text-brand-accent">
              Notre histoire
            </span>
          </div>

          <h1 className="ika-mb-6 ika-text-5xl ika-font-extrabold ika-leading-tight ika-tracking-tight ika-text-white md:ika-text-7xl">
            Bâtir le <span className="ika-text-brand-accent">digital</span>{" "}
            <br />
            de demain.
          </h1>

          <p className="ika-mb-10 ika-max-w-xl ika-text-lg ika-leading-relaxed ika-text-slate-400">
            Depuis 2014, IKA Solution transforme les idées en solutions
            technologiques qui font avancer l&apos;Afrique et ses entreprises.
            Une aventure humaine, passionnée, et résolument tournée vers
            l&apos;avenir.
          </p>

          <div className="ika-flex ika-flex-wrap ika-items-center ika-gap-6">
            <a
              href="#ika-timeline"
              className="ika-group ika-flex ika-items-center ika-gap-2 ika-rounded-full ika-bg-brand-accent ika-px-7 ika-py-3.5 ika-text-sm ika-font-bold ika-text-white ika-shadow-lg ika-shadow-brand-accent/30 ika-transition-all ika-duration-200 hover:ika-bg-brand-accent-dark hover:ika-shadow-brand-accent/50"
            >
              Découvrir notre parcours
              <Icon
                name="fa-arrow-right"
                className="ika-h-4 ika-w-4 ika-transition-transform ika-duration-200 group-hover:ika-translate-x-1"
              />
            </a>
            <div className="ika-flex ika-items-center ika-gap-2 ika-text-slate-400">
              <Icon name="MapPin" className="ika-h-3.5 ika-w-3.5 ika-text-brand-accent" />
              <span className="ika-text-sm">Fondée à Ouagadougou, 2014</span>
            </div>
          </div>
        </div>

        <div className="ika-absolute ika-bottom-0 ika-left-0 ika-right-0 ika-border-t ika-border-white/10 ika-bg-slate-950/60 ika-backdrop-blur-md">
          <div className="ika-mx-auto ika-flex ika-max-w-6xl ika-flex-wrap ika-items-center ika-justify-around ika-gap-6 ika-px-6 ika-py-5">
            {stats.slice(0, 4).map((stat, i) => (
              <div key={stat.Id} className="ika-flex ika-items-center ika-gap-3">
                <div className="ika-flex ika-h-9 ika-w-9 ika-items-center ika-justify-center ika-rounded-xl ika-bg-brand-accent/10">
                  <Icon
                    name={stat.IconName || STAT_ICONS[i] || "Target"}
                    className="ika-h-4 ika-w-4 ika-text-brand-accent"
                  />
                </div>
                <div>
                  <p className="ika-text-xl ika-font-extrabold ika-leading-none ika-text-white">
                    {stat.StatValue}
                  </p>
                  <p className="ika-text-[11px] ika-text-slate-500">{stat.Title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Founders: React.FC = () => (
  <section className="ika-w-full ika-bg-white ika-px-4 ika-py-20 sm:ika-px-6 lg:ika-px-8">
    <div className="ika-mx-auto ika-max-w-6xl">
      <div className="ika-mb-14 ika-text-center">
        <span className="ika-text-xs ika-font-bold ika-uppercase ika-tracking-[0.3em] ika-text-brand-accent">
          Les visionnaires
        </span>
        <h2 className="ika-mt-3 ika-text-4xl ika-font-extrabold ika-tracking-tight ika-text-slate-900">
          Ceux qui ont tout lancé
        </h2>
        <p className="ika-mx-auto ika-mt-4 ika-max-w-xl ika-text-slate-500">
          IKA Solution est née de la conviction que l&apos;Afrique mérite des
          solutions technologiques de classe mondiale.
        </p>
      </div>

      <div className="ika-grid ika-grid-cols-1 ika-gap-8 md:ika-grid-cols-2">
        <div className="ika-group ika-relative ika-overflow-hidden ika-rounded-3xl ika-border ika-border-slate-100 ika-bg-slate-50 ika-p-8 ika-transition-all ika-duration-300 hover:-ika-translate-y-1 hover:ika-shadow-xl">
          <div
            aria-hidden="true"
            className="ika-absolute ika-left-0 ika-top-0 ika-h-1 ika-w-full ika-bg-gradient-to-r ika-from-brand-accent ika-to-transparent"
          />
          <div className="ika-flex ika-items-start ika-gap-6">
            <div className="ika-h-20 ika-w-20 ika-shrink-0 ika-overflow-hidden ika-rounded-2xl ika-border-2 ika-border-brand-accent/30 ika-shadow-md">
              <img
                src={buildImageUrl(FOUNDER_AVATAR)}
                alt="YAYA Ouattara"
                className="ika-h-full ika-w-full ika-object-cover ika-object-top"
              />
            </div>
            <div className="ika-flex-1">
              <h3 className="ika-font-extrabold ika-text-slate-900">
                YAYA Ouattara
              </h3>
              <p className="ika-mt-0.5 ika-text-sm ika-font-semibold ika-text-brand-accent">
                Fondateur &amp; Directeur Général
              </p>
              <blockquote className="ika-mt-4 ika-border-l-2 ika-border-brand-accent/30 ika-pl-4 ika-text-sm ika-italic ika-leading-relaxed ika-text-slate-500">
                &ldquo;Notre mission est de prouver que l&apos;excellence
                technologique n&apos;a pas de frontières.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const MilestoneCard: React.FC<{
  item: ITimelineProps["milestones"][0];
  active: boolean;
  onClick: () => void;
}> = (props) => {
  const { item, active, onClick } = props;

  const stats = [
    { label: item.Stat1Label, value: item.Stat1Value },
    { label: item.Stat2Label, value: item.Stat2Value },
  ].filter((stat) => !!stat.label && !!stat.value);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className={cn(
        "ika-group ika-cursor-pointer ika-overflow-hidden ika-rounded-3xl ika-border ika-bg-white ika-shadow-sm ika-transition-all ika-duration-300 hover:-ika-translate-y-1 hover:ika-shadow-xl",
        active ? "ika-border-brand-accent/40 ika-shadow-lg" : "ika-border-slate-200"
      )}
    >
      <div className="ika-relative ika-h-52 ika-overflow-hidden">
        <img
          src={
            item.MilestoneImage
              ? buildImageUrl(item.MilestoneImage, 800)
              : MILESTONE_IMAGE_BY_YEAR[item.Year] || HERO_IMAGE
          }
          alt={item.Title}
          loading="lazy"
          className="ika-h-full ika-w-full ika-object-cover ika-transition-transform ika-duration-500 group-hover:ika-scale-105"
        />
        <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-t ika-from-black/60 ika-to-transparent" />

        <div className="ika-absolute ika-left-4 ika-top-4 ika-rounded-xl ika-bg-black/50 ika-px-3 ika-py-1.5 ika-backdrop-blur-sm">
          {item.Quarter ? (
            <p className="ika-text-xs ika-font-bold ika-text-white/60">
              {item.Quarter}
            </p>
          ) : null}
          <p className="ika-text-2xl ika-font-extrabold ika-leading-none ika-text-white">
            {item.Year}
          </p>
        </div>

        <div className="ika-absolute ika-bottom-4 ika-left-4">
          <span
            className={cn(
              "ika-rounded-full ika-px-3 ika-py-1 ika-text-[10px] ika-font-bold ika-uppercase ika-tracking-widest",
              tagStyle(item.TagColorClass)
            )}
          >
            {item.Tag}
          </span>
        </div>
      </div>

      <div className="ika-p-6">
        <h3 className="ika-mb-2 ika-text-xl ika-font-extrabold ika-text-slate-900 ika-transition-colors group-hover:ika-text-brand-accent">
          {item.Title}
        </h3>
        <p className="ika-text-sm ika-leading-relaxed ika-text-slate-500">
          {item.MilestoneDescription}
        </p>

        {stats.length > 0 ? (
          <div className="ika-mt-5 ika-flex ika-gap-4">
            {stats.map((stat, j) => (
              <div
                key={j}
                className="ika-rounded-xl ika-bg-slate-50 ika-px-4 ika-py-2.5 ika-text-center"
              >
                <p className="ika-text-xl ika-font-extrabold ika-text-brand-accent">
                  {stat.value}
                </p>
                <p className="ika-text-[10px] ika-font-semibold ika-text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const TimelineSection: React.FC<{ milestones: ITimelineProps["milestones"] }> = (
  props
) => {
  const { milestones } = props;
  const [activeId, setActiveId] = React.useState<number | null>(null);

  return (
    <section
      id="ika-timeline"
      className="ika-w-full ika-bg-slate-50 ika-px-4 ika-py-20 sm:ika-px-6 lg:ika-px-8"
    >
      <div className="ika-mx-auto ika-max-w-6xl">
        <div className="ika-mb-16 ika-text-center">
          <span className="ika-text-xs ika-font-bold ika-uppercase ika-tracking-[0.3em] ika-text-brand-accent">
            Chronologie
          </span>
          <h2 className="ika-mt-3 ika-text-4xl ika-font-extrabold ika-tracking-tight ika-text-slate-900">
            9 ans d&apos;innovation
          </h2>
          <p className="ika-mx-auto ika-mt-4 ika-max-w-xl ika-text-slate-500">
            De trois fondateurs passionnés à une équipe de 138 experts — chaque
            étape a forgé ce que nous sommes aujourd&apos;hui.
          </p>
        </div>

        <div className="ika-relative">
          <div
            aria-hidden="true"
            className="ika-absolute ika-left-1/2 ika-top-0 ika-hidden ika-h-full ika-w-px -ika-translate-x-1/2 ika-bg-gradient-to-b ika-from-brand-accent ika-via-slate-300 ika-to-transparent md:ika-block"
          />

          <div className="ika-flex ika-flex-col ika-gap-16">
            {milestones.map((m, i) => {
              const isLeft = m.Side === "left";
              const isActive = activeId === i;

              return (
                <div
                  key={m.Id}
                  className={cn(
                    "ika-relative ika-flex ika-flex-col ika-items-center ika-gap-8 md:ika-flex-row",
                    isLeft ? "md:ika-flex-row-reverse" : ""
                  )}
                >
                  <div className="ika-w-full md:ika-w-5/12">
                    <MilestoneCard
                      item={m}
                      active={isActive}
                      onClick={() => setActiveId(isActive ? null : i)}
                    />
                  </div>

                  <div className="ika-hidden md:ika-flex md:ika-w-2/12 md:ika-items-center md:ika-justify-center">
                    <div
                      className={cn(
                        "ika-relative ika-flex ika-h-14 ika-w-14 ika-items-center ika-justify-center ika-rounded-full ika-border-4 ika-bg-white ika-shadow-lg ika-transition-all ika-duration-300",
                        isActive
                          ? "ika-border-brand-accent ika-shadow-brand-accent/30"
                          : "ika-border-slate-300"
                      )}
                    >
                      <Icon
                        name={m.IconName || "Target"}
                        className={cn(
                          "ika-h-[22px] ika-w-[22px]",
                          isActive ? "ika-text-brand-accent" : "ika-text-slate-400"
                        )}
                      />
                    </div>
                  </div>

                  <div className="ika-hidden md:ika-block md:ika-w-5/12" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const Values: React.FC<{ values: ITimelineProps["values"] }> = (props) => {
  const { values } = props;

  return (
    <section className="ika-w-full ika-bg-white ika-px-4 ika-py-20 sm:ika-px-6 lg:ika-px-8">
      <div className="ika-mx-auto ika-max-w-6xl">
        <div className="ika-mb-14 ika-text-center">
          <span className="ika-text-xs ika-font-bold ika-uppercase ika-tracking-[0.3em] ika-text-brand-accent">
            Notre ADN
          </span>
          <h2 className="ika-mt-3 ika-text-4xl ika-font-extrabold ika-tracking-tight ika-text-slate-900">
            Ce qui nous guide
          </h2>
        </div>

        <div className="ika-grid ika-grid-cols-1 ika-gap-6 sm:ika-grid-cols-2 lg:ika-grid-cols-4">
          {values.slice(0, 4).map((v, i) => {
            const style = VALUE_STYLES[i % VALUE_STYLES.length];
            return (
              <div
                key={v.Id}
                className="ika-group ika-rounded-3xl ika-border ika-border-slate-100 ika-bg-slate-50 ika-p-7 ika-transition-all ika-duration-300 hover:-ika-translate-y-1 hover:ika-border-transparent hover:ika-shadow-xl"
              >
                <div
                  className={cn(
                    "ika-mb-5 ika-flex ika-h-12 ika-w-12 ika-items-center ika-justify-center ika-rounded-2xl ika-transition-transform ika-duration-300 group-hover:ika-scale-110",
                    style.bg
                  )}
                >
                  <Icon
                    name={v.IconName || style.icon}
                    className={cn("ika-h-[22px] ika-w-[22px]", style.color)}
                  />
                </div>
                <h3 className="ika-mb-2 ika-font-extrabold ika-text-slate-900">
                  {v.Title}
                </h3>
                <p className="ika-text-sm ika-leading-relaxed ika-text-slate-500">
                  {v.MissionText}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FullStats: React.FC<{ stats: ITimelineProps["stats"] }> = (props) => {
  const { stats } = props;

  return (
    <section className="ika-relative ika-w-full ika-overflow-hidden ika-py-24">
      <img
        src={STATS_BG_IMAGE}
        alt="stats bg"
        className="ika-absolute ika-inset-0 ika-h-full ika-w-full ika-object-cover"
      />
      <div className="ika-absolute ika-inset-0 ika-bg-slate-950/90" />

      <div className="ika-relative ika-z-10 ika-mx-auto ika-max-w-6xl ika-px-6">
        <div className="ika-mb-14 ika-text-center">
          <span className="ika-text-xs ika-font-bold ika-uppercase ika-tracking-[0.3em] ika-text-brand-accent">
            IKA en chiffres
          </span>
          <h2 className="ika-mt-3 ika-text-4xl ika-font-extrabold ika-tracking-tight ika-text-white">
            Une croissance continue
          </h2>
        </div>

        <div className="ika-grid ika-grid-cols-2 ika-gap-6 sm:ika-grid-cols-3 lg:ika-grid-cols-6">
          {stats.map((stat, i) => (
            <div
              key={stat.Id}
              className="ika-group ika-flex ika-flex-col ika-items-center ika-rounded-2xl ika-border ika-border-white/10 ika-bg-white/5 ika-p-6 ika-text-center ika-backdrop-blur-sm ika-transition-all ika-duration-200 hover:ika-border-brand-accent/30 hover:ika-bg-brand-accent/10"
            >
              <div className="ika-mb-3 ika-flex ika-h-11 ika-w-11 ika-items-center ika-justify-center ika-rounded-xl ika-bg-brand-accent/10 ika-transition-colors group-hover:ika-bg-brand-accent/20">
                <Icon
                  name={stat.IconName || STAT_ICONS[i] || "Target"}
                  className="ika-h-5 ika-w-5 ika-text-brand-accent"
                />
              </div>
              <p className="ika-text-3xl ika-font-extrabold ika-text-white">
                {stat.StatValue}
              </p>
              <p className="ika-mt-1 ika-text-[11px] ika-font-semibold ika-text-slate-500">
                {stat.Title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VisionCta: React.FC = () => (
  <section className="ika-w-full ika-bg-white ika-px-4 ika-py-24 sm:ika-px-6 lg:ika-px-8">
    <div className="ika-mx-auto ika-max-w-6xl">
      <div className="ika-relative ika-overflow-hidden ika-rounded-3xl ika-bg-slate-900 ika-px-8 ika-py-16 ika-text-center ika-shadow-2xl">
        <div
          aria-hidden="true"
          className="ika-absolute -ika-left-20 -ika-top-20 ika-h-64 ika-w-64 ika-rounded-full ika-bg-brand-accent/10 ika-blur-3xl"
        />
        <div
          aria-hidden="true"
          className="ika-absolute -ika-bottom-20 -ika-right-20 ika-h-64 ika-w-64 ika-rounded-full ika-bg-violet-500/10 ika-blur-3xl"
        />

        <div className="ika-relative ika-z-10">
          <span className="ika-text-xs ika-font-bold ika-uppercase ika-tracking-[0.3em] ika-text-brand-accent">
            Et maintenant ?
          </span>
          <h2 className="ika-mx-auto ika-mt-4 ika-max-w-2xl ika-text-4xl ika-font-extrabold ika-leading-tight ika-tracking-tight ika-text-white md:ika-text-5xl">
            Notre histoire continue de s&apos;écrire.
          </h2>
          <p className="ika-mx-auto ika-mt-5 ika-max-w-xl ika-text-slate-400">
            Rejoignez IKA Solution et participez à la prochaine étape de notre
            aventure. Que vous soyez client, partenaire ou talent, votre place
            est ici.
          </p>

          <div className="ika-mt-10 ika-flex ika-flex-wrap ika-items-center ika-justify-center ika-gap-4">
            <a
              href="#ika-timeline"
              className="ika-group ika-flex ika-items-center ika-gap-2 ika-rounded-full ika-bg-brand-accent ika-px-8 ika-py-3.5 ika-text-sm ika-font-bold ika-text-white ika-shadow-lg ika-shadow-brand-accent/30 ika-transition-all hover:ika-bg-brand-accent-dark"
            >
              Nous rejoindre
              <Icon
                name="fa-arrow-right"
                className="ika-h-4 ika-w-4 ika-transition-transform group-hover:ika-translate-x-1"
              />
            </a>
            <a
              href="#equipe"
              className="ika-flex ika-items-center ika-gap-2 ika-rounded-full ika-border ika-border-white/20 ika-px-8 ika-py-3.5 ika-text-sm ika-font-bold ika-text-white ika-transition-all hover:ika-border-white/40 hover:ika-bg-white/10"
            >
              Nos services
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const Timeline: React.FC<ITimelineProps> = (props) => {
  const { milestones, stats, loading, error, showValues, showStats } = props;

  if (loading) {
    return (
      <div className="ika-root">
        <div className="ika-h-[92vh] ika-w-full ika-animate-pulse ika-bg-slate-200" />
        <div className="ika-mx-auto ika-max-w-6xl ika-space-y-8 ika-px-4 ika-py-12">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="ika-h-64 ika-rounded-3xl ika-bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ika-root">
        <div
          role="alert"
          className="ika-mx-auto ika-mt-6 ika-max-w-6xl ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ika-root">
      <main className="ika-w-full">
        <Hero stats={stats} />
        <Founders />
        <TimelineSection milestones={milestones} />
        {showValues ? <Values values={HISTORY_VALUES} /> : null}
        {showStats ? <FullStats stats={stats} /> : null}
        <VisionCta />
      </main>
    </div>
  );
};
