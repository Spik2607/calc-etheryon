/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: true // Force l'utilisation de SWC au lieu de Babel
  },
  // Désactivons temporairement le lint lors du build pour isoler les problèmes de compilation
  eslint: {
    ignoreDuringBuilds: true
  },
  // Optimisations de build
  poweredByHeader: false,
  compress: true,
  // Configuration webpack minimale nécessaire
  webpack: (config, { dev, isServer }) => {
    // Gardons seulement la configuration essentielle
    if (!dev && !isServer) {
      // Optimisations pour la production
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            defaultVendors: false,
            default: false
          }
        }
      }
    }

    return config;
  }
}

module.exports = nextConfig
