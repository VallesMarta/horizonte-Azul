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
import ServiciosViaje from "@/components/cards/ServiciosViaje";
import BotonWishlist from "@/components/BotonWishlist";
import { Viaje } from "@/models/types";
import useAuth from "@/hooks/useAuth";

interface DestinoProps {
  viaje: Viaje;
}

export default function Destino({ viaje }: DestinoProps) {
  const [mostrarModalReserva, setMostrarModalReserva] = useState(false);
  const [mostrarModalInfo, setMostrarModalInfo] = useState(false);
  const { usuarioLoggeado } = useAuth();

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
  const horaFormateada = viaje.horaSalida
    ? viaje.horaSalida.slice(0, 5)
    : "--:--";

  return (
    <>
      {/* CARD PRINCIPAL */}
      <div className="group w-full bg-fondo rounded-[2.5rem] p-4 border border-gris-borde-suave shadow-sm transition-all duration-500 hover:border-primario/60 hover:shadow-xl hover:ring-1 hover:ring-primario/20 flex flex-col h-full relative">
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
            className="absolute bottom-3 right-3 bg-fondo/90 backdrop-blur-sm hover:bg-fondo text-primario p-3 rounded-full shadow-sm transition-all hover:scale-110"
          >
            <FaInfoCircle size={20} />
          </button>
        </div>

        <div className="flex flex-col flex-grow space-y-4 px-1">
          <div className="flex items-center justify-between bg-gris-clarito p-3 rounded-2xl border border-gris-borde-suave">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-primario uppercase tracking-tighter">
                Origen
              </span>
              <p className="text-xs font-bold text-titulo-resaltado">
                {viaje.paisOrigen}
              </p>
              <p className="text-[10px] text-texto/50 italic">
                {viaje.aeropuertoOrigen}
              </p>
            </div>
            <FaArrowRight className="text-primario/20" size={10} />
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-black text-primario uppercase tracking-tighter">
                Destino
              </span>
              <p className="text-xs font-bold text-titulo-resaltado">
                {viaje.paisDestino}
              </p>
              <p className="text-[10px] text-texto/50 italic">
                {viaje.aeropuertoDestino}
              </p>
            </div>
          </div>
          <h3 className="text-3xl font-black text-titulo-resaltado uppercase tracking-tighter leading-none group-hover:text-primario transition-colors">
            {viaje.paisDestino}
          </h3>
          <div className="flex items-center justify-between gap-2 py-2 border-t border-dashed border-secundario/20">
            <div className="flex items-center gap-2">
              <FaClock className="text-primario/60" size={12} />
              <span className="text-xs font-black text-texto/60 uppercase">
                Salida: {horaFormateada}h
              </span>
            </div>
            <BotonWishlist viajeId={Number(viaje.id)} />
          </div>
          <button
            onClick={manejarIntentoReserva}
            className="w-full py-4 rounded-2xl bg-secundario text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-primario active:scale-95 mt-auto"
          >
            Reservar Vuelo
          </button>
        </div>
      </div>

      {/* MODAL DEL VIAJE DETALLADO */}
      {mostrarModalInfo && (
        <div className="fixed inset-0 bg-secundario/60 backdrop-blur-md flex justify-center items-center z-[210] p-4">
          <div className="bg-fondo rounded-[3rem] w-full max-w-[900px] max-h-[min(90vh,800px)] relative flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 shadow-2xl border border-gris-borde-suave">
            <button
              onClick={() => setMostrarModalInfo(false)}
              className="absolute top-5 right-5 bg-black/20 hover:bg-primario text-white p-3 rounded-full backdrop-blur-md transition-all z-50"
            >
              <ImCross size={10} />
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="relative h-48 md:h-60 w-full">
                <img
                  src={imgViaje}
                  className="w-full h-full object-cover"
                  alt={viaje.paisDestino}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fondo via-transparent to-black/30" />
              </div>

              <div className="px-6 md:px-10 py-6 -mt-10 relative bg-fondo rounded-t-[3rem]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-primario font-black uppercase text-[10px] tracking-[0.3em]">
                      Ficha Técnica
                    </p>
                    <h2 className="text-3xl md:text-4xl font-black text-titulo-resaltado uppercase tracking-tighter">
                      {viaje.paisDestino}
                    </h2>
                  </div>
                  <div className="bg-primario/10 px-6 py-2 rounded-2xl">
                    <span className="text-2xl md:text-3xl font-black text-primario">
                      {viaje.precio}€
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  <div className="bg-gris-clarito p-4 rounded-2xl border border-gris-borde-suave flex items-center gap-4">
                    <div className="bg-primario/10 p-2 rounded-lg">
                      <FaPlaneDeparture className="text-primario" size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-texto/40 tracking-widest">
                        Origen: {viaje.paisOrigen}
                      </p>
                      <p className="font-bold text-titulo-resaltado text-sm">
                        {viaje.aeropuertoOrigen || "Aeropuerto no especificado"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gris-clarito p-4 rounded-2xl border border-gris-borde-suave flex items-center gap-4">
                    <div className="bg-primario/10 p-2 rounded-lg">
                      <FaPlaneArrival className="text-primario" size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-texto/40 tracking-widest">
                        Llegada: {viaje.paisDestino}
                      </p>
                      <p className="font-bold text-titulo-resaltado text-sm">
                        {viaje.aeropuertoDestino ||
                          "Aeropuerto no especificado"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-secundario p-4 rounded-2xl flex items-center gap-4 text-white">
                    <FaClock className="text-iconos" size={18} />
                    <div>
                      <p className="text-[8px] font-black uppercase text-white/50">
                        Hora Salida
                      </p>
                      <p className="font-black italic text-lg leading-none">
                        {horaFormateada}h
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gris-clarito p-6 rounded-[2rem] border border-gris-borde-suave">
                    <p className="text-primario font-black uppercase text-[9px] tracking-[0.3em] mb-3">
                      Descripción
                    </p>
                    <CardDescripcion
                      descripcion={
                        viaje.descripcion || "Detalles próximamente."
                      }
                    />
                  </div>
                  <div className="bg-gris-clarito p-6 rounded-[2rem] border border-gris-borde-suave">
                    <p className="text-primario font-black uppercase text-[9px] tracking-[0.3em] mb-3">
                      Servicios Incluidos
                    </p>
                    <ServiciosViaje viajeId={Number(viaje.id)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-fondo border-t border-gris-borde-suave">
              <button
                onClick={manejarIntentoReserva}
                className="w-full py-5 rounded-2xl bg-secundario text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-primario transition-all flex justify-center items-center gap-3 shadow-lg active:scale-[0.98]"
              >
                Empezar la reserva <FaArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RESERVA */}
      {mostrarModalReserva && (
        <div className="fixed inset-0 bg-secundario/80 backdrop-blur-lg flex justify-center items-center z-[300] p-4">
          <div className="bg-fondo rounded-[2.5rem] w-full max-w-[750px] max-h-[95vh] flex flex-col overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-500 border border-gris-borde-suave">
            <div className="p-8 md:p-10 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-titulo-resaltado uppercase tracking-tighter">
                    Finalizar Reserva
                  </h2>
                  <p className="text-[10px] font-bold text-texto/40 uppercase tracking-[0.1em] mt-2">
                    {viaje.paisOrigen}{" "}
                    <FaArrowRight
                      className="inline mx-2 text-primario"
                      size={8}
                    />{" "}
                    {viaje.paisDestino}
                  </p>
                </div>
                <button
                  onClick={() => setMostrarModalReserva(false)}
                  className="hover:bg-gris-clarito text-texto/20 hover:text-texto p-3 rounded-full transition-all"
                >
                  <ImCross size={12} />
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
