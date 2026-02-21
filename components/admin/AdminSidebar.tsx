"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaPlane, 
  FaConciergeBell, 
  FaChartPie, 
  FaUsers, 
  FaCog,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(true);

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
    <>
      {!abierto && (
        <button 
          onClick={() => setAbierto(true)}
          className="fixed top-[72px] md:top-[104px] left-0 z-[100] bg-secundario dark:bg-gris-clarito text-primario p-3 rounded-r-xl shadow-2xl border-y border-r border-blanco-fijo/10 transition-all"
        >
          <FaChevronRight size={18} />
        </button>
      )}

      <aside className={`bg-secundario dark:bg-gris-clarito min-h-screen flex flex-col shadow-2xl sticky top-0 transition-all duration-300 z-[90] overflow-hidden border-r dark:border-gris-borde-suave ${abierto ? "w-64" : "w-0"}`}>
        <div className="p-8 min-w-[256px]">
          <div className="flex items-center justify-between text-fondo dark:text-titulo-resaltado">
            <div className="flex items-center gap-3">
              <div className="bg-primario p-2 rounded-lg">
                <FaPlane className="text-xl rotate-320 text-blanco-fijo" />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase">
                Admin<span className="text-primario">HA</span>
              </span>
            </div>
            <button onClick={() => setAbierto(false)} className="text-fondo/40 dark:text-texto/40 hover:text-primario">
              <FaChevronLeft size={20} />
            </button>
          </div>
          <p className="text-[10px] text-fondo/40 dark:text-texto/40 mt-2 tracking-widest uppercase font-bold">
            Horizonte Azul v1.0
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2 min-w-[256px]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all duration-300
                ${isActive(item.path) 
                  ? "bg-primario text-blanco-fijo shadow-lg shadow-primario/20" 
                  : "text-fondo/60 dark:text-texto/60 hover:bg-blanco-fijo/5 dark:hover:bg-primario/10 hover:text-fondo dark:hover:text-primario"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>      
      </aside>
    </>
  );
}