import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript and ESLint configurations
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/icons-material"]
  }
};

export default nextConfig;