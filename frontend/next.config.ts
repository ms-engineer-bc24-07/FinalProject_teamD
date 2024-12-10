import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    //domains: ['teamd-finalproject.s3.ap-northeast-1.amazonaws.com'], // 画像を読み込むドメインを指定
    domains: ["s3.ap-northeast-1.amazonaws.com"]
  },
};

export default nextConfig;
