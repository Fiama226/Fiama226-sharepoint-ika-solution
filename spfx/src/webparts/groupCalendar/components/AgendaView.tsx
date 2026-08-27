import * as React from "react";

import { GroupCalendar } from "./GroupCalendar";
import {
  IAgendaPayload,
  ICalendarEntry,
  IEventItem,
  ITeamMemberBusy,
} from "../../../models/IIkaModels";
import { CalendarService } from "../../../services/CalendarService";

export interface IAgendaViewProps {
  title: string;
  description?: string;
  /** Événements d'entreprise déjà chargés : servent de repli immédiat. */
  events: IEventItem[];
  showTeamAvailability: boolean;
  defaultRangeDays: number;
  /**
   * Chargement asynchrone de l'agenda enrichi. Absent, la vue se contente
   * des événements d'entreprise reçus en props — c'est le comportement
   * attendu tant que la permission Calendars.Read.Shared n'est pas approuvée.
   */
  agenda?: (rangeDays: number) => Promise<IAgendaPayload>;
}

/**
 * Conteneur de la route `agenda`. Isole l'état (période sélectionnée,
 * chargement) du composant de présentation, et surtout des hooks : le
 * routeur de `IntranetMain` rend ses vues dans un `switch`, où l'on ne peut
 * pas déclarer de hook conditionnellement.
 */
export const AgendaView: React.FC<IAgendaViewProps> = (props) => {
  const { events, agenda, defaultRangeDays } = props;

  const [rangeDays, setRangeDays] = React.useState<number>(defaultRangeDays);
  const [entries, setEntries] = React.useState<ICalendarEntry[]>(() =>
    CalendarService.merge(events, undefined)
  );
  const [team, setTeam] = React.useState<ITeamMemberBusy[]>([]);
  const [personalConnected, setPersonalConnected] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(!!agenda);

  React.useEffect(() => {
    if (!agenda) {
      setEntries(CalendarService.merge(events, undefined));
      setLoading(false);
      return;
    }

    // Une réponse tardive ne doit pas écraser un rendu déclenché depuis par
    // un autre choix de période.
    let cancelled = false;
    setLoading(true);

    const settle = (payload: IAgendaPayload | undefined): void => {
      if (cancelled) return;
      if (payload) {
        setEntries(payload.entries);
        setTeam(payload.team);
        setPersonalConnected(payload.personalConnected);
      } else {
        setEntries(CalendarService.merge(events, undefined));
        setTeam([]);
        setPersonalConnected(false);
      }
      setLoading(false);
    };

    agenda(rangeDays).then(
      (payload) => settle(payload),
      // Le repli silencieux est délibéré : l'utilisateur voit l'agenda
      // d'entreprise plutôt qu'un message d'erreur.
      () => settle(undefined)
    );

    return () => {
      cancelled = true;
    };
  }, [agenda, rangeDays, events]);

  return (
    <GroupCalendar
      title={props.title}
      description={props.description}
      entries={entries}
      team={team}
      loading={loading}
      personalConnected={personalConnected}
      showTeamAvailability={props.showTeamAvailability}
      rangeDays={rangeDays}
      onRangeChange={setRangeDays}
    />
  );
};
