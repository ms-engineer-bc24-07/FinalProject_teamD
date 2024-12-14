"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCamera } from "react-icons/fa"; // カメラアイコンをインポート
import Image from "next/image"; // Next.jsのImageコンポーネントをインポート
import { auth } from "../lib/firebase"; // Firebaseの初期化設定をインポート
import ToppageButton from "../components/ToppageButton";
import axios from "../lib/axios"; // axiosをインポート

const Page = () => {
  const [userName, setUserName] = useState<string>("ゲスト");
  const [userIcon, setUserIcon] = useState<string>("/icons/icon-1.png");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Firebaseから現在のユーザーを取得
        const user = auth.currentUser;
        if (user) {
          const email = user.email;
          const token = await user.getIdToken(); // Firebaseトークンを取得

          // バックエンドからユーザー情報を取得
          const response = await axios.post(
            "http://localhost:8000/api/users/get_user/",
            { email }, // リクエストボディにメールアドレスを送信
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Firebaseトークンを送信
              },
            }
          );

          if (response.status === 200) {
            const data = response.data;
            setUserName(data.user_name); // ユーザー名を更新
          } else {
            console.error("ユーザー情報の取得に失敗しました。");
          }
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 上部のユーザー情報 */}
      <div className="flex justify-between items-center p-6">
        {/* 左側: ユーザー名 */}
        <div className="text-lg font-bold text-customBlue">
          {userName}さん
        </div>
        {/* 右側: ユーザーアイコン */}
        <div className="w-25 h-25">
          <Image
            src={userIcon || "/icons/icon-1.png"} // アイコンのパス
            alt={`${userName}のアイコン`}
            width={100} // アイコンの幅
            height={100} // アイコンの高さ
            className="rounded-full" // アイコンを丸く表示
          />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-grow p-5 text-center">
        {/* ボタンのコンテナ */}
        <div className="grid grid-cols-2 gap-10 mt-4">
          <Link href="/page1">
            <ToppageButton text="Page 1" />
          </Link>
          <Link href="/page2">
            <ToppageButton text="Page 2" />
          </Link>
          <Link href="/page3">
            <ToppageButton text="Page 3" />
          </Link>
          <Link href="/page4">
            <ToppageButton
              icon={<FaCamera className="text-customBlue text-4xl" />}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
