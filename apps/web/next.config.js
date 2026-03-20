/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/sdk', '@repo/schema'],
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
