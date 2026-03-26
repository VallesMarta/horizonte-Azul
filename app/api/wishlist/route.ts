import { WishlistController } from "@/controllers/wishlist.controller";

export async function POST(req: Request) {
  return WishlistController.añadir(req);
}

export async function DELETE(req: Request) {
  return WishlistController.quitar(req);
}