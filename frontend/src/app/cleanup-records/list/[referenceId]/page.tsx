"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";  // Next.js 13 app router
import axios from "../../../../lib/axios";
import Link from "next/link";
import CustomButton from "../../../../components/CustomButton";

// 日付をYYYY-MM-DDの形式に変換するヘルパー関数
const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Date(date).toLocaleDateString('ja-JP', options); // 日本語フォーマット (yyyy-mm-dd)
  return formattedDate;
};

const ComparisonImageListPage = () => {
  const { referenceId } = useParams();  // URLパラメータを取得
  const [comparisonImages, setComparisonImages] = useState<any[]>([]);

  useEffect(() => {
    if (referenceId) {
      console.log('Fetching comparison images for referenceId:', referenceId); 
      axios
        .get(`http://localhost:8000/api/comparison-images/?reference=${referenceId}`)
        .then((response) => {
          console.log('Comparison images data:', response.data);  // レスポンスの確認
          setComparisonImages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching comparison images:", error);
        });
    }
  }, [referenceId]);

  return (
    <div className="flex-grow p-5 text-center">
    {/* タイトルと戻るボタンを配置 */}
    <div className="relative mb-6">
      {/* タイトル */}
      <h1 className="text-2xl font-bold text-customBlue text-center">
        片付け記録
      </h1>
    </div>

    {/* 記録の表示セクション */}
    <div className="mypage-background p-5 rounded-md h-80 overflow-y-auto">
      {comparisonImages.length === 0 ? (
        // 記録がない場合
        <p className="text-center text-gray-500">記録がありません。</p>
      ) : (
        // 記録がある場合はリスト形式で表示
        <div className="space-y-4">
          {comparisonImages.map((image) => (
            <div
              key={image.id}
              className="p-4 border-b-2 border-dashed border-customBlue flex justify-between items-center gap-4"
            >
              {/* 左側にユーザー名と日付を表示 */}
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-customBlue">
                  {image.user_name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(image.uploaded_at)}
                </p>
              </div>

              {/* 右側に詳細ページへのボタン */}
              <button
                onClick={() =>
                  (window.location.href = `/cleanup-records/${referenceId}/comparison-image-detail/${image.id}`)
                }
                className="button_solid012 button_solid012--small"
              >
                詳細を見る
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* ホームに戻るボタンを追加 */}
    <div className="mt-8">
    <Link href="/">
        <CustomButton
          text="ホームに戻る"
        />
      </Link>
    </div>
  </div>
);
  
};

export default ComparisonImageListPage;
