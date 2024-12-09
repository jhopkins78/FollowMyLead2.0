/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: 'dist',
  // Specify the source directory
  experimental: {
    typedRoutes: true,
  },
  // Configure path aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '/frontend/src'
    }
    return config
  }
}

module.exports = nextConfig
