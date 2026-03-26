import { UsuarioController } from "@/controllers/usuario.controller";

export async function GET(req: Request) {
  return UsuarioController.listar(req);
}
