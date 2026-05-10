"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import {
  FaCode,
  FaHeartbeat,
  FaIcons,
  FaExternalLinkAlt,
  FaExclamationTriangle,
  FaSpinner,
  FaTerminal,
} from "react-icons/fa";

const herramientas = [
  {
    id: "api-docs",
    href: "/api-docs",
    icono: <FaCode />,
    label: "API Docs",
    descripcion:
      "Documentación interactiva de todos los endpoints REST de la API. Explora, prueba y consulta los contratos de cada ruta directamente desde el navegador.",
    colorClass: "text-azul",
    bgClass: "bg-azul/10",
    tag: "Swagger / OpenAPI",
  },
  {
    id: "iconos",
    href: "/iconos",
    icono: <FaIcons />,
    label: "Iconos",
    descripcion:
      "Catálogo visual de todos los iconos disponibles en el sistema. Copia el nombre o el componente listo para usar en cualquier parte del proyecto.",
    colorClass: "text-verde",
    bgClass: "bg-verde/10",
    tag: "React Icons",
  },
];

export default function Ajustes() {
  const { isAdmin, usuarioLoggeado } = useAuth();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setCargando(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Protección de seguridad en cliente
  if (!isAdmin && !cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <FaExclamationTriangle className="text-primario size-12 mb-4" />
        <h2 className="text-2xl font-black uppercase">Acceso Denegado</h2>
        <p className="text-gris text-sm mt-2">
          No tienes permisos para acceder a las herramientas de desarrollo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-titulo-resaltado uppercase tracking-tighter">
            Herramientas Dev
          </h1>
          <p className="text-[10px] md:text-xs font-bold text-gris tracking-widest uppercase mt-1">
            {herramientas.length} enlaces de desarrollo disponibles
          </p>
        </div>
      </header>

      {/* LISTADO */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <h2 className="text-[10px] font-black text-gris uppercase tracking-[0.3em]">
            Accesos Directos
          </h2>
          <div className="h-px flex-1" />
        </div>

        {cargando ? (
          <div className="flex justify-center py-20">
            <FaSpinner className="animate-spin text-primario text-4xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {herramientas.map((h) => (
              <a
                key={h.id}
                href={h.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-bg p-5 rounded-4xl border border-borde hover:border-primario/30 transition-all group relative overflow-hidden shadow-sm hover:shadow-md flex flex-col gap-4"
              >
                {/* Cabecera de la card */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-colors ${h.bgClass} ${h.colorClass}`}
                  >
                    {h.icono}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-secundario font-black uppercase text-[11px] mb-0.5">
                      {h.label}
                    </h4>
                    <p
                      className={`text-[9px] font-black uppercase tracking-widest ${h.colorClass}`}
                    >
                      {h.tag}
                    </p>
                  </div>

                  <FaExternalLinkAlt
                    size={13}
                    className="text-gris group-hover:text-primario transition-colors shrink-0"
                  />
                </div>

                {/* Descripción */}
                <p className="text-gris text-xs leading-relaxed font-medium">
                  {h.descripcion}
                </p>

                {/* URL chip */}
                <div className="flex items-center gap-2 bg-input-bg rounded-2xl px-3 py-2">
                  <FaTerminal className="text-primario/60 size-3 shrink-0" />
                  <span className="text-[10px] font-black text-primario/70 tracking-widest truncate">
                    {h.href}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
