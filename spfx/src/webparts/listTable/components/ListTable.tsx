import "../../../styles/tailwind.css";

import * as React from "react";

import {
  IListColumn,
  IListRow,
  IListTableData,
} from "../../../models/IIkaModels";
import { IListTableProps } from "./IListTableProps";
import { Icon } from "../../../common/utils/Icon";
import {
  buildUserPhotoUrl,
  cn,
  formatCurrency,
  formatDateShort,
  stripHtml,
  truncate,
} from "../../../common/utils/spUtils";

const EMPTY: IListTableData = {
  listTitle: "",
  columns: [],
  rows: [],
  isDemo: false,
  truncated: false,
  totalColumns: 0,
};

/** Au-delà, on résume en « +N » plutôt que d'étirer la ligne. */
const MAX_MULTI_VALUES = 3;

/**
 * Une valeur de champ `URL` provient de la saisie utilisateur et finit dans un
 * `href`. `resolveUrl` ne contrôle aucun schéma, donc un `javascript:` s'y
 * exécuterait : liste blanche explicite, tout le reste est rendu en texte inerte.
 */
function isSafeHref(url: string): boolean {
  return /^(https?:|mailto:|tel:|#|\/)/i.test(url.trim());
}

interface ISortState {
  column: string;
  direction: "asc" | "desc";
}

interface IUserValue {
  Id?: number;
  Title?: string;
  EMail?: string;
}

/**
 * Les collections issues d'un `$expand` arrivent en tableau nu sous
 * `odata=nometadata`, mais les formes héritées de `verbose` les enveloppent
 * dans `results`. On accepte les deux.
 */
function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const wrapped = (value as { results?: unknown[] }).results;
    if (Array.isArray(wrapped)) return wrapped;
  }
  return [];
}

function asRecord(value: unknown): { [key: string]: unknown } | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as { [key: string]: unknown };
  }
  return undefined;
}

/** Retire le préfixe de type des colonnes calculées (`float;#1500`). */
function stripCalculatedPrefix(value: string): string {
  return value.replace(/^[a-z]+;#/i, "");
}

function formatNumber(value: number, percent: boolean): string {
  const displayed = percent ? value * 100 : value;
  const text = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(displayed);
  return percent ? `${text} %` : text;
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  const time = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formatDateShort(iso)} ${time}`;
}

function lookupLabel(value: unknown, column: IListColumn): string {
  const record = asRecord(value);
  if (!record) return typeof value === "string" ? value : "";
  const projected = column.lookupField || "Title";
  const label = record[projected] || record.Title;
  return typeof label === "string" ? label : "";
}

/**
 * Rendu texte d'une cellule. Sert à trois choses à la fois : la recherche, le
 * tri alphabétique et l'export CSV — d'où le fait que la recherche trouve bien
 * « Oui » ou « 27/08/2026 », c'est-à-dire ce que l'utilisateur voit à l'écran.
 */
function formatCell(value: unknown, column: IListColumn): string {
  if (value === undefined || value === null || value === "") return "";

  switch (column.kind) {
    case "boolean":
      return value === true || value === 1 ? "Oui" : "Non";

    case "number":
    case "percent":
      return typeof value === "number"
        ? formatNumber(value, column.kind === "percent")
        : String(value);

    case "currency":
      return typeof value === "number"
        ? formatCurrency(value, column.currencyCode || "XOF")
        : String(value);

    case "date":
      return typeof value === "string" ? formatDateShort(value) : "";

    case "datetime":
      return typeof value === "string" ? formatDateTime(value) : "";

    case "note":
      return typeof value === "string" ? stripHtml(value) : "";

    case "multichoice":
      return toArray(value)
        .map((entry) => String(entry))
        .join(" · ");

    case "lookup":
      return lookupLabel(value, column);

    case "lookupmulti":
      return toArray(value)
        .map((entry) => lookupLabel(entry, column))
        .filter(Boolean)
        .join(" · ");

    case "user": {
      const record = asRecord(value) as IUserValue | undefined;
      return record && typeof record.Title === "string" ? record.Title : "";
    }

    case "usermulti":
      return toArray(value)
        .map((entry) => {
          const record = asRecord(entry) as IUserValue | undefined;
          return record && typeof record.Title === "string" ? record.Title : "";
        })
        .filter(Boolean)
        .join(" · ");

    case "url": {
      const record = asRecord(value);
      if (!record) return typeof value === "string" ? value : "";
      const description = record.Description;
      const url = record.Url;
      if (typeof description === "string" && description) return description;
      return typeof url === "string" ? url : "";
    }

    case "taxonomy": {
      const single = asRecord(value);
      if (single && typeof single.Label === "string") return single.Label;
      return toArray(value)
        .map((entry) => {
          const record = asRecord(entry);
          return record && typeof record.Label === "string" ? record.Label : "";
        })
        .filter(Boolean)
        .join(" · ");
    }

    case "calculated":
      return typeof value === "string"
        ? stripCalculatedPrefix(value)
        : String(value);

    default:
      return typeof value === "string" ? value : String(value);
  }
}

/**
 * Valeur brute pour le tri et l'export CSV : un nombre reste un nombre, une
 * date reste comparable. Sans cela, un tri sur « Montant » comparerait
 * « 1 120 000 F CFA » à « 890 000 F CFA » comme deux chaînes.
 */
function rawSortValue(value: unknown, column: IListColumn): number | string {
  if (value === undefined || value === null) return "";

  switch (column.kind) {
    case "number":
    case "percent":
    case "currency":
      return typeof value === "number" ? value : Number.NEGATIVE_INFINITY;
    case "date":
    case "datetime": {
      const parsed = typeof value === "string" ? Date.parse(value) : NaN;
      return isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
    }
    case "boolean":
      return value === true || value === 1 ? 1 : 0;
    default:
      return formatCell(value, column).toLowerCase();
  }
}

const PILL =
  "ika-inline-flex ika-items-center ika-rounded-full ika-bg-brand-surface ika-px-2.5 ika-py-0.5 ika-text-xs ika-font-medium ika-text-brand-navy";

function renderMulti(labels: string[]): React.ReactNode {
  const shown = labels.slice(0, MAX_MULTI_VALUES);
  const rest = labels.length - shown.length;
  return (
    <span className="ika-inline-flex ika-flex-wrap ika-gap-1">
      {shown.map((label, index) => (
        <span key={`${label}-${index}`} className={PILL}>
          {label}
        </span>
      ))}
      {rest > 0 ? (
        <span className="ika-text-xs ika-text-brand-muted">+{rest}</span>
      ) : null}
    </span>
  );
}

function renderCell(row: IListRow, column: IListColumn): React.ReactNode {
  const value = row[column.internalName];
  const text = formatCell(value, column);

  if (!text) return <span className="ika-text-brand-muted">—</span>;

  switch (column.kind) {
    case "boolean":
      return (
        <span
          className={cn(
            PILL,
            text === "Oui"
              ? "ika-bg-emerald-50 ika-text-emerald-700"
              : "ika-bg-brand-surface ika-text-brand-muted"
          )}
        >
          {text}
        </span>
      );

    case "choice":
      return <span className={PILL}>{text}</span>;

    case "multichoice":
    case "lookupmulti":
      return renderMulti(text.split(" · "));

    case "note":
      return (
        <span title={text} className="ika-block ika-max-w-md">
          {truncate(text, 140)}
        </span>
      );

    case "user": {
      const record = asRecord(value) as IUserValue | undefined;
      return (
        <span className="ika-inline-flex ika-items-center ika-gap-2">
          <img
            src={buildUserPhotoUrl(record ? record.EMail : undefined, "S")}
            alt=""
            aria-hidden="true"
            className="ika-h-5 ika-w-5 ika-rounded-full ika-object-cover"
          />
          {text}
        </span>
      );
    }

    case "url": {
      const record = asRecord(value);
      const url = record && typeof record.Url === "string" ? record.Url : "";
      if (!url || !isSafeHref(url)) return <span>{text}</span>;
      return (
        <a
          href={url}
          data-interception="propagate"
          target="_blank"
          rel="noopener noreferrer"
          className="ika-text-brand-cyan hover:ika-underline"
        >
          {text}
        </a>
      );
    }

    default:
      return <span>{text}</span>;
  }
}

function csvEscape(value: string): string {
  const needsQuote = /[";\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

const Skeleton: React.FC = () => (
  <div
    className="ika-overflow-hidden ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-shadow-sm"
    aria-hidden="true"
  >
    <div className="ika-animate-pulse">
      <div className="ika-h-12 ika-bg-brand-surface" />
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="ika-flex ika-gap-4 ika-border-t ika-border-brand-line ika-px-5 ika-py-4"
        >
          <div className="ika-h-4 ika-w-1/4 ika-rounded ika-bg-brand-surface" />
          <div className="ika-h-4 ika-w-1/5 ika-rounded ika-bg-brand-surface" />
          <div className="ika-h-4 ika-w-1/6 ika-rounded ika-bg-brand-surface" />
          <div className="ika-h-4 ika-w-1/5 ika-rounded ika-bg-brand-surface" />
        </div>
      ))}
    </div>
  </div>
);

export const ListTable: React.FC<IListTableProps> = (props) => {
  const {
    title,
    description,
    listTitle,
    iconName,
    getListTable,
    showSearch,
    showExport,
  } = props;

  const [data, setData] = React.useState<IListTableData>(EMPTY);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [term, setTerm] = React.useState<string>("");
  const [sort, setSort] = React.useState<ISortState | undefined>(undefined);

  const sequence = React.useRef<number>(0);

  // Changer de liste doit repartir d'un tri et d'un filtre neutres : les
  // colonnes ne sont pas les mêmes d'une liste à l'autre.
  React.useEffect(() => {
    setSort(undefined);
    setTerm("");
  }, [listTitle]);

  React.useEffect(() => {
    setLoading(true);
    const ticket = ++sequence.current;

    getListTable(listTitle)
      .then((payload) => {
        if (ticket !== sequence.current) return;
        setData(payload);
        setLoading(false);
      })
      .catch(() => {
        if (ticket !== sequence.current) return;
        setData({
          ...EMPTY,
          listTitle,
          error: `Impossible de charger la liste « ${listTitle} ».`,
        });
        setLoading(false);
      });
  }, [listTitle, getListTable]);

  const columns = data.columns;

  const visibleRows = React.useMemo(() => {
    const needle = term.trim().toLowerCase();

    const filtered = needle
      ? data.rows.filter((row) =>
          columns.some(
            (column) =>
              formatCell(row[column.internalName], column)
                .toLowerCase()
                .indexOf(needle) !== -1
          )
        )
      : data.rows;

    if (!sort) return filtered;

    const column = columns.filter(
      (candidate) => candidate.internalName === sort.column
    )[0];
    if (!column) return filtered;

    const factor = sort.direction === "asc" ? 1 : -1;

    return filtered.slice().sort((left, right) => {
      const a = rawSortValue(left[column.internalName], column);
      const b = rawSortValue(right[column.internalName], column);

      if (typeof a === "number" && typeof b === "number") {
        return (a - b) * factor;
      }
      return String(a).localeCompare(String(b), "fr") * factor;
    });
  }, [data.rows, columns, term, sort]);

  const toggleSort = (internalName: string): void => {
    setSort((current) => {
      if (!current || current.column !== internalName) {
        return { column: internalName, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { column: internalName, direction: "desc" };
      }
      return undefined;
    });
  };

  const exportCsv = (): void => {
    const header = columns.map((column) => column.displayName);
    const body = visibleRows.map((row) =>
      columns.map((column) => {
        const value = row[column.internalName];
        // Nombres et dates exportés bruts : Excel les réinterpréterait mal
        // depuis leur rendu français (« 1 120 000 F CFA », « 27/08/2026 »).
        if (
          column.numeric &&
          typeof value === "number" &&
          !isNaN(value)
        ) {
          return String(value);
        }
        return formatCell(value, column);
      })
    );

    const csv = [header]
      .concat(body)
      .map((row) => row.map(csvEscape).join(";"))
      .join("\r\n");

    // BOM UTF-8 : sans lui, Excel en français ouvre les accents en mojibake.
    const blob = new Blob([`﻿${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${listTitle || "liste"}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const renderBody = (): React.ReactNode => {
    if (loading) return <Skeleton />;

    if (data.error) {
      return (
        <div
          role="alert"
          className="ika-rounded-3xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">
            {data.error}
          </p>
        </div>
      );
    }

    if (columns.length === 0 || data.rows.length === 0) {
      return (
        <div className="ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-p-10 ika-text-center ika-text-brand-muted">
          Aucun élément dans cette liste.
        </div>
      );
    }

    return (
      <React.Fragment>
        <div
          role="region"
          aria-label={`Tableau ${title}`}
          tabIndex={0}
          className="ika-overflow-x-auto ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-shadow-sm"
        >
          <table className="ika-w-full ika-min-w-[720px] ika-border-collapse ika-bg-white ika-text-sm">
            <caption className="ika-sr-only">
              {title} — {visibleRows.length} élément
              {visibleRows.length > 1 ? "s" : ""}
            </caption>
            <thead>
              <tr className="ika-bg-brand-surface">
                {columns.map((column) => {
                  const active = sort && sort.column === column.internalName;
                  return (
                    <th
                      key={column.internalName}
                      scope="col"
                      aria-sort={
                        active
                          ? sort.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                      className={cn(
                        "ika-border-b ika-border-brand-line ika-px-4 ika-py-3 ika-font-semibold ika-text-brand-navy",
                        column.numeric ? "ika-text-right" : "ika-text-left"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(column.internalName)}
                        className={cn(
                          "ika-inline-flex ika-items-center ika-gap-1 hover:ika-text-brand-cyan",
                          column.numeric ? "ika-flex-row-reverse" : ""
                        )}
                      >
                        {column.displayName}
                        <Icon
                          name={
                            active
                              ? sort.direction === "asc"
                                ? "ChevronUp"
                                : "ChevronDown"
                              : "ChevronsUpDown"
                          }
                          className={cn(
                            "ika-h-3.5 ika-w-3.5",
                            active ? "ika-text-brand-cyan" : "ika-text-brand-muted"
                          )}
                        />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr
                  key={row.Id}
                  className="even:ika-bg-brand-surface/40 hover:ika-bg-brand-surface"
                >
                  {columns.map((column) => (
                    <td
                      key={column.internalName}
                      className={cn(
                        "ika-border-b ika-border-brand-line ika-px-4 ika-py-3 ika-align-top ika-text-brand-navy",
                        column.numeric
                          ? "ika-text-right ika-tabular-nums"
                          : "ika-text-left",
                        column.kind === "date" || column.kind === "datetime"
                          ? "ika-whitespace-nowrap"
                          : ""
                      )}
                    >
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleRows.length === 0 ? (
          <p className="ika-mt-4 ika-text-center ika-text-sm ika-text-brand-muted">
            Aucun élément ne correspond à « {term} ».
          </p>
        ) : null}

        {data.truncated ? (
          <p className="ika-mt-4 ika-text-sm ika-text-brand-muted">
            Seuls les 200 premiers éléments sont affichés.
          </p>
        ) : null}

        {data.totalColumns > columns.length ? (
          <p className="ika-mt-1 ika-text-sm ika-text-brand-muted">
            {columns.length} colonnes affichées sur {data.totalColumns} (les
            premières de la vue par défaut).
          </p>
        ) : null}
      </React.Fragment>
    );
  };

  return (
    <div className="ika-root">
      <section className="ika-mx-auto ika-max-w-7xl">
        <p className="ika-text-sm ika-uppercase ika-tracking-[0.3em] ika-text-brand-cyan">
          Référentiel
        </p>
        <h1 className="ika-mt-2 ika-flex ika-items-center ika-gap-3 ika-text-3xl ika-font-bold ika-text-brand-navy">
          {iconName ? (
            <Icon name={iconName} className="ika-h-7 ika-w-7 ika-text-brand-cyan" />
          ) : null}
          {title}
        </h1>
        {description ? (
          <p className="ika-mt-2 ika-text-brand-muted">{description}</p>
        ) : null}

        {data.isDemo && !loading ? (
          <div className="ika-mt-6 ika-rounded-2xl ika-border ika-border-amber-200 ika-bg-amber-50 ika-px-4 ika-py-3 ika-text-sm ika-text-amber-800">
            Données de démonstration : la liste « {listTitle} » n&apos;est pas
            lue depuis SharePoint dans cet environnement.
          </div>
        ) : null}

        {!loading && !data.error && data.rows.length > 0 ? (
          <div className="ika-mt-6 ika-flex ika-flex-wrap ika-items-center ika-gap-3">
            {showSearch ? (
              <label className="ika-relative ika-flex-1 sm:ika-max-w-sm">
                <span className="ika-sr-only">Rechercher dans {title}</span>
                <Icon
                  name="Search"
                  className="ika-pointer-events-none ika-absolute ika-left-3 ika-top-1/2 ika-h-4 ika-w-4 -ika-translate-y-1/2 ika-text-brand-muted"
                />
                <input
                  type="search"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Rechercher…"
                  className="ika-w-full ika-rounded-full ika-border ika-border-brand-line ika-bg-white ika-py-2 ika-pl-9 ika-pr-4 ika-text-sm ika-text-brand-navy placeholder:ika-text-brand-muted focus:ika-border-brand-cyan focus:ika-outline-none"
                />
              </label>
            ) : null}

            <span className="ika-text-sm ika-text-brand-muted">
              {visibleRows.length} élément
              {visibleRows.length > 1 ? "s" : ""}
            </span>

            {showExport ? (
              <button
                type="button"
                onClick={exportCsv}
                className="ika-ml-auto ika-inline-flex ika-items-center ika-gap-2 ika-rounded-full ika-border ika-border-brand-line ika-px-4 ika-py-2 ika-text-sm ika-font-medium ika-text-brand-navy ika-transition hover:ika-border-brand-cyan hover:ika-text-brand-cyan"
              >
                <Icon name="Download" className="ika-h-4 ika-w-4" />
                Exporter (CSV)
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="ika-mt-6">{renderBody()}</div>
      </section>
    </div>
  );
};
