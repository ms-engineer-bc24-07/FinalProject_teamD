"use client";

import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import Image from "next/image";

const MyPage = () => {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [members, setMembers] = useState<string[]>([]); // メンバー一覧
  const [inviteUrl, setInviteUrl] = useState<string | null>(null); // 招待URL
  const [isEditing, setIsEditing] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false); // モーダル表示状態
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null); // 選択したアイコン

  const auth = getAuth();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setUsername(currentUser.displayName || "ゲスト");
      setSelectedIcon(currentUser.photoURL || null); // Firebaseに保存されたアイコンをセット
      // ダミーデータでメンバーリストを設定（Firebase連携に変更可能）
      setMembers(["メンバー1", "メンバー2"]);
    }
  }, [auth.currentUser]);

  const handleUpdateUsername = async () => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: username });
        alert("ユーザー名を更新しました！");
        setIsEditing(false);
      } catch (error) {
        alert("ユーザー名の更新中にエラーが発生しました。");
        console.error(error);
      }
    }
  };

  const handleInvite = () => {
    const generatedUrl = `${window.location.origin}/invite/${auth.currentUser?.uid}`;
    setInviteUrl(generatedUrl);
    alert("招待URLを生成しました！");
  };

  const handleIconSelect = async (iconPath: string) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { photoURL: iconPath });
        setSelectedIcon(iconPath);
        alert("アイコンを更新しました！");
        setIsIconModalOpen(false);
      } catch (error) {
        alert("アイコンの更新中にエラーが発生しました。");
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">マイページ</h1>

        {/* アイコン表示と設定ボタン */}
        <div className="mb-4 text-center">
          <div className="mb-2">
            {selectedIcon ? (
              <Image
                src={selectedIcon}
                alt="ユーザーアイコン"
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <span>アイコン</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsIconModalOpen(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            アイコンを設定
          </button>
        </div>

        {/* ユーザー名 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            ユーザー名:
          </label>
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
              <button
                onClick={handleUpdateUsername}
                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
              >
                保存
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-900">{username}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 underline"
              >
                編集
              </button>
            </div>
          )}
        </div>

        {/* メールアドレス */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            メールアドレス:
          </label>
          <p className="text-gray-900">{user?.email || "メールアドレスなし"}</p>
        </div>

        {/* メンバー */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            メンバー:
          </label>
          {members.length === 0 ? (
            <p className="text-gray-500">メンバーはいません。</p>
          ) : (
            <ul className="list-disc pl-5 text-gray-900">
              {members.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          )}
        </div>

        {/* 招待URL */}
        {inviteUrl && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              招待URL:
            </label>
            <p className="text-gray-900 break-all">{inviteUrl}</p>
          </div>
        )}

        {/* 招待ボタン */}
        <button
          onClick={handleInvite}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          招待する
        </button>
      </div>

      {/* アイコン選択モーダル */}
      {isIconModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-bold mb-4">アイコンを選択</h2>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className="cursor-pointer"
                  onClick={() =>
                    handleIconSelect(`/icons/icon-${num}.png`) // アイコンパスを設定
                  }
                >
                  <Image
                    src={`/icons/icon-${num}.png`}
                    alt={`アイコン ${num}`}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsIconModalOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
