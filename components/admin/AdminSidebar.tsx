"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaPlane, 
  FaConciergeBell, 
  FaChartPie, 
  FaUsers, 
  FaCog
} from "react-icons/fa";

export default function AdminSidebar() {
  const pathname = usePathname();

  // Mejoramos la detección: activo si es la ruta exacta o si es una subruta
  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaChartPie />, path: "/dashboard" },
    { name: "Gestionar Viajes", icon: <FaPlane />, path: "/dashboard/viajes" },
    { name: "Gestionar Servicios", icon: <FaConciergeBell />, path: "/dashboard/servicios" },
    { name: "Gestionar Usuarios", icon: <FaUsers />, path: "/dashboard/usuarios" },
    { name: "Ajustes", icon: <FaCog />, path: "/dashboard/ajustes" },
  ];

  return (
    <aside className="w-64 bg-secundario min-h-screen flex flex-col shadow-2xl sticky top-0">
      {/* Logo / Título del Panel */}
      <div className="p-8">
        <div className="flex items-center gap-3 text-fondo">
          <div className="bg-primario p-2 rounded-lg">
            <FaPlane className="text-xl rotate-320" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">
            Admin<span className="text-primario">HA</span>
          </span>
        </div>
        <p className="text-[10px] text-fondo/40 mt-2 tracking-widest uppercase">
          Horizonte Azul v1.0
        </p>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`
              flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all duration-300
              ${isActive(item.path) 
                ? "bg-primario text-white shadow-lg shadow-primario/20" 
                : "text-fondo/60 hover:bg-white/5 hover:text-fondo"
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>      
    </aside>
  );
}