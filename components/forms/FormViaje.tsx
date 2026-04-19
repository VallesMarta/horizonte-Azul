"use client";

import { useState, useEffect, useCallback } from "react";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaPlane,
  FaArrowRight,
  FaChevronLeft,
  FaGlobeAmericas,
  FaMapMarkerAlt,
  FaAlignLeft,
  FaImage,
  FaPlus,
  FaConciergeBell,
  FaBarcode,
} from "react-icons/fa";
import Cookies from "js-cookie";
import ServicioFila from "@/components/admin/ServicioFila";

interface ServicioFila {
  servicio_id: string;
  valor: string;
  precio_extra: string;
  incluido: string;
  cantidad_incluida: string;
}

interface FormViajeData {
  paisOrigen: string;
  aeropuertoOrigen: string;
  iataOrigen: string;
  paisDestino: string;
  aeropuertoDestino: string;
  iataDestino: string;
  img: string;
  descripcion: string;
}

interface Props {
  modo: "nuevo" | "editar";
  viajeId?: string;
}

export default function FormViaje({ modo, viajeId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serviciosDisponibles, setServiciosDisponibles] = useState<any[]>([]);
  const [serviciosAsignados, setServiciosAsignados] = useState<ServicioFila[]>(
    [],
  );

  const [form, setForm] = useState<FormViajeData>({
    paisOrigen: "",
    aeropuertoOrigen: "",
    iataOrigen: "",
    paisDestino: "",
    aeropuertoDestino: "",
    iataDestino: "",
    img: "",
    descripcion: "",
  });

  const token = Cookies.get("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const set = (k: keyof FormViajeData, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const cargarDatos = useCallback(async () => {
    try {
      const resServicios = await fetch(`${API_URL}/servicios`);
      const dataServicios = await resServicios.json();
      setServiciosDisponibles(dataServicios.resultado || dataServicios);

      if (modo === "editar" && viajeId) {
        const [resViaje, resServs] = await Promise.all([
          fetch(`${API_URL}/viajes/${viajeId}`),
          fetch(`${API_URL}/viaje-servicio/${viajeId}`),
        ]);
        const dataViaje = await resViaje.json();
        const dataServs = await resServs.json();

        const v =
          dataViaje.resultado?.viaje || dataViaje.resultado || dataViaje;
        setForm({
          paisOrigen: v.paisOrigen || "",
          aeropuertoOrigen: v.aeropuertoOrigen || "",
          iataOrigen: v.iataOrigen || "",
          paisDestino: v.paisDestino || "",
          aeropuertoDestino: v.aeropuertoDestino || "",
          iataDestino: v.iataDestino || "",
          img: v.img || "",
          descripcion: v.descripcion || "",
        });

        if (dataServs.ok) {
          setServiciosAsignados(
            (dataServs.resultado || []).map((s: any) => ({
              servicio_id: String(s.servicio_id),
              valor: s.valor || "",
              precio_extra: String(s.precio_extra || "0"),
              incluido: String(s.incluido ?? false),
              cantidad_incluida: String(s.cantidad_incluida ?? 0), // ← nuevo
            })),
          );
        }
      }
    } catch (e) {
      console.error("Error cargando datos:", e);
    }
  }, [modo, viajeId]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const agregarFila = () =>
    setServiciosAsignados((prev) => [
      ...prev,
      {
        servicio_id: "",
        valor: "",
        precio_extra: "0",
        incluido: "false",
        cantidad_incluida: "0",
      },
    ]);

  const actualizarFila = (i: number, k: keyof ServicioFila, v: string) =>
    setServiciosAsignados((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)),
    );

  const eliminarFila = (i: number) =>
    setServiciosAsignados((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      let id = viajeId;

      if (modo === "nuevo") {
        const res = await fetch(`${API_URL}/viajes`, {
          method: "POST",
          headers,
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al crear el viaje");
        const data = await res.json();
        id = String(data.resultado?.id || data.id);
      } else {
        const res = await fetch(`${API_URL}/viajes/${viajeId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al actualizar el viaje");
      }

      // Sincronizar servicios
      const serviciosLimpios = serviciosAsignados
        .filter((s) => s.servicio_id !== "")
        .map((s) => ({
          servicio_id: parseInt(s.servicio_id),
          valor: String(s.valor || ""),
          precio_extra: parseFloat(s.precio_extra) || 0,
          incluido: s.incluido === "true",
          cantidad_incluida: parseInt(s.cantidad_incluida) || 0,
        }));

      await fetch(`${API_URL}/viaje-servicio/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ servicios: serviciosLimpios }),
      });

      router.push("/dashboard/viajes");
      router.refresh();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700 pb-20 ${loading ? "opacity-60 pointer-events-none" : ""}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-1">
        <Link
          href="/dashboard/viajes"
          className="flex items-center gap-2 text-gris hover:text-secundario transition-all font-bold text-[10px] tracking-[0.2em] uppercase"
        >
          <FaChevronLeft size={9} />
          {modo === "nuevo" ? "Volver" : "Cancelar edición"}
        </Link>
        <div className="text-right">
          <h1 className="text-2xl font-black text-titulo-resaltado uppercase tracking-tighter">
            {modo === "nuevo" ? "Nuevo destino" : `Editar destino`}
          </h1>
          {modo === "editar" && viajeId && (
            <p className="text-[10px] text-gris font-bold tracking-widest uppercase">
              #{viajeId}
            </p>
          )}
        </div>
      </div>

      {/* CARD RUTA */}
      <div className="bg-bg rounded-3xl border border-borde shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 relative">
          {/* ORIGEN */}
          <div className="p-8 space-y-5 bg-gris-clarito/20">
            <p className="text-[9px] font-black text-primario uppercase tracking-widest flex items-center gap-2">
              <FaPlane /> Origen
            </p>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gris uppercase tracking-widest flex items-center gap-1.5">
                <FaGlobeAmericas size={9} /> País
              </label>
              <input
                type="text"
                placeholder="Ej: España"
                value={form.paisOrigen}
                onChange={(e) => set("paisOrigen", e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-texto outline-none border-b border-borde focus:border-primario py-1.5 placeholder:text-placeholder transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gris uppercase tracking-widest flex items-center gap-1.5">
                <FaMapMarkerAlt size={9} /> Aeropuerto / Ciudad
              </label>
              <input
                type="text"
                placeholder="Ej: VALENCIA"
                value={form.aeropuertoOrigen}
                onChange={(e) => set("aeropuertoOrigen", e.target.value)}
                required
                className="w-full bg-transparent text-2xl font-black text-titulo-resaltado outline-none uppercase placeholder:text-placeholder/40"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gris uppercase tracking-widest flex items-center gap-1.5">
                <FaBarcode size={9} /> Código IATA
              </label>
              <input
                type="text"
                placeholder="VLC"
                maxLength={3}
                value={form.iataOrigen}
                onChange={(e) =>
                  set("iataOrigen", e.target.value.toUpperCase())
                }
                className="w-full bg-bg border border-borde rounded-xl px-3 py-2 text-sm font-black text-titulo-resaltado uppercase outline-none focus:border-primario tracking-widest transition-colors"
              />
            </div>
          </div>

          {/* DESTINO */}
          <div className="p-8 space-y-5 bg-bg">
            <p className="text-[9px] font-black text-secundario uppercase tracking-widest flex items-center gap-2">
              <FaMapMarkerAlt /> Destino
            </p>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gris uppercase tracking-widest flex items-center gap-1.5">
                <FaGlobeAmericas size={9} /> País
              </label>
              <input
                type="text"
                placeholder="Ej: Irlanda"
                value={form.paisDestino}
                onChange={(e) => set("paisDestino", e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-texto outline-none border-b border-borde focus:border-secundario py-1.5 placeholder:text-placeholder transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gris uppercase tracking-widest flex items-center gap-1.5">
                <FaMapMarkerAlt size={9} /> Aeropuerto / Ciudad
              </label>
              <input
                type="text"
                placeholder="Ej: GALWAY"
                value={form.aeropuertoDestino}
                onChange={(e) => set("aeropuertoDestino", e.target.value)}
                required
                className="w-full bg-transparent text-2xl font-black text-titulo-resaltado outline-none uppercase placeholder:text-placeholder/40"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gris uppercase tracking-widest flex items-center gap-1.5">
                <FaBarcode size={9} /> Código IATA
              </label>
              <input
                type="text"
                placeholder="GWY"
                maxLength={3}
                value={form.iataDestino}
                onChange={(e) =>
                  set("iataDestino", e.target.value.toUpperCase())
                }
                className="w-full bg-bg border border-borde rounded-xl px-3 py-2 text-sm font-black text-titulo-resaltado uppercase outline-none focus:border-secundario tracking-widest transition-colors"
              />
            </div>
          </div>

          {/* SEPARADOR CENTRADO */}
          <div className="hidden lg:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center justify-center z-10">
            <div className="h-[60%] w-px border-l border-dashed border-borde absolute" />
            <div className="bg-bg border border-borde text-primario p-3 rounded-full shadow-sm z-10">
              <FaPlane size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div className="bg-bg rounded-3xl border border-borde p-7 space-y-3 shadow-sm">
        <label className="text-[9px] font-black text-gris uppercase tracking-widest flex items-center gap-2">
          <FaAlignLeft className="text-primario" size={9} /> Descripción del
          destino
        </label>
        <textarea
          placeholder="Describe el destino, qué puede ver el viajero, qué hace especial este vuelo..."
          rows={4}
          value={form.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          className="w-full text-sm font-medium text-texto outline-none bg-transparent resize-none placeholder:text-placeholder leading-relaxed"
        />
      </div>

      {/* IMAGEN */}
      <div className="bg-bg rounded-3xl border border-borde p-7 shadow-sm">
        <label className="text-[9px] font-black text-gris uppercase tracking-widest flex items-center gap-2 mb-4">
          <FaImage className="text-primario" size={9} /> Imagen del destino
        </label>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <input
            type="text"
            placeholder="https://..."
            value={form.img}
            onChange={(e) => set("img", e.target.value)}
            className="flex-1 bg-gris-clarito/30 border border-borde rounded-xl px-4 py-3 text-xs font-bold text-texto outline-none focus:border-primario placeholder:text-placeholder transition-colors"
          />
          {form.img && (
            <div className="w-32 h-20 rounded-xl overflow-hidden border border-borde shadow-sm shrink-0">
              <img
                src={form.img}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* SERVICIOS */}
      <div className="bg-bg rounded-3xl border border-borde p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secundario p-2.5 rounded-xl text-blanco-fijo shadow-md shadow-secundario/20">
              <FaConciergeBell size={14} />
            </div>
            <div>
              <h3 className="font-black text-titulo-resaltado uppercase text-sm tracking-tighter">
                Servicios del destino
              </h3>
              <p className="text-[9px] text-gris font-bold uppercase tracking-widest">
                {serviciosAsignados.length} servicio
                {serviciosAsignados.length !== 1 ? "s" : ""} asignado
                {serviciosAsignados.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={agregarFila}
            className="bg-primario text-blanco-fijo px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-secundario transition-all shadow-md flex items-center gap-2"
          >
            <FaPlus size={10} /> Añadir
          </button>
        </div>

        {serviciosAsignados.length === 0 ? (
          <div className="text-center py-8 text-gris text-xs font-bold uppercase tracking-widest">
            Sin servicios — pulsa "Añadir" para empezar
          </div>
        ) : (
          <div className="space-y-3">
            {serviciosAsignados.map((item, index) => (
              <ServicioFila
                key={index}
                item={item}
                index={index}
                serviciosDisponibles={serviciosDisponibles}
                onActualizar={actualizarFila}
                onEliminar={eliminarFila}
              />
            ))}
          </div>
        )}
      </div>

      {/* BOTÓN SUBMIT */}
      <button
        type="button"
        disabled={loading}
        onClick={handleSubmit}
        className="w-full bg-secundario text-blanco-fijo py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-primario disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group shadow-lg shadow-secundario/20"
      >
        {loading
          ? "Guardando..."
          : modo === "nuevo"
            ? "Publicar destino"
            : "Guardar cambios"}
        {!loading && (
          <FaArrowRight
            className="group-hover:translate-x-1 transition-transform"
            size={14}
          />
        )}
      </button>
    </div>
  );
}
