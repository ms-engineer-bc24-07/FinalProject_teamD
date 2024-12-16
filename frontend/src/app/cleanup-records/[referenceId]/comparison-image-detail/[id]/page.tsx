"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";  // Next.js 13 app router
import axios from "axios";
import Image from "next/image";  // Next.jsのImageコンポーネント

const ComparisonImageDetailPage = () => {
  const { referenceId, id } = useParams();  // referenceIdとimageIdをURLパラメータとして取得
  const [image, setImage] = useState<any>(null);

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">片付け記録の詳細</h1>

      <div className="mb-4">
        <h2 className="text-xl">{image.user}</h2>
        <p>{image.uploaded_at}</p>
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
          <h3 className="text-lg font-semibold">記録の説明</h3>
          <p>{image.record_description}</p>
        </div>
      )}
    </div>
  );
};

export default ComparisonImageDetailPage;
