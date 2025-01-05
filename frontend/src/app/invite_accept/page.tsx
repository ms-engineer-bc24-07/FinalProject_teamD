"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // useRouterを追加
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, getIdToken } from "firebase/auth";
import axios from "../../lib/axios";

const InviteAcceptPage = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [groupName, setGroupName] = useState(""); // グループ名を追加
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter(); // useRouterを使用

  useEffect(() => {
    // トークンの検証
    const validateToken = async () => {
      try {
        const response = await axios.post("/api/family/validate_invite/", { token });
        if (response.status === 200) {
          setGroupName(response.data.groupName); // グループ名を取得
          setMessage("トークンが有効です。登録を進めてください。");
        }
      } catch (error) {
        setMessage("無効なトークンです。もう一度ご確認ください。");
        console.error(error);
      }
    };
    validateToken();
  }, [token]);

  const handleRegister = async () => {
    try {
      // Firebaseで新規ユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ユーザー名を設定
      await updateProfile(user, { displayName: userName });

      // Firebaseからトークンを取得
      const idToken = await getIdToken(user);

      // Firebase UIDを取得
      const firebase_uid = user.uid;

      // 招待を受け入れ、登録処理を実行
      await axios.post("/api/users/accept_invite/", {
        user_name: userName,
        email: email,
        password: password,
        firebase_uid: firebase_uid,  // Firebase UIDを送信
        token: token,  // 招待トークンを送信
      });

      setMessage(`登録が完了しました！「${groupName}」グループに参加しました。`);

      // 2秒後にログインページにリダイレクト
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setMessage("登録に失敗しました。もう一度お試しください。");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-2xl font-bold mb-4 text-customBlue">グループに参加する</h1>
      {groupName && (
        <p className="mb-4 font-bold text-customBlue">グループ名: {groupName}</p>
      )}
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="お名前を入力してください"
        className="mb-4 p-2 border border-customBlue rounded-full w-full text-customBlue font-bold bg-customPink focus:ring-2 focus:ring-customBlue focus:outline-none"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレスを入力してください"
        className="mb-4 p-2 border border-customBlue rounded-full w-full text-customBlue font-bold bg-customPink focus:ring-2 focus:ring-customBlue focus:outline-none"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワードを入力してください"
        className="mb-4 p-2 border border-customBlue rounded-full w-full text-customBlue font-bold bg-customPink focus:ring-2 focus:ring-customBlue focus:outline-none"
      />
      <button
        onClick={handleRegister}
        className="button_solid012"
      >
        登録
      </button>
    </div>
  );
  
};

export default InviteAcceptPage;
