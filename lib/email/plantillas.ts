/**
 * plantillas.ts
 * Plantillas HTML de email con los colores de la marca.
 * El logo se incrusta como URL pública (no base64) para mejor compatibilidad.
 */

import type { EmailPlantilla } from "@/lib/email/emailService";

// ------------------------------------------------------------------
// Config de marca (centralizada aquí para fácil cambio)
// ------------------------------------------------------------------
const BRAND = {
  nombre: process.env.NEXT_PUBLIC_APP_NAME ?? "Mi Empresa",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://example.com",
  logoUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://example.com"}/media/img/logo_empresa_header.png`,
  // Colores del globals.css
  primario: "#5271ff",
  secundario: "#3147cc",
  acento: "#1f2937",
  fondo: "#f4f5fa",
  texto: "#1f2937",
  verde: "#3ba054",
  rojo: "#d13264",
  naranja: "#ed6b53",
  blanco: "#ffffff",
  gris: "#6b7a92",
  borde: "#dde3ec",
  card: "#ffffff",
};

// ------------------------------------------------------------------
// Layout base (wrapper HTML común a todas las plantillas)
// ------------------------------------------------------------------
function layoutBase(contenido: string, pie?: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email ${BRAND.nombre}</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
</head>
<body style="
  margin:0; padding:0;
  background-color:${BRAND.fondo};
  font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
  color:${BRAND.texto};
  -webkit-font-smoothing:antialiased;
">

  <!-- Wrapper externo -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0"
    width="100%" style="background-color:${BRAND.fondo}; padding:32px 0;">
    <tr>
      <td align="center">

        <!-- Tarjeta principal (max 600px) -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
          width="600" style="max-width:600px; width:100%;">

          <!-- HEADER con logo -->
          <tr>
            <td style="
              background-color:${BRAND.secundario};
              border-radius:12px 12px 0 0;
              padding:28px 40px;
              text-align:center;
            ">
              <img src="${BRAND.logoUrl}"
                   alt="${BRAND.nombre}"
                   height="48"
                   style="display:inline-block; max-height:48px; width:auto; vertical-align:middle;"
              />
            </td>
          </tr>

          <!-- CUERPO -->
          <tr>
            <td style="
              background-color:${BRAND.card};
              padding:40px 48px;
              border-left:1px solid ${BRAND.borde};
              border-right:1px solid ${BRAND.borde};
            ">
              ${contenido}
            </td>
          </tr>

          <!-- PIE -->
          <tr>
            <td style="
              background-color:${BRAND.secundario};
              border-radius:0 0 12px 12px;
              padding:24px 40px;
              text-align:center;
            ">
              <p style="margin:0 0 6px; font-size:13px; color:rgba(255,255,255,0.75);">
                ${pie ?? `© ${new Date().getFullYear()} ${BRAND.nombre}. Todos los derechos reservados.`}
              </p>
              <a href="${BRAND.url}" style="
                font-size:13px;
                color:rgba(255,255,255,0.6);
                text-decoration:none;
              ">${BRAND.url}</a>
            </td>
          </tr>

        </table>
        <!-- /tarjeta -->

      </td>
    </tr>
  </table>

</body>
</html>`.trim();
}

// ------------------------------------------------------------------
// Botón CTA reutilizable
// ------------------------------------------------------------------
function botonCTA(texto: string, href: string, color = BRAND.primario): string {
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px auto 0;">
  <tr>
    <td style="border-radius:8px; background-color:${color};">
      <a href="${href}" target="_blank" style="
        display:inline-block;
        padding:14px 32px;
        font-size:15px;
        font-weight:700;
        color:${BRAND.blanco};
        text-decoration:none;
        border-radius:8px;
        letter-spacing:0.3px;
      ">${texto}</a>
    </td>
  </tr>
</table>`;
}

// ------------------------------------------------------------------
// Divider
// ------------------------------------------------------------------
const divider = `<hr style="border:none; border-top:1px solid ${BRAND.borde}; margin:28px 0;" />`;

// ------------------------------------------------------------------
// Plantillas individuales
// ------------------------------------------------------------------

function plantillaBienvenida(
  datos: Record<string, string | number | boolean>,
): string {
  const nombre = String(datos.nombre ?? "Usuario");
  const urlAcceso = String(datos.urlAcceso ?? BRAND.url);

  const contenido = `
    <h1 style="margin:0 0 8px; font-size:26px; font-weight:800; color:${BRAND.secundario};">
      ¡Bienvenido/a, ${nombre}! 🎉
    </h1>
    <p style="margin:0 0 20px; font-size:15px; color:${BRAND.gris}; line-height:1.6;">
      Tu cuenta en <strong style="color:${BRAND.acento};">${BRAND.nombre}</strong>
      ha sido creada correctamente. Estamos encantados de tenerte con nosotros.
    </p>

    ${divider}

    <p style="margin:0 0 12px; font-size:15px; line-height:1.7; color:${BRAND.texto};">
      Ya puedes acceder con tus credenciales y comenzar a explorar tu próximo destino.
      Estamos aquí para ayudarte en todo momento, si tienes alguna duda, no dudes en ponerte en contacto con 
      nosotros o consultar a <b>Horion</b>, nuestro chatbot.
    </p>

    ${botonCTA("Acceder a mi cuenta", urlAcceso)}

    ${divider}

    <p style="margin:0; font-size:13px; color:${BRAND.gris}; line-height:1.6;">
      Si no esperabas este correo, puedes ignorarlo de forma segura.
    </p>
  `;

  return layoutBase(contenido);
}

function plantillaResetPassword(
  datos: Record<string, string | number | boolean>,
): string {
  const nombre = String(datos.nombre ?? "Usuario");
  const urlReset = String(datos.urlReset ?? BRAND.url);
  const expiracion = String(datos.expiracion ?? "24 horas");

  const contenido = `
    <h1 style="margin:0 0 8px; font-size:24px; font-weight:800; color:${BRAND.secundario};">
      Restablecer contraseña
    </h1>
    <p style="margin:0 0 20px; font-size:15px; color:${BRAND.gris}; line-height:1.6;">
      Hola <strong>${nombre}</strong>, hemos recibido una solicitud para restablecer
      la contraseña de tu cuenta.
    </p>

    ${divider}

    <p style="margin:0 0 4px; font-size:15px; line-height:1.7; color:${BRAND.texto};">
      Haz clic en el botón de abajo para crear una nueva contraseña.
      Este enlace expirará en <strong>${expiracion}</strong>.
    </p>

    ${botonCTA("Restablecer contraseña", urlReset, BRAND.rojo)}

    ${divider}

    <table role="presentation" cellspacing="0" cellpadding="0" border="0"
      width="100%" style="background-color:${BRAND.fondo}; border-radius:8px; padding:16px 20px; margin-top:8px;">
      <tr>
        <td>
          <p style="margin:0; font-size:13px; color:${BRAND.gris}; line-height:1.6;">
            ⚠️ <strong>Importante:</strong> Si no solicitaste este cambio, ignora este
            correo. Tu contraseña actual seguirá siendo válida.
          </p>
        </td>
      </tr>
    </table>
  `;

  return layoutBase(contenido);
}

function plantillaConfirmacion(
  datos: Record<string, string | number | boolean>,
): string {
  const nombre = String(datos.nombre ?? "Usuario");
  const concepto = String(datos.concepto ?? "tu solicitud");
  const urlDetalle = String(datos.urlDetalle ?? BRAND.url);
  const referencia = String(datos.referencia ?? "");

  const contenido = `
    <!-- Icono check -->
    <div style="text-align:center; margin-bottom:24px;">
      <div style="
        display:inline-block;
        width:64px; height:64px;
        background-color:${BRAND.verde};
        border-radius:50%;
        line-height:64px;
        font-size:30px;
        color:${BRAND.blanco};
        text-align:center;
      ">✓</div>
    </div>

    <h1 style="margin:0 0 8px; font-size:24px; font-weight:800; color:${BRAND.secundario}; text-align:center;">
      ¡Confirmado!
    </h1>
    <p style="margin:0 0 20px; font-size:15px; color:${BRAND.gris}; text-align:center; line-height:1.6;">
      Hola <strong>${nombre}</strong>, hemos confirmado <strong>${concepto}</strong> correctamente.
    </p>

    ${
      referencia
        ? `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0"
      width="100%" style="background-color:${BRAND.fondo}; border-radius:8px; margin:0 0 20px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0; font-size:14px; color:${BRAND.gris};">
            Referencia: <strong style="color:${BRAND.acento};">${referencia}</strong>
          </p>
        </td>
      </tr>
    </table>`
        : ""
    }

    ${divider}

    ${botonCTA("Ver detalles", urlDetalle, BRAND.verde)}

    ${divider}

    <p style="margin:0; font-size:13px; color:${BRAND.gris}; line-height:1.6; text-align:center;">
      Guarda este correo como comprobante. Si tienes alguna pregunta, contáctanos.
    </p>
  `;

  return layoutBase(contenido);
}

function plantillaNotificacion(
  datos: Record<string, string | number | boolean>,
): string {
  const titulo = String(datos.titulo ?? "Notificación");
  const mensaje = String(datos.mensaje ?? "Tienes una nueva notificación.");
  const urlAccion = String(datos.urlAccion ?? "");
  const textoAccion = String(datos.textoAccion ?? "Ver más");
  const tipo = String(datos.tipo ?? "info"); // info | warning | success | error

  const coloresTipo: Record<string, string> = {
    info: BRAND.primario,
    warning: BRAND.naranja,
    success: BRAND.verde,
    error: BRAND.rojo,
  };
  const colorTipo = coloresTipo[tipo] ?? BRAND.primario;

  const emojisTipo: Record<string, string> = {
    info: "ℹ️",
    warning: "⚠️",
    success: "✅",
    error: "❌",
  };
  const emoji = emojisTipo[tipo] ?? "🔔";

  const contenido = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0"
      width="100%" style="border-left:4px solid ${colorTipo}; padding-left:16px; margin-bottom:24px;">
      <tr>
        <td>
          <h1 style="margin:0 0 6px; font-size:22px; font-weight:800; color:${colorTipo};">
            ${emoji} ${titulo}
          </h1>
          <p style="margin:0; font-size:14px; color:${BRAND.gris};">
            ${new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px; font-size:15px; color:${BRAND.texto}; line-height:1.7;">
      ${mensaje}
    </p>

    ${urlAccion ? botonCTA(textoAccion, urlAccion, colorTipo) : ""}

    ${divider}

    <p style="margin:0; font-size:12px; color:${BRAND.gris}; line-height:1.6;">
      Recibes este correo porque estás suscrito a las notificaciones de ${BRAND.nombre}.
    </p>
  `;

  return layoutBase(contenido);
}

function plantillaReservaConfirmada(
  datos: Record<string, string | number | boolean>,
): string {
  const nombre = String(datos.nombre ?? "Viajero");
  const localizador = String(datos.localizador ?? "");
  const tipo = String(datos.tipoVuelo ?? "").toLowerCase(); // "ida" | "vuelta"
  const tipoLabel =
    tipo === "vuelta" ? "✈️ Vuelo de vuelta" : "✈️ Vuelo de ida";
  const Origen = String(datos.aeropuertoOrigen ?? "");
  const Destino = String(datos.aeropuertoDestino ?? "");
  const fecSalida = String(datos.fecSalida ?? "");
  const horaSalida = String(datos.horaSalida ?? "");
  const fecLlegada = String(datos.fecLlegada ?? "");
  const horaLlegada = String(datos.horaLlegada ?? "");
  const pasajeros = String(datos.pasajeros ?? "");
  const urlReservas = String(
    datos.urlReservas ?? `${BRAND.url}/perfil/mis-reservas`,
  );

  // Formatear fechas legibles
  const formatearFecha = (fecha: string) => {
    if (!fecha) return "";
    try {
      return new Date(fecha).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  const contenido = `
    <!-- Cabecera confirmación -->
    <div style="text-align:center; margin-bottom:28px;">
      <div style="
        display:inline-block;
        background-color:${BRAND.verde};
        border-radius:50%;
        width:68px; height:68px;
        line-height:68px;
        font-size:32px;
        color:${BRAND.blanco};
        text-align:center;
      ">✓</div>
      <h1 style="margin:16px 0 4px; font-size:24px; font-weight:800; color:${BRAND.secundario};">
        ¡Reserva confirmada!
      </h1>
      <p style="margin:0; font-size:14px; color:${BRAND.gris};">
        Hola <strong>${nombre}</strong>, tu reserva ha sido procesada correctamente.
      </p>
    </div>
 
    <!-- Localizador -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
      style="background-color:${BRAND.fondo}; border-radius:10px; margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px; text-align:center;">
          <p style="margin:0 0 4px; font-size:11px; font-weight:700; color:${BRAND.gris}; text-transform:uppercase; letter-spacing:1px;">
            Código de reserva
          </p>
          <p style="margin:0; font-size:26px; font-weight:900; color:${BRAND.secundario}; letter-spacing:3px;">
            ${localizador}
          </p>
        </td>
      </tr>
    </table>
 
    <!-- Info del vuelo -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
      style="border:1px solid ${BRAND.borde}; border-radius:10px; margin-bottom:24px; overflow:hidden;">
 
      <!-- Header vuelo -->
      <tr>
        <td style="background-color:${BRAND.primario}; padding:12px 20px;">
          <p style="margin:0; font-size:13px; font-weight:700; color:${BRAND.blanco};">
            ${tipoLabel}
          </p>
        </td>
      </tr>
 
      <!-- Ruta -->
      <tr>
        <td style="padding:20px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <!-- Origen -->
              <td style="text-align:center; width:38%;">
                <p style="margin:0 0 4px; font-size:28px; font-weight:900; color:${BRAND.secundario};">
                ${tipo == "ida" ? `${Origen}` : `${Destino}`} 
                  
                </p>
                <p style="margin:0 0 2px; font-size:12px; color:${BRAND.gris};">Salida</p>
                <p style="margin:0; font-size:13px; font-weight:700; color:${BRAND.texto};">
                ${tipo == "ida" ? `${formatearFecha(fecSalida)}` : `${formatearFecha(fecLlegada)}`}
                </p>
                <p style="margin:2px 0 0; font-size:15px; font-weight:800; color:${BRAND.primario};">
                  ${tipo == "ida" ? `${horaSalida}` : `${horaLlegada}`}
                </p>
              </td>
 
              <!-- Flecha -->
              <td style="text-align:center; width:24%;">
                <p style="margin:0; font-size:22px; color:${BRAND.gris};">→</p>
              </td>
 
              <!-- Destino -->
              <td style="text-align:center; width:38%;">
                <p style="margin:0 0 4px; font-size:28px; font-weight:900; color:${BRAND.secundario};">
                  ${tipo == "ida" ? `${Destino}` : `${Origen}`}
                </p>
                <p style="margin:0 0 2px; font-size:12px; color:${BRAND.gris};">Llegada</p>
                <p style="margin:0; font-size:13px; font-weight:700; color:${BRAND.texto};">
                  ${tipo == "ida" ? `${formatearFecha(fecLlegada)}` : `${formatearFecha(fecSalida)}`}
                </p>
                <p style="margin:2px 0 0; font-size:15px; font-weight:800; color:${BRAND.primario};">
                  ${tipo == "ida" ? `${horaLlegada}` : `${horaSalida}`}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
 
    <!-- Pasajeros -->
    ${
      pasajeros
        ? `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
      style="margin-bottom:24px;">
      <tr>
        <td>
          <p style="margin:0 0 10px; font-size:12px; font-weight:700; color:${BRAND.gris}; text-transform:uppercase; letter-spacing:1px;">
            Pasajeros
          </p>
          ${pasajeros
            .split("||")
            .map(
              (p: string) => `
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
            style="background-color:${BRAND.fondo}; border-radius:8px; margin-bottom:8px;">
            <tr>
              <td style="padding:12px 16px;">
                <p style="margin:0; font-size:14px; color:${BRAND.texto};">
                  👤 <strong>${p.trim()}</strong>
                </p>
              </td>
            </tr>
          </table>`,
            )
            .join("")}
        </td>
      </tr>
    </table>`
        : ""
    }
 
    ${divider}
 
    <!-- Estado -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
      style="background-color:${BRAND.verde}15; border:1px solid ${BRAND.verde}40; border-radius:8px; margin-bottom:24px;">
      <tr>
        <td style="padding:14px 20px; text-align:center;">
          <p style="margin:0; font-size:14px; font-weight:700; color:${BRAND.verde};">
            ✅ Estado: CONFIRMADA
          </p>
        </td>
      </tr>
    </table>
 
    ${botonCTA("Ver mi reserva", urlReservas, BRAND.secundario)}
 
    ${divider}
 
    <p style="margin:0; font-size:12px; color:${BRAND.gris}; text-align:center; line-height:1.7;">
      Guarda este correo como comprobante de tu reserva.<br/>
      Si tienes alguna pregunta, no dudes en contactarnos.
    </p>
  `;

  return layoutBase(contenido);
}

// ------------------------------------------------------------------
// Exportación principal
// ------------------------------------------------------------------
export function generarPlantilla(
  tipo: EmailPlantilla,
  datos: Record<string, string | number | boolean>,
): string {
  switch (tipo) {
    case "bienvenida":
      return plantillaBienvenida(datos);
    case "resetPassword":
      return plantillaResetPassword(datos);
    case "confirmacion":
      return plantillaConfirmacion(datos);
    case "notificacion":
      return plantillaNotificacion(datos);
    case "reservaConfirmada":
      return plantillaReservaConfirmada(datos);
    default:
      throw new Error(`Plantilla desconocida: ${tipo}`);
  }
}
