"use client";

import Link from "next/link";
import { FaPlaneDeparture } from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";
import { ImHeart } from "react-icons/im";

interface NavEnlaceProps {
  irA: string;
  textoAMostrar: string;
  icono?: "FaPlaneDeparture" | "GrConfigure" | "ImHeart";
}

export default function NavEnlace({
  irA,
  textoAMostrar,
  icono,
}: NavEnlaceProps) {
  // Aseguramos que la ruta sea siempre absoluta
  const rutaLimpia = irA.startsWith("/") ? irA : `/${irA}`;

  const renderIcon = () => {
    switch (icono) {
      case "FaPlaneDeparture":
        return <FaPlaneDeparture className="text-xl" />;
      case "GrConfigure":
        return <GrConfigure className="text-xl" />;
      case "ImHeart":
        return <ImHeart className="text-xl" />;
      default:
        return null;
    }
  };

  return (
    <li className="list-none">
      <Link
        href={rutaLimpia}
        className="flex items-center gap-2 cursor-pointer text-fondo hover:text-iconos hover:scale-105 transform transition duration-300 ease-in-out group"
      >
        <span className="transition-colors duration-300">{renderIcon()}</span>
        <span className="font-bold text-lg">{textoAMostrar}</span>
      </Link>
    </li>
  );
}
