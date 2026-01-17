"use client";

import Link from "next/link";
import NavEnlace from "@/components/layout/NavBar/NavEnlace";
import NavButton from "@/components/layout/NavBar/NavButton";
import NavPerfil from "@/components/layout/NavBar/NavPerfil";
import useAuth from "@/hooks/useAuth";

export default function Header() {
  const { usuarioLoggeado, logout } = useAuth();

  const guestHeader = () => {
    if (!usuarioLoggeado) {
      return (
        <ul className="flex flex-row flex-wrap gap-5 items-center">
          <NavEnlace irA="/" textoAMostrar="Inicio" />
          <NavEnlace irA="about" textoAMostrar="Sobre nosotros" />
          <NavEnlace irA="contact" textoAMostrar="Contáctanos" />
          <NavButton
            irA="registro"
            textoAMostrar="Crear cuenta"
            color="primario"
          />
          <NavButton
            irA="login"
            textoAMostrar="Iniciar Sesión"
            color="secundario"
          />
        </ul>
      );
    }
    return null;
  };

  const userHeader = () => {
    if (usuarioLoggeado && usuarioLoggeado !== "admin") {
      return (
        <ul className="flex flex-row flex-wrap gap-5 items-center">
          <NavEnlace
            irA="mis-reservas"
            textoAMostrar="Mis Reservas"
            icono="FaPlaneDeparture"
          />
          <NavPerfil username={usuarioLoggeado} />
        </ul>
      );
    }
    return null;
  };

  const adminHeader = () => {
    if (usuarioLoggeado === "admin") {
      return (
        <ul className="flex flex-row flex-wrap gap-5 items-center">
          <NavEnlace
            irA="gestionar-viajes"
            textoAMostrar="Gestionar viajes"
            icono="GrConfigure"
          />
          <NavPerfil username={usuarioLoggeado} />
        </ul>
      );
    }
    return null;
  };

  return (
    <header className="p-4 bg-primario text-white flex items-center justify-between">
      <Link href="/">
        <img
          src="/media/img/logo_empresa_header.png"
          alt="Logo de Horizonte Azul"
          className="h-20 cursor-pointer"
        />
      </Link>
      <nav className="flex flex-row justify-center items-center">
        {guestHeader()}
        {userHeader()}
        {adminHeader()}
      </nav>
    </header>
  );
}
