"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import useAuth from "@/hooks/useAuth";

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

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) return;

    try {
      const res = await fetch(`/api/wishlist/${usuarioLoggeado.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      const data = await res.json();
      if (data.ok) {
        setWishlistIds(
          new Set<number>(data.resultado.map((v: any) => Number(v.viaje_id))),
        );
      }
    } catch (error) {
      console.error("Error cargando wishlist", error);
    }
  }, [usuarioLoggeado?.id]);

  useEffect(() => {
    cargarWishlist();
  }, [cargarWishlist]);

  const toggleWishlist = async (viajeId: number) => {
    if (!usuarioLoggeado) {
      alert("Inicia sesión para guardar favoritos");
      return;
    }

    const token = localStorage.getItem("token");
    const yaEstaLiked = wishlistIds.has(viajeId);

    // Optimistic update
    setWishlistIds((prev) => {
      const next = new Set(prev);
      yaEstaLiked ? next.delete(viajeId) : next.add(viajeId);
      return next;
    });

    try {
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
        setWishlistIds((prev) => {
          const next = new Set(prev);
          yaEstaLiked ? next.add(viajeId) : next.delete(viajeId);
          return next;
        });
      }
    } catch {
      // Revertir
      setWishlistIds((prev) => {
        const next = new Set(prev);
        yaEstaLiked ? next.add(viajeId) : next.delete(viajeId);
        return next;
      });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isLiked: (id) => wishlistIds.has(id),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
