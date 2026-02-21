"use client";

import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/lib/api";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaClock, FaPlane } from "react-icons/fa";
import Link from "next/link";
import { Viaje } from "@/models/types";

export default function GestionViajes() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const fetchViajes = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/viajes`);
      const data = await res.json();
      setViajes(data.resultado || data);
    } catch (error) {
      console.error("Error al cargar viajes:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchViajes();
  }, [fetchViajes]);

  const eliminarViaje = async (id: number | undefined) => {
    if (!id || !confirm("¿Estás seguro de que quieres eliminar esta ruta?")) return;
    try {
      const res = await fetch(`${API_URL}/viajes/${id}`, { method: "DELETE" });
      if (res.ok) fetchViajes();
    } catch (error) {
      alert("Error al eliminar el viaje");
    }
  };

  const viajesFiltrados = viajes.filter(v => 
    v.aeropuertoOrigen.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.aeropuertoDestino?.toLowerCase().includes(busqueda.toLowerCase()) 
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-in fade-in duration-500 bg-fondo">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-titulo-resaltado uppercase tracking-tighter">
            Panel de Vuelos
          </h1>
          <p className="text-[10px] md:text-xs font-bold text-texto/40 tracking-widest uppercase mt-1">
            {viajesFiltrados.length} vuelos activos
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative group w-full sm:w-auto">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-texto/40 group-focus-within:text-primario transition-colors" />
            <input 
              type="text"
              placeholder="Buscar Origen/Destino..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-fondo border border-gris-borde-suave rounded-xl focus:ring-2 focus:ring-primario/20 focus:border-primario outline-none text-sm transition-all shadow-sm text-titulo-resaltado font-bold"
            />
          </div>
          <Link 
            href="/dashboard/viajes/nuevo"
            className="w-full sm:w-auto bg-secundario text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primario transition-all shadow-lg flex items-center justify-center gap-2 italic"
          >
            <FaPlus /> Nuevo Vuelo
          </Link>
        </div>
      </header>

      <div className="bg-fondo rounded-[2rem] shadow-xl border border-gris-borde-suave overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[850px]">
            <thead>
              <tr className="bg-gris-clarito text-titulo-resaltado/60 text-[10px] uppercase tracking-[0.25em] border-b-2 border-gris-borde-suave font-black">
                <th className="px-4 py-5 text-center">Origen</th>
                <th className="w-16 py-5"></th> 
                <th className="px-4 py-5 text-center">Destino</th>
                <th className="px-4 py-5 text-center">Imagen a mostrar</th>
                <th className="px-4 py-5 text-center">Precio</th>
                <th className="px-4 py-5 text-center w-44">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-borde-suave">
              {cargando ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-texto/20 font-bold uppercase tracking-widest text-xs">
                    Cargando vuelos...
                  </td>
                </tr>
              ) : (
                viajesFiltrados.map((viaje) => (
                  <tr key={viaje.id} className="hover:bg-gris-clarito/30 transition-all group">                  
                    <td className="px-4 py-5 text-center align-middle text-sm font-black text-titulo-resaltado uppercase">
                        {viaje.aeropuertoOrigen}
                        <div className="flex items-center justify-center gap-1 mt-1 text-texto/40 font-bold text-[10px]">
                          <FaClock size={9} /> {viaje.horaSalida?.slice(0, 5)}
                        </div>
                    </td>
                    <td className="py-5 text-center align-middle">
                        <FaPlane className="text-texto/10 group-hover:text-primario transition-colors" size={14} />
                    </td>
                    <td className="px-4 py-5 text-center align-middle text-sm font-black text-titulo-resaltado uppercase">
                        {viaje.aeropuertoDestino}
                        <div className="flex items-center justify-center gap-1 mt-1 text-primario/60 font-bold text-[10px]">
                          <FaClock size={9} /> {viaje.horaLlegada?.slice(0, 5)}
                        </div>
                    </td>
                    <td className="px-4 py-5 text-center align-middle">
                      <div className="relative inline-block w-16 h-10 rounded-lg overflow-hidden border border-gris-borde-suave shadow-sm bg-gris-clarito">
                        <img 
                          src={viaje.img || `/media/img/img-inicio-destino-por-defecto.png`} 
                          alt={viaje.aeropuertoDestino}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </td>
                    <td className="px-4 py-5 text-center align-middle font-black text-titulo-resaltado text-base">
                        {Number(viaje.precio).toLocaleString('es-ES')}€
                    </td>
                    <td className="px-4 py-5 text-center align-middle">
                      <div className="flex justify-center gap-2">
                        <Link 
                          href={`/dashboard/viajes/editar/${viaje.id}`} 
                          className="flex items-center justify-center w-10 h-10 bg-fondo text-texto/40 border border-gris-borde-suave rounded-xl hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-lg transition-all duration-300 active:scale-90"
                        >
                          <FaEdit size={14}/>
                        </Link>
                        <button 
                          onClick={() => eliminarViaje(viaje.id)} 
                          className="flex items-center justify-center w-10 h-10 bg-fondo text-texto/40 border border-gris-borde-suave rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg transition-all duration-300 active:scale-90"
                        >
                          <FaTrash size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}