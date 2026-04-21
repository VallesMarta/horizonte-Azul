"use client";

import { useState } from "react";
import { FaUser, FaKey } from "react-icons/fa";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { InputAuth } from "@/components/ui/InputAuth";

export default function FormLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    try {
      const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await respuesta.json();

      if (respuesta.ok && data.token) {
        login(data.token, data.usuario);
        toast.success(`¡Bienvenido de nuevo, ${data.usuario.username}!`);
        window.location.href = "/";
      } else {
        toast.error(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      toast.error("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-10 lg:gap-40 p-4 min-h-[70vh] bg-fondo">
      <div className="hidden md:block relative w-75 h-105">
        <Image
          src="/media/img/imf-login.png"
          alt="Login Horizonte Azul"
          fill
          priority
          className="rounded-3xl object-cover shadow-2xl"
        />
      </div>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-6 bg-secundario p-10 rounded-3xl w-full max-w-100 shadow-xl"
      >
        <h2 className="text-blanco-fijo text-2xl font-bold text-center mb-4">
          Bienvenido de nuevo
        </h2>

        <InputAuth
          Icon={FaUser}
          name="username"
          placeholder="Nombre de usuario"
          required
        />

        <InputAuth
          Icon={FaKey}
          name="password"
          type="password"
          placeholder="Contraseña"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-otro text-secundario font-extrabold rounded-2xl p-4 mt-4 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 shadow-lg disabled:grayscale disabled:cursor-not-allowed"
        >
          {isLoading ? "CARGANDO..." : "INICIAR SESIÓN"}
        </button>

        <p className="text-blanco-fijo text-center text-sm mt-2">
          ¿No tienes una cuenta?{" "}
          <button
            type="button"
            onClick={() => router.push("/registro")}
            className="underline font-bold hover:text-otro transition-colors"
          >
            Crear cuenta
          </button>
        </p>
      </form>
    </div>
  );
}
