"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const LINKS = [
  { href: "/", label: "Trang chủ", jp: "表紙" },
  { href: "/leaderboard", label: "Bảng tổng sắp", jp: "順位" },
  { href: "/feedback", label: "Góp ý", jp: "声" },
  { href: "/vote", label: "Bình chọn", jp: "投票" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 text-white mix-blend-difference md:px-8 md:py-6">
        <Link href="/" className="pointer-events-auto flex items-center gap-3" aria-label="Trang chủ">
          <span className="display grid size-9 place-items-center border border-current text-[15px] leading-none">
            <span className="translate-y-[1px]">LN</span>
          </span>
          <span className="label hidden leading-tight sm:block">
            Bảng xếp hạng
            <br />
            Light Novel Việt Nam
          </span>
        </Link>

        <nav className="pointer-events-auto hidden items-center gap-8 md:flex" aria-label="Điều hướng chính">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="label group relative py-1">
              <span className={active(l.href) ? "opacity-100" : "opacity-60 transition-opacity group-hover:opacity-100"}>
                {l.label}
              </span>
              {active(l.href) && (
                <motion.span layoutId="nav-dot" className="absolute -bottom-1 left-0 h-px w-full bg-current" />
              )}
            </Link>
          ))}
        </nav>

        <button
          className="label pointer-events-auto md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? "Đóng" : "Menu"}
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-5 pb-10 text-paper md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {LINKS.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display flex items-baseline justify-between border-t border-paper/20 py-4 text-[11vw]"
                >
                  {l.label}
                  <span className="font-jp text-base text-shu">{l.jp}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
