import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Allow production builds to complete even with ESLint warnings
    // Only fail on actual errors, not warnings
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Allow production builds to complete even with TypeScript errors
    ignoreBuildErrors: false,
  },
  // Ensure we're using App Router, not static export
  output: undefined, // Explicitly not setting output: 'export'
  // Add headers to prevent caching of dynamic routes
  async headers() {
    return [
      {
        source: '/interview/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'X-Vercel-Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
