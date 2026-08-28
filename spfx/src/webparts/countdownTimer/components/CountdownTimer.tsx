import * as React from "react";

import { ICountdownTimerProps } from "./ICountdownTimerProps";
import { IEventItem } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { cn } from "../../../common/utils/spUtils";

/**
 * CountdownTimer — compte à rebours vers la PROCHAINE échéance de l'agenda.
 *
 * Aucune date n'est saisie à la main : le composant lit la liste `Evenements`
 * et retient l'événement à venir le plus proche. Le compteur suit donc
 * automatiquement l'agenda, sans maintenance côté volet de propriétés.
 */

interface IRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function startOf(item: IEventItem): number {
  return new Date(item.EventDate).getTime();
}

/**
 * Fin réelle de l'événement. `EndDate` est facultatif dans la liste : sans
 * lui, on considère que l'événement se termine à son heure de début (sinon un
 * événement sans date de fin resterait « en cours » indéfiniment).
 */
function endOf(item: IEventItem): number {
  const end = item.EndDate ? new Date(item.EndDate).getTime() : NaN;
  const start = startOf(item);
  if (isNaN(end)) return start;
  return end < start ? start : end;
}

/**
 * Politique de sélection de l'échéance affichée.
 *
 * Règle retenue : le premier événement dont la FIN n'est pas passée, trié par
 * date de début croissante. Conséquence voulue — un événement démarré mais non
 * terminé reste à l'écran (badge « En cours ») au lieu de disparaître au
 * moment précis où il commence.
 */
export function selectNextEvent(
  events: IEventItem[],
  now: number
): IEventItem | undefined {
  const upcoming = (events || [])
    .filter((item) => !isNaN(startOf(item)) && endOf(item) > now)
    .sort((a, b) => startOf(a) - startOf(b));
  return upcoming[0];
}

function computeRemaining(targetMs: number, now: number): IRemaining {
  const delta = Math.max(0, targetMs - now);
  const totalSeconds = Math.floor(delta / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

function formatTargetDate(item: IEventItem): string {
  const date = new Date(item.EventDate);
  if (isNaN(date.getTime())) return "";
  const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
  const day = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  if (item.fAllDayEvent) return cap(day);
  const time = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${cap(day)} à ${time}`;
}

const Tile: React.FC<{ value: string; label: string; urgent: boolean }> = (
  props
) => (
  <div
    className={cn(
      "ika-flex ika-flex-col ika-items-center ika-rounded-2xl ika-px-2 ika-py-3 ika-transition-colors",
      props.urgent
        ? "ika-bg-brand-accent-soft ika-text-brand-accent-dark"
        : "ika-bg-brand-navy ika-text-white"
    )}
  >
    <span className="ika-text-2xl ika-font-extrabold ika-tabular-nums ika-tracking-tight">
      {props.value}
    </span>
    <span
      className={cn(
        "ika-mt-1 ika-text-[10px] ika-font-semibold ika-uppercase ika-tracking-wider",
        props.urgent ? "ika-text-brand-accent-dark/70" : "ika-text-white/60"
      )}
    >
      {props.label}
    </span>
  </div>
);

export const CountdownTimer: React.FC<ICountdownTimerProps> = (props) => {
  const { title, events, loading, emptyLabel } = props;

  const [now, setNow] = React.useState<number>(() => Date.now());

  React.useEffect(() => {
    // Un seul intervalle pour tout le composant. On relit `Date.now()` à
    // chaque tick plutôt que de décrémenter un compteur local : la valeur
    // reste juste même si le navigateur bride les timers d'un onglet en
    // arrière-plan.
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const target = React.useMemo(
    () => selectNextEvent(events, now),
    [events, now]
  );

  if (loading) {
    return (
      <div className="ika-animate-pulse ika-space-y-3" aria-hidden="true">
        <div className="ika-h-4 ika-w-2/3 ika-rounded ika-bg-slate-200" />
        <div className="ika-grid ika-grid-cols-4 ika-gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="ika-h-16 ika-rounded-2xl ika-bg-slate-200" />
          ))}
        </div>
        <div className="ika-h-3 ika-w-1/2 ika-rounded ika-bg-slate-100" />
      </div>
    );
  }

  if (!target) {
    return (
      <div className="ika-flex ika-h-full ika-flex-col ika-items-center ika-justify-center ika-rounded-2xl ika-border ika-border-dashed ika-border-brand-line ika-px-4 ika-py-8 ika-text-center">
        <Icon
          name="Calendar"
          className="ika-mb-2 ika-h-6 ika-w-6 ika-text-brand-line"
        />
        <p className="ika-text-sm ika-text-brand-muted">
          {emptyLabel || "Aucun événement planifié pour le moment."}
        </p>
      </div>
    );
  }

  const started = now >= startOf(target);
  const remaining = computeRemaining(startOf(target), now);
  // Sous 24 h, le compteur passe en rouge accent : l'échéance devient une
  // information d'action, plus une simple date.
  const urgent = !started && remaining.days === 0;

  const summary = started
    ? `${target.Title} est en cours.`
    : `${remaining.days} jours, ${remaining.hours} heures et ${remaining.minutes} minutes avant ${target.Title}.`;

  return (
    <div className="ika-flex ika-h-full ika-flex-col">
      {/* Titre rendu UNIQUEMENT s'il est fourni : intégré dans une carte qui
          porte déjà son en-tête (cf. `HomeHighlights`), on passe `title=""`
          pour ne pas afficher le libellé deux fois. */}
      {title ? (
        <h3 className="ika-mb-3 ika-text-lg ika-font-semibold ika-text-brand-navy">
          {title}
        </h3>
      ) : null}

      <div className="ika-mb-3 ika-flex ika-items-start ika-justify-between ika-gap-2">
        <p className="ika-font-semibold ika-text-brand-navy">{target.Title}</p>
        {started ? (
          <span className="ika-shrink-0 ika-rounded-full ika-bg-emerald-50 ika-px-2.5 ika-py-1 ika-text-[11px] ika-font-semibold ika-text-emerald-700">
            En cours
          </span>
        ) : null}
      </div>

      {started ? (
        <div className="ika-flex ika-flex-1 ika-items-center ika-justify-center ika-rounded-2xl ika-bg-emerald-50 ika-px-4 ika-py-6 ika-text-center ika-text-sm ika-font-medium ika-text-emerald-800">
          L&apos;événement a commencé.
        </div>
      ) : (
        <div
          role="timer"
          // `aria-live="off"` volontaire : une annonce par seconde noierait le
          // lecteur d'écran. Le résumé textuel plus bas porte l'information.
          aria-live="off"
          aria-label={summary}
          className="ika-grid ika-grid-cols-4 ika-gap-2"
        >
          <Tile value={pad(remaining.days)} label="Jours" urgent={urgent} />
          <Tile value={pad(remaining.hours)} label="Heures" urgent={urgent} />
          <Tile value={pad(remaining.minutes)} label="Min" urgent={urgent} />
          <Tile value={pad(remaining.seconds)} label="Sec" urgent={urgent} />
        </div>
      )}

      <p className="ika-mt-3 ika-flex ika-items-center ika-gap-1.5 ika-text-xs ika-text-brand-muted">
        <Icon name="Calendar" className="ika-h-3.5 ika-w-3.5 ika-shrink-0" />
        <span className="ika-truncate">{formatTargetDate(target)}</span>
      </p>
      {target.Location ? (
        <p className="ika-mt-1 ika-flex ika-items-center ika-gap-1.5 ika-text-xs ika-text-brand-muted">
          <Icon name="MapPin" className="ika-h-3.5 ika-w-3.5 ika-shrink-0" />
          <span className="ika-truncate">{target.Location}</span>
        </p>
      ) : null}

    </div>
  );
};
