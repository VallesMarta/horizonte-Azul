"use client";

import { useState } from "react";
import CardDescripcion from "@/components/cards/CardDescripcion";
import { ImCross } from "react-icons/im";
import FormReservar from "@/components/forms/FormReservar";

interface ViajeType {
  _id: string;
  origen: string;
  origenAeropuerto: string;
  destino: string;
  destinoAeropuerto: string;
  precio: number;
  img?: string;
  descripcion?: string;
}

interface DestinoProps {
  viaje: ViajeType;
  urlAPI: string;
}

export default function Destino({ viaje, urlAPI }: DestinoProps) {
  const usuario_id = typeof window !== "undefined" ? localStorage.getItem("username_id") : null;

  const comprobarUsuario = () => {
    if (!usuario_id) {
      alert("Debes iniciar sesión para reservar");
      return false;
    }
    return true;
  };

  const [mostrarModal, setMostrarModal] = useState(false);

  const imgViaje =
    viaje.img && viaje.img !== ""
      ? viaje.img
      : `${urlAPI}/public/media/img/img-inicio-destino-por-defecto.png`;

  const descripcionViaje =
    viaje.descripcion && viaje.descripcion !== ""
      ? viaje.descripcion
      : "UPS. No hay ninguna descripción actualmente";

  return (
    <>
      <div className="w-full max-w-[280px] mb-2 justify-between p-3 rounded-xl flex flex-col bg-otro shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]">
        <img
          className="w-full h-48 object-cover rounded-lg mb-3"
          src={imgViaje}
          alt={viaje.destino}
        />

        {/* Título */}
        <h3 className="text-secundario font-extrabold text-2xl text-center mb-1">
          {viaje.destino}
        </h3>

        {/* Subtítulo / aeropuerto */}
        <h5 className="text-center text-sm text-texto uppercase mb-2 font-bold">
          {viaje.destinoAeropuerto}
        </h5>

        {/* Descripción truncada */}
        <CardDescripcion descripcion={descripcionViaje} />

        {/* Precio */}
        <p className="text-secundario font-semibold text-lg text-right mb-4">
          Precio: {viaje.precio}€
        </p>

        {/* Botón */}
        <button
          onClick={() => comprobarUsuario() && setMostrarModal(true)}
          type="button"
          className="cursor-pointer mt-4 p-2 rounded-lg bg-secundario text-fondo font-bold text-lg transition-all duration-300 hover:bg-secundario/80 hover:scale-[1.05] active:scale-[0.95] active:bg-secundario/60 shadow-md hover:shadow-lg self-center"
        >
          Reservar
        </button>
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-otro border-2 border-primario p-6 rounded-xl shadow-2xl w-[90%] max-w-[500px] relative">
            {/* Botón Cerrar */}
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-3 right-3 text-gray-700 text-xl font-bold hover:text-[#D13264]"
            >
              <ImCross />
            </button>

            {/* FORMULARIO */}
            <FormReservar viaje={viaje} urlAPI={urlAPI} setMostrarModal={setMostrarModal} />
          </div>
        </div>
      )}
    </>
  );
}
