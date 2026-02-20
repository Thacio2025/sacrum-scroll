import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/.well-known/assetlinks.json", destination: "/api/assetlinks" },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "image.pollinations.ai" },
      { protocol: "https", hostname: "images.metmuseum.org" },
    ],
  },
};

export default nextConfig;
