"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { API_URL } from "@/lib/api";
import dynamic from "next/dynamic";
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
  FaChevronRight,
} from "react-icons/fa";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false },
);

// ─── Helpers ───────────────────────────────────────────────────────────────────
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

// ─── Tipos ─────────────────────────────────────────────────────────────────────
interface ReservaGrupo {
  reserva_id: number;
  localizador?: string;
  estado: string;
  fecCompra?: string;
  pasajeros: number;
  precioTotal?: number;
  precio_vuelo_historico?: number;
  total_extras_historico?: number;
  total_extras_calculado?: number;
  precio_ajustado?: number;
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
  subtotal: number;
  tipo_vuelo: string;
}

interface Detalles {
  pasajeros: Pasajero[];
  serviciosIncluidos: ServicioIncluido[];
  extrasPagados: ExtraPagado[];
}

// ─── Página ────────────────────────────────────────────────────────────────────
export default function DetalleReservaPage() {
  const router = useRouter();
  const params = useParams();
  const { usuarioLoggeado } = useAuth();
  const reservaId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [reserva, setReserva] = useState<ReservaGrupo | null>(null);
  const [grupo, setGrupo] = useState<ReservaGrupo[]>([]);
  const [detalles, setDetalles] = useState<Detalles | null>(null);
  const [pdfDatos, setPdfDatos] = useState<any>(null);

  useEffect(() => {
    if (!usuarioLoggeado?.id) return;
    cargarReserva();
  }, [usuarioLoggeado, reservaId]);

  const cargarReserva = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      // 1. Todas las reservas del usuario para encontrar el grupo
      const resUsuario = await fetch(
        `${API_URL}/reservas/usuario/${usuarioLoggeado?.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const dataUsuario = await resUsuario.json();
      const allReservas: ReservaGrupo[] = (dataUsuario.resultado ?? []).map(
        (r: any) => ({ ...r, reserva_id: r.reserva_id ?? r.id }),
      );

      const reservaActual = allReservas.find(
        (r) => r.reserva_id === Number(reservaId),
      );
      if (!reservaActual) {
        router.push("/perfil/mis-reservas");
        return;
      }

      const grupoReservas = allReservas.filter(
        (r) => r.codigo_reserva_grupo === reservaActual.codigo_reserva_grupo,
      );
      setGrupo(grupoReservas);
      setReserva(reservaActual);

      // 2. Detalles de la reserva actual (pasajeros + servicios)
      const resDetalle = await fetch(`${API_URL}/reservas/${reservaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataDetalle = await resDetalle.json();
      const detalle = dataDetalle.resultado ?? dataDetalle;

      // 3. Servicios de TODAS las reservas del grupo
      const allServicios: any[] = [];
      for (const r of grupoReservas) {
        const res = await fetch(`${API_URL}/reservas/${r.reserva_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        allServicios.push(...(data.resultado?.servicios ?? []));
      }

      // 4. Deduplicar servicios "ambos" (se guardan en ida y vuelta)
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
          (s: any) => Number(s.precio ?? s.precio_unitario_pagado ?? 0) === 0,
        )
        .map((s: any) => ({
          nombre: s.nombre_servicio ?? s.nombre,
          detalle: s.valor_seleccionado ?? s.detalle ?? "",
          cantidad: Number(s.cantidad ?? 1),
        }));

      const extrasPagados: ExtraPagado[] = serviciosDeduplic
        .filter(
          (s: any) => Number(s.precio ?? s.precio_unitario_pagado ?? 0) > 0,
        )
        .map((s: any) => {
          const precio = Number(s.precio_unitario_pagado ?? s.precio ?? 0);
          const cantidad = Number(s.cantidad ?? 1);
          return {
            nombre: s.nombre_servicio ?? s.nombre,
            cantidad,
            precio_unitario_pagado: precio,
            subtotal: precio * cantidad,
            tipo_vuelo: s.tipo_vuelo ?? "ambos",
          };
        });

      // 5. Cálculo de precios coherente
      //    precio_vuelo_historico = precio por pasajero del vuelo
      //    precioTotal de la reserva ya incluye vuelo * pasajeros
      //    subtotalExtras se suma aparte
      const nPasajeros = reservaActual.pasajeros;

      const subtotalVuelos = grupoReservas.reduce((sum, r) => {
        // precio_ajustado es el precio unitario por pasajero del vuelo
        return (
          sum +
          Number(r.precio_ajustado ?? r.precio_vuelo_historico ?? 0) *
            nPasajeros
        );
      }, 0);

      const subtotalExtras = extrasPagados.reduce(
        (sum, ex) => sum + ex.subtotal,
        0,
      );

      const totalFinal = subtotalVuelos + subtotalExtras;

      const pasajeros: Pasajero[] = (detalle.pasajeros ?? []).map((p: any) => ({
        nombreCompleto:
          p.nombreCompleto ?? `${p.nombre ?? ""} ${p.apellidos ?? ""}`.trim(),
        documento:
          p.documento ??
          (p.tipoDocumento && p.numDocumento
            ? `${p.tipoDocumento}: ${p.numDocumento}`
            : (p.numDocumento ?? "—")),
        tipo: p.esAdulto !== false ? "Adulto" : "Menor",
        fecNacimiento: p.fecNacimiento ?? "",
      }));

      setDetalles({ pasajeros, serviciosIncluidos, extrasPagados });

      // 6. Datos PDF — mismo orden que la página
      setPdfDatos({
        id: reservaActual.localizador ?? `#${reservaId}`,
        fechaCompra: fmtFecha(reservaActual.fecCompra),
        nPasajeros,
        pasajeros,
        vuelos: [...grupoReservas]
          .sort((a, b) => {
            const orden: Record<string, number> = { ida: 0, vuelta: 1 };
            return (
              (orden[a.vuelo_tipo ?? "ida"] ?? 2) -
              (orden[b.vuelo_tipo ?? "ida"] ?? 2)
            );
          })
          .map((r) => ({
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
    } catch (err) {
      console.error("Error cargando reserva:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Guards ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-fondo flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <FaSpinner className="animate-spin text-primario text-3xl" />
          <p className="text-xs font-bold text-gris uppercase tracking-widest">
            Cargando reserva...
          </p>
        </div>
      </div>
    );
  }

  if (!reserva || !detalles || !pdfDatos) {
    return (
      <div className="min-h-screen bg-fondo flex items-center justify-center">
        <p className="text-gris font-bold">Reserva no encontrada</p>
      </div>
    );
  }

  const hayServicios =
    detalles.serviciosIncluidos.length > 0 || detalles.extrasPagados.length > 0;

  return (
    <div className="min-h-screen bg-fondo">
      {/* ── Header sticky ── */}
      <div className="bg-secundario text-blanco-fijo sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-blanco-fijo/10 rounded-lg transition-colors shrink-0"
          >
            <FaArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-black uppercase italic flex items-center gap-2 flex-1 min-w-0 truncate">
            {reserva.paisOrigen}
            <FaChevronRight className="text-xs opacity-60 shrink-0" />
            {reserva.paisDestino}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* ── 1. Confirmación ── */}
        <div className="text-center bg-verde/5 border-2 border-verde/20 rounded-3xl p-6 space-y-3">
          <div className="flex justify-center">
            <div className="bg-verde/10 rounded-full p-3">
              <FaCheckCircle size={32} className="text-verde" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-titulo-resaltado uppercase">
            Reserva Confirmada
          </h2>
          <p className="text-sm font-bold text-primario">
            Localizador: {pdfDatos.id}
          </p>
          <p className="text-sm text-gris">
            Realizada el {pdfDatos.fechaCompra}
          </p>
        </div>

        {/* ── 2. Itinerario (vuelos) ── */}
        <div className="bg-card border border-card-borde rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-black text-titulo-resaltado uppercase tracking-widest flex items-center gap-2">
            <FaCalendarAlt size={14} /> Itinerario
          </h3>
          <div className="space-y-3">
            {grupo.map((r, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-4 p-4 rounded-xl ${
                  r.vuelo_tipo === "ida"
                    ? "bg-primario/5 border border-primario/15"
                    : "bg-secundario/5 border border-secundario/15"
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    r.vuelo_tipo === "ida"
                      ? "bg-primario/10 text-primario"
                      : "bg-secundario/10 text-secundario"
                  }`}
                >
                  {r.vuelo_tipo === "ida" ? (
                    <FaPlaneDeparture size={16} />
                  ) : (
                    <FaPlaneArrival size={16} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-black uppercase tracking-wider ${
                      r.vuelo_tipo === "ida"
                        ? "text-primario"
                        : "text-secundario"
                    }`}
                  >
                    Vuelo de {r.vuelo_tipo}
                  </p>
                  <p className="text-sm font-bold text-titulo-resaltado mt-0.5 truncate">
                    {r.vuelo_tipo === "ida"
                      ? `${r.paisOrigen} → ${r.paisDestino}`
                      : `${r.paisDestino} → ${r.paisOrigen}`}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gris-claro font-bold">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt size={9} />
                      {fmtFecha(r.fecSalida)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock size={9} />
                      {fmt(r.horaSalida)} — {fmt(r.horaLlegada)}
                    </span>
                  </div>
                </div>
                {/* Precio de este vuelo (precio unitario × pasajeros) */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-primario">
                    {(
                      Number(
                        r.precio_ajustado ?? r.precio_vuelo_historico ?? 0,
                      ) * pdfDatos.nPasajeros
                    ).toFixed(2)}
                    €
                  </p>
                  <p className="text-[9px] text-gris-claro font-bold">
                    {pdfDatos.nPasajeros} pax ×{" "}
                    {Number(
                      r.precio_ajustado ?? r.precio_vuelo_historico ?? 0,
                    ).toFixed(2)}
                    €
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Pasajeros ── */}
        <div className="bg-card border border-card-borde rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-black text-titulo-resaltado uppercase tracking-widest flex items-center gap-2">
            <FaUsers size={14} /> Pasajeros ({detalles.pasajeros.length})
          </h3>
          <div className="space-y-2">
            {detalles.pasajeros.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-bg-suave rounded-xl border border-card-borde"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-primario/10 text-primario text-[10px] font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-titulo-resaltado truncate">
                      {p.nombreCompleto}
                    </p>
                    <p className="text-xs text-gris-claro">{p.documento}</p>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ml-2 ${
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

        {/* ── 4. Servicios incluidos ── */}
        {detalles.serviciosIncluidos.length > 0 && (
          <div className="bg-card border border-card-borde rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black text-verde uppercase tracking-widest flex items-center gap-2">
              <FaSuitcase size={14} /> Servicios Incluidos
            </h3>
            <div className="space-y-2">
              {detalles.serviciosIncluidos.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-verde/5 rounded-xl border border-verde/15"
                >
                  <div>
                    <p className="text-sm font-bold text-titulo-resaltado">
                      {s.nombre}
                    </p>
                    {s.detalle && (
                      <p className="text-xs text-gris-claro">{s.detalle}</p>
                    )}
                  </div>
                  <span className="text-xs font-black text-verde bg-verde/10 px-2 py-1 rounded-lg shrink-0 ml-2">
                    GRATIS
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 5. Extras pagados ── */}
        {detalles.extrasPagados.length > 0 && (
          <div className="bg-card border border-card-borde rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black text-naranja uppercase tracking-widest flex items-center gap-2">
              <FaSuitcase size={14} /> Servicios Extra
            </h3>
            <div className="space-y-2">
              {detalles.extrasPagados.map((ex, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-naranja/5 rounded-xl border border-naranja/15"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-titulo-resaltado truncate">
                      {ex.nombre}
                    </p>
                    <p className="text-xs text-gris-claro">
                      {ex.cantidad} × {ex.precio_unitario_pagado.toFixed(2)}€
                      {ex.tipo_vuelo !== "ambos" && (
                        <span className="ml-1 opacity-60">
                          ({ex.tipo_vuelo})
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-sm font-black text-naranja shrink-0 ml-3">
                    {ex.subtotal.toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 6. Resumen de pago ── */}
        <div className="bg-card border border-card-borde rounded-3xl p-6 space-y-3">
          <h3 className="text-sm font-black text-titulo-resaltado uppercase tracking-widest">
            Resumen de pago
          </h3>

          {/* Línea por vuelo */}
          {grupo.map((r, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gris-claro font-bold capitalize">
                Vuelo de {r.vuelo_tipo} ({pdfDatos.nPasajeros} pax)
              </span>
              <span className="font-black text-texto">
                {(
                  Number(r.precio_ajustado ?? r.precio_vuelo_historico ?? 0) *
                  pdfDatos.nPasajeros
                ).toFixed(2)}
                €
              </span>
            </div>
          ))}

          {/* Línea por extra */}
          {detalles.extrasPagados.map((ex, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gris-claro font-bold">
                {ex.nombre} ×{ex.cantidad}
              </span>
              <span className="font-black text-texto">
                {ex.subtotal.toFixed(2)}€
              </span>
            </div>
          ))}

          {/* Separador */}
          <div className="border-t border-card-borde pt-3 flex justify-between items-center">
            <span className="text-base font-black uppercase tracking-widest text-texto">
              Total
            </span>
            <span className="text-3xl font-black text-primario">
              {pdfDatos.pago.total.toFixed(2)}€
            </span>
          </div>
        </div>

        {/* ── 7. Botón PDF ── */}
        <PDFDownloadLink
          document={<ResumenReservaPDF datos={pdfDatos} />}
          fileName={`Reserva_HorizonteAzul_${pdfDatos.id}.pdf`}
        >
          {({ loading: pdfLoading }) => (
            <button
              disabled={pdfLoading}
              className="w-full flex items-center justify-center gap-2 bg-primario text-blanco-fijo font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-secundario transition-all disabled:opacity-50 text-sm"
            >
              {pdfLoading ? (
                <FaSpinner size={14} className="animate-spin" />
              ) : (
                <FaDownload size={14} />
              )}
              {pdfLoading ? "Preparando PDF..." : "Descargar resumen PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
