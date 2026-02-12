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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-secundario uppercase tracking-tighter">Panel de Vuelos</h1>
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">Total: {viajesFiltrados.length} vuelos activos</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primario transition-colors" />
            <input 
              type="text"
              placeholder="Buscar ciudad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primario/20 focus:border-primario outline-none w-64 text-sm transition-all shadow-sm"
            />
          </div>
          <Link 
            href="/dashboard/viajes/nuevo"
            className="bg-secundario text-white px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primario transition-all shadow-lg flex items-center gap-2"
          >
            <FaPlus /> Nuevo Vuelo
          </Link>
        </div>
      </div>

      {/* Tabla Simétrica y Compacta */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-secundario/5 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[850px]">
            <thead>
              <tr className="bg-gray-50/50 text-secundario/40 text-[10px] uppercase tracking-[0.25em] border-b border-gray-100 font-black">
                <th className="px-4 py-4 text-center">Origen</th>
                <th className="w-16 py-4"></th> 
                <th className="px-4 py-4 text-center">Destino</th>
                <th className="px-4 py-4 text-center">Visual</th>
                <th className="px-4 py-4 text-center">Precio</th>
                <th className="px-4 py-4 text-center w-44">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {viajesFiltrados.map((viaje) => (
                <tr key={viaje.id} className="hover:bg-gray-50/40 transition-all group">                  
                  {/* ORIGEN */}
                  <td className="px-4 py-5 text-center align-middle">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-black text-gray-300 uppercase mb-0.5">Salida</span>
                      <span className="font-black text-secundario text-sm uppercase tracking-tight">{viaje.aeropuertoOrigen}</span>
                      <div className="flex items-center justify-center gap-1 mt-1 text-gray-400">
                        <FaClock size={9} />
                        <span className="text-[10px] font-bold">{viaje.horaSalida.slice(0, 5)}</span>
                      </div>
                    </div>
                  </td>
                  {/* TRAYECTO */}
                  <td className="py-5 text-center align-middle">
                    <div className="flex items-center justify-center">
                       <FaPlane className="text-gray-200 group-hover:text-primario transition-colors duration-500 rotate-90 md:rotate-0" size={14} />
                    </div>
                  </td>
                  {/* DESTINO */}
                  <td className="px-4 py-5 text-center align-middle">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-black text-primario uppercase mb-0.5">Llegada</span>
                      <span className="font-black text-secundario text-sm uppercase tracking-tight">{viaje.aeropuertoDestino}</span>
                      <div className="flex items-center justify-center gap-1 mt-1 text-primario/60">
                        <FaClock size={9} />
                        <span className="text-[10px] font-bold">{viaje.horaLlegada.slice(0, 5)}</span>
                      </div>
                    </div>
                  </td>
                  {/* IMAGEN */}
                  <td className="px-4 py-5 text-center align-middle">
                    <div className="relative inline-block w-20 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                      <img 
                        src={viaje.img || "/media/img/default.png"} 
                        alt="Destino" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </td>
                  {/* PRECIO */}
                  <td className="px-4 py-5 text-center align-middle">
                    <div className="flex flex-col items-center">                      
                      <span className="font-black text-secundario text-base tracking-tighter">
                        {Number(viaje.precio).toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                      </span>
                    </div>
                  </td>
                  {/* GESTIÓN (Iconos resaltados) */}
                  <td className="px-4 py-5 text-center align-middle">
                    <div className="flex justify-center gap-2.5">
                      <Link 
                        href={`/dashboard/viajes/editar/${viaje.id}`}
                        className="flex items-center justify-center w-10 h-10 bg-white text-gray-400 border border-gray-100 rounded-xl hover:bg-naranja hover:text-white hover:border-naranja hover:shadow-lg hover:shadow-primario/20 transition-all duration-300 active:scale-90"
                      >
                        <FaEdit size={14} />
                      </Link>
                      <button 
                        onClick={() => eliminarViaje(viaje.id)}
                        className="flex items-center justify-center w-10 h-10 bg-white text-gray-400 border border-gray-100 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 active:scale-90"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}