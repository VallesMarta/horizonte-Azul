"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaBell,
  FaBellSlash,
  FaReply,
  FaPlane,
  FaTimes,
  FaTrash,
  FaCheckDouble,
  FaEraser,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Notificacion {
  id: number;
  tipo:
    | "respuesta_contacto"
    | "reserva_confirmada"
    | "reserva_cancelada"
    | "reserva_pendiente"
    | "sistema";
  titulo: string;
  cuerpo: string;
  leida: boolean;
  enlace?: string;
  created_at: string;
}

const TIPO_CONFIG = {
  respuesta_contacto: {
    label: "Respuesta",
    color: "bg-blue-500/20 text-blue-400",
    icon: <FaReply size={12} />,
  },
  reserva_confirmada: {
    label: "Confirmada",
    color: "bg-green-500/20 text-green-400",
    icon: <FaPlane size={12} />,
  },
  reserva_pendiente: {
    label: "Pendiente",
    color: "bg-orange-500/20 text-orange-400",
    icon: <FaBellSlash size={12} />,
  },
  reserva_cancelada: {
    label: "Cancelada",
    color: "bg-red-500/20 text-red-400",
    icon: <FaTimes size={12} />,
  },
  sistema: {
    label: "Sistema",
    color: "bg-gray-500/20 text-gray-400",
    icon: null,
  },
};

export default function NotificacionesCampana() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [estaMontado, setEstaMontado] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);

  useEffect(() => {
    setEstaMontado(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  });

  const fetchNotificaciones = async () => {
    try {
      const res = await fetch("/api/notificaciones", { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setNotificaciones(data.notificaciones || []);
        setNoLeidas(data.no_leidas || 0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) fetchNotificaciones();
  }, [user]);

  const cerrarTodoElEntorno = () => {
    setOpen(false);
    const sidebar = document.querySelector(
      'aside, .sidebar, #sidebar, [class*="sidebar"]',
    );
    const overlay = document.querySelector(
      '[class*="overlay"], [class*="backdrop"], #sidebar-overlay',
    );
    if (overlay instanceof HTMLElement) overlay.click();
    if (sidebar instanceof HTMLElement) {
      sidebar.classList.remove("translate-x-0", "left-0", "open", "active");
      sidebar.classList.add("-translate-x-full");
    }
  };

  const marcarTodasLeidas = async () => {
    try {
      const res = await fetch("/api/notificaciones", {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (res.ok) {
        setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
        setNoLeidas(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarLeidas = async () => {
    try {
      const res = await fetch("/api/notificaciones?solo_leidas=true", {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) setNotificaciones((prev) => prev.filter((n) => !n.leida));
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarTodas = async () => {
    if (!confirm("¿Borrar historial?")) return;
    try {
      const res = await fetch("/api/notificaciones", {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        setNotificaciones([]);
        setNoLeidas(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarUna = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/notificaciones/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        setNotificaciones((prev) => prev.filter((n) => n.id !== id));
        fetchNotificaciones();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAction = async (n: Notificacion) => {
    if (!n.leida) {
      setNotificaciones((prev) =>
        prev.map((item) =>
          item.id === n.id ? { ...item, leida: true } : item,
        ),
      );
      setNoLeidas((prev) => Math.max(0, prev - 1));
      fetch(`/api/notificaciones/${n.id}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
    }
    cerrarTodoElEntorno();
    const destino =
      n.enlace ??
      (n.tipo.includes("reserva")
        ? "/perfil/mis-reservas"
        : "/perfil/mis-consultas");
    router.push(destino);
  };

  if (!user || !estaMontado) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-10 h-10 rounded-2xl flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 border border-white/5"
      >
        <FaBell size={18} />
        {noLeidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-[#121418]">
            {noLeidas > 9 ? "+9" : noLeidas}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300"
              onClick={() => setOpen(false)}
            />

            <div className="relative w-full max-w-125 h-[85vh] max-h-187.5 bg-[#0c0d11] border border-white/10 rounded-[3.5rem] shadow-[0_40px_120px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              {/* Header con botones resaltados para móvil */}
              <div className="p-8 pb-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-1">
                      Panel de
                    </p>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                      Alertas
                    </h3>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-12 h-12 rounded-2xl bg-white/5 text-white/40 hover:text-white flex items-center justify-center transition-all"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                {/* Los botones ahora tienen un bg-white/10 inicial más visible en lugar de /5 */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={marcarTodasLeidas}
                    className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[8px] font-black uppercase text-white/60 hover:text-white transition-all flex flex-col items-center gap-1"
                  >
                    <FaCheckDouble /> Leídas
                  </button>
                  <button
                    onClick={eliminarLeidas}
                    className="py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-[8px] font-black uppercase text-blue-400 hover:text-blue-300 transition-all flex flex-col items-center gap-1"
                  >
                    <FaEraser /> Limpiar
                  </button>
                  <button
                    onClick={eliminarTodas}
                    className="py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[8px] font-black uppercase text-red-400 hover:text-red-300 transition-all flex flex-col items-center gap-1"
                  >
                    <FaTrash /> Borrar
                  </button>
                </div>
              </div>

              {/* Lista */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {notificaciones.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-10">
                    <FaBellSlash size={80} />
                    <p className="text-xs font-black uppercase tracking-widest mt-4">
                      Vacío
                    </p>
                  </div>
                ) : (
                  notificaciones.map((n) => {
                    const cfg = TIPO_CONFIG[n.tipo] || TIPO_CONFIG.sistema;
                    return (
                      <div
                        key={n.id}
                        onClick={() => handleAction(n)}
                        className={`group relative p-6 rounded-[2.5rem] cursor-pointer transition-all border ${!n.leida ? "bg-white/6 border-white/10 shadow-xl" : "bg-transparent border-transparent opacity-50"}`}
                      >
                        {!n.leida && (
                          <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                        )}

                        <div className="flex gap-5">
                          <div
                            className={`shrink-0 w-14 h-14 rounded-3xl flex items-center justify-center text-xl ${cfg.color}`}
                          >
                            {cfg.icon || <FaBell size={16} />}
                          </div>
                          <div className="flex-1 min-w-0 pr-4">
                            <p
                              className={`text-[13px] font-black leading-tight mb-1 ${!n.leida ? "text-white" : "text-white/60"}`}
                            >
                              {n.titulo}
                            </p>
                            <p className="text-[11px] text-white/30 line-clamp-2 leading-relaxed">
                              {n.cuerpo}
                            </p>
                          </div>
                        </div>

                        {/* Botón borrar: Ahora siempre visible (pero sutil) en móviles con md:opacity-0 */}
                        <button
                          onClick={(e) => eliminarUna(e, n.id)}
                          className="absolute bottom-4 right-8 w-8 h-8 rounded-xl opacity-40 md:opacity-0 group-hover:opacity-100 bg-red-500/10 text-red-500 flex items-center justify-center transition-all"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-8 bg-white/1 border-t border-white/5">
                <button
                  onClick={() => {
                    cerrarTodoElEntorno();
                    router.push("/perfil/mis-consultas");
                  }}
                  className="w-full py-5 rounded-4xl bg-white/10 hover:bg-primario text-white/60 hover:text-white text-[10px] font-black uppercase tracking-[0.5em] transition-all active:scale-95"
                >
                  Ver mensajes
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
