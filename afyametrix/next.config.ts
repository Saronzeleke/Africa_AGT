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
  
  // External packages configuration for Next.js 14.x
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  },
};

export default nextConfig;
