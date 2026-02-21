"use client";

import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/lib/api";
import {
  FaPlus,
  FaTrash,
  FaConciergeBell,
  FaSpinner,
  FaFont,
  FaHashtag,
  FaToggleOn,
} from "react-icons/fa";

export default function GestionServicios() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [nombre, setNombre] = useState("");
  const [tipoControl, setTipoControl] = useState("texto");
  const [cargando, setCargando] = useState(true);

  const configTipos: Record<
    string,
    { icono: any; label: string; colorClass: string; bgClass: string }
  > = {
    texto: {
      icono: <FaFont />,
      label: "Texto",
      colorClass: "text-blue-500",
      bgClass: "bg-blue-500/10",
    },
    numero: {
      icono: <FaHashtag />,
      label: "Numérico",
      colorClass: "text-verde",
      bgClass: "bg-verde/10",
    },
    booleano: {
      icono: <FaToggleOn />,
      label: "Booleano",
      colorClass: "text-orange-500",
      bgClass: "bg-orange-500/10",
    },
  };

  const listarServicios = useCallback(async () => {
    try {
      const respuesta = await fetch(`${API_URL}/servicios`);
      if (respuesta.ok) {
        const data = await respuesta.json();
        setServicios(data.resultado || data);
      }
    } catch (error) {
      console.error("Error al obtener servicios:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    listarServicios();
  }, [listarServicios]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      const res = await fetch(`${API_URL}/servicios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          tipo_control: tipoControl,
        }),
      });

      if (res.ok) {
        setNombre("");
        setTipoControl("texto");
        listarServicios();
      }
    } catch (error) {
      alert("Error al crear el servicio");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este servicio?")) return;
    try {
      const res = await fetch(`${API_URL}/servicios/${id}`, {
        method: "DELETE",
      });
      if (res.ok) listarServicios();
    } catch (error) {
      alert("No se pudo eliminar");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-titulo-resaltado uppercase tracking-tighter">
            Panel de Servicios
          </h1>
          <p className="text-[10px] md:text-xs font-bold text-gris dark:text-texto/40 tracking-widest uppercase mt-1">
            {servicios.length} servicios activos
          </p>
        </div>
      </header>

      {/* FORMULARIO */}
      <section className="bg-blanco-fijo dark:bg-gris-clarito p-4 md:p-3 rounded-[2rem] shadow-xl shadow-secundario/5 border border-gris-borde-suave">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row items-center gap-4"
        >
          {/* Input Principal */}
          <div className="relative w-full flex-1">
            <FaConciergeBell className="absolute left-5 top-1/2 -translate-y-1/2 text-primario size-4" />
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ej: WiFi, Maleta Extra..."
              className="w-full bg-gris-clarito dark:bg-fondo border-2 border-transparent focus:border-primario/20 rounded-[1.5rem] py-4 pl-12 pr-4 font-bold text-secundario dark:text-titulo-resaltado transition-all outline-none text-sm md:text-base"
            />
          </div>

          {/* Selector de Tipo */}
          <div className="flex w-full lg:w-auto justify-center gap-2 bg-gris-clarito dark:bg-fondo p-1.5 rounded-[1.5rem] border border-gris-borde-suave">
            {Object.keys(configTipos).map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setTipoControl(tipo)}
                className={`
                  flex-1 lg:flex-none w-12 h-12 md:w-14 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300
                  ${
                    tipoControl === tipo
                      ? `bg-blanco-fijo dark:bg-gris-clarito ${configTipos[tipo].colorClass} shadow-md scale-105 border border-gris-borde-suave`
                      : "text-gris hover:bg-gris-borde-suave/50"
                  }
                `}
              >
                <span className="text-xl">{configTipos[tipo].icono}</span>
              </button>
            ))}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full lg:w-auto bg-secundario text-blanco-fijo h-14 px-8 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-primario transition-all shadow-lg shadow-secundario/10 flex items-center justify-center gap-2 shrink-0 group"
          >
            <FaPlus className="group-hover:rotate-90 transition-transform" />
            <span>Añadir</span>
          </button>
        </form>
      </section>

      {/* LISTADO DE SERVICIOS */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <h2 className="text-[10px] font-black text-gris dark:text-texto/40 uppercase tracking-[0.3em]">
            Servicios disponibles
          </h2>
          <div className="h-px bg-gris-borde-suave dark:bg-gris-borde-suave/20 flex-1"></div>
        </div>

        {cargando ? (
          <div className="flex justify-center py-20">
            <FaSpinner className="animate-spin text-primario text-4xl" />
          </div>
        ) : servicios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {servicios.map((s) => {
              const config = configTipos[s.tipo_control] || configTipos.texto;
              return (
                <div
                  key={s.id}
                  className="bg-blanco-fijo dark:bg-gris-clarito p-5 rounded-[2rem] border border-gris-borde-suave hover:border-primario/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-colors ${config.bgClass} ${config.colorClass}`}
                    >
                      {config.icono}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-secundario dark:text-titulo-resaltado uppercase text-xs truncate mb-0.5">
                        {s.nombre}
                      </h4>
                      <p
                        className={`text-[9px] font-black uppercase tracking-widest ${config.colorClass}`}
                      >
                        {config.label}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(s.id)}
                      className="w-9 h-9 flex items-center justify-center text-gris dark:text-texto/20 hover:text-rojo hover:bg-rojo/10 rounded-xl transition-all"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-blanco-fijo dark:bg-gris-clarito border-2 border-dashed border-gris-borde-suave rounded-[2.5rem] py-16 px-6 flex flex-col items-center justify-center text-center">
            <div className="bg-gris-clarito dark:bg-fondo p-5 rounded-3xl shadow-sm mb-4">
              <FaConciergeBell className="text-gris/30 size-10" />
            </div>
            <p className="text-gris font-bold text-sm uppercase tracking-widest">
              Sin servicios
            </p>
            <p className="text-gris/60 text-xs mt-1">
              Comienza agregando uno arriba.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
