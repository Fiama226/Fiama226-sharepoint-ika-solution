import "../../../styles/tailwind.css";

import * as React from "react";

import { ISearchResponse, SearchVertical } from "../../../models/IIkaModels";
import { ISearchResultsProps } from "./ISearchResultsProps";
import { Icon } from "../../../common/utils/Icon";
import {
  cn,
  formatDateShort,
  formatFileSize,
} from "../../../common/utils/spUtils";
import { displayForKind, SEARCH_TABS } from "../../../common/utils/searchDisplay";

const EMPTY: ISearchResponse = {
  results: [],
  total: 0,
  moreAvailable: false,
  vertical: "tout",
};

export const SearchResults: React.FC<ISearchResultsProps> = (props) => {
  const { query, onSearch } = props;

  const [vertical, setVertical] = React.useState<SearchVertical>("tout");
  const [page, setPage] = React.useState<number>(0);
  const [response, setResponse] = React.useState<ISearchResponse>(EMPTY);
  const [loading, setLoading] = React.useState<boolean>(false);

  const sequence = React.useRef<number>(0);

  // Changer de terme ou d'onglet doit repartir de la première page, sinon on
  // afficherait la page 3 d'une recherche qui n'en a plus qu'une.
  React.useEffect(() => {
    setPage(0);
  }, [query, vertical]);

  React.useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResponse(EMPTY);
      return;
    }

    setLoading(true);
    const ticket = ++sequence.current;

    onSearch(term, vertical, page)
      .then((payload) => {
        if (ticket !== sequence.current) return;
        setResponse(payload);
        setLoading(false);
      })
      .catch(() => {
        if (ticket !== sequence.current) return;
        setResponse(EMPTY);
        setLoading(false);
      });
  }, [query, vertical, page, onSearch]);

  const term = query.trim();

  if (!term) {
    return (
      <section className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-12 lg:ika-px-8">
        <div className="ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-p-12 ika-text-center">
          <Icon
            name="Search"
            className="ika-mx-auto ika-h-10 ika-w-10 ika-text-brand-muted"
          />
          <p className="ika-mt-4 ika-text-brand-muted">
            Saisissez un terme dans la barre de recherche pour lancer une
            recherche sur le portail.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-10 lg:ika-px-8">
      <header className="ika-mb-6">
        <h1 className="ika-text-2xl ika-font-bold ika-text-brand-navy">
          Résultats pour «&nbsp;{term}&nbsp;»
        </h1>
        {!loading && !response.degraded ? (
          <p className="ika-mt-1 ika-text-sm ika-text-brand-muted">
            {response.total === 0
              ? "Aucun résultat"
              : `${response.total} résultat${response.total > 1 ? "s" : ""}`}
          </p>
        ) : null}
      </header>

      <nav
        className="ika-mb-6 ika-flex ika-flex-wrap ika-gap-2"
        aria-label="Filtrer par type de contenu"
      >
        {SEARCH_TABS.map((tab) => {
          const active = tab.key === vertical;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setVertical(tab.key)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "ika-rounded-full ika-px-4 ika-py-2 ika-text-sm ika-font-medium ika-transition",
                active
                  ? "ika-bg-brand-navy ika-text-white"
                  : "ika-bg-brand-surface ika-text-brand-muted hover:ika-bg-brand-surface-2"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {loading ? (
        <div className="ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-p-10 ika-text-center ika-text-brand-muted">
          Recherche en cours…
        </div>
      ) : null}

      {/*
        Verticale indisponible (typiquement Mail.Read / Chat.Read pas encore
        approuvée). On garde l'onglet visible et on explique : masquer
        l'onglet laisserait l'utilisateur croire que la fonction n'existe pas,
        alors qu'elle attend seulement une action de l'administrateur.
      */}
      {!loading && response.degraded ? (
        <div className="ika-rounded-3xl ika-border ika-border-amber-200 ika-bg-amber-50 ika-p-8 ika-text-center">
          <Icon
            name="AlertCircle"
            className="ika-mx-auto ika-h-8 ika-w-8 ika-text-amber-600"
          />
          <p className="ika-mt-3 ika-font-medium ika-text-amber-900">
            Cette source n&apos;est pas disponible
          </p>
          <p className="ika-mt-1 ika-text-sm ika-text-amber-800">
            {response.degraded}
          </p>
        </div>
      ) : null}

      {!loading && !response.degraded && response.results.length === 0 ? (
        <div className="ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-p-10 ika-text-center ika-text-brand-muted">
          Aucun résultat pour «&nbsp;{term}&nbsp;» dans cette catégorie.
        </div>
      ) : null}

      {!loading && response.results.length > 0 ? (
        <ul className="ika-divide-y ika-divide-brand-line ika-overflow-hidden ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-shadow-sm">
          {response.results.map((result) => {
            const display = displayForKind(result.kind);
            const meta = [
              display.label,
              result.siteTitle,
              result.author,
              result.modified ? formatDateShort(result.modified) : "",
              result.sizeBytes ? formatFileSize(result.sizeBytes) : "",
            ].filter((part) => !!part);

            return (
              <li key={result.id}>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-interception="propagate"
                  className="ika-flex ika-items-start ika-gap-4 ika-px-5 ika-py-4 ika-transition hover:ika-bg-brand-surface"
                >
                  <span
                    className={cn(
                      "ika-mt-0.5 ika-shrink-0 ika-rounded-xl ika-p-2.5",
                      display.chip
                    )}
                  >
                    <Icon name={display.icon} className="ika-h-5 ika-w-5" />
                  </span>

                  <span className="ika-min-w-0 ika-flex-1">
                    <span className="ika-block ika-truncate ika-font-medium ika-text-brand-navy">
                      {result.title}
                    </span>

                    {result.summary ? (
                      <span
                        className="ika-mt-1 ika-block ika-text-sm ika-text-brand-muted [&_mark]:ika-bg-yellow-100 [&_mark]:ika-font-semibold [&_mark]:ika-text-brand-ink"
                        // Assaini par SearchService (DOMPurify) après conversion
                        // du surlignage propriétaire `<c0>` en `<mark>`.
                        dangerouslySetInnerHTML={{ __html: result.summary }}
                      />
                    ) : null}

                    <span className="ika-mt-1 ika-block ika-truncate ika-text-xs ika-text-brand-muted">
                      {meta.join(" · ")}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}

      {!loading && (page > 0 || response.moreAvailable) ? (
        <div className="ika-mt-6 ika-flex ika-items-center ika-justify-between">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            className={cn(
              "ika-flex ika-items-center ika-gap-2 ika-rounded-full ika-px-4 ika-py-2 ika-text-sm ika-font-medium ika-transition",
              page === 0
                ? "ika-cursor-not-allowed ika-text-brand-muted/50"
                : "ika-bg-brand-surface ika-text-brand-navy hover:ika-bg-brand-surface-2"
            )}
          >
            <Icon name="ChevronLeft" className="ika-h-4 ika-w-4" />
            Précédent
          </button>

          <span className="ika-text-sm ika-text-brand-muted">
            Page {page + 1}
          </span>

          <button
            type="button"
            disabled={!response.moreAvailable}
            onClick={() => setPage((prev) => prev + 1)}
            className={cn(
              "ika-flex ika-items-center ika-gap-2 ika-rounded-full ika-px-4 ika-py-2 ika-text-sm ika-font-medium ika-transition",
              !response.moreAvailable
                ? "ika-cursor-not-allowed ika-text-brand-muted/50"
                : "ika-bg-brand-surface ika-text-brand-navy hover:ika-bg-brand-surface-2"
            )}
          >
            Suivant
            <Icon name="ChevronRight" className="ika-h-4 ika-w-4" />
          </button>
        </div>
      ) : null}
    </section>
  );
};
