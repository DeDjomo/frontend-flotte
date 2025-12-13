import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9080/api/:path*',
      },
    ];
  },
  turbopack : {},
};

export default nextConfig;
