"use client";

import React, { useState } from "react";
import axios from "../../lib/axios";
import { getAuth } from "firebase/auth";

const InvitePage = () => {
  const [groupName, setGroupName] = useState("");
  const [inviteLink, setInviteLink] = useState(""); // 招待リンクを保存するステート
  const [message, setMessage] = useState("");

  const handleGenerateLink = async () => {
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

      // バックエンドにリンク生成リクエストを送信
      const response = await axios.post(
        "http://localhost:8000/family/generate_invite_link/",
        { groupName }, // 必要なデータ
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // トークンをヘッダーに含める
          },
        }
      );

      // 招待リンクをステートに保存
      const { inviteLink } = response.data;
      setInviteLink(inviteLink);
      setMessage(`「${groupName}」グループの招待リンクを生成しました！`);
    } catch (error) {
      setMessage("エラーが発生しました。もう一度お試しください。");
      console.error("リンク生成エラー:", error);
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
      <button
        onClick={handleGenerateLink}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full max-w-md"
      >
        メンバーを招待する
      </button>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
      {inviteLink && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow">
          <p className="text-gray-800">以下のリンクをコピーして共有してください:</p>
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="w-full mt-2 p-2 border"
            onClick={(e) => {
              navigator.clipboard.writeText(inviteLink);
              alert("リンクをコピーしました！");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default InvitePage;
