import { ISearchResponse, SearchVertical } from "../../../models/IIkaModels";

export interface ISearchResultsProps {
  /** Terme saisi, extrait du hash (`#recherche?q=…`). */
  query: string;
  /**
   * Exécute une verticale. Fourni par `IntranetMainWebPart`, qui détient le
   * `SearchService` — le contexte SPFx ne traverse jamais la frontière React.
   */
  onSearch: (
    term: string,
    vertical: SearchVertical,
    page: number
  ) => Promise<ISearchResponse>;
}
