export default function DestinoSkeleton() {
  return (
    <div className="w-full bg-fondo rounded-[2.5rem] p-4 border border-gris-borde-suave shadow-sm flex flex-col h-full animate-pulse">
      {/* Hueco para la imagen con el color de cajas secundarias */}
      <div className="relative h-48 w-full bg-gris-clarito rounded-4xl mb-4"></div>
      
      <div className="flex flex-col grow space-y-4 px-1">
        {/* Simulación del box de Origen-Destino */}
        <div className="h-14 bg-gris-clarito/50 rounded-2xl w-full border border-gris-borde-suave/30"></div>
        
        {/* Título del País */}
        <div className="h-8 bg-gris-clarito rounded-xl w-3/4"></div>
        
        {/* Info de salida */}
        <div className="h-4 bg-gris-clarito/60 rounded-lg w-1/2"></div>
        
        {/* Botón de reserva (usando la forma de tus botones) */}
        <div className="h-12 bg-gris-clarito rounded-2xl w-full mt-auto"></div>
      </div>
    </div>
  );
}