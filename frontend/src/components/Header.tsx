import React from 'react';
import Link from 'next/link'; // Next.jsのLinkコンポーネントをインポート
import { FaUser } from 'react-icons/fa'; // React Iconsからユーザーアイコンをインポート

const Header = () => {
  return (
    <header className="bg-customBlue p-4 shadow-md flex items-center justify-between">
      {/* 左側: タイトルをクリック可能に */}
      <Link href="/" aria-label="Go to Home">
        <h1 className="text-customYellow text-xl sm:text-2xl font-bold cursor-pointer">
          Tide Up
        </h1>
      </Link>

      {/* 右側: マイページアイコン */}
      <a
        href="/mypage"
        className="flex items-center text-white hover:text-gray-200 transition duration-200"
        aria-label="Go to My Page"
      >
        <FaUser className="h-5 w-5 sm:h-6 sm:w-6" />
        <span className="ml-2 text-xs sm:text-sm">My Page</span>
      </a>
    </header>
  );
};

export default Header;
