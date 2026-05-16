"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { AdminStats } from "@/models/types";

interface Props {
  datos: AdminStats["ingresos_mes_historico"];
}

export default function IngresosMesChart({ datos }: Props) {
  return (
    <div className="bg-card border border-card-borde rounded-2xl shadow-sm p-5">
      <h2 className="font-black text-sm text-texto uppercase tracking-tight mb-4">
        📈 Ingresos últimos 6 meses
      </h2>
      <div className="w-full overflow-hidden">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart
            data={datos}
            margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="grad_ingresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3ba054" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3ba054" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-borde-suave)"
              vertical={false}
            />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 11, fill: "var(--color-gris)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--color-gris)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "0.5px solid var(--color-card-borde)",
                background: "var(--color-card)",
                color: "var(--color-texto)",
                fontSize: "12px",
              }}
              formatter={(v: any) => [
                v.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                }),
                "Ingresos",
              ]}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3ba054"
              strokeWidth={2}
              fill="url(#grad_ingresos)"
              dot={{ fill: "#3ba054", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
