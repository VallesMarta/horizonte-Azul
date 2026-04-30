"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { SecurityInput } from "@/components/ui/SecurityInput";

export default function SeguridadPage() {
  const { usuarioLoggeado } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  const [form, setForm] = useState({
    passwordActual: "",
    nuevaPassword: "",
    confirmarPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuarioLoggeado?.id) {
      return toast.error("Debes estar identificado para realizar esta acción");
    }
    if (form.nuevaPassword !== form.confirmarPassword) {
      return toast.error("La confirmación no coincide con la nueva contraseña");
    }

    if (form.nuevaPassword.length < 4) {
      return toast.error(
        "La nueva contraseña debe tener al menos 4 caracteres",
      );
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return toast.error("Sesión expirada. Por favor, vuelve a entrar.");
      }

      const res = await fetch("/api/auth/cambiar-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          passwordActual: form.passwordActual,
          nuevaPassword: form.nuevaPassword,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        toast.success("Seguridad actualizada correctamente");
        setForm({
          passwordActual: "",
          nuevaPassword: "",
          confirmarPassword: "",
        });
      } else {
        toast.error(data.error || "No se pudo actualizar la contraseña");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-titulo-resaltado uppercase tracking-tighter">
            Cambio de contraseña
          </h1>
        </div>
      </header>

      <div className="flex justify-center pt-4 md:pt-10">
        <div className="w-full max-w-xl">
          {/* FORMULARIO */}
          <form
            onSubmit={handleSubmit}
            className="bg-fondo rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-borde space-y-8"
          >
            <div className="space-y-6">
              <SecurityInput
                label="Contraseña Actual"
                name="passwordActual"
                type={verPassword ? "text" : "password"}
                value={form.passwordActual}
                onChange={handleChange}
                placeholder="••••••••"
              />

              {/* SEPARADOR CON ICONO */}
              <div className="relative py-2 flex items-center">
                <div className="grow border-t border-borde"></div>
                <span className="shrink mx-4 text-borde">
                  <FaLock size={10} />
                </span>
                <div className="grow border-t border-borde"></div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <SecurityInput
                  label="Nueva Contraseña"
                  name="nuevaPassword"
                  type={verPassword ? "text" : "password"}
                  value={form.nuevaPassword}
                  onChange={handleChange}
                  placeholder="Mínimo 4 caracteres"
                />
                <SecurityInput
                  label="Repetir Nueva Contraseña"
                  name="confirmarPassword"
                  type={verPassword ? "text" : "password"}
                  value={form.confirmarPassword}
                  onChange={handleChange}
                  placeholder="Confirmación"
                />
              </div>
            </div>

            {/* BOTÓN Y ACCIONES */}
            <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
              <button
                type="button"
                onClick={() => setVerPassword(!verPassword)}
                className="order-2 md:order-1 flex items-center gap-2 text-[10px] font-black uppercase text-gris hover:text-primario transition-all tracking-widest"
              >
                {verPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                {verPassword ? "Ocultar Datos" : "Ver Caracteres"}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="order-1 md:order-2 w-full md:w-auto md:ml-auto bg-secundario text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-primario transition-all shadow-xl shadow-fondo active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Actualizar Contraseña"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
