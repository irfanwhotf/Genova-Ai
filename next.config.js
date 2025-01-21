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
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
}

module.exports = nextConfig
