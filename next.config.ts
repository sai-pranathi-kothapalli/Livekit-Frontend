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
  // Ensure dynamic routes work
  experimental: {
    // This ensures dynamic routes are server-rendered
  },
};

export default nextConfig;
