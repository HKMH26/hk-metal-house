import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'piijypvyzivzxiafsxnz.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/infrastructure',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
