// Next.js configuration for MedCore - deploy test 2
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {},
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
