'use client'

import CustomButton from "@/components/CustomButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Analysis() {
  const router = useRouter();
  const state = useState<string | null>(null);
  const message = useState<string | null>(null);

  useEffect(() => {
    // axios.post('http://localhost:8000/api/score/')
    //   .then(response => {
    //     console.log("OK", response.data);
    //   })
    //   .catch(error => {
    //     console.error("エラー発生", error);
    //   });
  }, []);
  
  return (
    <div className="bg-[url('/back-img/clean-room.jpg')] flex-grow bg-cover bg-center">
      <img src="/back-img/spankle.png" alt="" className="w-[250px] mx-auto"/>
      <div className="bg-white rounded-lg p-4 mx-10">
        <p className="text-center text-lg font-semibold text-[#DAA520]">お片付けの達人！</p>
        <p className="text-center text-lg font-semibold text-[#DAA520]">
          部屋がキラキラ！今日も最高の片付けマスター！
        </p>
      </div>
      <div className="flex flex-col mt-6 items-center">
        <CustomButton
          text="知らせる"
          onClick={() => {}}
          className="mb-2"
        />
        <CustomButton
          text="閉じる"
          onClick={() => router.push(`/`)}
          className="mb-2"
        />
      </div>
    </div>
  )
}