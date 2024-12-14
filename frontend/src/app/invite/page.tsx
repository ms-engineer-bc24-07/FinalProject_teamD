"use client";

import React, { useState } from "react";
import axios from "../../lib/axios"; // 設定済みのaxiosをインポート

const InvitePage = () => {
  const [email, setEmail] = useState("");
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    try {
      // 認証情報を含めてリクエストを送信
      await axios.post(
        "http://localhost:8000/family/send_invite/",
        { email, groupName },
        { withCredentials: true } // Cookieを送信,認証情報を含める
      );
      setMessage(`「${groupName}」グループへの招待メールを送信しました！`);
    } catch (error) {
      setMessage("エラーが発生しました。もう一度お試しください。");
      console.error(error);
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
