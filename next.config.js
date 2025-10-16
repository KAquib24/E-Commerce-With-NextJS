/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      // Add other image domains you use here
      'example.com',
      'another-domain.com'
    ],
    // Or use remotePatterns for more control (recommended)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      // Add other domains as needed
    ],
  },
}


// const withNextIntl = require('next-intl/plugin')();

module.exports = nextConfig