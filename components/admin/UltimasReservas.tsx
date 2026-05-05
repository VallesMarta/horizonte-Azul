import { AdminStats } from "@/models/types";

interface Props {
  reservas: AdminStats["ultimas_reservas"];
}

const badgeEstado: Record<string, string> = {
  confirmada: "bg-verde/10 text-verde",
  pendiente: "bg-naranja/10 text-naranja",
  realizada: "bg-primario/10 text-primario",
  cancelada: "bg-rojo/10 text-rojo",
};

export default function UltimasReservas({ reservas }: Props) {
  return (
    <div className="bg-card border border-card-borde rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-card-borde">
        <h2 className="font-black text-base text-texto uppercase tracking-tight">
          🕐 Últimas reservas
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-suave text-gris-claro text-xs uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-semibold">Localizador</th>
              <th className="text-left px-5 py-3 font-semibold">Cliente</th>
              <th className="text-left px-5 py-3 font-semibold">Destino</th>
              <th className="text-left px-5 py-3 font-semibold">Pasajeros</th>
              <th className="text-right px-5 py-3 font-semibold">Total</th>
              <th className="text-center px-5 py-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-borde">
            {reservas.map((r) => (
              <tr key={r.id} className="hover:bg-bg-suave transition-colors">
                <td className="px-5 py-3 font-mono font-bold text-primario text-xs">
                  {r.localizador}
                </td>
                <td className="px-5 py-3 font-medium text-texto truncate max-w-30">
                  {r.usuario_nombre}
                </td>
                <td className="px-5 py-3 text-texto">
                  <span className="font-semibold">{r.iataDestino}</span>
                  <span className="text-gris-claro ml-1 hidden sm:inline">
                    · {r.paisDestino}
                  </span>
                </td>
                <td className="px-5 py-3 text-gris-claro text-center">
                  {r.pasajeros}
                </td>
                <td className="px-5 py-3 text-right font-black text-texto">
                  {Number(r.precioTotal).toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </td>
                <td className="px-5 py-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${badgeEstado[r.estado] ?? "bg-gray-100 text-gray-500"}`}
                  >
                    {r.estado}
                  </span>
                </td>
              </tr>
            ))}
            {reservas.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gris-claro py-8">
                  Sin reservas recientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
