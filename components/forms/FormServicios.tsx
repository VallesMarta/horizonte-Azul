"use client";

import { useEffect, useState, FormEvent, useCallback } from "react";
import { GrDocumentConfig } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { API_URL } from "@/lib/api";
import { Servicio } from "@/models/types"; 

interface ServiciosProps {
  setMostrarModalServicios: (mostrar: boolean) => void;
}

const FormServicios = ({ setMostrarModalServicios }: ServiciosProps) => {
  const [nombre, setNombre] = useState("");
  const [servicios, setServicios] = useState<Servicio[]>([]);

  const listarServicios = useCallback(async () => {
    try {
      const respuesta = await fetch(`${API_URL}/servicios`);
      if (respuesta.ok) {
        const data = await respuesta.json();

        setServicios(data.resultado || data);
      }
    } catch (error) {
      console.error("Error listando servicios:", error);
    }
  }, []);

  useEffect(() => {
    listarServicios();
  }, [listarServicios]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const respuesta = await fetch(`${API_URL}/servicios`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ nombre }),
      });

      if (respuesta.ok) {
        setNombre("");
        listarServicios();
      } else {
        alert("No tienes permisos para crear servicios");
      }
    } catch (error) {
      console.error("Error creando servicio:", error);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("¿Eliminar este servicio?")) return;
    const token = localStorage.getItem("token");

    try {
      const respuesta = await fetch(`${API_URL}/servicios/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (respuesta.ok) {
        listarServicios();
      } else {
        alert("Error al eliminar el servicio");
      }
    } catch (error) {
      console.error("Error eliminando servicio:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 w-full text-texto">
      <h2 className="text-fondo font-bold text-xl bg-secundario rounded-xl p-2 text-center">
        Gestión de Servicios
      </h2>

      {/* Formulario para Crear */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label className="flex items-center gap-2 font-bold text-sm">
          <GrDocumentConfig /> Nuevo Servicio
        </label>
        <div className="flex h-11">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="flex-1 bg-fondo border border-gray-200 rounded-l-xl px-4 outline-none focus:ring-2 focus:ring-secundario"
            placeholder="Ej: Seguro de viaje incluido"
          />
          <button
            type="submit"
            className="bg-verde px-5 rounded-r-xl text-fondo hover:brightness-110 transition-all flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      </form>

      {/* Lista de Servicios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-3 hover:bg-white hover:shadow-sm transition-all"
          >
            <span className="font-semibold text-sm">{servicio.nombre}</span>
            <button
              onClick={() => handleDelete(servicio.id)}
              className="text-gray-400 hover:text-rojo p-1 transition-colors"
              title="Eliminar servicio"
            >
              <ImCross size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-2">
        <button
          onClick={() => setMostrarModalServicios(false)}
          className="bg-gray-500 px-6 py-2 rounded-xl text-fondo font-bold hover:bg-gray-600 transition-all"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default FormServicios;