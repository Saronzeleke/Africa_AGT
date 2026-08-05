/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Netlify
  output: 'export',
  
  // Production optimizations
  reactStrictMode: true,
  
  // Disable features not compatible with static export
  images: {
    unoptimized: true,
  },

  // Disable server-side features
  compress: false,
  
  // Disable telemetry
  productionBrowserSourceMaps: false,
  
  // Static export configuration
  trailingSlash: false,

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Static asset optimization
  assetPrefix: '',
  basePath: '',
};

module.exports = nextConfig;