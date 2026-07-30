import * as React from "react";

import {
  IPriceSheetLineDraft,
  IPriceSheetProps,
} from "./IPriceSheetProps";
import { Icon } from "../../../common/utils/Icon";
import { cn, formatCurrency } from "../../../common/utils/spUtils";

let keyCounter = 0;

function nextKey(): string {
  keyCounter += 1;
  return `line-${Date.now()}-${keyCounter}`;
}

function emptyLine(articleNo: number): IPriceSheetLineDraft {
  return {
    key: nextKey(),
    articleNo: String(articleNo),
    description: "",
    deliveryDate: "",
    quantity: 1,
    unitPrice: 0,
  };
}

function csvEscape(value: string): string {
  const needsQuote = /[";\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

export const PriceSheet: React.FC<IPriceSheetProps> = (props) => {
  const {
    title,
    clientName,
    subject,
    vatRate,
    currency,
    initialLines,
    loading,
    error,
    canEdit,
  } = props;

  const [lines, setLines] = React.useState<IPriceSheetLineDraft[]>([]);
  const [hydrated, setHydrated] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (hydrated || loading) return;
    setLines(initialLines.length > 0 ? initialLines : [emptyLine(1)]);
    setHydrated(true);
  }, [initialLines, loading, hydrated]);

  const totalHT = lines.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice,
    0
  );
  const vatAmount = totalHT * (vatRate / 100);
  const totalTTC = totalHT + vatAmount;

  const renumber = (rows: IPriceSheetLineDraft[]): IPriceSheetLineDraft[] =>
    rows.map((row, index) => ({ ...row, articleNo: String(index + 1) }));

  const addLine = (): void =>
    setLines((current) => renumber(current.concat([emptyLine(current.length + 1)])));

  const removeLine = (key: string): void =>
    setLines((current) =>
      current.length <= 1
        ? current
        : renumber(current.filter((line) => line.key !== key))
    );

  const updateLine = (
    key: string,
    field: keyof IPriceSheetLineDraft,
    value: string | number
  ): void =>
    setLines((current) =>
      current.map((line) =>
        line.key === key ? { ...line, [field]: value } : line
      )
    );

  const exportCsv = (): void => {
    const header = [
      "N°",
      "Désignation",
      "Délai",
      "Quantité",
      "Prix unitaire",
      "Montant",
    ];

    const rows = lines.map((line) => [
      line.articleNo,
      line.description,
      line.deliveryDate,
      String(line.quantity),
      String(line.unitPrice),
      String(line.quantity * line.unitPrice),
    ]);

    const totals = [
      ["", "", "", "", "Total HT", String(totalHT)],
      ["", "", "", "", `TVA ${vatRate}%`, String(vatAmount)],
      ["", "", "", "", "Total TTC", String(totalTTC)],
    ];

    const csv = [header]
      .concat(rows)
      .concat(totals)
      .map((row) => row.map(csvEscape).join(";"))
      .join("\r\n");

    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `bordereau-${clientName || "client"}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="ika-root">
        <div className="ika-animate-pulse ika-space-y-3" aria-hidden="true">
          <div className="ika-h-8 ika-w-64 ika-rounded ika-bg-slate-200" />
          <div className="ika-h-48 ika-rounded-2xl ika-bg-slate-100" />
        </div>
      </div>
    );
  }

  const inputClass =
    "ika-w-full ika-rounded-lg ika-border ika-border-slate-200 ika-bg-white ika-px-2 ika-py-1.5 ika-text-sm ika-outline-none focus:ika-border-brand-cyan disabled:ika-bg-slate-50 disabled:ika-text-slate-500";

  return (
    <div className="ika-root">
      <section aria-labelledby="ika-pricesheet-title">
        <header className="ika-mb-5 ika-flex ika-flex-wrap ika-items-end ika-justify-between ika-gap-4">
          <div>
            <h2
              id="ika-pricesheet-title"
              className="ika-text-xl ika-font-extrabold ika-tracking-tight ika-text-brand-navy"
            >
              {title}
            </h2>
            {clientName || subject ? (
              <p className="ika-mt-1 ika-text-sm ika-text-slate-500">
                {clientName}
                {clientName && subject ? " — " : ""}
                {subject}
              </p>
            ) : null}
          </div>

          <div className="ika-flex ika-gap-2">
            {canEdit ? (
              <button
                type="button"
                onClick={addLine}
                className="ika-inline-flex ika-items-center ika-gap-1.5 ika-rounded-xl ika-bg-brand-navy ika-px-4 ika-py-2 ika-text-sm ika-font-bold ika-text-white ika-transition-colors hover:ika-bg-brand-navy-light"
              >
                <Icon name="FileEdit" className="ika-h-4 ika-w-4" />
                Ajouter une ligne
              </button>
            ) : null}
            <button
              type="button"
              onClick={exportCsv}
              className="ika-inline-flex ika-items-center ika-gap-1.5 ika-rounded-xl ika-border ika-border-slate-300 ika-bg-white ika-px-4 ika-py-2 ika-text-sm ika-font-bold ika-text-brand-navy ika-transition-colors hover:ika-border-brand-cyan"
            >
              <Icon name="xlsx" className="ika-h-4 ika-w-4" />
              Exporter (CSV)
            </button>
          </div>
        </header>

        {error ? (
          <div
            role="alert"
            className="ika-mb-4 ika-rounded-xl ika-border ika-border-amber-200 ika-bg-amber-50 ika-p-4"
          >
            <p className="ika-text-sm ika-text-amber-800">{error}</p>
          </div>
        ) : null}

        <div className="ika-overflow-x-auto ika-rounded-2xl ika-border ika-border-slate-200">
          <table className="ika-w-full ika-min-w-[720px] ika-border-collapse ika-bg-white ika-text-sm">
            <caption className="ika-sr-only">
              Bordereau de prix — {lines.length} ligne
              {lines.length > 1 ? "s" : ""}
            </caption>
            <thead>
              <tr className="ika-bg-slate-50 ika-text-left ika-text-xs ika-uppercase ika-tracking-wider ika-text-slate-500">
                <th scope="col" className="ika-w-14 ika-px-3 ika-py-3">
                  N°
                </th>
                <th scope="col" className="ika-px-3 ika-py-3">
                  Désignation
                </th>
                <th scope="col" className="ika-w-32 ika-px-3 ika-py-3">
                  Délai
                </th>
                <th scope="col" className="ika-w-24 ika-px-3 ika-py-3 ika-text-right">
                  Qté
                </th>
                <th scope="col" className="ika-w-36 ika-px-3 ika-py-3 ika-text-right">
                  Prix unitaire
                </th>
                <th scope="col" className="ika-w-36 ika-px-3 ika-py-3 ika-text-right">
                  Montant
                </th>
                {canEdit ? (
                  <th scope="col" className="ika-w-12 ika-px-3 ika-py-3">
                    <span className="ika-sr-only">Actions</span>
                  </th>
                ) : null}
              </tr>
            </thead>

            <tbody className="ika-divide-y ika-divide-slate-100">
              {lines.map((line) => (
                <tr key={line.key} className="hover:ika-bg-slate-50/60">
                  <td className="ika-px-3 ika-py-2 ika-font-bold ika-text-slate-500">
                    {line.articleNo}
                  </td>
                  <td className="ika-px-3 ika-py-2">
                    <label className="ika-sr-only" htmlFor={`d-${line.key}`}>
                      Désignation ligne {line.articleNo}
                    </label>
                    <input
                      id={`d-${line.key}`}
                      type="text"
                      value={line.description}
                      disabled={!canEdit}
                      onChange={(e) =>
                        updateLine(line.key, "description", e.target.value)
                      }
                      className={inputClass}
                    />
                  </td>
                  <td className="ika-px-3 ika-py-2">
                    <label className="ika-sr-only" htmlFor={`l-${line.key}`}>
                      Délai ligne {line.articleNo}
                    </label>
                    <input
                      id={`l-${line.key}`}
                      type="text"
                      value={line.deliveryDate}
                      disabled={!canEdit}
                      onChange={(e) =>
                        updateLine(line.key, "deliveryDate", e.target.value)
                      }
                      className={inputClass}
                    />
                  </td>
                  <td className="ika-px-3 ika-py-2">
                    <label className="ika-sr-only" htmlFor={`q-${line.key}`}>
                      Quantité ligne {line.articleNo}
                    </label>
                    <input
                      id={`q-${line.key}`}
                      type="number"
                      min={0}
                      step="any"
                      value={line.quantity}
                      disabled={!canEdit}
                      onChange={(e) =>
                        updateLine(
                          line.key,
                          "quantity",
                          Math.max(0, Number(e.target.value) || 0)
                        )
                      }
                      className={cn(inputClass, "ika-text-right")}
                    />
                  </td>
                  <td className="ika-px-3 ika-py-2">
                    <label className="ika-sr-only" htmlFor={`p-${line.key}`}>
                      Prix unitaire ligne {line.articleNo}
                    </label>
                    <input
                      id={`p-${line.key}`}
                      type="number"
                      min={0}
                      step="any"
                      value={line.unitPrice}
                      disabled={!canEdit}
                      onChange={(e) =>
                        updateLine(
                          line.key,
                          "unitPrice",
                          Math.max(0, Number(e.target.value) || 0)
                        )
                      }
                      className={cn(inputClass, "ika-text-right")}
                    />
                  </td>
                  <td className="ika-px-3 ika-py-2 ika-text-right ika-font-bold ika-tabular-nums ika-text-brand-navy">
                    {formatCurrency(line.quantity * line.unitPrice, currency)}
                  </td>
                  {canEdit ? (
                    <td className="ika-px-3 ika-py-2">
                      <button
                        type="button"
                        onClick={() => removeLine(line.key)}
                        disabled={lines.length <= 1}
                        aria-label={`Supprimer la ligne ${line.articleNo}`}
                        className="ika-rounded-lg ika-p-1.5 ika-text-slate-400 ika-transition-colors hover:ika-bg-red-50 hover:ika-text-red-600 disabled:ika-opacity-30"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                          className="ika-h-4 ika-w-4"
                        >
                          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                        </svg>
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>

            <tfoot className="ika-bg-slate-50 ika-font-bold">
              <tr>
                <td colSpan={canEdit ? 5 : 4} className="ika-px-3 ika-py-2 ika-text-right ika-text-slate-500">
                  Total HT
                </td>
                <td className="ika-px-3 ika-py-2 ika-text-right ika-tabular-nums ika-text-brand-navy">
                  {formatCurrency(totalHT, currency)}
                </td>
                {canEdit ? <td /> : null}
              </tr>
              <tr>
                <td colSpan={canEdit ? 5 : 4} className="ika-px-3 ika-py-2 ika-text-right ika-text-slate-500">
                  TVA {vatRate}%
                </td>
                <td className="ika-px-3 ika-py-2 ika-text-right ika-tabular-nums ika-text-brand-navy">
                  {formatCurrency(vatAmount, currency)}
                </td>
                {canEdit ? <td /> : null}
              </tr>
              <tr className="ika-border-t-2 ika-border-brand-navy/20">
                <td colSpan={canEdit ? 5 : 4} className="ika-px-3 ika-py-3 ika-text-right ika-text-brand-navy">
                  Total TTC
                </td>
                <td className="ika-px-3 ika-py-3 ika-text-right ika-text-lg ika-tabular-nums ika-text-brand-navy">
                  {formatCurrency(totalTTC, currency)}
                </td>
                {canEdit ? <td /> : null}
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="ika-mt-3 ika-text-xs ika-text-slate-400">
          Les modifications ne sont pas enregistrées dans SharePoint : utilisez
          l&apos;export pour conserver le bordereau.
        </p>
      </section>
    </div>
  );
};
