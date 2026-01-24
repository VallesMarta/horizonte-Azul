"use client";

import { useState } from "react";

interface CardDescripcionProps {
  descripcion: string;
}

export default function CardDescripcion({ descripcion }: CardDescripcionProps) {
  const [mostrarMas, setMostrarMas] = useState(false);

  return (
    <>
      <p
        className={`text-sm text-texto text-justify mb-3 leading-relaxed ${
          !mostrarMas ? "line-clamp-3" : ""
        }`}
      >
        {descripcion}
      </p>
      <span
        className="text-texto font-semibold text-xs cursor-pointer"
        onClick={() => setMostrarMas(!mostrarMas)}
      >
        {mostrarMas ? "Mostrar menos" : "Mostrar más"}
      </span>
    </>
  );
}
