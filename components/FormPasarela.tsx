"use client";
import { useState } from "react";
import { FaCreditCard, FaLock, FaCalendarAlt } from "react-icons/fa";

export default function FormPasarela({ total, onPagoExitoso }: { total: number, onPagoExitoso: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSimularPago = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulamos espera de proceso de pasarela bancaria
    setTimeout(() => {
      setLoading(false);
      onPagoExitoso();
    }, 2000);
  };

  return (
    <form onSubmit={handleSimularPago} className="space-y-4 animate-in fade-in duration-500 font-lato">

      <div className="bg-white p-4 rounded-2xl border border-acento/30 shadow-sm">
        <p className="text-[10px] font-black text-gris uppercase tracking-widest mb-3">
          Detalles de Tarjeta
        </p>
        
        {/* Número de Tarjeta */}
        <div className="relative mb-3">
          <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-acento" />
          <input 
            type="text" 
            placeholder="0000 0000 0000 0000" 
            required
            className="w-full pl-12 pr-4 py-3 bg-fondo border border-gris/20 rounded-xl text-sm font-bold text-texto outline-none focus:border-primario transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Fecha */}
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-acento" />
            <input 
              type="text" 
              placeholder="MM/YY" 
              required
              className="w-full pl-12 pr-4 py-3 bg-fondo border border-gris/20 rounded-xl text-sm font-bold text-texto outline-none focus:border-primario transition-all"
            />
          </div>
          {/* CVC */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-acento" />
            <input 
              type="text" 
              placeholder="CVC" 
              required
              className="w-full pl-12 pr-4 py-3 bg-fondo border border-gris/20 rounded-xl text-sm font-bold text-texto outline-none focus:border-primario transition-all"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-verde hover:opacity-90 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-verde/20 disabled:bg-gris"
      >
        {loading ? (
          <span className="animate-pulse">VERIFICANDO...</span>
        ) : (
          <>
            <FaLock className="text-[10px]" />
            PAGAR {total}€
          </>
        )}
      </button>

      <p className="text-center text-[9px] text-gris uppercase font-bold tracking-tighter">
        Pago seguro encriptado con tecnología Horizonte Azul
      </p>
    </form>
  );
}