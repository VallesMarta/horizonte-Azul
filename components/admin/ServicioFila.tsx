import { FaTrash, FaHashtag, FaFont } from "react-icons/fa";

interface ServicioFilaData {
  servicio_id: string;
  valor: string;
  precio_extra: string;
  incluido: string;
  cantidad_incluida: string;
}

interface Props {
  item: ServicioFilaData;
  index: number;
  serviciosDisponibles: any[];
  onActualizar: (i: number, k: keyof ServicioFilaData, v: string) => void;
  onEliminar: (i: number) => void;
}

export default function ServicioFila({
  item,
  index,
  serviciosDisponibles,
  onActualizar,
  onEliminar,
}: Props) {
  const infoS = serviciosDisponibles.find(
    (s) => s.id === parseInt(item.servicio_id),
  );
  const esIncluido = item.incluido === "true";
  const esNumero = infoS?.tipo_control === "numero";

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_auto_auto] items-center gap-3 p-4 rounded-2xl border animate-in slide-in-from-top-2 duration-300 transition-colors ${
        esIncluido
          ? "bg-verde/5 border-verde/20"
          : "bg-gris-clarito/10 border-borde"
      }`}
    >
      {/* SELECTOR SERVICIO */}
      <select
        value={item.servicio_id}
        onChange={(e) => onActualizar(index, "servicio_id", e.target.value)}
        className="w-full bg-bg border border-borde rounded-xl px-4 py-3 text-xs font-black uppercase text-texto outline-none focus:border-primario transition-all"
      >
        <option value="">Selecciona un servicio</option>
        {serviciosDisponibles.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nombre}
          </option>
        ))}
      </select>

      {/* TOGGLE INCLUIDO */}
      <button
        type="button"
        onClick={() =>
          onActualizar(index, "incluido", esIncluido ? "false" : "true")
        }
        className={`h-10 px-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
          esIncluido
            ? "bg-verde/10 border-verde text-verde"
            : "bg-bg border-borde text-gris hover:border-gris"
        }`}
      >
        {esIncluido ? "✓ Incluido" : "Extra"}
      </button>

      {/* VALOR — adaptado al tipo de control */}
      <div className="w-36">
        {infoS?.tipo_control === "booleano" ? (
          <div className="flex h-10 bg-bg rounded-xl border border-borde p-1 gap-1">
            {["true", "false"].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onActualizar(index, "valor", val)}
                className={`flex-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                  item.valor === val
                    ? val === "true"
                      ? "bg-verde text-blanco-fijo"
                      : "bg-rojo text-blanco-fijo"
                    : "text-gris hover:text-texto"
                }`}
              >
                {val === "true" ? "✓ Sí" : "✗ No"}
              </button>
            ))}
          </div>
        ) : infoS?.tipo_control === "numero" ? (
          <div className="relative h-10">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gris">
              <FaHashtag size={9} />
            </div>
            <input
              type="number"
              min="0"
              placeholder="Cantidad"
              value={item.valor}
              onChange={(e) => onActualizar(index, "valor", e.target.value)}
              className="w-full h-10 bg-bg border border-borde rounded-xl pl-8 pr-3 text-xs font-bold text-texto outline-none focus:border-primario transition-colors"
            />
          </div>
        ) : infoS?.tipo_control === "texto" ? (
          <div className="relative h-10">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gris">
              <FaFont size={9} />
            </div>
            <input
              type="text"
              placeholder="Descripción"
              value={item.valor}
              onChange={(e) => onActualizar(index, "valor", e.target.value)}
              className="w-full h-10 bg-bg border border-borde rounded-xl pl-8 pr-3 text-xs font-bold text-texto outline-none focus:border-primario transition-colors"
            />
          </div>
        ) : (
          <div className="h-10" />
        )}
      </div>

      {/* CANTIDAD INCLUIDA — solo si incluido + numérico */}
      <div className="w-28">
        {esIncluido && esNumero ? (
          <div className="relative h-10">
            <label className="absolute left-3 top-1 text-[8px] font-black text-verde uppercase tracking-wide">
              Uds. gratis
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={item.cantidad_incluida}
              onChange={(e) =>
                onActualizar(index, "cantidad_incluida", e.target.value)
              }
              className="w-full h-10 bg-bg border border-verde/30 rounded-xl px-3 pt-4 pb-1 text-sm font-black text-texto outline-none focus:border-verde transition-colors"
            />
          </div>
        ) : (
          <div className="h-10" />
        )}
      </div>

      {/* PRECIO EXTRA o BADGE GRATIS */}
      <div className="w-28">
        {!esIncluido ? (
          <div className="relative h-10">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-naranja">
              €
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={item.precio_extra}
              onChange={(e) =>
                onActualizar(index, "precio_extra", e.target.value)
              }
              className="w-full h-10 bg-bg border border-borde rounded-xl pl-7 pr-3 text-xs font-black text-texto outline-none focus:border-naranja transition-colors"
            />
          </div>
        ) : esNumero ? (
          <div className="h-10" />
        ) : (
          <div className="h-10 flex items-center justify-center">
            <span className="text-[10px] font-black text-verde bg-verde/10 px-3 py-1 rounded-full">
              Gratis
            </span>
          </div>
        )}
      </div>

      {/* ELIMINAR */}
      <button
        type="button"
        onClick={() => onEliminar(index)}
        className="h-10 w-10 flex items-center justify-center text-gris hover:text-rojo hover:bg-rojo/10 rounded-xl transition-all shrink-0"
      >
        <FaTrash size={12} />
      </button>
    </div>
  );
}
