"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

export default function ServiciosViaje({ viajeId }: { viajeId: number | string }) {
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const res = await fetch(`${API_URL}/viaje-servicio/${viajeId}`);
        const data = await res.json();
        if (data.ok) setServicios(data.resultado);
      } catch (error) {
        console.error("Error cargando servicios:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarServicios();
  }, [viajeId]);

  if (loading || servicios.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-black text-primario uppercase tracking-[0.3em] ml-1">
        Servicios del vuelo
      </p>
      <div className="flex flex-wrap gap-2">
        {servicios.map((s) => {
          return (
            <div 
              key={s.relacion_id} 
              className="bg-fondo border border-gris-borde-suave px-4 py-2 rounded-xl shadow-sm transition-all hover:border-primario/30"
            >
              <div className="flex flex-col text-center">
                <span className="text-[10px] font-bold text-texto uppercase leading-tight">
                  {s.nombre}
                </span>
                {s.valor && (
                  <span className="text-[9px] font-medium text-texto/50 uppercase mt-0.5">
                    {s.valor}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}