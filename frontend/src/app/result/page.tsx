'use client'

import CustomButton from "@/components/CustomButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Analysis() {
  const router = useRouter();
  const storedScore = parseFloat(localStorage.getItem("score") || "0");
  const [state, setState] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log(storedScore)
    if (storedScore) {
      const [newState, newMessage] = storedScore >= 0.9
        ? ["お片付けの達人！", "部屋がキラキラ！今日も最高の片付けマスター！"]
        : storedScore >= 0.8
        ? ["一歩手前！", "片付けの天才、まもなく誕生！あなたの努力、輝いてるよ！"]
        : ["まだ道半ば！", "片付けは旅。小さな一歩が、大きな変化の始まり！"];
    
      setState(newState);
      setMessage(newMessage);
    }
  }, []);
  
  return (
    <div className="bg-[url('/back-img/clean-room.jpg')] flex-grow bg-cover bg-center">
      <img src="/back-img/spankle.png" alt="" className="w-[250px] mx-auto"/>
      <div className="bg-white rounded-lg p-4 mx-10">
        <p className="text-center text-lg font-semibold text-[#DAA520]">{state}</p>
        <p className="text-center text-lg font-semibold text-[#DAA520]">
          {message}
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