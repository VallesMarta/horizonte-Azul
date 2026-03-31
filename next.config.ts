import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    // !! ADVERTENCIA !!
    // Esto permite que el build termine aunque haya errores de tipos.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
