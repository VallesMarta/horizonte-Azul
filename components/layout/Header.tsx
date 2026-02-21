"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavEnlace from "@/components/layout/NavBar/NavEnlace";
import NavButton from "@/components/layout/NavBar/NavButton";
import NavPerfil from "@/components/layout/NavBar/NavPerfil";
import useAuth from "@/hooks/useAuth";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const { usuarioLoggeado, isAdmin } = useAuth();
  const [estaMontado, setEstaMontado] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    setEstaMontado(true);
  }, []);

  useEffect(() => {
    if (menuAbierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuAbierto]);

  if (!estaMontado) {
    return (
      <header className="p-4 bg-primario text-white shadow-md">
        <div className="max-w-[98%] mx-auto w-full flex justify-between items-center px-2">
          <img
            src="/media/img/logo_empresa_header.png"
            alt="Logo"
            className="h-12 md:h-16"
          />
          <div className="h-8 w-8 bg-white/10 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-[100] bg-primario text-white shadow-lg">
      <div className="max-w-[98%] mx-auto px-2 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="shrink-0">
          <img
            src="/media/img/logo_empresa_header.png"
            alt="Logo de Horizonte Azul"
            className="h-12 md:h-20 transition-transform hover:scale-105"
          />
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {!usuarioLoggeado ? (
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
              </>
            ) : (
              <>
                <NavEnlace
                  irA="/favoritos"
                  textoAMostrar="Favoritos"
                  icono="ImHeart"
                />
                {isAdmin ? (
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
                <NavPerfil username={usuarioLoggeado?.username} />
              </>
            )}
          </ul>
        </nav>

        {/* BOTÓN HAMBURGUESA (Móvil) */}
        <button
          className="lg:hidden text-2xl p-2 z-[110]"
          onClick={() => setMenuAbierto(true)}
        >
          <FaBars />
        </button>

        {/* OVERLAY */}
        {menuAbierto && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] lg:hidden transition-opacity"
            onClick={() => setMenuAbierto(false)}
          />
        )}

        {/* SIDEBAR */}
        <div
          className={`fixed top-0 right-0 h-full w-[280px] bg-primario z-[130] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
            menuAbierto ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full p-6">
            {/* Header del Sidebar */}
            <div className="flex items-center justify-between mb-8">
              <span className="font-black text-xl tracking-tighter uppercase text-white">
                Menú
              </span>
              <button
                className="text-2xl p-2 text-white"
                onClick={() => setMenuAbierto(false)}
              >
                <FaTimes />
              </button>
            </div>

            <nav className="flex flex-col items-center w-full">
              {/* --- BLOQUE SUPERIOR: PERFIL O ACCESO (CENTRADO) --- */}
              <div className="w-full flex flex-col items-center pb-8 border-b border-white/10">
                {usuarioLoggeado ? (
                  <div className="flex flex-col items-center gap-2">
                    <NavPerfil username={usuarioLoggeado?.username} />
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center gap-4 w-full px-4"
                    onClick={() => setMenuAbierto(false)}
                  >
                    {/* Botones de acceso centrados */}
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

              {/* --- BLOQUE INFERIOR: ENLACES FILTRADOS (CENTRADO) --- */}
              <div
                className="flex flex-col items-center gap-8 w-full mt-10"
                onClick={() => setMenuAbierto(false)}
              >
                {!usuarioLoggeado ? (
                  <div className="flex flex-col items-center gap-8">
                    <NavEnlace irA="/" textoAMostrar="Inicio" />
                    <NavEnlace irA="/about" textoAMostrar="Nosotros" />
                    <NavEnlace irA="/contact" textoAMostrar="Contacto" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-8">
                    {isAdmin ? (
                      <NavEnlace
                        irA="/dashboard"
                        textoAMostrar="Dashboard"
                        icono="GrConfigure"
                      />
                    ) : (
                      <>
                        <NavEnlace
                          irA="/mis-reservas"
                          textoAMostrar="Mis Reservas"
                          icono="FaPlaneDeparture"
                        />
                        <NavEnlace
                          irA="/favoritos"
                          textoAMostrar="Favoritos"
                          icono="ImHeart"
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
