"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/config";
import Logo from "./logo";

const LINKS = [
  { href: "/leaderboard", label: "Bảng tổng sắp" },
  { href: "/feedback", label: "Góp ý" },
  { href: "/vote", label: "Bình chọn" },
];

/** A thin bar that takes on a paper backing once the page has moved. */
export default function Nav() {
  const pathname = usePathname();
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    const on = () => setMoved(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-700 ${
        moved ? "hair bg-paper/80 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <nav className="flex h-14 items-center justify-between px-5 md:h-16 md:px-10" aria-label="Điều hướng chính">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name}, về trang chủ`}>
          <Logo className="size-7 shrink-0 md:size-8" />
          <span className="display whitespace-nowrap text-[1.1rem] leading-none md:text-[1.3rem]">
            <i>Light Novel</i> <span className="font-medium">VN</span>
          </span>
        </Link>
        <ul className="flex items-center gap-3.5 whitespace-nowrap text-[0.74rem] md:gap-8 md:text-[0.875rem]">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`link transition-colors duration-300 ${active ? "text-shu" : "hover:text-shu"} ${active ? "" : "[background-size:0%_1px] hover:[background-size:100%_1px]"}`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
