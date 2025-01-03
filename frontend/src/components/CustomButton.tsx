import React from "react";
import Link from "next/link";

type ButtonProps = {
  text?: string; // ボタンに表示するテキスト
  icon?: React.ReactNode; // ボタン内のアイコン
  onClick?: () => void; // クリック時のイベント
  href?: string; // リンク先（リンクの場合）
  className?: string; // 追加のクラス名（任意）
};

const CustomButton: React.FC<ButtonProps> = ({
  text,
  icon,
  onClick,
  href,
  className = "",
}) => {
  // リンクの場合は <Link> を使用、そうでなければ <button>
  if (href) {
    return (
      <Link href={href} passHref>
        <a className={`btn btn-border-shadow ${className}`}>
          {icon ? (
            <div className="flex items-center justify-center text-lg sm:text-xl">
              {icon}
            </div>
          ) : (
            <span>{text}</span>
          )}
        </a>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`btn btn-border-shadow btn-border-shadow--color ${className}`}
    >
      {icon ? (
        <div className="flex items-center justify-center text-lg sm:text-xl">
          {icon}
        </div>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};

export default CustomButton;
