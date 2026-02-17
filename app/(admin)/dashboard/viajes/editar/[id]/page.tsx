"use client";
import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { 
  FaPlane, FaArrowRight, FaClock, FaEuroSign, FaImage, 
  FaChevronLeft, FaGlobeAmericas, FaMapMarkerAlt, FaAlignLeft,
  FaPlus, FaTrash, FaConciergeBell, FaHashtag, FaFont
} from "react-icons/fa";
import Link from "next/link";

export default function EditarViaje() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  
  const [serviciosDisponibles, setServiciosDisponibles] = useState<any[]>([]);
  const [serviciosAsignados, setServiciosAsignados] = useState<any[]>([]);
  const [form, setForm] = useState({
    paisOrigen: "", aeropuertoOrigen: "", horaSalida: "",
    paisDestino: "", aeropuertoDestino: "", horaLlegada: "",
    precio: "", img: "", descripcion: ""
  });

  // 1. Cargar Catálogo de Servicios y Datos del Viaje
  const cargarDatos = useCallback(async () => {
    try {
      // Cargar los servicios
      const resServicios = await fetch(`${API_URL}/servicios`);
      const dataServicios = await resServicios.json();
      setServiciosDisponibles(dataServicios.resultado || dataServicios);

      // Cargar datos del viaje
      const resViaje = await fetch(`${API_URL}/viajes/${id}`);
      const dataViaje = await resViaje.json();
      
      if (resViaje.ok) {
        const v = dataViaje.resultado || dataViaje;
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
        
        // Cargar servicios asignados
        const resServsViaje = await fetch(`${API_URL}/viaje-servicio/${id}`);
        const dataServsViaje = await resServsViaje.json();
        if (dataServsViaje.ok) {
          setServiciosAsignados(dataServsViaje.resultado || []);
        }
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }, [id]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Funciones para gestionar servicios
  const agregarServicioFila = () => {
    setServiciosAsignados([...serviciosAsignados, { servicio_id: "", valor: "", precio_extra: "0" }]);
  };

  const actualizarServicioFila = (index: number, campo: string, valor: any) => {
    const nuevos = [...serviciosAsignados];
    nuevos[index][campo] = valor;
    setServiciosAsignados(nuevos);
  };

  const eliminarServicioFila = (index: number) => {
    setServiciosAsignados(serviciosAsignados.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      // Actualizar viaje
      const resViaje = await fetch(`${API_URL}/viajes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, precio: parseFloat(form.precio) || 0 })
      });

      if (!resViaje.ok) throw new Error("Error al actualizar el viaje");

      // Preparar servicios
      const serviciosLimpios = serviciosAsignados
        .filter(s => s.servicio_id !== "")
        .map(s => ({
          servicio_id: parseInt(s.servicio_id),
          valor: String(s.valor || ""),
          precio_extra: parseFloat(s.precio_extra) || 0
        }));

      // Siempre disparamos el PUT de servicios para sincronizar (borrar/insertar)
      const resServ = await fetch(`${API_URL}/viaje-servicio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicios: serviciosLimpios })
      });

      if (!resServ.ok) throw new Error("Error al actualizar servicios adicionales");

      router.push("/dashboard/viajes");
      router.refresh();
      
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700 pb-20 ${loading ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <Link href="/dashboard/viajes" className="flex items-center gap-2 text-secundario/40 hover:text-secundario transition-all font-bold text-[10px] tracking-[0.2em]">
          <FaChevronLeft size={10} /> CANCELAR EDICIÓN
        </Link>
        <h1 className="text-2xl font-black text-secundario uppercase tracking-tighter">
          Editar Vuelo <span className="text-primario">#{id}</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARD DE RUTA (Origen/Destino) */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-secundario/5 border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 relative">
            <div className="lg:col-span-5 p-10 space-y-6 bg-gray-50/30">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-primario uppercase tracking-widest flex items-center gap-2"><FaGlobeAmericas /> País de Salida</label>
                <input type="text" value={form.paisOrigen} className="w-full bg-transparent text-base font-bold text-secundario outline-none border-b border-gray-200 focus:border-primario py-1" onChange={e => setForm({...form, paisOrigen: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><FaMapMarkerAlt /> Ciudad de salida</label>
                <input type="text" value={form.aeropuertoOrigen} className="w-full bg-transparent text-2xl font-black text-secundario outline-none uppercase" onChange={e => setForm({...form, aeropuertoOrigen: e.target.value})} required />
              </div>
              <div className="relative">
                <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                <input type="time" value={form.horaSalida} className="w-full bg-white p-3 pl-10 rounded-xl text-sm font-bold text-secundario shadow-sm outline-none" onChange={e => setForm({...form, horaSalida: e.target.value})} />
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col items-center justify-center bg-white py-6 lg:py-0 relative">
              <div className="hidden lg:block h-[60%] w-[1px] border-l border-dashed border-gray-200"></div>
              <div className="lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 bg-white border border-gray-100 text-primario p-3 rounded-full shadow-md z-10">
                <FaPlane className="size-4" />
              </div>
            </div>

            <div className="lg:col-span-5 p-10 space-y-6 bg-white">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-primario uppercase tracking-widest flex items-center gap-2"><FaGlobeAmericas /> País de Destino</label>
                <input type="text" value={form.paisDestino} className="w-full bg-transparent text-base font-bold text-secundario outline-none border-b border-gray-200 focus:border-primario py-1" onChange={e => setForm({...form, paisDestino: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><FaMapMarkerAlt /> Ciudad de Llegada</label>
                <input type="text" value={form.aeropuertoDestino} className="w-full bg-transparent text-2xl font-black text-secundario outline-none uppercase" onChange={e => setForm({...form, aeropuertoDestino: e.target.value})} required />
              </div>
              <div className="relative">
                <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                <input type="time" value={form.horaLlegada} className="w-full bg-gray-50 p-3 pl-10 rounded-xl text-sm font-bold shadow-sm outline-none border border-gray-100" onChange={e => setForm({...form, horaLlegada: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        {/* DETALLES */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 space-y-3 shadow-sm group">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <FaAlignLeft className="text-primario" /> Detalles del destino
          </label>
          <textarea value={form.descripcion} rows={4} className="w-full text-sm font-medium text-secundario outline-none bg-transparent resize-none" onChange={e => setForm({...form, descripcion: e.target.value})} />
        </div>

        {/* PRECIO E IMAGEN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-5 group hover:border-green-500 transition-all">
            <div className="bg-green-50 text-green-600 p-4 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all"><FaEuroSign size={18} /></div>
            <div className="flex-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Precio Base</label>
              <input type="number" step="0.01" value={form.precio} className="w-full text-xl font-black text-secundario outline-none" onChange={e => setForm({...form, precio: e.target.value})} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-5 group hover:border-primario transition-all">
            <div className="bg-primario/10 text-primario p-4 rounded-2xl group-hover:bg-primario group-hover:text-white transition-all"><FaImage size={18} /></div>
            <div className="flex-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">URL Imagen</label>
              <input type="text" value={form.img} className="w-full text-xs font-bold text-secundario outline-none" onChange={e => setForm({...form, img: e.target.value})} />
            </div>
          </div>
        </div>

        {/* SECCIÓN DE SERVICIOS */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-secundario p-2.5 rounded-xl text-white shadow-lg shadow-secundario/20">
                <FaConciergeBell size={16} />
              </div>
              <div>
                <h3 className="font-black text-secundario uppercase text-sm tracking-tighter">Servicios Disponibles</h3>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Personaliza los servicios de este vuelo</p>
              </div>
            </div>
            <button type="button" onClick={agregarServicioFila} className="bg-primario text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-md flex items-center gap-2">
              <FaPlus /> Añadir Servicio
            </button>
          </div>

          <div className="space-y-3">
            {serviciosAsignados.map((item, index) => {
              const infoS = serviciosDisponibles.find(s => s.id === parseInt(item.servicio_id));
              return (
                <div key={index} className="flex flex-col md:flex-row items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 animate-in slide-in-from-top-2">
                  <div className="w-full md:flex-1">
                    <select 
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-black uppercase text-secundario outline-none focus:border-primario transition-all"
                      value={item.servicio_id}
                      onChange={e => actualizarServicioFila(index, "servicio_id", e.target.value)}
                    >
                      <option value="">Selecciona un servicio</option>
                      {serviciosDisponibles.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full md:w-48 relative">
                    {infoS?.tipo_control === "booleano" ? (
                      <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                        {["si", "no"].map((val) => (
                          <button 
                            key={val} type="button"
                            onClick={() => actualizarServicioFila(index, "valor", val)}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${item.valor === val ? "bg-primario text-white shadow-sm" : "text-gray-400"}`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                          {infoS?.tipo_control === "numero" ? <FaHashtag size={10} /> : <FaFont size={10} />}
                        </div>
                        <input 
                          type={infoS?.tipo_control === "numero" ? "number" : "text"}
                          placeholder={infoS?.tipo_control === "numero" ? "Cantidad" : "Valor"}
                          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-secundario outline-none focus:border-primario"
                          value={item.valor}
                          onChange={e => actualizarServicioFila(index, "valor", e.target.value)}
                        />
                      </>
                    )}
                  </div>

                  <div className="w-full md:w-32 relative">
                    <FaEuroSign className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 size-3" />
                    <input 
                      type="number" step="0.01" value={item.precio_extra}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs font-black text-secundario outline-none focus:border-green-500"
                      onChange={e => actualizarServicioFila(index, "precio_extra", e.target.value)}
                    />
                  </div>

                  <button type="button" onClick={() => eliminarServicioFila(index)} className="p-3 text-gray-300 hover:text-red-500 transition-colors">
                    <FaTrash size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-secundario text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-primario transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
        >
          {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
          {!loading && <FaArrowRight className="group-hover:translate-x-2 transition-transform" />}
        </button>
      </form>
    </div>
  );
}