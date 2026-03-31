import { ReservaController } from "@/controllers/reserva.controller";

// GET para el Admin
export async function GET(req: Request) {
  return ReservaController.listarTodasAdmin(req);
}

// POST para el Checkout
export async function POST(req: Request) {
  return ReservaController.procesarCheckout(req);
}
