"use client";

import { ImHeart } from "react-icons/im";
import { SlHeart } from "react-icons/sl";
import { useWishlist } from "@/context/WishlistContext";

interface Props {
  viajeId: number;
}

export default function BotonWishlist({ viajeId }: Props) {
  const { isLiked, toggleWishlist } = useWishlist();
  const liked = isLiked(viajeId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(viajeId);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={liked ? "Quitar de favoritos" : "Añadir a favoritos"}
      className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ${
        liked
          ? "bg-rojo/10 hover:bg-rojo/20"
          : "bg-negro-fijo/30 hover:bg-negro-fijo/50 backdrop-blur-sm"
      } active:scale-125`}
    >
      {liked ? (
        <ImHeart className="text-rojo" size={16} />
      ) : (
        <SlHeart className="text-blanco-fijo" size={16} />
      )}
    </button>
  );
}
