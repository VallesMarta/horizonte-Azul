"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { API_URL } from "@/lib/api";
import { ReservaDetallada, DetalleViajeCompleto } from "@/models/types"; 
import { 
  FaCalendarAlt, FaUsers, FaTicketAlt, 
  FaPlaneDeparture, FaPlaneArrival, FaClock, FaSuitcase, FaTrashAlt, FaChevronRight
} from "react-icons/fa";

export default function MisReservasPage() {
  const { usuarioLoggeado } = useAuth();
  const [reservas, setReservas] = useState<ReservaDetallada[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [detalleViaje, setDetalleViaje] = useState<DetalleViajeCompleto | null>(null);
  const [verModal, setVerModal] = useState(false);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);

  useEffect(() => {
    cargarReservas();
  }, [usuarioLoggeado]);

  const cargarReservas = () => {
    if (usuarioLoggeado?.id) {
      fetch(`${API_URL}/reservas/usuario/${usuarioLoggeado.id}`)
        .then((res) => res.json())
        .then((data) => {
          setReservas(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
        });
    }
  };

  const abrirDetalles = async (reservaId: number) => {
    setCargandoDetalles(true);
    setVerModal(true);
    setDetalleViaje(null); 
    try {
      const res = await fetch(`${API_URL}/reservas/detalles/${reservaId}`);
      const data = await res.json();
      setDetalleViaje(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargandoDetalles(false);
    }
  };

  const cancelarReserva = async (reservaId: number) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva? Esta acción es irreversible.")) return;
    try {
      const res = await fetch(`${API_URL}/reservas/cancelar/${reservaId}`, { method: 'PATCH' });
      if (res.ok) {
        alert("La reserva ha sido cancelada con éxito.");
        cargarReservas();
      }
    } catch (error) {
      alert("Error técnico al intentar cancelar.");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-secundario animate-pulse uppercase tracking-widest text-xs">Cargando sistema de reservas...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 py-10 min-h-screen bg-[#f1f5f9]">
      
      {/* HEADER */}
      <div className="mb-10 flex justify-between items-center border-b-2 border-primario/20 pb-6">
        <div>
          <h1 className="text-3xl font-black text-secundario uppercase tracking-tighter">Mis reservas</h1>
        </div>
      </div>

      {/* LISTADO DE RESERVAS */}
      <div className="grid gap-6">
        {reservas.map((reserva) => (
          <div key={reserva.reserva_id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-200 flex flex-col md:flex-row transition-all duration-300 hover:shadow-xl">
            
            {/* Imagen */}
            <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden">
              <img 
                src={reserva.img} 
                alt={reserva.paisDestino} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Cuerpo de la Reserva */}
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                      reserva.estado.toLowerCase() === 'confirmada' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {reserva.estado}
                    </span>
                    <span className="text-gray-400 text-[10px] font-bold">Ref: #{reserva.reserva_id}</span>
                  </div>
                  <h3 className="text-2xl font-black text-secundario uppercase italic leading-none flex items-center gap-3">
                    {reserva.paisOrigen} <FaChevronRight className="text-primario text-sm" /> {reserva.paisDestino}
                  </h3>
                  <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-wide">
                    Llegada a: {reserva.aeropuertoDestino}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-secundario leading-none">{reserva.total_pagado}€</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Importe Pagado</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8 mt-8 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm font-bold text-secundario uppercase italic">
                  <FaCalendarAlt className="text-primario" /> {new Date(reserva.fecSalida).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-secundario uppercase italic">
                  <FaUsers className="text-primario" /> {reserva.pasajeros} Pasajeros
                </div>

                <div className="ml-auto flex flex-col md:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                  {reserva.estado.toLowerCase() === 'confirmada' && (
                    <button 
                      onClick={() => cancelarReserva(reserva.reserva_id)} 
                      className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 text-[11px] font-black uppercase px-5 py-3 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                    >
                      <FaTrashAlt size={12} /> Cancelar Reserva
                    </button>
                  )}
                  <button 
                    onClick={() => abrirDetalles(reserva.reserva_id)}
                    className="bg-secundario text-white text-[11px] font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-primario transition-all shadow-md italic"
                  >
                    Ver Itinerario Completo
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETALLES */}
      {verModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-2 bg-secundario/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
            
            {/* Itinerario */}
            <div className="flex-1 p-12 sm:p-6 bg-gray-50/50 border-r border-gray-100">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-secundario uppercase italic">Detalles del Vuelo</h2>
              </div>
              
              {cargandoDetalles ? <p className="animate-pulse font-bold text-gray-300 uppercase text-sm">Cargando datos de vuelo...</p> : (
                <div className="space-y-12 relative">
                  <div className="absolute left-[23px] top-10 bottom-10 w-0.5 border-l-2 border-dashed border-primario/30"></div>
                  
                  <div className="relative flex gap-6">
                    <div className="z-10 bg-primario p-4 rounded-2xl text-white shadow-lg shadow-primario/20"><FaPlaneDeparture size={20}/></div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Punto de Salida</p>
                      <p className="text-lg font-black text-secundario uppercase">{detalleViaje?.origen}</p>
                      <p className="text-3xl font-black text-primario mt-1">{detalleViaje?.horaSalida}</p>
                    </div>
                  </div>

                  <div className="relative flex gap-6 items-center">
                    <div className="z-10 bg-white p-3 rounded-xl border-2 border-gray-100 text-gray-300 ml-2"><FaClock size={16}/></div>
                    <span className="bg-white text-secundario px-5 py-2 rounded-full text-[11px] font-black uppercase italic border-2 border-gray-100">
                      Duración estimada: {detalleViaje?.duracion}
                    </span>
                  </div>

                  <div className="relative flex gap-6">
                    <div className="z-10 bg-secundario p-4 rounded-2xl text-white shadow-lg"><FaPlaneArrival size={20}/></div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Destino Final</p>
                      <p className="text-lg font-black text-secundario uppercase">{detalleViaje?.destino}</p>
                      <p className="text-3xl font-black text-primario mt-1">{detalleViaje?.horaLlegada}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Servicios */}
            <div className="w-full md:w-[380px] p-12 sm:p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Servicios de Vuelo</h3>
                  <button onClick={() => setVerModal(false)} className="text-gray-300 hover:text-secundario font-black text-xl">✕</button>
                </div>
                
                <div className="space-y-4">
                  {detalleViaje?.servicios && detalleViaje.servicios.length > 0 ? (
                    detalleViaje.servicios.map((s, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <FaSuitcase className="text-primario" size={16} />
                        <div className="flex-1">
                          <p className="text-[11px] font-black text-secundario uppercase leading-none">{s.nombre}</p>
                          <p className="text-xs font-bold text-gray-400 mt-1">{s.valor}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                       <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Solo equipaje de mano incluido</p>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setVerModal(false)} 
                className="mt-12 w-full bg-secundario py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-primario transition-all shadow-xl italic"
              >
                Cerrar Detalles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
