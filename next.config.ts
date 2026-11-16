import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ads.txt is hosted and kept current by Journey by Mediavine. Do not replace with a static copy.
  async redirects() {
    return [
      {
        source: "/ads.txt",
        destination: "https://adstxt.journeymv.com/sites/f494f2f2-ff08-4eff-ac21-b0b6c2d43c15/ads.txt",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "places.googleapis.com",
        pathname: "/v1/**",
      },
    ],
  },
};

export default nextConfig;
