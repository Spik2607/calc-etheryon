/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Configuration existante
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      },
      exclude: /node_modules/,
    });

    // Ajout de la résolution pour ajv
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        '@jv': 'ajv'
      }
    };

    return config;
  },
}

module.exports = nextConfig
