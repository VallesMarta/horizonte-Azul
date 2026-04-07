"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FaUser,
  FaLock,
  FaCreditCard,
  FaHeart,
  FaPlane,
  FaSpinner,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-fondo">
        <FaSpinner className="animate-spin text-primario text-4xl mb-4" />
        <p className="text-titulo-resaltado text-[10px] font-black uppercase tracking-[0.3em]">
          Cargando datos...
        </p>
      </div>
    );
  }

  const menu = [
    { name: "Pasaporte", href: "/perfil", icon: <FaUser /> },
    { name: "Seguridad", href: "/perfil/seguridad", icon: <FaLock /> },
    { name: "Mis Tarjetas", href: "/perfil/pagos", icon: <FaCreditCard /> },
    { name: "Mis Viajes", href: "/mis-reservas", icon: <FaPlane /> },
    { name: "Favoritos", href: "/favoritos", icon: <FaHeart /> },
  ];

  return (
    <div className="flex min-h-screen bg-fondo transition-colors duration-500">
      {/* Sidebar de Usuario */}
      <aside className="w-20 md:w-64 bg-white dark:bg-gris-clarito border-r border-gris-borde-suave dark:border-white/5 flex flex-col">
        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                  pathname === item.href
                    ? "bg-primario text-white shadow-lg shadow-primario/20"
                    : "text-gris hover:bg-primario/10 hover:text-primario"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="hidden md:block font-bold text-sm">
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
