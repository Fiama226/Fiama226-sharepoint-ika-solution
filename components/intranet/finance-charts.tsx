"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", ca: 0.38, objectif: 0.42 },
  { month: "Fév", ca: 0.41, objectif: 0.42 },
  { month: "Mar", ca: 0.44, objectif: 0.43 },
  { month: "Avr", ca: 0.39, objectif: 0.43 },
  { month: "Mai", ca: 0.46, objectif: 0.44 },
  { month: "Juin", ca: 0.49, objectif: 0.45 },
  { month: "Juil", ca: 0.43, objectif: 0.45 },
  { month: "Août", ca: 0.31, objectif: 0.4 },
  { month: "Sep", ca: 0.47, objectif: 0.46 },
  { month: "Oct", ca: 0.52, objectif: 0.47 },
  { month: "Nov", ca: 0.55, objectif: 0.48 },
  { month: "Déc", ca: 0.58, objectif: 0.5 },
];

const chargesData = [
  { name: "Achats", value: 412, color: "#0a2540" },
  { name: "Sous-traitance", value: 318, color: "#173b66" },
  { name: "Loyers", value: 186, color: "#06b6d4" },
  { name: "Déplacements", value: 142, color: "#0891b2" },
  { name: "Marketing", value: 128, color: "#0e7490" },
  { name: "Autres", value: 84, color: "#155e75" },
];

const topClients = [
  { name: "Vertex Financial", value: 4.2 },
  { name: "Apex Manufacturing", value: 4.8 },
  { name: "Northwind Solutions", value: 3.9 },
  { name: "BlueRock Systems", value: 3.4 },
  { name: "Horizon Healthcare", value: 2.7 },
];

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-brand-line bg-white p-5 shadow-sm">
      <div className="mb-1">
        <h3 className="text-sm font-semibold text-brand-navy">{title}</h3>
        {subtitle ? (
          <p className="text-xs text-brand-muted">{subtitle}</p>
        ) : null}
      </div>
      <div className="mt-2 flex-1">{children}</div>
    </div>
  );
}

function TooltipBox({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-brand-line bg-white px-3 py-2 text-xs shadow-md">
      {label ? <p className="mb-1 font-semibold text-brand-ink">{label}</p> : null}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-1.5 text-brand-muted">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name} : <span className="font-medium text-brand-ink">{p.value} {unit}</span>
        </p>
      ))}
    </div>
  );
}

export function FinanceCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <ChartCard
          title="Évolution du chiffre d'affaires (2026)"
          subtitle="CA réalisé vs objectif — en M€"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
              <Tooltip content={<TooltipBox unit="M€" />} />
              <Area
                type="monotone"
                dataKey="ca"
                name="CA réalisé"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fill="url(#caGrad)"
              />
              <Area
                type="monotone"
                dataKey="objectif"
                name="Objectif"
                stroke="#0a2540"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="lg:col-span-5">
        <ChartCard title="Répartition des charges (YTD)" subtitle="En milliers d'euros — par nature">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chargesData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {chargesData.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Pie>
              <Tooltip content={<TooltipBox unit="k€" />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: 11, color: "#475569" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="lg:col-span-12">
        <ChartCard title="Top 5 comptes clients par revenu (YTD)" subtitle="En M€ — contribution au CA">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topClients} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "#475569" }}
                axisLine={false}
                tickLine={false}
                width={150}
              />
              <Tooltip content={<TooltipBox unit="M€" />} cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="value" name="Revenu" radius={[0, 6, 6, 0]} barSize={18}>
                {topClients.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? "#0a2540" : "#06b6d4"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
