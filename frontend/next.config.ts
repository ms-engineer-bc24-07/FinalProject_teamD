import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'teamd-finalproject.s3.ap-northeast-1.amazonaws.com',
        pathname: '/references/**', // 画像のパスパターンを references フォルダに合わせる
      },
      {
        protocol: 'https',
        hostname: 'teamd-finalproject.s3.ap-northeast-1.amazonaws.com',
        pathname: '/comparison_images/**', // 比較用画像のパスパターン
      },
    ],
  },
};

export default nextConfig;
