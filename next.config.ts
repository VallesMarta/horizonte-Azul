import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Añadimos esto para que Next 16 no se queje del motor
  turbopack: {},
};

export default nextConfig;
