"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { intro } from "@/lib/intro";

const MIN_MS = 1500;
const MAX_MS = 6000;

/** Loading screen: counts to 100 while the 3D scene loads the covers, then lifts the curtain. */
export default function Preloader({ period }: { period: string }) {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (intro.revealed) {
      setDone(true);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      // Time drives the count to 90; the last 10 wait for the scene to be ready.
      const timed = Math.min(1, elapsed / MIN_MS);
      const ready = intro.ready || elapsed > MAX_MS || reduce;
      const target = ready ? timed * 100 : Math.min(90, timed * 90);
      setN((prev) => Math.max(prev, Math.round(target)));
      if (ready && timed >= 1) {
        setDone(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => intro.setRevealed(), 350);
      lenis?.start();
      return () => clearTimeout(t);
    }
    lenis?.stop();
  }, [done, lenis]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col justify-between bg-shu p-5 text-ink md:p-8"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          aria-live="polite"
          aria-label="Đang tải"
        >
          <div className="flex justify-between">
            <span className="label">Bảng xếp hạng Light Novel Việt Nam</span>
            <span className="label">{period}</span>
          </div>
          <div className="pointer-events-none absolute inset-0 text-ink/15 tone-lg" aria-hidden />
          <div className="relative flex items-end justify-between">
            <span className="tategaki text-lg">読み込み中</span>
            <span className="display text-[34vw] leading-[0.8] tabular-nums md:text-[22vw]">
              {String(n).padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
