import type { NextConfig } from "next";

// 

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'teamd-finalproject.s3.ap-northeast-1.amazonaws.com',
        pathname: '/images/**', // 画像のパスパターン
      },
    ],
  },
};

export default nextConfig;
