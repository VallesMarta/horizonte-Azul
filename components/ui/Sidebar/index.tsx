"use client";
import { useState, useEffect } from "react";
import SidebarDesktop from "./SidebarDesktop";
import SidebarMobile from "./SidebarMobile";

interface SidebarProps {
  menuItems: { name: string; icon: React.ReactNode; path: string }[];
  tipo: "admin" | "user";
}

export default function Sidebar({ menuItems, tipo }: SidebarProps) {
  const [esMovil, setEsMovil] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRes = () => setEsMovil(window.innerWidth < 1024);
    checkRes();
    window.addEventListener("resize", checkRes);
    return () => window.removeEventListener("resize", checkRes);
  }, []);

  const config = {
    title: tipo === "admin" ? "ADMIN" : "MI CUENTA",
    subtitle: tipo === "admin" ? "Panel de Control" : "Configuración",
  };

  if (esMovil === null) return null;

  return esMovil ? (
    <SidebarMobile menuItems={menuItems} {...config} />
  ) : (
    <SidebarDesktop menuItems={menuItems} {...config} />
  );
}