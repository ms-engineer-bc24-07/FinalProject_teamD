import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, getIdToken } from "firebase/auth";
import { useRouter } from "next/navigation"; // Next.js のルーター
import { auth } from "../lib/firebase"; // Firebase の設定と初期化をインポート
import axios from "../lib/axios"; // axios をインポート


const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    groupName: "", // グループ名を追加
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
    const { username, email, password, groupName } = formData;

    try {
      // Firebase でユーザーを登録
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ユーザー名を設定
      await updateProfile(user, { displayName: username });

      // Firebaseからトークンを取得
      const idToken = await getIdToken(user);

      // Firebase UIDを取得
      const firebase_uid = user.uid;  // Firebase UIDを取得  

      // バックエンドにユーザー情報を保存とグループ作成リクエストを送信
      const response = await axios.post("http://localhost:8000/api/users/register/", {  // axios を使用して POST リクエストを送信
        user_name: username, 
        email, 
        password, 
        group_name: groupName, // group_nameに変更
        firebase_uid,
      }, {
        headers: {
          "Authorization": `Bearer ${idToken}`, // トークンをヘッダーに追加
          "Content-Type": "application/json", // 必要なヘッダー
        }
      });

      if (response.status === 201) {
        alert("新規登録が完了しました!");
        router.push("/auth/login"); // ログインページにリダイレクト
      } else {
        throw new Error(response.data.error || "Failed to save user and create group.");
      }

    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="mt-2 p-8 rounded w-80"
      >
        <h1 className="text-3xl font-bold mb-4 text-customBlue text-center">新規登録</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
  
        <div className="mb-2">
          <label className="block text-base text-customBlue font-bold">
            お名前
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 p-2 border border-customBlue rounded-full w-full text-customBlue font-bold bg-customPink focus:ring-2 focus:ring-customBlue focus:outline-none"
            placeholder="お名前を入力してください"
          />
        </div>
  
        <div className="mb-2">
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
  
        <div className="mb-2">
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
  
        <div className="mb-2">
          <label className="block text-base text-customBlue font-bold">
            グループ名
          </label>
          <input
            type="text"
            name="groupName"
            value={formData.groupName}
            onChange={handleChange}
            className="mt-1 mb-3 p-2 border border-customBlue rounded-full w-full text-customBlue font-bold bg-customPink focus:ring-2 focus:ring-customBlue focus:outline-none"
            placeholder="グループ名を入力してください"
          />
        </div>
  
        <button
          type="submit"
          className="button_solid012"
        >
          登録
        </button>
  
        <p className="text-sm mt-3 text-gray-700">
          アカウントをお持ちですか？{" "}
          <a
            href="/auth/login"
            className="text-customBlue font-semibold hover:text-customDarkblue"
          >
            ログイン
          </a>
        </p>
      </form>
    </div>
  );
  
};

export default RegisterForm;