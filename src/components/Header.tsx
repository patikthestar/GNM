"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-display text-3xl tracking-widest text-nike-black">
          PATIK
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="#photos"
            className="text-xs font-semibold uppercase tracking-widest text-nike-black transition-colors hover:text-nike-orange"
          >
            Photos
          </Link>
          <Link
            href="#guestbook"
            className="text-xs font-semibold uppercase tracking-widest text-nike-black transition-colors hover:text-nike-orange"
          >
            Guestbook
          </Link>
        </nav>
      </div>
    </header>
  );
}
