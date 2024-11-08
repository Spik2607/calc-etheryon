/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/calc-etheryon',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
