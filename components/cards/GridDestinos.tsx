"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { API_URL } from "@/lib/api";
import { ViajeGrid } from "@/models/types";
import Destino from "@/components/cards/Destino";
import DestinoSkeleton from "@/components/cards/DestinoSkeleton";
import FiltroDestinos from "@/components/cards/FiltroDestinos";
import { FaPlane, FaRedo, FaSearchMinus } from "react-icons/fa";

export default function GridDestinos() {
  const [viajes, setViajes] = useState<ViajeGrid[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Filtro
  const [filtroTexto, setFiltroTexto] = useState("");
  const [origenSeleccionado, setOrigenSeleccionado] = useState("");
  const [destinoSeleccionado, setDestinoSeleccionado] = useState("");

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

  useEffect(() => {
    obtenerViajes();
  }, [obtenerViajes]);

  // 1. Extraer opciones únicas para los dropdowns de la data real
  const opcionesOrigen = useMemo(
    () => Array.from(new Set(viajes.map((v) => v.paisOrigen))).sort(),
    [viajes],
  );

  const opcionesDestino = useMemo(
    () => Array.from(new Set(viajes.map((v) => v.paisDestino))).sort(),
    [viajes],
  );

  // 2. Lógica de filtrado combinada
  const viajesFiltrados = useMemo(() => {
    return viajes.filter((v) => {
      const search = filtroTexto.toLowerCase();
      const coincideTexto =
        v.paisOrigen.toLowerCase().includes(search) ||
        v.paisDestino.toLowerCase().includes(search) ||
        v.aeropuertoOrigen.toLowerCase().includes(search) ||
        v.aeropuertoDestino.toLowerCase().includes(search) ||
        v.iataOrigen?.toLowerCase().includes(search) ||
        v.iataDestino?.toLowerCase().includes(search);

      const coincideOrigen =
        origenSeleccionado === "" || v.paisOrigen === origenSeleccionado;
      const coincideDestino =
        destinoSeleccionado === "" || v.paisDestino === destinoSeleccionado;

      return coincideTexto && coincideOrigen && coincideDestino;
    });
  }, [viajes, filtroTexto, origenSeleccionado, destinoSeleccionado]);

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

      {!error && !cargando && (
        <FiltroDestinos
          filtroTexto={filtroTexto}
          setFiltroTexto={setFiltroTexto}
          origenSeleccionado={origenSeleccionado}
          setOrigenSeleccionado={setOrigenSeleccionado}
          destinoSeleccionado={destinoSeleccionado}
          setDestinoSeleccionado={setDestinoSeleccionado}
          opcionesOrigen={opcionesOrigen}
          opcionesDestino={opcionesDestino}
        />
      )}
      {error ? (
        <div className="flex flex-col items-center gap-4 py-20 text-gris">
          <FaPlane size={32} className="opacity-20" />
          <p className="font-bold text-xs uppercase tracking-widest">
            Error al cargar destinos
          </p>
          <button
            onClick={obtenerViajes}
            className="flex items-center gap-2 bg-primario text-blanco-fijo px-5 py-2.5 rounded-xl font-black text-xs uppercase hover:bg-secundario transition-all"
          >
            <FaRedo size={10} /> Reintentar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl px-6">
          {cargando ? (
            Array.from({ length: 8 }).map((_, i) => <DestinoSkeleton key={i} />)
          ) : viajesFiltrados.length > 0 ? (
            viajesFiltrados.map((v) => <Destino key={v.id} viaje={v} />)
          ) : (
            <div className="col-span-full flex flex-col items-center py-20 gap-3 text-gris">
              <FaSearchMinus size={32} className="opacity-20" />
              <p className="font-bold text-xs uppercase tracking-widest">
                No hay destinos que coincidan
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}