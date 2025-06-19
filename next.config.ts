// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Remove experimental.appDir entirely
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'swgktreakvccjrwpuiar.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/photos/**',
      },
    ],
  },
};

export default nextConfig;
