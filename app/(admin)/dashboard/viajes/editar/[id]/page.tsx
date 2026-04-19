import FormViaje from "@/components/forms/FormViaje";

export default async function EditarViajePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FormViaje modo="editar" viajeId={id} />;
}