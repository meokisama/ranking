"use client";
import { useRef, useState } from "react";
import Cover, { inkOn } from "@/components/ui/cover";
import type { Entry } from "@/lib/data";
import { nf, pad, percent } from "@/lib/format";

const FALLBACKS = ["#8a3b2a", "#2f4a5c", "#5d5230", "#4a3552", "#2f4a3a", "#6a4326", "#3b3f52", "#7a5a2c"];
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/**
 * The whole ranking as one bookshelf. Every entry is a spine, and a spine is as thick as its votes:
 * the favourites are fat volumes at the left, and the long tail thins out to pamphlets.
 * One look gives the shape of the result; the pointer gives the detail.
 */
export default function Shelf({
  list,
  votes,
  sub,
  onPick,
}: {
  list: Entry[];
  votes: number;
  sub: (e: Entry) => string;
  onPick: (e: Entry) => void;
}) {
  const max = list[0].count;
  const [tip, setTip] = useState<Entry | null>(null);
  const card = useRef<HTMLDivElement>(null);

  const move = (ev: React.PointerEvent) => {
    const el = card.current;
    if (!el) return;
    const w = el.offsetWidth;
    const x = Math.min(window.innerWidth - w - 12, Math.max(12, ev.clientX + 18));
    const y = Math.max(12, ev.clientY - el.offsetHeight - 18);
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <div onPointerMove={move} onPointerLeave={() => setTip(null)}>
      <ol
        className="shelf flex flex-wrap items-end gap-x-[2px] gap-y-9 [--h:150px] [--w:78px] md:[--h:230px] md:[--w:132px]"
        aria-label="Kệ sách: mỗi gáy sách là một cái tên, độ dày là số phiếu"
      >
        {list.map((e, i) => {
          const share = e.count / max;
          const bg = e.color ?? FALLBACKS[hash(e.name) % FALLBACKS.length];
          const tall = 0.74 + ((hash(e.name) >> 3) % 26) / 100;
          const wide = share > 0.16;
          return (
            <li key={e.id} className="flex h-[var(--h)] items-end">
              <button
                onClick={() => onPick(e)}
                onPointerEnter={() => setTip(e)}
                onFocus={() => setTip(e)}
                aria-label={`Hạng ${e.rank}: ${e.name}, ${nf.format(e.count)} phiếu`}
                className="spine relative flex flex-col items-center justify-between overflow-hidden rounded-t-[2px] py-2 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-3 focus-visible:-translate-y-3"
                style={{
                  width: `max(3px, calc(var(--w) * ${share.toFixed(4)}))`,
                  height: `${(tall * 100).toFixed(1)}%`,
                  background: bg,
                  color: inkOn(bg),
                  animationDelay: `${Math.min(i, 70) * 14}ms`,
                }}
              >
                {wide && <span className="num text-[0.8rem] leading-none md:text-base">{pad(e.rank)}</span>}
                {wide && (
                  <span className="display min-h-0 flex-1 overflow-hidden py-2 text-[0.72rem] leading-[1.05] [text-orientation:mixed] [writing-mode:vertical-rl] md:text-[1.02rem]">
                    <span className="line-clamp-2 rotate-180">{e.name}</span>
                  </span>
                )}
                {wide && <span className="h-px w-2/3 bg-current opacity-50" />}
              </button>
            </li>
          );
        })}
      </ol>

      <div
        ref={card}
        className={`pointer-events-none fixed left-0 top-0 z-[60] flex w-72 items-center gap-4 rounded-[3px] bg-ink p-3 text-paper shadow-2xl transition-opacity duration-300 ${
          tip ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        {tip && (
          <>
            {tip.logo ? (
              <span className="grid size-16 shrink-0 place-items-center rounded-[2px] bg-white p-2">
                <img src={tip.logo} alt="" className="max-h-full max-w-full object-contain" />
              </span>
            ) : (
              <Cover name={tip.name} cover={tip.cover} color={tip.color} className="w-16 shrink-0" eager />
            )}
            <div className="min-w-0">
              <span className="label text-shu">Hạng {pad(tip.rank)}</span>
              <p className="display mt-1 line-clamp-2 text-lg leading-[1.08]">{tip.name}</p>
              <p className="label mt-1 truncate text-paper/55">{sub(tip)}</p>
              <p className="mt-2 text-sm">
                <span className="num text-xl">{nf.format(tip.count)}</span> <span className="text-paper/60">phiếu · {percent(tip.count, votes)}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
