import { ViajeController } from "@/controllers/viaje.controller";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ViajeController.obtenerUno(id);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ViajeController.actualizar(request, id);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ViajeController.eliminar(request, id);
}
