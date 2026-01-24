import Banner from "@/components/Banner";
import GridDestinos from "@/components/cards/GridDestinos";

export default function Inicio() {
  const images = [
    "/media/img/banner1.png",
    "/media/img/banner2.png",
    "/media/img/banner3.png",
  ];
  return (
    <div className="flex flex-col items-center pt-6">
      {/* Banner */}
      <div className="relative w-full h-72 md:h-96 mb-6 overflow-hidden">
        <Banner images={images} />
      </div>
      <h1 className="text-secundario mb-6 text-center text-4xl font-bold">
        Decide tu próximo destino...
      </h1>
      <GridDestinos urlAPI="" />
    </div>
  );
}
