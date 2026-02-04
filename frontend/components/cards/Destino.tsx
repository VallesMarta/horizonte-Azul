"use client";

import { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaArrowRight,
  FaClock,
  FaInfoCircle,
} from "react-icons/fa";
import CardDescripcion from "@/components/cards/CardDescripcion";
import FormReservar from "@/components/forms/FormReservar";
import { Viaje } from "@/models/types";
import useAuth from "@/hooks/useAuth";

interface DestinoProps {
  viaje: Viaje;
}

export default function Destino({ viaje }: DestinoProps) {
  const [mostrarModalReserva, setMostrarModalReserva] = useState(false);
  const [mostrarModalInfo, setMostrarModalInfo] = useState(false);
  const { usuarioLoggeado } = useAuth();

  // BLOQUEAR SCROLL DEL BODY
  useEffect(() => {
    if (mostrarModalReserva || mostrarModalInfo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mostrarModalReserva, mostrarModalInfo]);

  const manejarIntentoReserva = () => {
    if (!usuarioLoggeado) {
      alert("Debes iniciar sesión para poder realizar una reserva.");
    } else {
      setMostrarModalReserva(true);
      setMostrarModalInfo(false);
    }
  };

  const imgViaje = viaje.img || `/media/img/img-inicio-destino-por-defecto.png`;

  return (
    <>
      {/* --- CARD PRINCIPAL --- */}
      <div className="group w-full bg-white rounded-[2.5rem] p-4 border border-secundario/10 transition-all duration-500 hover:border-primario/40 hover:ring-4 hover:ring-primario/5 flex flex-col h-full relative">
        <div className="relative h-48 w-full overflow-hidden rounded-[2rem] mb-4">
          <img
            src={imgViaje}
            alt={viaje.paisDestino}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3 bg-primario text-white px-4 py-1.5 rounded-full font-black text-sm border-2 border-white/20 shadow-sm">
            {viaje.precio}€
          </div>
          <button
            onClick={() => setMostrarModalInfo(true)}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white text-secundario p-3 rounded-full shadow-sm transition-all hover:scale-110"
          >
            <FaInfoCircle size={20} />
          </button>
        </div>

        <div className="flex flex-col flex-grow space-y-4 px-1">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-primario uppercase tracking-tighter">
                Origen
              </span>
              <p className="text-xs font-bold text-secundario">
                {viaje.paisOrigen}
              </p>
            </div>
            <FaArrowRight className="text-secundario/20" size={10} />
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-black text-primario uppercase tracking-tighter">
                Destino
              </span>
              <p className="text-xs font-bold text-secundario">
                {viaje.paisDestino}
              </p>
            </div>
          </div>
          <h3 className="text-3xl font-black text-secundario uppercase tracking-tighter leading-none group-hover:text-primario transition-colors">
            {viaje.paisDestino}
          </h3>
          <div className="flex items-center gap-2 py-2 border-t border-dashed border-secundario/10">
            <FaClock className="text-primario/60" size={12} />
            <span className="text-xs font-black text-secundario/60 uppercase">
              Salida: {viaje.horaSalida}h
            </span>
          </div>
          <button
            onClick={manejarIntentoReserva}
            className="w-full py-4 rounded-2xl bg-secundario text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-primario active:scale-95 mt-auto"
          >
            Reservar Vuelo
          </button>
        </div>
      </div>

      {/* --- MODAL DE INFORMACIÓN (Ficha Técnica con Scroll Controlado) --- */}
      {mostrarModalInfo && (
        <div className="fixed inset-0 bg-secundario/40 backdrop-blur-md flex justify-center items-center z-[210] p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-[700px] max-h-[90vh] relative flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border border-white shadow-2xl">
            {/* Cabecera fija con la cruz para que no se pierda al bajar */}
            <button
              onClick={() => setMostrarModalInfo(false)}
              className="absolute top-6 right-6 bg-white/20 hover:bg-primario text-white p-3 rounded-full backdrop-blur-md transition-all z-20"
            >
              <ImCross size={10} />
            </button>

            {/* Contenedor con Scroll */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <div className="relative h-56 w-full">
                <img
                  src={imgViaje}
                  className="w-full h-full object-cover"
                  alt={viaje.paisDestino}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />
              </div>

              <div className="p-8 -mt-10 relative bg-white rounded-t-[3rem]">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-primario font-black uppercase text-[10px] tracking-widest">
                      Ficha Técnica
                    </p>
                    <h2 className="text-5xl font-black text-secundario uppercase tracking-tighter leading-none">
                      {viaje.paisDestino}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-secundario">
                      {viaje.precio}€
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 text-primario mb-1">
                      <FaPlaneDeparture size={14} />
                      <span className="text-[9px] font-black uppercase">
                        Origen
                      </span>
                    </div>
                    <p className="font-bold text-secundario text-sm">
                      {viaje.paisOrigen}
                    </p>
                    <p className="text-[10px] text-secundario/40 font-bold">
                      {viaje.aeropuertoOrigen}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 text-primario mb-1">
                      <FaPlaneArrival size={14} />
                      <span className="text-[9px] font-black uppercase">
                        Llegada
                      </span>
                    </div>
                    <p className="font-bold text-secundario text-sm">
                      {viaje.paisDestino}
                    </p>
                    <p className="text-[10px] text-secundario/40 font-bold">
                      {viaje.aeropuertoDestino}
                    </p>
                  </div>
                  <div className="bg-secundario text-white p-4 rounded-2xl col-span-2 md:col-span-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-primario mb-1">
                      <FaClock size={14} />
                      <span className="text-[9px] font-black uppercase">
                        Salida
                      </span>
                    </div>
                    <p className="text-2xl font-black">{viaje.horaSalida}h</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 mb-8">
                  <h4 className="text-secundario font-black uppercase text-[10px] mb-2 flex items-center gap-2">
                    <FaInfoCircle className="text-primario" /> Resumen del viaje
                  </h4>
                  <div className="text-secundario/70 text-sm leading-relaxed">
                    <CardDescripcion
                      descripcion={
                        viaje.descripcion ||
                        "Detalles del itinerario próximamente."
                      }
                    />
                  </div>
                </div>

                <button
                  onClick={manejarIntentoReserva}
                  className="w-full py-5 rounded-2xl bg-secundario text-white font-black uppercase text-xs tracking-widest hover:bg-primario transition-all flex justify-center items-center gap-2 active:scale-95"
                >
                  Continuar Reserva <FaArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL RESERVA --- */}
      {mostrarModalReserva && (
        <div className="fixed inset-0 bg-secundario/50 backdrop-blur-md flex justify-center items-center z-[300] p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-[500px] max-h-[90vh] overflow-y-auto relative border-t-[8px] border-secundario shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-secundario uppercase tracking-tighter">
                  Tu Reserva
                </h2>
                <button
                  onClick={() => setMostrarModalReserva(false)}
                  className="text-secundario/20 hover:text-primario transition-all"
                >
                  <ImCross size={14} />
                </button>
              </div>
              <FormReservar
                viaje={viaje}
                setMostrarModal={setMostrarModalReserva}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
