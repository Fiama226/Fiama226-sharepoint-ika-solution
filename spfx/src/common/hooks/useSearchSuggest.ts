import * as React from "react";

import { ISearchResponse, ISearchResult } from "../../models/IIkaModels";

const DEBOUNCE_MS = 250;
const MIN_CHARS = 2;

export interface ISuggestState {
  results: ISearchResult[];
  total: number;
  loading: boolean;
}

const EMPTY: ISuggestState = { results: [], total: 0, loading: false };

/**
 * Suggestions temporisées pour la barre de recherche de l'en-tête.
 *
 * Deux garde-fous qui comptent ici :
 *
 * 1. Temporisation de 250 ms — sans elle, chaque frappe déclencherait un
 *    aller-retour vers `/_api/search/postquery`.
 * 2. Compteur de séquence — les réponses réseau n'arrivent pas forcément dans
 *    l'ordre où elles ont été émises. Sans ce compteur, une requête lente pour
 *    « bud » pourrait écraser la réponse déjà affichée pour « budget ». On
 *    ignore donc toute réponse qui n'est pas celle de la dernière requête.
 */
export function useSearchSuggest(
  query: string,
  enabled: boolean,
  onSearch?: (term: string) => Promise<ISearchResponse>
): ISuggestState {
  const [state, setState] = React.useState<ISuggestState>(EMPTY);

  const sequence = React.useRef<number>(0);
  const mounted = React.useRef<boolean>(true);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    const term = query.trim();

    if (!enabled || !onSearch || term.length < MIN_CHARS) {
      // On invalide aussi la séquence : une réponse en vol pour un terme
      // devenu trop court ne doit pas rouvrir le panneau.
      sequence.current += 1;
      setState(EMPTY);
      return undefined;
    }

    setState((prev) => ({ ...prev, loading: true }));

    const ticket = ++sequence.current;
    const timer = setTimeout(() => {
      onSearch(term)
        .then((response) => {
          if (!mounted.current || ticket !== sequence.current) return;
          setState({
            results: response.results,
            total: response.total,
            loading: false,
          });
        })
        .catch(() => {
          if (!mounted.current || ticket !== sequence.current) return;
          setState(EMPTY);
        });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, enabled, onSearch]);

  return state;
}
