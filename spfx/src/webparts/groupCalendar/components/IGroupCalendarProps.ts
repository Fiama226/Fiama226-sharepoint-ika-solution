import { ICalendarEntry, ITeamMemberBusy } from "../../../models/IIkaModels";

export interface IGroupCalendarProps {
  title: string;
  description?: string;
  /** Événements d'entreprise et rendez-vous Outlook déjà fusionnés et triés. */
  entries: ICalendarEntry[];
  /** Disponibilité des collègues. Vide quand Graph n'a rien pu fournir. */
  team: ITeamMemberBusy[];
  loading: boolean;
  error?: string;
  /**
   * Vrai quand le calendrier personnel a bien été chargé. Faux signifie que
   * seuls les événements d'entreprise sont affichés — silencieusement, par
   * choix : l'utilisateur ne doit pas voir d'erreur tant que la permission
   * Calendars.Read.Shared n'est pas approuvée.
   */
  personalConnected: boolean;
  showTeamAvailability: boolean;
  /** Nombre de jours affichés à partir d'aujourd'hui. */
  rangeDays: number;
  onRangeChange?: (days: number) => void;
}
