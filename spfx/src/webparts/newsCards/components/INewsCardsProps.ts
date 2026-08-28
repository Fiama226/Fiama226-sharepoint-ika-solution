import { INewsItem } from "../../../models/IIkaModels";

export interface INewsCardsProps {
  eyebrow: string;
  title: string;
  description: string;
  items: INewsItem[];
  loading: boolean;
  error?: string;
  ctaUrl?: string;
  /**
   * Libellé du bouton de pied. Chaîne vide = pas de bouton : c'est le cas de
   * la vue « toutes les actualités », où un CTA pointant vers elle-même n'a
   * aucun sens et où la pagination prend sa place.
   */
  ctaLabel: string;

  /**
   * Affiche la barre « recherche + filtre par catégorie ». Réservé à la vue
   * complète (`#actualites`) : la section de l'accueil reste une vitrine.
   */
  showFilters?: boolean;

  /**
   * Nombre d'actualités par page. Absent ou 0 = pas de pagination, toute la
   * liste est rendue d'un bloc (comportement de l'accueil).
   */
  pageSize?: number;
}
