"use client";

import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import {
  FaPlus,
  FaTrash,
  FaConciergeBell,
  FaSpinner,
  FaFont,
  FaHashtag,
  FaToggleOn,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function GestionServicios() {
  const { isAdmin, usuarioLoggeado } = useAuth();
  const [servicios, setServicios] = useState<any[]>([]);
  const [nombre, setNombre] = useState("");
  const [tipoControl, setTipoControl] = useState("texto");
  const [cargando, setCargando] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const configTipos: Record<
    string,
    { icono: any; label: string; colorClass: string; bgClass: string }
  > = {
    texto: {
      icono: <FaFont />,
      label: "Texto",
      colorClass: "text-azul",
      bgClass: "bg-azul/10",
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
      colorClass: "text-naranja",
      bgClass: "bg-naranja/10",
    },
  };

  const listarServicios = useCallback(async () => {
    try {
      const respuesta = await fetch(`${API_URL}/servicios`);
      if (respuesta.ok) {
        const data = await respuesta.json();
        setServicios(data.resultado || []);
      }
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      setErrorStatus("Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    listarServicios();
  }, [listarServicios]);

  // Protección de seguridad en cliente
  if (!isAdmin && !cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <FaExclamationTriangle className="text-primario size-12 mb-4" />
        <h2 className="text-2xl font-black uppercase">Acceso Denegado</h2>
        <p className="text-gris text-sm mt-2">
          No tienes permisos para gestionar servicios.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/servicios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          tipo_control: tipoControl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setNombre("");
        setTipoControl("texto");
        listarServicios();
      } else {
        alert(data.error || "Error al crear el servicio");
      }
    } catch (error) {
      alert("Error de red al intentar crear el servicio");
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "¿Seguro que quieres eliminar este servicio? No se podrá deshacer.",
      )
    )
      return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/servicios/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        listarServicios();
      } else {
        const data = await res.json();
        // Muestra el mensaje de error de Postgres (ej: FK violation)
        alert(data.error || "No se pudo eliminar el servicio");
      }
    } catch (error) {
      alert("Error de red al intentar eliminar");
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
          <p className="text-[10px] md:text-xs font-bold text-gris tracking-widest uppercase mt-1">
            {servicios.length} servicios registrados en el sistema
          </p>
        </div>
      </header>

      {/* FORMULARIO DE CREACIÓN */}
      <section className="bg-bg p-4 md:p-3 rounded-4xl shadow-xl shadow-secundario/5 border border-borde">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row items-center gap-4"
        >
          {/* Input Nombre */}
          <div className="relative w-full flex-1">
            <FaConciergeBell className="absolute left-5 top-1/2 -translate-y-1/2 text-primario size-4" />
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ej: Acceso VIP, Maleta 23kg..."
              className="w-full bg-input-bg  border-2 border-transparent focus:border-primario/20 rounded-3xl py-4 pl-12 pr-4 font-bold text-primario transition-all outline-none text-sm md:text-base"
            />
          </div>

          {/* Selector de Tipo de Control */}
          <div className="flex w-full lg:w-auto justify-center gap-2 p-1.5 rounded-3xl">
            {Object.keys(configTipos).map((tipo) => (
              <button
                key={tipo}
                type="button"
                title={`Tipo: ${configTipos[tipo].label}`}
                onClick={() => setTipoControl(tipo)}
                className={`
                  flex-1 lg:flex-none w-12 h-12 md:w-14 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300
                  ${
                    tipoControl === tipo
                      ? `bg-bg ${configTipos[tipo].colorClass} shadow-md scale-105 border`
                      : "text-gris hover:bg-gris-borde-suave/50"
                  }
                `}
              >
                <span className="text-xl">{configTipos[tipo].icono}</span>
              </button>
            ))}
          </div>

          {/* Botón Guardar */}
          <button
            type="submit"
            className="w-full lg:w-auto bg-secundario text-white h-14 px-8 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primario transition-all shadow-lg shadow-secundario/10 flex items-center justify-center gap-2 shrink-0 group"
          >
            <FaPlus className="group-hover:rotate-90 transition-transform" />
            <span>Añadir Servicio</span>
          </button>
        </form>
      </section>

      {/* LISTADO RESULTADOS */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <h2 className="text-[10px] font-black text-gris uppercase tracking-[0.3em]">
            Inventario de Servicios
          </h2>
          <div className="h-px flex-1"></div>
        </div>

        {cargando ? (
          <div className="flex justify-center py-20">
            <FaSpinner className="animate-spin text-primario text-4xl" />
          </div>
        ) : servicios.length != 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {servicios.map((s) => {
              const config = configTipos[s.tipo_control] || configTipos.texto;
              return (
                <div
                  key={s.id}
                  className="bg-bg p-5 rounded-4xl border border-borde hover:border-primario/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-colors ${config.bgClass} ${config.colorClass}`}
                    >
                      {config.icono}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-secundario font-black uppercase text-[11px] mb-0.5">
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
                      className="w-9 h-9 flex items-center justify-center text-gris hover:text-rojo hover:bg-rojo/10 rounded-xl transition-all"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-bg border-2 border-dashed border-placeholder/20 rounded-[2.5rem] py-16 px-6 flex flex-col items-center justify-center text-center">
            <div className="bg-bg p-5 rounded-3xl shadow-sm mb-4 border border-borde">
              <FaConciergeBell className="text-primario size-10" />
            </div>
            <p className="text-gris font-bold text-sm uppercase tracking-widest">
              No hay servicios configurados
            </p>
            <p className="text-gris/60 text-xs mt-1">
              Los servicios permiten añadir extras personalizables a los viajes.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
