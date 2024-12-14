"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // next/navigation の useRouter をインポート
import { FaCamera } from "react-icons/fa"; // カメラアイコンをインポート
import Image from "next/image"; // Next.jsのImageコンポーネントをインポート
import { auth } from "../lib/firebase"; // Firebaseの初期化設定をインポート
import { onAuthStateChanged } from "firebase/auth"; // Firebaseの認証状態を確認する
import ToppageButton from "../components/ToppageButton";
import axios from "axios"; // axiosをインポート

const Page = () => {
  const [userName, setUserName] = useState<string>("ゲスト");
  const [userIcon, setUserIcon] = useState<string>("/icons/icon-1.png");
  const [references, setReferences] = useState<any[]>([]); // references を保存するためのステート

  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // Firebaseの認証状態を監視
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // ログイン状態の場合、ユーザー情報を取得
          fetchUser(user);
        } else {
          // ログインしていない場合はログインページにリダイレクト
          router.push("/auth/login");
        }
      });
      return unsubscribe; // クリーンアップ
    };

    const fetchUser = async (user: any) => {
      try {
        const email = user.email;
        const token = await user.getIdToken(); // Firebaseトークンを取得

        const response = await axios.post(
          "http://localhost:8000/api/users/get_user/",
          { email },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          setUserName(data.user_name); // ユーザー名を更新
        } else {
          console.error("ユーザー情報の取得に失敗しました。");
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    };

    const fetchReferences = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/references/"
        );
        if (response.status === 200) {
          setReferences(response.data); // 取得したreferencesをstateに保存
        }
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    };

    const unsubscribe = checkAuth();
    fetchReferences();

    return () => unsubscribe(); // コンポーネントがアンマウントされたら監視を停止
  }, [router]);

  // `references` のidに基づいて、ページボタンを作成
  const getReferenceButton = (id: number) => {
    const reference = references.find((ref) => ref.id === id);

    if (reference) {
      return (
        <ToppageButton
          key={reference.id}
          text={reference.reference_name}
          onClick={() => router.push(`/reference/${reference.id}`)} // 動的に遷移
        />
      );
    } else {
      return (
        <ToppageButton
          key={`no-reference-${id}`}
          icon={<FaCamera className="text-customBlue text-4xl" />}
          onClick={() => router.push(`/register-reference/${id}`)} // 参考写真がない場合、カメラアイコンを表示
        />
      );
    }
  };

  // ボタンが常に4つ表示されるように、足りない分は見本写真登録ボタンを追加
  const buttonCount = 4;
  const buttons = [];
  for (let i = 1; i <= buttonCount; i++) {
    buttons.push(getReferenceButton(i));
  }

  return (
    <div className="flex-grow p-5 text-center">
      {/* 上部のユーザー情報 */}
      <div className="flex justify-between items-center p-6">
        <div className="text-lg font-bold text-customBlue">{userName}さん</div>
        <div className="w-25 h-25">
          <Image
            src={userIcon || "/icons/icon-1.png"}
            alt={`${userName}のアイコン`}
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-grow p-5 text-center">
        <div className="grid grid-cols-2 gap-10 mt-4">
          {/* 動的にボタンを表示 */}
          {buttons}
        </div>
      </div>
    </div>
  );
};

export default Page;
