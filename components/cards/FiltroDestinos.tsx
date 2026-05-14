"use client";

import { FaSearch, FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";

interface FiltroProps {
  filtroTexto: string;
  setFiltroTexto: (val: string) => void;
  origenSeleccionado: string;
  setOrigenSeleccionado: (val: string) => void;
  destinoSeleccionado: string;
  setDestinoSeleccionado: (val: string) => void;
  opcionesOrigen: string[];
  opcionesDestino: string[];
}

export default function FiltroDestinos({
  filtroTexto,
  setFiltroTexto,
  origenSeleccionado,
  setOrigenSeleccionado,
  destinoSeleccionado,
  setDestinoSeleccionado,
  opcionesOrigen,
  opcionesDestino,
}: FiltroProps) {
  return (
    <div className="w-full max-w-7xl px-6 mb-12">
      {/* Contenedor */}
      <div className=" p-5 rounded-[2.5rem] flex flex-col md:flex-row gap-4 transition-all duration-300">
        {/* BUSCADOR DE TEXTO */}
        <div className="flex-2 relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primario opacity-90 group-focus-within:scale-110 transition-transform" />
          <input
            type="text"
            placeholder="Buscar por país, ciudad..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-bg text-texto rounded-2xl text-sm font-bold placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primario/40 transition-all border border-transparent focus:border-primario/60 shadow-inner"
          />
        </div>

        {/* DROPDOWN ORIGEN */}
        <div className="flex-1 relative group">
          <FaPlaneDeparture className="absolute left-4 top-1/2 -translate-y-1/2 text-primario opacity-90" />
          <select
            value={origenSeleccionado}
            onChange={(e) => setOrigenSeleccionado(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-bg text-texto rounded-2xl text-sm font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-primario/40 transition-all border border-transparent focus:border-primario/60 cursor-pointer shadow-inner"
          >
            <option value="" className="bg-card">
              Cualquier origen
            </option>
            {opcionesOrigen.map((opt) => (
              <option key={opt} value={opt} className="bg-card">
                {opt}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primario opacity-50">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* DROPDOWN DESTINO */}
        <div className="flex-1 relative group">
          <FaPlaneArrival className="absolute left-4 top-1/2 -translate-y-1/2 text-primario opacity-90" />
          <select
            value={destinoSeleccionado}
            onChange={(e) => setDestinoSeleccionado(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-bg text-texto rounded-2xl text-sm font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-primario/40 transition-all border border-transparent focus:border-primario/60 cursor-pointer shadow-inner"
          >
            <option value="" className="bg-card">
              Cualquier destino
            </option>
            {opcionesDestino.map((opt) => (
              <option key={opt} value={opt} className="bg-card">
                {opt}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primario opacity-50">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
