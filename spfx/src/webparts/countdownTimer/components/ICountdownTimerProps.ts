import { IEventItem } from "../../../models/IIkaModels";

export interface ICountdownTimerProps {
  /** Titre affiché au-dessus du compteur. */
  title: string;
  /**
   * Événements candidats (liste SharePoint `Evenements`). Le composant
   * sélectionne lui-même la prochaine échéance : aucune date à saisir dans le
   * volet de propriétés, le compteur suit l'agenda.
   */
  events: IEventItem[];
  loading: boolean;
  /** Message affiché quand aucun événement à venir n'est trouvé. */
  emptyLabel?: string;
}
