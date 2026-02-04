"use client";

import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/lib/api";
import { Viaje } from "@/models/types";
import Destino from "./Destino";

export default function GridDestinos() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const obtenerViajes = useCallback(async () => {
    setCargando(true);
    setError(false);
    
    try {
      const res = await fetch(`${API_URL}/viajes`);
      if (!res.ok) throw new Error("Error al obtener datos");
      
      const data = await res.json();
      
      // Normalización de la respuesta (por si viene en diferentes formatos)
      const datosLimpios = Array.isArray(data) 
        ? data 
        : (data.resultado || data.data || []);
      
      setViajes(datosLimpios);
    } catch (err) {
      console.error("Error en el fetch de viajes:", err);
      setError(true);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    obtenerViajes();
  }, [obtenerViajes]);

  // --- ESTADO: CARGANDO ---
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-primario border-t-transparent rounded-full animate-spin"></div>
        <p className="text-secundario font-medium animate-pulse">
          Buscando los mejores destinos...
        </p>
      </div>
    );
  }

  // --- ESTADO: ERROR ---
  if (error) {
    return (
      <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100 mx-4">
        <p className="text-red-600 font-bold text-lg">⚠️ No pudimos conectar con el servidor</p>
        <button 
          onClick={obtenerViajes} 
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full text-sm font-bold hover:bg-red-700 transition-colors shadow-lg active:scale-95"
        >
          Reintentar ahora
        </button>
      </div>
    );
  }

  // --- ESTADO: RENDER PRINCIPAL ---
  return (
    <section className="w-full flex flex-col items-center py-10">
      {/* Cabecera de la sección */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-black text-secundario uppercase tracking-tighter">
          Próximos Vuelos
        </h2>
        <div className="h-1.5 w-20 bg-primario mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Grid de resultados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl px-6 justify-items-center">
        {viajes.length > 0 ? (
          viajes.map((viaje) => (
            <Destino 
              key={viaje.id} 
              viaje={viaje} 
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 text-xl italic">
              Actualmente no hay rutas disponibles
            </p>
          </div>
        )}
      </div>
    </section>
  );
}