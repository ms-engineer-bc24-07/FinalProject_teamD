"use client";

import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import axios from "../../lib/axios";
import CustomButton from "../../components/CustomButton"; // CustomButtonコンポーネントのインポート

const InvitePage = () => {
  const [inviteLink, setInviteLink] = useState(""); // 招待リンクを保存
  const [message, setMessage] = useState(""); // メッセージを表示
  const [loading, setLoading] = useState(false); // ローディング状態

  useEffect(() => {
    // ログインユーザーの情報を取得し、招待リンクを生成する
    const fetchInviteLink = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setMessage("ログインが必要です。");
        return;
      }

      try {
        setLoading(true);
        // Firebaseから現在のユーザーのトークンを取得
        const idToken = await user.getIdToken();
        console.log("取得したトークン:", idToken);

        // バックエンドにグループ情報取得のリクエストを送信
        const response = await axios.get(
          "http://localhost:8000/api/family/get_group_info/", // グループ情報を取得するエンドポイント
          {
            headers: {
              Authorization: `Bearer ${idToken}`, // トークンをヘッダーに追加
            },
          }
        );

        // レスポンスにグループ情報が含まれている場合、招待リンクを生成
        if (response.data.groupName) {
          setInviteLink(response.data.inviteLink);
          setMessage(`「${response.data.groupName}」のメンバーを招待しよう！`);
        } else {
          setMessage("まだグループが作成されていません。");
        }
      } catch (error) {
        setMessage("エラーが発生しました。もう一度お試しください。");
        console.error("エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInviteLink();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-2xl font-bold text-customBlue mb-4">家族を招待</h1>
      {loading ? (
        <p className="font-bold text-customBlue">読み込み中...</p>
      ) : (
        <>
          {message && <p className="mt-4 font-bold text-customBlue">{message}</p>}
          {inviteLink && (
            <div className="mypage-background mt-4 p-4 rounded shadow">
              <p className="font-bold text-customBlue">以下のリンクをコピーして共有してください:</p>
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="w-full mt-2 p-2 rounded bg-customBlue text-customYellow"
                onClick={(e) => {
                  navigator.clipboard.writeText(inviteLink);
                  alert("リンクをコピーしました！");
                }}
              />
            </div>
          )}

          {/* トップページに戻るボタン */}
          <div className="mt-6">
            <CustomButton text="ホームに戻る" onClick={() => (window.location.href = "/")} />
          </div>
        </>
      )}
    </div>
  );
};

export default InvitePage;
