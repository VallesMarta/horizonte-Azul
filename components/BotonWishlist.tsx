"use client";

import { useState, useEffect } from "react";
import { ImHeart } from "react-icons/im";
import { SlHeart } from "react-icons/sl";
import useAuth from "@/hooks/useAuth";

interface BotonWishlistProps {
  viajeId: number;
}

export default function BotonWishlist({ viajeId }: BotonWishlistProps) {
  const { usuarioLoggeado } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar si está en la wishlist al cargar
  useEffect(() => {
    const verificarEstado = async () => {
      if (!usuarioLoggeado?.id) return;
      try {
        const res = await fetch(`/api/wishlist/${usuarioLoggeado.id}`);
        const data = await res.json();
        if (data.ok && Array.isArray(data.resultado)) {
          setIsLiked(data.resultado.some((v: any) => v.id === viajeId));
        }
      } catch (error) {
        console.error("Error wishlist:", error);
      }
    };
    verificarEstado();
  }, [usuarioLoggeado, viajeId]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!usuarioLoggeado) return alert("Inicia sesión para guardar favoritos");

    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioLoggeado.id,
          viaje_id: viajeId,
        }),
      });

      const data = await res.json();
      if (data.ok) setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggle wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`transition-all duration-300 transform active:scale-150 ${
        loading ? "opacity-50" : "hover:scale-110"
      }`}
    >
      {isLiked ? (
        <ImHeart className="text-rojo" size={22} />
      ) : (
        <SlHeart className="text-rojo" size={22} />
      )}
    </button>
  );
}