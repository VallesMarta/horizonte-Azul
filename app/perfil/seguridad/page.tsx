"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash, FaFingerprint, FaLock } from "react-icons/fa";
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
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-primario/10 rounded-2xl text-primario">
          <FaFingerprint size={30} />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-titulo-resaltado">
            Cambio de contraseña
          </h1>
          <p className="text-[9px] font-bold text-gris uppercase tracking-widest opacity-70">
            Usuario: {usuarioLoggeado?.username || "Cargando..."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 bg-white dark:bg-gris-clarito rounded-4xl p-8 shadow-xl border border-gris-borde-suave dark:border-white/5 space-y-6"
        >
          <div className="space-y-5">
            <SecurityInput
              label="Contraseña Actual"
              name="passwordActual"
              type={verPassword ? "text" : "password"}
              value={form.passwordActual}
              onChange={handleChange}
              placeholder="Introduce tu clave vigente"
            />

            <div className="h-px bg-gris-borde-suave dark:bg-white/5 my-2"></div>

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
              placeholder="Confirma la nueva clave"
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gris-borde-suave dark:border-white/5">
            <button
              type="button"
              onClick={() => setVerPassword(!verPassword)}
              className="text-[9px] font-black uppercase text-gris hover:text-primario transition-colors flex items-center gap-2 tracking-[0.2em]"
            >
              {verPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              {verPassword ? "Ocultar" : "Mostrar"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-primario text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primario/20 disabled:opacity-50"
            >
              {loading ? "Sincronizando..." : "Validar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
