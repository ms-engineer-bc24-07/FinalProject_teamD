"use client";

import React, { useState } from "react";
import axios from "../../lib/axios";
import { getAuth } from "firebase/auth";

const InvitePage = () => {
  const [email, setEmail] = useState("");
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    try {
      // Firebaseから現在のユーザーを取得
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setMessage("ログインが必要です。");
        console.error("ユーザーがログインしていません");
        return;
      }

      // Firebaseトークンを取得
      const idToken = await user.getIdToken();
      console.log("取得したトークン:", idToken);

      // バックエンドに招待リクエストを送信
      const response = await axios.post(
        "http://localhost:8000/family/send_invite/",
        { email, groupName }, // 招待データ
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // トークンをヘッダーに含める
          },
        }
      );

      setMessage(`「${groupName}」グループへの招待メールを送信しました！`);
    } catch (error) {
      setMessage("エラーが発生しました。もう一度お試しください。");
      console.error("招待送信エラー:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">家族を招待</h1>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="グループ名を入力"
        className="mb-4 border p-2 w-full max-w-md"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレスを入力"
        className="mb-4 border p-2 w-full max-w-md"
      />
      <button
        onClick={handleInvite}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full max-w-md"
      >
        招待を送信
      </button>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
};

export default InvitePage;
