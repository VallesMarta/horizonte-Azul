"use client";

import { API_URL } from "@/lib/api";
import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaRegCalendarAlt } from "react-icons/fa";
import { RiUserAddLine } from "react-icons/ri";
import { Viaje } from "@/models/types"; 

interface FormReservarProps {
  viaje: Viaje;
  setMostrarModal: (mostrar: boolean) => void;
}

export default function FormReservar({ viaje, setMostrarModal }: FormReservarProps) {
  // 1. Usamos useEffect para cargar datos del localStorage de forma segura en Next.js
  const [usuario, setUsuario] = useState({ id: "", nombre: "" });
  const [email, setEmail] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [pasajeros, setPasajeros] = useState(1);

  useEffect(() => {
    setUsuario({
      id: localStorage.getItem("username_id") || "",
      nombre: localStorage.getItem("nombreCompleto") || ""
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Recuperamos el TOKEN

    if (!token || !usuario.id) {
      alert("Debes iniciar sesión para reservar");
      return;
    }

    const datosReserva = {
      usuario_id: usuario.id, // Asegúrate que el backend espera 'usuario_id'
      viaje_id: viaje.id,
      fecha_salida: fechaSalida,
      pasajeros,
    };

    try {
      const res = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Enviamos el token
        },
        body: JSON.stringify(datosReserva),
      });

      if (res.ok) {
        alert("¡Reserva creada con éxito!");
        setMostrarModal(false);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error al crear la reserva");
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 w-full">
      <h2 className="text-fondo font-bold text-xl bg-secundario rounded-xl p-2 text-center">
        Reserva para: {viaje.paisDestino}
      </h2>

      {/* Nombre (Solo lectura) */}
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 text-texto font-bold text-sm">
          <FaUser /> Nombre del Titular
        </label>
        <input
          type="text"
          value={usuario.nombre}
          readOnly
          className="bg-gray-100 rounded-md p-2 text-gray-500 cursor-not-allowed border border-gray-300"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 text-texto font-bold text-sm">
          <FaEnvelope /> Correo de contacto
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-fondo border border-secundario/20 rounded-md p-2 text-secundario focus:ring-2 focus:ring-secundario outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Fecha */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-texto font-bold text-sm">
            <FaRegCalendarAlt /> Fecha
          </label>
          <input
            type="date"
            required
            value={fechaSalida}
            min={new Date().toISOString().split("T")[0]} // No permite fechas pasadas
            onChange={(e) => setFechaSalida(e.target.value)}
            className="bg-fondo border border-secundario/20 rounded-md p-2 text-secundario focus:ring-2 focus:ring-secundario outline-none"
          />
        </div>

        {/* Pasajeros */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-texto font-bold text-sm">
            <RiUserAddLine /> Pasajeros
          </label>
          <input
            type="number"
            value={pasajeros}
            onChange={(e) => setPasajeros(Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
            className="bg-fondo border border-secundario/20 rounded-md p-2 text-secundario focus:ring-2 focus:ring-secundario outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={() => setMostrarModal(false)}
          className="px-4 py-2 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-secundario px-6 py-2 rounded-lg text-fondo font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all"
        >
          Confirmar Reserva
        </button>
      </div>
    </form>
  );
}