export default function StatsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl"
            style={{ backgroundColor: "var(--color-bg-suave)" }}
          />
        ))}
      </div>

      {/* Tablas + gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-2xl"
            style={{ backgroundColor: "var(--color-bg-suave)" }}
          />
        ))}
      </div>

      {/* Últimas reservas */}
      <div
        className="h-64 rounded-2xl"
        style={{ backgroundColor: "var(--color-bg-suave)" }}
      />
    </div>
  );
}
