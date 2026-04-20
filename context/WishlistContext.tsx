"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";

interface WishlistContextType {
  wishlistIds: Set<number>;
  toggleWishlist: (viajeId: number) => Promise<void>;
  isLiked: (viajeId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: new Set(),
  toggleWishlist: async () => {},
  isLiked: () => false,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { usuarioLoggeado } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());

  const cargarWishlist = useCallback(async () => {
    if (!usuarioLoggeado?.id) {
      setWishlistIds(new Set());
      return;
    }
    try {
      const token = Cookies.get("token");
      const res = await fetch(`/api/wishlist/${usuarioLoggeado.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        const ids = new Set<number>(
          data.resultado.map((v: any) => Number(v.viaje_id))
        );
        setWishlistIds(ids);
      }
    } catch {}
  }, [usuarioLoggeado?.id]);

  useEffect(() => { cargarWishlist(); }, [cargarWishlist]);

  const toggleWishlist = async (viajeId: number) => {
    if (!usuarioLoggeado) {
      alert("Inicia sesión para guardar favoritos");
      return;
    }

    const yaEstaLiked = wishlistIds.has(viajeId);

    setWishlistIds(prev => {
      const next = new Set(prev);
      if (yaEstaLiked) next.delete(viajeId);
      else next.add(viajeId);
      return next;
    });

    try {
      const token = Cookies.get("token");
      const res = await fetch("/api/wishlist", {
        method: yaEstaLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ viaje_id: viajeId }),
      });

      if (!res.ok) {
        // Revertir si falla
        setWishlistIds(prev => {
          const next = new Set(prev);
          if (yaEstaLiked) next.add(viajeId);
          else next.delete(viajeId);
          return next;
        });
      }
    } catch {
      // Revertir si error de red
      setWishlistIds(prev => {
        const next = new Set(prev);
        if (yaEstaLiked) next.add(viajeId);
        else next.delete(viajeId);
        return next;
      });
    }
  };

  const isLiked = (viajeId: number) => wishlistIds.has(viajeId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isLiked }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);