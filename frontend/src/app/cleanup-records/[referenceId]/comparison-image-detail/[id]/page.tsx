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
        .get(`/api/comparison-images/${id}/`) // imageIdでリクエスト
        .then((response) => setImage(response.data))
        .catch((error) => {
          console.error("Error fetching comparison image details:", error);
        });
    }
  }, [id]);

  if (!image) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-bold text-customBlue text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-grow p-5 text-center">
      <div className="mt-8 mb-4">
        {/* ユーザー名と日付を横並びに */}
        <div className="flex items-center justify-between">
            <h2 className="text-xl text-customBlue">{image.user_name}</h2> {/* ユーザー名 */}
            <p className="text-sm text-gray-500 ml-4">{formatDate(image.uploaded_at)}</p> {/* 日付表示 */}
        </div>
        
         {/* 画像表示 */}
          <Image
            src={image.image_url}  // 比較画像
            alt="Comparison Image"
            width={300}
            height={300}
            className="mt-4 w-full h-64 object-cover rounded-md"
          />
       
      </div>

      {/* 追加情報として説明があれば表示 */}
      {image.record_description && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-customBlue">記録の説明</h3>
          <p className="text-gray-600">{image.record_description}</p>
        </div>
      )}

        {/* 前のページに戻るボタン */}
      <div className="mt-8 flex justify-center">
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
