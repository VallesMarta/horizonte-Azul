# 📧 Horizonte Azul - Email Service Integration

Este documento detalla la configuración y el funcionamiento del sistema de correos electrónicos de la plataforma, optimizado para entornos **Serverless (Vercel)** y autenticación segura mediante **Gmail OAuth2**.

## 🚀 Problemas Resueltos

- **Tokens Expirados:** Se configuró la app en Google Cloud como "Producción" para evitar la caducidad del `refresh_token` cada 7 días.
- **Socket Hang Up / Timeouts:** Se implementó el uso de `await` obligatorio en los controladores y la reutilización del transporte de Nodemailer mediante un pool de conexiones.

---

## 🛠️ Requisitos Previos (Google Cloud)

1.  **Estado de Producción:** La aplicación en [Google Cloud Console](https://console.cloud.google.com/) debe estar en **"Estado de publicación: En producción"**.
2.  **Scopes necesarios:** Se requiere el permiso `https://mail.google.com/`.
3.  **Refresh Token permanente:** Generado a través de [OAuth2 Playground](https://developers.google.com/oauthplayground/) usando las propias credenciales (`Client ID` y `Client Secret`).

---

## ⚙️ Variables de Entorno

Deben estar configuradas tanto en el archivo `.env.local` como en el panel de **Vercel**:

| Variable               | Descripción                                               |
| :--------------------- | :-------------------------------------------------------- |
| `GMAIL_CLIENT_ID`      | ID de cliente obtenido en Google Cloud Console.           |
| `GMAIL_CLIENT_SECRET`  | Secreto de cliente de Google Cloud.                       |
| `GMAIL_REFRESH_TOKEN`  | Token de refresco permanente (obtenido en el Playground). |
| `EMAIL_FROM`           | Correo electrónico emisor (Gmail).                        |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la aplicación (ej: Horizonte Azul).             |
| `NEXT_PUBLIC_APP_URL`  | URL base del proyecto (ej: https://dominio.com).          |

---

## 📂 Estructura del Sistema

### 1. Servicio Core (`emailService.ts`)

Encargado de la lógica de bajo nivel con **Nodemailer**.

- **Optimización Pool:** Reutiliza la conexión SMTP si la función lambda de Vercel sigue "caliente".
- **Seguridad:** Implementa timeouts manuales para evitar que la función se quede colgada esperando a Google.

### 2. Acciones de Email (`emailActions.ts`)

Capa de abstracción que define las plantillas y los asuntos de los correos.

- `emailBienvenida`: Envío tras el registro.
- `emailReservaConfirmada`: Envío tras un checkout exitoso con detalles del vuelo.
- `emailResetPassword`: Envío de link de recuperación.

---

## 📝 Reglas de Uso (Importante para Desarrolladores)

### ⚠️ Regla de Oro: El `await`

Debido a la arquitectura de **Vercel**, nunca se debe disparar un correo sin esperar su resolución. Si se omite el `await`, Vercel matará el proceso antes de que el correo salga de los servidores de Google.

**Ejemplo correcto en un Controlador:**

```typescript
try {
  // ✅ Correcto: La función espera al mail antes de responder al cliente
  await emailBienvenida({
    to: user.email,
    nombre: user.nombre,
  });
} catch (error) {
  console.error("Error no crítico:", error);
}

return NextResponse.json({ ok: true });
```

## 🔍 Depuración y Logs

Para verificar si un correo se envió correctamente:

- **Vercel Logs:** Busca el mensaje `✅ Email enviado: <ID_DEL_MENSAJE>`.
- **Gmail Sent:** Revisa la carpeta de **Enviados** de la cuenta configurada en `EMAIL_FROM`.
- **Error OAuth2:** Si aparece este error en los logs, verifica que el `GMAIL_REFRESH_TOKEN` no haya sido revocado o que las credenciales en Google Cloud sigan activas.

---

## 🔄 Mantenimiento del Token

Si por alguna razón el servicio deja de funcionar:

1.  Entra al [OAuth2 Playground](https://developers.google.com/oauthplayground/).
2.  Usa tus credenciales en el icono del engranaje ⚙️.
3.  Genera un nuevo **Refresh Token**.
4.  Actualiza la variable en Vercel y haz un **Redeploy**.
