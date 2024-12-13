// /app/cleanup-records/list/[referenceId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";  // Next.js 13 app router
import axios from "axios";

const ComparisonImageListPage = () => {
  const { referenceId } = useParams();  // URLパラメータを取得
  const [comparisonImages, setComparisonImages] = useState<any[]>([]);

  useEffect(() => {
    if (referenceId) {
      console.log('Fetching comparison images for referenceId:', referenceId); 
      axios
        .get(`http://localhost:8000/api/comparison-images/?reference${referenceId}`)
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">片付け記録</h1>
      {comparisonImages.length === 0 ? (
        <p>記録がありません。</p>
      ) : (
        comparisonImages.map((image) => (
          <div key={image.id} className="mb-4">
            <p className="text-lg font-semibold">{image.user}</p>
            <p className="text-sm text-gray-500">{image.uploaded_at}</p>
            <button
              onClick={() => window.location.href = `/cleanup-records/${referenceId}/comparison-image-detail/${image.id}`} // 詳細ページへ遷移
              className="text-blue-500 underline"
            >
              詳細を見る
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ComparisonImageListPage;