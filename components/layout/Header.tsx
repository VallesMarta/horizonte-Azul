"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NavEnlace from "@/components/layout/NavBar/NavEnlace";
import NavButton from "@/components/layout/NavBar/NavButton";
import NavPerfil from "@/components/layout/NavBar/NavPerfil";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const { user, loading } = useAuth();
  const [estaMontado, setEstaMontado] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    setEstaMontado(true);
  }, []);

  useEffect(() => {
    if (menuAbierto) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("header-menu-abierto");
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.classList.remove("header-menu-abierto");
    }
  }, [menuAbierto]);

  if (!estaMontado || loading) {
    return (
      <header className="p-4 bg-primario text-white shadow-md">
        <div className="max-w-[98%] mx-auto w-full flex justify-between items-center px-2">
          <div className="relative h-12 w-32 md:h-16 md:w-48">
            <div className="bg-white/10 w-full h-full rounded animate-pulse" />
          </div>
          <div className="h-8 w-8 bg-white/10 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-100 bg-primario text-white shadow-lg">
      <div className="max-w-[98%] mx-auto px-2 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="shrink-0 relative h-12 w-32 md:h-20 md:w-56 transition-transform hover:scale-105"
        >
          <Image
            src="/media/img/logo_empresa_header.png"
            alt="Logo de Horizonte Azul"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {!user ? (
              <>
                <NavEnlace irA="/" textoAMostrar="Inicio" />
                <NavEnlace irA="/about" textoAMostrar="Nosotros" />
                <NavEnlace irA="/contact" textoAMostrar="Contacto" />
                <NavButton
                  irA="/registro"
                  textoAMostrar="Crear cuenta"
                  color="primario"
                />
                <NavButton
                  irA="/login"
                  textoAMostrar="Iniciar Sesión"
                  color="secundario"
                />
                <ThemeToggle />
              </>
            ) : (
              <>
                <NavEnlace
                  irA="/favoritos"
                  textoAMostrar="Favoritos"
                  icono="ImHeart"
                />
                {user.isAdmin ? (
                  <NavEnlace
                    irA="/dashboard"
                    textoAMostrar="Dashboard"
                    icono="GrConfigure"
                  />
                ) : (
                  <NavEnlace
                    irA="/mis-reservas"
                    textoAMostrar="Mis Reservas"
                    icono="FaPlaneDeparture"
                  />
                )}
                <ThemeToggle />
                <NavPerfil />
              </>
            )}
          </ul>
        </nav>

        {/* BOTÓN HAMBURGUESA */}
        <button
          className="lg:hidden text-2xl p-2 z-110"
          onClick={() => setMenuAbierto(true)}
        >
          <FaBars />
        </button>

        {/* OVERLAY MÓVIL */}
        {menuAbierto && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-120 lg:hidden"
            onClick={() => setMenuAbierto(false)}
          />
        )}

        {/* SIDEBAR MÓVIL */}
        <div
          className={`fixed top-0 right-0 h-full w-70 bg-primario z-130 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${menuAbierto ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="font-black text-xl tracking-tighter uppercase">
                Menú
              </span>
              <button
                className="text-2xl p-2"
                onClick={() => setMenuAbierto(false)}
              >
                <FaTimes />
              </button>
            </div>

            <nav className="flex flex-col items-center w-full">
              <div
                className="w-full flex flex-col items-center pb-8 border-b border-white/10"
                onClick={() => setMenuAbierto(false)}
              >
                {user ? (
                  <NavPerfil />
                ) : (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <NavButton
                      irA="/login"
                      textoAMostrar="Iniciar Sesión"
                      color="secundario"
                    />
                    <NavButton
                      irA="/registro"
                      textoAMostrar="Crear cuenta"
                      color="primario"
                    />
                  </div>
                )}
              </div>

              <div
                className="flex flex-col items-center gap-8 w-full mt-10"
                onClick={() => setMenuAbierto(false)}
              >
                <NavEnlace irA="/" textoAMostrar="Inicio" />
                {!user ? (
                  <>
                    <NavEnlace irA="/" textoAMostrar="Inicio" />
                    <NavEnlace irA="/about" textoAMostrar="Nosotros" />
                    <NavEnlace irA="/contact" textoAMostrar="Contacto" />
                    <NavButton
                      irA="/registro"
                      textoAMostrar="Crear cuenta"
                      color="primario"
                    />
                    <NavButton
                      irA="/login"
                      textoAMostrar="Iniciar Sesión"
                      color="secundario"
                    />
                    <ThemeToggle />
                  </>
                ) : (
                  <>
                    <NavEnlace
                      irA="/favoritos"
                      textoAMostrar="Favoritos"
                      icono="ImHeart"
                    />
                    {user.isAdmin ? (
                      <NavEnlace
                        irA="/dashboard"
                        textoAMostrar="Dashboard"
                        icono="GrConfigure"
                      />
                    ) : (
                      <NavEnlace
                        irA="/mis-reservas"
                        textoAMostrar="Mis Reservas"
                        icono="FaPlaneDeparture"
                      />
                    )}
                  </>
                )}
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
