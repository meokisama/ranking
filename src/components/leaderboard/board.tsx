"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { Search, X } from "lucide-react";
import Cover from "@/components/ui/cover";
import Rise, { Kicker, Lines } from "@/components/ui/reveal";
import { CATEGORIES } from "@/lib/config";
import type { CategoryKey } from "@/lib/config";
import type { Entry, Period } from "@/lib/data";
import { fold, nf, pad, percent } from "@/lib/format";
import { EASE } from "@/lib/motion";
import Demographics from "./demographics";
import Shelf from "./shelf";

const PAGE = 30;

/** Secondary line of an entry: its publisher, or the works an illustrator is known for. */
const subOf = (e: Entry) => e.publisher ?? e.works?.join(" · ") ?? "";

function Thumb({ e, className = "" }: { e: Entry; className?: string }) {
  return e.logo ? (
    <span className={`grid aspect-square place-items-center rounded-[2px] bg-white p-[14%] shadow-[0_0_0_1px_rgb(22_18_14/0.12)] ${className}`}>
      <img src={e.logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
    </span>
  ) : (
    <Cover name={e.name} cover={e.cover} color={e.color} sub={subOf(e)} className={className} />
  );
}

/** A bar in the book's own colour, the same colour as its spine on the shelf: as long as its votes go. */
function Thickness({ e, max, delay = 0, className = "" }: { e: Entry; max: number; delay?: number; className?: string }) {
  return (
    <div className={`relative h-3.5 rounded-[2px] bg-ink/[0.07] ${className}`} aria-hidden>
      <motion.div
        className="absolute inset-y-0 left-0 origin-left rounded-[2px]"
        style={{ width: `${Math.max(1.5, (e.count / max) * 100)}%`, background: e.color ?? "var(--color-shu)" }}
        initial={{ transform: "scaleX(0)" }}
        whileInView={{ transform: "scaleX(1)" }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, delay, ease: EASE }}
      />
    </div>
  );
}

function Medal({ e, votes, max, place }: { e: Entry; votes: number; max: number; place: number }) {
  return (
    <motion.li
      className="group grid grid-cols-[5.5rem_1fr] items-end gap-5 md:block"
      initial={{ opacity: 0, transform: "translateY(40px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 1.1, delay: 0.08 + place * 0.1, ease: EASE }}
    >
      <div className="md:flex md:items-end md:justify-between">
        <span
          className={`num hidden leading-[0.78] md:block ${place === 0 ? "text-[clamp(6rem,10vw,13rem)] text-shu" : "text-[clamp(4.5rem,7.4vw,10rem)]"}`}
        >
          {pad(e.rank)}
        </span>
        <Thumb
          e={e}
          className={`w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2 ${place === 0 ? "md:w-[42%] md:max-w-64" : "md:w-[34%] md:max-w-52"}`}
        />
      </div>
      <div className="min-w-0 md:mt-6">
        <span className={`num text-4xl md:hidden ${place === 0 ? "text-shu" : ""}`}>{pad(e.rank)}</span>
        <h3 className="display mt-1 line-clamp-3 text-[1.5rem] leading-[1.04] md:mt-0 md:text-[2.1vw]">{e.name}</h3>
        <p className="label mt-2 truncate text-mute">{subOf(e)}</p>
        <Thickness e={e} max={max} delay={0.3 + place * 0.1} className="mt-4" />
        <p className="mt-2 flex items-baseline justify-between">
          <span className="num text-3xl">{nf.format(e.count)}</span>
          <span className="label text-mute">phiếu · {percent(e.count, votes)}</span>
        </p>
      </div>
    </motion.li>
  );
}

function Row({ e, max, votes, lit }: { e: Entry; max: number; votes: number; lit: boolean }) {
  return (
    <li
      id={`e-${e.id}`}
      className={`hair group grid scroll-mt-40 grid-cols-[2.4rem_2.6rem_1fr_auto] items-center gap-x-3 border-b py-3.5 transition-colors duration-700 md:grid-cols-[4rem_2.8rem_minmax(0,1.3fr)_minmax(0,1.2fr)_5.5rem_4rem] md:gap-x-6 ${
        lit ? "bg-shu/10" : "hover:bg-card"
      }`}
    >
      <span className={`num pl-1 text-2xl md:text-[1.9rem] ${e.rank <= 3 ? "text-shu" : ""}`}>{pad(e.rank)}</span>
      <Thumb e={e} className="w-full" />
      <div className="min-w-0">
        <p className="display line-clamp-2 text-[1.12rem] leading-[1.12] md:text-[1.35rem]">{e.name}</p>
        <p className="label mt-1 truncate text-mute">{subOf(e)}</p>
        <Thickness e={e} max={max} className="mt-2 md:hidden" />
      </div>
      <Thickness e={e} max={max} className="hidden md:block" />
      <span className="num pr-1 text-right text-xl md:pr-0 md:text-2xl">{nf.format(e.count)}</span>
      <span className="label hidden pr-1 text-right text-mute md:block">{percent(e.count, votes)}</span>
    </li>
  );
}

export default function Board({ period, periods }: { period: Period; periods: { slug: string; label: string; href: string }[] }) {
  const keys = Object.keys(period.categories) as CategoryKey[];
  const [cat, setCat] = useState<CategoryKey>(keys[0]);
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [lit, setLit] = useState<number | null>(null);
  const lenis = useLenis();

  // Read ?cat= after mount so the page stays fully static.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("cat") as CategoryKey | null;
    if (c && keys.includes(c)) setCat(c);
  }, []);

  const choose = (c: CategoryKey) => {
    if (c === cat) return;
    setCat(c);
    setQ("");
    setLimit(PAGE);
    setLit(null);
    const url = new URL(window.location.href);
    url.searchParams.set("cat", c);
    window.history.replaceState(null, "", url);
  };

  const list = period.categories[cat]!;
  const meta = CATEGORIES[cat];
  const max = list[0].count;
  const rows = useMemo(() => {
    if (!q.trim()) return list;
    const needle = fold(q.trim());
    return list.filter((e) => fold(e.name).includes(needle) || fold(subOf(e)).includes(needle));
  }, [list, q]);
  const shown = rows.slice(0, limit);

  // A spine on the shelf leads to its line in the list.
  const pick = (e: Entry) => {
    setQ("");
    setLimit((l) => Math.max(l, e.rank + 5));
    setLit(e.id);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const el = document.getElementById(`e-${e.id}`);
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { offset: -window.innerHeight * 0.35, duration: 1.4 });
        else el.scrollIntoView({ block: "center" });
      }),
    );
  };

  return (
    <main>
      <header className="relative overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pb-14 md:pt-36">
        <Kicker no="●" right={`${nf.format(period.votes)} lượt bình chọn hợp lệ`}>
          Bảng tổng sắp · {period.long}
        </Kicker>
        <div className="mt-6 grid items-end gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <Lines as="h1" className="display text-[17vw] md:text-[11vw]" label={period.label}>
              {period.label.split(" · ")[0]}
              <>
                <i className="text-shu">{period.label.split(" · ")[1]}</i>
                <span className="text-shu">.</span>
              </>
            </Lines>
            <dl className="hair mt-8 grid max-w-xl grid-cols-3 border-t pt-4">
              {keys.map((k) => (
                <div key={k}>
                  <dd className="num text-3xl md:text-4xl">{period.categories[k]!.length}</dd>
                  <dt className="label mt-1 text-mute">{CATEGORIES[k].short}</dt>
                </div>
              )).slice(0, 3)}
            </dl>
          </div>
          {/* The three that lead the first category, fanned out like books laid on a table. */}
          <div className="relative hidden h-[24rem] md:block" aria-hidden>
            {period.categories[keys[0]]!.slice(0, 3).map((e, i) => (
              <motion.div
                key={e.id}
                className="absolute bottom-0 w-[38%]"
                style={{ left: `${[31, 4, 58][i]}%`, zIndex: 3 - i }}
                initial={{ opacity: 0, transform: `translateY(60px) rotate(${[0, -14, 14][i] * 1.6}deg)` }}
                animate={{ opacity: 1, transform: `translateY(${[0, 26, 34][i]}px) rotate(${[0, -9, 9][i]}deg)` }}
                transition={{ duration: 1.4, delay: 0.25 + i * 0.12, ease: EASE }}
              >
                <Thumb e={e} className="w-full shadow-[0_30px_50px_-30px_rgb(22_18_14/0.7)]" />
                <span className={`num absolute -left-3 -top-8 text-6xl ${i === 0 ? "text-shu" : "text-ink"}`}>{pad(e.rank)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* Controls: which period, which category. Always in reach. */}
      <div className="hair sticky top-14 z-40 border-y bg-paper/85 backdrop-blur-md md:top-16">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-5 py-2.5 md:px-10">
          <span className="label shrink-0 pr-1 text-mute">Kỳ</span>
          {periods.map((p) => (
            <Link
              key={p.slug}
              href={p.href}
              scroll={false}
              aria-current={p.slug === period.slug ? "page" : undefined}
              aria-selected={p.slug === period.slug}
              className="btn-ghost !h-9 shrink-0 !px-4 !text-[0.8rem]"
            >
              {p.label}
            </Link>
          ))}
          <span className="hair mx-2 h-6 shrink-0 border-l" />
          <span className="label shrink-0 pr-1 text-mute">Hạng mục</span>
          <div className="flex shrink-0 gap-2" role="tablist" aria-label="Hạng mục">
            {keys.map((k) => (
              <button key={k} role="tab" aria-selected={k === cat} onClick={() => choose(k)} className="btn-ghost !h-9 shrink-0 !px-4 !text-[0.8rem]">
                {CATEGORIES[k].short}
                <span className="num text-[0.95rem] opacity-60">{period.categories[k]!.length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cat}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <section className="px-5 pt-14 md:px-10 md:pt-20" aria-label="Ba hạng đầu">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="display max-w-[16ch] text-4xl leading-[1.02] md:text-[4vw]">{meta.label}</h2>
              <p className="max-w-[42ch] text-[0.95rem] font-light text-ink/75">{meta.blurb}</p>
            </div>
            <ol className="hair mt-12 grid gap-10 border-t pt-10 md:mt-16 md:grid-cols-3 md:gap-12 md:pt-12">
              {list.slice(0, 3).map((e, i) => (
                <Medal key={e.id} e={e} votes={period.votes} max={max} place={i} />
              ))}
            </ol>
          </section>

          <section className="mt-24 bg-card px-5 py-16 md:mt-36 md:px-10 md:py-24" aria-label="Kệ sách">
            <Kicker no="A" right="Chạm vào một gáy sách để tới dòng của nó">
              Toàn cảnh
            </Kicker>
            <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="display text-[11vw] md:text-[5.4vw]">
                Cả kệ sách, <i className="text-shu">trong một cái nhìn</i>
              </h2>
              <p className="max-w-[40ch] text-[0.9rem] font-light text-ink/75">
                {list.length} {meta.unit}, xếp từ hạng nhất. Gáy càng dày, càng nhiều độc giả gọi tên.
              </p>
            </div>
            <Rise className="mt-12 md:mt-16">
              <Shelf list={list} votes={period.votes} sub={subOf} onPick={pick} />
            </Rise>
          </section>

          <section className="px-5 pb-28 pt-20 md:px-10 md:pb-40 md:pt-28" aria-label="Danh sách đầy đủ">
            <Kicker no="B" right={`${nf.format(rows.length)} / ${nf.format(list.length)}`}>
              Từng dòng một
            </Kicker>
            <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="display text-[11vw] md:text-[5.4vw]">
                Toàn bộ <i className="text-shu">{list.length}</i> {meta.unit}
              </h2>
              <label className="flex h-12 w-full items-center gap-3 rounded-full border border-ink/25 px-5 transition-colors focus-within:border-ink md:w-96">
                <Search className="size-4 shrink-0 text-mute" aria-hidden />
                <input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setLimit(PAGE);
                  }}
                  placeholder={`Tìm theo tên ${meta.unit}…`}
                  className="w-full bg-transparent text-[0.95rem] outline-none placeholder:text-mute"
                />
                {q && (
                  <button onClick={() => setQ("")} aria-label="Xoá tìm kiếm" className="text-mute hover:text-shu">
                    <X className="size-4" />
                  </button>
                )}
              </label>
            </div>

            <div className="label mt-10 hidden grid-cols-[4rem_2.8rem_minmax(0,1.3fr)_minmax(0,1.2fr)_5.5rem_4rem] gap-x-6 text-mute md:grid">
              <span className="pl-1">Hạng</span>
              <span />
              <span>{meta.unit}</span>
              <span>Độ dày · so với hạng nhất</span>
              <span className="text-right">Phiếu</span>
              <span className="pr-1 text-right">Tỉ lệ</span>
            </div>
            <ol className="mt-3 border-t border-ink">
              {shown.map((e) => (
                <Row key={e.id} e={e} max={max} votes={period.votes} lit={lit === e.id} />
              ))}
            </ol>

            {shown.length === 0 && <p className="display py-24 text-center text-3xl text-mute">Không tìm thấy “{q}” trong hạng mục này.</p>}

            {rows.length > limit && (
              <div className="mt-12 flex justify-center">
                <button onClick={() => setLimit((l) => l + PAGE * 2)} className="btn-ghost">
                  Xem thêm · còn {rows.length - limit}
                </button>
              </div>
            )}
          </section>
        </motion.div>
      </AnimatePresence>

      {period.gender && period.ages && <Demographics gender={period.gender} ages={period.ages} />}
    </main>
  );
}
