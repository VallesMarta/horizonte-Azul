/**
 * emailService.ts
 * Servicio central de envío de emails usando Nodemailer + Gmail.
 *
 * Variables de entorno necesarias (.env.local):
 *   EMAIL_FROM=info.horizonteazul@gmail.com
 *   EMAIL_GMAIL_PASS=xxxx xxxx xxxx xxxx   ← contraseña de aplicación Gmail
 *   NEXT_PUBLIC_APP_NAME=Horizonte Azul
 *   NEXT_PUBLIC_APP_URL=https://tudominio.com
 *
 * Cómo obtener la contraseña de aplicación:
 *   myaccount.google.com → Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones
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
  | "custom";

export interface EnviarEmailParams {
  /** Destinatario(s) */
  to: string | string[];
  /** Asunto del correo */
  subject: string;
  /** Plantilla predefinida */
  plantilla: EmailPlantilla;
  /** Datos para rellenar la plantilla */
  datos?: Record<string, string | number | boolean>;
  /** HTML personalizado (solo si plantilla === 'custom') */
  htmlCustom?: string;
  /** CC opcional */
  cc?: string | string[];
  /** Reply-To opcional */
  replyTo?: string;
}

export interface EmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

// ------------------------------------------------------------------
// Transporter Nodemailer (singleton)
// ------------------------------------------------------------------
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const user = process.env.EMAIL_FROM;
    const pass = process.env.EMAIL_GMAIL_PASS;

    if (!user || !pass) {
      throw new Error(
        "Faltan EMAIL_FROM o EMAIL_GMAIL_PASS en las variables de entorno.",
      );
    }

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
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

  const from = `"${process.env.NEXT_PUBLIC_APP_NAME ?? "Horizonte Azul"}" <${process.env.EMAIL_FROM}>`;

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
    const { generarPlantilla } = await import("@/lib/email/plantillas");
    html = generarPlantilla(plantilla, datos);
  }

  try {
    const info = await getTransporter().sendMail({
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
    console.error("[emailService] Error Nodemailer:", msg);
    return { ok: false, error: msg };
  }
}
