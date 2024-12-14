"use client";

import React, { useState } from "react";
import axios from "axios";

const InvitePage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    try {
      await axios.post("http://localhost:8000/users/send_invite/", { email });// 必要なデータを送信
      setMessage("招待メールを送信しました！");
    } catch (error) {
      setMessage("エラーが発生しました。");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">家族を招待</h1>
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
