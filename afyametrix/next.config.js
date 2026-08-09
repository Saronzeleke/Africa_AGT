// /** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,                 // Hide Next.js version (security)
  compress: true,
  productionBrowserSourceMaps: false,

  // Images
  images: {
    unoptimized: true,                    // Keep this if you don't use next/image optimization
  },

  // TypeScript & ESLint
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
// const nextConfig = {
//   // Enable static export for Netlify
//   output: 'export',
  
//   // Production optimizations
//   reactStrictMode: true,
  
//   // Disable features not compatible with static export
//   images: {
//     unoptimized: true,
//   },

//   // Disable server-side features
//   compress: false,
  
//   // Disable telemetry
//   productionBrowserSourceMaps: false,
  
//   // Static export configuration
//   trailingSlash: false,

//   // TypeScript configuration
//   typescript: {
//     ignoreBuildErrors: false,
//   },

//   // ESLint configuration
//   eslint: {
//     ignoreDuringBuilds: false,
//   },

//   // Static asset optimization
//   assetPrefix: '',
//   basePath: '',
// };

// module.exports = nextConfig;