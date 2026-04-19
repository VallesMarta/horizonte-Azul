"use client";

import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/lib/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlane,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdFlightTakeoff, MdFlightLand } from "react-icons/md";
import Link from "next/link";
import { Viaje } from "@/models/types";
import Cookies from "js-cookie";

export default function GestionViajes() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<number | null>(null);

  const token = Cookies.get("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchViajes = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/viajes`);
      const data = await res.json();
      setViajes(data.resultado || data);
    } catch {
      console.error("Error al cargar viajes");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchViajes();
  }, [fetchViajes]);

  const eliminarViaje = async (id: number) => {
    if (!confirm("¿Eliminar este destino y todos sus vuelos?")) return;
    setEliminando(id);
    try {
      const res = await fetch(`${API_URL}/viajes/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) fetchViajes();
    } catch {
      alert("Error al eliminar");
    } finally {
      setEliminando(null);
    }
  };

  const viajesFiltrados = viajes.filter(
    (v) =>
      v.aeropuertoOrigen?.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.aeropuertoDestino?.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.paisOrigen?.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.paisDestino?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-3xl font-black text-titulo-resaltado uppercase tracking-tighter">
            Destinos
          </h1>
          <p className="text-[10px] font-bold text-gris tracking-widest uppercase mt-0.5">
            {viajesFiltrados.length} destino
            {viajesFiltrados.length !== 1 ? "s" : ""} registrado
            {viajesFiltrados.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative group">
            <FaSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gris group-focus-within:text-primario transition-colors"
              size={12}
            />
            <input
              type="text"
              placeholder="Buscar destino..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-56 pl-9 pr-4 py-2.5 bg-bg border border-borde rounded-xl outline-none text-sm font-bold text-texto placeholder:text-placeholder focus:border-primario transition-colors"
            />
          </div>
          <Link
            href="/dashboard/viajes/nuevo"
            className="flex items-center gap-2 bg-secundario text-blanco-fijo px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primario transition-all shadow-md shadow-secundario/20"
          >
            <FaPlus size={10} /> Nuevo destino
          </Link>
        </div>
      </header>

      {/* GRID DE CARDS */}
      {cargando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-bg border border-borde rounded-3xl h-48 animate-pulse"
            />
          ))}
        </div>
      ) : viajesFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gris gap-3">
          <FaPlane size={32} className="opacity-20" />
          <p className="font-bold text-xs uppercase tracking-widest">
            Sin destinos
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {viajesFiltrados.map((viaje) => (
            <div
              key={viaje.id}
              className="group bg-bg border border-borde rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-primario/30 transition-all duration-300"
            >
              {/* IMAGEN */}
              <div className="relative h-36 overflow-hidden bg-gris-clarito/30">
                <img
                  src={
                    viaje.img || "/media/img/img-inicio-destino-por-defecto.png"
                  }
                  alt={viaje.aeropuertoDestino}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badge IATA */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {viaje.iataOrigen && (
                    <span className="bg-negro-fijo/60 text-blanco-fijo text-[10px] font-black p-2 rounded-lg tracking-widest backdrop-blur-sm">
                      {viaje.iataOrigen}
                    </span>
                  )}
                  <span className="bg-negro-fijo/30 text-blanco-fijo/60 text-[10px] font-black p-2 rounded-lg backdrop-blur-sm">
                    <FaArrowRightLong />
                  </span>
                  {viaje.iataDestino && (
                    <span className="bg-primario/80 text-blanco-fijo text-[10px] font-black p-2 rounded-lg tracking-widest backdrop-blur-sm">
                      {viaje.iataDestino}
                    </span>
                  )}
                </div>
              </div>

              {/* CONTENIDO */}
              <div className="p-5 space-y-4">
                {/* RUTA */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-gris uppercase tracking-widest flex items-center gap-1 mb-0.5">
                      <MdFlightTakeoff size={10} /> Origen
                    </p>
                    <p className="font-black text-titulo-resaltado uppercase text-sm truncate">
                      {viaje.aeropuertoOrigen}
                    </p>
                    <p className="text-[10px] text-gris font-bold truncate">
                      {viaje.paisOrigen}
                    </p>
                  </div>

                  <div className="shrink-0 bg-gris-clarito/30 border border-borde p-2 rounded-full">
                    <FaPlane size={12} className="text-primario" />
                  </div>

                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-[9px] font-black text-gris uppercase tracking-widest flex items-center justify-end gap-1 mb-0.5">
                      Destino <MdFlightLand size={10} />
                    </p>
                    <p className="font-black text-titulo-resaltado uppercase text-sm truncate">
                      {viaje.aeropuertoDestino}
                    </p>
                    <p className="text-[10px] text-gris font-bold truncate">
                      {viaje.paisDestino}
                    </p>
                  </div>
                </div>

                {/* ACCIONES */}
                <div className="flex gap-2 pt-1 border-t border-borde">
                  {/* Gestionar vuelos — acción principal */}
                  <Link
                    href={`/dashboard/viajes/${viaje.id}/vuelos`}
                    className="flex-1 flex items-center justify-center gap-2 bg-primario text-blanco-fijo py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-secundario transition-all shadow-sm"
                  >
                    <FaPlane size={10} /> Vuelos
                  </Link>

                  {/* Editar */}
                  <Link
                    href={`/dashboard/viajes/editar/${viaje.id}`}
                    className="flex items-center justify-center w-10 h-10 bg-bg border border-borde rounded-xl text-gris hover:bg-naranja hover:text-blanco-fijo hover:border-naranja transition-all active:scale-90"
                  >
                    <FaEdit size={12} />
                  </Link>

                  {/* Eliminar */}
                  <button
                    onClick={() => eliminarViaje(viaje.id!)}
                    disabled={eliminando === viaje.id}
                    className="flex items-center justify-center w-10 h-10 bg-bg border border-borde rounded-xl text-gris hover:bg-rojo hover:text-blanco-fijo hover:border-rojo transition-all active:scale-90 disabled:opacity-40"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
