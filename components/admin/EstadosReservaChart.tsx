"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { AdminStats } from "@/models/types";

interface Props {
  estados: AdminStats["estados"];
}

const COLOR: Record<string, string> = {
  confirmada: "#3ba054",
  pendiente: "#ed6b53",
  realizada: "#5271ff",
  cancelada: "#d13264",
};

const LABEL: Record<string, string> = {
  confirmada: "Confirmadas",
  pendiente: "Pendientes",
  realizada: "Realizadas",
  cancelada: "Canceladas",
};

export default function EstadosReservaChart({ estados }: Props) {
  const total = estados.reduce((acc, e) => acc + Number(e.total), 0);
  const data = estados.map((e) => ({
    name: LABEL[e.estado] ?? e.estado,
    value: Number(e.total),
    color: COLOR[e.estado] ?? "#9ca3af",
    pct: total > 0 ? Math.round((Number(e.total) / total) * 100) : 0,
  }));

  return (
    <div className="bg-card border border-card-borde rounded-2xl shadow-sm p-5">
      <h2 className="font-black text-sm text-texto uppercase tracking-tight mb-4">
        📊 Reservas por estado
      </h2>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
        {data.map((d) => (
          <span
            key={d.name}
            className="flex items-center gap-1.5 text-xs text-gris"
          >
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: d.color }}
            />
            {d.name} ({d.pct}%)
          </span>
        ))}
      </div>

      {/* Donut */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [
                `${value} (${data.find((d) => d.name === name)?.pct}%)`,
                name,
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "0.5px solid var(--color-card-borde)",
                background: "var(--color-card)",
                color: "var(--color-texto)",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Total en el centro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-texto">{total}</span>
          <span className="text-[10px] text-gris uppercase tracking-widest">
            total
          </span>
        </div>
      </div>
    </div>
  );
}
