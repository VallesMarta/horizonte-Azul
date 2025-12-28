/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primario: "var(--color-primario)",
        secundario: "var(--color-secundario)",
        texto: "var(--color-texto)",
        fondo: "var(--color-fondo)",
        iconos: "var(--color-iconos)",
        acento: "var(--color-acento)",
        otro: "var(--color-otro)",
        rojo: "var(--color-rojo)",
        verde: "var(--color-verde)",
        naranja: "var(--color-naranja)"
      },
      fontFamily: {
        serif: ["playfair-display", "serif"],
      },
    },
  },
  plugins: [],
};