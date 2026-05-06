"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { API_URL } from "@/lib/api";
import {
  FaUsers,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaExchangeAlt,
  FaSpinner,
  FaTimes,
  FaDownload,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBan,
  FaHourglassHalf,
  FaTrash,
  FaCheck,
  FaClock,
  FaCalendarAlt,
  FaSuitcase,
  FaMapMarkerAlt,
  FaChevronRight,
} from "react-icons/fa";

// ─── Helpers ───────────────────────────────────────────────────────────────────
/** "18:00:00" → "18:00"  |  "18:00" → "18:00"  |  null → "—" */
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
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(
    "es-ES",
    opts ?? { day: "2-digit", month: "2-digit", year: "numeric" },
  );
}

// ─── Badge de estado ────────────────────────────────────────────────────────────
type EstadoKey = "confirmada" | "realizada" | "cancelada" | "pendiente";

const ESTADO: Record<
  EstadoKey,
  { label: string; icon: React.ReactNode; cls: string }
> = {
  confirmada: {
    label: "Confirmada",
    icon: <FaCheckCircle size={9} />,
    cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  realizada: {
    label: "Realizada",
    icon: <FaCheckCircle size={9} />,
    cls: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  cancelada: {
    label: "Cancelada",
    icon: <FaBan size={9} />,
    cls: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  pendiente: {
    label: "Pendiente",
    icon: <FaHourglassHalf size={9} />,
    cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
};

function Badge({ estado }: { estado: string }) {
  const key = (estado?.toLowerCase() as EstadoKey) || "pendiente";
  const cfg = ESTADO[key] ?? ESTADO.pendiente;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${cfg.cls}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Tipos mínimos (ajustados a lo que devuelve tu API) ────────────────────────
interface Reserva {
  reserva_id: number;
  localizador?: string;
  estado: string;
  fecCompra?: string;
  pasajeros: number;
  precioTotal?: number;
  total_pagado?: number;
  precio_vuelo_historico?: number;
  total_extras_historico?: number;
  total_extras_calculado?: number;
  paisOrigen: string;
  aeropuertoOrigen: string;
  iataOrigen?: string;
  paisDestino: string;
  aeropuertoDestino: string;
  iataDestino?: string;
  img: string;
  vuelo_tipo?: string; // "ida" | "vuelta"
  fecSalida?: string;
  horaSalida?: string;
  fecLlegada?: string;
  horaLlegada?: string;
  precio_ajustado?: number;
  codigo_reserva_grupo?: string; // para agrupar ida+vuelta
}

// ─── Componente Mini-Tramo (vuelo individual dentro de la card) ─────────────────
function TramoVuelo({
  reserva,
  tipo,
}: {
  reserva: Reserva;
  tipo: "ida" | "vuelta";
}) {
  const esIda = tipo === "ida";
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${esIda ? "bg-primario/5 border border-primario/15" : "bg-secundario/5 border border-secundario/15"}`}
    >
      <div
        className={`shrink-0 p-1.5 rounded-lg ${esIda ? "bg-primario/10 text-primario" : "bg-secundario/10 text-secundario"}`}
      >
        {esIda ? <FaPlaneDeparture size={11} /> : <FaPlaneArrival size={11} />}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${esIda ? "text-primario" : "text-secundario"}`}
        >
          Vuelo de {tipo}
        </p>
        <p className="text-xs font-black text-titulo-resaltado uppercase truncate">
          {esIda
            ? `${reserva.paisOrigen} - ${reserva.paisDestino}`
            : `${reserva.paisDestino} - ${reserva.paisOrigen}`}
        </p>
      </div>
      <div className="text-right shrink-0">
        {reserva.fecSalida && (
          <p className="text-[10px] font-bold text-gris">
            {fmtFecha(reserva.fecSalida)}
          </p>
        )}
        {reserva.horaSalida && (
          <p className="text-[10px] font-black text-titulo-resaltado">
            {fmt(reserva.horaSalida)}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Componente Grupo de reservas (puede ser 1 o 2 vuelos del mismo grupo) ──────
function GrupoReserva({
  grupo,
  onAbrirDetalle,
  onCancelar,
  confirmandoId,
  setConfirmandoId,
  cancelandoId,
}: {
  grupo: Reserva[];
  onAbrirDetalle: (localizador: string) => void;
  onCancelar: (id: number) => void;
  confirmandoId: number | null;
  setConfirmandoId: (id: number | null) => void;
  cancelandoId: number | null;
}) {
  // La primera siempre es la de referencia visual (imagen, precio total, etc.)
  const principal = grupo[0];
  const tieneIda = grupo.some((r) => r.vuelo_tipo === "ida");
  const tieneVuelta = grupo.some((r) => r.vuelo_tipo === "vuelta");
  const esRedondo = tieneIda && tieneVuelta;
  const reservaIda = grupo.find((r) => r.vuelo_tipo === "ida") ?? grupo[0];
  const reservaVuelta = grupo.find((r) => r.vuelo_tipo === "vuelta") ?? null;

  const esCancelada = principal.estado?.toLowerCase() === "cancelada";
  const esConfirmada = principal.estado?.toLowerCase() === "confirmada";
  const totalPagado = grupo.reduce(
    (s, r) => s + Number(r.total_pagado ?? r.precioTotal ?? 0),
    0,
  );
  const totalPasajeros = principal.pasajeros;

  // Para cancelar usamos la primera reserva del grupo
  const isCancelando = cancelandoId === principal.reserva_id;
  const isConfirmando = confirmandoId === principal.reserva_id;
  const localizador =
    principal.localizador ??
    principal.codigo_reserva_grupo ??
    String(principal.reserva_id);

  return (
    <article
      className={`bg-bg border rounded-4xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primario/30 ${esCancelada ? "opacity-60" : ""} border-borde`}
    >
      <div className="flex flex-col md:flex-row">
        {/* ── Imagen ── */}
        <div className="relative w-full md:w-52 h-44 md:h-auto shrink-0 overflow-hidden">
          <img
            src={
              principal.img || "/media/img/img-inicio-destino-por-defecto.png"
            }
            alt={principal.paisDestino}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

          {/* Pill tipo viaje sobre imagen */}
          <div className="absolute bottom-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm border ${esRedondo ? "bg-white/15 border-white/25 text-white" : tieneVuelta ? "bg-white/15 border-white/25 text-white" : "bg-white/15 border-white/25 text-white"}`}
            >
              {esRedondo ? (
                <>
                  <FaExchangeAlt size={8} /> Ida y vuelta
                </>
              ) : tieneVuelta ? (
                <>
                  <FaPlaneArrival size={8} /> Solo vuelta
                </>
              ) : (
                <>
                  <FaPlaneDeparture size={8} /> Solo ida
                </>
              )}
            </span>
          </div>

          {/* Estado */}
          <div className="absolute top-3 left-3">
            <Badge estado={principal.estado} />
          </div>
        </div>

        {/* ── Contenido ── */}
        <div className="flex-1 p-5 md:p-6 flex flex-col gap-4">
          {/* Cabecera */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold text-gris uppercase tracking-[0.2em] mb-1">
                {grupo.length > 1
                  ? grupo.map((r) => `Ref #${r.reserva_id}`).join(" · ")
                  : `Ref #${principal.reserva_id}`}
              </p>
              <h3 className="text-xl font-black text-titulo-resaltado uppercase italic leading-tight flex flex-wrap items-center gap-1.5">
                {principal.paisOrigen}
                {esRedondo ? (
                  <FaExchangeAlt className="text-primario text-xs" />
                ) : (
                  <FaChevronRight className="text-primario text-xs" />
                )}
                {principal.paisDestino}
              </h3>
              <p className="text-[10px] font-bold text-gris/60 mt-1 flex items-center gap-1">
                <FaMapMarkerAlt size={8} className="text-primario" />
                {principal.aeropuertoDestino}
                {principal.iataDestino && (
                  <span className="bg-primario/10 text-primario px-1.5 py-0.5 rounded text-[8px] font-black ml-1">
                    {principal.iataDestino}
                  </span>
                )}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl md:text-3xl font-black text-titulo-resaltado leading-none">
                {totalPagado.toFixed(2)}€
              </p>
              <p className="text-[9px] font-bold text-gris uppercase tracking-widest mt-0.5">
                Total pagado
              </p>
              <p className="text-[9px] font-bold text-gris mt-1 flex items-center justify-end gap-1">
                <FaUsers size={8} />
                {totalPasajeros} pasajero{totalPasajeros !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Tramos de vuelo */}
          <div className="space-y-2">
            {tieneIda && <TramoVuelo reserva={reservaIda} tipo="ida" />}
            {tieneVuelta && reservaVuelta && (
              <TramoVuelo reserva={reservaVuelta} tipo="vuelta" />
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1 border-t border-borde">
            {esConfirmada && (
              <div className="flex-1">
                {isConfirmando ? (
                  <div className="flex items-center gap-2 bg-rojo/5 border border-rojo/20 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] font-bold text-rojo flex-1">
                      ¿Cancelar esta reserva?
                    </p>
                    <button
                      onClick={() => onCancelar(principal.reserva_id)}
                      disabled={isCancelando}
                      className="flex items-center gap-1 bg-rojo text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg disabled:opacity-50"
                    >
                      <FaCheck size={8} /> Sí
                    </button>
                    <button
                      onClick={() => setConfirmandoId(null)}
                      className="flex items-center gap-1 bg-fondo border border-borde text-gris text-[9px] font-black px-2.5 py-1.5 rounded-lg"
                    >
                      <FaTimes size={8} /> No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmandoId(principal.reserva_id)}
                    disabled={isCancelando}
                    className="w-full flex items-center justify-center gap-1.5 bg-rojo/5 text-rojo border border-rojo/20 text-[10px] font-black uppercase px-4 py-2.5 rounded-xl hover:bg-rojo/10 transition-all disabled:opacity-40"
                  >
                    {isCancelando ? (
                      <FaSpinner size={10} className="animate-spin" />
                    ) : (
                      <FaTrash size={10} />
                    )}
                    {isCancelando ? "Cancelando..." : "Cancelar"}
                  </button>
                )}
              </div>
            )}

            {/* Ver detalles — abre el detalle de la primera reserva del grupo */}
            <button
              onClick={() => onAbrirDetalle(localizador)}
              className="flex-1 bg-secundario text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-primario transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <FaSuitcase size={10} />
              Ver itinerario
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── PÁGINA PRINCIPAL ───────────────────────────────────────────────────────────
export default function MisReservasPage() {
  const router = useRouter();
  const { usuarioLoggeado } = useAuth();

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [status, setStatus] = useState<"loading" | "unauth" | "ready">(
    "loading",
  );
  const cargadoRef = useRef(false);

  // Cancelación
  const [confirmandoId, setConfirmandoId] = useState<number | null>(null);
  const [cancelandoId, setCancelandoId] = useState<number | null>(null);

  // ── Carga ──────────────────────────────────────────────────────────────────
  const cargarReservas = useCallback(async (userId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauth");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/reservas/usuario/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        setStatus("unauth");
        return;
      }
      const data = await res.json();
      // La API devuelve { ok, resultado } o array directo
      const lista = Array.isArray(data) ? data : (data.resultado ?? []);
      // Normalizar: asegurar que reserva_id existe (la query usa r.id AS reserva_id? No, usa r.id directo)
      // El model devuelve r.* → el campo se llama "id" en la tabla. Mapeamos:
      setReservas(
        lista.map((r: any) => ({
          ...r,
          reserva_id: r.reserva_id ?? r.id, // por si acaso
        })),
      );
      setStatus("ready");
    } catch (e) {
      console.error(e);
      setStatus("ready");
    }
  }, []);

  useEffect(() => {
    if (cargadoRef.current) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      cargadoRef.current = true;
      setStatus("unauth");
      return;
    }
    if (usuarioLoggeado?.id) {
      cargadoRef.current = true;
      cargarReservas(usuarioLoggeado.id);
    }
  }, [usuarioLoggeado, cargarReservas]);

  // ── Cancelar ───────────────────────────────────────────────────────────────
  const cancelarReserva = async (reservaId: number) => {
    const token = localStorage.getItem("token");
    setCancelandoId(reservaId);
    setConfirmandoId(null);
    try {
      const res = await fetch(`${API_URL}/reservas/${reservaId}/cancelar`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReservas((prev) =>
          prev.map((r) =>
            r.reserva_id === reservaId ? { ...r, estado: "cancelada" } : r,
          ),
        );
      }
    } catch {
      alert("Error técnico al cancelar.");
    } finally {
      setCancelandoId(null);
    }
  };

  const verDetalleReserva = (localizador: string) => {
    router.push(`/perfil/mis-reservas/${encodeURIComponent(localizador)}`);
  };

  // ── Agrupar reservas por codigo_reserva_grupo ──────────────────────────────
  // Las reservas del mismo grupo (ida+vuelta) comparten codigo_reserva_grupo
  const grupos: Reserva[][] = (() => {
    const mapa = new Map<string, Reserva[]>();
    reservas.forEach((r) => {
      const key = r.codigo_reserva_grupo ?? String(r.reserva_id);
      if (!mapa.has(key)) mapa.set(key, []);
      mapa.get(key)!.push(r);
    });
    return Array.from(mapa.values());
  })();

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <FaSpinner className="animate-spin text-primario text-4xl" />
        <p className="text-[10px] font-black text-gris uppercase tracking-widest animate-pulse">
          Cargando tus reservas...
        </p>
      </div>
    );
  }

  if (status === "unauth") {
    return (
      <div className="max-w-sm mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh] text-center gap-5">
        <div className="bg-rojo/10 border border-rojo/20 rounded-3xl p-6 w-full">
          <FaExclamationTriangle className="text-rojo text-3xl mx-auto mb-3" />
          <p className="text-sm font-black text-titulo-resaltado uppercase">
            Acceso restringido
          </p>
          <p className="text-xs text-gris mt-1">
            Inicia sesión para ver tus reservas.
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="bg-primario text-blanco-fijo font-black text-xs uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-secundario transition-all w-full"
        >
          Ir al login
        </button>
      </div>
    );
  }

  // ─── Render principal ───────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <header className="flex items-end justify-between px-1 pb-4 border-b border-borde">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-titulo-resaltado uppercase tracking-tighter">
            Mis Reservas
          </h1>
          <p className="text-[10px] font-bold text-gris tracking-widest uppercase mt-1">
            {grupos.length} {grupos.length !== 1 ? "reservas" : "reserva"}{" "}
            encontrada{grupos.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>

      {/* Lista de grupos */}
      {grupos.length === 0 ? (
        <div className="border-2 border-dashed border-borde rounded-[2.5rem] py-20 flex flex-col items-center text-center gap-4">
          <div className="border border-borde p-5 rounded-3xl">
            <FaPlaneDeparture className="text-gris/20 text-4xl" />
          </div>
          <p className="text-gris font-bold text-sm uppercase tracking-widest">
            Aún no tienes reservas
          </p>
          <p className="text-gris/50 text-xs max-w-xs">
            Cuando realices una compra aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {grupos.map((grupo) => (
            <GrupoReserva
              key={grupo[0].codigo_reserva_grupo ?? grupo[0].reserva_id}
              grupo={grupo}
              onAbrirDetalle={verDetalleReserva}
              onCancelar={cancelarReserva}
              confirmandoId={confirmandoId}
              setConfirmandoId={setConfirmandoId}
              cancelandoId={cancelandoId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
