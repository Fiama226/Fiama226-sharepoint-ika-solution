import * as React from "react";

import { IFinanceChartsProps } from "./IFinanceChartsProps";
import { IFinanceData } from "../../../models/IIkaModels";
import { AreaChart, BarList, DonutChart, IChartPoint } from "./charts";
import { formatCurrency } from "../../../common/utils/spUtils";

const MONTHS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

function seriesPoints(rows: IFinanceData[], type: string): IChartPoint[] {
  return rows
    .filter((row) => row.SeriesType === type)
    .sort((a, b) => {
      const ma = a.FiscalMonth || 0;
      const mb = b.FiscalMonth || 0;
      if (ma !== mb) return ma - mb;
      return (a.SortOrder || 0) - (b.SortOrder || 0);
    })
    .map((row) => ({
      label: row.FiscalMonth ? MONTHS[row.FiscalMonth - 1] : row.Title,
      value: row.Amount,
    }));
}

function totalOf(rows: IFinanceData[], type: string): number {
  return rows
    .filter((row) => row.SeriesType === type)
    .reduce((sum, row) => sum + row.Amount, 0);
}

const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = (props) => (
  <div
    className={
      props.className ||
      "ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-p-5 ika-shadow-sm"
    }
  >
    <h3 className="ika-mb-4 ika-text-sm ika-font-bold ika-uppercase ika-tracking-wider ika-text-slate-500">
      {props.title}
    </h3>
    {props.children}
  </div>
);

export const FinanceCharts: React.FC<IFinanceChartsProps> = (props) => {
  const {
    title,
    description,
    data,
    fiscalYear,
    availableYears,
    loading,
    error,
    onYearChange,
  } = props;

  const currency = data.length > 0 ? data[0].CurrencyCode : "XOF";

  const revenue = seriesPoints(data, "Chiffre d'affaires");
  const charges = seriesPoints(data, "Charges");
  const treasury = seriesPoints(data, "Trésorerie");

  const totalRevenue = totalOf(data, "Chiffre d'affaires");
  const totalCharges = totalOf(data, "Charges");
  const result = totalRevenue - totalCharges;
  const margin =
    totalRevenue > 0 ? Math.round((result / totalRevenue) * 100) : 0;

  const chargeBreakdown: IChartPoint[] = charges.length > 0 ? charges : [];

  if (loading) {
    return (
      <div className="ika-root">
        <section className="ika-animate-pulse ika-space-y-4" aria-hidden="true">
          <div className="ika-h-8 ika-w-64 ika-rounded ika-bg-slate-200" />
          <div className="ika-grid ika-gap-4 md:ika-grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="ika-h-24 ika-rounded-2xl ika-bg-slate-100" />
            ))}
          </div>
          <div className="ika-h-64 ika-rounded-2xl ika-bg-slate-100" />
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ika-root">
        <div
          role="alert"
          className="ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="ika-root">
        <div className="ika-rounded-2xl ika-border ika-border-dashed ika-border-slate-300 ika-bg-white ika-p-10 ika-text-center">
          <p className="ika-text-sm ika-font-medium ika-text-brand-navy">
            Aucune donnée financière
          </p>
          <p className="ika-mt-1 ika-text-sm ika-text-slate-500">
            Renseignez la liste « DonneesFinancieres » du site Comptabilité.
          </p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: "Chiffre d'affaires",
      value: formatCurrency(totalRevenue, currency),
      tone: "ika-text-brand-navy",
    },
    {
      label: "Charges",
      value: formatCurrency(totalCharges, currency),
      tone: "ika-text-brand-warning",
    },
    {
      label: "Résultat",
      value: formatCurrency(result, currency),
      tone:
        result >= 0 ? "ika-text-brand-success" : "ika-text-brand-danger",
    },
    {
      label: "Marge",
      value: `${margin}%`,
      tone: margin >= 0 ? "ika-text-brand-success" : "ika-text-brand-danger",
    },
  ];

  return (
    <div className="ika-root">
      <section aria-labelledby="ika-finance-title">
        <header className="ika-mb-6 ika-flex ika-flex-wrap ika-items-end ika-justify-between ika-gap-4">
          <div>
            <h2
              id="ika-finance-title"
              className="ika-text-xl ika-font-extrabold ika-tracking-tight ika-text-brand-navy"
            >
              {title}
            </h2>
            {description ? (
              <p className="ika-mt-1 ika-text-sm ika-text-slate-500">
                {description}
              </p>
            ) : null}
          </div>

          {availableYears.length > 1 ? (
            <div>
              <label htmlFor="ika-finance-year" className="ika-sr-only">
                Exercice
              </label>
              <select
                id="ika-finance-year"
                value={fiscalYear}
                onChange={(event) => onYearChange(Number(event.target.value))}
                className="ika-cursor-pointer ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-py-2 ika-pl-3 ika-pr-8 ika-text-sm ika-outline-none focus:ika-border-brand-cyan"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    Exercice {year}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </header>

        <dl className="ika-mb-6 ika-grid ika-gap-4 sm:ika-grid-cols-2 lg:ika-grid-cols-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-p-5"
            >
              <dt className="ika-text-[11px] ika-font-semibold ika-uppercase ika-tracking-wider ika-text-slate-400">
                {kpi.label}
              </dt>
              <dd
                className={`ika-mt-1 ika-text-2xl ika-font-extrabold ika-tabular-nums ${kpi.tone}`}
              >
                {kpi.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="ika-grid ika-gap-4 lg:ika-grid-cols-3">
          {revenue.length > 0 ? (
            <div className="lg:ika-col-span-2">
              <Card title="Évolution du chiffre d'affaires">
                <div className="ika-h-56">
                  <AreaChart points={revenue} currency={currency} />
                </div>
              </Card>
            </div>
          ) : null}

          {chargeBreakdown.length > 0 ? (
            <Card title="Répartition des charges">
              <DonutChart points={chargeBreakdown} currency={currency} />
            </Card>
          ) : null}

          {treasury.length > 0 ? (
            <div className="lg:ika-col-span-3">
              <Card title="Trésorerie">
                <BarList points={treasury} currency={currency} />
              </Card>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};
