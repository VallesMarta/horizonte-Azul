"use client";

import { useState, useEffect, FormEvent } from "react";
import { FaPlaneDeparture, FaPlaneArrival, FaClock, FaImage, FaEuroSign } from "react-icons/fa";
import { API_URL } from "@/lib/api";
import { Viaje, Servicio } from "@/models/types"; 

interface FormCrearViajeProps {
  viaje?: Viaje | null;
  setMostrarModal: (mostrar: boolean) => void;
  refrescarViajes: () => void;
}

export default function FormCrearViaje({
  viaje = null,
  setMostrarModal,
  refrescarViajes,
}: FormCrearViajeProps) {
  const esEditar = !!viaje;

  // Estados basados estrictamente en tu Interface Viaje
  const [paisOrigen, setPaisOrigen] = useState(viaje?.paisOrigen || "");
  const [aeropuertoOrigen, setAeropuertoOrigen] = useState(viaje?.aeropuertoOrigen || "");
  const [horaSalida, setHoraSalida] = useState(viaje?.horaSalida || "");
  
  const [paisDestino, setPaisDestino] = useState(viaje?.paisDestino || "");
  const [aeropuertoDestino, setAeropuertoDestino] = useState(viaje?.aeropuertoDestino || "");
  const [horaLlegada, setHoraLlegada] = useState(viaje?.horaLlegada || "");
  
  const [precio, setPrecio] = useState<number>(viaje?.precio || 0);
  const [descripcion, setDescripcion] = useState(viaje?.descripcion || "");
  const [img, setImg] = useState(viaje?.img || "");
  
  const [listaServicios, setListaServicios] = useState<Servicio[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<number[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/servicios`)
      .then((res) => res.json())
      .then((data) => setListaServicios(data.resultado || data))
      .catch((err) => console.error("Error servicios:", err));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const datosViaje = {
      paisOrigen, aeropuertoOrigen, horaSalida,
      paisDestino, aeropuertoDestino, horaLlegada,
      precio, descripcion, img,
      servicios: serviciosSeleccionados,
    };

    const url = esEditar ? `${API_URL}/viajes/${viaje.id}` : `${API_URL}/viajes`;
    try {
      const res = await fetch(url, {
        method: esEditar ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(datosViaje),
      });

      if (res.ok) {
        setMostrarModal(false);
        refrescarViajes();
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-2">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-black text-secundario uppercase tracking-tighter">
          {esEditar ? "Editar Destino" : "Nuevo Destino"}
        </h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Panel de Gestión de Vuelos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* ORIGEN */}
        <div className="space-y-4 bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100">
          <p className="text-[10px] font-black text-primario uppercase tracking-widest ml-2">Salida</p>
          <InputLabel label="País Origen" icon={<FaPlaneDeparture />} value={paisOrigen} onChange={setPaisOrigen} placeholder="Ej: España" />
          <InputLabel label="Aeropuerto" icon={<FaPlaneDeparture />} value={aeropuertoOrigen} onChange={setAeropuertoOrigen} placeholder="Ej: Madrid (MAD)" />
          <InputLabel label="Hora Salida" type="time" icon={<FaClock />} value={horaSalida} onChange={setHoraSalida} />
        </div>

        {/* DESTINO */}
        <div className="space-y-4 bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100">
          <p className="text-[10px] font-black text-secundario uppercase tracking-widest ml-2">Llegada</p>
          <InputLabel label="País Destino" icon={<FaPlaneArrival />} value={paisDestino} onChange={setPaisDestino} placeholder="Ej: Irlanda" />
          <InputLabel label="Aeropuerto" icon={<FaPlaneArrival />} value={aeropuertoDestino} onChange={setAeropuertoDestino} placeholder="Ej: Dublín (DUB)" />
          <InputLabel label="Hora Llegada" type="time" icon={<FaClock />} value={horaLlegada} onChange={setHoraLlegada} />
        </div>
      </div>

      {/* PRECIO E IMAGEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        <InputLabel label="Precio (EUR)" type="number" icon={<FaEuroSign />} value={precio} onChange={(v: any) => setPrecio(parseFloat(v))} />
        <InputLabel label="URL Imagen" icon={<FaImage />} value={img} onChange={setImg} placeholder="https://images.unsplash.com/..." />
      </div>

      {/* DESCRIPCIÓN */}
      <div className="flex flex-col gap-2 px-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Descripción del viaje</label>
        <textarea 
          value={descripcion} 
          onChange={(e) => setDescripcion(e.target.value)} 
          rows={3} 
          className="w-full bg-gray-50 border-2 border-transparent focus:border-primario/10 focus:bg-white rounded-3xl py-4 px-6 font-bold text-secundario transition-all outline-none resize-none"
          placeholder="Escribe los detalles del destino..." 
        />
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
        <button 
          type="button" 
          onClick={() => setMostrarModal(false)} 
          className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="bg-secundario text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-secundario/20 hover:bg-primario transition-all active:scale-95"
        >
          {esEditar ? "Actualizar Vuelo" : "Publicar Vuelo"}
        </button>
      </div>
    </form>
  );
}

function InputLabel({ label, icon, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
        {icon} {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full bg-white border-2 border-transparent shadow-sm focus:border-primario/20 rounded-2xl py-3 px-5 font-bold text-secundario transition-all outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}