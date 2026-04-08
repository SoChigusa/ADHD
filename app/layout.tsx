import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mind Drift",
  description: "つぶやきを保存し、頭の中に浮かんでは消えるイメージで表示するウェブアプリ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
