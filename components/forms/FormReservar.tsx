"use client";

import { useState } from "react";
import { Viaje } from "@/models/types";
import { API_URL } from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import CheckboxGuardar from "@/components/CheckboxGuardar";
import SelectorMarca from "@/components/SelectorMarca";
import {
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
  FaArrowRight,
  FaLock,
} from "react-icons/fa";

interface FormReservarProps {
  viaje: Viaje;
  setMostrarModal: (estado: boolean) => void;
}

export default function FormReservar({
  viaje,
  setMostrarModal,
}: FormReservarProps) {
  const { usuarioLoggeado } = useAuth();

  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [guardarTarjeta, setGuardarTarjeta] = useState(false);

  const hoy = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    fecSalida: hoy,
    pasajeros: 1,
    numeroTarjeta: "",
    expiracion: "",
    cvc: "",
    tipoTarjeta: "Mastercard",
  });

  const totalPrecio = Number(viaje.precio || 0) * formData.pasajeros;

  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.match(/.{1,4}/g)?.join(" ") || "";
    setFormData({ ...formData, numeroTarjeta: value.slice(0, 19) });
  };

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setFormData({ ...formData, expiracion: value });
  };

  const confirmarReservaYPagos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioLoggeado?.id) return alert("Debes estar logueado");

    const rawCardNumber = formData.numeroTarjeta.replace(/\s/g, "");
    
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioLoggeado.id,
          viaje_id: viaje.id,
          fecSalida: formData.fecSalida,
          pasajeros: formData.pasajeros,
          total: totalPrecio,
          save_card: guardarTarjeta,
          card_last4: rawCardNumber.slice(-4),
          tipo_tarjeta: formData.tipoTarjeta,
        }),
      });

      if (res.ok) {
        setEnviado(true);
        setTimeout(() => setMostrarModal(false), 3000);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "Intente de nuevo"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <FaCheckCircle className="text-green-500 size-10" />
        </div>
        <h3 className="text-2xl font-black text-secundario uppercase italic tracking-tighter">
          ¡Reserva Confirmada!
        </h3>
        <p className="text-gray-400 text-[10px] font-bold uppercase mt-2 tracking-[0.2em]">
          ¡Gracias por confiar en nosotros! Que tenga un buen viaje.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {paso === 1 ? (
        <form
          onSubmit={(e) => { e.preventDefault(); setPaso(2); }}
          className="space-y-6 animate-in slide-in-from-right-8 duration-500"
        >
          <div className="space-y-5">
            <div className="group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-2 mb-2 ml-1 transition-colors group-focus-within:text-primario">
                <FaCalendarAlt /> Fecha de Salida
              </label>
              <input
                required
                type="date"
                min={hoy}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 text-base font-bold text-secundario outline-none focus:border-primario/20 focus:ring-4 focus:ring-primario/5 transition-all"
                value={formData.fecSalida}
                onChange={(e) => setFormData({ ...formData, fecSalida: e.target.value })}
              />
            </div>

            <div className="group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-2 mb-2 ml-1 transition-colors group-focus-within:text-primario">
                <FaUsers /> Cantidad de Pasajeros
              </label>
              <div className="flex items-center justify-between bg-white rounded-2xl p-2 border-2 border-gray-100">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, pasajeros: Math.max(1, formData.pasajeros - 1) })}
                  className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl text-secundario font-black text-xl hover:bg-primario hover:text-white transition-all active:scale-90"
                >
                  –
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-secundario">{formData.pasajeros}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Pasajeros</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, pasajeros: formData.pasajeros + 1 })}
                  className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl text-secundario font-black text-xl hover:bg-primario hover:text-white transition-all active:scale-90"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-secundario text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-primario transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            Continuar al Pago <FaArrowRight size={14} />
          </button>
        </form>
      ) : (
        <form
          onSubmit={confirmarReservaYPagos}
          className="space-y-6 animate-in slide-in-from-left-8 duration-500 pb-2"
        >
          {/* Tarjeta Visual */}
          <div className="bg-secundario p-6 md:p-8 rounded-[2rem] text-white space-y-6 shadow-2xl relative overflow-hidden border border-white/10">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primario/20 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10">
              <SelectorMarca
                value={formData.tipoTarjeta}
                onChange={(val) => setFormData({ ...formData, tipoTarjeta: val })}
              />
            </div>

            <div className="space-y-2 relative z-10">
              <label className="text-[9px] font-black text-white/30 uppercase ml-1 tracking-widest">Número de tarjeta</label>
              <input
                required
                type="text"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold outline-none focus:bg-white/10 focus:border-primario/50 transition-all placeholder:text-white/10 tracking-[0.15em]"
                value={formData.numeroTarjeta}
                onChange={handleCardNumber}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase ml-1 tracking-widest">Expiración</label>
                <input
                  required
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white/10 transition-all text-center"
                  value={formData.expiracion}
                  onChange={handleExpiry}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase ml-1 tracking-widest">CVC</label>
                <input
                  required
                  type="text"
                  placeholder="•••"
                  maxLength={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white/10 transition-all text-center"
                  value={formData.cvc}
                  onChange={(e) => setFormData({ ...formData, cvc: e.target.value.replace(/\D/g, "") })}
                />
              </div>
            </div>

            <div className="pt-2 relative z-10">
              <CheckboxGuardar checked={guardarTarjeta} onChange={setGuardarTarjeta} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primario text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] shadow-xl shadow-primario/20 active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? "PROCESANDO..." : `CONFIRMAR PAGO · ${totalPrecio.toFixed(2)}€`}
            </button>
            <button
              type="button"
              onClick={() => setPaso(1)}
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center hover:text-secundario transition-colors"
            >
              ← Revisar fecha y viajeros
            </button>
          </div>
        </form>
      )}
    </div>
  );
}