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
};

export default nextConfig;
