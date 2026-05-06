"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import useAuth from "@/hooks/useAuth";
import { API_URL } from "@/lib/api";
import { ResumenReservaPDF } from "@/components/reservas/ResumenReservaPDF";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaDownload,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaSuitcase,
  FaSpinner,
} from "react-icons/fa";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false },
);

function fmt(hora: string | null | undefined): string {
  if (!hora) return "—";
  return String(hora).substring(0, 5);
}

function fmtFecha(
  raw: string | null | undefined,
  opts?: Intl.DateTimeFormatOptions,
): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return String(raw);
  return d.toLocaleDateString(
    "es-ES",
    opts ?? { day: "2-digit", month: "2-digit", year: "numeric" },
  );
}

function labelTipoVuelo(tipo: any): string {
  if (tipo === true || tipo === "ambos" || tipo === 2) return "Ambos tramos";
  if (tipo === "ida" || tipo === "outbound" || tipo === "departure")
    return "Solo ida";
  if (tipo === "vuelta" || tipo === "return" || tipo === "arrival")
    return "Solo vuelta";
  if (tipo === "ida/vuelta" || tipo === "ib" || tipo === "roundtrip")
    return "Ida y vuelta";
  if (tipo === false) return "Solo ida";
  if (typeof tipo === "number") return `Tramo ${tipo}`;
  return String(tipo ?? "Tipo de tramo desconocido");
}

interface ReservaGrupo {
  reserva_id: number;
  localizador?: string;
  estado: string;
  fecCompra?: string;
  pasajeros: number;
  precioTotal?: number;
  total_pagado?: number;
  precio_ajustado?: number;
  precio_vuelo_historico?: number;
  total_extras_historico?: number;
  total_extras_calculado?: number;
  paisOrigen: string;
  aeropuertoOrigen: string;
  iataOrigen?: string;
  paisDestino: string;
  aeropuertoDestino: string;
  iataDestino?: string;
  img?: string;
  vuelo_tipo?: string;
  fecSalida?: string;
  horaSalida?: string;
  fecLlegada?: string;
  horaLlegada?: string;
  codigo_reserva_grupo?: string;
}

interface Pasajero {
  nombreCompleto: string;
  documento: string;
  tipo: "Adulto" | "Menor";
  fecNacimiento: string;
}

interface ServicioIncluido {
  nombre: string;
  detalle?: string;
  cantidad: number;
}

interface ExtraPagado {
  nombre: string;
  cantidad: number;
  precio_unitario_pagado: number;
  precioUnitario?: number;
  subtotal: number;
  tipo_vuelo: string;
}

interface Detalles {
  pasajeros: Pasajero[];
  serviciosIncluidos: ServicioIncluido[];
  extrasPagados: ExtraPagado[];
}

export default function LocalizadorReservaPage() {
  const router = useRouter();
  const params = useParams();
  const { usuarioLoggeado } = useAuth();
  const localizador = String(params.localizador ?? "");

  const [loading, setLoading] = useState(true);
  const [grupo, setGrupo] = useState<ReservaGrupo[]>([]);
  const [detalles, setDetalles] = useState<Detalles | null>(null);
  const [pdfDatos, setPdfDatos] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuarioLoggeado?.id) return;
    cargarLocalizador();
  }, [usuarioLoggeado, localizador]);

  const cargarLocalizador = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Necesitas iniciar sesión para ver esta reserva.");
        setLoading(false);
        return;
      }

      const resUsuario = await fetch(
        `${API_URL}/reservas/usuario/${usuarioLoggeado?.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const dataUsuario = await resUsuario.json();
      const reservas: ReservaGrupo[] = (
        Array.isArray(dataUsuario) ? dataUsuario : (dataUsuario.resultado ?? [])
      ).map((r: any) => ({ ...r, reserva_id: r.reserva_id ?? r.id }));

      let grupoReservas = reservas.filter(
        (r) => String(r.localizador) === localizador,
      );

      if (grupoReservas.length === 0) {
        const primera = reservas.find(
          (r) => String(r.codigo_reserva_grupo) === localizador,
        );
        if (primera) {
          grupoReservas = reservas.filter(
            (r) =>
              String(r.codigo_reserva_grupo) === primera.codigo_reserva_grupo,
          );
        }
      }

      if (grupoReservas.length === 0) {
        setError("No se encontró ninguna reserva con ese localizador.");
        setLoading(false);
        return;
      }

      const detallesReserva = await fetch(
        `${API_URL}/reservas/${grupoReservas[0].reserva_id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const dataDetalle = await detallesReserva.json();
      const detalleData = dataDetalle.resultado ?? dataDetalle;

      const allServicios: any[] = [];
      for (const reserva of grupoReservas) {
        const res = await fetch(`${API_URL}/reservas/${reserva.reserva_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        allServicios.push(...(data.resultado?.servicios ?? []));
      }

      const vistos = new Map<string, boolean>();
      const serviciosDeduplic = allServicios.filter((s: any) => {
        if (s.tipo_vuelo === "ambos") {
          const key = `${s.servicio_id}_${s.nombre_servicio ?? s.nombre}`;
          if (vistos.has(key)) return false;
          vistos.set(key, true);
        }
        return true;
      });

      const serviciosIncluidos: ServicioIncluido[] = serviciosDeduplic
        .filter(
          (s: any) => Number(s.precio || s.precio_unitario_pagado || 0) === 0,
        )
        .map((s: any) => ({
          nombre: s.nombre_servicio ?? s.nombre,
          detalle: s.valor_seleccionado ?? s.detalle ?? "",
          cantidad: Number(s.cantidad ?? 1),
        }));

      const extrasPagados: ExtraPagado[] = serviciosDeduplic
        .filter(
          (s: any) => Number(s.precio || s.precio_unitario_pagado || 0) > 0,
        )
        .map((s: any) => {
          const precio = Number(s.precio_unitario_pagado ?? s.precio ?? 0);
          const cantidad = Number(s.cantidad ?? 1);
          return {
            nombre: s.nombre_servicio ?? s.nombre,
            cantidad,
            precio_unitario_pagado: precio,
            precioUnitario: precio,
            subtotal: precio * cantidad,
            tipo_vuelo: s.tipo_vuelo ?? "ambos",
          };
        });

      const pasajeros: Pasajero[] = (detalleData.pasajeros ?? []).map(
        (p: any) => ({
          nombreCompleto:
            p.nombreCompleto ?? `${p.nombre ?? ""} ${p.apellidos ?? ""}`.trim(),
          documento:
            p.documento ??
            (p.tipoDocumento && p.numDocumento
              ? `${p.tipoDocumento}: ${p.numDocumento}`
              : (p.numDocumento ?? "—")),
          tipo: p.esAdulto !== false ? "Adulto" : "Menor",
          fecNacimiento: p.fecNacimiento ?? "",
        }),
      );

      const nPasajeros = grupoReservas[0].pasajeros;
      const subtotalVuelos = grupoReservas.reduce(
        (sum, r) => sum + Number(r.precioTotal ?? 0),
        0,
      );
      const subtotalExtras = extrasPagados.reduce(
        (sum, item) => sum + item.subtotal,
        0,
      );
      const totalFinal = grupoReservas.reduce(
        (sum, r) => sum + Number(r.total_pagado ?? r.precioTotal ?? 0),
        0,
      );

      const ordenVuelos = [...grupoReservas].sort((a, b) => {
        const orden: Record<string, number> = { ida: 0, vuelta: 1 };
        return (
          (orden[a.vuelo_tipo ?? "ida"] ?? 2) -
          (orden[b.vuelo_tipo ?? "ida"] ?? 2)
        );
      });

      setGrupo(grupoReservas);
      setDetalles({ pasajeros, serviciosIncluidos, extrasPagados });
      setPdfDatos({
        id: grupoReservas[0].localizador ?? localizador,
        fechaCompra: fmtFecha(grupoReservas[0].fecCompra),
        nPasajeros,
        pasajeros,
        vuelos: ordenVuelos.map((r) => ({
          tipo: r.vuelo_tipo ?? "ida",
          trayectoIda: `${r.aeropuertoOrigen} (${r.iataOrigen ?? ""}) → ${r.aeropuertoDestino} (${r.iataDestino ?? ""})`,
          trayectoVuelta: `${r.aeropuertoDestino} (${r.iataDestino ?? ""}) → ${r.aeropuertoOrigen} (${r.iataOrigen ?? ""})`,
          fecha_salida: fmtFecha(r.fecSalida),
          hora_salida: fmt(r.horaSalida),
          hora_llegada: fmt(r.horaLlegada),
          precio: Number(r.precio_ajustado ?? r.precio_vuelo_historico ?? 0),
          codigo_vuelo:
            r.iataOrigen && r.iataDestino
              ? `${r.iataOrigen}-${r.iataDestino}`
              : `HA-${r.reserva_id}`,
        })),
        serviciosIncluidos,
        extras: extrasPagados,
        subtotalVuelos,
        subtotalExtras,
        pago: {
          total: totalFinal,
          metodo: "Tarjeta bancaria",
          last4: "****",
        },
      });
    } catch (e) {
      console.error(e);
      setError("No ha sido posible cargar los detalles de esta reserva.");
    } finally {
      setLoading(false);
    }
  };

  const tieneIda = grupo.some((v) => v.vuelo_tipo === "ida");
  const tieneVuelta = grupo.some((v) => v.vuelo_tipo === "vuelta");
  const nPax = detalles?.pasajeros.length ?? grupo[0]?.pasajeros ?? 0;
  const serviciosIncluidos = detalles?.serviciosIncluidos ?? [];
  const serviciosAdicionales = detalles?.extrasPagados ?? [];
  const subtotalExtras = serviciosAdicionales.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );
  const totalFinal =
    pdfDatos?.pago.total ??
    grupo.reduce(
      (sum, r) => sum + Number(r.total_pagado ?? r.precioTotal ?? 0),
      0,
    );

  const textoServiciosIncluidos = (() => {
    if (tieneIda && tieneVuelta)
      return `Estos servicios aplican a cada pasajero en ambos tramos del viaje (ida y vuelta).`;
    if (tieneIda)
      return `Estos servicios aplican a cada pasajero en el vuelo de ida.`;
    return `Estos servicios aplican a cada pasajero en el vuelo de vuelta.`;
  })();

  const textoExtras =
    "Los extras se contratan como unidades totales para el grupo — no por pasajero. Si necesitáis repartirlos entre vosotros, podéis organizaros libremente.";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <FaSpinner className="animate-spin text-primario text-4xl" />
          <p className="text-sm font-black text-gris uppercase tracking-widest">
            Cargando detalles de la reserva...
          </p>
        </div>
      </div>
    );
  }

  if (!usuarioLoggeado?.id) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 gap-4 text-center">
        <p className="text-sm font-black text-titulo-resaltado uppercase tracking-widest">
          Necesitas iniciar sesión
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-primario text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest"
        >
          Ir al login
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 gap-4 text-center">
        <p className="text-sm font-black text-rojo uppercase tracking-widest">
          {error}
        </p>
        <button
          onClick={() => router.push("/perfil/mis-reservas")}
          className="bg-primario text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest"
        >
          Volver a mis reservas
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20 space-y-6">
      <button
        onClick={() => router.push("/perfil/mis-reservas")}
        className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primario"
      >
        <FaArrowLeft size={12} /> Volver a mis reservas
      </button>

      <div className="bg-secundario rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl shadow-secundario/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blanco-fijo/70">
              Reserva guardada
            </p>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-4">
              {grupo[0].paisOrigen} <span className="text-primario">→</span>{" "}
              {grupo[0].paisDestino}
            </h1>
            <p className="text-sm text-blanco-fijo/70 mt-4 max-w-2xl">
              Detalle completo de tu reserva para {nPax}{" "}
              {nPax === 1 ? "pasajero" : "pasajeros"}. Aquí tienes servicios,
              pasajeros y vuelos del localizador.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl bg-white/10 p-4 md:p-6 text-right">
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-blanco-fijo/70">
              Localizador
            </span>
            <span className="text-xl md:text-2xl font-black text-white tracking-[0.08em] break-all">
              {localizador}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-blanco-fijo/60">
              Compra: {fmtFecha(grupo[0].fecCompra)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-6">
          <div className="bg-bg border border-borde rounded-3xl p-6 shadow-sm">
            <div className="mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primario">
                  Itinerario
                </p>
                <p className="text-xs text-gris mt-1">
                  {tieneIda && tieneVuelta
                    ? "Vuelo de ida y vuelta"
                    : tieneIda
                      ? "Vuelo de ida"
                      : "Vuelo de vuelta"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {grupo
                .sort((a, b) => {
                  const orden: Record<string, number> = { ida: 0, vuelta: 1 };
                  return (
                    (orden[a.vuelo_tipo ?? "ida"] ?? 2) -
                    (orden[b.vuelo_tipo ?? "ida"] ?? 2)
                  );
                })
                .map((reserva, index) => (
                  <div
                    key={reserva.reserva_id}
                    className="rounded-3xl border border-borde p-5 bg-white/80"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-1 text-primario">
                        {reserva.vuelo_tipo === "vuelta" ? (
                          <FaPlaneArrival size={18} />
                        ) : (
                          <FaPlaneDeparture size={18} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-[0.35em] text-gris">
                          {reserva.vuelo_tipo === "vuelta"
                            ? "Vuelo vuelta"
                            : "Vuelo ida"}
                        </p>
                        <p className="text-lg font-black text-titulo-resaltado truncate">
                          {reserva.aeropuertoOrigen} →{" "}
                          {reserva.aeropuertoDestino}
                        </p>
                        <p className="text-sm text-gris mt-2">
                          {fmtFecha(reserva.fecSalida, {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}{" "}
                          · {fmt(reserva.horaSalida)}
                        </p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <div className="rounded-3xl bg-primary/5 p-3 text-sm font-black uppercase tracking-widest text-primario">
                            {reserva.iataOrigen || "---"}
                          </div>
                          <div className="rounded-3xl bg-primary/5 p-3 text-sm font-black uppercase tracking-widest text-primario">
                            {reserva.iataDestino || "---"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-bg border border-borde rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primario">
                  Pasajeros
                </p>
                <p className="text-xs text-gris mt-1">
                  Información de cada viajero.
                </p>
              </div>
              <span className="text-[11px] font-black text-titulo-resaltado uppercase tracking-widest">
                {nPax}
              </span>
            </div>
            <div className="space-y-3">
              {detalles?.pasajeros.map((p, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-borde p-4 bg-white/80"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-black text-titulo-resaltado uppercase truncate">
                      {p.nombreCompleto}
                    </p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primario">
                      {p.tipo}
                    </span>
                  </div>
                  <p className="text-[11px] text-gris mt-2">{p.documento}</p>
                  <p className="text-[11px] text-gris mt-1">
                    Nacimiento: {fmtFecha(p.fecNacimiento)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {(serviciosIncluidos.length > 0 ||
            serviciosAdicionales.length > 0) && (
            <div className="bg-bg border border-borde rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primario">
                    Servicios
                  </p>
                  <p className="text-xs text-gris mt-1">
                    Incluidos y extras contratados.
                  </p>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-titulo-resaltado">
                  {serviciosIncluidos.length + serviciosAdicionales.length}
                </span>
              </div>

              {serviciosIncluidos.length > 0 && (
                <div className="space-y-3 mb-6">
                  <p className="text-[9px] font-black uppercase tracking-widest text-verde">
                    Servicios incluidos
                  </p>
                  <p className="text-[10px] text-gris leading-relaxed">
                    {textoServiciosIncluidos}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {serviciosIncluidos.map((s, index) => (
                      <div
                        key={index}
                        className="rounded-3xl border border-verde/20 bg-verde/5 p-4"
                      >
                        <p className="text-sm font-black text-titulo-resaltado">
                          {s.nombre}
                        </p>
                        {s.detalle && (
                          <p className="text-[10px] text-gris mt-1">
                            {s.detalle}
                          </p>
                        )}
                        <p className="text-[10px] font-black text-verde mt-2">
                          Incluido ×{s.cantidad}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {serviciosAdicionales.length > 0 && (
                <div
                  className={
                    serviciosIncluidos.length > 0
                      ? "pt-6 border-t border-dashed border-borde"
                      : ""
                  }
                >
                  <p className="text-[9px] font-black uppercase tracking-widest text-naranja">
                    Extras contratados
                  </p>
                  <p className="text-[10px] text-gris leading-relaxed mb-4">
                    {textoExtras}
                  </p>
                  <div className="space-y-3">
                    {serviciosAdicionales.map((s, index) => (
                      <div
                        key={index}
                        className="rounded-3xl border border-naranja/20 bg-naranja/5 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-black text-titulo-resaltado">
                              {s.nombre}
                            </p>
                            <p className="text-[10px] text-gris mt-1">
                              {s.tipo_vuelo === "ambos"
                                ? "Ambos tramos"
                                : s.tipo_vuelo === "ida"
                                  ? "Solo ida"
                                  : "Solo vuelta"}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[10px] text-gris">
                              ×{s.cantidad} ·{" "}
                              {s.precio_unitario_pagado.toFixed(2)}€
                            </p>
                            <p className="text-sm font-black text-naranja mt-1">
                              {s.subtotal.toFixed(2)}€
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-bg border border-borde rounded-3xl p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-primario mb-4">
              Resumen de pago
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gris">
                <span>Subtotal vuelos</span>
                <span>
                  {grupo
                    .reduce((sum, r) => sum + Number(r.precioTotal ?? 0), 0)
                    .toFixed(2)}
                  €
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gris">
                <span>Extras</span>
                <span>{subtotalExtras.toFixed(2)}€</span>
              </div>
              <div className="border-t border-borde pt-4 flex items-center justify-between text-base font-black text-titulo-resaltado">
                <span>Total</span>
                <span>{(pdfDatos?.pago.total ?? totalFinal).toFixed(2)}€</span>
              </div>
              <p className="text-[10px] text-gris mt-3">
                {pdfDatos?.pago.metodo ?? "Tarjeta bancaria"}
              </p>
            </div>
          </div>

          <div className="bg-bg border border-borde rounded-3xl p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-primario mb-4">
              Descargar resumen
            </p>
            {pdfDatos ? (
              <PDFDownloadLink
                document={<ResumenReservaPDF datos={pdfDatos} />}
                fileName={`Reserva_HorizonteAzul_${localizador}.pdf`}
              >
                {({ loading: pdfLoading }) => (
                  <button
                    className="w-full flex items-center justify-center gap-3 bg-primario text-white px-5 py-4 rounded-3xl font-black uppercase tracking-widest hover:bg-secundario transition-all disabled:opacity-50"
                    disabled={pdfLoading}
                  >
                    <FaDownload size={14} />
                    {pdfLoading ? "Preparando PDF..." : "Descargar PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            ) : (
              <button
                disabled
                className="w-full bg-gris/10 text-gris rounded-3xl px-5 py-4 font-black uppercase tracking-widest"
              >
                Cargando resumen...
              </button>
            )}
          </div>

          <button
            onClick={() => router.push("/perfil/mis-reservas")}
            className="w-full py-4 rounded-3xl border border-borde font-black uppercase tracking-widest text-sm text-gris hover:text-primario transition-colors"
          >
            Volver a mis reservas
          </button>
        </div>
      </div>
    </div>
  );
}
