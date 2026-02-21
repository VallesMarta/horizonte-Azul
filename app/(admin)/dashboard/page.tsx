export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <h1 className="text-3xl font-black text-titulo-resaltado uppercase tracking-tighter mb-8">
        Bienvenido al panel del administrador!!!
      </h1>
    </>
  );
}
