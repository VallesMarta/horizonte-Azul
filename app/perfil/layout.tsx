"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FaUser,
  FaLock,
  FaCreditCard,
  FaPlane,
  FaSpinner,
} from "react-icons/fa";
import Sidebar from "@/components/ui/Sidebar/index";

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  const userMenu = [
    { name: "Mi Pasaporte", icon: <FaUser />, path: "/perfil" },
    { name: "Mis Reservas", icon: <FaPlane />, path: "/mis-reservas" },
    {
      name: "Mis Tarjetas",
      icon: <FaCreditCard />,
      path: "/perfil/mis-tarjetas",
    },
    { name: "Seguridad", icon: <FaLock />, path: "/perfil/seguridad" },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-1">
        <Sidebar menuItems={userMenu} tipo="user" />
        <main className="flex-1 bg-fondo p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
