"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import Book, { Cover } from "@/components/ui/Book";
import Eclipse from "@/components/ui/Eclipse";
import { CATEGORIES } from "@/lib/config";
import type { CategoryKey } from "@/lib/config";
import type { Entry, Period } from "@/lib/data";
import { nf, pad } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;
const PAGE = 30;

const pct = (count: number, votes: number) => ((count / votes) * 100).toFixed(1).replace(".", ",") + "%";
const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
const subOf = (e: Entry) => e.publisher ?? e.works?.join(" · ") ?? "";

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

  // Đọc ?cat= sau khi mount để trang vẫn tĩnh hoàn toàn.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("cat") as CategoryKey | null;
    if (c && keys.includes(c)) setCat(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {/* ───── Đầu trang ───── */}
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

      {/* ───── Thanh hạng mục nổi ở đáy màn hình ───── */}
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
          {/* ───── Bục vinh quang ───── */}
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

          {/* ───── Danh sách đầy đủ ───── */}
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
                <Row key={e.id} e={e} max={max} votes={period.votes} delay={Math.min(i, 12) * 0.03} />
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

function PodiumItem({ e, votes, first, order }: { e: Entry; votes: number; first: boolean; order: string }) {
  return (
    <li className={`relative ${order}`}>
      {first && <Eclipse className="left-[64%] top-[-22%] w-[170%] -translate-x-1/2" />}
      <span
        className={`display pointer-events-none absolute -top-[0.3em] left-0 select-none leading-none ${
          first ? "text-[38vw] text-shu md:text-[17vw]" : "outline-text text-[30vw] text-paper/35 md:text-[12vw]"
        }`}
        aria-hidden
      >
        {e.rank}
      </span>

      {e.logo ? (
        <div className={`relative ml-auto grid aspect-square place-items-center bg-white p-[12%] ${first ? "w-[72%]" : "w-[62%]"}`}>
          <img src={e.logo} alt={`Logo ${e.name}`} className="max-h-full max-w-full object-contain" />
          {first && <span className="label absolute inset-x-0 bottom-0 bg-shu py-2 text-center text-paper">Quán quân · 第1位</span>}
        </div>
      ) : (
        <Book
          name={e.name}
          cover={e.cover}
          color={e.color}
          sub={subOf(e)}
          eager
          depth={first ? 34 : 26}
          className={`relative ml-auto ${first ? "w-[72%]" : "w-[62%]"}`}
        />
      )}

      <div className="relative mt-9">
        <span className="label text-paper/50">{subOf(e) || `Hạng ${pad(e.rank)}`}</span>
        <h3 className={`display mt-2 leading-[1.1] ${first ? "text-3xl md:text-[2.5vw]" : "text-2xl md:text-[1.7vw]"}`}>{e.name}</h3>
        <div className="mt-5 flex items-end justify-between border-t border-paper/20 pt-4">
          <span className={`display tabular-nums ${first ? "text-6xl text-shu md:text-[5vw]" : "text-4xl md:text-[3vw]"}`}>
            {nf.format(e.count)}
          </span>
          <span className="label text-right text-paper/50">
            phiếu
            <br />
            {pct(e.count, votes)} người bình chọn
          </span>
        </div>
      </div>
    </li>
  );
}

function Row({ e, max, votes, delay }: { e: Entry; max: number; votes: number; delay: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className="group relative grid grid-cols-[2.6rem_3rem_1fr_auto] items-center gap-x-4 border-b border-ink/15 py-3 md:grid-cols-[4.5rem_3.4rem_minmax(0,1.1fr)_minmax(0,1fr)_7rem] md:gap-x-6"
    >
      <span className={`display text-2xl tabular-nums md:text-3xl ${e.rank <= 3 ? "text-shu" : e.rank <= 10 ? "" : "text-ink/35"}`}>
        {pad(e.rank)}
      </span>
      <div className="aspect-[400/568] w-full overflow-hidden bg-paper-2 shadow-sm transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-3 group-hover:scale-[1.6]">
        {e.logo ? (
          <div className="grid size-full place-items-center bg-white p-1">
            <img src={e.logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <Cover name={e.name} cover={e.cover} color={e.color} />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-serif text-lg leading-snug md:text-xl">{e.name}</h3>
        <span className="label block truncate text-ink/50">{subOf(e)}</span>
      </div>
      <div className="col-span-4 col-start-1 mt-2 h-[3px] bg-ink/10 md:col-span-1 md:col-start-4 md:mt-0" aria-hidden>
        <motion.div
          className={`h-full origin-left ${e.rank <= 3 ? "bg-shu" : "bg-ink"}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: e.count / max }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.1, ease: EASE }}
        />
      </div>
      <div className="col-start-4 row-start-1 text-right md:col-start-5">
        <span className="display text-xl tabular-nums md:text-2xl">{nf.format(e.count)}</span>
        <span className="label block text-ink/45">{pct(e.count, votes)}</span>
      </div>
    </motion.li>
  );
}

function Demographics({
  gender,
  ages,
  votes,
}: {
  gender: { male: number; female: number };
  ages: { age: number; count: number }[];
  votes: number;
}) {
  const total = gender.male + gender.female;
  const peak = Math.max(...ages.map((a) => a.count));
  const mode = ages.find((a) => a.count === peak)!;
  const under22 = ages.filter((a) => a.age <= 22).reduce((s, a) => s + a.count, 0);

  return (
    <section className="relative overflow-hidden bg-ink px-5 py-24 text-paper md:px-16 md:py-36" aria-label="Chân dung người bình chọn">
      <span className="label text-shu">Chân dung người bình chọn</span>
      <h2 className="display mt-5 text-[12vw] leading-[0.95] md:text-[6.4vw]">
        Ai đã <span className="outline-text">bỏ phiếu?</span>
      </h2>

      <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-[1fr_1.5fr] md:gap-20">
        <div>
          <h3 className="label text-paper/50">Giới tính</h3>
          <div className="mt-6 flex h-28 w-full overflow-hidden md:h-36">
            <motion.div
              className="relative flex items-end bg-paper p-3 text-ink"
              initial={{ width: "0%" }}
              whileInView={{ width: `${(gender.male / total) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: EASE }}
            >
              <span className="display text-4xl md:text-5xl">{pct(gender.male, total)}</span>
            </motion.div>
            <div className="relative flex-1 bg-shu">
              <div className="absolute inset-0 text-ink/25 tone" />
            </div>
          </div>
          <dl className="mt-4 flex justify-between">
            <div>
              <dt className="label text-paper/50">Nam</dt>
              <dd className="mt-1 font-serif text-xl italic">{nf.format(gender.male)} người</dd>
            </div>
            <div className="text-right">
              <dt className="label text-shu">Nữ · {pct(gender.female, total)}</dt>
              <dd className="mt-1 font-serif text-xl italic">{nf.format(gender.female)} người</dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="label text-paper/50">
              Độ tuổi ({ages[0].age}-{ages[ages.length - 1].age})
            </h3>
            <span className="label text-paper/50">
              Đông nhất: <span className="text-shu">{mode.age} tuổi</span>
            </span>
          </div>
          <div className="mt-6 flex h-52 items-end gap-[3px] md:h-64" role="img" aria-label={`Phân bố độ tuổi, đông nhất là ${mode.age} tuổi với ${mode.count} người`}>
            {ages.map((a, i) => (
              <div key={a.age} className="group relative flex h-full flex-1 items-end">
                <motion.div
                  className={`w-full origin-bottom ${a.count === peak ? "bg-shu" : "bg-paper/85 group-hover:bg-paper"}`}
                  style={{ height: `${Math.max(0.6, (a.count / peak) * 100)}%` }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: i * 0.025, ease: EASE }}
                />
                <span className="label pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap bg-paper px-2 py-1 text-ink group-hover:block">
                  {a.age} tuổi · {nf.format(a.count)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between border-t border-paper/20 pt-2">
            {[ages[0].age, 15, 20, 25, 30, 35, ages[ages.length - 1].age].map((t) => (
              <span key={t} className="label text-paper/45">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-8 max-w-[40ch] font-serif text-xl italic leading-snug text-paper/70">
            {pct(under22, votes)} người bình chọn từ 22 tuổi trở xuống. Light Novel vẫn là câu chuyện của tuổi trẻ.
          </p>
        </div>
      </div>
    </section>
  );
}
