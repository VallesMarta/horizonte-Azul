import { ViajeController } from "@/controllers/viaje.controller";

export async function GET() {
  return ViajeController.listar();
}

export async function POST(req: Request) {
  return ViajeController.crear(req);
}