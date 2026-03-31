import { ReservaController } from "@/controllers/reserva.controller";

export async function GET(req: Request, { params }: any) {
  const { id } = await params;
  return ReservaController.listarPorUsuario(req, id);
}