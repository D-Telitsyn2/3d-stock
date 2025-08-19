/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@repo/ui', '@repo/sdk'],
  images: {
    domains: ['images.clerk.dev'],
  },
};

module.exports = nextConfig;
