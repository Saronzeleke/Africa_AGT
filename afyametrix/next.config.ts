import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  reactStrictMode: true,
  
  // Production output
  output: 'export',
  trailingSlash: true,
  
  // Image optimization for static export
  images: {
    unoptimized: true,
  },

  // Compression
  compress: true,
  
  // Disable telemetry
  productionBrowserSourceMaps: false,
};

export default nextConfig;
