import { NextResponse } from "next/server";
import { WishlistModel } from "@/models/wishlist.model";
import { obtenerSesion } from "@/lib/auth-utils";

export const WishlistController = {
  async añadir(req: Request) {
    try {
      const sesion = await obtenerSesion(req);
      if (!sesion)
        return NextResponse.json(
          { ok: false, error: "Inicia sesión para guardar favoritos" },
          { status: 401 },
        );

      const { viaje_id } = await req.json();
      if (!viaje_id)
        return NextResponse.json(
          { ok: false, error: "Falta el ID del viaje" },
          { status: 400 },
        );

      await WishlistModel.add(Number(sesion.id), Number(viaje_id));
      return NextResponse.json({ ok: true, mensaje: "Añadido a favoritos" });
    } catch (err: any) {
      console.error("❌ Error en añadir wishlist:", err.message);
      return NextResponse.json(
        { ok: false, error: "Error de servidor" },
        { status: 500 },
      );
    }
  },

  async quitar(req: Request) {
    try {
      const sesion = await obtenerSesion(req);
      if (!sesion)
        return NextResponse.json(
          { ok: false, error: "No autorizado" },
          { status: 401 },
        );

      const { viaje_id } = await req.json();

      // Usamos el ID de la sesión para asegurar que el usuario solo borra lo suyo
      const rows = await WishlistModel.remove(
        Number(sesion.id),
        Number(viaje_id),
      );

      return NextResponse.json({ ok: true, mensaje: "Eliminado de favoritos" });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: "Error al eliminar" },
        { status: 500 },
      );
    }
  },

  async listarPorUsuario(req: Request, id: string) {
    try {
      const sesion = await obtenerSesion(req);
      if (!sesion)
        return NextResponse.json(
          { ok: false, error: "No autorizado. Inicia sesión." },
          { status: 401 },
        );
      const esElPropietario = String(sesion.id) === String(id);
      if (!sesion.isAdmin && !esElPropietario) {
        return NextResponse.json(
          {
            ok: false,
            error: "No tienes permiso para ver los favoritos de otro usuario",
          },
          { status: 403 },
        );
      }

      const favoritos = await WishlistModel.getByUsuarioId(id);
      return NextResponse.json({ ok: true, resultado: favoritos });
    } catch (err: any) {
      console.error("❌ Error en listar wishlist:", err.message);
      return NextResponse.json(
        { ok: false, error: "Error interno" },
        { status: 500 },
      );
    }
  },

  async comprobar(req: Request, viajeId: string) {
    try {
      const sesion = await obtenerSesion(req);
      if (!sesion) return NextResponse.json({ ok: false, enWishlist: false });

      const enWishlist = await WishlistModel.isInWishlist(
        Number(sesion.id),
        Number(viajeId),
      );
      return NextResponse.json({ ok: true, enWishlist });
    } catch (err: any) {
      console.error("❌ Error en comprobar wishlist:", err.message);
      return NextResponse.json({ ok: false, enWishlist: false });
    }
  },
};
