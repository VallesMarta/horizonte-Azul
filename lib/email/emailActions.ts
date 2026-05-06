/**
 * emailActions.ts  →  src/lib/email/emailActions.ts
 *
 * Funciones tipadas para enviar cada tipo de email.
 * Se importan desde controladores (server-side), igual que usas
 * WishlistModel desde WishlistController.
 *
 * Uso:
 *   import { emailBienvenida } from "@/lib/email/emailActions";
 *   await emailBienvenida({ to: "x@x.com", nombre: "Ana" });
 */

import { enviarEmail, EmailResult } from "@/lib/email/emailService";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Horizonte Azul";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

// ─── Bienvenida ───────────────────────────────────────────────────────────────
export async function emailBienvenida(params: {
  to: string;
  nombre: string;
  urlAcceso?: string;
}): Promise<EmailResult> {
  return enviarEmail({
    to: params.to,
    subject: `¡Bienvenido/a a ${APP_NAME}!`,
    plantilla: "bienvenida",
    datos: {
      nombre: params.nombre,
      urlAcceso: params.urlAcceso ?? APP_URL,
    },
  });
}

// ─── Reset de contraseña ──────────────────────────────────────────────────────
export async function emailResetPassword(params: {
  to: string;
  nombre: string;
  token: string;
  expiracionHoras?: number;
}): Promise<EmailResult> {
  return enviarEmail({
    to: params.to,
    subject: "Restablecer tu contraseña",
    plantilla: "resetPassword",
    datos: {
      nombre: params.nombre,
      urlReset: `${APP_URL}/auth/reset-password?token=${params.token}`,
      expiracion: `${params.expiracionHoras ?? 24} horas`,
    },
  });
}

// ─── Confirmación genérica ────────────────────────────────────────────────────
export async function emailConfirmacion(params: {
  to: string;
  nombre: string;
  concepto: string;
  referencia?: string;
  urlDetalle?: string;
}): Promise<EmailResult> {
  return enviarEmail({
    to: params.to,
    subject: `Confirmación: ${params.concepto}`,
    plantilla: "confirmacion",
    datos: {
      nombre: params.nombre,
      concepto: params.concepto,
      referencia: params.referencia ?? "",
      urlDetalle: params.urlDetalle ?? APP_URL,
    },
  });
}

// ─── Notificación ─────────────────────────────────────────────────────────────
export async function emailNotificacion(params: {
  to: string | string[];
  titulo: string;
  mensaje: string;
  tipo?: "info" | "warning" | "success" | "error";
  urlAccion?: string;
  textoAccion?: string;
}): Promise<EmailResult> {
  return enviarEmail({
    to: params.to,
    subject: params.titulo,
    plantilla: "notificacion",
    datos: {
      titulo: params.titulo,
      mensaje: params.mensaje,
      tipo: params.tipo ?? "info",
      urlAccion: params.urlAccion ?? "",
      textoAccion: params.textoAccion ?? "Ver más",
    },
  });
}

// ─── Reserva confirmada ───────────────────────────────────────────────────────
export async function emailReservaConfirmada(params: {
  to: string;
  nombre: string;
  localizador: string;
  tipoVuelo: "ida" | "vuelta";
  aeropuertoOrigen: string;
  aeropuertoDestino: string;
  fecSalida: string;
  horaSalida: string;
  fecLlegada: string;
  horaLlegada: string;
  /** Nombres de pasajeros separados por "||". Ej: "Ana García||Juan López" */
  pasajeros: string;
}): Promise<EmailResult> {
  const tipoLabel = params.tipoVuelo === "vuelta" ? "vuelta" : "ida";

  return enviarEmail({
    to: params.to,
    subject: `✅Reserva confirmada — Vuelo de ${tipoLabel} ${tipoLabel == "ida" ? `${params.aeropuertoOrigen} → ${params.aeropuertoDestino}` : `${params.aeropuertoDestino} → ${params.aeropuertoOrigen}`}  [${params.localizador}]`,
    plantilla: "reservaConfirmada",
    datos: {
      nombre: params.nombre,
      localizador: params.localizador,
      tipoVuelo: params.tipoVuelo,
      aeropuertoOrigen: params.aeropuertoOrigen,
      aeropuertoDestino: params.aeropuertoDestino,
      fecSalida: params.fecSalida,
      horaSalida: params.horaSalida,
      fecLlegada: params.fecLlegada,
      horaLlegada: params.horaLlegada,
      pasajeros: params.pasajeros,
      urlReservas: `${APP_URL}/perfil/mis-reservas`,
    },
  });
}
