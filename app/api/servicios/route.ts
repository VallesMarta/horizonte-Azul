import { ServicioController } from "@/controllers/servicio.controller";

export async function GET() {
  return ServicioController.listar();
}

export async function POST(req: Request) {
  return ServicioController.crear(req);
}
