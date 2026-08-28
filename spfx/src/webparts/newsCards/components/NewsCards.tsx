import * as React from "react";

import { INewsCardsProps } from "./INewsCardsProps";
import { INewsItem } from "../../../models/IIkaModels";
import {
  buildImageUrl,
  cn,
  resolveUrl,
} from "../../../common/utils/spUtils";
import { Icon } from "../../../common/utils/Icon";

const ALL_CATEGORIES = "Toutes les catégories";

/**
 * NewsCards — port 1:1 de components/intranet/News.tsx (maquette Next.js) :
 * grille d'actualités 2 colonnes avec image, catégorie/date, extrait et
 * bouton CTA « Voir toutes les actualités ».
 */

function formatDayMonth(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Pagination. Fenêtre glissante de 5 numéros autour de la page courante :
 * au-delà, une liste de 20 pages déborderait de la ligne sur mobile.
 */
const Pager: React.FC<{
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}> = (props) => {
  const { page, totalPages, onChange } = props;

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, Math.max(page + 2, 5));
  const numbers: number[] = [];
  for (let i = start; i <= end; i++) numbers.push(i);

  const arrowClass =
    "ika-flex ika-h-9 ika-w-9 ika-items-center ika-justify-center ika-rounded-full ika-border ika-border-slate-300 ika-bg-white ika-text-slate-900 ika-transition-colors hover:ika-border-brand-accent hover:ika-text-brand-accent disabled:ika-cursor-not-allowed disabled:ika-opacity-40 disabled:hover:ika-border-slate-300 disabled:hover:ika-text-slate-900";

  return (
    <nav
      aria-label="Pagination des actualités"
      className="ika-flex ika-items-center ika-justify-center ika-gap-2"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Page précédente"
        className={arrowClass}
      >
        <Icon name="ChevronLeft" className="ika-h-4 ika-w-4" />
      </button>

      {numbers.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          aria-label={`Page ${n}`}
          className={cn(
            "ika-flex ika-h-9 ika-min-w-[2.25rem] ika-items-center ika-justify-center ika-rounded-full ika-px-3 ika-text-sm ika-font-bold ika-transition-colors",
            n === page
              ? "ika-bg-brand-accent ika-text-white"
              : "ika-border ika-border-slate-300 ika-bg-white ika-text-slate-900 hover:ika-border-brand-accent hover:ika-text-brand-accent"
          )}
        >
          {n}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Page suivante"
        className={arrowClass}
      >
        <Icon name="ChevronRight" className="ika-h-4 ika-w-4" />
      </button>
    </nav>
  );
};

export const NewsCards: React.FC<INewsCardsProps> = (props) => {
  const {
    eyebrow,
    title,
    description,
    items,
    loading,
    error,
    ctaUrl,
    ctaLabel,
    showFilters,
    pageSize,
  } = props;

  const [search, setSearch] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>(ALL_CATEGORIES);
  const [page, setPage] = React.useState<number>(1);

  // Catégories réellement présentes dans les données, pas les 12 valeurs du
  // type `NewsCategory` : proposer un filtre qui ne remonte rien est pire que
  // de ne pas le proposer.
  const categories = React.useMemo<string[]>(() => {
    const found: string[] = [];
    (items || []).forEach((item) => {
      if (item.Category && found.indexOf(item.Category) === -1) {
        found.push(item.Category);
      }
    });
    found.sort();
    return [ALL_CATEGORIES].concat(found);
  }, [items]);

  const filtered = React.useMemo<INewsItem[]>(() => {
    const term = search.trim().toLowerCase();
    return (items || []).filter((item) => {
      const matchCategory =
        category === ALL_CATEGORIES || item.Category === category;
      if (!matchCategory) return false;
      if (!term) return true;
      // Titre + extrait + catégorie : l'utilisateur cherche aussi bien « RH »
      // qu'un mot lu dans le chapeau de l'article.
      const haystack = `${item.Title || ""} ${item.Excerpt || ""} ${
        item.Category || ""
      }`.toLowerCase();
      return haystack.indexOf(term) !== -1;
    });
  }, [items, search, category]);

  const perPage = pageSize && pageSize > 0 ? pageSize : 0;
  const totalPages = perPage ? Math.ceil(filtered.length / perPage) : 1;

  // Le filtre peut vider la page courante (on était page 4, il ne reste que
  // 2 pages) : on ramène l'utilisateur dans les bornes plutôt que d'afficher
  // une grille vide qui ressemblerait à une absence de résultats.
  const safePage = Math.min(Math.max(1, page), Math.max(1, totalPages));
  React.useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page]);

  const visible = React.useMemo<INewsItem[]>(() => {
    if (!perPage) return filtered;
    const offset = (safePage - 1) * perPage;
    return filtered.slice(offset, offset + perPage);
  }, [filtered, perPage, safePage]);

  const changeFilter = (apply: () => void): void => {
    apply();
    setPage(1);
  };

  const goToPage = (next: number): void => {
    setPage(next);
    // Sans cela, changer de page laisse l'utilisateur en bas de la liste,
    // devant la fin de la page suivante.
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderBody = (): React.ReactElement => {
    if (loading) {
      return (
        <div
          className="ika-grid ika-grid-cols-1 ika-overflow-hidden ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-animate-pulse md:ika-grid-cols-2"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="ika-flex ika-flex-col ika-gap-5 ika-p-5 sm:ika-flex-row sm:ika-p-6"
            >
              <div className="ika-h-44 ika-w-full ika-shrink-0 ika-rounded-xl ika-bg-slate-200 sm:ika-h-28 sm:ika-w-40" />
              <div className="ika-flex-1 ika-space-y-3">
                <div className="ika-h-3 ika-w-24 ika-rounded ika-bg-slate-200" />
                <div className="ika-h-5 ika-w-3/4 ika-rounded ika-bg-slate-200" />
                <div className="ika-h-3 ika-w-full ika-rounded ika-bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div
          role="alert"
          className="ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="ika-rounded-2xl ika-border ika-border-dashed ika-border-slate-300 ika-bg-white ika-p-10 ika-text-center">
          <p className="ika-text-sm ika-font-medium ika-text-slate-900">
            Aucune actualité publiée
          </p>
          <p className="ika-mt-1 ika-text-sm ika-text-slate-500">
            Les nouvelles publications apparaîtront ici.
          </p>
        </div>
      );
    }

    // Distinct du cas ci-dessus : il Y A des actualités, mais les critères de
    // l'utilisateur n'en retiennent aucune. Le message doit lui dire quoi
    // faire (élargir la recherche), pas lui laisser croire que la liste est
    // vide.
    if (filtered.length === 0) {
      return (
        <div className="ika-rounded-2xl ika-border ika-border-dashed ika-border-slate-300 ika-bg-white ika-p-10 ika-text-center">
          <p className="ika-text-sm ika-font-medium ika-text-slate-900">
            Aucune actualité ne correspond à votre recherche
          </p>
          <p className="ika-mt-1 ika-text-sm ika-text-slate-500">
            Essayez un autre terme ou sélectionnez « {ALL_CATEGORIES} ».
          </p>
          <button
            type="button"
            onClick={() =>
              changeFilter(() => {
                setSearch("");
                setCategory(ALL_CATEGORIES);
              })
            }
            className="ika-mt-4 ika-rounded-full ika-border ika-border-slate-300 ika-bg-white ika-px-5 ika-py-2 ika-text-sm ika-font-bold ika-text-slate-900 ika-transition-colors hover:ika-border-brand-accent hover:ika-text-brand-accent"
          >
            Réinitialiser les filtres
          </button>
        </div>
      );
    }

    return (
      <div className="ika-grid ika-grid-cols-1 ika-overflow-hidden ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-shadow-sm md:ika-grid-cols-2">
        {visible.map((item, index) => {
          // La grille fait 2 colonnes à partir de `md`. L'ancien test
          // `index >= length - 2` se trompait dès que le nombre d'éléments
          // était IMPAIR : avec 7 cartes, l'index 5 (3e rangée) perdait son
          // filet du bas alors que la 4e rangée existait encore. On raisonne
          // donc en numéro de rangée, pas en distance à la fin.
          const isLastRow =
            Math.floor(index / 2) === Math.floor((visible.length - 1) / 2);
          const isRightCol = index % 2 === 1;
          const href = item.ExternalLink
            ? resolveUrl(item.ExternalLink)
            : undefined;

          const inner = (
            <>
              <div className="ika-relative ika-h-44 ika-w-full ika-shrink-0 ika-overflow-hidden ika-rounded-xl ika-bg-slate-100 ika-shadow-sm sm:ika-h-28 sm:ika-w-40">
                {item.HeaderImage ? (
                  <img
                    src={buildImageUrl(item.HeaderImage, 400)}
                    alt={item.Title}
                    loading="lazy"
                    className="ika-h-full ika-w-full ika-object-cover ika-transition-transform ika-duration-500 group-hover:ika-scale-105"
                  />
                ) : null}
              </div>

              <div className="ika-flex ika-min-w-0 ika-flex-1 ika-flex-col">
                <div className="ika-mb-2 ika-flex ika-items-center ika-gap-2">
                  <span className="ika-text-[11px] ika-font-bold ika-uppercase ika-tracking-widest ika-text-brand-accent">
                    {item.Category}
                  </span>
                  <span aria-hidden="true" className="ika-text-xs ika-text-slate-300">
                    ·
                  </span>
                  <time
                    dateTime={item.PublishDate}
                    className="ika-text-[11px] ika-font-medium ika-text-slate-400"
                  >
                    {formatDayMonth(item.PublishDate)}
                  </time>
                </div>

                <h2 className="ika-mb-2 ika-text-lg ika-font-bold ika-leading-snug ika-text-slate-900 ika-transition-colors ika-duration-300 group-hover:ika-text-brand-accent">
                  {item.Title}
                </h2>

                <p className="ika-line-clamp-2 ika-text-sm ika-leading-relaxed ika-text-slate-500">
                  {item.Excerpt}
                </p>

                <div className="ika-mt-4 ika-flex ika-translate-x-[-4px] ika-items-center ika-gap-1 ika-text-xs ika-font-bold ika-uppercase ika-tracking-wider ika-text-slate-900 ika-opacity-0 ika-transition-all ika-duration-300 group-hover:ika-translate-x-0 group-hover:ika-opacity-100">
                  Lire la suite
                  <Icon name="fa-arrow-right" className="ika-h-3.5 ika-w-3.5" />
                </div>
              </div>
            </>
          );

          const detailHash = `#actualite/${item.Id}`;

          return (
            <a
              key={item.Id}
              href={href || detailHash}
              data-interception="propagate"
              onClick={(e) => {
                if (!href) {
                  e.preventDefault();
                  window.location.hash = detailHash;
                }
              }}
              className={cn(
                "ika-group ika-flex ika-cursor-pointer ika-flex-col ika-gap-5 ika-p-5 ika-transition-colors ika-duration-300 hover:ika-bg-slate-50 sm:ika-flex-row sm:ika-p-6",
                !isLastRow ? "md:ika-border-b md:ika-border-slate-200" : "",
                !isRightCol ? "md:ika-border-r md:ika-border-slate-200" : "",
                index !== visible.length - 1
                  ? "ika-border-b ika-border-slate-200 md:ika-border-b-0"
                  : ""
              )}
            >
              {inner}
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ika-root">
      <section className="ika-w-full ika-py-10">
        <div className="ika-mx-auto ika-w-full ika-max-w-7xl ika-px-4 sm:ika-px-6 lg:ika-px-8">
          {/* Header */}
          <div className="ika-mb-8 ika-flex ika-flex-col ika-gap-2 md:ika-flex-row md:ika-items-end md:ika-justify-between">
            <div>
              <span className="ika-text-xs ika-font-semibold ika-uppercase ika-tracking-[0.3em] ika-text-brand-accent">
                {eyebrow || "Vie interne"}
              </span>
              <h1 className="ika-mt-2 ika-text-3xl ika-font-extrabold ika-tracking-tight ika-text-slate-900 md:ika-text-4xl">
                {title || "Actualités de l'entreprise"}
              </h1>
            </div>

            {description ? (
              <p className="ika-max-w-xl ika-text-sm ika-leading-relaxed ika-text-slate-500">
                {description}
              </p>
            ) : null}
          </div>

          {/* Recherche + filtre par catégorie (vue complète uniquement) */}
          {showFilters && !loading && !error && items.length > 0 ? (
            <div className="ika-mb-6 ika-flex ika-flex-col ika-gap-3 sm:ika-flex-row">
              <div className="ika-relative ika-flex-1">
                <span className="ika-absolute ika-left-3 ika-top-1/2 ika--translate-y-1/2 ika-text-slate-400">
                  <Icon name="Search" className="ika-h-[15px] ika-w-[15px]" />
                </span>
                <input
                  type="search"
                  placeholder="Rechercher une actualité…"
                  value={search}
                  onChange={(e) =>
                    changeFilter(() => setSearch(e.target.value))
                  }
                  aria-label="Rechercher une actualité"
                  className="ika-w-full ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-py-2.5 ika-pl-9 ika-pr-4 ika-text-sm ika-text-slate-700 ika-placeholder-slate-400 ika-shadow-sm ika-transition-colors focus:ika-border-brand-accent focus:ika-outline-none"
                />
              </div>

              {categories.length > 1 ? (
                <div className="ika-relative">
                  <span className="ika-absolute ika-left-3 ika-top-1/2 ika--translate-y-1/2 ika-text-slate-400">
                    <Icon name="Filter" className="ika-h-3.5 ika-w-3.5" />
                  </span>
                  <select
                    value={category}
                    onChange={(e) =>
                      changeFilter(() => setCategory(e.target.value))
                    }
                    aria-label="Filtrer par catégorie"
                    className="ika-w-full ika-cursor-pointer ika-appearance-none ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-py-2.5 ika-pl-9 ika-pr-8 ika-text-sm ika-text-slate-700 ika-shadow-sm ika-transition-colors focus:ika-border-brand-accent focus:ika-outline-none sm:ika-w-auto"
                  >
                    {categories.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Compteur de résultats : sans lui, rien n'indique combien
              d'actualités le filtre a retenues ni où l'on se situe dans la
              pagination. */}
          {showFilters && !loading && !error && items.length > 0 ? (
            <p
              aria-live="polite"
              className="ika-mb-4 ika-text-sm ika-text-slate-500"
            >
              {filtered.length === 0
                ? "Aucun résultat"
                : `${filtered.length} actualité${
                    filtered.length > 1 ? "s" : ""
                  }${
                    totalPages > 1 ? ` · page ${safePage} sur ${totalPages}` : ""
                  }`}
            </p>
          ) : null}

          {renderBody()}

          {/* Pied : pagination si la liste est paginée, sinon le CTA. */}
          {perPage && totalPages > 1 && !loading && !error ? (
            <div className="ika-mt-8">
              <Pager
                page={safePage}
                totalPages={totalPages}
                onChange={goToPage}
              />
            </div>
          ) : ctaLabel ? (
          <div className="ika-mt-8 ika-flex ika-justify-center">
            <a
              href={ctaUrl || "#actualites"}
              data-interception="propagate"
              onClick={(e) => {
                if (!ctaUrl) {
                  e.preventDefault();
                  window.location.hash = "#actualites";
                }
              }}
              className="ika-group ika-flex ika-items-center ika-gap-2 ika-rounded-full ika-border ika-border-slate-300 ika-bg-white ika-px-6 ika-py-3 ika-text-sm ika-font-bold ika-text-slate-900 ika-shadow-sm ika-transition-all ika-duration-300 hover:ika-border-brand-accent hover:ika-bg-brand-accent hover:ika-text-white"
            >
              {ctaLabel}
              <Icon
                name="fa-arrow-right"
                className="ika-h-4 ika-w-4 ika-transition-transform ika-duration-300 group-hover:ika-translate-x-1"
              />
            </a>
          </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};
