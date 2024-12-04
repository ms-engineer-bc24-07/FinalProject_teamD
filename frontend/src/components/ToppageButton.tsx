import React from 'react';

type ToppageButtonProps = {
  text?: string; // ボタンの中のテキスト（任意）
  icon?: React.ReactNode; // ボタンの中のアイコン（任意）
  onClick?: () => void; // ボタンがクリックされた時の動作
};

const ToppageButton: React.FC<ToppageButtonProps> = ({ text, icon,onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative bg-customBlue p-4 shadow-lg rounded-3xl cursor-pointer hover:shadow-2xl transition"
      style={{ width: '150px', height: '150px' }} // 四角形の大きさ
    >
      {/* ピンクの小さい四角 */}
      <div
        className="absolute bg-customPink text-customBlue font-bold rounded-xl flex items-center justify-center"
        style={{
          width: '100px',
          height: '100px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // 中央に配置
        }}
      >
        {/* テキストまたはアイコンを表示 */}
        {icon ? icon : text}
      </div>
    </div>
  );
};

export default ToppageButton;
