interface Props {
  paso: number;
}

const PASOS = [
  { n: 1, label: "Pasajeros" },
  { n: 2, label: "Resumen" },
  { n: 3, label: "Pago" },
  { n: 4, label: "Confirmación" },
];

export function PasoIndicador({ paso }: Props) {
  return (
    <div className="flex items-center w-full gap-1">
      {PASOS.map((s, i, arr) => (
        <div
          key={s.n}
          className="flex items-center gap-1 flex-1 last:flex-none"
        >
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full font-black text-[11px] transition-all duration-300 ${
                paso > s.n
                  ? "bg-primario text-blanco-fijo"
                  : paso === s.n
                    ? "bg-primario text-blanco-fijo shadow-md shadow-primario/30 ring-2 ring-primario/20"
                    : "bg-bg border border-borde text-gris"
              }`}
            >
              {paso > s.n ? "✓" : s.n}
            </div>
            <span
              className={`text-[9px] font-black uppercase tracking-wider whitespace-nowrap hidden sm:block transition-colors duration-300 ${
                paso >= s.n ? "text-primario" : "text-gris"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < arr.length - 1 && (
            <div className="flex-1 mx-2">
              <div
                className={`h-0.5 w-full rounded-full transition-all duration-500 ${
                  paso > s.n ? "bg-primario" : "bg-borde"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
