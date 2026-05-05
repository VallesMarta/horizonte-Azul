"use client";

import { useEffect, useState } from "react";
import { AdminStats } from "@/models/types";
import StatCard from "@/components/admin/StatCard";
import TopDestinosTable from "@/components/admin/TopDestinosTable";
import TopWishlistTable from "@/components/admin/TopWishlistTable";
import EstadosReservaChart from "@/components/admin/EstadosReservaChart";
import UltimasReservas from "@/components/admin/UltimasReservas";
import StatsSkeleton from "@/components/admin/StatsSkeleton";

export default function DashboardPage() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setData(json.resultado);
        else setError(json.error);
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <StatsSkeleton />;

  if (error)
    return (
      <div className="bg-rojo/10 text-rojo border border-rojo/20 rounded-2xl p-6 text-center font-semibold">
        Error al cargar estadísticas: {error}
      </div>
    );

  if (!data) return null;

  const { totales, top_destinos, top_wishlist, estados, ultimas_reservas } =
    data;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-titulo-resaltado uppercase tracking-tighter">
          Panel de administración
        </h1>
        <p className="text-gris-claro text-sm mt-1">
          Resumen de actividad en tiempo real
        </p>
      </div>

      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Usuarios"
            value={totales.usuarios.toLocaleString("es-ES")}
            icon="👤"
            color="primario"
          />
          <StatCard
            label="Reservas totales"
            value={totales.reservas.toLocaleString("es-ES")}
            icon="🎫"
            color="verde"
          />
          <StatCard
            label="Ingresos"
            value={totales.ingresos.toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })}
            icon="💶"
            color="naranja"
          />
          <StatCard
            label="Reservas este mes"
            value={totales.reservas_mes.toLocaleString("es-ES")}
            icon="📅"
            color="morado"
            sub="mes actual"
          />
          <StatCard
            label="Vuelos activos"
            value={totales.vuelos_activos.toLocaleString("es-ES")}
            icon="✈️"
            color="azul"
            sub="próximos y operativos"
          />
        </div>

        {/* Tablas + gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <TopDestinosTable destinos={top_destinos} />
          <TopWishlistTable wishlist={top_wishlist} />
          <EstadosReservaChart estados={estados} />
        </div>

        {/* Últimas reservas */}
        <UltimasReservas reservas={ultimas_reservas} />
      </div>
    </>
  );
}
