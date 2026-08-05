/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  reactStrictMode: true,
  
  // Image optimization (disable for static export compatibility)
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

  // TypeScript configuration
  typescript: {
    // Type checking happens in CI/CD pipeline
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Linting happens in CI/CD pipeline
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;