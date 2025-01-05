"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCamera } from "react-icons/fa";
import Image from "next/image";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ToppageButton from "../components/ToppageButton";
import axios from "../lib/axios";

const Page = () => {
  const [userName, setUserName] = useState<string>("ゲスト");
  const [userIcon, setUserIcon] = useState<string | null>(null);
  const [references, setReferences] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          fetchUser(user);
          fetchReferences();
        } else {
          router.push("/auth/login");
        }
      });
      return unsubscribe;
    };

    const fetchUser = async (user: any) => {
      try {
        const email = user.email;
        const token = await user.getIdToken();

        if (!token) {
          console.error("fetchUserユーザーが認証されていません");
          return;
        }

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
          setUserName(data.user_name);
          setUserIcon(data.icon_url || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/auth/login");
        }
      }
    };

    const fetchReferences = async () => {
      try {
        const user = auth.currentUser;
        const token = await user?.getIdToken(true);

        if (!token) {
          console.error("fetchReferencesユーザーが認証されていません");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/references/group-references/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log('Received references:', response.data); 
          setReferences(response.data);
        }
      } catch (error) {
        console.error("Error fetching group references:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            router.push("/auth/login");
          }
        }
      }
    };

    const unsubscribe = checkAuth();
    return () => unsubscribe();
  }, [router]);

  const getReferenceButton = (reference: any | null, id: number) => {
    console.log('Processing reference:', reference);
  
    // reference が null の場合の処理
    if (reference && reference.reference_name) {
      return (
        <ToppageButton
          key={reference.id} // reference.id を使用
          text={reference.reference_name}
          onClick={() => {
            console.log(`Navigating to reference ${reference.id}`); // デバッグ用
            router.push(`/reference/${reference.id}`);
          }}
        />
      );
    } else {
      return (
        <ToppageButton
          key={`no-reference-${id}`} // null の場合、ユニークな key を使用
          icon={<FaCamera className="text-customBlue text-4xl" />}
          onClick={() => router.push(`/SampleRegistration`)} // 参考写真がない場合、カメラアイコンを表示
        />
      );
    }
  };
  
  const buttons = [];
  for (let i = 0; i < 4; i++) {
    // referencesの中からi番目の見本写真を取得
    const reference = references[i] || null;
    buttons.push(getReferenceButton(reference, i + 1)); // IDは1から始まると仮定
  }
  
  return (
    <div className="flex-grow p-5 text-center">
      <div className="flex justify-between items-center mt-9 p-6">
        <div className="ml-7 text-3xl font-extrabold text-customBlue">
          {userName}
        </div>
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
  
      <div className="flex-grow p-5 text-center">
        <div className="grid grid-cols-2 gap-10 mt-4">
          {buttons} {/* buttons 配列をここでレンダリング */}
        </div>
      </div>
    </div>
  );
};

export default Page;