import React from 'react';

type ButtonProps = {
  text?: string; // ボタンに表示するテキスト
  icon?: React.ReactNode; // ボタン内のアイコン
  onClick?: () => void; // クリック時のイベント
  className?: string; // 追加のクラス名（任意）
};

const CustomButton: React.FC<ButtonProps> = ({ text, icon, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center bg-customBlue rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
      style={{
        width: '210px', // 青枠の幅
        height: '80px', // 青枠の高さ
        padding: '5px', // 内側の余白
      }}
    >
      <div
        className="bg-customPink rounded-lg flex items-center justify-center"
        style={{
          width: '180px', // ピンク部分の幅
          height: '55px', // ピンク部分の高さ
        }}
      >
        {icon ? (
          <div className="text-customBlue text-xl">{icon}</div> // アイコンの場合
        ) : (
          <span className="text-customBlue font-bold text-lg">{text}</span> // テキストの場合
        )}
      </div>
    </div>
  );
};

export default CustomButton;
