import Image from "next/image";
import GridDestinos from "@/components/cards/GridDestinos";

export default function Inicio() {  
  return (
    <div className="flex flex-col items-center pt-6">
      {/* Banner */}
      <div className="relative w-full h-72 md:h-96 mb-6 overflow-hidden">
        <Image
          src="/media/img/banner1.jpg"
          alt="Banner principal"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <h1 className="text-secundario mb-6 text-center text-4xl font-bold">
        Decide tu próximo destino...
      </h1>
      <GridDestinos urlAPI="" />
    </div>
  );
}
