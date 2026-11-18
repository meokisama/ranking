"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { nf } from "@/lib/data";

export type Note = {
  period: string;
  topic: string;
  content: string;
  title: string;
  publisher: string;
  at: string;
};

const PAGE = 36;
const EASE = [0.16, 1, 0.3, 1] as const;
const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
const date = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" });

export default function Wall({ notes, periods }: { notes: Note[]; periods: { slug: string; label: string }[] }) {
  const [period, setPeriod] = useState<string>("all");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const sentinel = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const needle = fold(q.trim());
    return notes.filter(
      (n) =>
        (period === "all" || n.period === period) &&
        (!needle || fold(`${n.topic} ${n.content} ${n.title} ${n.publisher}`).includes(needle))
    );
  }, [notes, period, q]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setLimit((l) => l + PAGE),
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shown = filtered.slice(0, limit);
  const chips = [{ slug: "all", label: "Tất cả" }, ...periods];

  return (
    <main className="min-h-svh bg-paper text-ink">
      <header className="relative overflow-hidden px-5 pb-12 pt-32 md:px-16 md:pb-16 md:pt-44">
        <div className="pointer-events-none absolute -left-24 top-10 size-[40vw] rounded-full text-shu/25 tone-lg" aria-hidden />
        <div className="tategaki pointer-events-none absolute right-6 top-36 hidden text-sm text-ink/40 md:block" aria-hidden>
          読者の声
        </div>
        <span className="label relative text-shu">Hòm thư độc giả</span>
        <h1 className="display relative mt-5 text-[15vw] leading-[0.9] md:text-[10vw]">
          <span className="text-shu">{nf.format(notes.length)}</span> lời nhắn
          <br />
          <span className="outline-text">gửi ban tổ chức</span>
        </h1>
        <p className="relative mt-8 max-w-[46ch] text-[15px] leading-relaxed text-ink/70">
          Mỗi lá phiếu đi kèm một ô trống để độc giả nói điều mình nghĩ — về tác phẩm, nhà phát hành, hay bộ truyện
          đang mong có bản quyền. Đây là tất cả những gì đã được gửi về, giữ nguyên văn.
        </p>

        <div className="relative mt-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo kỳ">
            {chips.map((c) => (
              <button
                key={c.slug}
                onClick={() => {
                  setPeriod(c.slug);
                  setLimit(PAGE);
                }}
                aria-pressed={period === c.slug}
                className={`label border px-4 py-2.5 transition-colors duration-300 ${
                  period === c.slug ? "border-ink bg-ink text-paper" : "border-ink/30 hover:border-ink"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <label className="flex w-full items-center gap-3 border-b border-ink pb-2 md:w-80">
            <span className="label text-ink/50">Tìm</span>
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setLimit(PAGE);
              }}
              placeholder="Từ khoá, tên truyện, NPH…"
              className="w-full bg-transparent font-serif text-lg italic outline-none placeholder:text-ink/35"
            />
            <span className="label shrink-0 text-ink/50">{nf.format(filtered.length)}</span>
          </label>
        </div>
      </header>

      <section className="px-5 pb-28 md:px-16" aria-label="Danh sách góp ý">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
          {shown.map((n, i) => (
            <Slip key={n.at + i} n={n} accent={i % 7 === 3} delay={(i % PAGE) * 0.015} />
          ))}
        </div>
        {shown.length === 0 && (
          <p className="py-24 text-center font-serif text-2xl italic text-ink/50">Chưa có lời nhắn nào khớp.</p>
        )}
        <div ref={sentinel} className="h-px" />
      </section>
    </main>
  );
}

function Slip({ n, accent, delay }: { n: Note; accent: boolean; delay: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -4% 0px" }}
      transition={{ duration: 0.8, delay: Math.min(delay, 0.3), ease: EASE }}
      className={`group relative mb-5 break-inside-avoid border p-6 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-rotate-1 hover:-translate-y-1 ${
        accent ? "border-shu bg-shu text-paper" : "border-ink/15 bg-[#f6f1e7]"
      }`}
    >
      <span className={`label ${accent ? "text-paper/70" : "text-ink/45"}`}>{date(n.at)}</span>
      {n.topic && <h2 className="display mt-3 break-words text-xl leading-[1.15]">{n.topic}</h2>}
      {n.content && (
        <p className="mt-3 whitespace-pre-line break-words font-serif text-[1.05rem] leading-relaxed">{n.content}</p>
      )}
      {(n.title || n.publisher) && (
        <dl className={`mt-5 space-y-1 border-t pt-4 text-sm ${accent ? "border-paper/30" : "border-ink/15"}`}>
          {n.title && (
            <div className="flex gap-3">
              <dt className={`label shrink-0 pt-0.5 ${accent ? "text-paper/70" : "text-shu"}`}>Mong có</dt>
              <dd className="break-words">{n.title}</dd>
            </div>
          )}
          {n.publisher && (
            <div className="flex gap-3">
              <dt className={`label shrink-0 pt-0.5 ${accent ? "text-paper/70" : "text-shu"}`}>Gửi NPH</dt>
              <dd className="break-words">{n.publisher}</dd>
            </div>
          )}
        </dl>
      )}
    </motion.article>
  );
}
