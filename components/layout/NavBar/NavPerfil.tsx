"use client";

import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function NavPerfil() {
  // Extraemos 'user' y 'logout' directamente del contexto
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-4 pl-4 border-l border-white/20">
      <Link
        href="/perfil"
        className="flex items-center gap-4 group cursor-pointer transition-all active:scale-95"
      >
        {/* Información del Usuario */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-white/50">
            Perfil
          </span>
          <span className="text-sm font-bold text-white uppercase">
            {user?.username || "Usuario"}
          </span>
        </div>

        {/* Icono de Perfil */}
        <FaUserCircle className="text-4xl text-white/80 transition-transform hover:scale-110 cursor-pointer" />
      </Link>

      {/* Botón de Logout */}
      <button
        onClick={logout}
        title="Cerrar Sesión"
        className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-red-900/20"
      >
        <FaSignOutAlt className="text-lg" />
        <span className="hidden lg:block">SALIR</span>
      </button>
    </div>
  );
}
