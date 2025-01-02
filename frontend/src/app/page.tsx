"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // next/navigation の useRouter をインポート
import { FaCamera } from "react-icons/fa"; // カメラアイコンをインポート
import Image from "next/image"; // Next.jsのImageコンポーネントをインポート
import { auth } from "../lib/firebase"; // Firebaseの初期化設定をインポート
import { onAuthStateChanged } from "firebase/auth"; // Firebaseの認証状態を確認する
import ToppageButton from "../components/ToppageButton";
import axios from "../lib/axios"; // axiosをインポート

const Page = () => {
  const [userName, setUserName] = useState<string>("ゲスト");
  const [userIcon, setUserIcon] = useState<string | null>(null); //初期値をnull に
  const [references, setReferences] = useState<any[]>([]); // references を保存するためのステート

  const router = useRouter();

  const fetchReferences = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/references/fetch_references/"
      );
      if (response.status === 200) {
        console.log("Fetched References:", response.data); // デバッグ用
        setReferences(response.data); // 取得したreferencesをstateに保存
      }
    } catch (error) {
      console.error("Error fetching references:", error);
    }
  };

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
          setUserIcon(data.icon_url || null); // ユーザーアイコンを更新
        } else {
          console.error("ユーザー情報の取得に失敗しました。");
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    };

    const unsubscribe = checkAuth();
    fetchReferences();

    return () => unsubscribe(); // コンポーネントがアンマウントされたら監視を停止
  }, [router]);

  // **デバッグ用: referencesのステート監視**
  useEffect(() => {
    console.log("Current References State:", references); // referencesの内容をコンソールに出力
  }, [references]); // referencesが更新されるたびに実行


  //ここで問題が発生した（getReferenceButtonのロジックが意図した動作をしていない）
  // `references` のidに基づいて、ページボタンを作成
  const getReferenceButton = (reference: any | null, id: number) => {
    if (reference) {
      // 見本写真が登録済みの場合
      return (
        <ToppageButton
          key={reference.id}
          text={reference.reference_name}
          onClick={() => router.push(`/reference/${reference.id}`)}
        />
      );
    } else {
      // 見本写真が未登録の場合
      return (
        <ToppageButton
          key={`no-reference-${id}`}
          icon={<FaCamera className="text-customBlue text-4xl" />}
          onClick={() => router.push(`/SampleRegistration`)}
        />
      );
    }
  };

  // ボタンが常に4つ表示されるように、足りない分は見本写真登録ボタンを追加
  const buttons = [];
  for (let i = 0; i < 4; i++) {
    // referencesの中からi番目の見本写真を取得
    const reference = references[i] || null;
    buttons.push(getReferenceButton(reference, i + 1)); // IDは1から始まると仮定
  }

  return (
    <div className="flex-grow p-5 text-center">
      {/* 上部のユーザー情報 */}
      <div className="flex justify-between items-center p-6">
        <div className="ml-8 text-3xl font-extrabold text-customBlue">{userName}</div>
        <div className="w-25 h-25">
        {userIcon ? (
          <Image
            src={userIcon}
            alt={`${userName}のアイコン`}
            width={100}
            height={100}
            className="rounded-full border-4 border-customBlue"
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full border border-customBlue flex items-center justify-center bg-gray-100"
            title="アイコン未設定"
          >
            <span className="text-customBlue text-sm">No Icon</span>
          </div>
        )}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-grow p-5 text-center">
        <div className="grid grid-cols-2 gap-10 mt-4 ">
          {/* 動的にボタンを表示 */}
          {buttons}
        </div>
      </div>
    </div>
  );
};

export default Page;
