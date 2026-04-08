"use client";

import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function NavPerfil() {
  // Extraemos 'user' y 'logout' directamente del contexto
  const { user, logout } = useAuth();
  const fotoUrl = user?.fotoperfil;

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
        <div className="relative w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
          {fotoUrl ? (
            /* SI HAY FOTO: La mostramos redonda y con un borde fino */
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20 shadow-inner bg-white/10">
              <img
                src={fotoUrl}
                alt="Perfil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Si la URL falla, podrías resetearla o mostrar el icono
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            /* SI NO HAY FOTO: Mantenemos el icono actual */
        <FaUserCircle className="text-4xl text-white/80 transition-transform hover:scale-110 cursor-pointer" />
          )}
        </div>
      </Link>

      {/* Botón de Logout */}
      <button
        onClick={logout}
        title="Cerrar Sesión"
        className="flex items-center gap-2 bg-rojo text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-900/20 cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:shadow-red-900/40 active:scale-95"
      >
        <FaSignOutAlt className="text-lg" />
        <span className="hidden lg:block">SALIR</span>
      </button>
    </div>
  );
}
