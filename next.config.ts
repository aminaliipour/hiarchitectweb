import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['instagram.fcdg1-1.fna.fbcdn.net', 'instagram.fcgh10-1.fna.fbcdn.net'],
  },
};

export default nextConfig;
