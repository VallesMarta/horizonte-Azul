import { FaPlane, FaCreditCard, FaCheckCircle } from "react-icons/fa";

interface Props {
  vuelosInfo: any[];
  pasajeros: any[];
  serviciosIncluidos: any[];
  serviciosAdicionales: any[];
  precioVuelosTotal: number;
  precioServiciosExtras: number;
  precioTotal: number;
  nPax: number;
  formatFecha: (s: string) => string;
  formatHora: (s: string) => string;
  onVolver: () => void;
  onContinuar: () => void;
}

function SeccionHeader({ titulo }: { titulo: string }) {
  return (
    <div className="bg-primario/5 px-5 py-3 border-b border-borde">
      <p className="text-[10px] font-black text-primario uppercase tracking-widest">
        {titulo}
      </p>
    </div>
  );
}

export function PasoResumen({
  vuelosInfo,
  pasajeros,
  serviciosIncluidos,
  serviciosAdicionales,
  precioVuelosTotal,
  precioServiciosExtras,
  precioTotal,
  nPax,
  formatFecha,
  formatHora,
  onVolver,
  onContinuar,
}: Props) {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-xl font-black text-titulo-resaltado uppercase tracking-tighter">
        Verifica tu reserva
      </h2>

      {/* VUELOS */}
      <div className="bg-bg border border-borde rounded-3xl overflow-hidden shadow-sm">
        <SeccionHeader titulo="Itinerario" />
        <div className="p-5 space-y-4">
          {vuelosInfo.map((v, idx) => (
            <div
              key={idx}
              className={`flex items-start justify-between gap-3 ${idx > 0 ? "pt-4 border-t border-borde" : ""}`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`shrink-0 mt-0.5 p-1.5 rounded-lg ${v.tipo === "ida" ? "bg-primario/10" : "bg-secundario/10"}`}
                >
                  <FaPlane size={10} className="text-primario" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-titulo-resaltado truncate">
                    {v.tipo === "ida" ? (
                      <>
                        {v.aeropuertoOrigen} ({v.iataOrigen}) →{" "}
                        {v.aeropuertoDestino} ({v.iataDestino})
                      </>
                    ) : (
                      <>
                        {v.aeropuertoDestino} ({v.iataDestino}) →{" "}
                        {v.aeropuertoOrigen} ({v.iataOrigen})
                      </>
                    )}
                  </p>
                  <p className="text-[10px] text-gris font-bold mt-0.5">
                    {formatFecha(v.fecSalida || "")} ·{" "}
                    {formatHora(v.horaSalida || "")}h
                    {v.horaLlegada ? ` → ${formatHora(v.horaLlegada)}h` : ""}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span
                  className={`text-[9px] font-black px-2 py-1 rounded-full uppercase block mb-1 ${
                    v.tipo === "ida"
                      ? "bg-primario/10 text-primario"
                      : "bg-secundario/10 text-secundario"
                  }`}
                >
                  {v.tipo === "ida" ? "Ida" : "Vuelta"}
                </span>
                <span className="text-sm font-black text-titulo-resaltado">
                  {(Number(v.precio_ajustado) * nPax).toFixed(2)}€
                </span>
                <p className="text-[9px] text-gris">
                  {Number(v.precio_ajustado).toFixed(2)}€/pax
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PASAJEROS */}
      <div className="bg-bg border border-borde rounded-3xl overflow-hidden shadow-sm">
        <SeccionHeader titulo={`Pasajeros · ${nPax}`} />
        <div className="divide-y divide-borde">
          {pasajeros.map((p, idx) => (
            <div key={idx} className="flex items-center gap-3 px-5 py-3">
              <div className="w-7 h-7 rounded-full bg-primario/10 flex items-center justify-center text-primario text-[10px] font-black shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-titulo-resaltado uppercase truncate">
                  {p.nombre} {p.apellidos}
                </p>
                <p className="text-[10px] text-gris font-bold">
                  {p.tipoDocumento}: {p.numDocumento}
                  {p.fecNacimiento && ` · Nac. ${formatFecha(p.fecNacimiento)}`}
                </p>
              </div>
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                  p.esAdulto
                    ? "bg-primario/10 text-primario"
                    : "bg-naranja/10 text-naranja"
                }`}
              >
                {p.esAdulto ? "Adulto" : "Menor"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICIOS */}
      {(serviciosIncluidos.length > 0 || serviciosAdicionales.length > 0) && (
        <div className="bg-bg border border-borde rounded-3xl overflow-hidden shadow-sm">
          <SeccionHeader titulo="Servicios" />
          <div className="p-5 space-y-4">
            {/* Incluidos */}
            {serviciosIncluidos.length > 0 && (
              <div>
                <p className="text-[9px] font-black text-verde uppercase tracking-widest mb-2">
                  ✓ Incluidos en la tarifa
                </p>
                <div className="space-y-1.5">
                  {serviciosIncluidos.map((s: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-verde/5 border border-verde/15 px-3 py-2 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <FaCheckCircle
                          size={9}
                          className="text-verde shrink-0"
                        />
                        <span className="text-xs font-bold text-texto">
                          {s.nombre}
                        </span>
                        {s.cantidad_incluida > 0 && (
                          <span className="text-[9px] font-black text-verde bg-verde/10 px-1.5 rounded-full">
                            ×{s.cantidad_incluida}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-black text-verde uppercase">
                        Gratis
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extras */}
            {serviciosAdicionales.length > 0 && (
              <div
                className={
                  serviciosIncluidos.length > 0
                    ? "pt-4 border-t border-dashed border-borde"
                    : ""
                }
              >
                <p className="text-[9px] font-black text-naranja uppercase tracking-widest mb-2">
                  Extras seleccionados
                </p>
                <div className="space-y-1.5">
                  {serviciosAdicionales.map((e: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-naranja/5 border border-naranja/15 px-3 py-2 rounded-xl"
                    >
                      <div>
                        <span className="text-xs font-black text-titulo-resaltado">
                          {e.nombre}{" "}
                          <span className="text-naranja font-bold">
                            ×{e.cantidad}
                          </span>
                        </span>
                        {e.tipo_vuelo && e.tipo_vuelo !== "ambos" && (
                          <p className="text-[9px] text-gris mt-0.5">
                            {e.tipo_vuelo === "ida"
                              ? "Solo ida"
                              : "Solo vuelta"}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-black text-titulo-resaltado shrink-0">
                        {e.subtotal.toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRECIO TOTAL */}
      <div className="bg-secundario rounded-3xl p-6 shadow-xl shadow-secundario/20 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-blanco-fijo/5 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blanco-fijo/3 rounded-full" />
        <p className="text-[9px] font-black text-blanco-fijo/50 uppercase tracking-[0.25em] mb-4 text-center">
          Resumen de transacción
        </p>
        <div className="space-y-2 border-b border-blanco-fijo/10 pb-4 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-blanco-fijo/70 font-bold">
              Vuelos ({nPax} {nPax === 1 ? "pasajero" : "pasajeros"})
            </span>
            <span className="text-blanco-fijo font-black">
              {precioVuelosTotal.toFixed(2)}€
            </span>
          </div>
          {precioServiciosExtras > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-blanco-fijo/70 font-bold">Extras</span>
              <span className="text-blanco-fijo font-black">
                +{precioServiciosExtras.toFixed(2)}€
              </span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-blanco-fijo/40">IVA y tasas</span>
            <span className="text-blanco-fijo/40 italic">Incluidos</span>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[9px] font-black text-blanco-fijo/50 uppercase block tracking-wider">
              Total a pagar
            </span>
            <span className="text-4xl font-black text-blanco-fijo tracking-tighter">
              {precioTotal.toFixed(2)}€
            </span>
          </div>
          <FaCreditCard className="text-blanco-fijo/20 mb-1" size={32} />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onVolver}
          className="flex-1 py-4 rounded-2xl font-black text-xs uppercase border-2 border-borde text-gris hover:border-primario hover:text-primario transition-all"
        >
          Modificar
        </button>
        <button
          onClick={onContinuar}
          className="flex-1 bg-secundario text-blanco-fijo py-4 rounded-2xl font-black text-sm uppercase hover:bg-primario transition-all shadow-lg shadow-secundario/20 flex items-center justify-center gap-2"
        >
          Confirmar y pagar →
        </button>
      </div>
    </div>
  );
}
