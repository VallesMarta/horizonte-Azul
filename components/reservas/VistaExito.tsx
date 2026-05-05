"use client";

import {
  FaCheckCircle,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaDownload,
  FaHome,
  FaHashtag,
  FaCheckDouble,
} from "react-icons/fa";
import dynamic from "next/dynamic";
import { ResumenReservaPDF } from "@/components/reservas/ResumenReservaPDF";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false },
);

export function VistaExito({ datos, router }: { datos: any; router: any }) {
  if (!datos?.vuelos || !datos?.pasajeros || !datos?.pago) {
    return (
      <div className="py-20 text-center">
        <p className="text-gris font-bold animate-pulse text-xs uppercase tracking-widest">
          Cargando reserva...
        </p>
      </div>
    );
  }

  const nPax = datos.nPasajeros ?? datos.pasajeros.length;
  const tieneIda = datos.vuelos.some((v: any) => v.tipo === "ida");
  const tieneVuelta = datos.vuelos.some((v: any) => v.tipo === "vuelta");

  const serviciosIncluidos = datos.serviciosIncluidos || [];
  const serviciosAdicionales = datos.extras || [];
  const hayServicios =
    serviciosIncluidos.length > 0 || serviciosAdicionales.length > 0;

  // Texto explicativo dinámico según tramos comprados
  const textoServiciosIncluidos = (() => {
    if (tieneIda && tieneVuelta)
      return `Estos servicios aplican a cada pasajero en ambos tramos del viaje (ida y vuelta).`;
    if (tieneIda)
      return `Estos servicios aplican a cada pasajero en el vuelo de ida.`;
    return `Estos servicios aplican a cada pasajero en el vuelo de vuelta.`;
  })();

  // Texto explicativo para extras
  const textoExtras = `Los extras se contratan como unidades totales para el grupo — no por pasajero. Si necesitáis repartirlos entre vosotros, podéis organizaros libremente.`;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* CABECERA ÉXITO */}
      <div className="text-center space-y-3 py-4">
        <div className="bg-verde/10 border-2 border-verde/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <FaCheckCircle size={28} className="text-verde" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-titulo-resaltado uppercase tracking-tighter">
            ¡Reserva confirmada!
          </h2>
          <div className="inline-flex items-center gap-1.5 bg-primario/10 border border-primario/20 px-4 py-1.5 rounded-full mt-2">
            <FaHashtag size={9} className="text-primario" />
            <span className="text-xs font-black text-primario tracking-widest">
              {datos.id}
            </span>
          </div>
        </div>
        <p className="text-sm font-bold text-gris">
          Total pagado:{" "}
          <span className="text-titulo-resaltado font-black text-lg">
            {Number(datos.pago.total).toFixed(2)}€
          </span>
        </p>
      </div>

      {/* ITINERARIO */}
      <div className="bg-secundario rounded-3xl p-5 space-y-3 shadow-lg shadow-secundario/20">
        <p className="text-[9px] font-black text-blanco-fijo/50 uppercase tracking-widest">
          Itinerario
        </p>
        {datos.vuelos.map((v: any, i: number) => (
          <div
            key={i}
            className={`flex items-start justify-between gap-3 ${i > 0 ? "pt-3 border-t border-blanco-fijo/10" : ""}`}
          >
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              {v.tipo === "ida" ? (
                <FaPlaneDeparture
                  size={12}
                  className="text-blanco-fijo/60 shrink-0 mt-0.5"
                />
              ) : (
                <FaPlaneArrival
                  size={12}
                  className="text-blanco-fijo/60 shrink-0 mt-0.5"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-black text-blanco-fijo truncate">
                  {v.tipo === "ida" ? v.trayectoIda : v.trayectoVuelta}
                </p>
                <p className="text-[10px] text-blanco-fijo/50 font-bold">
                  {v.fecha_salida} · {v.hora_salida}
                  {v.hora_llegada ? ` → ${v.hora_llegada}` : ""}
                </p>
              </div>
            </div>
            <span className="text-sm font-black text-blanco-fijo shrink-0">
              {(Number(v.precio) * nPax).toFixed(2)}€
            </span>
          </div>
        ))}
      </div>

      {/* PASAJEROS */}
      <div className="bg-bg border border-borde rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-primario/5 px-5 py-3 border-b border-borde flex items-center justify-between">
          <p className="text-[10px] font-black text-primario uppercase tracking-widest">
            Pasajeros
          </p>
          <span className="text-[9px] font-black text-primario bg-primario/10 px-2 py-0.5 rounded-full">
            {nPax}
          </span>
        </div>
        <div className="divide-y divide-borde">
          {datos.pasajeros.map((p: any, i: number) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <div className="w-7 h-7 rounded-full bg-primario/10 flex items-center justify-center text-primario text-[10px] font-black shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-titulo-resaltado uppercase truncate">
                  {p.nombreCompleto}
                </p>
                <p className="text-[10px] text-gris font-bold">{p.documento}</p>
                {p.fecNacimiento && (
                  <p className="text-[10px] text-gris-claro font-bold">
                    Nac: {p.fecNacimiento}
                  </p>
                )}
              </div>
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                  p.tipo === "Adulto"
                    ? "bg-primario/10 text-primario"
                    : "bg-naranja/10 text-naranja"
                }`}
              >
                {p.tipo}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICIOS */}
      {hayServicios && (
        <div className="bg-bg border border-borde rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-primario/5 px-5 py-3 border-b border-borde">
            <p className="text-[10px] font-black text-primario uppercase tracking-widest">
              Servicios
            </p>
          </div>
          <div className="p-5 space-y-4">
            {/* Incluidos */}
            {serviciosIncluidos.length > 0 && (
              <div>
                <p className="text-[9px] font-black text-verde uppercase tracking-widest mb-1">
                  ✓ Incluidos en la tarifa
                </p>
                <p className="text-[10px] text-gris font-bold mb-2.5 leading-relaxed">
                  {textoServiciosIncluidos}
                </p>
                <div className="space-y-1.5">
                  {serviciosIncluidos.map((s: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-verde/5 border border-verde/15 px-3 py-2 rounded-xl"
                    >
                      <span className="text-xs font-bold text-texto flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-verde shrink-0" />
                        {s.nombre}
                        {s.cantidad_incluida > 0 && (
                          <span className="text-[9px] font-black text-verde bg-verde/10 px-1.5 rounded-full">
                            ×{s.cantidad_incluida}
                          </span>
                        )}
                      </span>
                      <span className="text-[9px] font-black text-verde uppercase">
                        Gratis
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extras pagados */}
            {serviciosAdicionales.length > 0 && (
              <div
                className={
                  serviciosIncluidos.length > 0
                    ? "pt-4 border-t border-dashed border-borde"
                    : ""
                }
              >
                <p className="text-[9px] font-black text-naranja uppercase tracking-widest mb-1">
                  + Extras contratados
                </p>
                <p className="text-[10px] text-gris font-bold mb-2.5 leading-relaxed">
                  {textoExtras}
                </p>
                <div className="space-y-1.5">
                  {serviciosAdicionales.map((e: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-naranja/5 border border-naranja/15 px-3 py-2 rounded-xl"
                    >
                      <div>
                        <span className="text-xs font-black text-titulo-resaltado">
                          {e.nombre}{" "}
                          <span className="text-naranja font-bold">
                            ×{e.cantidad}
                          </span>
                        </span>
                        {e.tipo_vuelo && e.tipo_vuelo !== "ambos" && (
                          <p className="text-[9px] text-gris mt-0.5">
                            {e.tipo_vuelo === "ida"
                              ? "Solo ida"
                              : "Solo vuelta"}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-black text-titulo-resaltado">
                        {typeof e.subtotal === "string"
                          ? e.subtotal
                          : `${Number(e.subtotal).toFixed(2)}€`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DESGLOSE PRECIO */}
      <div className="bg-bg border border-borde rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-primario/5 px-5 py-3 border-b border-borde">
          <p className="text-[10px] font-black text-primario uppercase tracking-widest">
            Desglose · {nPax} {nPax === 1 ? "pasajero" : "pasajeros"}
          </p>
        </div>
        <div className="px-5 py-4 space-y-2">
          {datos.vuelos.map((v: any, i: number) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <span className="text-gris font-bold truncate mr-2">
                {v.tipo === "ida" ? "✈ Vuelo ida" : "✈ Vuelo vuelta"}
                {nPax > 1 && <span className="text-gris/60"> ×{nPax}</span>}
              </span>
              <span className="font-black text-texto shrink-0">
                {(Number(v.precio) * nPax).toFixed(2)}€
              </span>
            </div>
          ))}
          {serviciosAdicionales.map((e: any, i: number) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <span className="text-gris font-bold truncate mr-2">
                {e.nombre} ×{e.cantidad}
              </span>
              <span className="font-black text-naranja shrink-0">
                +
                {typeof e.subtotal === "string"
                  ? e.subtotal
                  : `${Number(e.subtotal).toFixed(2)}€`}
              </span>
            </div>
          ))}
          <div className="border-t-2 border-primario/20 pt-3 flex justify-between items-center">
            <span className="text-sm font-black text-titulo-resaltado uppercase">
              Total
            </span>
            <span className="text-xl font-black text-titulo-resaltado">
              {Number(datos.pago.total).toFixed(2)}€
            </span>
          </div>
          <p className="text-[9px] text-gris text-center">
            {datos.pago.metodo}
            {datos.pago.last4 &&
              datos.pago.last4 !== "****" &&
              ` · **** ${datos.pago.last4}`}
          </p>
        </div>
      </div>

      {/* BOTÓN PDF */}
      <PDFDownloadLink
        document={<ResumenReservaPDF datos={datos} />}
        fileName={`Reserva_HorizonteAzul_${datos.id}.pdf`}
      >
        {({ loading: pdfLoading }) => (
          <button
            className="w-full flex items-center justify-center gap-2 bg-primario text-blanco-fijo py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primario/20 hover:bg-secundario transition-all disabled:opacity-50"
            disabled={pdfLoading}
          >
            <FaDownload size={13} />
            {pdfLoading ? "Preparando PDF..." : "Descargar resumen PDF"}
          </button>
        )}
      </PDFDownloadLink>

      <button
        onClick={() => router.push("/")}
        className="w-full py-3 rounded-2xl font-black text-sm uppercase text-gris hover:text-primario transition-colors flex items-center justify-center gap-2"
      >
        <FaHome size={13} /> Volver al inicio
      </button>

      {/* Nota final */}
      <div className="flex items-center justify-center gap-2 pb-4">
        <FaCheckDouble size={10} className="text-verde" />
        <p className="text-[10px] text-gris font-bold text-center">
          Los billetes electrónicos han sido enviados a tu email
        </p>
      </div>
    </div>
  );
}
