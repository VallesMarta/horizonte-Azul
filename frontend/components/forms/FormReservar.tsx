"use client"; // importante para componentes que usan useState o useEffect

import { useState } from "react";
import { FaUser, FaEnvelope, FaRegCalendarAlt } from "react-icons/fa";
import { RiUserAddLine } from "react-icons/ri";

interface Viaje {
  _id: string;
  destino: string;
}

interface FormReservarProps {
  viaje: Viaje;
  urlAPI: string;
  setMostrarModal: (mostrar: boolean) => void;
}

export default function FormReservar({
  viaje,
  urlAPI,
  setMostrarModal,
}: FormReservarProps) {
  const usuario_id = typeof window !== "undefined" ? localStorage.getItem("username_id") : null;
  const nombre = typeof window !== "undefined" ? localStorage.getItem("nombreCompleto") || "" : "";

  const [email, setEmail] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [pasajeros, setPasajeros] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario_id) {
      alert("Debes iniciar sesión para reservar");
      return;
    }

    if (!fechaSalida) {
      alert("Selecciona una fecha de salida");
      return;
    }

    const datosReserva = {
      usuario: usuario_id,
      viaje: viaje._id,
      nombre: nombre,
      fecSalida: fechaSalida,
      pasajeros,
      estado: "pendiente",
    };

    try {
      const res = await fetch(`${urlAPI}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosReserva),
      });

      const data = await res.json();
      if (data.ok) {
        alert("Reserva creada correctamente");
        setMostrarModal(false);
      } else {
        alert("Error al crear la reserva");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 w-full">
      <h2 className="text-fondo font-bold text-xl underline bg-secundario rounded-xl p-2 text-center">
        Reserva para viajar a {viaje.destino}
      </h2>

      {/* Nombre */}
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 text-texto font-bold">
          <FaUser /> Nombre
        </label>
        <input
          type="text"
          value={nombre}
          className="bg-fondo rounded-md p-2 text-secundario focus:outline-none focus:ring-2 focus:ring-otro cursor-not-allowed"
          readOnly
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 text-texto font-bold">
          <FaEnvelope /> Correo
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu correo"
          required
          className="bg-fondo rounded-md p-2 text-secundario focus:outline-none focus:ring-2 focus:ring-otro"
        />
      </div>

      {/* Fecha de salida */}
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 text-texto font-bold">
          <FaRegCalendarAlt /> Fecha de salida
        </label>
        <input
          type="date"
          value={fechaSalida}
          onChange={(e) => setFechaSalida(e.target.value)}
          className="bg-fondo rounded-md p-2 text-secundario focus:outline-none focus:ring-2 focus:ring-otro"
        />
      </div>

      {/* Pasajeros */}
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 text-texto font-bold">
          <RiUserAddLine /> Nº Pasajeros
        </label>
        <input
          type="number"
          value={pasajeros}
          onChange={(e) => setPasajeros(Math.max(1, parseInt(e.target.value)))}
          min={1}
          required
          className="bg-fondo rounded-md p-2 text-secundario focus:outline-none focus:ring-2 focus:ring-otro"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={() => setMostrarModal(false)}
          className="bg-rojo p-3 rounded-xl text-fondo font-bold"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-verde p-3 rounded-xl text-fondo font-bold"
        >
          Confirmar
        </button>
      </div>
    </form>
  );
}
