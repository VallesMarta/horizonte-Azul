"use client";

import Link from "next/link";

interface NavButtonProps {
  irA: string;
  textoAMostrar: string;
  color: "primario" | "secundario";
}

export default function NavButton({
  irA,
  textoAMostrar,
  color,
}: NavButtonProps) {
  const colorClass = color === "primario" ? "bg-nav-boton" : "bg-secundario";

  const rutaLimpia = irA.startsWith("/") ? irA : `/${irA}`;

  return (
    <li className="list-none">
      <Link
        href={rutaLimpia}
        className={`${colorClass} inline-block font-bold px-4 py-2 rounded 
                    text-white transition duration-300 transform
                    hover:text-negro-fijo hover:bg-iconos
                    hover:scale-105 active:scale-95`}
      >
        {textoAMostrar}
      </Link>
    </li>
  );
}
