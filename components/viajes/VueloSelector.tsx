"use client";

import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCalendarDay,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

interface VueloSelectorProps {
  vuelo: any;
  precio: number;
  isSelected: boolean;
}

export const VueloSelector = ({
  vuelo,
  precio,
  isSelected,
}: VueloSelectorProps) => {
  const fechaFormateada = new Date(vuelo.fecSalida).toLocaleDateString(
    "es-ES",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
  const horaS = vuelo.horaSalida.slice(0, 5);
  const horaL = vuelo.horaLlegada.slice(0, 5);
  const esIda = vuelo.tipo === "ida";

  return (
    <div
      style={
        isSelected
          ? { boxShadow: "0 8px 28px -6px var(--color-primario, #5271ff)55" }
          : {}
      }
      className={`
        relative group cursor-pointer
        transition-all duration-300 ease-out
        rounded-2xl sm:rounded-3xl
        border-2 overflow-hidden
        ${
          isSelected
            ? "bg-primario border-primario scale-[1.01]"
            : "bg-card border-card-borde hover:border-primario/40 hover:bg-bg-suave"
        }
      `}
    >
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* IZQUIERDA: icono + datos de vuelo */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Icono cuadrado */}
          <div
            className={`
            shrink-0 w-11 h-11 sm:w-13 sm:h-13
            rounded-xl sm:rounded-2xl
            flex items-center justify-center
            transition-colors duration-300
            ${
              isSelected
                ? "bg-blanco-fijo/15"
                : "bg-bg border border-borde-suave"
            }
          `}
          >
            {esIda ? (
              <FaPlaneDeparture
                className={`text-lg sm:text-xl ${isSelected ? "text-blanco-fijo" : "text-primario"}`}
              />
            ) : (
              <FaPlaneArrival
                className={`text-lg sm:text-xl ${isSelected ? "text-blanco-fijo" : "text-secundario"}`}
              />
            )}
          </div>

          {/* Fecha, badge y horas */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${isSelected ? "text-blanco-fijo/60" : "text-gris-claro"}`}
              >
                <FaCalendarDay size={8} /> {fechaFormateada}
              </span>
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-blanco-fijo/20 text-blanco-fijo"
                    : esIda
                      ? "bg-primario/10 text-primario"
                      : "bg-secundario/10 text-secundario"
                }`}
              >
                {vuelo.tipo}
              </span>
            </div>

            {/* Horarios */}
            <div className="flex items-end gap-2 sm:gap-3">
              <div>
                <p
                  className={`text-2xl sm:text-3xl font-black italic leading-none tabular-nums ${isSelected ? "text-blanco-fijo" : "text-titulo-resaltado"}`}
                >
                  {horaS}
                </p>
                <p
                  className={`text-[8px] font-bold uppercase mt-0.5 ${isSelected ? "text-blanco-fijo/40" : "text-texto/35"}`}
                >
                  Salida
                </p>
              </div>

              <div
                className={`flex flex-col items-center pb-4 gap-0.5 ${isSelected ? "text-blanco-fijo/25" : "text-borde"}`}
              >
                <div className="w-6 sm:w-8 h-px bg-current" />
                <FaClock size={8} />
              </div>

              <div>
                <p
                  className={`text-2xl sm:text-3xl font-black italic leading-none tabular-nums ${isSelected ? "text-blanco-fijo" : "text-titulo-resaltado"}`}
                >
                  {horaL}
                </p>
                <p
                  className={`text-[8px] font-bold uppercase mt-0.5 ${isSelected ? "text-blanco-fijo/40" : "text-texto/35"}`}
                >
                  Llegada
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DERECHA: precio + check — siempre al final, sin label "PRECIO:" */}
        <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2 sm:gap-1 shrink-0">
          {isSelected && (
            <FaCheckCircle className="hidden sm:block text-blanco-fijo/80 text-base mb-1" />
          )}
          <span
            className={`text-[9px] font-bold uppercase tracking-widest sm:hidden ${isSelected ? "text-blanco-fijo/50" : "text-gris-claro"}`}
          >
            Desde
          </span>
          <p
            className={`font-black italic leading-none tabular-nums text-2xl sm:text-4xl ${isSelected ? "text-blanco-fijo" : "text-titulo-resaltado"}`}
          >
            {precio}
            <span
              className={`text-sm sm:text-lg ml-px ${isSelected ? "text-blanco-fijo/70" : "text-gris-claro"}`}
            >
              €
            </span>
          </p>
          <span
            className={`text-[9px] font-bold uppercase tracking-widest hidden sm:block ${isSelected ? "text-blanco-fijo/40" : "text-gris-claro"}`}
          >
            / persona
          </span>
        </div>
      </div>

      {/* Shimmer sutil en hover (no seleccionado) */}
      {!isSelected && (
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-r from-transparent via-primario/3 to-transparent" />
      )}
    </div>
  );
};
