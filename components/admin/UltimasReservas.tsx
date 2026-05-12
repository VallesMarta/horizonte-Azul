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
      <div className="px-4 sm:px-5 py-4 border-b border-card-borde">
        <h2 className="font-black text-base text-texto uppercase tracking-tight">
          🕐 Últimas reservas
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[320px]">
          <thead>
            <tr className="bg-bg-suave text-gris-claro text-xs uppercase tracking-wide">
              <th className="text-left px-3 sm:px-5 py-3 font-semibold">
                Localiz.
              </th>
              {/* Cliente: oculto en xs, visible desde sm */}
              <th className="text-left px-3 sm:px-5 py-3 font-semibold hidden sm:table-cell">
                Cliente
              </th>
              <th className="text-left px-3 sm:px-5 py-3 font-semibold">
                Destino
              </th>
              {/* Pasajeros: oculto en móvil, visible desde md */}
              <th className="text-center px-3 sm:px-5 py-3 font-semibold hidden md:table-cell">
                Pax
              </th>
              <th className="text-right px-3 sm:px-5 py-3 font-semibold">
                Total
              </th>
              <th className="text-center px-3 sm:px-5 py-3 font-semibold">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-borde">
            {reservas.map((r) => (
              <tr key={r.id} className="hover:bg-bg-suave transition-colors">
                <td className="px-3 sm:px-5 py-3 font-mono font-bold text-primario text-xs whitespace-nowrap">
                  {r.localizador}
                </td>
                <td className="px-3 sm:px-5 py-3 font-medium text-texto hidden sm:table-cell">
                  <span className="block truncate max-w-30">
                    {r.usuario_nombre}
                  </span>
                </td>
                <td className="px-3 sm:px-5 py-3 text-texto">
                  <span className="font-semibold">{r.iataDestino}</span>
                  <span className="text-gris-claro ml-1 hidden lg:inline">
                    · {r.paisDestino}
                  </span>
                </td>
                <td className="px-3 sm:px-5 py-3 text-gris-claro text-center hidden md:table-cell">
                  {r.pasajeros}
                </td>
                <td className="px-3 sm:px-5 py-3 text-right font-black text-texto whitespace-nowrap">
                  {Number(r.precioTotal).toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </td>
                <td className="px-3 sm:px-5 py-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
                      badgeEstado[r.estado] ?? "bg-gray-100 text-gray-500"
                    }`}
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
