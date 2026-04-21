"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaPlane } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import BotonWishlist from "@/components/BotonWishlist";
import { ViajeGrid } from "@/models/types";
interface Props {
  viaje: ViajeGrid;
}

export default function Destino({ viaje }: Props) {
  const img = viaje.img || "/media/img/img-inicio-destino-por-defecto.png";
  const ruta = `/viajes/${viaje.id}`;
  const precio = viaje.precio_oferta;

  return (
    <div className="group w-full flex flex-col bg-bg border border-borde rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primario/30 transition-all duration-500">
      {/* IMAGEN */}
      <Link
        href={ruta}
        className="relative h-48 w-full overflow-hidden bg-gris-clarito/30 shrink-0"
      >
        <Image
          src={img}
          alt={`Vuelo a ${viaje.paisDestino}`}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradiente inferior */}
        <div className="absolute inset-0 bg-linear-to-t from-negro-fijo/60 via-transparent to-transparent" />

        {/* Badge precio */}
        {precio > 0 && (
          <div className="absolute top-3 left-3 bg-primario text-blanco-fijo px-3 py-1.5 rounded-xl font-black text-xs shadow-md">
            Desde {Math.floor(precio)}€
          </div>
        )}

        {/* Badge IATA */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          {viaje.iataOrigen && (
            <span className="bg-negro-fijo/50 text-blanco-fijo text-[10px] font-black px-2 py-1 rounded-lg tracking-widest backdrop-blur-sm">
              {viaje.iataOrigen}
            </span>
          )}
          <FaPlane size={10} className="text-blanco-fijo/60" />
          {viaje.iataDestino && (
            <span className="bg-primario/80 text-blanco-fijo text-[10px] font-black px-2 py-1 rounded-lg tracking-widest backdrop-blur-sm">
              {viaje.iataDestino}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <div className="absolute top-3 right-3">
          <BotonWishlist viajeId={Number(viaje.id)} />
        </div>
      </Link>

      {/* CONTENIDO */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* DESTINO */}
        <div>
          <p className="inline-flex items-center gap-1 text-[9px] font-black text-gris uppercase tracking-widest mb-0.5 whitespace-nowrap">
            {viaje.paisOrigen} <FaArrowRightLong /> {viaje.paisDestino}
          </p>
          <h3 className="text-2xl font-black text-titulo-resaltado uppercase tracking-tighter leading-none group-hover:text-primario transition-colors">
            {viaje.aeropuertoDestino}
          </h3>
        </div>

        {/* DESCRIPCIÓN corta */}
        {viaje.descripcion && (
          <p className="text-xs text-gris leading-relaxed line-clamp-2 flex-1">
            {viaje.descripcion}
          </p>
        )}

        {/* CTA */}
        <Link
          href={ruta}
          className="w-full py-3 text-center rounded-2xl bg-secundario text-blanco-fijo font-black text-[10px] uppercase tracking-widest hover:bg-primario active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-secundario/20 mt-auto"
        >
          Ver vuelos <FaArrowRight size={10} />
        </Link>
      </div>
    </div>
  );
}
