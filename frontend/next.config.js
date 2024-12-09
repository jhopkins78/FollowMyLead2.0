/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true,
  },
  // Ensure images are handled correctly
  images: {
    domains: ['localhost', 'vercel.app'],
  },
  // Force trailing slashes to ensure consistent routing
  trailingSlash: true,
  // Ensure CSS modules work correctly
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src')
    }
    return config;
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
