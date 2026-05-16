"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminStats } from "@/models/types";

interface Props {
  datos: AdminStats["reservas_mes_historico"];
}

export default function ReservasMesChart({ datos }: Props) {
  return (
    <div className="bg-card border border-card-borde rounded-2xl shadow-sm p-5">
      <h2 className="font-black text-sm text-texto uppercase tracking-tight mb-4">
        📈 Reservas por mes
      </h2>
      <div className="w-full overflow-hidden">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={datos}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
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
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "0.5px solid var(--color-card-borde)",
                background: "var(--color-card)",
                color: "var(--color-texto)",
                fontSize: "12px",
              }}
              formatter={(v: any) => [v, "Reservas"]}
            />
            <Bar
              dataKey="total"
              fill="#5271ff"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
