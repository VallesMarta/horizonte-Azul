"use client";

import { FaUser, FaKey, FaEnvelope, FaIdBadge } from "react-icons/fa";

export default function FormRegistro() {
  
  const guardarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        onSubmit={guardarUsuario}
        className="flex flex-col gap-4 bg-secundario p-10 rounded-3xl w-[350px]"
      >
        <div className="flex items-center">
          <FaUser className="mr-2 text-otro text-3xl" />
          <input
            name="username"
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
          Registrarse
        </button>
      </form>
    </div>
  );
}
