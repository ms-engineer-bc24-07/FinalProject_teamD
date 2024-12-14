"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const InviteAcceptPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    // トークンの検証
    const validateToken = async () => {
      try {
        const response = await axios.post("/api/accept_invite/", { token });
        if (response.status === 200) {
          setMessage("トークンが有効です。登録を進めてください。");
        }
      } catch (error) {
        setMessage("無効なトークンです。");
      }
    };
    validateToken();
  }, [token]);

  const handleRegister = async () => {
    try {
      await axios.post("/api/register/", { userName, password });
      setMessage("登録が完了しました！");
    } catch (error) {
      setMessage("登録に失敗しました。");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">招待を受け入れる</h1>
      {message && <p className="mb-4 text-gray-700">{message}</p>}
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
