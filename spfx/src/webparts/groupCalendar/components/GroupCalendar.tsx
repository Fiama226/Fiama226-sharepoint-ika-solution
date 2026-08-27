import * as React from "react";

import { IGroupCalendarProps } from "./IGroupCalendarProps";
import {
  IBusySlot,
  ICalendarEntry,
  ITeamMemberBusy,
} from "../../../models/IIkaModels";
import { buildUserPhotoUrl, cn } from "../../../common/utils/spUtils";

/** Fenêtre ouvrée rendue par la frise de disponibilité. */
const DAY_START_HOUR = 8;
const DAY_END_HOUR = 19;
const DAY_SPAN_MIN = (DAY_END_HOUR - DAY_START_HOUR) * 60;

const RANGES: { label: string; days: number }[] = [
  { label: "Aujourd'hui", days: 1 },
  { label: "7 jours", days: 7 },
  { label: "30 jours", days: 30 },
];

const STATUS_CLASS: { [key: string]: string } = {
  busy: "ika-bg-brand-navy",
  tentative: "ika-bg-brand-cyan/60",
  oof: "ika-bg-brand-accent",
  workingElsewhere: "ika-bg-emerald-500",
  unknown: "ika-bg-slate-400",
  free: "ika-bg-transparent",
};

const STATUS_LABEL: { [key: string]: string } = {
  busy: "Occupé",
  tentative: "Provisoire",
  oof: "Absent du bureau",
  workingElsewhere: "En télétravail",
  unknown: "Indisponible",
  free: "Libre",
};

/** Clé de regroupement stable et locale (et non UTC, qui décalerait le jour). */
function dayKey(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${date.getFullYear()}-${month}-${day}`;
}

function dayLabel(key: string): string {
  const parts = key.split("-");
  const date = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round(
    (date.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
  );

  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Demain";

  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function timeLabel(entry: ICalendarEntry): string {
  if (entry.IsAllDay) return "Journée";

  const start = new Date(entry.Start);
  if (isNaN(start.getTime())) return "";

  const fmt = (d: Date): string =>
    d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const end = new Date(entry.End);
  if (isNaN(end.getTime())) return fmt(start);
  return `${fmt(start)} – ${fmt(end)}`;
}

/** Position d'un créneau dans la fenêtre ouvrée, en pourcentage de largeur. */
function slotGeometry(
  slot: IBusySlot,
  dayIso: string
): { left: number; width: number } | undefined {
  const start = new Date(slot.Start);
  const end = new Date(slot.End);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return undefined;
  if (dayKey(slot.Start) !== dayIso) return undefined;

  const from = start.getHours() * 60 + start.getMinutes();
  const to = end.getHours() * 60 + end.getMinutes();

  const clampedFrom = Math.max(from, DAY_START_HOUR * 60);
  const clampedTo = Math.min(to, DAY_END_HOUR * 60);
  if (clampedTo <= clampedFrom) return undefined;

  return {
    left: ((clampedFrom - DAY_START_HOUR * 60) / DAY_SPAN_MIN) * 100,
    width: ((clampedTo - clampedFrom) / DAY_SPAN_MIN) * 100,
  };
}

const Skeleton: React.FC = () => (
  <div className="ika-mt-6 ika-space-y-4 ika-animate-pulse" aria-hidden="true">
    {[0, 1, 2].map((group) => (
      <div key={group} className="ika-space-y-2">
        <span className="ika-block ika-h-4 ika-w-40 ika-rounded ika-bg-slate-200" />
        {[0, 1].map((row) => (
          <span
            key={row}
            className="ika-block ika-h-14 ika-rounded-lg ika-bg-slate-100"
          />
        ))}
      </div>
    ))}
  </div>
);

const TeamAvailability: React.FC<{ team: ITeamMemberBusy[] }> = ({ team }) => {
  const today = dayKey(new Date().toISOString());

  const hours: number[] = [];
  for (let h = DAY_START_HOUR; h <= DAY_END_HOUR; h += 1) hours.push(h);

  return (
    <section
      aria-labelledby="ika-team-availability"
      className="ika-mt-6 ika-rounded-2xl ika-border ika-border-brand-line ika-bg-white ika-p-4 sm:ika-p-5"
    >
      <div className="ika-flex ika-flex-wrap ika-items-center ika-justify-between ika-gap-3">
        <h3
          id="ika-team-availability"
          className="ika-text-sm ika-font-semibold ika-text-brand-navy"
        >
          Disponibilité de l&apos;équipe · aujourd&apos;hui
        </h3>
        <ul className="ika-flex ika-flex-wrap ika-items-center ika-gap-3">
          {["busy", "tentative", "oof"].map((status) => (
            <li
              key={status}
              className="ika-flex ika-items-center ika-gap-1.5 ika-text-[11px] ika-text-brand-muted"
            >
              <span
                className={cn(
                  "ika-h-2.5 ika-w-2.5 ika-rounded-sm",
                  STATUS_CLASS[status]
                )}
              />
              {STATUS_LABEL[status]}
            </li>
          ))}
        </ul>
      </div>

      <div className="ika-mt-4 ika-overflow-x-auto">
        <div className="ika-min-w-[34rem]">
          <div className="ika-flex ika-items-center ika-gap-3 ika-pb-1 ika-pl-[10.75rem]">
            {hours.map((hour) => (
              <span
                key={hour}
                className="ika-flex-1 ika-text-[10px] ika-tabular-nums ika-text-brand-muted"
              >
                {`0${hour}`.slice(-2)}h
              </span>
            ))}
          </div>

          <ul className="ika-space-y-1.5">
            {team.map((member) => (
              <li
                key={member.Email}
                className="ika-flex ika-items-center ika-gap-3"
              >
                <span className="ika-flex ika-w-40 ika-shrink-0 ika-items-center ika-gap-2 ika-pr-2">
                  <img
                    src={buildUserPhotoUrl(member.Email, "S")}
                    alt=""
                    aria-hidden="true"
                    className="ika-h-7 ika-w-7 ika-shrink-0 ika-rounded-full ika-object-cover"
                  />
                  <span className="ika-min-w-0 ika-flex-1 ika-truncate ika-text-xs ika-font-medium ika-text-brand-ink">
                    {member.DisplayName}
                  </span>
                </span>

                <span
                  className="ika-relative ika-h-7 ika-flex-1 ika-overflow-hidden ika-rounded-md ika-bg-brand-surface"
                  role="img"
                  aria-label={
                    member.Slots.length === 0
                      ? `${member.DisplayName} : aucune indisponibilité partagée`
                      : `${member.DisplayName} : ${member.Slots.length} créneau(x) occupé(s)`
                  }
                >
                  {member.Slots.map((slot, index) => {
                    const geo = slotGeometry(slot, today);
                    if (!geo) return null;
                    return (
                      <span
                        key={index}
                        title={`${STATUS_LABEL[slot.Status] || slot.Status}`}
                        className={cn(
                          "ika-absolute ika-top-0 ika-h-full ika-rounded-sm",
                          STATUS_CLASS[slot.Status] || STATUS_CLASS.unknown
                        )}
                        style={{
                          left: `${geo.left}%`,
                          width: `${Math.max(geo.width, 1.5)}%`,
                        }}
                      />
                    );
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export const GroupCalendar: React.FC<IGroupCalendarProps> = (props) => {
  const {
    title,
    description,
    entries,
    team,
    loading,
    error,
    personalConnected,
    showTeamAvailability,
    rangeDays,
    onRangeChange,
  } = props;

  /** Regroupe par jour en conservant l'ordre chronologique déjà établi. */
  const groups = React.useMemo(() => {
    const order: string[] = [];
    const byDay: { [key: string]: ICalendarEntry[] } = {};

    entries.forEach((entry) => {
      const key = dayKey(entry.Start);
      if (!key) return;
      if (!byDay[key]) {
        byDay[key] = [];
        order.push(key);
      }
      byDay[key].push(entry);
    });

    return order.map((key) => ({ key, items: byDay[key] }));
  }, [entries]);

  const renderBody = (): React.ReactElement => {
    if (loading) return <Skeleton />;

    if (error) {
      return (
        <div
          role="alert"
          className="ika-mt-6 ika-rounded-lg ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      );
    }

    if (groups.length === 0) {
      return (
        <div className="ika-mt-6 ika-rounded-2xl ika-border ika-border-dashed ika-border-brand-line ika-bg-white ika-p-10 ika-text-center">
          <p className="ika-text-sm ika-text-brand-muted">
            Aucun événement sur la période sélectionnée.
          </p>
        </div>
      );
    }

    return (
      <div className="ika-mt-6 ika-space-y-6">
        {groups.map((group) => (
          <section key={group.key} aria-label={dayLabel(group.key)}>
            <h3 className="ika-sticky ika-top-0 ika-z-10 ika-bg-brand-surface/95 ika-py-1.5 ika-text-sm ika-font-semibold ika-capitalize ika-text-brand-navy ika-backdrop-blur">
              {dayLabel(group.key)}
            </h3>

            <ul className="ika-mt-2 ika-space-y-2">
              {group.items.map((entry) => {
                const isOutlook = entry.Source === "outlook";

                const body = (
                  <article
                    className={cn(
                      "ika-flex ika-items-start ika-gap-3 ika-rounded-lg ika-border ika-bg-white ika-p-3",
                      "ika-transition-colors hover:ika-border-brand-cyan",
                      isOutlook
                        ? "ika-border-l-4 ika-border-l-brand-cyan ika-border-brand-line"
                        : "ika-border-l-4 ika-border-l-brand-navy ika-border-brand-line"
                    )}
                  >
                    <span className="ika-w-24 ika-shrink-0 ika-pt-0.5 ika-text-xs ika-font-semibold ika-tabular-nums ika-text-brand-navy">
                      {timeLabel(entry)}
                    </span>

                    <div className="ika-min-w-0 ika-flex-1">
                      <p className="ika-flex ika-flex-wrap ika-items-center ika-gap-2">
                        <span className="ika-font-medium ika-text-brand-ink">
                          {entry.Title}
                        </span>
                        {entry.IsMandatory ? (
                          <span className="ika-rounded ika-bg-brand-accent-soft ika-px-1.5 ika-py-0.5 ika-text-[10px] ika-font-bold ika-text-brand-accent">
                            OBLIGATOIRE
                          </span>
                        ) : null}
                      </p>

                      {entry.Location || entry.Organizer ? (
                        <p className="ika-mt-0.5 ika-truncate ika-text-xs ika-text-brand-muted">
                          {entry.Location}
                          {entry.Location && entry.Organizer ? " · " : ""}
                          {entry.Organizer}
                        </p>
                      ) : null}
                    </div>

                    <span
                      className={cn(
                        "ika-shrink-0 ika-rounded-full ika-px-2.5 ika-py-0.5 ika-text-[11px] ika-font-medium",
                        isOutlook
                          ? "ika-bg-brand-cyan/10 ika-text-brand-cyan"
                          : "ika-bg-brand-surface ika-text-brand-navy"
                      )}
                    >
                      {isOutlook
                        ? "Mon calendrier"
                        : entry.Category || "Entreprise"}
                    </span>
                  </article>
                );

                return (
                  <li key={entry.Id}>
                    {entry.WebLink ? (
                      <a
                        href={entry.WebLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ika-block ika-rounded-lg focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-brand-cyan"
                      >
                        {body}
                      </a>
                    ) : (
                      body
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    );
  };

  const hasTeam =
    showTeamAvailability && personalConnected && team && team.length > 0;

  return (
    <div className="ika-root">
      <section aria-labelledby="ika-agenda-title">
        <header className="ika-flex ika-flex-wrap ika-items-end ika-justify-between ika-gap-4">
          <div className="ika-min-w-0">
            <h2
              id="ika-agenda-title"
              className="ika-text-2xl ika-font-bold ika-text-brand-navy"
            >
              {title}
            </h2>
            {description ? (
              <p className="ika-mt-1 ika-max-w-2xl ika-text-sm ika-text-brand-muted">
                {description}
              </p>
            ) : null}
          </div>

          {onRangeChange ? (
            <div
              role="group"
              aria-label="Période affichée"
              className="ika-inline-flex ika-shrink-0 ika-rounded-lg ika-border ika-border-brand-line ika-bg-white ika-p-0.5"
            >
              {RANGES.map((range) => (
                <button
                  key={range.days}
                  type="button"
                  onClick={() => onRangeChange(range.days)}
                  aria-pressed={rangeDays === range.days}
                  className={cn(
                    "ika-rounded-md ika-px-3 ika-py-1.5 ika-text-xs ika-font-medium ika-transition-colors",
                    "focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-brand-cyan",
                    rangeDays === range.days
                      ? "ika-bg-brand-navy ika-text-white"
                      : "ika-text-brand-muted hover:ika-text-brand-navy"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          ) : null}
        </header>

        {hasTeam ? <TeamAvailability team={team} /> : null}

        {renderBody()}
      </section>
    </div>
  );
};
