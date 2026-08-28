import {
  IDocumentItem,
  IEventItem,
  IFaqItem,
} from "../../../models/IIkaModels";

/**
 * Dernière bande de l'accueil : trois cartes sur une même ligne
 * (FAQ · Documents récents · Compte à rebours).
 */
export interface IHomeHighlightsProps {
  faqTitle: string;
  documentsTitle: string;
  countdownTitle: string;

  faqItems: IFaqItem[];
  /**
   * Documents déjà triés par date de modification décroissante (c'est l'ordre
   * renvoyé par `DataService.getDocuments`, qui interroge SharePoint en
   * `$orderby=Modified desc`). La carte n'en garde que les premiers.
   */
  documents: IDocumentItem[];
  /** Source du compte à rebours : la prochaine échéance y est choisie. */
  events: IEventItem[];

  loading: boolean;

  /** Nombre de questions affichées dans la carte FAQ (défaut : 4). */
  maxFaqItems?: number;
  /** Nombre de documents affichés (défaut : 5). */
  maxDocuments?: number;

  /**
   * Routeur SPA de `IntranetMain`. Optionnel : sans lui, les liens « Voir
   * tout » retombent sur une navigation par ancre (`#faq`), qui déclenche le
   * même routage via l'écouteur `hashchange`.
   */
  onNavigate?: (route: string) => void;
}
