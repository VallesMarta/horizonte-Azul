"use client";

import { useState } from "react";

interface CardDescripcionProps {
  descripcion: string;
}

export default function CardDescripcion({ descripcion }: CardDescripcionProps) {
  const [mostrarMas, setMostrarMas] = useState(false);

  // Umbral de caracteres para decidir si mostrar el botón 
  const esLarga = descripcion.length > 150;

  return (
    <div className="flex flex-col">
      <p
        className={`text-sm text-texto text-justify leading-relaxed transition-all duration-500 ease-in-out ${
          !mostrarMas ? "line-clamp-3" : "line-clamp-none"
        }`}
      >
        {descripcion}
      </p>
      
      {esLarga && (
        <button
          onClick={() => setMostrarMas(!mostrarMas)}
          className="mt-2 text-primario font-bold text-xs w-fit hover:underline transition-all active:scale-95"
        >
          {mostrarMas ? "Ver menos ▲" : "Ver más ▼"}
        </button>
      )}
    </div>
  );
}
