"use client";

import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { useRouter } from "next/navigation";

const InvitePage = ({ params }: { params: { uid: string } }) => {
  const router = useRouter();
  const { uid } = params;

  const [username, setUsername] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleJoin = () => {
    if (username && selectedIcon) {
      const db = getDatabase();
      const membersRef = ref(db, `users/${uid}/members`);
      push(membersRef, { name: username, icon: selectedIcon });
      alert("メンバーとして参加しました！");
      router.push("/mypage");
    } else {
      alert("名前とアイコンを選択してください！");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">招待ページ</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            名前を入力:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            placeholder="名前を入力してください"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            アイコンを選択:
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className="cursor-pointer"
                onClick={() => setSelectedIcon(`/icons/icon-${num}.png`)}
              >
                <img
                  src={`/icons/icon-${num}.png`}
                  alt={`アイコン ${num}`}
                  className={`w-16 h-16 rounded-full border-2 ${
                    selectedIcon === `/icons/icon-${num}.png`
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleJoin}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          参加する
        </button>
      </div>
    </div>
  );
};

export default InvitePage;
