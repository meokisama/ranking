"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SITE, votingState } from "@/lib/config";
import type { VotingState } from "@/lib/config";
import { EASE } from "@/lib/motion";
import Logo from "./logo";

const LINKS = [
  { href: "/leaderboard", label: "Bảng tổng sắp", short: "Tổng sắp" },
  { href: "/feedback", label: "Góp ý", short: "Góp ý" },
];

const STATUS: Record<VotingState, string> = { upcoming: "Sắp mở", open: "Đang mở", closed: "Đã đóng" };

/**
 * The bar: the mark on the left; on the right the reading pages in one capsule, with an ink pill that slides
 * to the page you are on, and the ballot set apart as the one solid button.
 */
export default function Nav() {
  const pathname = usePathname();
  const [moved, setMoved] = useState(false);
  const [voting, setVoting] = useState<VotingState | null>(null);

  useEffect(() => {
    const on = () => setMoved(window.scrollY > 24);
    on();
    setVoting(votingState());
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const onVote = pathname.startsWith("/vote");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-700 ${
        moved ? "hair bg-paper/80 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <nav className="flex h-14 items-center justify-between gap-3 px-4 md:h-16 md:px-10" aria-label="Điều hướng chính">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${SITE.name}, về trang chủ`}>
          <Logo className="size-7 shrink-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-rotate-6 md:size-8" />
          <span className="display hidden whitespace-nowrap text-[1.1rem] leading-none sm:inline md:text-[1.3rem]">
            <i>Light Novel</i> <span className="font-medium">VN</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <ul className="flex items-center rounded-full bg-card/80 p-1 shadow-[inset_0_0_0_1px_rgb(22_18_14/0.12)] backdrop-blur-md">
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <li key={l.href} className="relative">
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ duration: 0.6, ease: EASE }}
                      aria-hidden
                    />
                  )}
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex h-8 items-center gap-2 whitespace-nowrap rounded-full px-3 text-[0.8rem] transition-colors duration-500 md:h-9 md:px-4 md:text-[0.86rem] ${
                      active ? "text-paper" : "text-ink/75 hover:text-ink"
                    }`}
                  >
                    <span className="md:hidden">{l.short}</span>
                    <span className="max-md:hidden">{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/vote"
            aria-current={onVote ? "page" : undefined}
            className={`group flex h-10 items-center gap-2.5 whitespace-nowrap rounded-full pl-3.5 pr-1.5 text-[0.8rem] font-medium text-paper transition-colors duration-500 md:h-11 md:pl-4 md:text-[0.86rem] ${
              onVote ? "bg-shu" : "bg-ink hover:bg-shu"
            }`}
          >
            {voting && (
              <span className="relative flex size-1.5 max-sm:hidden" title={`Bình chọn: ${STATUS[voting]}`}>
                {voting === "open" && <span className="absolute inset-0 animate-ping rounded-full bg-shu" />}
                <span className={`relative size-1.5 rounded-full ${voting === "open" ? (onVote ? "bg-paper" : "bg-shu group-hover:bg-paper") : "bg-paper/45"}`} />
              </span>
            )}
            Bình chọn
            <span className="grid size-7 place-items-center overflow-hidden rounded-full bg-paper text-ink md:size-8">
              <ArrowUpRight className="size-3.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45" aria-hidden />
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
