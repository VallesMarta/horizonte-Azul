"use client";

import { FaUser, FaKey } from "react-icons/fa";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation"; 

interface FormLoginProps {
  setUsuarioLoggeado?: (username: string) => void; 
}

export default function FormLogin({ setUsuarioLoggeado }: FormLoginProps) {
  const router = useRouter(); // Necesario para router.push -> Navega a otra ruta sin recargar la página
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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
        // Guardar datos en el navegador
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.usuario.username);        
        localStorage.setItem("userId", String(data.usuario.id)); 
        localStorage.setItem("nombre", data.usuario.nombre);
        localStorage.setItem("isAdmin", data.usuario.isAdmin ? "true" : "false");

          if (setUsuarioLoggeado) {
            setUsuarioLoggeado(data.usuario.username);
          }

          // En lugar de router.push, usamos esto para asegurar que el Header se resetee
          window.location.href = "/";
          
      } else {
        alert(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-10 lg:gap-40 p-4">
      {/* Imagen */}
      <div className="hidden md:block">
        <img
          src="/media/img/imf-login.png"
          alt="Login"
          className="rounded-3xl h-[420px] object-cover shadow-2xl"
        />
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-6 bg-secundario p-10 rounded-3xl w-full max-w-[400px] shadow-xl"
      >
        <h2 className="text-fondo text-2xl font-bold text-center mb-4">Bienvenido de nuevo</h2>
        
        <div className="flex items-center bg-fondo rounded-lg p-1">
          <FaUser className="mx-3 text-secundario text-xl" />
          <input
            name="username"
            type="text"
            placeholder="Usuario"
            required
            className="bg-transparent p-3 w-full text-secundario outline-none"
          />
        </div>

        <div className="flex items-center bg-fondo rounded-lg p-1">
          <FaKey className="mx-3 text-secundario text-xl" />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            className="bg-transparent p-3 w-full text-secundario outline-none"
          />
        </div>
        
        <button
          type="submit"
          className="bg-otro text-secundario font-extrabold rounded-2xl p-4 mt-4 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 shadow-lg"
        >
          INICIAR SESIÓN
        </button>
        <p className="text-fondo text-center text-sm mt-2">
          ¿No tienes una cuenta?{" "}
          <button 
            type="button" 
            onClick={() => router.push('/registro')} 
            className="underline font-bold"
          >
            Crear cuenta
          </button>
        </p>
      </form>
    </div>
  );
}