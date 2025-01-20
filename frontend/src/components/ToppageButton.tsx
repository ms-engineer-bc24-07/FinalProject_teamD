import React from 'react';

type ToppageButtonProps = {
  text?: string; // ボタンの中のテキスト（任意）
  icon?: React.ReactNode; // ボタンの中のアイコン（任意）
  onClick?: () => void; // ボタンがクリックされた時の動作
};

const ToppageButton: React.FC<ToppageButtonProps> = ({ text, icon, onClick }) => {
  return (
    <button onClick={onClick} className="top-page-button">
      {/* アイコンがあれば表示 */}
      {icon && <span className="icon-wrapper">{icon}</span>}
      {/* テキストがあれば表示 */}
      {text && <span className="text-wrapper">{text}</span>}
    </button>
  );
};

export default ToppageButton;
