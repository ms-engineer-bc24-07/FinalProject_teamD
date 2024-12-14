"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  // next/navigationのuseRouterを使用
import { useParams } from "next/navigation";  // next/navigationからuseParamsをインポート
import axios from "axios";
import Image from "next/image"; // Next.jsのImageコンポーネントをインポート
import CustomButton from "../../../components/CustomButton";

const ReferencePage = () => {
  const { id } = useParams();  // useParamsでURLパラメータを取得
  const router = useRouter();
  const [reference, setReference] = useState<any>(null);

  // referenceIdが変更されるたびにデータを取得
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/references/${id}`)
        .then((response) => setReference(response.data))
        .catch((error) => {
          console.error("Error fetching reference:", error);
        });
    }
  }, [id]);

  if (!reference) return <div>Loading...</div>;

  return (
      <div className="flex flex-col min-h-screen px-5 py-6">
        {/* ヘッダー部分 */}
      <div className="flex flex-col items-start justify-center mt-6"> 
        <h1 className="text-2xl font-bold text-customBlue">{reference.reference_name}</h1>
        <Image
          src={reference.image_url}  // S3のURLをそのまま渡します
          alt="Reference Image"
          width={300}  // 必要なサイズに設定
          height={300} // 必要なサイズに設定
          className="mt-4 w-full h-64 object-cover rounded-md"
        />
      </div>
    
      <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      
        {/* 記録を見るボタン */}
        <CustomButton
          text="記録をみる"
          onClick={() => router.push(`/cleanup-records/list/${id}`)}
        />

        {/* 片付けボタン */}
        <CustomButton
          text="片付け"
          onClick={() => router.push(`/cleanup/${id}`)}
        />
      </div>
    </div>
  );
};

export default ReferencePage;

