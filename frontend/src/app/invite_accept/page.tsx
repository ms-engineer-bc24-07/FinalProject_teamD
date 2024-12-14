"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "../../lib/axios";

const InviteAcceptPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [groupName, setGroupName] = useState(""); // グループ名を追加
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    // トークンの検証
    const validateToken = async () => {
      try {
        const response = await axios.post("http://localhost:8000/family/validate_invite/", { token });
        if (response.status === 200) {
          setGroupName(response.data.groupName); // グループ名を取得
          setMessage("トークンが有効です。登録を進めてください。");
        }
      } catch (error) {
        setMessage("無効なトークンです。もう一度ご確認ください。");
        console.error(error);
      }
    };
    validateToken();
  }, [token]);

  const handleRegister = async () => {
    try {
      // 招待を受け入れ、登録処理を実行
      await axios.post("http://localhost:8000/family/accept_invite/", { userName, password, token });
      setMessage(`登録が完了しました！「${groupName}」グループに参加しました。`);
    } catch (error) {
      setMessage("登録に失敗しました。もう一度お試しください。");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">招待を受け入れる</h1>
      {message && <p className="mb-4 text-gray-700">{message}</p>}
      {groupName && <p className="mb-4 text-gray-700">グループ名: {groupName}</p>}
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="ユーザー名"
        className="mb-4 border p-2 w-full max-w-md"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード"
        className="mb-4 border p-2 w-full max-w-md"
      />
      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full max-w-md"
      >
        登録
      </button>
    </div>
  );
};

export default InviteAcceptPage;
