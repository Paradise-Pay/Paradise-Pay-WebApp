import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript and ESLint configurations
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Transpile required packages
  transpilePackages: [
    '@mui/material',
    '@emotion/react',
    '@emotion/styled'
  ],

  // Experimental features
  experimental: {
    optimizeCss: true
  }
};

export default nextConfig;