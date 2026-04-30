"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronLeft, FaChevronRight, FaPlane } from "react-icons/fa";

export default function SidebarDesktop({ menuItems, title, subtitle }: any) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(true);

  const isActive = (path: string) =>
    path === "/dashboard" || path === "/perfil"
      ? pathname === path
      : pathname.startsWith(path);

  return (
    <aside
      className={`bg-secundario sticky top-26 z-40 flex flex-col h-[calc(100vh-104px)] transition-all duration-500 ease-in-out ${
        abierto ? "w-64 border-r border-white/5" : "w-0 border-none"
      }`}
    >
      {/* BOTÓN ABRIR Y CERRAR MENÚ */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="absolute top-10 bg-primario text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 z-60 transition-all duration-500 ease-in-out"
        style={{
          left: abierto ? "256px" : "10px",
          transform: "translateX(-50%)",
          width: "36px",
          height: "36px",
          borderRadius: "20%",
          border: "2px solid rgba(255,255,255,0.1)",
        }}
      >
        {abierto ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
      </button>

      {/* CONTENEDOR DE CONTENIDO */}
      <div
        className="flex flex-col h-full overflow-hidden shrink-0 transition-all duration-500 ease-in-out"
        style={{ width: abierto ? "256px" : "0px", opacity: abierto ? 1 : 0 }}
      >
        {/* HEADER */}
        <div className="p-6 flex items-center gap-3 shrink-0 whitespace-nowrap">
          <div className="bg-primario p-2 rounded-lg text-white shadow-lg">
            <FaPlane className="rotate-320 text-xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-white italic tracking-tighter uppercase leading-none">
              {title}
              <span className="text-primario">HA</span>
            </span>
            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
              {subtitle}
            </span>
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {menuItems.map((item: any) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 p-3 rounded-xl font-bold transition-colors whitespace-nowrap ${
                isActive(item.path)
                  ? "bg-primario text-white shadow-lg"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
