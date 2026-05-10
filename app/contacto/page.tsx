"use client";

import { useState } from "react";
import {
  FaPaperPlane,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaGlobe,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

export default function ContactoPage() {
  const { user } = useAuth();

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nombre: user?.nombre ?? "",
    email: user?.email ?? "",
    asunto: "",
    mensaje: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al enviar el mensaje");

      setEnviado(true);
      setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
    } catch (err) {
      setError("No se pudo enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-fondo py-20 px-4 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-titulo-resaltado uppercase tracking-tighter mb-4">
            Hablemos
          </h1>
          <p className="text-gris font-bold uppercase tracking-[0.3em] text-xs">
            Estamos aquí para despegar contigo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* INFO DE CONTACTO */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-card-borde p-8 rounded-[2.5rem] shadow-xl shadow-secundario/5 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-titulo-resaltado uppercase mb-8 tracking-tight">
                  Info de contacto
                </h3>

                <div className="space-y-6">
                  {[
                    {
                      icon: <FaEnvelope size={18} />,
                      label: "Escríbenos",
                      value: "info.horizonteazul@gmail.com",
                    },
                    {
                      icon: <FaPhoneAlt size={18} />,
                      label: "Llámanos",
                      value: "+34 625 91 70 52",
                    },
                    {
                      icon: <FaMapMarkerAlt size={18} />,
                      label: "Oficina",
                      value: "Valencia, España",
                    },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-primario/10 text-primario flex items-center justify-center transition-colors group-hover:bg-primario group-hover:text-blanco-fijo flex-shrink-0">
                        {icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gris uppercase tracking-widest">
                          {label}
                        </p>
                        <p className="font-bold text-texto text-sm">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-borde-suave flex justify-center gap-6">
                <FaGlobe
                  size={18}
                  className="text-gris hover:text-primario cursor-pointer transition-colors"
                />
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-card-borde p-10 rounded-[2.5rem] shadow-xl shadow-secundario/5">
              {/* Estado: enviado */}
              {enviado ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-verde/10 text-verde flex items-center justify-center text-2xl">
                    ✓
                  </div>
                  <h3 className="font-black text-titulo-resaltado text-xl uppercase tracking-tight">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-gris text-sm font-bold max-w-xs">
                    Te responderemos lo antes posible en tu correo.
                  </p>
                  <button
                    onClick={() => setEnviado(false)}
                    className="mt-4 text-xs font-black uppercase tracking-widest text-primario hover:text-secundario transition-colors"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gris uppercase ml-4 tracking-widest">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        required
                        className="w-full bg-bg text-texto placeholder:text-placeholder border-2 border-borde-suave focus:border-primario focus:bg-card rounded-2xl py-4 px-6 font-bold transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gris uppercase ml-4 tracking-widest">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        required
                        className="w-full bg-bg text-texto placeholder:text-placeholder border-2 border-borde-suave focus:border-primario focus:bg-card rounded-2xl py-4 px-6 font-bold transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gris uppercase ml-4 tracking-widest">
                      Asunto
                    </label>
                    <input
                      type="text"
                      name="asunto"
                      value={form.asunto}
                      onChange={handleChange}
                      placeholder="¿En qué podemos ayudarte?"
                      required
                      className="w-full bg-bg text-texto placeholder:text-placeholder border-2 border-borde-suave focus:border-primario focus:bg-card rounded-2xl py-4 px-6 font-bold transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gris uppercase ml-4 tracking-widest">
                      Mensaje
                    </label>
                    <textarea
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Escribe aquí tu consulta..."
                      required
                      className="w-full bg-bg text-texto placeholder:text-placeholder border-2 border-borde-suave focus:border-primario focus:bg-card rounded-3xl py-4 px-6 font-bold transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-rojo text-xs font-bold text-center">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full bg-secundario text-blanco-fijo py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-primario transition-all shadow-lg shadow-secundario/10 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50"
                  >
                    {enviando ? (
                      <FaSpinner size={14} className="animate-spin" />
                    ) : (
                      <>
                        <FaPaperPlane
                          size={14}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
