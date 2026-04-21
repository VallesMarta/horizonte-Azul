"use client";

import { useEffect, useState, useCallback } from "react";
import useAuth from "@/hooks/useAuth";
import Destino from "@/components/cards/Destino";
import { ViajeGrid, WishlistViaje } from "@/models/types";
import { FaPlane, FaHeart } from "react-icons/fa";
import Cookies from "js-cookie";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

export default function MisFavoritosPage() {
  const { usuarioLoggeado } = useAuth();
  const { wishlistIds } = useWishlist();
  const [favoritos, setFavoritos] = useState<WishlistViaje[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarFavoritos = useCallback(async () => {
    if (!usuarioLoggeado?.id) {
      setLoading(false);
      return;
    }
    try {
      const token = Cookies.get("token");
      const res = await fetch(`/api/wishlist/${usuarioLoggeado.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) setFavoritos(data.resultado || []);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
    } finally {
      setLoading(false);
    }
  }, [usuarioLoggeado?.id]);

  useEffect(() => { cargarFavoritos(); }, [cargarFavoritos]);

  // Filtra en tiempo real según el contexto — si deseleccionas uno desaparece al instante
  const favoritosFiltrados = favoritos.filter(v =>
    wishlistIds.has(Number(v.viaje_id)),
  );

  if (loading) {
    return (
      <div className="p-20 text-center font-bold text-primario animate-pulse uppercase tracking-widest text-xs">
        Sincronizando tus deseos...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-6 mb-6">
      <div className="w-full max-w-7xl px-6">
        {/* HEADER */}
        <div className="mb-10 flex items-center gap-3 border-b border-borde pb-6">
          <div className="bg-rojo/10 p-3 rounded-2xl">
            <FaHeart className="text-rojo" size={18} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-titulo-resaltado uppercase tracking-tighter">
              Mis Favoritos
            </h1>
            <p className="text-[10px] font-bold text-gris uppercase tracking-widest mt-0.5">
              {favoritosFiltrados.length} destino{favoritosFiltrados.length !== 1 ? "s" : ""}
              guardado{favoritosFiltrados.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* GRID */}
        {favoritosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritosFiltrados.map((viaje) => (
              <Destino
                key={viaje.viaje_id}
                viaje={{
                    ...viaje,
                    id: viaje.viaje_id,
                    precio_base: 0,
                    precio_oferta: viaje.precio_oferta,
                    tiene_vuelos: true,
                  } as ViajeGrid}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="bg-gris-clarito/20 border border-borde w-20 h-20 rounded-full flex items-center justify-center">
              <FaPlane className="text-gris opacity-30" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-titulo-resaltado uppercase tracking-tighter">
                Tu lista está vacía
              </h2>
              <p className="text-xs font-bold text-gris uppercase tracking-wide mt-3 max-w-xs mx-auto leading-relaxed">
                Explora nuestros destinos y guarda los que más te gusten pulsando el corazón.
              </p>
            </div>
            <Link
              href="/"
              className="bg-secundario text-blanco-fijo text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-primario transition-all shadow-md"
            >
              Explorar destinos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}