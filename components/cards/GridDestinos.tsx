"use client";

import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/lib/api";
import { ViajeGrid } from "@/models/types";
import Destino from "./Destino";
import DestinoSkeleton from "./DestinoSkeleton";
import { FaPlane, FaRedo } from "react-icons/fa";

export default function GridDestinos() {
  const [viajes, setViajes] = useState<ViajeGrid[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const obtenerViajes = useCallback(async () => {
    setError(false);
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/viajes`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setViajes(data.resultado || []);
    } catch {
      setError(true);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { obtenerViajes(); }, [obtenerViajes]);

  return (
    <section className="w-full flex flex-col items-center py-12">
      <div className="text-center mb-10 px-4">
        <p className="text-[10px] font-black text-primario uppercase tracking-[0.3em] mb-2">
          Horizonte Azul
        </p>
        <h2 className="text-3xl md:text-5xl font-black text-titulo-resaltado uppercase tracking-tighter">
          Próximos destinos
        </h2>
        <div className="h-1 w-16 bg-primario mx-auto mt-3 rounded-full" />
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-4 py-20 text-gris">
          <FaPlane size={32} className="opacity-20" />
          <p className="font-bold text-xs uppercase tracking-widest">
            Error al cargar destinos
          </p>
          <button
            onClick={obtenerViajes}
            className="flex items-center gap-2 bg-primario text-blanco-fijo px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-secundario transition-all"
          >
            <FaRedo size={10} /> Reintentar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl px-6">
          {cargando
            ? Array.from({ length: 8 }).map((_ , i) => <DestinoSkeleton key={i} />)
            : viajes.length > 0
              ? viajes.map(v => <Destino key={v.id} viaje={v} />)
              : (
                <div className="col-span-full flex flex-col items-center py-20 gap-3 text-gris">
                  <FaPlane size={32} className="opacity-20" />
                  <p className="font-bold text-xs uppercase tracking-widest">
                    No hay destinos disponibles
                  </p>
                </div>
              )
          }
        </div>
      )}
    </section>
  );
}