import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PATIK — 친구들과 함께",
  description: "친구들과 사진을 공유하고 방명록을 남기는 공간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${bebas.variable} ${inter.variable}`}>
      <body className="min-h-screen">
        <Header />
        <main>{children}</main>
        <footer className="border-t border-neutral-200 bg-nike-black py-12 text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
            <span className="text-display text-3xl tracking-wider">PATIK</span>
            <p className="text-sm text-neutral-400">
              친구들과 추억을 공유하는 공간
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
