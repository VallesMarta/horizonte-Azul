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
      {/* Contenedor del Banner:
         - Usamos aspect-[5/1] para mantener la proporción de 1920x384px.
         - En móviles muy pequeños, esto hará que el banner sea bajito pero completo.
      */}
      <div className="relative w-full aspect-[5/1] mb-10 overflow-hidden shadow-sm">
        <Banner images={images} />
      </div>      
      <GridDestinos />
    </div>
  );
}
