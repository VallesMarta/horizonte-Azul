"use client";

import { useEffect, useState } from "react";
import {
  FaWikipediaW,
  FaExternalLinkAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export const WikiCard = ({ destino }: { destino: string }) => {
  const [extract, setExtract] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto || extract) return;
    setLoading(true);
    fetch(
      `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destino)}`,
    )
      .then((r) => r.json())
      .then((data) =>
        setExtract(
          data.extract ||
            "Descubre la historia y cultura de este increíble destino.",
        ),
      )
      .catch(() =>
        setExtract("Información cultural no disponible en este momento."),
      )
      .finally(() => setLoading(false));
  }, [abierto, destino, extract]);

  return (
    <div className="border border-borde-suave bg-card rounded-2xl overflow-hidden transition-all duration-300">
      {/* Cabecera toggle */}
      <button
        onClick={() => setAbierto((a) => !a)}
        className="
          w-full flex items-center justify-between
          px-4 py-3.5 sm:px-5 sm:py-4
          bg-card hover:bg-bg-suave
          transition-colors duration-200
        "
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="shrink-0 bg-primario/10 p-2 rounded-xl">
            <FaWikipediaW size={12} className="text-primario" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[10px] font-black text-titulo-resaltado uppercase tracking-widest leading-none truncate">
              Saber más sobre {destino}
            </p>
            <p className="text-[9px] font-bold text-gris mt-0.5 uppercase tracking-widest">
              Cultura & Historia
            </p>
          </div>
        </div>
        {abierto ? (
          <FaChevronUp size={11} className="text-gris shrink-0 ml-3" />
        ) : (
          <FaChevronDown size={11} className="text-gris shrink-0 ml-3" />
        )}
      </button>

      {/* Contenido colapsable */}
      {abierto && (
        <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 border-t border-borde-suave bg-bg-suave space-y-3 sm:space-y-4">
          {loading ? (
            <div className="space-y-2 animate-pulse pt-2">
              <div className="h-3 bg-borde rounded w-full" />
              <div className="h-3 bg-borde rounded w-5/6" />
              <div className="h-3 bg-borde rounded w-4/6" />
            </div>
          ) : (
            <p className="text-xs sm:text-sm font-medium text-texto/70 leading-relaxed italic">
              "{extract}"
            </p>
          )}
          <a
            href={`https://es.wikipedia.org/wiki/${encodeURIComponent(destino)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              text-primario hover:text-secundario
              font-black text-[10px] uppercase tracking-widest
              transition-colors duration-200
            "
          >
            Leer artículo completo <FaExternalLinkAlt size={9} />
          </a>
        </div>
      )}
    </div>
  );
};
