"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  // next/navigationのuseRouterを使用
import { useParams } from "next/navigation";  // next/navigationからuseParamsをインポート
import axios from "../../../lib/axios";
import Image from "next/image"; // Next.jsのImageコンポーネントをインポート
import CustomButton from "../../../components/CustomButton";
import Link from "next/link";

const ReferencePage = () => {
  const { id } = useParams();  // useParamsでURLパラメータを取得
  const router = useRouter();
  const [reference, setReference] = useState<any>(null);

  // referenceIdが変更されるたびにデータを取得
  useEffect(() => {
    if (id) {
      axios
        .get(`/api/references/${id}`)
        .then((response) => setReference(response.data))
        .catch((error) => {
          console.error("Error fetching reference:", error);
        });
    }
  }, [id]);

  if (!reference) 
    return (
      <div id="progressbar">
        <span id="loading"></span>
        <div id="load">loading</div>
      </div>
    );

  return (
      <div className="flex-grow p-5 text-center">
        {/* タイトル */}
      <div className="relative mt-6 mb-6">
          {/* タイトル */}
          <h1 className="text-2xl font-bold text-customBlue text-center">
            {reference.reference_name}
          </h1>
        </div>
        
        {/* 画像表示 */}
        <Image
          src={reference.image_url}  // S3のURLをそのまま渡します
          alt="Reference Image"
          width={300}  // 必要なサイズに設定
          height={300} // 必要なサイズに設定
          className="mt-4 w-full h-64 object-cover rounded-md"
        />
      
    
      <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto mt-8">
      
        {/* 記録を見るボタン */}
        <CustomButton
          text="記録をみる"
          onClick={() => router.push(`/cleanup-records/list/${id}`)}
        />

        {/* 片付けボタン */}
        <CustomButton
          text="片付ける"
          onClick={() => router.push(`/cleanup/${id}`)}
        />

        {/* ホームページに戻るボタン */}
        <Link href="/">
          <CustomButton
            text="ホームに戻る"
          />
        </Link>
      </div>
    </div>
  );
};

export default ReferencePage;

