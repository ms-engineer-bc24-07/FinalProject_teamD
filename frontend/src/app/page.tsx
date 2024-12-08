import React from 'react';
import Link from 'next/link';

import { FaCamera } from 'react-icons/fa'; // カメラアイコンをインポート
import Image from 'next/image'; // Next.jsのImageコンポーネントをインポート
import ToppageButton from '../components/ToppageButton'

const page = () => {
  const userName = "ゲスト"; // ユーザー名（例）
  const defaultIcon = "/icons/icon-1.png"; // デフォルトのアイコンパス

  return (
    <div className="flex flex-col min-h-screen">
      {/* 上部のユーザー情報 */}
      <div className="flex justify-between items-center p-6 ">
        {/* 左側: ユーザー名 */}
        <div className="text-lg font-bold text-customBlue">
          {userName}さん
          </div>
        {/* 右側: デフォルトアイコン */}
        <div className="w-25 h-25">
          <Image
            src={defaultIcon} // アイコンのパス
            alt={`${userName}のアイコン`}
            width={100} // アイコンの幅
            height={100} // アイコンの高さ
            className="rounded-full" // アイコンを丸く表示
          />
        </div>
        
      </div>

      {/* メインコンテンツ */}
      <div className="flex-grow p-5 text-center">

        {/* ボタンのコンテナ */}
        <div className="grid grid-cols-2 gap-10 mt-4">
          <Link href="/page1">
              <ToppageButton text="Page 1" />
          </Link>

          <Link href="/page2">
              <ToppageButton text="Page 2" />
          </Link>

          <Link href="/page3">
              <ToppageButton text="Page 3" />
          </Link>

          <Link href="/page4">
          <ToppageButton icon={<FaCamera className="text-customBlue text-4xl" />} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
