/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.r2.cloudflarestorage.com',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'pub-5455939b5dbd4440926991f99d9574ba.r2.dev',
      pathname: '/**',
    },
  ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
};

export default nextConfig;
