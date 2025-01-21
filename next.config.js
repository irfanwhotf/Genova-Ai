/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.shapes.inc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'files.shapes.inc',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  output: 'standalone',
  distDir: '.next',
  // Cloudflare Pages specific configuration
  experimental: {
    isrMemoryCacheSize: 0,
    serverActions: true,
  },
}

module.exports = nextConfig
