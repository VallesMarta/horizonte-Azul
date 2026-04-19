"use client";

import { useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaChair,
  FaEuroSign,
  FaPlane,
  FaSave,
  FaTimes,
} from "react-icons/fa";

export interface FormVueloData {
  fecSalida: string;
  horaSalida: string;
  fecLlegada: string;
  horaLlegada: string;
  plazasTotales: string;
  precio_ajustado: string;
  tipo: "ida" | "vuelta";
  estado: "programado" | "abordando" | "en_vuelo" | "completado" | "cancelado";
}

const ESTADO_COLORES: Record<string, string> = {
  programado: "text-verde border-verde",
  abordando: "text-naranja border-naranja",
  en_vuelo: "text-azul border-azul",
  completado: "text-morado border-morado",
  cancelado: "text-rojo border-rojo",
};

const ESTADO_LABELS: Record<string, string> = {
  programado: "Programado",
  abordando: "Abordando",
  en_vuelo: "En vuelo",
  completado: "Completado",
  cancelado: "Cancelado",
};

interface Props {
  inicial?: Partial<FormVueloData>;
  onSubmit: (data: FormVueloData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  titulo: string;
}

export default function FormVuelo({
  inicial,
  onSubmit,
  onCancel,
  loading,
  titulo,
}: Props) {
  const [form, setForm] = useState<FormVueloData>({
    fecSalida: inicial?.fecSalida ?? "",
    horaSalida: inicial?.horaSalida ?? "",
    fecLlegada: inicial?.fecLlegada ?? "",
    horaLlegada: inicial?.horaLlegada ?? "",
    plazasTotales: inicial?.plazasTotales ?? "150",
    precio_ajustado: inicial?.precio_ajustado ?? "",
    tipo: inicial?.tipo ?? "ida",
    estado: inicial?.estado ?? "programado",
  });

  const set = (k: keyof FormVueloData, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-black text-titulo-resaltado uppercase tracking-tighter">
        {titulo}
      </h2>

      {/* TIPO */}
      <div className="flex gap-2">
        {(["ida", "vuelta"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => set("tipo", t)}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest border-2 transition-all ${
              form.tipo === t
                ? "bg-primario text-blanco-fijo border-primario"
                : "bg-fondo text-gris border-gris-borde-suave hover:border-primario"
            }`}
          >
            {t === "ida" ? "✈ Ida" : "↩ Vuelta"}
          </button>
        ))}
      </div>

      {/* FECHAS Y HORAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-fondo border border-gris-borde-suave rounded-2xl p-5 space-y-3">
          <p className="text-[9px] font-black text-primario uppercase tracking-widest flex items-center gap-2">
            <FaPlane /> Salida
          </p>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gris size-3" />
            <input
              type="date"
              value={form.fecSalida}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => set("fecSalida", e.target.value)}
              className="w-full bg-borde-suave border border-gris-borde-suave rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-texto outline-none focus:border-primario"
            />
          </div>
          <div className="relative">
            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gris size-3" />
            <input
              type="time"
              value={form.horaSalida}
              onChange={(e) => set("horaSalida", e.target.value)}
              className="w-full bg-borde-suave border border-gris-borde-suave rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-texto outline-none focus:border-primario"
            />
          </div>
        </div>

        <div className="bg-fondo border border-gris-borde-suave rounded-2xl p-5 space-y-3">
          <p className="text-[9px] font-black text-secundario uppercase tracking-widest flex items-center gap-2">
            <FaPlane className="rotate-180" /> Llegada
          </p>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gris size-3" />
            <input
              type="date"
              value={form.fecLlegada}
              min={form.fecSalida || new Date().toISOString().split("T")[0]}
              onChange={(e) => set("fecLlegada", e.target.value)}
              className="w-full bg-borde-suave border border-gris-borde-suave rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-texto outline-none focus:border-secundario"
            />
          </div>
          <div className="relative">
            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gris size-3" />
            <input
              type="time"
              value={form.horaLlegada}
              onChange={(e) => set("horaLlegada", e.target.value)}
              className="w-full bg-borde-suave border border-gris-borde-suave rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-texto outline-none focus:border-secundario"
            />
          </div>
        </div>
      </div>

      {/* PLAZAS Y PRECIO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-fondo border border-gris-borde-suave rounded-2xl p-5 flex items-center gap-4 group hover:border-azul transition-all">
          <div className="bg-azul/10 text-azul p-3 rounded-xl group-hover:bg-azul group-hover:text-blanco-fijo transition-all">
            <FaChair size={16} />
          </div>
          <div className="flex-1">
            <label className="text-[9px] font-black text-gris uppercase tracking-widest block">
              Plazas totales
            </label>
            <input
              type="number"
              min={1}
              value={form.plazasTotales}
              onChange={(e) => set("plazasTotales", e.target.value)}
              className="w-full text-xl font-black text-titulo-resaltado outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="bg-fondo border border-gris-borde-suave rounded-2xl p-5 flex items-center gap-4 group hover:border-verde transition-all">
          <div className="bg-verde/10 text-verde p-3 rounded-xl group-hover:bg-verde group-hover:text-blanco-fijo transition-all">
            <FaEuroSign size={16} />
          </div>
          <div className="flex-1">
            <label className="text-[9px] font-black text-gris uppercase tracking-widest block">
              Precio base
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.precio_ajustado}
              onChange={(e) => set("precio_ajustado", e.target.value)}
              className="w-full text-xl font-black text-titulo-resaltado outline-none bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* ESTADO */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {(
          [
            "programado",
            "abordando",
            "en_vuelo",
            "completado",
            "cancelado",
          ] as const
        ).map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => set("estado", e)}
            className={`py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
              form.estado === e
                ? ESTADO_COLORES[e] + " bg-fondo"
                : "border-gris-borde-suave text-gris hover:border-gris"
            }`}
          >
            {ESTADO_LABELS[e]}
          </button>
        ))}
      </div>

      {/* BOTONES */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-gris-borde-suave text-gris hover:border-rojo hover:text-rojo transition-all flex items-center justify-center gap-2"
        >
          <FaTimes /> Cancelar
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => onSubmit(form)}
          className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-secundario text-blanco-fijo hover:bg-primario disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <FaSave /> {loading ? "Guardando..." : "Guardar vuelo"}
        </button>
      </div>
    </div>
  );
}
