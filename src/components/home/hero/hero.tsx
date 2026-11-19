"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { intro } from "@/lib/intro";
import { EASE } from "@/lib/motion";
import type { HeroBook } from "./shared";

const HeroScene = dynamic(() => import("./scene"), { ssr: false });

export default function Hero({
  books,
  period,
  votes,
  titles,
}: {
  books: HeroBook[];
  period: string;
  votes: string;
  titles: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);
  const revealed = useSyncExternalStore(
    intro.subscribe,
    () => intro.revealed,
    () => false
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: revealed ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1.2, delay, ease: EASE },
  });

  return (
    <section ref={ref} className="relative h-[170svh] bg-ink">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0">
          <HeroScene books={books} active={active} />
        </div>

        {/* The real h1 for screen readers and SEO; the visible title lives in the 3D scene. */}
        <h1 className="sr-only">Bảng Xếp Hạng Light Novel Việt Nam</h1>

        {/* dark edges keep text near the borders readable */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_0%_100%,rgb(12_11_10/0.95)_25%,transparent_100%),radial-gradient(ellipse_50%_45%_at_100%_100%,rgb(12_11_10/0.95)_25%,transparent_100%),radial-gradient(ellipse_at_center,transparent_55%,rgb(12_11_10/0.7)_100%)]" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent md:hidden" />

        {/* crop marks in the four corners */}
        <div className="pointer-events-none absolute inset-4 md:inset-7" aria-hidden>
          {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map(
            (c) => (
              <span key={c} className={`absolute size-3 border-paper/40 ${c}`} />
            )
          )}
        </div>

        <motion.div
          {...show(0.9)}
          className="tategaki pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 text-[13px] text-paper/55 md:left-9 md:block"
          aria-hidden
        >
          ライトノベル人気投票 <span className="text-shu">第二期</span>
        </motion.div>

        <motion.div
          {...show(1.0)}
          className="tategaki pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 text-[13px] text-paper/55 md:right-9 md:block"
          aria-hidden
        >
          二〇一八年より
        </motion.div>

        <div className="absolute inset-x-5 bottom-8 flex flex-col gap-6 md:inset-x-16 md:bottom-12 md:flex-row md:items-end md:justify-between">
          <motion.p {...show(1.1)} className="max-w-[34ch] text-[15px] leading-relaxed text-paper/75">
            <span className="label mb-3 block text-shu">{period} · Kết quả chính thức</span>
            Nơi sức sáng tạo của tác giả gặp gỡ đam mê của độc giả.{" "}
            <span className="text-paper">{votes} lá phiếu</span> đã gọi tên {titles} tác phẩm.
          </motion.p>

          <motion.div {...show(1.25)} className="flex items-center gap-3">
            <Link
              href="/leaderboard"
              className="group relative inline-flex h-14 items-center gap-4 overflow-hidden bg-paper pl-6 pr-5 text-ink"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-shu transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
              <span className="label relative transition-colors duration-300 group-hover:text-paper">
                Xem bảng tổng sắp
              </span>
              <span className="relative grid size-7 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:bg-paper group-hover:text-ink">
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </Link>
            <span className="label hidden text-paper/45 lg:block">
              Kéo ngang để xoay
              <br />
              Cuộn để mở sách
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
