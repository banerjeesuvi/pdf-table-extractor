import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //     };
  //   }
  //   return config;
  // },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
