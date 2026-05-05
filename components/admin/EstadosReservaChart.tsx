import { AdminStats } from "@/models/types";

interface Props {
  estados: AdminStats["estados"];
}

const colorEstado: Record<string, string> = {
  confirmada: "#3ba054",
  pendiente: "#ed6b53",
  realizada: "#5271ff",
  cancelada: "#d13264",
};

const labelEstado: Record<string, string> = {
  confirmada: "Confirmadas",
  pendiente: "Pendientes",
  realizada: "Realizadas",
  cancelada: "Canceladas",
};

export default function EstadosReservaChart({ estados }: Props) {
  const total = estados.reduce((acc, e) => acc + Number(e.total), 0);

  return (
    <div className="bg-card border border-card-borde rounded-2xl shadow-sm p-5">
      <h2 className="font-black text-base text-texto uppercase tracking-tight mb-4">
        📊 Reservas por estado
      </h2>
      <div className="space-y-3">
        {estados.map((e) => {
          const pct = total > 0 ? (Number(e.total) / total) * 100 : 0;
          const color = colorEstado[e.estado] ?? "#9ca3af";
          return (
            <div key={e.estado}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-texto capitalize">
                  {labelEstado[e.estado] ?? e.estado}
                </span>
                <span className="text-sm font-black" style={{ color }}>
                  {e.total} ({pct.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-bg-suave overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
        {estados.length === 0 && (
          <p className="text-center text-gris-claro py-4 text-sm">
            Sin reservas
          </p>
        )}
      </div>
    </div>
  );
}
