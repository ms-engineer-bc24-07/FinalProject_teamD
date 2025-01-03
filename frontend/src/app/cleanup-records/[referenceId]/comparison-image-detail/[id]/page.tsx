"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";  // Next.js 13 app router
import axios from "../../../../../lib/axios";
import Image from "next/image";  // Next.jsのImageコンポーネント
import { useRouter } from "next/navigation";  // next/navigationのuseRouterを使用
import CustomButton from "../../../../../components/CustomButton";

// 日付をYYYY-MM-DDの形式に変換するヘルパー関数
const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Date(date).toLocaleDateString('ja-JP', options); // 日本語フォーマット (yyyy-mm-dd)
  return formattedDate;
};

const ComparisonImageDetailPage = () => {
  const { referenceId, id } = useParams();  // referenceIdとimageIdをURLパラメータとして取得
  const [image, setImage] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/comparison-images/${id}/`) // imageIdでリクエスト
        .then((response) => setImage(response.data))
        .catch((error) => {
          console.error("Error fetching comparison image details:", error);
        });
    }
  }, [id]);

  if (!image) return <div>Loading...</div>;

  return (
    <div className="flex-grow p-5 text-center">
      {/* タイトルと戻るボタンを配置 */}
      <div className="relative mb-6">
        {/* タイトル */}
        <h1 className="text-2xl font-bold text-customBlue text-center">
          片付け記録の詳細
        </h1>
      </div>

      <div className="mb-4">
        <h2 className="text-xl text-customBlue">{image.user_name}</h2> {/* ユーザー名 */}
        <p className="text-sm text-gray-500">{formatDate(image.uploaded_at)}</p> {/* 日付表示 */}
        <div className="mt-4">
          <Image
            src={image.image_url}  // 比較画像
            alt="Comparison Image"
            width={500}
            height={300}
            className="rounded-md"
          />
        </div>
      </div>

      {/* 追加情報として説明があれば表示 */}
      {image.record_description && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-customBlue">記録の説明</h3>
          <p className="text-gray-600">{image.record_description}</p>
        </div>
      )}

        {/* ホームに戻るボタン */}
      <div className="mt-6 flex justify-center">
        <CustomButton text="記録一覧に戻る" onClick={() => window.history.back()} />
      </div>

        {/* ホームに戻るボタン */}
      <div className="mt-6 flex justify-center">
        <CustomButton text="ホームに戻る" onClick={() => router.push("/")} />
      </div>
    </div>
  );
};

export default ComparisonImageDetailPage;
