/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images-api.printify.com',
        pathname: '/mockup/**',
      },
    ],
  },
};

module.exports = nextConfig;
