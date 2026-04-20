import { WishlistController } from "@/controllers/wishlist.controller";

type Params = { params: Promise<{ viajeId: string }> };

export async function GET(req: Request, { params }: Params) {
  const { viajeId } = await params;
  return WishlistController.comprobar(req, viajeId);
}