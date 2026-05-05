import { AdminStats } from "@/models/types";

interface Props {
  wishlist: AdminStats["top_wishlist"];
}

export default function TopWishlistTable({ wishlist }: Props) {
  return (
    <div className="bg-card border border-card-borde rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-card-borde">
        <h2 className="font-black text-base text-texto uppercase tracking-tight">
          ❤️ Más guardados
        </h2>
      </div>
      <div className="divide-y divide-card-borde">
        {wishlist.map((w, i) => (
          <div key={w.iataDestino} className="flex items-center gap-4 px-5 py-3 hover:bg-bg-suave transition-colors">
            <span className="w-6 h-6 rounded-full bg-rojo/10 text-rojo text-xs font-black flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            {w.img && (
              <img src={w.img} alt={w.paisDestino}
                className="w-10 h-10 rounded-lg object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-texto text-sm truncate">{w.paisDestino}</p>
              <p className="text-xs text-gris-claro">{w.iataDestino}</p>
            </div>
            <div className="flex items-center gap-1 text-rojo font-black text-sm shrink-0">
              <span>♥</span>
              <span>{w.total_guardados}</span>
            </div>
          </div>
        ))}
        {wishlist.length === 0 && (
          <p className="text-center text-gris-claro py-8 text-sm">Sin favoritos aún</p>
        )}
      </div>
    </div>
  );
}