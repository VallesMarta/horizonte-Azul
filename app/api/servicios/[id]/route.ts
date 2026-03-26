import { ServicioController } from "@/controllers/servicio.controller";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ServicioController.obtenerUno(id);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ServicioController.actualizar(request, id);
}

// AQUÍ ESTABA EL ERROR: Ahora pasamos 'request' y luego 'id'
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  return ServicioController.eliminar(request, id);
}