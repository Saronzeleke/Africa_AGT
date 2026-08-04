import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  reactStrictMode: true,
  
  // Removed static export for middleware support
  // output: 'export', // This breaks middleware
  // trailingSlash: true,
  
  // Image optimization
  images: {
    unoptimized: true,
  },

  // Compression
  compress: true,
  
  // Disable telemetry
  productionBrowserSourceMaps: false,
};

export default nextConfig;
