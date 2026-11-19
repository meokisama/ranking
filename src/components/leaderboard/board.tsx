"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import Eclipse from "@/components/ui/eclipse";
import { CATEGORIES } from "@/lib/config";
import type { CategoryKey } from "@/lib/config";
import type { Period } from "@/lib/data";
import { fold, nf, pad } from "@/lib/format";
import { EASE } from "@/lib/motion";
import Demographics from "./demographics";
import PodiumItem from "./podium-item";
import RankingRow from "./ranking-row";
import { subOf } from "./utils";

const PAGE = 30;

export default function Board({
  period,
  periods,
}: {
  period: Period;
  periods: { slug: string; label: string; href: string }[];
}) {
  const keys = Object.keys(period.categories) as CategoryKey[];
  const [cat, setCat] = useState<CategoryKey>(keys[0]);
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const lenis = useLenis();

  // Read ?cat= after mount so the page stays fully static.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("cat") as CategoryKey | null;
    if (c && keys.includes(c)) setCat(c);
  }, []);

  const choose = (c: CategoryKey) => {
    if (c === cat) return;
    setCat(c);
    lenis?.scrollTo("#board", { duration: 1.2 });
    setQ("");
    setLimit(PAGE);
    const url = new URL(window.location.href);
    url.searchParams.set("cat", c);
    window.history.replaceState(null, "", url);
  };

  const list = period.categories[cat]!;
  const meta = CATEGORIES[cat];
  const max = list[0].count;
  const podium = list.slice(0, 3);
  const rest = useMemo(() => {
    const all = list.slice(3);
    if (!q.trim()) return all;
    const needle = fold(q.trim());
    return list.filter((e) => fold(e.name).includes(needle) || fold(subOf(e)).includes(needle));
  }, [list, q]);
  const shown = rest.slice(0, limit);

  return (
    <main className="bg-ink text-paper">
      <header className="relative overflow-hidden px-5 pb-10 pt-32 md:px-16 md:pb-14 md:pt-44">
        <Eclipse className="-right-[22vw] -top-[30vw] w-[78vw] md:-right-[16vw] md:-top-[24vw] md:w-[62vw]" />
        <div className="tategaki pointer-events-none absolute right-6 top-36 hidden text-sm text-paper/40 md:block" aria-hidden>
          総合順位表
        </div>
        <span className="label relative text-shu">Bảng tổng sắp · {period.long}</span>
        <h1 className="display relative mt-5 text-[17vw] leading-[0.9] md:text-[11vw]">
          {periods.map((p) =>
            p.slug === period.slug ? (
              <motion.span
                key={p.slug}
                className="block"
                initial={{ y: "40%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, ease: EASE }}
              >
                {p.label}
              </motion.span>
            ) : (
              <Link
                key={p.slug}
                href={p.href}
                className="outline-text block text-paper/40 transition-colors duration-500 hover:text-shu"
                scroll={false}
              >
                {p.label}
              </Link>
            )
          )}
        </h1>
        <p className="relative mt-8 max-w-[44ch] text-[15px] leading-relaxed text-paper/65">
          Kết quả từ <strong className="font-medium text-paper">{nf.format(period.votes)} lượt bình chọn hợp lệ</strong>. Chạm
          vào tên kỳ mờ phía trên để đổi kỳ, đổi hạng mục bằng thanh nổi ở đáy màn hình.
        </p>
      </header>

      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 md:bottom-6">
        <div
          className="pointer-events-auto flex max-w-full gap-1 overflow-x-auto border border-paper/20 bg-ink/90 p-1.5 shadow-[0_20px_50px_-10px_rgb(0_0_0/0.8)] backdrop-blur-md"
          role="tablist"
          aria-label="Hạng mục"
        >
          {keys.map((k, i) => (
            <button
              key={k}
              role="tab"
              aria-selected={k === cat}
              onClick={() => choose(k)}
              className={`relative flex shrink-0 items-baseline gap-2 px-4 py-2.5 transition-colors duration-300 md:px-5 ${
                k === cat ? "text-ink" : "text-paper/60 hover:text-paper"
              }`}
            >
              {k === cat && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-paper"
                  transition={{ duration: 0.5, ease: EASE }}
                />
              )}
              <span className="label relative hidden sm:inline">{pad(i + 1)}</span>
              <span className="display relative whitespace-nowrap text-sm md:text-base">{CATEGORIES[k].short}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cat}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <section id="board" className="border-t border-paper/15 px-5 pb-24 pt-14 md:px-16 md:pb-32 md:pt-20" aria-label="Ba hạng đầu">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="display max-w-[18ch] text-3xl leading-tight md:text-[3.2vw]">{meta.label}</h2>
              <p className="max-w-[38ch] font-serif text-lg italic leading-snug text-paper/60">“{meta.blurb}”</p>
            </div>

            <ol className="mt-14 grid items-end gap-x-[5vw] gap-y-16 md:mt-20 md:grid-cols-[1fr_1.25fr_1fr]">
              {podium.map((e, i) => (
                <PodiumItem key={e.id} e={e} votes={period.votes} first={i === 0} order={i === 0 ? "md:order-2" : i === 1 ? "md:order-1" : "md:order-3"} />
              ))}
            </ol>
          </section>

          <section className="bg-paper px-5 py-20 text-ink md:px-16 md:py-28" aria-label="Danh sách đầy đủ">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="display text-[11vw] leading-none md:text-[5vw]">
                Toàn bộ <span className="text-shu">{list.length}</span>
              </h2>
              <label className="flex w-full items-center gap-3 border-b border-ink pb-2 md:w-80">
                <span className="label text-ink/50">Tìm</span>
                <input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setLimit(PAGE);
                  }}
                  placeholder={`Tên ${meta.unit}…`}
                  className="w-full bg-transparent font-serif text-lg italic outline-none placeholder:text-ink/35"
                />
                {q && (
                  <button onClick={() => setQ("")} className="label text-ink/50 hover:text-shu" aria-label="Xoá tìm kiếm">
                    Xoá
                  </button>
                )}
              </label>
            </div>

            <ol className="mt-12 border-t border-ink">
              {shown.map((e, i) => (
                <RankingRow key={e.id} e={e} max={max} votes={period.votes} delay={Math.min(i, 12) * 0.03} />
              ))}
            </ol>

            {shown.length === 0 && (
              <p className="py-20 text-center font-serif text-2xl italic text-ink/50">
                Không tìm thấy “{q}” trong hạng mục này.
              </p>
            )}

            {rest.length > limit && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setLimit((l) => l + PAGE * 2)}
                  className="group relative h-14 overflow-hidden border border-ink px-8"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
                  <span className="label relative transition-colors duration-300 group-hover:text-paper">
                    Xem thêm · còn {rest.length - limit}
                  </span>
                </button>
              </div>
            )}
          </section>
        </motion.div>
      </AnimatePresence>

      {period.gender && period.ages && <Demographics gender={period.gender} ages={period.ages} votes={period.votes} />}
    </main>
  );
}
