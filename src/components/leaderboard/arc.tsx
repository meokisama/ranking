"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Mark } from "@/components/ui/cover";
import { Dot, Lines } from "@/components/ui/reveal";
import { labelParts } from "@/lib/data";
import type { Entry, Period } from "@/lib/data";
import { nf, pad, percent } from "@/lib/format";
import { EASE } from "@/lib/motion";

const COUNT = 10;
const AUTO_MS = 3000;

/**
 * One book on the wheel. The outer box turns about the wheel's hub, far below the stage; the inner box
 * grows and turns its face to the reader as it reaches the top.
 */
function Spoke({
  e,
  i,
  pos,
  geo,
  onClick,
}: {
  e: Entry;
  i: number;
  pos: MotionValue<number>;
  geo: { cx: number; cy: number; r: number; w: number; step: number };
  onClick: () => void;
}) {
  const h = e.logo ? geo.w : geo.w * (568 / 400);
  const turn = useTransform(pos, (p) => `rotate(${(i - p) * geo.step}deg)`);
  const face = useTransform(pos, (p) => {
    const d = i - p;
    const near = Math.max(0, 1 - Math.abs(d));
    return `perspective(1400px) rotateY(${Math.max(-40, Math.min(40, -d * 14))}deg) scale(${0.84 + near * 0.32})`;
  });
  const opacity = useTransform(pos, (p) => 1 - Math.min(1, Math.max(0, Math.abs(i - p) - 2.6) / 1.2));
  // Coarse steps: the stacking order only needs to change as a book passes the one beside it, and every change repaints.
  const zIndex = useTransform(pos, (p) => 100 - Math.round(Math.abs(i - p) * 2));
  // The shadow deepens as the book reaches the top. An animated drop-shadow is re-rasterised every frame, so instead
  // two fixed shadows are painted once and only the opacity of the deeper one moves.
  const deep = useTransform(pos, (p) => Math.max(0, 1 - Math.abs(i - p)));

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{
        left: geo.cx - geo.w / 2,
        top: geo.cy - h / 2,
        width: geo.w,
        height: h,
        transformOrigin: `50% ${h / 2 + geo.r}px`,
        transform: turn,
        opacity,
        zIndex,
      }}
    >
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={`Hạng ${e.rank}: ${e.name}`}
        tabIndex={-1}
        className="relative block w-full cursor-pointer select-none will-change-transform"
        style={{ transform: face }}
      >
        <span className="pointer-events-none absolute inset-0 rounded-[2px] shadow-[0_18px_44px_rgb(22_18_14/0.22)]" aria-hidden />
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-[2px] shadow-[0_40px_84px_rgb(22_18_14/0.3)] will-change-[opacity]"
          style={{ opacity: deep }}
          aria-hidden
        />
        <span className="relative block">
          <Mark e={e} eager className="w-full" />
        </span>
      </motion.button>
    </motion.div>
  );
}

/**
 * The hero of the leaderboard: the leading ten of the chosen category fanned out on a wheel of covers.
 * The one at the top is the one being read; its place stands huge behind it in vermilion, and its count beside the title.
 * Drag the wheel, use the arrows, click a cover, or let it turn on its own.
 */
export default function CoverArc({
  period,
  list,
  unit,
  catLabel,
  sub,
}: {
  period: Period;
  list: Entry[];
  unit: string;
  catLabel: string;
  sub: (e: Entry) => string;
}) {
  const items = list.slice(0, COUNT);
  const n = items.length;
  const stage = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [poke, setPoke] = useState(0);
  const src = useMotionValue(0);
  const pos = useSpring(src, { stiffness: 90, damping: 20, mass: 0.9 });
  const drag = useRef<{ x: number; from: number; moved: boolean } | null>(null);
  const dragged = useRef(false);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = (i: number) => {
    const k = Math.max(0, Math.min(n - 1, i));
    setActive(k);
    src.set(k);
  };

  // Restarts the countdown, even when the reader lands on the book already shown.
  const touch = () => setPoke((p) => p + 1);

  // A new category starts again from its leader.
  useEffect(() => {
    setActive(0);
    src.set(0);
  }, [list, src]);

  // Paused only while the wheel is being dragged.
  useEffect(() => {
    if (dragging || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => go(active + 1 >= n ? 0 : active + 1), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [active, dragging, n, poke]);

  const wide = size.w >= 640;
  const w = wide ? Math.min(size.h * 0.4, 300) : Math.min(size.w * 0.44, 180);
  const r = Math.max(size.h * 1.15, wide ? 760 : 560);
  const geo = { cx: size.w / 2, cy: size.h * (wide ? 0.57 : 0.55), r, w, step: ((w * 1.02) / r) * (180 / Math.PI) };

  useEffect(() => {
    const move = (ev: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = ev.clientX - d.x;
      if (Math.abs(dx) > 6) d.moved = true;
      src.set(Math.max(-0.4, Math.min(n - 0.6, d.from - dx / (w * 1.05))));
    };
    const up = () => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      dragged.current = d.moved;
      setDragging(false);
      touch();
      go(Math.round(src.get()));
      setTimeout(() => (dragged.current = false), 0);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [n, w, src]);

  const e = items[active];
  const max = items[0].count;
  const [name, year] = labelParts(period.label);

  return (
    <header className="relative isolate overflow-hidden pb-10 pt-[4.5rem] md:h-[100svh] md:max-h-[1000px] md:min-h-[680px] md:pb-0 md:pt-24">
      <div className="label relative z-10 flex items-center gap-4 px-5 text-mute md:px-10">
        <span className="shrink-0">
          <Dot />
          Bảng tổng sắp · {period.long}
        </span>
        <span className="h-px flex-1 bg-ink/15" />
        <span className="hidden shrink-0 sm:block">{nf.format(period.votes)} lượt bình chọn hợp lệ</span>
      </div>

      <div className="relative z-10 mt-6 px-5 md:absolute md:left-10 md:top-32 md:mt-0 md:px-0">
        <Lines as="h1" className="display text-[17vw] leading-[0.86] md:text-[min(8.6vw,15svh)]" label={`Bảng tổng sắp ${period.label}`}>
          {name}
          <>
            <i className="text-shu">{year}</i>
            <span className="text-shu">.</span>
          </>
        </Lines>
      </div>

      {/* The wheel. */}
      <div
        ref={stage}
        className="relative mt-4 h-[25rem] touch-pan-y select-none md:absolute md:inset-y-0 md:left-[30%] md:right-0 md:mt-0 md:h-auto"
        onPointerDown={(ev) => {
          if (ev.pointerType === "mouse" && ev.button !== 0) return;
          drag.current = { x: ev.clientX, from: src.get(), moved: false };
          setDragging(true);
        }}
        onKeyDown={(ev) => {
          if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
          touch();
          go(active + (ev.key === "ArrowRight" ? 1 : -1));
        }}
        tabIndex={0}
        role="group"
        aria-roledescription="vòng bìa sách"
        aria-label={`${n} ${unit} dẫn đầu hạng mục ${catLabel}. Dùng phím mũi tên để xoay.`}
        style={{
          cursor: "grab",
          // the wheel runs out under the paper: at its foot, and on the side where the title and the reading sit
          maskImage: wide
            ? "linear-gradient(90deg, transparent, #000 24%), linear-gradient(0deg, transparent, #000 18%)"
            : "linear-gradient(0deg, transparent, #000 14%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        {/* the place, set huge behind the book that holds it */}
        <div className="pointer-events-none absolute inset-x-0 top-[6%] flex justify-center md:top-[8%]" aria-hidden>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={e.id}
              className="num block text-[min(58vw,26rem)] leading-[0.8] text-shu/[0.13] md:text-[min(34vw,64svh)]"
              initial={{ opacity: 0, transform: "translateY(40px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: "translateY(-40px)" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {pad(e.rank)}
            </motion.span>
          </AnimatePresence>
        </div>

        {size.w > 0 &&
          items.map((it, i) => (
            <Spoke
              key={it.id}
              e={it}
              i={i}
              pos={pos}
              geo={geo}
              onClick={() => {
                if (dragged.current) return;
                touch();
                go(i);
              }}
            />
          ))}

      </div>

      {/* What is on top of the wheel. */}
      <div className="relative z-[130] px-5 md:absolute md:bottom-12 md:left-10 md:w-[30%] md:px-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={e.id}
            initial={{ opacity: 0, transform: "translateY(14px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={{ opacity: 0, transform: "translateY(-8px)", transition: { duration: 0.2 } }}
            transition={{ duration: 0.6, ease: EASE }}
            aria-live="polite"
          >
            <span className="label text-shu">
              Hạng {pad(e.rank)} <span className="text-mute">· {catLabel}</span>
            </span>
            <p className="display mt-2 line-clamp-3 text-[1.7rem] leading-[1.04] md:text-[clamp(1.6rem,2.3vw,2.4rem)]">{e.name}</p>
            <p className="label mt-2 truncate text-mute">{sub(e)}</p>
            <div className="mt-5 h-1.5 rounded-[1px] bg-ink/[0.08]">
              <motion.div
                className="h-full origin-left rounded-[1px]"
                style={{ background: e.color ?? "var(--color-shu)", width: `${(e.count / max) * 100}%` }}
                initial={{ transform: "scaleX(0)" }}
                animate={{ transform: "scaleX(1)" }}
                transition={{ duration: 1, ease: EASE }}
              />
            </div>
            <p className="mt-2.5 flex items-baseline justify-between gap-3">
              <span>
                <span className="num text-[2.2rem] leading-none">{nf.format(e.count)}</span> <span className="label text-mute">phiếu</span>
              </span>
              <span className="label text-right text-mute">
                {percent(e.count, period.votes)}
                {e.rank > 1 && ` · kém ${nf.format(max - e.count)}`}
              </span>
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex gap-1.5">
            {[
              [-1, ArrowLeft, "Lùi một hạng"],
              [1, ArrowRight, "Tiến một hạng"],
            ].map(([d, Icon, label]) => {
              const I = Icon as typeof ArrowLeft;
              return (
                <button
                  key={label as string}
                  onClick={() => {
                    touch();
                    go(active + (d as number));
                  }}
                  disabled={active + (d as number) < 0 || active + (d as number) >= n}
                  aria-label={label as string}
                  className="grid size-10 place-items-center rounded-full border border-ink/20 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
                >
                  <I className="size-4" aria-hidden />
                </button>
              );
            })}
          </div>
          <ol className="flex flex-1 gap-1" aria-label="Chọn hạng">
            {items.map((it, i) => (
              <li key={it.id} className="flex-1">
                <button
                  onClick={() => {
                    touch();
                    go(i);
                  }}
                  aria-label={`Hạng ${it.rank}`}
                  aria-current={i === active ? "true" : undefined}
                  className={`num w-full border-t-2 pt-1.5 text-left text-[0.8rem] transition-colors duration-500 ${
                    i === active ? "border-shu text-shu" : "border-ink/15 text-ink/40 hover:border-ink/50 hover:text-ink"
                  }`}
                >
                  {pad(it.rank)}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </header>
  );
}
