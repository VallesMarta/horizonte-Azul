import Stripe from "stripe";

// Validamos que la clave secreta exista para evitar errores en tiempo de ejecución
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "❌ La variable STRIPE_SECRET_KEY no está definida en el archivo .env",
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // @ts-ignore - Usamos la versión más estable
  apiVersion: "2023-10-16",
  typescript: true,
});
