import { NextResponse } from "next/server";
import { WishlistModel } from "@/models/wishlist.model";
import { obtenerSesion } from "@/lib/auth-utils";

export const WishlistController = {

  // 1. AÑADIR: Solo el usuario logueado puede añadir a su propia lista
  async añadir(req: Request) {
    try {
      const sesion = await obtenerSesion(req);
      if (!sesion) return NextResponse.json({ ok: false, error: "Inicia sesión para guardar favoritos" }, { status: 401 });

      const { viaje_id } = await req.json();

      if (!viaje_id) {
        return NextResponse.json({ ok: false, error: "Faltan datos del viaje" }, { status: 400 });
      }

      // IMPORTANTE: Usamos sesion.id (del token), no el que venga por el body
      await WishlistModel.add(Number(sesion.id), viaje_id);

      return NextResponse.json({ ok: true, mensaje: "Añadido a favoritos" });
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        return NextResponse.json({ ok: false, error: "Ya está en tu wishlist" }, { status: 400 });
      }
      return NextResponse.json({ ok: false, error: "Error de servidor" }, { status: 500 });
    }
  },

  // 2. QUITAR: Solo el mismo usuario puede borrar sus favoritos
  async quitar(req: Request) {
    try {
      const sesion = await obtenerSesion(req);
      if (!sesion) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });

      const { viaje_id } = await req.json();

      if (!viaje_id) {
        return NextResponse.json({ ok: false, error: "Faltan IDs" }, { status: 400 });
      }

      // Usamos el ID de la sesión para asegurar que borramos el favorito
      await WishlistModel.remove(Number(sesion.id), viaje_id);
      return NextResponse.json({ ok: true, mensaje: "Eliminado de favoritos" });
    } catch (err) {
      return NextResponse.json({ ok: false, error: "Error al eliminar" }, { status: 500 });
    }
  },

  // 3. LISTAR: El admin puede ver los de cualquiera y el propietario de la lista
 async listarPorUsuario(params: any, req: Request) {
    try {
      const sesion = await obtenerSesion(req);
      if (!sesion) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });

      const { id } = await params; // Extraemos el ID de la URL

      // SEGURIDAD: Si no eres admin y el ID de la URL no es el mismo fuera
      if (!sesion.isAdmin && sesion.id !== String(id)) {
        return NextResponse.json({ ok: false, error: "No puedes ver la wishlist de otro" }, { status: 403 });
      }

      const favoritos = await WishlistModel.getByUsuarioId(Number(id));

      return NextResponse.json({
        ok: true,
        resultado: favoritos,
      });
    } catch (err: any) {
      return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
    }
  },
};