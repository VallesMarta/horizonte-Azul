"use client";

import { FaCheckCircle, FaConciergeBell } from "react-icons/fa";

interface Servicio {
  nombre: string;
  cantidad_incluida?: number;
  valor?: string;
}

interface Props {
  servicios: Servicio[];
}

export const ServiciosIncluidos = ({ servicios }: Props) => {
  if (!servicios.length) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-verde/25 bg-verde/5">
      {/* Cabecera */}
      <div className="flex items-start gap-3 px-5 pt-5 pb-4">
        <div className="w-9 h-9 rounded-2xl bg-verde/15 flex items-center justify-center shrink-0 mt-0.5">
          <FaConciergeBell size={13} className="text-verde" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] font-black text-verde uppercase tracking-[0.2em] leading-none">
            Servicios incluidos en tu vuelo
          </p>
          <p className="text-[8px] text-verde/55 uppercase tracking-[0.15em] leading-snug">
            Incluido en todos los vuelos de este viaje, por pasajero
          </p>
          <p className="text-[9px] font-bold text-verde/70 uppercase tracking-widest pt-0.5">
            {servicios.length} servicio{servicios.length !== 1 ? "s" : ""} sin
            coste
          </p>
        </div>
      </div>

      {/* Lista de servicios */}
      <ul className="px-5 pt-4 pb-5 space-y-2">
        {servicios.map((s, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-2xl bg-verde/8 border border-verde/10 group hover:bg-verde/12 transition-colors duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <FaCheckCircle size={10} className="text-verde shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-texto leading-none truncate">
                  {s.nombre}
                </p>
                {s.valor && s.valor !== "1" && s.valor !== "true" && (
                  <p className="text-[9px] text-gris-claro mt-0.5 truncate">
                    {s.valor}
                  </p>
                )}
              </div>
            </div>

            {s.cantidad_incluida && s.cantidad_incluida > 0 ? (
              <span className="shrink-0 text-[9px] font-black text-verde bg-verde/15 px-2 py-0.5 rounded-full">
                ×{s.cantidad_incluida}
              </span>
            ) : (
              <span className="shrink-0 text-[9px] font-black text-verde/70 uppercase tracking-wider">
                ✓
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
