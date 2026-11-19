"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Book from "@/components/ui/book";
import Eclipse from "@/components/ui/eclipse";
import type { Entry } from "@/lib/data";
import { nf, pad, percent } from "@/lib/format";

/**
 * Top 10 as a horizontal shelf: scrolling the page vertically drags the strip to the left.
 * Narrow touch screens fall back to native horizontal scrolling.
 */
export default function TopTen({
  items,
  votes,
  total,
  period,
}: {
  items: Entry[];
  votes: number;
  total: number;
  period: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const measure = () => {
      const wide = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches;
      setPinned(wide);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const max = items[0].count;

  return (
    <section
      ref={wrap}
      className="relative bg-ink text-paper"
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
      aria-label="Top 10 Light Novel được yêu thích nhất"
    >
      <div className={pinned ? "haze sticky top-0 flex h-svh flex-col justify-center overflow-hidden" : "haze relative overflow-x-auto py-24"}>
        <motion.div
          ref={track}
          style={pinned ? { x } : undefined}
          className="flex w-max items-stretch gap-[6vw] px-5 md:gap-[5vw] md:px-16"
        >
          <div className="flex w-[78vw] shrink-0 flex-col justify-between md:w-[36vw]">
            <div>
              <span className="label text-shu">Hạng mục 01 · {period}</span>
              <h2 className="display mt-5 text-[19vw] leading-[0.9] md:text-[10.5vw]">
                Top
                <br />
                <span className="outline-text">Mười</span>
              </h2>
            </div>
            <p className="mt-8 max-w-[30ch] font-serif text-xl italic leading-snug text-paper/70 md:text-2xl">
              Light Novel được yêu thích nhất, do {nf.format(votes)} độc giả chọn ra.
            </p>
          </div>

          {items.map((it, i) => (
            <article key={it.id} className="group relative flex w-[72vw] shrink-0 flex-col md:w-[27vw] lg:w-[23vw]">
              {i === 0 && <Eclipse className="left-[62%] top-[-9%] z-0 w-[185%] -translate-x-1/2" />}
              <span
                className={`display pointer-events-none absolute -left-[0.06em] -top-[0.2em] z-0 select-none text-[42vw] leading-none md:text-[17vw] ${
                  i === 0 ? "text-shu" : "outline-text text-paper/35"
                }`}
                aria-hidden
              >
                {pad(it.rank)}
              </span>
              <Book
                name={it.name}
                cover={it.cover}
                color={it.color}
                sub={it.publisher}
                eager={i < 3}
                depth={30}
                className="relative z-10 ml-auto mt-[20%] w-[76%]"
              />
              <div className="relative z-10 mt-10">
                <div className="label flex items-center justify-between text-paper/50">
                  <span>Hạng {pad(it.rank)}</span>
                  <span>{it.publisher}</span>
                </div>
                <h3 className="display mt-3 line-clamp-3 text-2xl leading-[1.12] md:text-[1.7vw]">{it.name}</h3>
                <div className="mt-5 flex items-end justify-between border-t border-paper/15 pt-4">
                  <span className="display text-4xl tabular-nums md:text-[2.6vw]">{nf.format(it.count)}</span>
                  <span className="label text-right text-paper/50">
                    phiếu
                    <br />
                    {percent(it.count, votes)} người bình chọn
                  </span>
                </div>
                <div className="mt-3 h-[3px] bg-paper/10">
                  <motion.div
                    className={`h-full origin-left ${i === 0 ? "bg-shu" : "bg-paper"}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: it.count / max }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  />
                </div>
              </div>
            </article>
          ))}

          <div className="flex w-[78vw] shrink-0 flex-col justify-center md:w-[34vw]">
            <span className="label text-paper/50">Còn {total - items.length} tác phẩm nữa</span>
            <Link href="/leaderboard" className="group mt-5 block">
              <span className="display block text-[13vw] leading-[0.95] md:text-[6vw]">
                Xem toàn bộ
                <br />
                <span className="text-shu">bảng tổng sắp</span>
              </span>
              <span className="mt-8 grid size-20 place-items-center rounded-full border border-paper/30 text-2xl transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:border-shu group-hover:bg-shu">
                →
              </span>
            </Link>
          </div>
        </motion.div>

        {pinned && (
          <div className="absolute inset-x-16 bottom-9 flex items-center gap-5">
            <span className="label text-paper/50">01</span>
            <div className="h-px flex-1 bg-paper/15">
              <motion.div className="h-full origin-left bg-shu" style={{ scaleX: bar }} />
            </div>
            <span className="label text-paper/50">10</span>
          </div>
        )}
      </div>
    </section>
  );
}
