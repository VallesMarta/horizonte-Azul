"use client";

import {
  FaPlane,
  FaExchangeAlt,
  FaArrowRight,
  FaInfoCircle,
} from "react-icons/fa";
import { VueloSelector } from "@/components/viajes/VueloSelector";

interface Props {
  vuelosIda: any[];
  vuelosVuelta: any[];
  modoPack: "ida" | "vuelta" | "pack";
  setModoPack: (m: "ida" | "vuelta" | "pack") => void;
  vueloIdaId: number | null;
  setVueloIdaId: (id: number | null) => void;
  vueloVueltaId: number | null;
  setVueloVueltaId: (id: number | null) => void;
  errorFechas: string | null;
  origenIda?: string;
  destinoIda?: string;
  origenVuelta?: string;
  destinoVuelta?: string;
}

const MODOS = [
  {
    key: "ida",
    label: "Solo ida",
    labelCorto: "Ida",
    icon: <FaPlane size={10} />,
  },
  {
    key: "vuelta",
    label: "Solo vuelta",
    labelCorto: "Vuelta",
    icon: <FaPlane size={10} className="rotate-180" />,
  },
  {
    key: "pack",
    label: "Ida + Vuelta",
    labelCorto: "Pack",
    icon: <FaExchangeAlt size={10} />,
  },
] as const;

export const SelectorVuelos = ({
  vuelosIda,
  vuelosVuelta,
  modoPack,
  setModoPack,
  vueloIdaId,
  setVueloIdaId,
  vueloVueltaId,
  setVueloVueltaId,
  errorFechas,
  origenIda,
  destinoIda,
  origenVuelta,
  destinoVuelta,
}: Props) => {
  const mostrarIda = modoPack === "ida" || modoPack === "pack";
  const mostrarVuelta = modoPack === "vuelta" || modoPack === "pack";

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* SELECTOR DE MODO */}
      <div className="bg-bg-suave border border-borde-suave rounded-2xl p-1.5 flex gap-1">
        {MODOS.map((m) => (
          <button
            key={m.key}
            onClick={() => setModoPack(m.key)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 sm:gap-2
              py-2.5 sm:py-3 rounded-xl
              font-black text-[9px] sm:text-[10px] uppercase tracking-widest
              transition-all duration-200
              ${
                modoPack === m.key
                  ? "bg-primario text-blanco-fijo shadow-md shadow-primario/20"
                  : "text-gris hover:text-texto"
              }
            `}
          >
            {m.icon}
            {/* En mobile usamos label corto */}
            <span className="hidden xs:inline sm:hidden">{m.labelCorto}</span>
            <span className="inline xs:hidden sm:inline">{m.label}</span>
          </button>
        ))}
      </div>

      {/* VUELOS IDA */}
      {mostrarIda && (
        <div className="space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <FaPlane size={12} className="text-primario" />
            <h3 className="text-[10px] font-black text-primario uppercase tracking-widest">
              {origenIda && destinoIda
                ? `${origenIda} → ${destinoIda}`
                : "Vuelos de ida"}
            </h3>
            <span className="text-[9px] font-bold text-gris">
              ({vuelosIda.length} opción{vuelosIda.length !== 1 ? "es" : ""})
            </span>
          </div>

          {vuelosIda.length === 0 ? (
            <div className="flex items-center gap-2 p-4 bg-bg-suave border border-borde-suave rounded-2xl text-gris text-xs font-bold">
              <FaInfoCircle size={12} /> No hay vuelos de ida disponibles
            </div>
          ) : (
            vuelosIda.map((v) => (
              <div
                key={v.id}
                onClick={() => setVueloIdaId(v.id === vueloIdaId ? null : v.id)}
              >
                <VueloSelector
                  vuelo={v}
                  precio={v.precio_ajustado}
                  isSelected={vueloIdaId === v.id}
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* VUELOS VUELTA */}
      {mostrarVuelta && (
        <div className="space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <FaPlane size={12} className="text-primario rotate-180" />
            <h3 className="text-[10px] font-black text-primario uppercase tracking-widest">
              {origenVuelta && destinoVuelta
                ? `${origenVuelta} → ${destinoVuelta}`
                : "Vuelos de vuelta"}
            </h3>
            <span className="text-[9px] font-bold text-gris">
              ({vuelosVuelta.length} opción
              {vuelosVuelta.length !== 1 ? "es" : ""})
            </span>
          </div>

          {vuelosVuelta.length === 0 ? (
            <div className="flex items-center gap-2 p-4 bg-bg-suave border border-borde-suave rounded-2xl text-gris text-xs font-bold">
              <FaInfoCircle size={12} /> No hay vuelos de vuelta disponibles
            </div>
          ) : (
            vuelosVuelta.map((v) => (
              <div
                key={v.id}
                onClick={() =>
                  setVueloVueltaId(v.id === vueloVueltaId ? null : v.id)
                }
              >
                <VueloSelector
                  vuelo={v}
                  precio={v.precio_ajustado}
                  isSelected={vueloVueltaId === v.id}
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* ERROR FECHAS */}
      {errorFechas && (
        <div className="flex items-center gap-2 p-3 sm:p-4 bg-rojo/10 border border-rojo/30 rounded-2xl text-rojo text-xs font-bold">
          <FaInfoCircle size={12} className="shrink-0" /> {errorFechas}
        </div>
      )}
    </div>
  );
};
