import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3-cmc.travel.com.vn',
        pathname: '/vtv-image/**',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  // Disable ESLint during build to avoid blocking deployment
  // You can run lint separately: yarn lint
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build (optional, only if needed)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

