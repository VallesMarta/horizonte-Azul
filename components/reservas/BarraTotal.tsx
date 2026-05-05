interface Props {
  paso: number;
  nPax: number;
  precioTotal: number;
  precioVuelosTotal: number;
  precioServiciosExtras: number;
}

export function BarraTotal({
  paso,
  nPax,
  precioTotal,
  precioVuelosTotal,
  precioServiciosExtras,
}: Props) {
  if (paso < 2 || paso > 3) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-borde bg-fondo/95 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-[9px] font-black text-gris uppercase tracking-widest">
            Total · {nPax} {nPax === 1 ? "pasajero" : "pasajeros"}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-titulo-resaltado leading-none">
              {precioTotal.toFixed(2)}
            </span>
            <span className="text-sm font-black text-gris">€</span>
          </div>
        </div>
        <div className="text-right text-[10px] font-bold text-gris space-y-0.5">
          <p>Vuelos: {precioVuelosTotal.toFixed(2)}€</p>
          {precioServiciosExtras > 0 && (
            <p className="text-naranja">
              Extras: +{precioServiciosExtras.toFixed(2)}€
            </p>
          )}
          <span className="text-[9px] font-bold text-primario bg-primario/10 px-2 py-0.5 rounded-full">
            Paso {paso} de 3
          </span>
        </div>
      </div>
    </div>
  );
}
