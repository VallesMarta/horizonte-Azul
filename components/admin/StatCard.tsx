interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: "primario" | "verde" | "naranja" | "morado" | "azul" | "rojo";
  sub?: string;
}

const colorMap = {
  primario: "bg-primario/10 text-primario border-primario/20",
  verde: "bg-verde/10 text-verde border-verde/20",
  naranja: "bg-naranja/10 text-naranja border-naranja/20",
  morado: "bg-morado/10 text-morado border-morado/20",
  azul: "bg-otro/10 text-otro border-otro/20",
  rojo: "bg-rojo/10 text-rojo border-rojo/20",
};

const iconBg = {
  primario: "bg-primario",
  verde: "bg-verde",
  naranja: "bg-naranja",
  morado: "bg-morado",
  azul: "bg-otro",
  rojo: "bg-rojo/50",
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
      className={`rounded-2xl border p-4 sm:p-5 bg-card flex items-center gap-3 sm:gap-4 shadow-sm h-full ${colorMap[color]}`}
    >
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl text-white shrink-0 ${iconBg[color]}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gris-claro truncate">
          {label}
        </p>
        <p className="text-xl sm:text-2xl font-black text-texto leading-tight">
          {value}
        </p>
        {sub && <p className="text-xs text-gris-claro mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
