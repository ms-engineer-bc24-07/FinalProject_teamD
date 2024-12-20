"use client";

import React, { useState, useEffect } from "react";
import axios from "../../lib/axios";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image"; // Next.js の Image コンポーネント
import Link from "next/link";

const Mypage = () => {
  const [userName, setUserName] = useState<string>("ゲスト");
  const [email, setEmail] = useState<string>("example@example.com");
  const [icon, setIcon] = useState<string>("/icons/icon-1.png");
  const [isEditing, setIsEditing] = useState<boolean>(false); // 編集モード
  const [members, setMembers] = useState<string[]>([]); // メンバーリスト
  const [groupName, setGroupName] = useState<string>(""); // グループ名

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

        // グループ情報を取得
        const groupResponse = await axios.get(
          "http://localhost:8000/family/get_group_info/",
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        // グループ名とメンバーを設定
        setGroupName(groupResponse.data.groupName);
        setMembers(groupResponse.data.members);
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

  const handleIconSelect = (newIcon: string) => {
    setIcon(newIcon);
    setIsEditing(false); // 編集モードを終了
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">マイページ</h1>

      {/* アイコン表示 */}
      <div className="mb-4 w-full max-w-md">
        <div className="flex justify-between items-center">
          <label className="text-base font-medium text-gray-900">アイコン</label>
          <div className="flex items-center">
            <Image
              src={icon}
              alt="ユーザーアイコン"
              width={64}
              height={64}
              className="rounded-full border"
            />
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="ml-4 text-blue-500 underline"
            >
              編集
            </button>
          </div>
        </div>
        {isEditing && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => handleIconSelect(`/icons/icon-${num}.png`)}
                className={`border-2 rounded ${
                  icon === `/icons/icon-${num}.png`
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                <Image
                  src={`/icons/icon-${num}.png`}
                  alt={`アイコン ${num}`}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </button>
            ))}
          </div>
        )}
        <hr className="mt-2 border-gray-300" />
      </div>

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

      {/* グループ名 */}
      <div className="mb-4 w-full max-w-md">
        <div className="flex justify-between items-center">
          <label className="text-base font-medium text-gray-900">グループ名</label>
          <span className="text-base text-gray-800">{groupName}</span>
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
