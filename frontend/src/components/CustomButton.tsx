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
        width: '20vw', // 画面幅に応じて調整
        height: '8vw',
        maxWidth: '210px',
        maxHeight: '80px',
        padding: '5px',
      }}
    >
      <div
        className="bg-customPink rounded-lg flex items-center justify-center"
        style={{
          width: '90%',
          height: '80%',
        }}
      >
        {icon ? (
          <div className="text-customBlue text-lg sm:text-xl">{icon}</div>
        ) : (
          <span className="text-customBlue font-bold text-sm sm:text-lg">{text}</span>
        )}
      </div>
    </div>
  );
};

export default CustomButton;
