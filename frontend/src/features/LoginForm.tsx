
"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
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
  const router = useRouter();

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

      // ログイン後にグループ情報を取得
      const idToken = await auth.currentUser?.getIdToken();
      if (idToken) {
        const response = await axios.get(
          "http://localhost:8000/api/family/get_group_info/", // グループ情報を取得するエンドポイント
          {
            headers: {
              Authorization: `Bearer ${idToken}`, // Firebase トークンを設定
            },
          }
        );
        setGroupInfo(response.data); // グループ情報をステートに保存
      }

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800">ログイン</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-base font-medium text-gray-900">
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-3 border border-gray-500 rounded w-full text-gray-900 bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="メールアドレスを入力してください"
          />
        </div>

        <div className="mb-4">
          <label className="block text-base font-medium text-gray-900">
            パスワード
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 p-3 border border-gray-500 rounded w-full text-gray-900 bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="パスワードを入力してください"
          />
        </div>

        <button
          type="submit"
          className="bg-customBlue text-customYellow px-4 py-2 rounded w-full"
        >
          ログイン
        </button>

        <p className="text-sm mt-4 text-gray-700">
          アカウントお持ちではない方はこちらへ{" "}
          <a
            href="/auth/register"
            className="text-blue-600 font-semibold hover:underline"
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
