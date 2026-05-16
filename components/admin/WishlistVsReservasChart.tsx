"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AdminStats } from "@/models/types";

interface Props {
  destinos: AdminStats["top_destinos"];
  wishlist: AdminStats["top_wishlist"];
}

export default function WishlistVsReservasChart({ destinos, wishlist }: Props) {
  // Cruzar datos por iataDestino
  const data = destinos.slice(0, 5).map((d) => {
    const w = wishlist.find((w) => w.iataDestino === d.iataDestino);
    return {
      name: d.iataDestino,
      reservas: Number(d.total_reservas),
      favoritos: Number(w?.total_guardados ?? 0),
    };
  });

  return (
    <div className="bg-card border border-card-borde rounded-2xl shadow-sm p-5">
      <h2 className="font-black text-sm text-texto uppercase tracking-tight mb-4">
        ❤️ Favoritos vs reservados
      </h2>
      <div className="w-full overflow-hidden">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-borde-suave)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
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
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "var(--color-gris)" }}
              iconSize={10}
              iconType="square"
            />
            <Bar
              dataKey="favoritos"
              name="Favoritos"
              fill="#d13264"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="reservas"
              name="Reservas"
              fill="#5271ff"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
