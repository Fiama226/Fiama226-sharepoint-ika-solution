import * as React from "react";

import { ISearchResult } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { cn, formatDateShort } from "../../../common/utils/spUtils";
import { displayForKind } from "../../../common/utils/searchDisplay";

export interface ISearchSuggestProps {
  query: string;
  results: ISearchResult[];
  total: number;
  loading: boolean;
  /** Index survolé/sélectionné au clavier, piloté par l'en-tête. */
  activeIndex: number;
  onHover: (index: number) => void;
  onPick: (result: ISearchResult) => void;
  onSeeAll: () => void;
  variant: "desktop" | "mobile";
}

/**
 * Panneau de suggestions purement présentationnel.
 *
 * Il ne détient ni la temporisation (`useSearchSuggest`) ni la navigation au
 * clavier (`IkaHeader`) : les touches ↑/↓/Entrée doivent être traitées par le
 * champ de saisie lui-même, qui garde le focus pendant toute l'interaction.
 * C'est ce qui permet au lecteur d'écran d'annoncer l'option active via
 * `aria-activedescendant` sans jamais déplacer le focus hors du champ.
 */
export const SearchSuggest: React.FC<ISearchSuggestProps> = (props) => {
  const {
    query,
    results,
    total,
    loading,
    activeIndex,
    onHover,
    onPick,
    onSeeAll,
    variant,
  } = props;

  const term = query.trim();
  if (term.length < 2) return null;

  const shell =
    variant === "desktop"
      ? "ika-absolute ika-left-0 ika-top-full ika-z-50 ika-mt-2 ika-w-[28rem]"
      : "ika-relative ika-z-10 ika-mt-2 ika-w-full";

  const empty = !loading && results.length === 0;

  return (
    <div
      className={cn(
        shell,
        "ika-overflow-hidden ika-rounded-xl ika-border ika-border-slate-200",
        "ika-bg-white ika-shadow-lg"
      )}
    >
      {loading && results.length === 0 ? (
        <div className="ika-px-4 ika-py-6 ika-text-center ika-text-sm ika-text-gray-500">
          Recherche en cours…
        </div>
      ) : null}

      {empty ? (
        <div className="ika-px-4 ika-py-6 ika-text-center ika-text-sm ika-text-gray-500">
          Aucun résultat pour «&nbsp;{term}&nbsp;»
        </div>
      ) : null}

      {results.length > 0 ? (
        <ul
          id={`ika-search-listbox-${variant}`}
          role="listbox"
          className="ika-max-h-96 ika-overflow-y-auto"
        >
          {results.map((result, index) => {
            const display = displayForKind(result.kind);
            const active = index === activeIndex;

            return (
              <li key={result.id} role="none">
                <button
                  type="button"
                  id={`ika-search-option-${variant}-${index}`}
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => onHover(index)}
                  onClick={() => onPick(result)}
                  className={cn(
                    "ika-flex ika-w-full ika-items-start ika-gap-3 ika-px-4 ika-py-2.5",
                    "ika-text-left ika-transition-colors",
                    active ? "ika-bg-blue-50" : "hover:ika-bg-slate-50"
                  )}
                >
                  <span
                    className={cn(
                      "ika-mt-0.5 ika-flex ika-h-7 ika-w-7 ika-shrink-0",
                      "ika-items-center ika-justify-center ika-rounded-lg",
                      display.chip
                    )}
                  >
                    <Icon name={display.icon} className="ika-h-4 ika-w-4" />
                  </span>

                  <span className="ika-min-w-0 ika-flex-1">
                    <span className="ika-block ika-truncate ika-text-sm ika-font-medium ika-text-gray-900">
                      {result.title}
                    </span>
                    <span className="ika-mt-0.5 ika-block ika-truncate ika-text-xs ika-text-gray-500">
                      {[
                        display.label,
                        result.siteTitle,
                        result.modified ? formatDateShort(result.modified) : "",
                      ]
                        .filter((part) => !!part)
                        .join(" · ")}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {results.length > 0 ? (
        <button
          type="button"
          onClick={onSeeAll}
          className={cn(
            "ika-flex ika-w-full ika-items-center ika-justify-between",
            "ika-border-t ika-border-slate-100 ika-px-4 ika-py-2.5",
            "ika-text-sm ika-font-medium ika-text-blue-600",
            "hover:ika-bg-slate-50"
          )}
        >
          <span>
            Voir tous les résultats
            {total > results.length ? ` (${total})` : ""}
          </span>
          <Icon name="ChevronRight" className="ika-h-4 ika-w-4" />
        </button>
      ) : null}
    </div>
  );
};
