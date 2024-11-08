/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',  // Crucial pour GitHub Pages
  basePath: '/calc-etheryon', // Le nom de votre repo
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
