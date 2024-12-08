"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

const Mypage = () => {
  const [userName, setUserName] = useState<string>("ゲスト");
  const [email, setEmail] = useState<string>("example@example.com");
  const [icon, setIcon] = useState<string>("/icons/icon-1.png");
  const [members, setMembers] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async (user: any) => {
      try {
        const idToken = await user.getIdToken();

        // バックエンドからユーザー情報を取得
        const response = await axios.post(
          "http://localhost:8000/api/users/get_user/",
          { email: user.email },
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        // レスポンスデータをステートに設定
        const data = response.data;
        setUserName(data.user_name);
        setEmail(data.email);
      } catch (error) {
        console.error("ユーザー情報の取得中にエラーが発生しました:", error);
      }
    };

    // Firebase Auth のログイン状態を監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        console.error("ログインしていません");
      }
    });

    return () => unsubscribe(); // コンポーネントがアンマウントされたら監視を停止
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">マイページ</h1>

      {/* ユーザー名 */}
    <div className="mb-4 w-full max-w-md">
      <div className="flex justify-between items-center">
        <label className="text-base font-medium text-gray-900">ユーザー名</label>
        <span className="text-base text-gray-800">{userName}</span>
      </div>
      <hr className="mt-2 border-gray-300" />
    </div>

      {/* メールアドレス */}
   <div className="mb-4 w-full max-w-md">
     <div className="flex justify-between items-center">
       <label className="text-base font-medium text-gray-900">メールアドレス</label>
        <span className="text-base text-gray-800">{email}</span>
     </div>
     <hr className="mt-2 border-gray-300" />
  </div>

      {/* メンバー */}
      <div className="mb-4 w-full max-w-md">
        <label className="block text-base font-medium text-gray-900">メンバー</label>
        <div className="mt-2">
          {members.length === 0 ? (
            <p className="text-gray-500">誰もいません</p>
          ) : (
            <ul className="list-disc pl-5">
              {members.map((member, index) => (
                <li key={index} className="text-gray-900">
                  {member}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 招待するボタン */}
      <Link href="/invite">
        <button className="mt-4 bg-customPink text-customBlue px-4 py-2 rounded w-full max-w-md">
          招待する
        </button>
      </Link>
      {/* ホームに戻るボタン */}
      <Link href="/">
        <button className="mt-4 bg-customPink text-customBlue px-4 py-2 rounded w-full max-w-md">
          戻る
        </button>
      </Link>
    </div>
  );
};

export default Mypage;
