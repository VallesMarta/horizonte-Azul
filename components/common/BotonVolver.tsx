"use client";

import { useRouter } from "next/navigation";
import { HiArrowLongLeft } from "react-icons/hi2";

export const BotonVolver = ({ href, texto = "VOLVER", onClick }: any) => {
  const router = useRouter();

  const handleAction = () => {
    if (onClick) onClick();
    else if (href) router.push(href);
    else router.back();
  };

  return (
    <button
      onClick={handleAction}
      className="
        group relative
        inline-flex items-center gap-2.5
        px-4 py-2
        hover:rounded-full
        hover:bg-primario/10 hover:border-primario/40
        transition-all duration-300
        outline-none cursor-pointer
        mb-6 sm:mb-8
      "
    >
      {/* Flecha con slide */}
      <HiArrowLongLeft
        size={18}
        className="
          text-primario
          transition-transform duration-300
          group-hover:-translate-x-1
        "
      />

      {/* Texto */}
      <span
        className="
        font-black uppercase text-[10px] tracking-[0.3em]
        text-primario
        transition-opacity duration-300
        group-hover:opacity-80
      "
      >
        {texto}
      </span>
    </button>
  );
};
