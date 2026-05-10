import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'egjaadvetpdgekkjvryc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  turbopack: {
    root: "C:\\Users\\TLab-N087\\Documents\\SpecDrivenDevelopment\\esk-platform",
  },
};

export default nextConfig;
