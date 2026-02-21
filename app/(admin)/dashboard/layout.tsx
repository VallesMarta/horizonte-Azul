"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { FaSpinner } from "react-icons/fa";

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

  return (
    <div className="flex min-h-screen bg-fondo">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}