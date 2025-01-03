"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import axios from "../../lib/axios";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Image from "next/image"; // Next.js の Image コンポーネント
import Link from "next/link";
import CustomButton from "../../components/CustomButton"; // ボタンコンポーネントのインポート

const Mypage = () => {
  const [userName, setUserName] = useState<string>("ゲスト");
  const [email, setEmail] = useState<string>("example@example.com");
  const [icon, setIcon] = useState<string | null>(null); // 初期値を null に設定
  const [newIcon, setNewIcon] = useState<string>(""); // 新しいアイコン
  const [isEditing, setIsEditing] = useState<boolean>(false); // 編集モード
  const [members, setMembers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>(""); // グループ名
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false); // ログアウト処理中かを追跡
  const router = useRouter();

  // ユーザーデータ取得
  const fetchUserData = async (user: any) => {
    try {
      const idToken = await user.getIdToken(true); // 最新のトークンを取得
      console.log("トークン:", idToken); // トークンをログに出力
      const response = await axios.post(
        "http://localhost:8000/api/users/get_user/",
        { email: user.email },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      const data = response.data;
      console.log("取得したユーザーデータ:", data); // ここでレスポンスを確認
      setUserName(data.user_name);
      setEmail(data.email);
      setIcon(data.icon_url || null);// アイコン URL をステートに設定
        
        // グループ情報を取得
      const groupResponse = await axios.get(
        "http://localhost:8000/api/family/get_group_info/",
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

// 初期ロード時にユーザーデータを取得
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      if (!isLoggingOut) {
        fetchUserData(user);
      }
    } else {
      if (!isLoggingOut) {
        console.error("ログインしていません");
        router.push("/auth/login"); // ログインしていない場合はログインページにリダイレクト
      }
    }
  });

    return () => unsubscribe();
  }, [router, isLoggingOut]);

  // アイコン選択
  const handleIconSelect = (newIcon: string) => {
    setNewIcon(newIcon);
  };

// アイコン保存
const handleSaveIcon = async () => {
  const user = auth.currentUser;
  if (user && newIcon) {
    const idToken = await user.getIdToken(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/update_icon/",
        { icon: newIcon },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("アイコンが更新されました");
        // setIcon(newIcon); 削除
        setIsEditing(false); 
        // 保存成功後に最新データを取得
        await fetchUserData(user);
      }
    } catch (error) {
      console.error("アイコン更新エラー:", error);
    }
  }
};

// ログアウト処理
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true); // ログアウト処理中に切り替え
      await signOut(auth); // ログアウト処理
      router.push("/auth/login"); // ログインページに遷移
    } catch (error) {
      console.error("ログアウト中にエラーが発生しました:", error);
      setIsLoggingOut(false); // エラーが発生した場合はリセット
    }
  };

  return (
    <div className="flex flex-col rounded items-center p-9">
      <div className="flex justify-center w-full max-w-md mb-4">
        <h1 className="text-2xl font-bold text-customBlue text-center">マイページ</h1>
      </div>

    {/* ユーザー情報セクション */}
    <div className="mypage-background w-full max-w-md p-5 rounded mb-4">
      {/* アイコン表示 */}
      <div className="mb-4 w-full max-w-md">
        <div className="flex justify-between items-center">
          <label id="stitch">アイコン</label>
          <div className="flex items-center">
            {icon ? (
              // アイコンが設定されている場合、画像を表示
              <Image
                src={icon}
                alt="ユーザーアイコン"
                width={55}
                height={55}
                className="rounded-full border-4 border-customBlue"
              />
            ) : (
              // アイコンが未設定の場合、"No Icon" を表示
            <div className="w-16 h-16 rounded-full border flex items-center justify-center text-gray-500">
            No Icon
          </div>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="button_solid012 button_solid012--small"
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
                className={`border-2 rounded-full ${
                  newIcon === `/icons/icon-${num}.png`
                    ? "border-customBlue"
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
        {isEditing && newIcon && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSaveIcon}
              className="button_solid012 button_solid012--small"
            >
              保存
            </button>
          </div>
        )}
      </div>

      <hr className="hr-cute" />
    


        {/* ユーザー名 */}
        <div className="mb-4 w-full max-w-md">
          <div className="flex justify-between items-center">
            <label id="stitch">お名前</label>
            <span className="text-base text-gray-800">{userName}</span>
          </div>
          
        </div>

        <hr className="hr-cute" />

        {/* メールアドレス */}
        <div className="mb-4 w-full max-w-md">
          <div className="flex justify-between items-center">
            <label id="stitch" className="mr-5">Eメール</label>
            <span className="text-base text-gray-800">{email}</span>
          </div>

        </div>

        <hr className="hr-cute" />

        {/* グループ名 */}
        <div className="mb-4 w-full max-w-md">
          <div className="flex justify-between items-center">
            <label id="stitch">グループ名</label>
            <span className="text-base text-gray-800">{groupName}</span>
          </div>

        </div>

        <hr className="hr-cute" />

        {/* メンバー */}
        <div className="mb-4 w-full max-w-md">
          <label id="stitch">グループメンバー</label>
          <div className="mt-2">
            {members.length === 0 ? (
              <p className="text-customPink">メンバーがいません</p>
            ) : (
              <ul className="list-disc pl-5">
                {members.map((member, index) => (
                  <li key={index} className="text-gray-800">
                    {member}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-5">
      {/* 招待するボタン */}
      <Link href="/invite">
        <CustomButton
          text="招待する"
        />
      </Link>

      {/* ホームページに戻るボタン */}
      <Link href="/">
        <CustomButton
          text="ホームに戻る"
        />
      </Link>

      {/* ログアウトボタン */}
      <CustomButton
        text="ログアウト"
        onClick={handleLogout}
      />
      </div>
    </div>
  );
};

export default Mypage;
