import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* API proxy — forward /api/* to the Railway backend */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
