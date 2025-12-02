import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'hehnlzqzvhpsaxtlgiir.supabase.co', // Tu proyecto de supabase
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Tus imagenes de Supabase
      },
      {
        protocol: 'https',
        hostname: '**.comfydeploy.com', // Las imagenes que vienen de la API
      },
      {
         protocol: 'https',
         hostname: 'r2.comfydeploy.com', // A veces usan R2
      }
    ],
  },
};

export default nextConfig;