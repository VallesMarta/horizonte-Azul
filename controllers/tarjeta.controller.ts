import { NextResponse } from "next/server";
import { TarjetaModel } from "@/models/tarjeta.model";
import { obtenerSesion } from "@/lib/auth-utils";
import { stripe } from "@/lib/stripe";

export const TarjetaController = {
  async listarPorUsuario(req: Request, id: string) {
    try {
      const sesion = await obtenerSesion(req);
      if (!sesion)
        return NextResponse.json(
          { ok: false, error: "No autorizado" },
          { status: 401 },
        );

      const esPropietario = sesion.id === id;

      if (!sesion.isAdmin && !esPropietario) {
        return NextResponse.json(
          { ok: false, error: "Acceso denegado" },
          { status: 403 },
        );
      }

      const tarjetas = await TarjetaModel.getByUsuarioId(id);
      return NextResponse.json({ ok: true, resultado: tarjetas });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: "Error interno" },
        { status: 500 },
      );
    }
  },

  async crear(req: Request) {
    try {
      const sesion = await obtenerSesion(req);
      if (!sesion)
        return NextResponse.json(
          { ok: false, error: "No autorizado" },
          { status: 401 },
        );

      const { paymentMethodId } = await req.json();
      if (!paymentMethodId)
        return NextResponse.json(
          { ok: false, error: "ID requerido" },
          { status: 400 },
        );

      // 1. Obtenemos detalles de Stripe
      const pm = await stripe.paymentMethods.retrieve(paymentMethodId);

      // 2. Insertamos
      const resultado = await TarjetaModel.create({
        usuarioId: sesion.id,
        paymentMethodId: pm.id,
        brand: pm.card?.brand || "unknown",
        last4: pm.card?.last4 || "0000",
        expMonth: pm.card?.exp_month || 0,
        expYear: pm.card?.exp_year || 0,
        nombreTitular: pm.billing_details?.name || null,
      });

      return NextResponse.json({
        ok: true,
        mensaje: "Tarjeta guardada",
        resultado: resultado,
      });
    } catch (err: any) {
      console.error("Error al crear tarjeta:", err.message);
      return NextResponse.json(
        { ok: false, error: "Error al crear" },
        { status: 500 },
      );
    }
  },

  async actualizarPredeterminada(req: Request) {
    try {
      const sesion = await obtenerSesion(req);
      if (!sesion)
        return NextResponse.json(
          { ok: false, error: "No autorizado" },
          { status: 401 },
        );

      const { paymentMethodId, esPredeterminada } = await req.json();

      const resultado = await TarjetaModel.updateStatus(
        sesion.id,
        paymentMethodId,
        esPredeterminada,
      );

      return NextResponse.json({ ok: true, resultado });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: "Error al actualizar" },
        { status: 500 },
      );
    }
  },

  async eliminar(req: Request) {
    try {
      const sesion = await obtenerSesion(req);
      if (!sesion)
        return NextResponse.json(
          { ok: false, error: "No autorizado" },
          { status: 401 },
        );

      const { paymentMethodId } = await req.json();
      if (!paymentMethodId)
        return NextResponse.json(
          { ok: false, error: "ID requerido" },
          { status: 400 },
        );

      try {
        await stripe.paymentMethods.detach(paymentMethodId);
      } catch (e) {
        console.warn("No se pudo desvincular en Stripe, borrando local");
      }

      const borrado = await TarjetaModel.remove(sesion.id, paymentMethodId);

      if (!borrado || borrado.length === 0) {
        return NextResponse.json(
          { ok: false, error: "Tarjeta no encontrada" },
          { status: 404 },
        );
      }

      return NextResponse.json({ ok: true, mensaje: "Tarjeta eliminada" });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: "Error al eliminar" },
        { status: 500 },
      );
    }
  },
};
