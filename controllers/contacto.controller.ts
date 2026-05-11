import { NextRequest, NextResponse } from "next/server";
import { MensajeContactoModel } from "@/models/mensajeContacto.model";
import { NotificacionModel } from "@/models/notificacion.model";
import { emailRespuestaContacto } from "@/lib/email/emailActions";
import { validarAdmin, obtenerSesion } from "@/lib/auth-utils";

export async function enviarMensaje(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, asunto, mensaje } = body;

    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    // Si viene con sesión válida, vinculamos el mensaje al usuario
    const sesion = await obtenerSesion(req as any);
    const usuario_id = sesion ? Number(sesion.id) : null;

    const mensajeGuardado = await MensajeContactoModel.crear({
      nombre,
      email,
      asunto,
      mensaje,
      usuario_id,
    });

    return NextResponse.json({ ok: true, id: mensajeGuardado.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function getMensajes(req: NextRequest) {
  const auth = await validarAdmin(req as any);
  if (!auth.autorizado) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const mensajes = await MensajeContactoModel.getAll();
    return NextResponse.json(mensajes);
  } catch (err) {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function getMensaje(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await validarAdmin(req as any);
  if (!auth.autorizado) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id: idStr } = await params;
  const id = parseInt(idStr);

  const mensaje = await MensajeContactoModel.getById(id);
  if (!mensaje) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  if (!mensaje.leido) await MensajeContactoModel.marcarLeido(id);

  return NextResponse.json(mensaje);
}

export async function responderMensaje(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await validarAdmin(req as any);
  if (!auth.autorizado) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const { respuesta } = await req.json();

    if (!respuesta?.trim()) {
      return NextResponse.json({ error: "Respuesta vacía" }, { status: 400 });
    }

    const mensaje = await MensajeContactoModel.getById(id);
    if (!mensaje) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    await MensajeContactoModel.responder(id);

    try {
      await emailRespuestaContacto({
        to: mensaje.email,
        nombre: mensaje.nombre,
        asuntoOriginal: mensaje.asunto,
        respuesta,
      });
    } catch (emailErr) {
      console.error("Error email (no crítico):", emailErr);
    }

    if (mensaje.usuario_id) {
      await NotificacionModel.crear({
        usuario_id: mensaje.usuario_id,
        tipo: "respuesta_contacto",
        titulo: `Respuesta a tu consulta: ${mensaje.asunto}`,
        cuerpo: respuesta,
        enlace: "/perfil/mis-consultas",
        mensaje_contacto_id: id,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function eliminarMensaje(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await validarAdmin(req as any);
  if (!auth.autorizado) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id: idStr } = await params;
  await MensajeContactoModel.eliminar(parseInt(idStr));
  return NextResponse.json({ ok: true });
}

export async function getMisConsultas(req: NextRequest) {
  const sesion = await obtenerSesion(req as any);
  if (!sesion) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const consultas = await MensajeContactoModel.getMisConsultas(
    Number(sesion.id),
  );
  return NextResponse.json(consultas);
}

export async function getMiConsulta(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sesion = await obtenerSesion(req as any);
  if (!sesion) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const contacto_id = parseInt(id);
  const usuario_id = Number(sesion.id);

  const hilo = await MensajeContactoModel.getHiloUsuario(
    contacto_id,
    usuario_id,
  );
  if (!hilo) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json(hilo);
}

export async function responderComoUsuario(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sesion = await obtenerSesion(req as any);
  if (!sesion) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const contacto_id = parseInt(id);
  const usuario_id = Number(sesion.id);
  const { contenido } = await req.json();

  if (!contenido?.trim()) {
    return NextResponse.json({ error: "Contenido vacío" }, { status: 400 });
  }

  // Verificar propiedad
  const hilo = await MensajeContactoModel.getHiloUsuario(
    contacto_id,
    usuario_id,
  );
  if (!hilo) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const nuevo = await MensajeContactoModel.añadirAlHilo(
    contacto_id,
    "usuario",
    contenido,
  );

  // Vuelve a pendiente para el admin
  await MensajeContactoModel.marcarPendiente(contacto_id);

  return NextResponse.json(nuevo);
}
