"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import Book3D from "@/components/ui/book3d";
import { Kicker } from "@/components/ui/reveal";
import type { Entry } from "@/lib/data";
import { nf, pad, percent } from "@/lib/format";

/**
 * The top ten as a row of books standing on a table, sliding past while the page is held.
 * Every book is the same size; under each, a bar the length of its votes.
 */
export default function CoverWall({ items, total, votes }: { items: Entry[]; total: number; votes: number }) {
  const track = useRef<HTMLElement>(null);
  const strip = useRef<HTMLOListElement>(null);
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const measure = () => setTravel(Math.max(0, (strip.current?.scrollWidth ?? 0) - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    if (strip.current) ro.observe(strip.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * travel);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const max = items[0].count;

  return (
    <section ref={track} className="relative" style={{ height: `calc(100svh + ${travel}px)` }} aria-label="Mười tác phẩm dẫn đầu">
      <div className="sticky top-0 flex h-svh flex-col justify-between overflow-hidden pb-8 pt-20 md:pb-10 md:pt-24">
        <div className="px-5 md:px-10">
          <Kicker no="02" right={`Hạng 01 – ${pad(items.length)}`}>
            Bảng vàng
          </Kicker>
          <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="display text-[11vw] md:text-[5.6vw]">
              Mười cái tên <i className="text-shu">dẫn đầu</i>
            </h2>
            <p className="max-w-[40ch] text-[0.9rem] text-ink/70">
              Cuộn để đi dọc kệ, từ hạng nhất trở xuống. Thanh dưới mỗi cuốn dài bằng số phiếu so với hạng nhất.
            </p>
          </div>
        </div>

        <motion.ol ref={strip} style={{ x }} className="flex w-max items-end gap-10 px-5 md:gap-14 md:px-10">
          {items.map((e) => (
            <li key={e.id} className="group w-[38svh] max-w-[17rem] shrink-0 md:w-[30svh]">
              <div className="flex items-baseline justify-between">
                <span className={`num text-[2.6rem] leading-none md:text-[3.4rem] ${e.rank === 1 ? "text-shu" : ""}`}>{pad(e.rank)}</span>
                <span className="label text-mute">{percent(e.count, votes)}</span>
              </div>
              <Book3D name={e.name} cover={e.cover} color={e.color} sub={e.publisher} className="mt-5 pr-6" />
              <div className="mt-6 h-[3px] bg-ink/[0.08]">
                <div className="h-full" style={{ width: `${(e.count / max) * 100}%`, background: e.color ?? "var(--color-shu)" }} />
              </div>
              <p className="display mt-3 line-clamp-2 min-h-[2.3em] text-[1.05rem] leading-[1.12]">{e.name}</p>
              <p className="label mt-1 flex justify-between gap-3 text-mute">
                <span className="truncate">{e.publisher}</span>
                <span className="shrink-0">{nf.format(e.count)} phiếu</span>
              </p>
            </li>
          ))}
          <li className="shrink-0 self-center">
            <Link
              href="/leaderboard"
              className="group grid h-[36svh] w-[26svh] place-items-center rounded-[3px] border border-dashed border-ink/25 text-center transition-colors duration-500 hover:border-shu hover:bg-shu hover:text-paper"
            >
              <span>
                <span className="num block text-6xl">{total}</span>
                <span className="label mt-2 block">tác phẩm trên kệ</span>
                <span className="mt-6 inline-flex items-center gap-2 text-sm">
                  Xem toàn bộ <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
                </span>
              </span>
            </Link>
          </li>
        </motion.ol>

        <div className="mx-5 h-px bg-ink/10 md:mx-10">
          <motion.div className="h-px origin-left bg-shu" style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  );
}
