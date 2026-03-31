import { ReservaController } from "@/controllers/reserva.controller";

export async function GET(req: Request, { params }: any) {
  const { id } = await params;
  return ReservaController.obtenerDetalle(req, id);
}

export async function PUT(req: Request, { params }: any) {
  const { id } = await params;
  return ReservaController.actualizar(req, id);
}

export async function DELETE(req: Request, { params }: any) {
  const { id } = await params;
  return ReservaController.eliminar(req, id);
}