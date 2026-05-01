"use client";

import { FaMinus, FaPlus, FaPlusCircle, FaEuroSign } from "react-icons/fa";

interface Servicio {
  servicio_id: number;
  nombre: string;
  valor?: string;
  precio_extra: number;
  tipo_control?: string;
}

type ExtrasState = Record<number, { ida: number; vuelta: number }>;

interface Props {
  servicios: Servicio[];
  esPack: boolean;
  extrasState: ExtrasState;
  onChange: (
    servicioId: number,
    vuelo: "ida" | "vuelta" | "ambos",
    delta: number,
    max?: number,
  ) => void;
  modoPack: "ida" | "vuelta" | "pack";
  precioTotal: number;
}

export const ServiciosExtra = ({
  servicios,
  esPack,
  extrasState,
  onChange,
  modoPack,
  precioTotal,
}: Props) => {
  if (!servicios.length) return null;

  return (
    <div className="rounded-3xl overflow-hidden border border-borde-suave bg-card">
      {/* Cabecera */}
      <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-naranja/10 flex items-center justify-center shrink-0">
            <FaPlusCircle size={13} className="text-naranja" />
          </div>
          <div>
            <p className="text-[10px] font-black text-titulo-resaltado uppercase tracking-[0.2em] leading-none">
              Servicios extra
            </p>
            <p className="text-[9px] font-bold text-naranja/70 uppercase tracking-widest mt-0.5">
              {esPack
                ? "Por vuelo — ida y vuelta"
                : "Personaliza tu experiencia"}
            </p>
          </div>
        </div>

        {/* Badge total extras */}
        {precioTotal > 0 && (
          <div className="shrink-0 flex items-center gap-1 bg-naranja/10 border border-naranja/20 px-3 py-1.5 rounded-2xl">
            <FaEuroSign size={8} className="text-naranja" />
            <span className="text-xs font-black text-naranja tabular-nums">
              +{precioTotal.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Header columnas si es pack */}
      {esPack && (
        <div className="grid grid-cols-[1fr_auto] gap-0 px-5 pb-2">
          <div /> {/* spacer nombre */}
          <div className="grid grid-cols-2 gap-2 w-30">
            <p className="text-[8px] font-black text-primario uppercase tracking-widest text-center">
              ✈ Ida
            </p>
            <p className="text-[8px] font-black text-secundario uppercase tracking-widest text-center">
              ↩ Vta
            </p>
          </div>
        </div>
      )}

      {/* Lista servicios */}
      <ul className="px-5 pb-5 space-y-2">
        {servicios.map((s) => {
          const e = extrasState[s.servicio_id] ?? { ida: 0, vuelta: 0 };
          const esNumero = s.tipo_control === "numero";
          const qtyIda = e.ida;
          const qtyVuelta = e.vuelta;
          const qtySimple = modoPack === "vuelta" ? qtyVuelta : qtyIda;
          const activo = esPack ? qtyIda > 0 || qtyVuelta > 0 : qtySimple > 0;
          const lado = modoPack === "vuelta" ? "vuelta" : "ida";

          return (
            <li
              key={s.servicio_id}
              className={`
                flex items-center gap-3 rounded-2xl border px-3 py-3
                transition-all duration-200
                ${
                  activo
                    ? "border-naranja/25 bg-naranja/5"
                    : "border-borde-suave bg-bg hover:border-naranja/20 hover:bg-naranja/2"
                }
              `}
            >
              {/* Info servicio */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-texto leading-none truncate">
                  {s.nombre}
                </p>
                {s.valor && s.valor !== "1" && s.valor !== "true" && (
                  <p className="text-[9px] text-gris-claro mt-0.5 truncate">
                    {s.valor}
                  </p>
                )}
                <p className="text-[9px] font-black text-naranja mt-1">
                  +{s.precio_extra}€{esNumero ? " /ud" : ""}
                </p>
              </div>

              {/* Control(es) */}
              {esPack ? (
                /* Pack: dos controles lado a lado */
                <div className="grid grid-cols-2 gap-2 w-30 shrink-0">
                  {(["ida", "vuelta"] as const).map((tipo) => {
                    const qty = tipo === "ida" ? qtyIda : qtyVuelta;
                    return esNumero ? (
                      <ControlNumero
                        key={tipo}
                        qty={qty}
                        onMinus={() => onChange(s.servicio_id, tipo, -1)}
                        onPlus={() => onChange(s.servicio_id, tipo, 1)}
                      />
                    ) : (
                      <ControlToggle
                        key={tipo}
                        activo={qty > 0}
                        onToggle={() =>
                          onChange(s.servicio_id, tipo, qty > 0 ? -1 : 1, 1)
                        }
                      />
                    );
                  })}
                </div>
              ) : (
                /* Simple: un control */
                <div className="shrink-0">
                  {esNumero ? (
                    <ControlNumero
                      qty={qtySimple}
                      onMinus={() => onChange(s.servicio_id, lado, -1)}
                      onPlus={() => onChange(s.servicio_id, lado, 1)}
                    />
                  ) : (
                    <ControlToggle
                      activo={qtySimple > 0}
                      onToggle={() =>
                        onChange(s.servicio_id, lado, qtySimple > 0 ? -1 : 1, 1)
                      }
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/* ————————————————————————
   Sub-componentes de control
———————————————————————— */

const ControlNumero = ({
  qty,
  onMinus,
  onPlus,
}: {
  qty: number;
  onMinus: () => void;
  onPlus: () => void;
}) => (
  <div className="flex items-center gap-1 justify-center">
    <button
      onClick={onMinus}
      disabled={qty === 0}
      className="w-6 h-6 rounded-lg bg-card border border-borde-suave flex items-center justify-center text-gris hover:border-rojo hover:text-rojo disabled:opacity-25 transition-all duration-150 active:scale-90"
    >
      <FaMinus size={7} />
    </button>
    <span
      className={`w-5 text-center font-black text-xs tabular-nums transition-colors duration-200 ${qty > 0 ? "text-naranja" : "text-gris"}`}
    >
      {qty}
    </span>
    <button
      onClick={onPlus}
      className="w-6 h-6 rounded-lg bg-card border border-borde-suave flex items-center justify-center text-gris hover:border-naranja hover:text-naranja transition-all duration-150 active:scale-90"
    >
      <FaPlus size={7} />
    </button>
  </div>
);

const ControlToggle = ({
  activo,
  onToggle,
}: {
  activo: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className={`
      w-full px-2 py-1.5 rounded-xl
      font-black text-[9px] uppercase tracking-wider
      border-2 transition-all duration-200
      active:scale-95
      ${
        activo
          ? "bg-naranja border-naranja text-blanco-fijo"
          : "bg-card border-borde-suave text-gris hover:border-naranja hover:text-naranja"
      }
    `}
  >
    {activo ? "✓" : "+"}
  </button>
);
