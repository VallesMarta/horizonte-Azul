import { WishlistController } from "@/controllers/wishlist.controller";

type RouteParams = { params: Promise<{ id?: string }> };

export async function GET(req: Request, { params }: RouteParams) {
  // Pasamos 'params' y 'req' para que el controlador pueda validar el Token
  return WishlistController.listarPorUsuario(params, req);
}