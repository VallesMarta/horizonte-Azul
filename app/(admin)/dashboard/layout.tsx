"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { FaSpinner } from "react-icons/fa";

import Sidebar from "@/components/ui/Sidebar/index";
import {
  FaChartPie,
  FaGlobeAmericas,
  FaConciergeBell,
  FaPlane,
  FaUsers,
  FaCog,
} from "react-icons/fa";
import { MdViewCarousel } from "react-icons/md";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, usuarioLoggeado } = useAuth();
  const router = useRouter();
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    // Esperamos a que useAuth determine si hay sesión o no
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (usuarioLoggeado !== null) {
      // Comprobamos si el usuario logeado es administrador
      if (!isAdmin) {
        router.replace("/");
      } else {
        // Si es admin, dejamos de mostrar el spinner
        setVerificando(false);
      }
    }
  }, [isAdmin, usuarioLoggeado, router]);

  if (verificando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-fondo">
        <FaSpinner className="animate-spin text-primario text-4xl mb-4" />
        <p className="text-titulo-resaltado text-[10px] font-black uppercase tracking-[0.3em]">
          Acceso Restringido
        </p>
      </div>
    );
  }
  const adminMenu = [
    { name: "Dashboard", icon: <FaChartPie />, path: "/dashboard" },
    {
      name: "Gestionar Viajes",
      icon: <FaGlobeAmericas />,
      path: "/dashboard/viajes",
    },
    {
      name: "Servicios",
      icon: <FaConciergeBell />,
      path: "/dashboard/servicios",
    },
    { name: "Vuelos", icon: <FaPlane />, path: "/dashboard/vuelos" },
    { name: "Usuarios", icon: <FaUsers />, path: "/dashboard/usuarios" },
    { name: "Banners", icon: <MdViewCarousel />, path: "/dashboard/banners" },
    { name: "Ajustes", icon: <FaCog />, path: "/dashboard/ajustes" },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-1">
        <Sidebar menuItems={adminMenu} tipo="admin" />
        <main className="flex-1 bg-fondo p-4 m-6">
          {children}
        </main>
      </div>
    </div>
  );
}
