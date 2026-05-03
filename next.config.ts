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
  // Configuración para que Docker detecte cambios de archivos
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 800, // Revisa cambios cada 800ms
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
