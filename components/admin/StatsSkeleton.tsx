export default function StatsSkeleton() {
  return (
    <div className="animate-pulse space-y-4 sm:space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-20 sm:h-24 rounded-2xl ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}
            style={{ backgroundColor: "var(--color-bg-suave)" }}
          />
        ))}
      </div>

      {/* Tablas + gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-56 sm:h-64 rounded-2xl"
            style={{ backgroundColor: "var(--color-bg-suave)" }}
          />
        ))}
      </div>

      {/* Últimas reservas */}
      <div
        className="h-56 sm:h-64 rounded-2xl"
        style={{ backgroundColor: "var(--color-bg-suave)" }}
      />
    </div>
  );
}
