"use client";

import { FaUser, FaKey } from "react-icons/fa";

interface FormLoginProps {
  cambiarPagina: (pagina: string) => void;
  setUsuarioLoggeado: (username: string) => void;
  urlAPI: string;
}

export default function FormLogin({ cambiarPagina, setUsuarioLoggeado, urlAPI }: FormLoginProps) {
  
  const comprobarCredenciales = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    try {
      const respuesta = await fetch(`${urlAPI}/usuarios`);
      if (respuesta.ok) {
        const data = await respuesta.json();
        
        // Buscamos al usuario en el resultado
        const usuarioEncontrado = data.resultado?.find(
          (u: any) => u.username === username && u.password === password
        );

        if (usuarioEncontrado) {
          // Guardamos datos en el navegador
          localStorage.setItem("username", usuarioEncontrado.username);
          localStorage.setItem("username_id", usuarioEncontrado._id);
          localStorage.setItem("nombreCompleto", usuarioEncontrado.nombre);
          
          setUsuarioLoggeado(usuarioEncontrado.username);
          cambiarPagina('inicio');
        } else {
          alert("Credenciales incorrectas");
        }
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center gap-80 mx-60 p-4 rounded-3xl">
      {/* Imagen */}
      <div>
        <img
          src="/media/img/imf-login.png"
          alt="Imagen registro"
          className="rounded-3xl h-[420px] object-cover"
        />
      </div>

      {/* Formulario */}
      <form
        onSubmit={comprobarCredenciales}
        className="flex flex-col gap-4 bg-secundario p-10 rounded-3xl w-[350px]"
      >
        <div className="flex items-center">
          <FaUser className="mr-2 text-otro text-3xl" />
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="bg-fondo rounded-lg p-3 w-full text-secundario focus:ring-2 focus:ring-otro"
          />
        </div>

        <div className="flex items-center">
          <FaKey className="mr-2 text-otro text-3xl" />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            className="bg-fondo rounded-lg p-3 w-full text-secundario focus:ring-2 focus:ring-otro"
          />
        </div>
        
        <button
          type="submit"
          className="bg-otro text-secundario font-bold rounded-2xl p-3 transition-all duration-300 hover:bg-iconos hover:text-textoPrincipal hover:scale-105"
        >
          Acceder
        </button>
      </form>
    </div>
  );
}