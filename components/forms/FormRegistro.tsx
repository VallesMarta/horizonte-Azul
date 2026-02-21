"use client";

import { FaUser, FaKey, FaEnvelope, FaIdBadge } from "react-icons/fa";
import { API_URL } from "@/lib/api"; 
import { useRouter } from "next/navigation";

export default function FormRegistro() {
  const router = useRouter();

  const guardarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const usuarioNuevo = {
      username: String(formData.get("username")).trim(),
      password: String(formData.get("password")).trim(),
      nombre: String(formData.get("nombre")).trim(), 
      email: String(formData.get("email")).trim(),
    };

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioNuevo),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrar");
      }

      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      router.push("/login"); 
      
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-10 lg:gap-40 p-4 min-h-[70vh] bg-fondo">
      {/* Imagen */}
      <div className="hidden md:block">
        <img
          src="/media/img/logo_empresa.jpg"
          alt="Registro"
          className="rounded-3xl h-[420px] w-[400px] object-cover shadow-2xl"
        />
      </div>

      {/* Formulario */}
      <form
        onSubmit={guardarUsuario}
        className="flex flex-col gap-4 bg-secundario p-10 rounded-3xl w-full max-w-[400px] shadow-xl"
      >
        <h2 className="text-blanco-fijo text-2xl font-bold text-center mb-4">Crea tu cuenta</h2>
        {/* Username */}
        <div className="flex items-center bg-fondo rounded-lg p-1">
          <FaUser className="mx-3 text-secundario text-xl" />
          <input
            name="username"
            placeholder="Username"
            required
            className="bg-transparent p-3 w-full text-titulo-resaltado outline-none font-bold"
          />
        </div>

        {/* Password */}
        <div className="flex items-center bg-fondo rounded-lg p-1">
          <FaKey className="mx-3 text-secundario text-xl" />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            className="bg-transparent p-3 w-full text-titulo-resaltado outline-none font-bold"
          />
        </div>
        {/* Nombre Completo */}
        <div className="flex items-center bg-fondo rounded-lg p-1">
          <FaIdBadge className="mx-3 text-secundario text-xl" />
          <input
            name="nombre"
            placeholder="Nombre completo"
            required
            className="bg-transparent p-3 w-full text-titulo-resaltado outline-none font-bold"
          />
        </div>
        {/* Email */}
        <div className="flex items-center bg-fondo rounded-lg p-1">
          <FaEnvelope className="mx-3 text-secundario text-xl" />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            required
            className="bg-transparent p-3 w-full text-titulo-resaltado outline-none font-bold"
          />
        </div>

        <button
          type="submit"
          className="bg-otro text-secundario font-extrabold rounded-2xl p-4 mt-4 transition-all hover:brightness-110 hover:scale-[1.02] shadow-lg active:scale-95"
        >
          REGISTRARSE
        </button>
        
        <p className="text-blanco-fijo text-center text-sm mt-2">
          ¿Ya tienes cuenta?{" "}
          <button 
            type="button" 
            onClick={() => router.push('/login')} 
            className="underline font-bold"
          >
            Inicia sesión
          </button>
        </p>
      </form>
    </div>
  );
}