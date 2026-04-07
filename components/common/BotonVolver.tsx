"use client";
import { HiArrowLongLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";

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
      className="flex items-center gap-3 mb-8 group outline-none bg-transparent border-none cursor-pointer"
    >
      <HiArrowLongLeft
        size={22}
        className="text-primario transition-opacity duration-300 group-hover:opacity-70"
      />

      <span
        className="font-black uppercase text-[10px] tracking-[0.4em] italic mt-0.5
                       text-primario transition-opacity duration-300 group-hover:opacity-70"
      >
        {texto}
      </span>
    </button>
  );
};
