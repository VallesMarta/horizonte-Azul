'use client'

import { FaUserCircle } from 'react-icons/fa'
import useAuth from '@/hooks/useAuth'

interface NavPerfilProps {
  username: string
}

export default function NavPerfil({ username }: NavPerfilProps) {
  const { logout } = useAuth() // Hook para cerrar sesión

  return (
    <div className="flex flex-row items-center gap-3 bg-secundario/20 p-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
      <FaUserCircle className="text-4xl" />
      <span>{username}</span>
      <button
        onClick={logout} // Cierra sesión desde useAuth
        className="cursor-pointer bg-[#D13264] rounded-xl p-2 text-white hover:opacity-80 transition"
      >
        Cerrar Sesión
      </button>
    </div>
  )
}
