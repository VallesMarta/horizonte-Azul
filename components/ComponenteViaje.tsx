"use client";

import CardDescripcion from "@/components/cards/CardDescripcion";
import { RiEditBoxFill } from "react-icons/ri";
import { FaTrashAlt, FaPlane } from "react-icons/fa";
import { API_URL } from "@/lib/api";
import { Viaje as ViajeType } from "@/models/types";

interface ViajeProps {
  viaje: ViajeType;
  onEditar: () => void;
  refrescarViajes: () => void;
}

const Viaje = ({ viaje, onEditar, refrescarViajes }: ViajeProps) => {
  const { 
    id, 
    paisOrigen, 
    aeropuertoOrigen,
    paisDestino, 
    aeropuertoDestino, 
    precio, 
    img, 
    descripcion
  } = viaje;

  const imageSrc = img || `${API_URL}/public/media/img/img-inicio-destino-por-defecto.png`;
  const descTxt = descripcion || "Sin descripción disponible.";

  const eliminarViaje = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el viaje a ${paisDestino}?`)) return;

    const token = localStorage.getItem("token");

    try {
      const respuesta = await fetch(`${API_URL}/viajes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (respuesta.ok) {
        refrescarViajes();
      } else {
        const errorData = await respuesta.json();
        alert(errorData.message || "Error al eliminar");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión.");
    }
  };

  return (
    <div className="group w-full max-w-[300px] bg-white rounded-[2rem] p-4 border border-gray-100 shadow-xl shadow-secundario/5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
      
      {/* IMAGEN CON PRECIO FLOTANTE */}
      <div className="relative h-44 w-full overflow-hidden rounded-[1.5rem] mb-4">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={imageSrc}
          alt={paisDestino}
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-gray-100">
          <p className="text-secundario font-black text-sm">{precio}€</p>
        </div>
      </div>

      {/* DETALLES DEL VIAJE */}
      <div className="px-1 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <FaPlane size={10} className="text-primario rotate-45" />
          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            {aeropuertoDestino}
          </h5>
        </div>
        
        <h3 className="text-2xl font-black text-secundario uppercase tracking-tighter leading-tight mb-3">
          {paisDestino}
        </h3>

        <div className="mb-4">
          <CardDescripcion descripcion={descTxt} />
        </div>

        {/* ACCIONES TÁCTICAS */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
          <button
            onClick={onEditar}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-secundario rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-secundario hover:text-white transition-all active:scale-95"
          >
            <RiEditBoxFill size={14} />
            Editar
          </button>

          <button
            onClick={eliminarViaje}
            className="flex items-center justify-center w-11 h-11 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
            title="Eliminar destino"
          >
            <FaTrashAlt size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Viaje;