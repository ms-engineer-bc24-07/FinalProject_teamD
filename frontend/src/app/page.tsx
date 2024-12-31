"use client";

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
      }
    };

    const fetchReferences = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/get_user_group/");
        if (response.status === 200) {
          setReferences(response.data); 
        }
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    };

    const unsubscribe = checkAuth();
    fetchReferences();

    return () => unsubscribe(); 
  }, [router]);

  const getReferenceButton = (reference: any) => {
    if (reference) {
      return (
        <ToppageButton
          key={reference.id}
          text={reference.name} // ここでreference.nameを使う
          onClick={() => router.push(`/reference/${reference.id}`)} // 動的に遷移
        />
      );
    } else {
      return (
        <ToppageButton
          key={`no-reference-${reference.id}`} 
          icon={<FaCamera className="text-customBlue text-4xl" />}
          onClick={() => router.push(`/SampleRegistration`)} // 参考写真がない場合、カメラアイコンを表示
        />
      );
    }
  };
  return (
    <div className="flex-grow p-5 text-center">
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

      <div className="flex-grow p-5 text-center">
        <div className="grid grid-cols-2 gap-10 mt-4">
          {references.map(getReferenceButton)}
        </div>
      </div>
    </div>
  );
};

export default Page;
