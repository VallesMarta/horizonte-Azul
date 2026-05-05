"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function CardDescripcion({
  descripcion,
}: {
  descripcion: string;
}) {
  const [expandida, setExpandida] = useState(false);
  const esLarga = descripcion.length > 180;

  return (
    <div className="bg-card border border-card-borde rounded-3xl p-4 sm:p-6 space-y-3 transition-all duration-300">
      <p
        className={`
        text-sm leading-relaxed text-texto
        transition-all duration-300
        ${!expandida && esLarga ? "line-clamp-3" : ""}
      `}
      >
        {descripcion}
      </p>
      {esLarga && (
        <button
          onClick={() => setExpandida((e) => !e)}
          className="
            flex items-center gap-1.5
            text-primario hover:text-secundario
            font-black text-[10px] uppercase tracking-widest
            transition-colors duration-200
          "
        >
          {expandida ? (
            <>
              <FaChevronUp size={9} /> Ver menos
            </>
          ) : (
            <>
              <FaChevronDown size={9} /> Leer más
            </>
          )}
        </button>
      )}
    </div>
  );
}
