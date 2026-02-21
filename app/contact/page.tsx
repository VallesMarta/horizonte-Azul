"use client";

import { useState } from "react";
import { FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaGlobe } from "react-icons/fa";

export default function ContactoPage() {
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    // Simulación de envío
    setTimeout(() => {
      setEnviando(false);
      alert("Mensaje enviado con éxito");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-blanco-fijo dark:bg-fondo py-20 px-4 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER DE PÁGINA */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-titulo-resaltado uppercase tracking-tighter mb-4">
            Hablemos
          </h1>
          <p className="text-gris dark:text-texto/40 font-bold uppercase tracking-[0.3em] text-xs">
            Estamos aquí para despegar contigo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* INFORMACIÓN DE CONTACTO */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-blanco-fijo dark:bg-gris-clarito p-8 rounded-[2.5rem] shadow-xl shadow-secundario/5 border border-gris-borde-suave h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-secundario dark:text-titulo-resaltado uppercase mb-8 tracking-tight">Info de contacto</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-primario/10 text-primario flex items-center justify-center transition-colors group-hover:bg-primario group-hover:text-blanco-fijo">
                      <FaEnvelope size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gris dark:text-texto/30 uppercase">Escríbenos</p>
                      <p className="font-bold text-secundario dark:text-titulo-resaltado text-sm">support@horizonteazul.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-primario/10 text-primario flex items-center justify-center transition-colors group-hover:bg-primario group-hover:text-blanco-fijo">
                      <FaPhoneAlt size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gris dark:text-texto/30 uppercase">Llámanos</p>
                      <p className="font-bold text-secundario dark:text-titulo-resaltado text-sm">+34 625 91 70 52</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-primario/10 text-primario flex items-center justify-center transition-colors group-hover:bg-primario group-hover:text-blanco-fijo">
                      <FaMapMarkerAlt size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gris dark:text-texto/30 uppercase">Oficina</p>
                      <p className="font-bold text-secundario dark:text-titulo-resaltado text-sm">Valencia, España</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gris-borde-suave flex justify-center gap-6 text-gris">
                <FaGlobe className="hover:text-primario cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="lg:col-span-2">
            <div className="bg-blanco-fijo dark:bg-gris-clarito p-10 rounded-[2.5rem] shadow-xl shadow-secundario/5 border border-gris-borde-suave">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gris dark:text-texto/40 uppercase ml-4 tracking-widest">Nombre</label>
                    <input 
                      type="text" 
                      placeholder="Tu nombre"
                      className="w-full bg-gris-clarito dark:bg-fondo border-2 border-transparent focus:border-primario/10 rounded-2xl py-4 px-6 font-bold text-secundario dark:text-titulo-resaltado transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gris dark:text-texto/40 uppercase ml-4 tracking-widest">Email</label>
                    <input 
                      type="email" 
                      placeholder="hola@horizonteazul.com"
                      className="w-full bg-gris-clarito dark:bg-fondo border-2 border-transparent focus:border-primario/10 rounded-2xl py-4 px-6 font-bold text-secundario dark:text-titulo-resaltado transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gris dark:text-texto/40 uppercase ml-4 tracking-widest">Asunto</label>
                  <input 
                    type="text" 
                    placeholder="¿En qué podemos ayudarte?"
                    className="w-full bg-gris-clarito dark:bg-fondo border-2 border-transparent focus:border-primario/10 rounded-2xl py-4 px-6 font-bold text-secundario dark:text-titulo-resaltado transition-all outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gris dark:text-texto/40 uppercase ml-4 tracking-widest">Mensaje</label>
                  <textarea 
                    rows={5}
                    placeholder="Escribe aquí tu consulta..."
                    className="w-full bg-gris-clarito dark:bg-fondo border-2 border-transparent focus:border-primario/10 rounded-3xl py-4 px-6 font-bold text-secundario dark:text-titulo-resaltado transition-all outline-none resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-secundario text-blanco-fijo py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-primario transition-all shadow-lg shadow-secundario/10 flex items-center justify-center gap-3 group active:scale-[0.98]"
                >
                  {enviando ? (
                    <span className="animate-pulse">Enviando...</span>
                  ) : (
                    <>
                      <FaPaperPlane size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}