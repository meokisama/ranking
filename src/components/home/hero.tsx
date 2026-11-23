"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { progressOfEntry } from "@/components/book/scene";
import type { BookScene } from "@/components/book/scene";
import Cover from "@/components/ui/cover";
import type { Entry } from "@/lib/data";
import { nf, pad, percent } from "@/lib/format";
import { EASE } from "@/lib/motion";

const RAIL = 300; // px kept free for each side column on wide screens

/**
 * The library behind the cover: columns of the period's covers drifting slowly up and down,
 * printed pale into the paper so the title stays in front. They clear away as the book opens.
 */
function Shelves({ covers }: { covers: string[] }) {
  const cols = 7;
  const per = Math.ceil(covers.length / cols);
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[72%]"
      style={{
        maskImage: "linear-gradient(90deg, transparent 0%, #000 34%, #000 100%), linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
      aria-hidden
    >
      <div className="absolute -inset-y-[10%] inset-x-0 flex gap-3 md:gap-4" style={{ transform: "rotate(-6deg) scale(1.15)" }}>
        {Array.from({ length: cols }, (_, c) => {
          const list = covers.slice(c * per, c * per + per);
          return (
            <div key={c} className="relative flex-1">
              <div
                className="shelf-col flex flex-col gap-3 md:gap-4"
                style={{ animationDuration: `${70 + c * 9}s`, animationDirection: c % 2 ? "reverse" : "normal" }}
              >
                {[...list, ...list].map((src, i) => (
                  <img key={i} src={src} alt="" loading="lazy" className="aspect-[400/568] w-full rounded-[2px] object-cover" />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* the paper washes over the prints, leaving their colour as a memory */}
      <div className="absolute inset-0 bg-paper/[0.82]" />
    </div>
  );
}

/**
 * The cover and the ceremony in one pinned scene. A cloth-bound book floats beside the title;
 * scrolling lays it on the table, opens it at its contents, and turns one leaf per place.
 */
export default function Hero({
  items,
  votes,
  total,
  period,
  publishers,
  shelf,
}: {
  items: Entry[];
  votes: number;
  total: number;
  period: string;
  publishers: number;
  shelf: string[];
}) {
  const track = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<BookScene | null>(null);
  const [spread, setSpread] = useState(-2); // -2 closed, -1 contents, 0.. lowest place up
  const [noGl, setNoGl] = useState(false);
  const lenis = useLenis();
  const n = items.length;

  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });
  useMotionValueEvent(p, "change", (v) => scene.current?.setProgress(v));

  useEffect(() => {
    let dead = false;
    let made: BookScene | null = null;
    const inset = () => made?.setInset(window.innerWidth >= 1024 ? RAIL : 0);
    import("@/components/book/scene").then(({ createBookScene }) => {
      if (dead || !canvas.current) return;
      made = createBookScene(
        canvas.current,
        items.map((e) => ({
          rank: e.rank,
          name: e.name,
          publisher: e.publisher ?? "",
          count: e.count,
          cover: e.cover ?? null,
          color: e.color ?? "#d6361b",
        })),
        { period, votes }
      );
      if (!made) return setNoGl(true);
      scene.current = made;
      made.onSpread = setSpread;
      made.setProgress(p.get());
      inset();
    });
    window.addEventListener("resize", inset);
    return () => {
      dead = true;
      window.removeEventListener("resize", inset);
      made?.dispose();
      scene.current = null;
    };
  }, [items, period, votes]);

  const order = [...items].sort((a, b) => b.rank - a.rank); // lowest place first
  const jump = (i: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + (el.offsetHeight - window.innerHeight) * progressOfEntry(i, n);
    if (lenis) lenis.scrollTo(y, { duration: 1.8 });
    else window.scrollTo({ top: y });
  };

  const introOpacity = useTransform(p, [0, 0.045, 0.09], [1, 1, 0]);
  const introY = useTransform(p, [0, 0.09], [0, -60]);
  const introVisibility = useTransform(introOpacity, (v) => (v < 0.02 ? "hidden" : "visible"));
  const shelfOpacity = useTransform(p, [0, 0.03, 0.11], [1, 1, 0]);
  const shelfScale = useTransform(p, [0, 0.11], [1, 1.12]);
  // Once the shelves have faded out, stop their drift and take them out of compositing.
  const shelfVisibility = useTransform(shelfOpacity, (v) => (v < 0.01 ? "hidden" : "visible"));
  const readOpacity = useTransform(p, [0.1, 0.15], [0, 1]);
  const readVisibility = useTransform(readOpacity, (v) => (v < 0.02 ? "hidden" : "visible"));
  const bar = useTransform(p, [0.12, 1], [0, 1]);

  const e = spread >= 0 ? order[spread] : null;
  const first = items.find((x) => x.rank === 1)!;
  const max = first.count;

  return (
    <section ref={track} className="relative" style={{ height: `${(n + 2) * 95 + 120}svh` }} aria-label={`${n} tác phẩm dẫn đầu`}>
      <ol className="sr-only">
        {items.map((it) => (
          <li key={it.id}>
            Hạng {it.rank}: {it.name}, {it.publisher}, {nf.format(it.count)} phiếu
          </li>
        ))}
      </ol>

      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="shelves absolute inset-0" style={{ opacity: shelfOpacity, scale: shelfScale, visibility: shelfVisibility }}>
          <Shelves covers={shelf} />
        </motion.div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(46% 52% at 70% 50%, rgb(250 245 233 / 0.85), transparent 72%)" }}
          aria-hidden
        />

        {/* The title, under the book so the book can lie across it. */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex flex-col px-5 pt-[4.5rem] md:px-10 md:pt-24"
          style={{ opacity: introOpacity, y: introY, visibility: introVisibility }}
        >
          <div className="label flex items-center gap-4 text-mute">
            <span className="shrink-0">
              <span className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-shu" />
              {period}
            </span>
            <span className="h-px flex-1 bg-ink/15" />
            <span className="shrink-0">{nf.format(votes)} lá phiếu</span>
          </div>

          <div className="mt-auto pb-[24svh] md:my-auto md:pb-[6svh]">
            <motion.p className="label mb-6 text-mute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
              Ấn bản độc giả · từ năm 2018
            </motion.p>
            <h1
              className="display text-[clamp(3rem,min(9.4vw,15.5svh),12.5rem)] leading-[0.9] tracking-[-0.05em]"
              data-lines="in"
              aria-label="Bảng xếp hạng Light Novel Việt Nam"
            >
              <span className="line-mask" aria-hidden>
                <span style={{ animationDelay: "0.2s" }}>Bảng xếp hạng</span>
              </span>
              <span className="line-mask" aria-hidden>
                <span style={{ animationDelay: "0.32s" }} className="display-i text-shu">
                  Light Novel
                </span>
              </span>
              <span className="line-mask" aria-hidden>
                <span style={{ animationDelay: "0.44s" }}>
                  Việt Nam<span className="text-shu">.</span>
                </span>
              </span>
            </h1>
          </div>
        </motion.div>

        <canvas ref={canvas} className="pointer-events-none absolute inset-0 size-full" aria-hidden />

        {/* The foot of the cover page. */}
        <motion.div className="absolute inset-x-5 bottom-6 md:inset-x-10 md:bottom-8" style={{ opacity: introOpacity, visibility: introVisibility }}>
          <div className="grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-12">
            <motion.p
              className="hidden max-w-[36ch] text-[0.92rem] text-ink/75 md:block"
              initial={{ opacity: 0, transform: "translateY(16px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 1.2, delay: 0.7, ease: EASE }}
            >
              Mỗi kỳ, hàng nghìn độc giả cùng gọi tên những cuốn sách đã ở lại với mình. Tất cả được đóng thành một cuốn.
              <span className="mt-3 flex items-center gap-2 text-mute">
                <ArrowDown className="size-3.5 animate-bounce" aria-hidden />
                <span className="label">Cuộn để mở sách</span>
              </span>
            </motion.p>
            <motion.dl
              className="hair grid grid-cols-3 border-t pt-3 md:gap-10 md:border-t-0 md:pt-0"
              initial={{ opacity: 0, transform: "translateY(16px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 1.2, delay: 0.85, ease: EASE }}
            >
              {[
                [nf.format(votes), "Lá phiếu"],
                [String(total), "Tác phẩm"],
                [String(publishers), "Nhà phát hành"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dd className="num text-[1.9rem] leading-none md:text-[2.6rem]">{v}</dd>
                  <dt className="label mt-2 text-mute">{l}</dt>
                </div>
              ))}
            </motion.dl>
            <motion.div
              className="hidden items-center gap-4 rounded-[3px] bg-card p-2.5 pr-5 shadow-[0_0_0_1px_rgb(22_18_14/0.08),0_20px_40px_-28px_rgb(22_18_14/0.5)] lg:flex"
              initial={{ opacity: 0, transform: "translateY(16px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 1.2, delay: 1, ease: EASE }}
            >
              <Cover name={first.name} cover={first.cover} color={first.color} className="w-14 shrink-0" eager />
              <div className="max-w-[15rem]">
                <span className="label text-shu">Quán quân kỳ này</span>
                <p className="display mt-1 line-clamp-2 text-[1.15rem] leading-[1.08]">{first.name}</p>
                <p className="label mt-1 text-mute">{nf.format(first.count)} phiếu</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* While the book is being read */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: readOpacity, visibility: readVisibility }}>
          <div className="label absolute inset-x-5 top-[4.5rem] flex justify-between text-mute md:inset-x-10 md:top-24">
            <span>
              <span className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-shu" />
              {n} tác phẩm dẫn đầu · {period}
            </span>
            <span className="hidden sm:block">{e ? `Trang ${pad(spread + 1)} / ${pad(n)}` : "Mục lục"}</span>
          </div>

          <ol className="pointer-events-auto absolute left-10 top-1/2 hidden w-[17rem] -translate-y-1/2 lg:block" aria-label="Lật tới hạng">
            {[...order].reverse().map((it) => {
              const i = order.indexOf(it);
              const on = e?.id === it.id;
              return (
                <li key={it.id}>
                  <button
                    onClick={() => jump(i)}
                    aria-current={on ? "true" : undefined}
                    className={`group grid w-full grid-cols-[3rem_1fr] items-baseline gap-2 border-t py-3 text-left transition-colors duration-500 ${
                      on ? "border-shu text-shu" : "hair text-ink/70 hover:text-ink"
                    }`}
                  >
                    <span className="num text-3xl">{pad(it.rank)}</span>
                    <span className="min-w-0">
                      <span className="display block truncate text-[1.05rem]">{it.name}</span>
                      <span className="mt-1.5 block h-[3px] bg-ink/[0.07]">
                        <span className={`block h-full transition-colors duration-500 ${on ? "bg-shu" : "bg-ink/25"}`} style={{ width: `${(it.count / max) * 100}%` }} />
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="absolute right-10 top-1/2 hidden w-[17rem] -translate-y-1/2 lg:block">
            {e ? (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, filter: "blur(8px)", transform: "translateY(18px)" }}
                animate={{ opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <span className="label text-mute">Hạng</span>
                <p className="num text-[8.5rem] leading-[0.8] text-shu">{pad(e.rank)}</p>
                <p className="display mt-5 line-clamp-4 text-[1.7rem] leading-[1.05]">{e.name}</p>
                <p className="label mt-3 text-mute">{e.publisher}</p>
                <div className="hair mt-6 border-t pt-4">
                  <p className="num text-[2.8rem] leading-none">{nf.format(e.count)}</p>
                  <p className="label mt-2 text-mute">phiếu · {percent(e.count, votes)} độc giả</p>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                <span className="label text-mute">Mở đầu</span>
                <p className="display mt-3 text-[2.4rem] leading-[1]">
                  {n} cái tên,
                  <br />
                  <i className="text-shu">{n} trang sách.</i>
                </p>
                <p className="mt-4 text-[0.9rem] text-ink/70">Lật từ hạng {n} tới hạng nhất. Chọn một cái tên bên trái để lật thẳng tới trang đó.</p>
              </motion.div>
            )}
          </div>

          {e && (
            <div key={e.id} className="absolute inset-x-5 bottom-24 lg:hidden">
              <div className="flex items-end gap-3">
                <span className="num text-6xl leading-none text-shu">{pad(e.rank)}</span>
                <span className="label pb-1 text-mute">
                  {nf.format(e.count)} phiếu · {percent(e.count, votes)}
                </span>
              </div>
              <p className="display mt-3 line-clamp-2 text-[1.6rem] leading-[1.05]">{e.name}</p>
            </div>
          )}

          <div className="pointer-events-auto absolute inset-x-5 bottom-6 md:inset-x-10 md:bottom-8">
            <div className="flex items-end justify-between gap-4">
              <ol className="flex flex-1 gap-1 lg:hidden" aria-label="Lật tới hạng">
                {order.map((it, i) => (
                  <li key={it.id} className="flex-1">
                    <button
                      onClick={() => jump(i)}
                      aria-label={`Lật tới hạng ${it.rank}`}
                      className={`num w-full border-t pt-2 text-left text-base transition-colors duration-500 ${
                        i === spread ? "border-shu text-shu" : i < spread ? "border-ink text-ink" : "border-ink/20 text-ink/35"
                      }`}
                    >
                      {pad(it.rank)}
                    </button>
                  </li>
                ))}
              </ol>
              <span className="label hidden text-mute lg:block">Cuộn để lật trang</span>
              <Link href="/leaderboard" className="btn hidden shrink-0 md:inline-flex">
                Toàn bộ {total} tác phẩm
                <span className="disc">
                  <ArrowRight aria-hidden />
                </span>
              </Link>
            </div>
            <div className="mt-3 h-px bg-ink/10">
              <motion.div className="h-px origin-left bg-shu" style={{ scaleX: bar }} />
            </div>
          </div>
        </motion.div>

        {noGl && e && (
          <div className="absolute inset-0 grid place-items-center px-5" aria-hidden>
            <div className="flex max-w-3xl items-center gap-8">
              {e.cover && <img src={e.cover} alt="" className="w-40 rounded-[2px] shadow-2xl md:w-64" />}
              <div>
                <span className="num text-8xl text-shu">{pad(e.rank)}</span>
                <p className="display mt-3 text-3xl md:text-5xl">{e.name}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
