import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  serverExternalPackages: ["@woocommerce/woocommerce-rest-api"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.webdev.is",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.webdev.is",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tactica.is",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
