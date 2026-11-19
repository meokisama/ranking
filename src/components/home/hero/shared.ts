import { useEffect } from "react";

export type HeroBook = { cover: string; color: string; name: string; publisher: string };

export const INK = "#0c0b0a";
export const PAPER = "#efe9dd";
export const SHU = "#f0421c";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const easeInOut = (t: number) => t * t * (3 - 2 * t);

/** Seeded random numbers so the layout is identical on every load. */
export function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** State shared across scene components without triggering re-renders. */
export const live = { scroll: 0, spin: 0, vel: 0, introAt: -1 };

export function useScrollAndDrag() {
  useEffect(() => {
    const onScroll = () => {
      live.scroll = clamp01(window.scrollY / (window.innerHeight * 0.9));
    };
    let lastX: number | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.buttons !== 1) {
        lastX = null;
        return;
      }
      if (lastX !== null) live.vel += (e.clientX - lastX) * 0.00035;
      lastX = e.clientX;
    };
    const onUp = () => {
      lastX = null;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);
}
