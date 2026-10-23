import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return ["/admin/:path*", "/booking/manage/:path*", "/api/:path*"].map(source => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet" }],
    }));
  },
};

export default nextConfig;
