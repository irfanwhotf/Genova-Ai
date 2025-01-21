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
  },
}

module.exports = nextConfig
