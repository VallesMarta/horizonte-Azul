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

  const cargarDatos = useCallback(async () => {
    try {
      const resServicios = await fetch(`${API_URL}/servicios`);
      const dataServicios = await resServicios.json();
      setServiciosDisponibles(dataServicios.resultado || dataServicios);

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
      const resViaje = await fetch(`${API_URL}/viajes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, precio: parseFloat(form.precio) || 0 })
      });

      if (!resViaje.ok) throw new Error("Error al actualizar el viaje");

      const serviciosLimpios = serviciosAsignados
        .filter(s => s.servicio_id !== "")
        .map(s => ({
          servicio_id: parseInt(s.servicio_id),
          valor: String(s.valor || ""),
          precio_extra: parseFloat(s.precio_extra) || 0
        }));

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
        <Link href="/dashboard/viajes" className="flex items-center gap-2 text-secundario/40 dark:text-texto/40 hover:text-secundario transition-all font-bold text-[10px] tracking-[0.2em]">
          <FaChevronLeft size={10} /> CANCELAR EDICIÓN
        </Link>
        <h1 className="text-2xl font-black text-titulo-resaltado uppercase tracking-tighter">
          Editar Vuelo <span className="text-primario">#{id}</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARD DE RUTA */}
        <div className="bg-blanco-fijo dark:bg-gris-clarito rounded-[2.5rem] shadow-xl shadow-secundario/5 border border-gris-borde-suave overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 relative">
            <div className="lg:col-span-5 p-10 space-y-6 bg-gris-clarito/30 dark:bg-transparent">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-primario uppercase tracking-widest flex items-center gap-2"><FaGlobeAmericas /> País de Salida</label>
                <input type="text" value={form.paisOrigen} className="w-full bg-transparent text-base font-bold text-secundario dark:text-titulo-resaltado outline-none border-b border-gris-borde-suave focus:border-primario py-1" onChange={e => setForm({...form, paisOrigen: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gris dark:text-texto/40 uppercase tracking-widest flex items-center gap-2"><FaMapMarkerAlt /> Ciudad de salida</label>
                <input type="text" value={form.aeropuertoOrigen} className="w-full bg-transparent text-2xl font-black text-secundario dark:text-titulo-resaltado outline-none uppercase" onChange={e => setForm({...form, aeropuertoOrigen: e.target.value})} required />
              </div>
              <div className="relative">
                <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gris size-3" />
                <input type="time" value={form.horaSalida} className="w-full bg-blanco-fijo dark:bg-fondo p-3 pl-10 rounded-xl text-sm font-bold text-secundario dark:text-titulo-resaltado shadow-sm outline-none border border-gris-borde-suave" onChange={e => setForm({...form, horaSalida: e.target.value})} />
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col items-center justify-center bg-blanco-fijo dark:bg-gris-clarito py-6 lg:py-0 relative">
              <div className="hidden lg:block h-[60%] w-[1px] border-l border-dashed border-gris dark:border-gris"></div>
              <div className="lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 bg-blanco-fijo dark:bg-fondo border border-gris-borde-suave text-primario p-3 rounded-full shadow-md z-10">
                <FaPlane className="size-4" />
              </div>
            </div>

            <div className="lg:col-span-5 p-10 space-y-6 bg-blanco-fijo dark:bg-transparent">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-primario uppercase tracking-widest flex items-center gap-2"><FaGlobeAmericas /> País de Destino</label>
                <input type="text" value={form.paisDestino} className="w-full bg-transparent text-base font-bold text-secundario dark:text-titulo-resaltado outline-none border-b border-gris-borde-suave focus:border-primario py-1" onChange={e => setForm({...form, paisDestino: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gris dark:text-texto/40 uppercase tracking-widest flex items-center gap-2"><FaMapMarkerAlt /> Ciudad de Llegada</label>
                <input type="text" value={form.aeropuertoDestino} className="w-full bg-transparent text-2xl font-black text-secundario dark:text-titulo-resaltado outline-none uppercase" onChange={e => setForm({...form, aeropuertoDestino: e.target.value})} required />
              </div>
              <div className="relative">
                <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gris size-3" />
                <input type="time" value={form.horaLlegada} className="w-full bg-gris-clarito dark:bg-fondo p-3 pl-10 rounded-xl text-sm font-bold shadow-sm outline-none border border-gris-borde-suave dark:text-titulo-resaltado" onChange={e => setForm({...form, horaLlegada: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        {/* DETALLES */}
        <div className="bg-blanco-fijo dark:bg-gris-clarito p-8 rounded-[2rem] border border-gris-borde-suave space-y-3 shadow-sm group">
          <label className="text-[9px] font-black text-gris dark:text-texto/40 uppercase tracking-widest flex items-center gap-2">
            <FaAlignLeft className="text-primario" /> Detalles del destino
          </label>
          <textarea value={form.descripcion} rows={4} className="w-full text-sm font-medium text-secundario dark:text-titulo-resaltado outline-none bg-transparent resize-none" onChange={e => setForm({...form, descripcion: e.target.value})} />
        </div>

        {/* PRECIO E IMAGEN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blanco-fijo dark:bg-gris-clarito p-6 rounded-[2rem] border border-gris-borde-suave flex items-center gap-5 group hover:border-verde transition-all shadow-sm">
            <div className="bg-verde/10 text-verde p-4 rounded-2xl group-hover:bg-verde group-hover:text-blanco-fijo transition-all"><FaEuroSign size={18} /></div>
            <div className="flex-1">
              <label className="text-[9px] font-black text-gris dark:text-texto/40 uppercase tracking-widest block">Precio Base</label>
              <input type="number" step="0.01" value={form.precio} className="w-full text-xl font-black text-secundario dark:text-titulo-resaltado outline-none bg-transparent" onChange={e => setForm({...form, precio: e.target.value})} />
            </div>
          </div>
          <div className="bg-blanco-fijo dark:bg-gris-clarito p-6 rounded-[2rem] border border-gris-borde-suave flex items-center gap-5 group hover:border-primario transition-all shadow-sm">
            <div className="bg-primario/10 text-primario p-4 rounded-2xl group-hover:bg-primario group-hover:text-blanco-fijo transition-all"><FaImage size={18} /></div>
            <div className="flex-1">
              <label className="text-[9px] font-black text-gris dark:text-texto/40 uppercase tracking-widest block">URL Imagen</label>
              <input type="text" value={form.img} className="w-full text-xs font-bold text-secundario dark:text-titulo-resaltado outline-none bg-transparent" onChange={e => setForm({...form, img: e.target.value})} />
            </div>
          </div>
        </div>

        {/* SECCIÓN DE SERVICIOS */}
        <div className="bg-blanco-fijo dark:bg-gris-clarito p-8 rounded-[2.5rem] border border-gris-borde-suave shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-secundario p-2.5 rounded-xl text-blanco-fijo shadow-lg shadow-secundario/20">
                <FaConciergeBell size={16} />
              </div>
              <div>
                <h3 className="font-black text-secundario dark:text-titulo-resaltado uppercase text-sm tracking-tighter">Servicios Disponibles</h3>
                <p className="text-[9px] text-gris dark:text-texto/40 font-bold uppercase tracking-widest">Personaliza los servicios de este vuelo</p>
              </div>
            </div>
            <button type="button" onClick={agregarServicioFila} className="bg-primario text-blanco-fijo px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-md flex items-center gap-2">
              <FaPlus /> Añadir Servicio
            </button>
          </div>

          <div className="space-y-3">
            {serviciosAsignados.map((item, index) => {
              const infoS = serviciosDisponibles.find(s => s.id === parseInt(item.servicio_id));
              return (
                <div key={index} className="flex flex-col md:flex-row items-center gap-3 p-4 bg-gris-clarito/50 dark:bg-fondo rounded-2xl border border-gris-borde-suave animate-in slide-in-from-top-2">
                  <div className="w-full md:flex-1">
                    <select 
                      className="w-full bg-blanco-fijo dark:bg-gris-clarito border border-gris-borde-suave rounded-xl px-4 py-3 text-xs font-black uppercase text-secundario dark:text-titulo-resaltado outline-none focus:border-primario transition-all"
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
                      <div className="flex bg-blanco-fijo dark:bg-gris-clarito rounded-xl border border-gris-borde-suave p-1">
                        {["si", "no"].map((val) => (
                          <button 
                            key={val} type="button"
                            onClick={() => actualizarServicioFila(index, "valor", val)}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${item.valor === val ? "bg-primario text-blanco-fijo shadow-sm" : "text-gris dark:text-texto/40"}`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gris dark:text-texto/20">
                          {infoS?.tipo_control === "numero" ? <FaHashtag size={10} /> : <FaFont size={10} />}
                        </div>
                        <input 
                          type={infoS?.tipo_control === "numero" ? "number" : "text"}
                          placeholder={infoS?.tipo_control === "numero" ? "Cantidad" : "Valor"}
                          className="w-full bg-blanco-fijo dark:bg-gris-clarito border border-gris-borde-suave rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-secundario dark:text-titulo-resaltado outline-none focus:border-primario"
                          value={item.valor}
                          onChange={e => actualizarServicioFila(index, "valor", e.target.value)}
                        />
                      </>
                    )}
                  </div>

                  <div className="w-full md:w-32 relative">
                    <FaEuroSign className="absolute left-4 top-1/2 -translate-y-1/2 text-verde size-3" />
                    <input 
                      type="number" step="0.01" value={item.precio_extra}
                      className="w-full bg-blanco-fijo dark:bg-gris-clarito border border-gris-borde-suave rounded-xl pl-10 pr-4 py-3 text-xs font-black text-secundario dark:text-titulo-resaltado outline-none focus:border-verde"
                      onChange={e => actualizarServicioFila(index, "precio_extra", e.target.value)}
                    />
                  </div>

                  <button type="button" onClick={() => eliminarServicioFila(index)} className="p-3 text-gris dark:text-texto/20 hover:text-rojo transition-colors">
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
          className="w-full bg-secundario text-blanco-fijo py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-primario transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
        >
          {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
          {!loading && <FaArrowRight className="group-hover:translate-x-2 transition-transform" />}
        </button>
      </form>
    </div>
  );
}