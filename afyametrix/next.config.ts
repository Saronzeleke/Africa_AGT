import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  reactStrictMode: true,
  
  // Image optimization
  images: {
    unoptimized: true,
  },

  // Compression
  compress: true,
  
  // Disable telemetry
  productionBrowserSourceMaps: false,
  
  // Netlify deployment configuration
  trailingSlash: false,
  
  // External packages for serverless functions
  serverExternalPackages: ['sharp'],
};

export default nextConfig;
