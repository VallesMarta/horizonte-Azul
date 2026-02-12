import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! ADVERTENCIA !!
    // Esto permite que el build termine aunque haya errores de tipos.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
