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
    // Si usuarioLoggeado sigue siendo null, useAuth aún está cargando
    if (usuarioLoggeado === null) return;

    // Comprobamos si el usuario logeado es administrador
    if (!isAdmin) {
      // Si no es admin, lo redirigimos
      router.replace("/");
    } else {
      // Si es admin, dejamos de mostrar el spinner
      setVerificando(false);
    }
  }, [isAdmin, usuarioLoggeado, router]);

  // Pantalla de carga mientras useAuth lee el localStorage
  if (verificando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-secundario">
        <FaSpinner className="animate-spin text-primario text-4xl mb-4" />
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
          Verificando credenciales
        </p>
      </div>
    );
  }

  // Si llegamos aquí, es que isAdmin es true
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}