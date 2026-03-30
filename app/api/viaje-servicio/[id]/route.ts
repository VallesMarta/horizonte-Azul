import { ViajeServicioController } from "@/controllers/viaje-servicio.controller";

export async function GET(req: Request, { params }: any) {
  const { id } = await params;
  return ViajeServicioController.obtener(id);
}

export async function POST(req: Request, { params }: any) {
  const { id } = await params;
  return ViajeServicioController.crear(req, id);
}

export async function PUT(req: Request, { params }: any) {
  const { id } = await params;
  return ViajeServicioController.actualizar(req, id);
}

export async function DELETE(req: Request, { params }: any) {
  const { id } = await params;
  return ViajeServicioController.eliminar(req, id);
}
