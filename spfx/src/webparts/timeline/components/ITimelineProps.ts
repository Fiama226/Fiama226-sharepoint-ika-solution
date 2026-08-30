import { IIndicator, IMilestone, IMission } from "../../../models/IIkaModels";

/**
 * Bloc « fondateur ». Optionnel : sans nom configuré, la section entière
 * disparaît plutôt que d'afficher une carte vide.
 */
export interface ITimelineFounder {
  name: string;
  role: string;
  quote: string;
  /** URL absolue. Vide ou en erreur : on retombe sur les initiales. */
  photoUrl: string;
}

export interface ITimelineProps {
  eyebrow: string;
  title: string;
  description: string;
  /**
   * Année de création. L'ancienneté affichée en est DÉRIVÉE — elle n'est
   * jamais écrite en dur, sinon elle vieillit en silence.
   */
  foundedYear: number;
  /**
   * URLs absolues résolues par la web part (le composant ne connaît pas le
   * contexte SPFx). Une chaîne vide bascule volontairement sur un rendu
   * typographique sans photo, qui est un état valide et non une panne.
   */
  heroImageUrl: string;
  statsImageUrl: string;
  founder?: ITimelineFounder;
  milestones: IMilestone[];
  values: IMission[];
  stats: IIndicator[];
  loading: boolean;
  error?: string;
  showValues: boolean;
  showStats: boolean;
}
