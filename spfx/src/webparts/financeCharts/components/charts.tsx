import * as React from "react";

import { cn, formatCurrency } from "../../../common/utils/spUtils";

export interface IChartPoint {
  label: string;
  value: number;
}

const PALETTE = [
  "#0A2540",
  "#06B6D4",
  "#0891B2",
  "#16A34A",
  "#D97706",
  "#E63946",
  "#7C3AED",
  "#475569",
];

export function colorAt(index: number): string {
  return PALETTE[index % PALETTE.length];
}

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / magnitude) * magnitude;
}

export const AreaChart: React.FC<{
  points: IChartPoint[];
  currency: string;
  height?: number;
}> = (props) => {
  const { points, currency } = props;
  const height = props.height || 220;
  const width = 600;
  const padX = 8;
  const padTop = 12;
  const padBottom = 28;

  if (points.length === 0) return null;

  const max = niceMax(Math.max.apply(null, points.map((p) => p.value)));
  const step =
    points.length > 1 ? (width - padX * 2) / (points.length - 1) : 0;
  const plotHeight = height - padTop - padBottom;

  const coords = points.map((point, index) => {
    const x = padX + index * step;
    const y = padTop + plotHeight * (1 - point.value / max);
    return { x, y, point };
  });

  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(" ");

  const area =
    `${line} L${coords[coords.length - 1].x.toFixed(1)},${(
      height - padBottom
    ).toFixed(1)} L${coords[0].x.toFixed(1)},${(height - padBottom).toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="ika-h-full ika-w-full"
      role="img"
      aria-label={`Évolution : ${points
        .map((p) => `${p.label} ${formatCurrency(p.value, currency)}`)
        .join(", ")}`}
    >
      <defs>
        <linearGradient id="ikaAreaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = padTop + plotHeight * ratio;
        return (
          <line
            key={ratio}
            x1={padX}
            y1={y}
            x2={width - padX}
            y2={y}
            stroke="#E2E8F0"
            strokeWidth={1}
          />
        );
      })}

      <path d={area} fill="url(#ikaAreaFill)" />
      <path d={line} fill="none" stroke="#06B6D4" strokeWidth={2.5} />

      {coords.map((c) => (
        <circle
          key={c.point.label}
          cx={c.x}
          cy={c.y}
          r={3.5}
          fill="#fff"
          stroke="#0891B2"
          strokeWidth={2}
        >
          <title>{`${c.point.label} — ${formatCurrency(c.point.value, currency)}`}</title>
        </circle>
      ))}

      {coords.map((c, index) => {
        if (points.length > 8 && index % 2 !== 0) return null;
        return (
          <text
            key={`label-${c.point.label}`}
            x={c.x}
            y={height - 8}
            textAnchor="middle"
            fontSize={11}
            fill="#94A3B8"
          >
            {c.point.label}
          </text>
        );
      })}
    </svg>
  );
};

export const DonutChart: React.FC<{
  points: IChartPoint[];
  currency: string;
}> = (props) => {
  const { points, currency } = props;
  const size = 200;
  const radius = 70;
  const stroke = 28;
  const centre = size / 2;
  const circumference = 2 * Math.PI * radius;

  const total = points.reduce((sum, p) => sum + p.value, 0);
  if (total <= 0) return null;

  let offset = 0;

  return (
    <div className="ika-flex ika-flex-wrap ika-items-center ika-justify-center ika-gap-6">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="ika-h-44 ika-w-44"
        role="img"
        aria-label={`Répartition : ${points
          .map(
            (p) =>
              `${p.label} ${Math.round((p.value / total) * 100)} pour cent`
          )
          .join(", ")}`}
      >
        <g transform={`rotate(-90 ${centre} ${centre})`}>
          {points.map((point, index) => {
            const fraction = point.value / total;
            const dash = circumference * fraction;
            const element = (
              <circle
                key={point.label}
                cx={centre}
                cy={centre}
                r={radius}
                fill="none"
                stroke={colorAt(index)}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
              >
                <title>{`${point.label} — ${formatCurrency(point.value, currency)}`}</title>
              </circle>
            );
            offset += dash;
            return element;
          })}
        </g>
        <text
          x={centre}
          y={centre - 4}
          textAnchor="middle"
          fontSize={13}
          fill="#94A3B8"
        >
          Total
        </text>
        <text
          x={centre}
          y={centre + 14}
          textAnchor="middle"
          fontSize={15}
          fontWeight="700"
          fill="#0A2540"
        >
          {formatCurrency(total, currency)}
        </text>
      </svg>

      <ul className="ika-space-y-1.5">
        {points.map((point, index) => (
          <li key={point.label} className="ika-flex ika-items-center ika-gap-2">
            <span
              aria-hidden="true"
              className="ika-h-2.5 ika-w-2.5 ika-shrink-0 ika-rounded-full"
              style={{ backgroundColor: colorAt(index) }}
            />
            <span className="ika-text-xs ika-text-slate-600">
              {point.label}
            </span>
            <span className="ika-ml-auto ika-text-xs ika-font-bold ika-tabular-nums ika-text-brand-navy">
              {Math.round((point.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const BarList: React.FC<{
  points: IChartPoint[];
  currency: string;
}> = (props) => {
  const { points, currency } = props;
  if (points.length === 0) return null;

  const max = Math.max.apply(null, points.map((p) => p.value));

  return (
    <ul className="ika-space-y-3">
      {points.map((point, index) => {
        const percent = max > 0 ? (point.value / max) * 100 : 0;
        return (
          <li key={point.label}>
            <div className="ika-mb-1 ika-flex ika-items-center ika-justify-between ika-gap-3 ika-text-xs">
              <span className="ika-truncate ika-text-slate-600">
                {point.label}
              </span>
              <span className="ika-shrink-0 ika-font-bold ika-tabular-nums ika-text-brand-navy">
                {formatCurrency(point.value, currency)}
              </span>
            </div>
            <div
              className="ika-h-2 ika-w-full ika-overflow-hidden ika-rounded-full ika-bg-slate-100"
              role="progressbar"
              aria-valuenow={Math.round(percent)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={point.label}
            >
              <div
                className={cn("ika-h-full ika-rounded-full")}
                style={{
                  width: `${percent}%`,
                  backgroundColor: colorAt(index),
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};
