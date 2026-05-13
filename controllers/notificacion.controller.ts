import { NextRequest, NextResponse } from "next/server";
import { NotificacionModel } from "@/models/notificacion.model";
import { obtenerSesion } from "@/lib/auth-utils";

export async function getNotificaciones(req: NextRequest) {
  const sesion = await obtenerSesion(req as any);
  if (!sesion) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const usuario_id = Number(sesion.id);
  const notificaciones = await NotificacionModel.getByUsuario(usuario_id);
  const no_leidas = await NotificacionModel.contarNoLeidas(usuario_id);

  return NextResponse.json({ notificaciones, no_leidas });
}

export async function marcarLeida(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sesion = await obtenerSesion(req as any);
  if (!sesion) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: idStr } = await params;
  const notif = await NotificacionModel.marcarLeida(
    parseInt(idStr),
    Number(sesion.id),
  );

  if (!notif) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  return NextResponse.json(notif);
}

export async function marcarTodasLeidas(req: NextRequest) {
  const sesion = await obtenerSesion(req as any);
  if (!sesion) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await NotificacionModel.marcarTodasLeidas(Number(sesion.id));
  return NextResponse.json({ ok: true });
}

export async function eliminarNotificacion(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sesion = await obtenerSesion(req as any);
  if (!sesion) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: idStr } = await params;
  await NotificacionModel.eliminar(parseInt(idStr), Number(sesion.id));
  return NextResponse.json({ ok: true });
}

export async function eliminarNotificaciones(req: NextRequest) {
  const sesion = await obtenerSesion(req as any);
  if (!sesion) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const soloLeidas = searchParams.get("solo_leidas") === "true";

  if (soloLeidas) {
    await NotificacionModel.eliminarLeidas(Number(sesion.id));
  } else {
    await NotificacionModel.eliminarTodas(Number(sesion.id));
  }

  return NextResponse.json({ ok: true });
}
