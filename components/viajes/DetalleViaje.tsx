"use client";

import { useState, useMemo } from "react";
import { SelectorVuelos } from "@/components/viajes/SelectorVuelos";
import { WikiCard } from "@/components/viajes/WikiCard";
import { ServiciosIncluidos } from "@/components/viajes/ServiciosIncluidos";
import { ServiciosExtra } from "@/components/viajes/ServiciosExtra";
import { BotonVolver } from "@/components/common/BotonVolver";
import BotonWishlist from "@/components/BotonWishlist";
import CardDescripcion from "@/components/cards/CardDescripcion";
import { FaArrowRight, FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Props {
  datos: { viaje: any; vuelos: any[]; servicios: any[] };
}

type ExtrasState = Record<number, { ida: number; vuelta: number }>;

export default function DetalleViaje({ datos }: Props) {
  const { viaje, vuelos, servicios } = datos;
  const router = useRouter();

  const [vueloIdaId, setVueloIdaId] = useState<number | null>(null);
  const [vueloVueltaId, setVueloVueltaId] = useState<number | null>(null);
  const [modoPack, setModoPack] = useState<"ida" | "vuelta" | "pack">("ida");
  const [extrasState, setExtrasState] = useState<ExtrasState>({});

  const vuelosIda = vuelos.filter((v) => v.tipo === "ida");
  const vuelosVuelta = vuelos.filter((v) => v.tipo === "vuelta");
  const vueloIdaSel = vuelos.find((v) => v.id === vueloIdaId);
  const vueloVueltaSel = vuelos.find((v) => v.id === vueloVueltaId);

  const serviciosIncluidos = servicios.filter((s) => s.incluido);
  const serviciosExtra = servicios.filter(
    (s) => !s.incluido && s.precio_extra > 0,
  );

  const esPack = modoPack === "pack";

  const errorFechas = useMemo(() => {
    if (!esPack || !vueloIdaSel || !vueloVueltaSel) return null;
    if (new Date(vueloVueltaSel.fecSalida) <= new Date(vueloIdaSel.fecSalida))
      return "La fecha de vuelta debe ser posterior a la de ida.";
    return null;
  }, [vueloIdaSel, vueloVueltaSel, esPack]);

  const cambiarExtra = (
    servicioId: number,
    vuelo: "ida" | "vuelta" | "ambos",
    delta: number,
    max?: number,
  ) => {
    setExtrasState((prev) => {
      const current = prev[servicioId] ?? { ida: 0, vuelta: 0 };
      const targets = vuelo === "ambos" ? ["ida", "vuelta"] : [vuelo];
      const next = { ...current };
      for (const t of targets as ("ida" | "vuelta")[]) {
        const nuevo = Math.max(0, (next[t] || 0) + delta);
        if (max !== undefined && nuevo > max) continue;
        next[t] = nuevo;
      }
      return { ...prev, [servicioId]: next };
    });
  };

  const precioExtras = useMemo(() => {
    return serviciosExtra.reduce((acc, s) => {
      const e = extrasState[s.servicio_id] ?? { ida: 0, vuelta: 0 };
      const qtyIda = esPack ? e.ida : modoPack === "ida" ? e.ida : e.vuelta;
      const qtyVuelta = esPack ? e.vuelta : 0;
      return acc + (qtyIda + qtyVuelta) * s.precio_extra;
    }, 0);
  }, [extrasState, serviciosExtra, esPack, modoPack]);

  const precioVuelos = useMemo(() => {
    let t = 0;
    if ((modoPack === "ida" || esPack) && vueloIdaSel)
      t += Number(vueloIdaSel.precio_ajustado);
    if ((modoPack === "vuelta" || esPack) && vueloVueltaSel)
      t += Number(vueloVueltaSel.precio_ajustado);
    return t;
  }, [modoPack, vueloIdaSel, vueloVueltaSel, esPack]);

  const precioTotal = precioVuelos + precioExtras;

  const puedeReservar = useMemo(() => {
    if (errorFechas) return false;
    if (modoPack === "ida") return !!vueloIdaId;
    if (modoPack === "vuelta") return !!vueloVueltaId;
    if (esPack) return !!vueloIdaId && !!vueloVueltaId;
    return false;
  }, [modoPack, vueloIdaId, vueloVueltaId, errorFechas, esPack]);

  const handleReservar = () => {
    const params = new URLSearchParams();
    if (vueloIdaId) params.set("ida", String(vueloIdaId));
    if (vueloVueltaId) params.set("vuelta", String(vueloVueltaId));
    params.set("modo", modoPack);

    const extrasConPrecio: any[] = [];
    for (const s of serviciosExtra) {
      const e = extrasState[s.servicio_id] ?? { ida: 0, vuelta: 0 };
      const qtyIda = modoPack === "ida" || esPack ? e.ida : 0;
      const qtyVuelta = modoPack === "vuelta" || esPack ? e.vuelta : 0;

      if (esPack && qtyIda > 0 && qtyIda === qtyVuelta) {
        extrasConPrecio.push({
          servicio_id: s.servicio_id,
          nombre: s.nombre,
          valor:
            s.valor && s.valor !== "1" && s.valor !== "true" ? s.valor : "",
          cantidad: qtyIda,
          precio_extra: s.precio_extra,
          tipo_vuelo: "ambos",
        });
      } else {
        if (qtyIda > 0)
          extrasConPrecio.push({
            servicio_id: s.servicio_id,
            nombre: s.nombre,
            valor:
              s.valor && s.valor !== "1" && s.valor !== "true" ? s.valor : "",
            cantidad: qtyIda,
            precio_extra: s.precio_extra,
            tipo_vuelo: "ida",
          });
        if (qtyVuelta > 0)
          extrasConPrecio.push({
            servicio_id: s.servicio_id,
            nombre: s.nombre,
            valor:
              s.valor && s.valor !== "1" && s.valor !== "true" ? s.valor : "",
            cantidad: qtyVuelta,
            precio_extra: s.precio_extra,
            tipo_vuelo: "vuelta",
          });
      }
    }
    if (extrasConPrecio.length > 0)
      params.set("extras", JSON.stringify(extrasConPrecio));
    router.push(`/checkout?${params.toString()}`);
  };

  const origenHeader =
    modoPack === "vuelta" ? viaje.aeropuertoDestino : viaje.aeropuertoOrigen;
  const destinoHeader =
    modoPack === "vuelta" ? viaje.aeropuertoOrigen : viaje.aeropuertoDestino;
  const paisOrigenHeader =
    modoPack === "vuelta" ? viaje.paisDestino : viaje.paisOrigen;
  const paisDestinoHeader =
    modoPack === "vuelta" ? viaje.paisOrigen : viaje.paisDestino;

  return (
    <div className="min-h-screen bg-fondo pb-36 sm:pb-40">
      {/* ── HERO ── */}
      <div className="bg-secundario">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6 pb-6 sm:pb-8">
          <BotonVolver texto="Volver" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 gap-0.5">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-blanco-fijo uppercase tracking-tighter leading-none">
                  {origenHeader}
                </h1>
                <FaArrowRight className="text-blanco-fijo/35 text-base hidden sm:block mt-1" />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-blanco-fijo/75 uppercase tracking-tighter leading-none">
                  {destinoHeader}
                </h1>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-blanco-fijo/45 mt-1.5 uppercase tracking-widest">
                {paisOrigenHeader} → {paisDestinoHeader}
              </p>
            </div>
            <div className="shrink-0 mt-1">
              <BotonWishlist viajeId={Number(viaje.id)} />
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6">
        {viaje.descripcion && (
          <CardDescripcion descripcion={viaje.descripcion} />
        )}

        <SelectorVuelos
          vuelosIda={vuelosIda}
          vuelosVuelta={vuelosVuelta}
          modoPack={modoPack}
          setModoPack={(m) => {
            setModoPack(m);
            setExtrasState({});
            if (m === "ida") setVueloVueltaId(null);
            if (m === "vuelta") setVueloIdaId(null);
          }}
          vueloIdaId={vueloIdaId}
          setVueloIdaId={setVueloIdaId}
          vueloVueltaId={vueloVueltaId}
          setVueloVueltaId={setVueloVueltaId}
          errorFechas={errorFechas}
          origenIda={viaje.aeropuertoOrigen}
          destinoIda={viaje.aeropuertoDestino}
          origenVuelta={viaje.aeropuertoDestino}
          destinoVuelta={viaje.aeropuertoOrigen}
        />

        {/* Servicios — stack en mobile, grid en md */}
        {(serviciosIncluidos.length > 0 || serviciosExtra.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviciosIncluidos.length > 0 && (
              <ServiciosIncluidos servicios={serviciosIncluidos} />
            )}
            {serviciosExtra.length > 0 && (
              <ServiciosExtra
                servicios={serviciosExtra}
                esPack={esPack}
                extrasState={extrasState}
                onChange={cambiarExtra}
                modoPack={modoPack}
                precioTotal={precioExtras}
              />
            )}
          </div>
        )}

        {/* Info disclaimer */}
        <div className="flex items-start gap-3 p-3 sm:p-4 bg-primario/5 border border-primario/15 rounded-2xl">
          <FaInfoCircle size={13} className="text-primario shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-gris leading-relaxed">
            Al continuar podrás introducir los datos de los pasajeros, elegir
            método de pago y confirmar tu reserva de forma segura.
            {esPack &&
              " Los servicios extra se aplican por vuelo — puedes elegir diferente para ida y vuelta."}
          </p>
        </div>

        <WikiCard destino={viaje.aeropuertoDestino} />
      </div>

      {/* ── BARRA RESERVA FIJA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-borde-suave bg-card/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          {/* Chips resumen — solo si puede reservar */}
          {puedeReservar && (
            <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1 scrollbar-none">
              {vueloIdaSel && (
                <span className="flex items-center gap-1.5 shrink-0 bg-primario/10 text-primario px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  ✈{" "}
                  {new Date(vueloIdaSel.fecSalida).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                  })}{" "}
                  · {vueloIdaSel.precio_ajustado}€
                </span>
              )}
              {vueloVueltaSel && (
                <span className="flex items-center gap-1.5 shrink-0 bg-secundario/10 text-secundario px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  ↩{" "}
                  {new Date(vueloVueltaSel.fecSalida).toLocaleDateString(
                    "es-ES",
                    { day: "2-digit", month: "short" },
                  )}{" "}
                  · {vueloVueltaSel.precio_ajustado}€
                </span>
              )}
              {precioExtras > 0 && (
                <span className="flex items-center gap-1.5 shrink-0 bg-naranja/10 text-naranja px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  + extras · {precioExtras.toFixed(2)}€
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            {/* Precio total */}
            <div className="min-w-0">
              {precioTotal > 0 ? (
                <>
                  <p className="text-[9px] font-black text-gris uppercase tracking-widest">
                    Total
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl sm:text-3xl font-black text-titulo-resaltado leading-none tabular-nums">
                      {precioTotal.toFixed(2)}
                    </p>
                    <span className="text-sm font-black text-gris">€</span>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-xs font-black text-titulo-resaltado">
                    ¿A dónde volamos?
                  </p>
                  <p className="text-[10px] text-gris font-bold hidden sm:block">
                    Selecciona un vuelo para continuar
                  </p>
                </div>
              )}
            </div>

            {/* Error fechas — solo sm+ */}
            {errorFechas && (
              <p className="text-[10px] font-bold text-rojo flex-1 text-center px-2 hidden sm:block">
                {errorFechas}
              </p>
            )}

            {/* Botón reservar */}
            <button
              onClick={handleReservar}
              disabled={!puedeReservar}
              className={`
                flex items-center gap-1.5 sm:gap-2
                px-4 sm:px-6 py-3 sm:py-4
                rounded-xl sm:rounded-2xl
                font-black text-xs sm:text-sm uppercase tracking-widest
                transition-all duration-200 shrink-0
                ${
                  puedeReservar
                    ? "bg-secundario text-blanco-fijo hover:bg-primario shadow-lg shadow-secundario/20 active:scale-95"
                    : "bg-borde-suave text-gris cursor-not-allowed"
                }
              `}
            >
              <FaShoppingCart size={13} />
              <span className="hidden sm:inline">
                {puedeReservar ? "Reservar" : "Elige un vuelo"}
              </span>
              <span className="sm:hidden">
                {puedeReservar ? "Reservar" : "Vuelo"}
              </span>
              {puedeReservar && <FaArrowRight size={11} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
