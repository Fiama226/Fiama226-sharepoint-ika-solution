import * as React from "react";

import { IEventsCalendarProps } from "./IEventsCalendarProps";
import {
  cn,
  formatDate,
  formatDayMonth,
  resolveUrl,
} from "../../../common/utils/spUtils";

function formatTime(iso: string, allDay: boolean): string {
  if (allDay) return "Journée entière";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const Skeleton: React.FC = () => (
  <ul className="ika-mt-4 ika-space-y-2 ika-animate-pulse" aria-hidden="true">
    {[0, 1, 2].map((index) => (
      <li
        key={index}
        className="ika-flex ika-items-center ika-gap-3 ika-rounded-lg ika-border ika-border-brand-line ika-bg-white ika-p-3"
      >
        <span className="ika-h-12 ika-w-12 ika-shrink-0 ika-rounded-md ika-bg-slate-200" />
        <span className="ika-min-w-0 ika-flex-1 ika-space-y-2">
          <span className="ika-block ika-h-4 ika-w-2/3 ika-rounded ika-bg-slate-200" />
          <span className="ika-block ika-h-3 ika-w-1/2 ika-rounded ika-bg-slate-100" />
        </span>
      </li>
    ))}
  </ul>
);

export const EventsCalendar: React.FC<IEventsCalendarProps> = (props) => {
  const { title, events, loading, error, showLocation } = props;

  const renderBody = (): React.ReactElement => {
    if (loading) return <Skeleton />;

    if (error) {
      return (
        <div
          role="alert"
          className="ika-mt-4 ika-rounded-lg ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      );
    }

    if (!events || events.length === 0) {
      return (
        <div className="ika-mt-4 ika-rounded-lg ika-border ika-border-dashed ika-border-brand-line ika-bg-white ika-p-8 ika-text-center">
          <p className="ika-text-sm ika-text-brand-muted">
            Aucun événement à venir.
          </p>
        </div>
      );
    }

    return (
      <ul className="ika-mt-4 ika-space-y-2">
        {events.map((evt) => {
          const dm = formatDayMonth(evt.EventDate);
          const time = formatTime(evt.EventDate, evt.fAllDayEvent);
          const registration = evt.RegistrationLink
            ? resolveUrl(evt.RegistrationLink)
            : undefined;

          const content = (
            <article
              className={cn(
                "ika-flex ika-items-center ika-gap-3 ika-rounded-lg",
                "ika-border ika-border-brand-line ika-bg-white ika-p-3",
                "ika-transition-colors hover:ika-border-brand-cyan"
              )}
            >
              <span className="ika-grid ika-h-12 ika-w-12 ika-shrink-0 ika-place-content-center ika-rounded-md ika-bg-brand-navy ika-text-center ika-text-white">
                <span className="ika-block ika-text-lg ika-font-bold ika-leading-none">
                  {dm.day}
                </span>
                <span className="ika-mt-0.5 ika-block ika-text-[10px] ika-uppercase ika-tracking-wide ika-text-brand-cyan">
                  {dm.month}
                </span>
              </span>

              <div className="ika-min-w-0 ika-flex-1">
                <p className="ika-flex ika-items-center ika-gap-2 ika-font-medium ika-text-brand-ink">
                  <span className="ika-truncate">{evt.Title}</span>
                  {evt.IsMandatory ? (
                    <span className="ika-shrink-0 ika-rounded ika-bg-brand-accent-soft ika-px-1.5 ika-py-0.5 ika-text-[10px] ika-font-bold ika-text-brand-accent">
                      OBLIGATOIRE
                    </span>
                  ) : null}
                </p>
                <p className="ika-mt-0.5 ika-truncate ika-text-xs ika-text-brand-muted">
                  {formatDate(evt.EventDate)}
                  {time ? ` · ${time}` : ""}
                  {showLocation && evt.Location ? ` · ${evt.Location}` : ""}
                </p>
              </div>

              <span className="ika-shrink-0 ika-rounded-full ika-bg-brand-surface ika-px-2.5 ika-py-0.5 ika-text-xs ika-font-medium ika-text-brand-navy">
                {evt.EventCategory}
              </span>
            </article>
          );

          return (
            <li key={evt.Id}>
              {registration ? (
                <a
                  href={registration}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ika-block focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-brand-cyan ika-rounded-lg"
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="ika-root">
      <section aria-labelledby="ika-events-title">
        <h2
          id="ika-events-title"
          className="ika-text-lg ika-font-semibold ika-text-brand-navy"
        >
          {title}
        </h2>
        {renderBody()}
      </section>
    </div>
  );
};
