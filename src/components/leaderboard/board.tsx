"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import Book3D from "@/components/ui/book3d";
import Cover from "@/components/ui/cover";
import { Kicker } from "@/components/ui/reveal";
import { CATEGORIES } from "@/lib/config";
import type { CategoryKey } from "@/lib/config";
import type { Entry, Period } from "@/lib/data";
import { fold, nf, pad, percent } from "@/lib/format";
import { EASE } from "@/lib/motion";
import Demographics from "./demographics";
import CoverArc from "./arc";

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

/** A podium book: in 3D, turning under the pointer. A publisher keeps its flat logo board. */
function Podium({ e, thickness, className = "" }: { e: Entry; thickness: number; className?: string }) {
  return e.logo ? (
    <Thumb e={e} className={className} />
  ) : (
    <Book3D name={e.name} cover={e.cover} color={e.color} sub={subOf(e)} thickness={thickness} tilt className={`pr-[6%] ${className}`} />
  );
}

/** A bar in the book's own colour: as long as its votes go. */
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

const rise = (i: number) => ({
  initial: { opacity: 0, transform: "translateY(36px)" },
  whileInView: { opacity: 1, transform: "translateY(0px)" },
  viewport: { once: true, margin: "0px 0px -8% 0px" },
  transition: { duration: 1.1, delay: 0.05 + i * 0.1, ease: EASE },
});

/** The winner: a full-height cover beside its number, name and count. */
function Champion({ e, votes }: { e: Entry; votes: number }) {
  return (
    <motion.li
      className="group grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] items-end gap-5 py-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-10 md:py-12 md:pr-12"
      {...rise(0)}
    >
      <Podium e={e} thickness={30} className="w-full max-w-[22rem]" />
      <div className="min-w-0">
        <span className="label text-mute">Quán quân</span>
        <p className="num mt-1 text-[clamp(5rem,11vw,12rem)] leading-[0.78] text-shu">01</p>
        <h3 className="display mt-5 line-clamp-4 text-[1.55rem] leading-[1.04] md:text-[clamp(1.8rem,2.6vw,2.8rem)]">{e.name}</h3>
        <p className="label mt-3 truncate text-mute">{subOf(e)}</p>
        <Thickness e={e} max={e.count} delay={0.3} className="mt-6" />
        <p className="mt-3 flex items-baseline justify-between gap-3">
          <span className="num text-4xl md:text-5xl">{nf.format(e.count)}</span>
          <span className="label text-mute">phiếu · {percent(e.count, votes)}</span>
        </p>
      </div>
    </motion.li>
  );
}

/** Second and third: a smaller cover, and how far each stands from the top. */
function Runner({ e, votes, max, place }: { e: Entry; votes: number; max: number; place: number }) {
  return (
    <motion.li
      className={`hair group grid flex-1 grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-5 border-t py-8 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8 md:pl-12 ${place === 1 ? "md:border-t-0" : ""}`}
      {...rise(place)}
    >
      <Podium e={e} thickness={18} className="w-full" />
      <div className="min-w-0">
        <p className="num text-[clamp(3.2rem,5.5vw,5.5rem)] leading-[0.8]">{pad(e.rank)}</p>
        <h3 className="display mt-3 line-clamp-3 text-[1.25rem] leading-[1.06] md:text-[clamp(1.3rem,1.7vw,1.8rem)]">{e.name}</h3>
        <p className="label mt-2 truncate text-mute">{subOf(e)}</p>
        <Thickness e={e} max={max} delay={0.3 + place * 0.1} className="mt-4" />
        <p className="mt-2 flex items-baseline justify-between gap-3">
          <span className="num text-2xl md:text-3xl">{nf.format(e.count)}</span>
          <span className="label text-right text-mute">
            {percent(e.count, votes)} · kém {nf.format(max - e.count)}
          </span>
        </p>
      </div>
    </motion.li>
  );
}

function Row({ e, max, votes }: { e: Entry; max: number; votes: number }) {
  return (
    <li
      className="hair group grid grid-cols-[2.4rem_2.6rem_1fr_auto] items-center gap-x-3 border-b py-3.5 transition-colors duration-700 hover:bg-card md:grid-cols-[4rem_2.8rem_minmax(0,1.3fr)_minmax(0,1.2fr)_5.5rem_4rem] md:gap-x-6"
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
    const url = new URL(window.location.href);
    url.searchParams.set("cat", c);
    window.history.replaceState(null, "", url);
  };

  const list = period.categories[cat]!;
  const meta = CATEGORIES[cat];
  const max = list[0].count;
  const searching = q.trim().length > 0;
  // The top three have the podium; the list carries on from fourth, unless a search wants the whole field.
  const rows = useMemo(() => {
    if (!searching) return list.slice(3);
    const needle = fold(q.trim());
    return list.filter((e) => fold(e.name).includes(needle) || fold(subOf(e)).includes(needle));
  }, [list, q, searching]);
  const shown = rows.slice(0, limit);

  return (
    <main>
      <CoverArc period={period} list={list} unit={meta.unit} catLabel={meta.short} sub={subOf} />

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
          <section className="px-5 pt-16 md:px-10 md:pt-24" aria-label="Ba hạng đầu">
            <Kicker no="A" right={`${nf.format(list[0].count + (list[1]?.count ?? 0) + (list[2]?.count ?? 0))} phiếu cho ba cái tên`}>
              Ba hạng đầu
            </Kicker>
            <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="display max-w-[18ch] text-[11vw] leading-[0.98] md:text-[4.6vw]">{meta.label}</h2>
              <p className="max-w-[40ch] text-[0.95rem] font-light text-ink/75">{meta.blurb}</p>
            </div>
            <ol className="mt-10 grid border-t border-ink md:mt-14 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <Champion e={list[0]} votes={period.votes} />
              <li className="hair md:border-l">
                <ol className="flex h-full flex-col" start={2}>
                  {list.slice(1, 3).map((e, i) => (
                    <Runner key={e.id} e={e} votes={period.votes} max={max} place={i + 1} />
                  ))}
                </ol>
              </li>
            </ol>
          </section>

          <section className="px-5 pb-28 pt-20 md:px-10 md:pb-40 md:pt-32" aria-label="Danh sách đầy đủ">
            <Kicker no="B" right={searching ? `${nf.format(rows.length)} / ${nf.format(list.length)}` : `Hạng 04 – ${pad(list.length)}`}>
              Từng dòng một
            </Kicker>
            <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="display text-[11vw] md:text-[5.4vw]">
                {searching ? (
                  <>
                    Tìm trong <i className="text-shu">{list.length}</i> {meta.unit}
                  </>
                ) : (
                  <>
                    Và <i className="text-shu">{list.length - 3}</i> {meta.unit} nữa
                  </>
                )}
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
              <span>So với hạng nhất</span>
              <span className="text-right">Phiếu</span>
              <span className="pr-1 text-right">Tỉ lệ</span>
            </div>
            <ol className="mt-3 border-t border-ink">
              {shown.map((e) => (
                <Row key={e.id} e={e} max={max} votes={period.votes} />
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
