import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* ビューポート設定を追加 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      {/* max-w-sm: TailwindCSSのクラスで、コンテナの最大幅を「スモールサイズ」に制限します（通常640px）。 mx-auto: 水平方向に中央揃えします。 */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-sm mx-auto`}
      >
        <Header />
        
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
