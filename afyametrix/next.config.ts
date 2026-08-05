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
  
  // Ensure proper build output for Netlify
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  },
};

export default nextConfig;
