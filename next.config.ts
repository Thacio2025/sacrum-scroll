import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.metmuseum.org" },
      { protocol: "https", hostname: "www.metmuseum.org" },
      { protocol: "https", hostname: "artic.edu" },
      { protocol: "https", hostname: "www.artic.edu" },
    ],
  },
};

export default nextConfig;
