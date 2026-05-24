import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker support: standalone output
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },

  // Expressive caching headers for static assets
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Prevent Prisma from being bundled in Edge runtime
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
};

export default nextConfig;

