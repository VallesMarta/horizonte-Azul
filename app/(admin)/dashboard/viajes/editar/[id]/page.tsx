"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { FaPlane, FaArrowRight, FaClock, FaEuroSign, FaImage, FaChevronLeft, FaGlobeAmericas, FaMapMarkerAlt, FaAlignLeft } from "react-icons/fa";
import Link from "next/link";

export default function EditarViaje() {
  const router = useRouter();
  const { id } = useParams(); // Obtenemos el ID de la ruta
  
  const [form, setForm] = useState({
    paisOrigen: "", aeropuertoOrigen: "", horaSalida: "",
    paisDestino: "", aeropuertoDestino: "", horaLlegada: "",
    precio: "", img: "", descripcion: ""
  });

  // 1. Cargar los datos del viaje al iniciar
  useEffect(() => {
    const fetchViaje = async () => {
      try {
        const res = await fetch(`${API_URL}/viajes/${id}`);
        const data = await res.json();
        
        if (res.ok) {
          const v = data.resultado || data;
          setForm({
            paisOrigen: v.paisOrigen || "",
            aeropuertoOrigen: v.aeropuertoOrigen || "",
            horaSalida: v.horaSalida || "",
            paisDestino: v.paisDestino || "",
            aeropuertoDestino: v.aeropuertoDestino || "",
            horaLlegada: v.horaLlegada || "",
            precio: v.precio?.toString() || "",
            img: v.img || "",
            descripcion: v.descripcion || ""
          });
        }
      } catch (error) {
        console.error("Error cargando el viaje:", error);
      }
    };
    fetchViaje();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const datosParaEnviar = {
      paisOrigen: form.paisOrigen,
      aeropuertoOrigen: form.aeropuertoOrigen,
      horaSalida: form.horaSalida,
      paisDestino: form.paisDestino,
      aeropuertoDestino: form.aeropuertoDestino,
      horaLlegada: form.horaLlegada,
      precio: parseFloat(form.precio) || 0,
      img: form.img,
      descripcion: form.descripcion
    };

    try {
      const res = await fetch(`${API_URL}/viajes/${id}`, {
        method: "PUT", // Usamos PUT para actualizar
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosParaEnviar)
      });

      if (res.ok) {
        router.push("/dashboard/viajes");
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <Link href="/dashboard/viajes" className="flex items-center gap-2 text-secundario/40 hover:text-secundario transition-all font-bold text-[10px] tracking-[0.2em]">
          <FaChevronLeft size={10} /> CANCELAR
        </Link>
        <h1 className="text-2xl font-black text-secundario uppercase tracking-tighter text-right">
          Editar Vuelo <span className="text-primario">#{id}</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARD DE RUTA SIMÉTRICA */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-secundario/5 border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 relative">
            
            {/* SECCIÓN ORIGEN */}
            <div className="lg:col-span-5 p-10 space-y-6 bg-gray-50/30">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-primario uppercase tracking-widest flex items-center gap-2">
                    <FaGlobeAmericas /> País Salida
                  </label>
                  <input 
                    type="text" value={form.paisOrigen}
                    className="w-full bg-transparent text-base font-bold text-secundario outline-none border-b border-gray-200 focus:border-primario py-1 transition-all"
                    onChange={e => setForm({...form, paisOrigen: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <FaMapMarkerAlt /> Ciudad / Aero
                  </label>
                  <input 
                    type="text" value={form.aeropuertoOrigen}
                    className="w-full bg-transparent text-2xl font-black text-secundario placeholder:text-gray-200 outline-none uppercase tracking-tight"
                    onChange={e => setForm({...form, aeropuertoOrigen: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="relative">
                <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                <input 
                  type="time" value={form.horaSalida}
                  className="w-full bg-white p-3 pl-10 rounded-xl text-sm font-bold text-secundario shadow-sm outline-none" 
                  onChange={e => setForm({...form, horaSalida: e.target.value})} 
                />
              </div>
            </div>

            {/* DIVISOR */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center bg-white py-6 lg:py-0 relative">
              <div className="hidden lg:block h-[60%] w-[1px] border-l border-dashed border-gray-200"></div>
              <div className="lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 bg-white border border-gray-100 text-primario p-3 rounded-full shadow-md z-10 scale-90">
                <FaPlane className="size-4" />
              </div>
            </div>

            {/* SECCIÓN DESTINO */}
            <div className="lg:col-span-5 p-10 space-y-6 bg-white">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-primario uppercase tracking-widest flex items-center gap-2">
                    <FaGlobeAmericas /> País Destino
                  </label>
                  <input 
                    type="text" value={form.paisDestino}
                    className="w-full bg-transparent text-base font-bold text-secundario outline-none border-b border-gray-200 focus:border-primario py-1 transition-all"
                    onChange={e => setForm({...form, paisDestino: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <FaMapMarkerAlt /> Ciudad / Aero
                  </label>
                  <input 
                    type="text" value={form.aeropuertoDestino}
                    className="w-full bg-transparent text-2xl font-black text-secundario placeholder:text-gray-200 outline-none uppercase tracking-tight"
                    onChange={e => setForm({...form, aeropuertoDestino: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="relative">
                <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                <input 
                  type="time" value={form.horaLlegada}
                  className="w-full bg-gray-50 p-3 pl-10 rounded-xl text-sm font-bold text-secundario outline-none border border-gray-100" 
                  onChange={e => setForm({...form, horaLlegada: e.target.value})} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* DETALLES */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 space-y-3 shadow-sm group hover:border-primario transition-all duration-300">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <FaAlignLeft className="text-primario" /> Detalles del viaje
          </label>
          <textarea 
            value={form.descripcion} rows={4}
            className="w-full text-sm font-medium text-secundario outline-none p-0 focus:ring-0 bg-transparent resize-none"
            onChange={e => setForm({...form, descripcion: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-5 group hover:border-green-500 transition-all duration-300">
            <div className="bg-green-50 text-green-600 p-4 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all">
              <FaEuroSign size={18} />
            </div>
            <div className="flex-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Precio Final</label>
              <input type="number" step="0.01" value={form.precio} className="w-full text-xl font-black text-secundario outline-none" onChange={e => setForm({...form, precio: e.target.value})} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-5 group hover:border-primario transition-all duration-300">
            <div className="bg-primario/10 text-primario p-4 rounded-2xl group-hover:bg-primario group-hover:text-white transition-all">
              <FaImage size={18} />
            </div>
            <div className="flex-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">URL Imagen</label>
              <input type="text" value={form.img} className="w-full text-xs font-bold text-secundario outline-none" onChange={e => setForm({...form, img: e.target.value})} />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-secundario text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-primario transition-all flex items-center justify-center gap-3 group">
          GUARDAR CAMBIOS
          <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </form>
    </div>
  );
}