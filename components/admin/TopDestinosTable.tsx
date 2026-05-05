import { AdminStats } from "@/models/types";

interface Props {
  destinos: AdminStats["top_destinos"];
}

export default function TopDestinosTable({ destinos }: Props) {
  return (
    <div className="bg-card border border-card-borde rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-card-borde">
        <h2 className="font-black text-base text-texto uppercase tracking-tight">
          🏆 Top destinos reservados
        </h2>
      </div>
      <div className="divide-y divide-card-borde">
        {destinos.map((d, i) => (
          <div key={d.iataDestino} className="flex items-center gap-4 px-5 py-3 hover:bg-bg-suave transition-colors">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 ${
              i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-amber-600" : "bg-gris-claro"
            }`}>
              {i + 1}
            </span>
            {d.img && (
              <img src={d.img} alt={d.paisDestino}
                className="w-10 h-10 rounded-lg object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-texto text-sm truncate">{d.paisDestino}</p>
              <p className="text-xs text-gris-claro">{d.aeropuertoDestino} · {d.iataDestino}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-black text-sm text-primario">{d.total_reservas} reservas</p>
              <p className="text-xs text-verde font-semibold">
                {Number(d.ingresos).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
              </p>
            </div>
          </div>
        ))}
        {destinos.length === 0 && (
          <p className="text-center text-gris-claro py-8 text-sm">Sin datos aún</p>
        )}
      </div>
    </div>
  );
}