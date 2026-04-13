"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronLeft, FaChevronRight, FaPlane } from "react-icons/fa";

export default function SidebarMobile({ menuItems, title }: any) {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();
  const [ocultarPorHeader, setOcultarPorHeader] = useState(false);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [abierto]);

  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  useEffect(() => {
    // Función para revisar si el menú del header está abierto
    const checkHeader = () => {
      setOcultarPorHeader(
        document.documentElement.classList.contains("header-menu-abierto"),
      );
    };
    const observer = new MutationObserver(checkHeader);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* BOTÓN */}
      <button
        onClick={() => setAbierto(!abierto)}
        className={`fixed bg-primario text-white shadow-2xl transition-all duration-300 ease-in-out flex items-center justify-center active:scale-95 ${
          ocultarPorHeader ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          top: "120px",
          left: abierto ? "288px" : "10px",
          transform: "translateX(-50%)",
          width: "40px",
          height: "40px",
          borderRadius: "20%",
          zIndex: 60,
          border: "2px solid rgba(255,255,255,0.1)",
        }}
      >
        {abierto ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
      </button>

      {/* OVERLAY: Oscurece el contenido para centrar la vista en el menú */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          abierto ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setAbierto(false)}
      />

      {/* MENÚ LATERAL */}
      <aside
        className={`
          fixed left-0 h-full bg-secundario z-50 w-72 
          transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
          ${abierto ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-8 pt-24 flex flex-col gap-6 bg-secundario shrink-0 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-primario p-2 rounded-lg shadow-lg shadow-primario/20">
              <FaPlane className="text-white rotate-320 text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black italic uppercase text-xl tracking-tighter leading-none">
                {title}
                <span className="text-primario">HA</span>
              </span>
              <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-1">
                Configuración
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto bg-secundario custom-scrollbar pb-10">
          {menuItems.map((item: any) => {
            const activo = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                  activo
                    ? "bg-primario text-white shadow-lg"
                    : "text-white/60 hover:bg-white/5"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm uppercase tracking-wide">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
