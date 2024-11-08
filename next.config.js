/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'export',  // Nécessaire pour GitHub Pages
  basePath: '/calc-etheryon', // Nécessaire pour GitHub Pages
  images: {
    unoptimized: true, // Nécessaire pour l'export statique
  },
  webpack: (config, { dev, isServer }) => {
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
