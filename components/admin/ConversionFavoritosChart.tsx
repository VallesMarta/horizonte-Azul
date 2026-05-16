import { AdminStats } from "@/models/types";

interface Props {
  destinos: AdminStats["top_destinos"];
  wishlist: AdminStats["top_wishlist"];
}

export default function ConversionFavoritosChart({
  destinos,
  wishlist,
}: Props) {
  const data = destinos.slice(0, 5).map((d) => {
    const w = wishlist.find((w) => w.iataDestino === d.iataDestino);
    const favoritos = Number(w?.total_guardados ?? 0);
    const reservas = Number(d.total_reservas);
    const pct = favoritos > 0 ? Math.round((reservas / favoritos) * 10) : 0;
    return { nombre: `${d.iataDestino} · ${d.paisDestino}`, pct };
  });

  const color = (pct: number) =>
    pct >= 60 ? "#3ba054" : pct >= 40 ? "#5271ff" : "#ed6b53";

  return (
    <div className="bg-card border border-card-borde rounded-2xl shadow-sm p-5">
      <h2 className="font-black text-sm text-texto uppercase tracking-tight mb-4">
        📊 Conversión favoritos → reserva
      </h2>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.nombre}>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-texto font-bold truncate">
                {d.nombre}
              </span>
              <span
                className="text-xs font-black ml-2 shrink-0"
                style={{ color: color(d.pct) }}
              >
                {d.pct}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-bg-suave overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${d.pct}%`, background: color(d.pct) }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gris mt-4 font-bold uppercase tracking-wide">
        % de usuarios que reservan tras guardar en favoritos
      </p>
    </div>
  );
}
