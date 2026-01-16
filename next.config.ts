import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withPWAInit from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizePackageImports: [
      '@react-three/drei',
      '@react-three/fiber',
      'lucide-react',
      'framer-motion',
      'three'
    ],
    optimizeCss: true,
    webpackBuildWorker: true,
  },
  productionBrowserSourceMaps: false, // Disable source maps for faster builds
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /.*\.(?:glb|gltf|bin|draco)/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'vertex-3d-assets',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|webp)/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'vertex-image-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
  ],
});

// Sentry should be the outermost wrapper for best error tracking
const sentryOptions = {
  silent: true,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
};

// Initialize Bundle Analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withSentryConfig(withBundleAnalyzer(withPWA(nextConfig)), sentryOptions);
