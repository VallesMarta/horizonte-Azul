"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FaCreditCard,
  FaSpinner,
  FaTrash,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import useAuth from "@/hooks/useAuth";

export default function MisTarjetasPage() {
  const { usuarioLoggeado } = useAuth();
  const [tarjetas, setTarjetas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  const fetchTarjetas = useCallback(async () => {
    if (!usuarioLoggeado?.id) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/tarjetas/${usuarioLoggeado.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.ok) {
        setTarjetas(data.resultado || []);
      } else {
        console.error("Error al cargar tarjetas:", data.error);
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      setLoading(false);
    }
  }, [usuarioLoggeado?.id]);

  useEffect(() => {
    if (usuarioLoggeado?.id) {
      fetchTarjetas();
    } else if (usuarioLoggeado === null) {
      setLoading(false);
    }
  }, [usuarioLoggeado, fetchTarjetas]);

  const handleEliminar = async (pmId: string) => {
    setEliminandoId(pmId);
    setConfirmandoId(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tarjetas", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentMethodId: pmId }),
      });

      const data = await res.json();
      if (data.ok) {
        // Pequeño delay para que se vea la animación de salida
        setTimeout(() => {
          setTarjetas((prev) =>
            prev.filter((t) => t.stripePaymentMethodId !== pmId),
          );
          setEliminandoId(null);
        }, 400);
      } else {
        setEliminandoId(null);
        alert("Error al eliminar la tarjeta");
      }
    } catch (error) {
      setEliminandoId(null);
      alert("Error de red al intentar eliminar");
    }
  };

  // Determina el gradiente de fondo según la marca
  const getCardStyle = (brand: string): string => {
    const b = brand.toLowerCase();
    if (b.includes("visa")) {
      return "bg-[linear-gradient(135deg,_#1a1f71_0%,_#0d47a1_55%,_#1565c0_100%)]";
    }
    if (b.includes("mastercard")) {
      return "bg-[linear-gradient(135deg,_#1a1a1a_0%,_#2d2d2d_50%,_#1a1a1a_100%)]";
    }
    if (b.includes("amex") || b.includes("american")) {
      return "bg-[linear-gradient(135deg,_#006fcf_0%,_#004a9f_50%,_#003380_100%)]";
    }
    return "bg-[linear-gradient(135deg,_#37474f_0%,_#546e7a_50%,_#455a64_100%)]";
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-titulo-resaltado uppercase tracking-tighter">
            Mis Tarjetas
          </h1>
          <p className="text-[10px] md:text-xs font-bold text-gris tracking-widest uppercase mt-1">
            {tarjetas.length} método{tarjetas.length !== 1 ? "s" : ""} de pago
            guardado{tarjetas.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>

      {/* CONTENIDO */}
      <section className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <FaSpinner className="animate-spin text-primario text-4xl" />
            <p className="text-[10px] font-black text-gris uppercase tracking-widest animate-pulse">
              Sincronizando con Stripe...
            </p>
          </div>
        ) : tarjetas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tarjetas.map((t) => {
              const isVisa = t.brand.toLowerCase().includes("visa");
              const isMaster = t.brand.toLowerCase().includes("mastercard");
              const isConfirmando = confirmandoId === t.stripePaymentMethodId;
              const isEliminando = eliminandoId === t.stripePaymentMethodId;

              return (
                <div
                  key={t.id}
                  className={`flex flex-col transition-all duration-400 ${
                    isEliminando
                      ? "opacity-0 scale-95"
                      : "opacity-100 scale-100"
                  }`}
                >
                  {/* ── TARJETA FÍSICA ── */}
                  <div
                    className={`
                      relative h-52 w-full rounded-t-2xl p-5 overflow-hidden
                      flex flex-col justify-between shadow-xl
                      ${getCardStyle(t.brand)}
                    `}
                  >
                    {/* Efecto de brillo de fondo */}
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-white/5 rounded-full" />

                    {/* FILA SUPERIOR: Chip + Logo marca */}
                    <div className="flex justify-between items-start relative z-10">
                      {/* Chip */}
                      <div className="w-9 h-6 rounded-md bg-linear-to-br from-yellow-200 to-yellow-500 opacity-90 shadow-sm" />

                      {/* Logo según marca */}
                      {isVisa && (
                        <span className="text-white font-black italic text-2xl tracking-tight drop-shadow">
                          VISA
                        </span>
                      )}
                      {isMaster && (
                        <div className="relative w-11 h-7">
                          <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-[#eb001b] opacity-90" />
                          <div className="absolute left-4 top-0 w-7 h-7 rounded-full bg-[#f79e1b] opacity-90" />
                        </div>
                      )}
                      {!isVisa && !isMaster && (
                        <span className="text-white/80 font-bold text-sm tracking-widest uppercase">
                          {t.brand}
                        </span>
                      )}
                    </div>

                    {/* NÚMERO */}
                    <div className="relative z-10">
                      <p className="text-white text-xl font-mono tracking-[0.22em] drop-shadow">
                        •••• •••• •••• {t.last4}
                      </p>
                    </div>

                    {/* FILA INFERIOR: Titular + Expiración */}
                    <div className="flex justify-between items-end relative z-10">
                      <div>
                        <p className="text-white/40 text-[7px] font-bold uppercase tracking-[0.2em] mb-0.5">
                          Card holder
                        </p>
                        <p className="text-white text-xs font-semibold uppercase tracking-wider truncate max-w-35">
                          {t.nombreTitular ||
                            usuarioLoggeado?.username ||
                            "Customer"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/40 text-[7px] font-bold uppercase tracking-[0.2em] mb-0.5">
                          Expires
                        </p>
                        <p className="text-white text-xs font-semibold font-mono">
                          {String(t.expMonth).padStart(2, "0")}/
                          {String(t.expYear).slice(-2)}
                        </p>
                      </div>
                    </div>

                    {/* Badge predeterminada */}
                    {t.esPredeterminada && (
                      <div className="absolute bottom-0 left-0 right-0 bg-verde/85 backdrop-blur-sm text-white text-[7px] font-black text-center py-1 uppercase tracking-[0.3em]">
                        Primary account
                      </div>
                    )}

                    {/* OVERLAY DE CONFIRMACIÓN — se activa al pulsar Eliminar */}
                    {isConfirmando && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm rounded-t-2xl z-20 flex flex-col items-center justify-center gap-4">
                        <p className="text-white text-sm font-semibold text-center px-6">
                          ¿Eliminar esta tarjeta?
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              handleEliminar(t.stripePaymentMethodId)
                            }
                            className="flex items-center gap-2 bg-rojo hover:bg-rojo/80 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all active:scale-95"
                          >
                            <FaCheck size={10} />
                            Eliminar
                          </button>
                          <button
                            onClick={() => setConfirmandoId(null)}
                            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-5 py-2 rounded-xl border border-white/20 transition-all active:scale-95"
                          >
                            <FaTimes size={10} />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── BARRA INFERIOR SIEMPRE VISIBLE ── */}
                  {/* Funciona en móvil y desktop sin depender de hover */}
                  <div className="flex items-center justify-between bg-bg border border-t-0 border-borde rounded-b-2xl px-4 py-2.5 gap-3">
                    <span className="text-gris/70 text-[11px] font-mono tracking-wide">
                      {t.brand} •••• {t.last4}
                    </span>
                    <button
                      onClick={() =>
                        setConfirmandoId(
                          isConfirmando ? null : t.stripePaymentMethodId,
                        )
                      }
                      disabled={!!eliminandoId}
                      className={`
                        flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all active:scale-95
                        ${
                          isConfirmando
                            ? "bg-rojo/10 border-rojo/30 text-rojo"
                            : "border-borde text-gris hover:border-rojo/40 hover:text-rojo hover:bg-rojo/5"
                        }
                        disabled:opacity-40 disabled:cursor-not-allowed
                      `}
                    >
                      {isEliminando ? (
                        <FaSpinner size={10} className="animate-spin" />
                      ) : (
                        <FaTrash size={10} />
                      )}
                      {isEliminando ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ESTADO VACÍO */
          <div className="bg-bg border-2 border-dashed border-borde rounded-[2.5rem] py-16 px-6 flex flex-col items-center justify-center text-center">
            <div className="bg-bg p-5 rounded-3xl shadow-sm mb-4 border border-borde">
              <FaCreditCard className="text-gris/40 size-10" />
            </div>
            <p className="text-gris font-bold text-sm uppercase tracking-widest">
              Tu cartera está vacía
            </p>
            <p className="text-gris/60 text-xs mt-1 max-w-xs mx-auto">
              Guarda tus tarjetas durante el proceso de reserva para que
              aparezcan aquí.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
