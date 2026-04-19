import { ViajeController } from "@/controllers/viaje.controller";
import DetalleViaje from "@/components/viajes/DetalleViaje";
import { notFound } from "next/navigation";

export default async function PaginaViaje({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await ViajeController.detalle(id);
  const data = await res.json();

  if (!data.ok) return notFound();

  return <DetalleViaje datos={data.resultado} />;
}