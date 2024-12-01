"use client";

import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation"; // Next.js のルーター
import { auth } from "../lib/firebase"; // Firebase の設定と初期化をインポート

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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
    const { username, email, password } = formData;

    try {
      // Firebase でユーザーを登録
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ユーザー名を設定
      await updateProfile(user, { displayName: username });

      alert("Registration successful!");
      router.push("/auth/login"); // ログインページにリダイレクト
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4">新規登録</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
  
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            ユーザー名
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full text-black"
            placeholder="ユーザー名を入力してください"
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full text-black"
            placeholder="メールアドレスを入力してください"
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            パスワード
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full text-black"
            placeholder="パスワードを入力してください"
          />
        </div>
  
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          登録
        </button>
        <p className="text-sm mt-4 text-gray-700">
          すでにアカウントをお持ちですか？{" "}
          <a
            href="/auth/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            ログイン
          </a>
        </p>
      </form>
    </div>
  );
  
};

export default RegisterForm;
