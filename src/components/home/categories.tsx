"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { Cover } from "@/components/ui/book";
import { FadeUp, LineRise } from "@/components/ui/reveal";
import { CATEGORIES } from "@/lib/config";
import type { CategoryKey } from "@/lib/config";
import type { Entry } from "@/lib/data";
import { nf, pad } from "@/lib/format";

export type CategoryRow = { key: CategoryKey; winner: Entry; total: number };

/** Category list. Hovering a row makes the winner's cover or logo follow the cursor. */
export default function Categories({ rows }: { rows: CategoryRow[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.5 });
  const y = useSpring(my, { stiffness: 180, damping: 22, mass: 0.5 });
  const active = hover === null ? null : rows[hover];

  return (
    <section className="relative bg-paper px-5 py-28 text-ink md:px-16 md:py-40">
      <div className="mb-14 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
        <h2 className="display text-[13vw] leading-[0.95] md:text-[7vw]">
          <LineRise lines={["Bốn hạng mục,", <span key="b" className="text-shu">bốn quán quân</span>]} />
        </h2>
        <FadeUp className="max-w-[36ch] text-[15px] leading-relaxed text-ink/70">
          Mỗi độc giả có tối đa mười phiếu cho Light Novel, năm cho Oneshot, ba cho Tân binh và ba cho Nhà phát hành.
          Đây là những cái tên đứng đầu.
        </FadeUp>
      </div>

      <ul
        onPointerMove={(e) => {
          mx.set(e.clientX);
          my.set(e.clientY);
        }}
        onPointerLeave={() => setHover(null)}
      >
        {rows.map((r, i) => {
          const c = CATEGORIES[r.key];
          return (
            <li key={r.key} onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}>
              <Link
                href={`/leaderboard?cat=${r.key}`}
                className="group relative grid grid-cols-[auto_1fr] items-baseline gap-x-5 border-t border-ink/20 py-7 last:border-b md:grid-cols-[5rem_1.3fr_1fr_auto] md:gap-x-8 md:py-9"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
                <span className="label relative text-ink/50 transition-colors duration-300 group-hover:text-shu md:pl-4">
                  {pad(i + 1)} <span className="font-jp normal-case tracking-normal">{c.jp}</span>
                </span>
                <span className="display relative text-[8.5vw] leading-none transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:text-paper md:text-[4.4vw]">
                  {c.short}
                </span>
                <span className="relative col-start-2 mt-3 transition-colors duration-300 group-hover:text-paper md:col-start-3 md:mt-0">
                  <span className="label block text-ink/50 transition-colors duration-300 group-hover:text-paper/50">
                    Quán quân
                  </span>
                  <span className="mt-1 block font-serif text-xl italic leading-snug md:text-2xl">{r.winner.name}</span>
                </span>
                <span className="relative col-start-2 mt-3 text-left transition-colors duration-300 group-hover:text-paper md:col-start-4 md:mt-0 md:pr-4 md:text-right">
                  <span className="display text-3xl tabular-nums md:text-[2.4vw]">{nf.format(r.winner.count)}</span>
                  <span className="label ml-2 text-ink/50 transition-colors duration-300 group-hover:text-paper/50">
                    phiếu
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
        style={{ x, y }}
        aria-hidden
      >
        <AnimatePresence mode="popLayout">
          {active && (
            <motion.div
              key={active.key}
              className="absolute -translate-y-1/2 translate-x-10 overflow-hidden shadow-2xl"
              style={{ width: active.winner.logo ? 220 : 210 }}
              initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 4 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {active.winner.logo ? (
                <div className="grid aspect-square place-items-center bg-white p-6">
                  <img src={active.winner.logo} alt="" className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="aspect-[400/568]">
                  <Cover name={active.winner.name} cover={active.winner.cover} color={active.winner.color} eager />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
