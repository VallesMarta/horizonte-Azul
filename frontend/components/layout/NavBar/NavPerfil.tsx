"use client";

import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";

interface NavPerfilProps {
  username: string;
}

export default function NavPerfil({ username }: NavPerfilProps) {
  const { logout } = useAuth();

  return (
    <div className="flex items-center gap-4 pl-4 border-l border-white/20">
      <div className="flex flex-col items-end">
        <span className="text-[10px] uppercase tracking-widest text-white/50">
          Usuario
        </span>
        <span className="text-sm font-bold text-white">{username}</span>
      </div>

      <FaUserCircle className="text-4xl text-white/80" />

      {/* Botón de Logout */}
      <button
        onClick={logout}
        title="Cerrar Sesión"
        className="flex items-center gap-2 bg-rojo hover:bg-rojo/80 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-rojo/20"
      >
        <FaSignOutAlt />
        <span className="hidden lg:block">Salir</span>
      </button>
    </div>
  );
}
