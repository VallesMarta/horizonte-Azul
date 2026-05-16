import { AdminStats } from "@/models/types";

interface Props {
  reservas: AdminStats["ultimas_reservas"];
}

const badge: Record<string, string> = {
  confirmada: "bg-verde/10 text-verde",
  pendiente: "bg-naranja/10 text-naranja",
  realizada: "bg-primario/10 text-primario",
  cancelada: "bg-rojo/10 text-rojo",
};

const label: Record<string, string> = {
  confirmada: "Confirmada",
  pendiente: "Pendiente",
  realizada: "Realizada",
  cancelada: "Cancelada",
};

function formatFecha(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UltimasReservas({ reservas }: Props) {
  return (
    <div className="bg-card border border-card-borde rounded-2xl shadow-sm overflow-hidden w-full min-w-0">
      <div className="px-5 py-4 border-b border-card-borde flex items-center justify-between">
        <h2 className="font-black text-sm text-texto uppercase tracking-tight">
          🕐 Últimas reservas
        </h2>
        <span className="text-[10px] text-gris font-bold uppercase tracking-widest">
          Orden: más reciente primero
        </span>
      </div>

      <div className="overflow-x-auto">
        <table
          className="w-full text-sm"
          style={{ tableLayout: "fixed", minWidth: "520px" }}
        >
          <colgroup>
            <col style={{ width: "110px" }} />
            <col style={{ width: "140px" }} />
            <col />
            <col style={{ width: "120px" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "100px" }} />
          </colgroup>
          <thead>
            <tr className="bg-bg-suave text-gris text-[10px] uppercase tracking-widest">
              <th className="text-left px-5 py-3 font-bold">Localiz.</th>
              <th className="text-left px-5 py-3 font-bold hidden sm:table-cell">
                Fecha
              </th>
              <th className="text-left px-5 py-3 font-bold">
                Cliente · Destino
              </th>
              <th className="text-right px-5 py-3 font-bold hidden md:table-cell">
                Total
              </th>
              <th className="text-center px-5 py-3 font-bold hidden md:table-cell">
                Pax
              </th>
              <th className="text-center px-5 py-3 font-bold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-borde">
            {reservas.map((r, i) => (
              <tr
                key={r.id}
                className={`transition-colors hover:bg-bg-suave ${i === 0 ? "bg-primario/5" : ""}`}
              >
                <td className="px-5 py-3">
                  <span className="font-mono font-bold text-xs text-primario">
                    {r.localizador}
                  </span>
                  {i === 0 && (
                    <span className="ml-1.5 text-[9px] font-black bg-primario text-blanco-fijo px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                      Nueva
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-xs text-gris hidden sm:table-cell">
                  {formatFecha(r.fecCompra ?? r.created_at)}
                </td>
                <td className="px-5 py-3">
                  <p className="font-bold text-texto text-xs truncate">
                    {r.usuario_nombre}
                  </p>
                  <p className="text-[11px] text-gris">
                    {r.iataDestino} · {r.paisDestino}
                  </p>
                </td>
                <td className="px-5 py-3 text-right font-black text-xs text-texto hidden md:table-cell whitespace-nowrap">
                  {Number(r.precioTotal).toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </td>
                <td className="px-5 py-3 text-center text-gris text-xs hidden md:table-cell">
                  {r.pasajeros}
                </td>
                <td className="px-5 py-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${badge[r.estado] ?? "bg-gris/10 text-gris"}`}
                  >
                    {label[r.estado] ?? r.estado}
                  </span>
                </td>
              </tr>
            ))}
            {reservas.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gris py-10 text-sm">
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
