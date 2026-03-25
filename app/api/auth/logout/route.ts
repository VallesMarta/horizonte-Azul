import { AuthController } from "@/controllers/auth.controller";

export async function POST(req: Request) {
  return AuthController.logout(req);
}
