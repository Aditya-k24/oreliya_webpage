import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance optimizations
  poweredByHeader: false,

  compress: true,

  // Fix workspace root detection for Vercel
  outputFileTracingRoot: process.env.VERCEL ? undefined : '/Users/apple/Desktop/Oreliya/oreliya_webpage',

  // Disable ESLint and TypeScript during build for production deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zsexkmraqccjxtwsksao.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
    ],
    unoptimized: false,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // External packages for server components
  serverExternalPackages: ['@prisma/client'],

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['next-auth'],
    webpackBuildWorker: true,
  },

  // Production environment variables are handled by Next.js automatically

  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Production optimizations
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }

    // Fix for Next.js 15.5.3 chunk loading issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Fix for source-map module issue on Vercel
    config.resolve.alias = {
      ...config.resolve.alias,
      'source-map': require.resolve('source-map'),
    };

    return config;
  },
};

export default nextConfig;
