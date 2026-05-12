"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaReply,
  FaTrash,
  FaSpinner,
  FaUser,
  FaUserShield,
  FaPaperPlane,
  FaClock,
  FaCheck,
  FaInbox,
} from "react-icons/fa";

interface Mensaje {
  id: number;
  nombre: string;
  email: string;
  asunto: string;
  leido: boolean;
  respondido: boolean;
  ultimo_mensaje?: string | null;
  ultimo_autor?: "usuario" | "admin" | null;
  username?: string;
  usuario_id?: number | null;
  created_at: string;
}

interface HiloMensaje {
  id: number;
  autor: "usuario" | "admin";
  contenido: string;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora mismo";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? "ayer" : `hace ${d} días`;
}

function EstadoPill({ m, isAdmin }: { m: Mensaje; isAdmin: boolean }) {
  // Admin: resalta cuando el usuario ha respondido y espera al admin
  if (isAdmin) {
    if (m.ultimo_autor === "usuario" && !m.respondido) {
      return (
        <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-naranja text-blanco-fijo uppercase tracking-wide">
          <FaClock size={8} /> Pendiente
        </span>
      );
    }
    if (m.respondido || m.ultimo_autor === "admin") {
      return (
        <span className="text-[9px] font-black text-verde uppercase">
          <FaCheck className="inline mr-0.5" size={8} />
        </span>
      );
    }
    return (
      <span className="text-[9px] font-black text-gris uppercase">Nuevo</span>
    );
  }

  // Usuario
  if (m.ultimo_autor === "admin") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-verde/10 text-verde uppercase tracking-wide">
        <FaCheck size={8} /> Respondida
      </span>
    );
  }
  if (m.ultimo_autor === "usuario") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-naranja/10 text-naranja uppercase tracking-wide">
        <FaClock size={8} /> Esperando
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-gris/10 text-gris uppercase tracking-wide">
      <FaClock size={8} /> Pendiente
    </span>
  );
}

export default function MensajesPage() {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [seleccionado, setSeleccionado] = useState<Mensaje | null>(null);
  const [hilo, setHilo] = useState<HiloMensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [cargandoHilo, setCargandoHilo] = useState(false);
  const [vistaMovil, setVistaMovil] = useState<"lista" | "detalle">("lista");
  const hiloRef = useRef<HTMLDivElement>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // URLs según rol
  const urlLista = isAdmin ? "/api/contacto" : "/api/contacto/mio";
  const urlHilo = (id: number) =>
    isAdmin ? `/api/contacto/${id}/hilo` : `/api/contacto/mio/${id}`;
  const urlMarcar = (id: number) => `/api/contacto/${id}`;

  const cargar = async () => {
    setCargando(true);
    try {
      const res = await fetch(urlLista, { headers });
      if (res.ok) setMensajes(await res.json());
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [isAdmin]);

  // Scroll al fondo del hilo cuando cambia
  useEffect(() => {
    if (hiloRef.current) {
      hiloRef.current.scrollTop = hiloRef.current.scrollHeight;
    }
  }, [hilo]);

  const abrir = async (m: Mensaje) => {
    setSeleccionado(m);
    setTexto("");
    setCargandoHilo(true);
    setVistaMovil("detalle");

    // Marcar leído (solo admin)
    if (isAdmin && !m.leido) {
      await fetch(urlMarcar(m.id), { headers });
      setMensajes((prev) =>
        prev.map((x) => (x.id === m.id ? { ...x, leido: true } : x)),
      );
    }

    const res = await fetch(urlHilo(m.id), { headers });
    if (res.ok) setHilo(await res.json());
    setCargandoHilo(false);
  };

  const enviar = async () => {
    if (!seleccionado || !texto.trim()) return;
    setEnviando(true);

    const url = urlHilo(seleccionado.id);
    const method = "POST";
    const body = JSON.stringify({ contenido: texto });

    const res = await fetch(url, { method, headers, body });
    if (res.ok) {
      const nuevo: HiloMensaje = await res.json();
      setHilo((prev) => [...prev, nuevo]);
      setMensajes((prev) =>
        prev.map((x) =>
          x.id === seleccionado.id
            ? {
                ...x,
                respondido: isAdmin ? true : false,
                ultimo_autor: nuevo.autor,
                ultimo_mensaje: nuevo.contenido,
              }
            : x,
        ),
      );
      setTexto("");
    }
    setEnviando(false);
  };

  const eliminar = async (id: number) => {
    if (!isAdmin) return;
    await fetch(`/api/contacto/${id}`, { method: "DELETE", headers });
    setMensajes((prev) => prev.filter((x) => x.id !== id));
    if (seleccionado?.id === id) {
      setSeleccionado(null);
      setHilo([]);
      setVistaMovil("lista");
    }
  };

  // ── RENDER ──────────────────────────────────────────────────────────────────

  const Lista = (
    <div className="flex flex-col lg:h-auto">
      {/* Header lista */}
      <div className="px-5 py-4 border-b border-borde-suave flex items-center justify-between">
        <h2 className="text-xs font-black text-titulo-resaltado uppercase tracking-widest">
          {isAdmin ? "Mensajes" : "Mis consultas"}
        </h2>
      </div>

      {cargando ? (
        <div className="flex-1 flex items-center justify-center">
          <FaSpinner className="animate-spin text-primario" />
        </div>
      ) : mensajes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <FaInbox size={28} className="text-gris opacity-30" />
          <p className="text-xs font-bold text-gris uppercase tracking-wide">
            {isAdmin ? "Sin mensajes" : "Aún no has enviado consultas"}
          </p>
          {!isAdmin && (
            <Link
              href="/contacto"
              className="text-xs font-black text-primario hover:text-secundario transition-colors uppercase tracking-widest"
            >
              Enviar primera consulta →
            </Link>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-borde-suave">
          {mensajes.map((m) => {
            const pendienteAdmin =
              isAdmin && m.ultimo_autor === "usuario" && !m.respondido;
            const activo = seleccionado?.id === m.id;

            return (
              <div
                key={m.id}
                onClick={() => abrir(m)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  activo ? "bg-primario/10" : "hover:bg-bg-suave"
                } ${pendienteAdmin ? "border-l-4 border-naranja bg-naranja/5" : ""} ${
                  !m.leido && isAdmin ? "bg-primario/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {isAdmin ? (
                      !m.leido ? (
                        <FaEnvelope
                          size={11}
                          className="text-primario shrink-0"
                        />
                      ) : (
                        <FaEnvelopeOpen
                          size={11}
                          className="text-gris shrink-0"
                        />
                      )
                    ) : (
                      <FaEnvelope
                        size={11}
                        className={
                          m.ultimo_autor === "admin"
                            ? "text-verde shrink-0"
                            : "text-gris shrink-0"
                        }
                      />
                    )}
                    <span
                      className={`text-xs truncate ${
                        (!m.leido && isAdmin) || pendienteAdmin
                          ? "font-black text-texto"
                          : "font-bold text-gris"
                      }`}
                    >
                      {isAdmin ? m.nombre : m.asunto}
                    </span>
                  </div>
                  <EstadoPill m={m} isAdmin={isAdmin} />
                </div>
                <p className="text-[11px] text-gris truncate pl-5">
                  {isAdmin ? m.asunto : (m.ultimo_mensaje ?? "Sin mensajes")}
                </p>
                <p className="text-[10px] text-gris-claro pl-5 mt-0.5">
                  {timeAgo(m.created_at)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const Detalle = (
    <div className="flex flex-col lg:h-auto">
      {!seleccionado ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gris gap-3 py-24">
          <FaEnvelope size={32} className="opacity-20" />
          <p className="text-xs font-bold uppercase tracking-wide">
            Selecciona una conversación
          </p>
        </div>
      ) : (
        <>
          {/* Cabecera detalle */}
          <div className="px-4 sm:px-6 py-4 border-b border-borde-suave flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              {/* Botón volver en móvil */}
              <button
                onClick={() => setVistaMovil("lista")}
                className="lg:hidden shrink-0 mt-0.5 text-gris hover:text-primario transition-colors"
              >
                ←
              </button>
              <div className="min-w-0">
                <h3 className="font-black text-texto text-sm truncate">
                  {seleccionado.asunto}
                </h3>
                <p className="text-[11px] text-gris mt-0.5">
                  {isAdmin
                    ? `${seleccionado.nombre} · ${seleccionado.email}${seleccionado.username ? ` · @${seleccionado.username}` : ""}`
                    : timeAgo(seleccionado.created_at)}
                </p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => eliminar(seleccionado.id)}
                className="shrink-0 text-rojo hover:bg-rojo/10 p-2 rounded-lg transition-colors"
              >
                <FaTrash size={13} />
              </button>
            )}
          </div>

          {/* Hilo */}
          <div
            ref={hiloRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3"
          >
            {cargandoHilo ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin text-primario" />
              </div>
            ) : hilo.length === 0 ? (
              <p className="text-xs text-gris text-center py-8 font-bold uppercase tracking-wide">
                Sin mensajes aún
              </p>
            ) : (
              hilo.map((msg) => {
                // Admin ve usuario a la izquierda y admin a la derecha
                // Usuario ve sus mensajes a la derecha y admin a la izquierda
                const esMio = isAdmin
                  ? msg.autor === "admin"
                  : msg.autor === "usuario";

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 sm:gap-3 ${esMio ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-blanco-fijo ${
                        msg.autor === "admin" ? "bg-secundario" : "bg-gris"
                      }`}
                    >
                      {msg.autor === "admin" ? (
                        <FaUserShield size={11} />
                      ) : (
                        <FaUser size={11} />
                      )}
                    </div>

                    <div
                      className={`max-w-[78%] sm:max-w-[70%] flex flex-col gap-1 ${
                        esMio ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`px-3 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          esMio
                            ? "bg-secundario text-blanco-fijo rounded-tr-sm"
                            : "bg-bg-suave text-texto border border-borde-suave rounded-tl-sm"
                        }`}
                      >
                        {msg.contenido}
                      </div>
                      <span className="text-[10px] text-gris font-bold px-1">
                        {timeAgo(msg.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 border-t border-borde-suave">
            <div className="flex gap-2 sm:gap-3 items-end">
              <textarea
                rows={2}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    enviar();
                  }
                }}
                placeholder={
                  isAdmin
                    ? "Escribe tu respuesta... (Enter para enviar)"
                    : "Escribe tu mensaje..."
                }
                className="flex-1 bg-bg text-texto placeholder:text-placeholder border-2 border-borde-suave focus:border-primario focus:bg-card rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold outline-none resize-none transition-colors"
              />
              <button
                onClick={enviar}
                disabled={enviando || !texto.trim()}
                className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-secundario text-blanco-fijo flex items-center justify-center hover:bg-primario transition-colors disabled:opacity-50"
              >
                {enviando ? (
                  <FaSpinner size={12} className="animate-spin" />
                ) : (
                  <FaReply size={12} />
                )}
              </button>
            </div>
            <p className="text-[10px] text-gris mt-1.5 font-bold">
              Shift+Enter para nueva línea
            </p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 min-h-[calc(100vh-120px)]">
      <header className="px-1 pb-4 border-b border-borde">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-titulo-resaltado uppercase tracking-tighter">
              {isAdmin ? "Mensajes" : "Mis Consultas"}
            </h1>
            <p className="text-[10px] font-bold text-gris tracking-widest uppercase mt-1">
              {isAdmin
                ? "Gestiona las consultas recibidas"
                : "Tus mensajes con el equipo de soporte"}
            </p>
          </div>

          {!isAdmin && (
            <Link
              href="/contacto"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-secundario text-blanco-fijo text-[10px] font-black uppercase tracking-widest hover:bg-primario transition-all shadow-lg shadow-secundario/10 group"
            >
              <FaPaperPlane
                size={11}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
              Nueva
            </Link>
          )}
        </div>
      </header>

      <div className="flex gap-4 sm:gap-6 flex-1 min-h-0">
        {/* LISTA — oculta en móvil si hay detalle abierto */}
        <div
          className={`
          w-full lg:w-80 lg:shrink-0
          bg-card border border-card-borde rounded-3xl overflow-hidden
          ${vistaMovil === "detalle" ? "hidden lg:flex lg:flex-col" : "flex flex-col"}
        `}
        >
          {Lista}
        </div>

        {/* DETALLE — oculta en móvil si estamos en lista */}
        <div
          className={`
          flex-1 min-w-0
          bg-card border border-card-borde rounded-3xl overflow-hidden
          ${vistaMovil === "lista" ? "hidden lg:flex lg:flex-col" : "flex flex-col"}
        `}
        >
          {Detalle}
        </div>
      </div>
    </div>
  );
}
