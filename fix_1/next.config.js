/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure images are handled correctly
  images: {
    domains: ['localhost', 'vercel.app'],
  },
  // Force trailing slashes to ensure consistent routing
  trailingSlash: true,
  // Ensure CSS modules work correctly
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
}

module.exports = nextConfig

