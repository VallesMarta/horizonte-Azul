"use client";

import { FaUser, FaKey, FaEnvelope, FaIdBadge } from "react-icons/fa";
import { API_URL } from "@/lib/api"; 
import { useRouter } from "next/navigation";
import { InputAuth } from "../ui/InputAuth"; // Importamos el nuevo componente

export default function FormRegistro() {
  const router = useRouter();

  const guardarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Obtenemos los datos sin espacios
    const usuarioNuevo = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioNuevo),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al registrar");

      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      router.push("/login"); 
      
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-10 lg:gap-40 p-4 min-h-[70vh] bg-fondo">
      <div className="hidden md:block">
        <img
          src="/media/img/logo_empresa.jpg"
          alt="Registro"
          className="rounded-3xl h-105 w-100 object-cover shadow-2xl"
        />
      </div>

      <form onSubmit={guardarUsuario} className="flex flex-col gap-4 bg-secundario p-10 rounded-3xl w-full max-w-100 shadow-xl">
        <h2 className="text-blanco-fijo text-2xl font-bold text-center mb-4">Crea tu cuenta</h2>
        
        <InputAuth Icon={FaUser} name="username" placeholder="Username" />
        <InputAuth Icon={FaKey} name="password" placeholder="Contraseña" type="password" />
        <InputAuth Icon={FaIdBadge} name="nombre" placeholder="Nombre completo" />
        <InputAuth Icon={FaEnvelope} name="email" placeholder="Correo electrónico" type="email" />

        <button type="submit" className="bg-otro text-secundario font-extrabold rounded-2xl p-4 mt-4 transition-all hover:brightness-110 hover:scale-[1.02] shadow-lg active:scale-95">
          REGISTRARSE
        </button>
        
        <p className="text-blanco-fijo text-center text-sm mt-2">
          ¿Ya tienes cuenta?{" "}
          <button type="button" onClick={() => router.push('/login')} className="underline font-bold">
            Inicia sesión
          </button>
        </p>
      </form>
    </div>
  );
}