interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: "primario" | "verde" | "naranja" | "morado" | "azul";
  sub?: string;
}

const colorMap = {
  primario: "bg-primario/10 text-primario border-primario/20",
  verde: "bg-verde/10 text-verde border-verde/20",
  naranja: "bg-naranja/10 text-naranja border-naranja/20",
  morado: "bg-morado/10 text-morado border-morado/20",
  azul: "bg-azul/10 text-azul border-azul/20",
};

const iconBg = {
  primario: "bg-primario",
  verde: "bg-verde",
  naranja: "bg-naranja",
  morado: "bg-morado",
  azul: "bg-azul",
};

export default function StatCard({
  label,
  value,
  icon,
  color,
  sub,
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 bg-card flex items-center gap-4 shadow-sm ${colorMap[color]}`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shrink-0 ${iconBg[color]}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gris-claro truncate">
          {label}
        </p>
        <p className="text-2xl font-black text-texto leading-tight">{value}</p>
        {sub && <p className="text-xs text-gris-claro mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
