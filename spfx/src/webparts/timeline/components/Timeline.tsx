import * as React from "react";

import { ITimelineFounder, ITimelineProps } from "./ITimelineProps";
import { Icon } from "../../../common/utils/Icon";
import { buildImageUrl, cn } from "../../../common/utils/spUtils";

/**
 * Timeline — page « Notre histoire » (#histoire).
 *
 * Trois règles tiennent ce fichier :
 *
 * 1. AUCUN chiffre ni millésime n'est écrit en dur. L'ancienneté, le nombre
 *    d'étapes et la première année sont DÉRIVÉS des listes SharePoint. Une
 *    valeur recopiée dans une phrase (« 9 ans », « 138 experts ») redevient
 *    fausse dès l'année suivante sans que personne ne s'en aperçoive.
 * 2. AUCUNE ressource externe. Les visuels viennent de `SiteAssets` via des
 *    URL résolues par la web part ; une image absente bascule sur un rendu
 *    typographique, qui est un état prévu et non une panne.
 * 3. Un contrôle n'existe que s'il produit un effet visible. Le seul élément
 *    interactif de la page (le dépliage d'un jalon) n'est rendu que lorsqu'il
 *    reste effectivement du contenu à révéler.
 */

const VALUE_STYLES = [
  { icon: "Code2", color: "ika-text-blue-700", bg: "ika-bg-blue-50" },
  { icon: "Heart", color: "ika-text-rose-700", bg: "ika-bg-rose-50" },
  { icon: "Users", color: "ika-text-violet-700", bg: "ika-bg-violet-50" },
  { icon: "Globe", color: "ika-text-emerald-700", bg: "ika-bg-emerald-50" },
];

const STAT_ICONS = ["Users", "Globe", "Code2", "Star", "Calendar", "Award"];

/** Au-delà, la description est tronquée et le dépliage a un intérêt. */
const CLAMP_THRESHOLD = 140;

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

/**
 * Étiquette + titre de section.
 *
 * `align` existe pour casser la répétition : cinq sections empilant le même
 * bloc centré donnent une page qui ressemble à un gabarit appliqué cinq fois,
 * pas à une mise en page. Les sections éditoriales passent à gauche.
 */
const SectionHeading: React.FC<{
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
  onDark?: boolean;
}> = (props) => {
  const { eyebrow, title, lead, align = "center", onDark = false } = props;

  return (
    <div
      className={cn(
        "ika-mb-12",
        align === "center" ? "ika-text-center" : "ika-max-w-2xl"
      )}
    >
      <span className="ika-text-xs ika-font-semibold ika-uppercase ika-tracking-[0.2em] ika-text-brand-accent">
        {eyebrow}
      </span>
      <h2
        className={cn(
          "ika-mt-3 ika-text-3xl ika-font-bold ika-tracking-tight",
          onDark ? "ika-text-white" : "ika-text-slate-900"
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "ika-mt-4 ika-text-base ika-leading-relaxed",
            align === "center" ? "ika-mx-auto ika-max-w-2xl" : "",
            onDark ? "ika-text-slate-300" : "ika-text-slate-600"
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------------ */
/* Hero                                                                      */
/* ------------------------------------------------------------------------ */

const Hero: React.FC<{
  eyebrow: string;
  title: string;
  description: string;
  foundedYear: number;
  imageUrl: string;
  stats: ITimelineProps["stats"];
}> = (props) => {
  const { eyebrow, title, description, foundedYear, imageUrl, stats } = props;
  const [imageFailed, setImageFailed] = React.useState<boolean>(false);

  const showImage = !!imageUrl && !imageFailed;
  const headline = stats.slice(0, 4);

  return (
    <section className="ika-relative ika-w-full ika-overflow-hidden ika-bg-slate-950">
      {showImage ? (
        <>
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            onError={() => setImageFailed(true)}
            className="ika-absolute ika-inset-0 ika-h-full ika-w-full ika-object-cover"
          />
          <div
            aria-hidden="true"
            className="ika-absolute ika-inset-0 ika-bg-gradient-to-r ika-from-slate-950 ika-via-slate-950/90 ika-to-slate-950/60"
          />
        </>
      ) : null}

      {/* Hauteur pilotée par le contenu et non par `vh` : l'en-tête SPFx
          occupe déjà ~104 px, un `min-h-[92vh]` déborderait donc toujours
          sous la ligne de flottaison et rendrait le paysage mobile inutile. */}
      <div className="ika-relative ika-z-10 ika-mx-auto ika-flex ika-min-h-[26rem] ika-max-w-6xl ika-flex-col ika-justify-center ika-px-4 ika-py-20 sm:ika-px-6 lg:ika-px-8 lg:ika-py-28">
        <div className="ika-max-w-3xl">
          <div className="ika-mb-6 ika-flex ika-items-center ika-gap-3">
            <span
              aria-hidden="true"
              className="ika-h-px ika-w-10 ika-bg-brand-accent"
            />
            <span className="ika-text-xs ika-font-semibold ika-uppercase ika-tracking-[0.2em] ika-text-brand-accent">
              {eyebrow}
            </span>
          </div>

          <h1 className="ika-text-4xl ika-font-bold ika-leading-[1.1] ika-tracking-tight ika-text-white md:ika-text-6xl">
            {title}
          </h1>

          {description ? (
            <p className="ika-mt-6 ika-max-w-xl ika-text-lg ika-leading-relaxed ika-text-slate-300">
              {description}
            </p>
          ) : null}

          <div className="ika-mt-10 ika-flex ika-flex-wrap ika-items-center ika-gap-x-8 ika-gap-y-4">
            <a
              href="#ika-timeline"
              className="ika-group ika-inline-flex ika-items-center ika-gap-2 ika-rounded-full ika-bg-brand-accent ika-px-6 ika-py-3 ika-text-sm ika-font-semibold ika-text-white ika-transition-colors hover:ika-bg-brand-accent-dark focus-visible:ika-outline focus-visible:ika-outline-2 focus-visible:ika-outline-offset-2 focus-visible:ika-outline-brand-accent"
            >
              Découvrir notre parcours
              <Icon
                name="fa-arrow-right"
                className="ika-h-4 ika-w-4 ika-transition-transform group-hover:ika-translate-x-0.5"
              />
            </a>
            <span className="ika-flex ika-items-center ika-gap-2 ika-text-sm ika-text-slate-300">
              <Icon
                name="MapPin"
                className="ika-h-4 ika-w-4 ika-text-brand-accent"
              />
              Fondée à Ouagadougou en {foundedYear}
            </span>
          </div>
        </div>
      </div>

      {/* Bandeau d'indicateurs : élément de flux et non `absolute`. En
          positionnement absolu il chevauchait le texte dès que le hero se
          tassait (mobile, zoom navigateur, texte long). */}
      {headline.length > 0 ? (
        <div className="ika-relative ika-z-10 ika-border-t ika-border-white/10 ika-bg-slate-950/70">
          <dl className="ika-mx-auto ika-flex ika-max-w-6xl ika-flex-wrap ika-gap-x-10 ika-gap-y-5 ika-px-4 ika-py-5 sm:ika-px-6 lg:ika-px-8">
            {headline.map((stat, i) => (
              <div key={stat.Id} className="ika-flex ika-items-center ika-gap-3">
                <span className="ika-flex ika-h-9 ika-w-9 ika-shrink-0 ika-items-center ika-justify-center ika-rounded-lg ika-bg-brand-accent/15">
                  <Icon
                    name={stat.IconName || STAT_ICONS[i] || "Target"}
                    className="ika-h-4 ika-w-4 ika-text-brand-accent"
                  />
                </span>
                <div>
                  <dd className="ika-text-xl ika-font-semibold ika-leading-none ika-tabular-nums ika-text-white">
                    {stat.StatValue}
                  </dd>
                  {/* slate-300 et non slate-500 : ce dernier tombe à ~4,2:1
                      sur fond slate-950, sous le seuil AA du petit texte. */}
                  <dt className="ika-mt-1 ika-text-xs ika-text-slate-300">
                    {stat.Title}
                  </dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </section>
  );
};

/* ------------------------------------------------------------------------ */
/* Fondateur                                                                 */
/* ------------------------------------------------------------------------ */

const Founder: React.FC<{ founder: ITimelineFounder }> = (props) => {
  const { founder } = props;
  const [photoFailed, setPhotoFailed] = React.useState<boolean>(false);

  const showPhoto = !!founder.photoUrl && !photoFailed;

  return (
    <section className="ika-w-full ika-bg-white ika-px-4 ika-py-20 sm:ika-px-6 lg:ika-px-8">
      <div className="ika-mx-auto ika-max-w-4xl">
        <div className="ika-flex ika-flex-col ika-gap-8 sm:ika-flex-row sm:ika-items-start sm:ika-gap-10">
          <div className="ika-shrink-0">
            {showPhoto ? (
              <img
                src={founder.photoUrl}
                alt={founder.name}
                onError={() => setPhotoFailed(true)}
                className="ika-h-24 ika-w-24 ika-rounded-2xl ika-object-cover ika-object-top"
              />
            ) : (
              <span
                aria-hidden="true"
                className="ika-grid ika-h-24 ika-w-24 ika-place-items-center ika-rounded-2xl ika-bg-brand-navy ika-text-2xl ika-font-semibold ika-text-white"
              >
                {initialsOf(founder.name)}
              </span>
            )}
          </div>

          <div className="ika-min-w-0">
            {/* La citation EST le titre de la section : pas d'étiquette ni de
                sur-titre ici, sinon on empile un cinquième bloc identique. */}
            <blockquote className="ika-text-2xl ika-font-medium ika-leading-snug ika-tracking-tight ika-text-slate-900">
              &ldquo;{founder.quote}&rdquo;
            </blockquote>
            <footer className="ika-mt-6 ika-flex ika-items-center ika-gap-3">
              <span
                aria-hidden="true"
                className="ika-h-px ika-w-8 ika-bg-brand-accent"
              />
              <p className="ika-text-sm ika-text-slate-600">
                <span className="ika-font-semibold ika-text-slate-900">
                  {founder.name}
                </span>
                {founder.role ? ` · ${founder.role}` : ""}
              </p>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------------ */
/* Chronologie                                                               */
/* ------------------------------------------------------------------------ */

const MilestoneCard: React.FC<{
  item: ITimelineProps["milestones"][0];
}> = (props) => {
  const { item } = props;
  const [open, setOpen] = React.useState<boolean>(false);

  const stats = [
    { label: item.Stat1Label, value: item.Stat1Value },
    { label: item.Stat2Label, value: item.Stat2Value },
  ].filter((stat) => !!stat.label && !!stat.value);

  const description = item.MilestoneDescription || "";

  // Le bouton n'apparaît QUE s'il reste quelque chose à montrer. Un contrôle
  // dont l'activation ne change rien de visible — c'était le cas de l'ancien
  // `onClick`, qui ne recolorait qu'une pastille masquée sous `md` — est un
  // piège pour la navigation clavier et les lecteurs d'écran.
  const hasMore = stats.length > 0 || description.length > CLAMP_THRESHOLD;
  const panelId = `ika-milestone-${item.Id}`;

  return (
    <article className="ika-overflow-hidden ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-transition-shadow hover:ika-shadow-md">
      {item.MilestoneImage ? (
        <div className="ika-relative ika-h-44 ika-overflow-hidden">
          <img
            src={buildImageUrl(item.MilestoneImage, 800)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="ika-h-full ika-w-full ika-object-cover"
          />
          <div
            aria-hidden="true"
            className="ika-absolute ika-inset-0 ika-bg-gradient-to-t ika-from-slate-950/70 ika-to-transparent"
          />
          {item.Tag ? (
            <span
              className={cn(
                "ika-absolute ika-bottom-3 ika-left-4 ika-rounded-full ika-px-2.5 ika-py-1 ika-text-[11px] ika-font-semibold ika-uppercase ika-tracking-wider",
                item.TagColorClass || "ika-bg-white ika-text-slate-700"
              )}
            >
              {item.Tag}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="ika-p-6">
        {/* L'année reste dans la carte : sur mobile le rail et ses repères
            sont masqués, elle serait sinon introuvable. */}
        <p className="ika-mb-2 ika-text-xs ika-font-semibold ika-uppercase ika-tracking-wider ika-text-brand-accent md:ika-hidden">
          {item.Year}
          {item.Quarter ? ` · ${item.Quarter}` : ""}
        </p>

        <h3 className="ika-text-lg ika-font-semibold ika-leading-snug ika-text-slate-900">
          {item.Title}
        </h3>

        {description ? (
          <p
            className={cn(
              "ika-mt-2 ika-text-sm ika-leading-relaxed ika-text-slate-600",
              hasMore && !open ? "ika-line-clamp-2" : ""
            )}
          >
            {description}
          </p>
        ) : null}

        {hasMore ? (
          <>
            {stats.length > 0 && open ? (
              <dl
                id={panelId}
                className="ika-mt-5 ika-flex ika-flex-wrap ika-gap-3"
              >
                {stats.map((stat, j) => (
                  <div
                    key={j}
                    className="ika-rounded-xl ika-bg-slate-50 ika-px-4 ika-py-3"
                  >
                    <dd className="ika-text-lg ika-font-semibold ika-tabular-nums ika-text-slate-900">
                      {stat.value}
                    </dd>
                    <dt className="ika-mt-0.5 ika-text-xs ika-text-slate-600">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            ) : null}

            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls={stats.length > 0 ? panelId : undefined}
              className="ika-mt-4 ika-inline-flex ika-items-center ika-gap-1.5 ika-text-sm ika-font-semibold ika-text-brand-accent ika-transition-colors hover:ika-text-brand-accent-dark focus-visible:ika-outline focus-visible:ika-outline-2 focus-visible:ika-outline-offset-2 focus-visible:ika-outline-brand-accent"
            >
              {open ? "Réduire" : "En savoir plus"}
              <Icon
                name="ChevronDown"
                className={cn(
                  "ika-h-4 ika-w-4 ika-transition-transform",
                  open ? "ika-rotate-180" : ""
                )}
              />
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
};

const TimelineSection: React.FC<{
  milestones: ITimelineProps["milestones"];
  lead: string;
}> = (props) => {
  const { milestones, lead } = props;

  if (milestones.length === 0) {
    return (
      <section
        id="ika-timeline"
        className="ika-w-full ika-bg-slate-50 ika-px-4 ika-py-20 sm:ika-px-6 lg:ika-px-8"
      >
        <div className="ika-mx-auto ika-max-w-2xl ika-rounded-2xl ika-border ika-border-dashed ika-border-slate-300 ika-bg-white ika-px-6 ika-py-12 ika-text-center">
          <Icon
            name="Calendar"
            className="ika-mx-auto ika-h-8 ika-w-8 ika-text-slate-400"
          />
          <p className="ika-mt-4 ika-text-sm ika-text-slate-600">
            Aucun jalon n&apos;est encore publié dans la liste «&nbsp;Histoire&nbsp;».
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="ika-timeline"
      className="ika-w-full ika-bg-slate-50 ika-px-4 ika-py-20 sm:ika-px-6 lg:ika-px-8"
    >
      <div className="ika-mx-auto ika-max-w-6xl">
        <SectionHeading eyebrow="Chronologie" title="Les étapes clés" lead={lead} />

        <div className="ika-relative">
          {/* Rail continu. L'ancien dégradé finissait `to-transparent` : les
              derniers jalons flottaient sans axe, ce qui est exactement le
              repère visuel qu'une frise est censée fournir. */}
          <div
            aria-hidden="true"
            className="ika-absolute ika-left-1/2 ika-top-2 ika-hidden ika-h-[calc(100%-1rem)] ika-w-px -ika-translate-x-1/2 ika-bg-slate-300 md:ika-block"
          />

          <ol className="ika-flex ika-flex-col ika-gap-12">
            {milestones.map((m, i) => {
              // L'alternance est DÉRIVÉE de l'index et non du champ `Side` :
              // ce dernier obligeait les rédacteurs à alterner à la main dans
              // SharePoint, et une seule erreur cassait le zigzag.
              const isLeft = i % 2 === 1;

              return (
                <li
                  key={m.Id}
                  className={cn(
                    "ika-relative ika-flex ika-flex-col ika-items-center ika-gap-8 md:ika-flex-row",
                    isLeft ? "md:ika-flex-row-reverse" : ""
                  )}
                >
                  <div className="ika-w-full md:ika-w-5/12">
                    <MilestoneCard item={m} />
                  </div>

                  {/* Repère du rail : l'année, pas une pastille décorative.
                      C'est ce qui distingue une frise d'une liste de cartes. */}
                  <div className="ika-hidden md:ika-flex md:ika-w-2/12 md:ika-flex-col md:ika-items-center">
                    <span className="ika-rounded-full ika-border ika-border-slate-300 ika-bg-white ika-px-3 ika-py-1 ika-text-sm ika-font-semibold ika-tabular-nums ika-text-slate-900">
                      {m.Year}
                    </span>
                    {m.Quarter ? (
                      <span className="ika-mt-1 ika-text-xs ika-text-slate-500">
                        {m.Quarter}
                      </span>
                    ) : null}
                  </div>

                  <div className="ika-hidden md:ika-block md:ika-w-5/12" />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------------ */
/* Valeurs                                                                   */
/* ------------------------------------------------------------------------ */

const Values: React.FC<{ values: ITimelineProps["values"] }> = (props) => {
  const { values } = props;
  if (values.length === 0) return null;

  return (
    <section className="ika-w-full ika-bg-white ika-px-4 ika-py-20 sm:ika-px-6 lg:ika-px-8">
      <div className="ika-mx-auto ika-max-w-6xl">
        <SectionHeading
          eyebrow="Notre ADN"
          title="Ce qui nous guide"
          align="left"
        />

        <div className="ika-grid ika-grid-cols-1 ika-gap-6 sm:ika-grid-cols-2 lg:ika-grid-cols-4">
          {values.slice(0, 4).map((v, i) => {
            const style = VALUE_STYLES[i % VALUE_STYLES.length];
            return (
              <div
                key={v.Id}
                className="ika-rounded-2xl ika-border ika-border-slate-200 ika-p-6"
              >
                <div
                  className={cn(
                    "ika-mb-5 ika-flex ika-h-11 ika-w-11 ika-items-center ika-justify-center ika-rounded-xl",
                    style.bg
                  )}
                >
                  <Icon
                    name={v.IconName || style.icon}
                    className={cn("ika-h-5 ika-w-5", style.color)}
                  />
                </div>
                <h3 className="ika-font-semibold ika-text-slate-900">
                  {v.Title}
                </h3>
                <p className="ika-mt-2 ika-text-sm ika-leading-relaxed ika-text-slate-600">
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

/* ------------------------------------------------------------------------ */
/* Chiffres                                                                  */
/* ------------------------------------------------------------------------ */

const FullStats: React.FC<{
  stats: ITimelineProps["stats"];
  imageUrl: string;
}> = (props) => {
  const { stats, imageUrl } = props;
  const [imageFailed, setImageFailed] = React.useState<boolean>(false);

  if (stats.length === 0) return null;

  const showImage = !!imageUrl && !imageFailed;

  return (
    <section className="ika-relative ika-w-full ika-overflow-hidden ika-bg-slate-950 ika-py-20">
      {showImage ? (
        <>
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            onError={() => setImageFailed(true)}
            className="ika-absolute ika-inset-0 ika-h-full ika-w-full ika-object-cover"
          />
          <div
            aria-hidden="true"
            className="ika-absolute ika-inset-0 ika-bg-slate-950/90"
          />
        </>
      ) : null}

      <div className="ika-relative ika-z-10 ika-mx-auto ika-max-w-6xl ika-px-4 sm:ika-px-6 lg:ika-px-8">
        <SectionHeading
          eyebrow="IKA en chiffres"
          title="Une croissance continue"
          align="left"
          onDark={true}
        />

        {/* `grid-cols-6` figé laissait un orphelin dès que la liste ne
            comptait pas exactement 6 indicateurs. Le remplissage automatique
            s'adapte au nombre réellement publié. */}
        <dl className="ika-grid ika-grid-cols-2 ika-gap-4 sm:ika-grid-cols-3 lg:ika-grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
          {stats.map((stat, i) => (
            <div
              key={stat.Id}
              className="ika-rounded-xl ika-border ika-border-white/10 ika-bg-white/5 ika-p-5"
            >
              <Icon
                name={stat.IconName || STAT_ICONS[i] || "Target"}
                className="ika-h-5 ika-w-5 ika-text-brand-accent"
              />
              <dd className="ika-mt-4 ika-text-3xl ika-font-semibold ika-tabular-nums ika-text-white">
                {stat.StatValue}
              </dd>
              <dt className="ika-mt-1 ika-text-xs ika-text-slate-300">
                {stat.Title}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------------ */
/* Suite                                                                     */
/* ------------------------------------------------------------------------ */

const VisionCta: React.FC = () => (
  <section className="ika-w-full ika-bg-white ika-px-4 ika-py-20 sm:ika-px-6 lg:ika-px-8">
    <div className="ika-mx-auto ika-max-w-4xl ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-slate-50 ika-px-8 ika-py-12 ika-text-center">
      <h2 className="ika-text-2xl ika-font-bold ika-tracking-tight ika-text-slate-900 md:ika-text-3xl">
        Notre histoire continue de s&apos;écrire.
      </h2>
      <p className="ika-mx-auto ika-mt-4 ika-max-w-xl ika-text-slate-600">
        Découvrez les équipes derrière ces étapes et ce sur quoi elles
        travaillent aujourd&apos;hui.
      </p>

      {/* Les deux destinations sont des routes réelles. Les anciens liens
          pointaient sur `#ika-timeline` (remontée vers la frise que l'on
          vient de lire) et sur `#equipe` sous le libellé « Nos services ». */}
      <div className="ika-mt-8 ika-flex ika-flex-wrap ika-items-center ika-justify-center ika-gap-3">
        <a
          href="#equipe"
          data-interception="propagate"
          className="ika-group ika-inline-flex ika-items-center ika-gap-2 ika-rounded-full ika-bg-brand-accent ika-px-6 ika-py-3 ika-text-sm ika-font-semibold ika-text-white ika-transition-colors hover:ika-bg-brand-accent-dark focus-visible:ika-outline focus-visible:ika-outline-2 focus-visible:ika-outline-offset-2 focus-visible:ika-outline-brand-accent"
        >
          Découvrir l&apos;équipe
          <Icon
            name="fa-arrow-right"
            className="ika-h-4 ika-w-4 ika-transition-transform group-hover:ika-translate-x-0.5"
          />
        </a>
        <a
          href="#actualites"
          data-interception="propagate"
          className="ika-inline-flex ika-items-center ika-rounded-full ika-border ika-border-slate-300 ika-bg-white ika-px-6 ika-py-3 ika-text-sm ika-font-semibold ika-text-slate-900 ika-transition-colors hover:ika-border-slate-400 focus-visible:ika-outline focus-visible:ika-outline-2 focus-visible:ika-outline-offset-2 focus-visible:ika-outline-brand-accent"
        >
          Nos actualités
        </a>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------------ */

export const Timeline: React.FC<ITimelineProps> = (props) => {
  const {
    eyebrow,
    title,
    description,
    foundedYear,
    heroImageUrl,
    statsImageUrl,
    founder,
    milestones,
    values,
    stats,
    loading,
    error,
    showValues,
    showStats,
  } = props;

  /**
   * Sous-titre de la chronologie, entièrement dérivé. La version précédente
   * annonçait « 9 ans d'innovation » et « une équipe de 138 experts » en dur,
   * deux chiffres déjà faux et impossibles à maintenir depuis SharePoint.
   */
  const chronoLead = React.useMemo(() => {
    const years = milestones
      .map((m) => parseInt(m.Year, 10))
      .filter((year) => !isNaN(year));
    const first = years.length > 0 ? Math.min(...years) : foundedYear;
    const span = new Date().getFullYear() - first;
    const count = milestones.length;

    if (count === 0) return "";
    return `${span} ans de croissance, ${count} étape${
      count > 1 ? "s" : ""
    } depuis ${first}.`;
  }, [milestones, foundedYear]);

  if (loading) {
    return (
      <div className="ika-root">
        <div
          role="status"
          aria-label="Chargement de la page histoire"
          className="ika-w-full"
        >
          <div className="ika-h-[26rem] ika-w-full ika-animate-pulse ika-bg-slate-200" />
          <div className="ika-mx-auto ika-max-w-6xl ika-space-y-6 ika-px-4 ika-py-16">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="ika-h-56 ika-animate-pulse ika-rounded-2xl ika-bg-slate-100"
              />
            ))}
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
          className="ika-mx-auto ika-mt-8 ika-max-w-3xl ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-px-6 ika-py-5"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ika-root">
      <main className="ika-w-full">
        <Hero
          eyebrow={eyebrow}
          title={title}
          description={description}
          foundedYear={foundedYear}
          imageUrl={heroImageUrl}
          stats={stats}
        />
        {founder && founder.name ? <Founder founder={founder} /> : null}
        <TimelineSection milestones={milestones} lead={chronoLead} />
        {showValues ? <Values values={values} /> : null}
        {showStats ? (
          <FullStats stats={stats} imageUrl={statsImageUrl} />
        ) : null}
        <VisionCta />
      </main>
    </div>
  );
};
