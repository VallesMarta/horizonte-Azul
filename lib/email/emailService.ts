/**
 * emailService.ts
 * Servicio central de envío de emails usando Nodemailer + Gmail OAuth2.
 * Compatible con Vercel (no usa sockets SMTP directos).
 *
 * Variables de entorno necesarias (.env.local y Vercel → Environment Variables):
 *   GMAIL_CLIENT_ID=
 *   GMAIL_CLIENT_SECRET=
 *   GMAIL_REFRESH_TOKEN=
 *   EMAIL_FROM=
 *   NEXT_PUBLIC_APP_NAME=Horizonte Azul
 *   NEXT_PUBLIC_APP_URL=
 */

import nodemailer from "nodemailer";

// ------------------------------------------------------------------
// Tipos
// ------------------------------------------------------------------
export type EmailPlantilla =
  | "bienvenida"
  | "resetPassword"
  | "confirmacion"
  | "notificacion"
  | "reservaConfirmada"
  | "respuestaContacto"
  | "custom";

export interface EnviarEmailParams {
  to: string | string[];
  subject: string;
  plantilla: EmailPlantilla;
  datos?: Record<string, string | number | boolean>;
  htmlCustom?: string;
  cc?: string | string[];
  replyTo?: string;
}

export interface EmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

// ------------------------------------------------------------------
// Transporter OAuth2 (se crea en cada llamada — obligatorio en serverless)
// ------------------------------------------------------------------
let transporter: nodemailer.Transporter | null = null;

function crearTransporter() {
  if (transporter) return transporter; // Reutilizar si ya existe

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const user = process.env.EMAIL_FROM;

  if (!clientId || !clientSecret || !refreshToken || !user) {
    throw new Error(
      "Faltan variables de entorno: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN o EMAIL_FROM.",
    );
  }
  transporter = nodemailer.createTransport({
    service: "gmail",
    pool: true, // RECOMENDADO: Mantiene conexiones abiertas para reutilizarlas
    maxConnections: 3,
    maxMessages: 100,
    auth: {
      type: "OAuth2",
      user,
      clientId,
      clientSecret,
      refreshToken,
    },
    // Añadimos tiempos de espera para que no se cuelgue el socket
    connectionTimeout: 10000, // 10 segundos
    greetingTimeout: 5000,
    socketTimeout: 15000,
  });
  
  return transporter;
}

// ------------------------------------------------------------------
// Función principal
// ------------------------------------------------------------------
export async function enviarEmail(
  params: EnviarEmailParams,
): Promise<EmailResult> {
  const {
    to,
    subject,
    plantilla,
    datos = {},
    htmlCustom,
    cc,
    replyTo,
  } = params;

  const fromName = process.env.NEXT_PUBLIC_APP_NAME ?? "Horizonte Azul";
  const fromEmail = process.env.EMAIL_FROM ?? "";
  const from = `"${fromName}" <${fromEmail}>`;

  let html: string;

  if (plantilla === "custom") {
    if (!htmlCustom) {
      return {
        ok: false,
        error: "htmlCustom es requerido para plantilla 'custom'.",
      };
    }
    html = htmlCustom;
  } else {
    const { generarPlantilla } = await import("./plantillas");
    html = generarPlantilla(plantilla, datos);
  }

  try {
    const transporter = crearTransporter();

    const info = await transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
      ...(cc ? { cc: Array.isArray(cc) ? cc.join(", ") : cc } : {}),
      ...(replyTo ? { replyTo } : {}),
    });

    console.log(`✅ Email enviado: ${info.messageId}`);
    return { ok: true, id: info.messageId };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error desconocido";
    console.error("[emailService] Error OAuth2:", msg);
    return { ok: false, error: msg };
  }
}
