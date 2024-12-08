import React from 'react';
import { FaUser } from 'react-icons/fa';// React Iconsからユーザーアイコンをインポート


const Header = () => {
  return (
    <header className="bg-customBlue p-4 shadow-md flex items-center justify-between">
      
       {/* 左側: タイトル */}
      <h1 className="text-customYellow text-2xl font-bold">Tide Up</h1>
      {/* 右側: マイページアイコン */}
      <a
        href="/mypage"
        className="flex items-center text-white hover:text-gray-200 transition duration-200"
        aria-label="Go to My Page"
      >
        <FaUser className="h-6 w-6" />
        <span className="ml-2 text-sm">My Page</span>
      </a>
    </header>
  );
};

export default Header;
