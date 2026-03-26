import { UsuarioController } from "@/controllers/usuario.controller";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return UsuarioController.obtenerUno(req, id);
}

export async function PUT(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return UsuarioController.actualizar(req, id);
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { id } = await params;
  return UsuarioController.eliminar(req, id);
}