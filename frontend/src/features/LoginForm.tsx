
"use client";

import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation"; // Next.js のルーター
import { auth } from "../lib/firebase"; // Firebase の設定と初期化をインポート
import axios from "axios"; // axiosインポート

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [groupInfo, setGroupInfo] = useState<any>(null); // グループ情報を保持するステート
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を追跡
  const router = useRouter();

// Firebase認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          // Firebaseトークンを取得
          const idToken = await user.getIdToken();
          const response = await axios.get(
            "http://localhost:8000/api/family/get_group_info/", // グループ情報を取得するエンドポイント
            {
              headers: {
                Authorization: `Bearer ${idToken}`, // Firebase トークンを設定
              },
            }
          );
          setGroupInfo(response.data); // グループ情報をステートに保存
        } catch (err) {
          console.error("グループ情報の取得に失敗しました:", err);
        }
      } else {
        setIsLoggedIn(false);
      }
    });

  // クリーンアップ関数を返す
   return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      // Firebase Authenticationでログイン
      await signInWithEmailAndPassword(auth, email, password);
      alert("ログイン成功しました！");

      // // ログイン後にグループ情報を取得
      // const idToken = await auth.currentUser?.getIdToken();
      // if (idToken) {
      //   const response = await axios.get(
      //     "http://localhost:8000/api/family/get_group_info/", // グループ情報を取得するエンドポイント
      //     {
      //       headers: {
      //         Authorization: `Bearer ${idToken}`, // Firebase トークンを設定
      //       },
      //     }
      //   );
      //   setGroupInfo(response.data); // グループ情報をステートに保存
      // }

      router.push("/"); // ホームページにリダイレクト
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "ログイン中にエラーが発生しました。");
      } else {
        setError("予期せぬエラーが発生しました。");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded w-96"
      >
        <h1 className="text-3xl font-bold mb-6 text-customBlue">ログイン</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-base text-customBlue font-bold">
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 border border-customBlue rounded-full w-full text-customBlue font-bold bg-customPink focus:ring-2 focus:ring-customBlue focus:outline-none"
            placeholder="メールアドレスを入力してください"
          />
        </div>

        <div className="mb-4">
          <label className="block text-base text-customBlue font-bold">
            パスワード
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 p-2 border border-customBlue rounded-full w-full text-customBlue font-bold bg-customPink focus:ring-2 focus:ring-customBlue focus:outline-none"
            placeholder="パスワードを入力してください"
          />
        </div>

        <button
          type="submit"
          className="bg-customBlue text-customYellow px-4 py-2 rounded-full w-full text-xl font-bold transform transition-transform duration-150 active:scale-95 active:bg-customBlue-dark hover:bg-customLightblue"
        >
          ログイン
        </button>


        <p className="text-sm mt-4 text-gray-700">
          アカウントお持ちではない方はこちらへ{" "}
          <a
            href="/auth/register"
            className="text-customBlue font-semibold hover:text-customDarkblue"
          >
            新規登録
          </a>
        </p>
      </form>

      {groupInfo && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">グループ情報</h2>
          <p>グループ名: {groupInfo.groupName}</p>
          <p>メンバー: {groupInfo.members.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;