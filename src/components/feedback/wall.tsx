"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { Kicker, Lines } from "@/components/ui/reveal";
import { fold, nf } from "@/lib/format";
import { EASE } from "@/lib/motion";

export type Note = {
  period: string;
  topic: string;
  content: string;
  title: string;
  publisher: string;
  at: string;
};

const PAGE = 36;
const date = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" });

/** The letterbox: every note readers attached to their ballots, pinned up as loose pages. */
export default function Wall({ notes, periods }: { notes: Note[]; periods: { slug: string; label: string }[] }) {
  const [period, setPeriod] = useState<string>("all");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const sentinel = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const needle = fold(q.trim());
    return notes.filter(
      (n) => (period === "all" || n.period === period) && (!needle || fold(`${n.topic} ${n.content} ${n.title} ${n.publisher}`).includes(needle)),
    );
  }, [notes, period, q]);

  // Observed afresh whenever the list or the page changes: an observer only reports a change of state, so a
  // sentinel that stays in view after a filter or a load would otherwise never ask for the next page.
  const more = limit < filtered.length;
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !more) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLimit((l) => l + PAGE), { rootMargin: "600px" });
    io.observe(el);
    return () => io.disconnect();
  }, [filtered, limit, more]);

  const shown = filtered.slice(0, limit);
  const chips = [{ slug: "all", label: "Tất cả" }, ...periods];

  return (
    <main>
      <header className="relative overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pb-14 md:pt-36">
        <Kicker no="●" right="Giữ nguyên văn, ẩn danh">
          Hòm thư độc giả
        </Kicker>
        <div className="mt-6 grid items-end gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <Lines as="h1" className="display text-[14vw] md:text-[8.6vw]" label={`${notes.length} lời nhắn gửi ban tổ chức`}>
              <>
                <i className="text-shu">{nf.format(notes.length)}</i> lời nhắn
              </>
              <>
                gửi ban tổ chức<span className="text-shu">.</span>
              </>
            </Lines>
            <p className="mt-8 max-w-[52ch] text-[0.95rem] font-light text-ink/75">
              Mỗi lá phiếu đi kèm một ô trống để độc giả nói điều mình nghĩ: về tác phẩm, nhà phát hành, hay bộ truyện đang mong có bản
              quyền. Đây là tất cả những gì đã được gửi về.
            </p>
            <dl className="hair mt-8 grid max-w-xl grid-cols-3 border-t pt-4">
              {[
                [notes.filter((n) => n.title).length, "Bộ mong có bản quyền"],
                [notes.filter((n) => n.publisher).length, "Lời gửi nhà phát hành"],
                [periods.length, "Kỳ bình chọn"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dd className="num text-3xl md:text-4xl">{nf.format(v as number)}</dd>
                  <dt className="label mt-1 text-mute">{l}</dt>
                </div>
              ))}
            </dl>
          </div>
          {/* A few notes left on the desk, the shortest ones, tilted as they fell. */}
          <div className="relative hidden h-[22rem] md:block" aria-hidden>
            {notes
              .filter((n) => n.content && n.content.length > 18 && n.content.length < 90)
              .slice(0, 3)
              .map((n, i) => (
                <motion.div
                  key={n.at}
                  className="absolute w-[64%] rounded-[2px] bg-card p-6 shadow-[0_0_0_1px_rgb(22_18_14/0.08),0_30px_50px_-30px_rgb(22_18_14/0.6)]"
                  style={{ left: `${[2, 34, 14][i]}%`, top: `${[4, 22, 52][i]}%`, zIndex: i }}
                  initial={{ opacity: 0, transform: `translateY(-50px) rotate(${[-14, 12, -6][i]}deg)` }}
                  animate={{ opacity: 1, transform: `translateY(0px) rotate(${[-6, 5, -2][i]}deg)` }}
                  transition={{ duration: 1.3, delay: 0.3 + i * 0.15, ease: EASE }}
                >
                  <span className="label text-mute">{date(n.at)}</span>
                  {n.topic && <p className="display mt-2 line-clamp-1 text-xl">{n.topic}</p>}
                  <p className="mt-2 line-clamp-3 text-[0.9rem] font-light">{n.content}</p>
                  {i === 2 && <span className="absolute -right-2 -top-2 size-4 rounded-full bg-shu" />}
                </motion.div>
              ))}
          </div>
        </div>
      </header>

      <div className="hair sticky top-14 z-40 border-y bg-paper/85 backdrop-blur-md md:top-16">
        <div className="flex flex-col gap-2 px-5 py-2.5 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto" role="group" aria-label="Lọc theo kỳ">
            <span className="label shrink-0 pr-1 text-mute">Kỳ</span>
            {chips.map((c) => (
              <button
                key={c.slug}
                onClick={() => {
                  setPeriod(c.slug);
                  setLimit(PAGE);
                }}
                aria-pressed={period === c.slug}
                className="btn-ghost !h-9 shrink-0 !px-4 !text-[0.8rem]"
              >
                {c.label}
              </button>
            ))}
          </div>
          <label className="flex h-9 w-full items-center gap-3 rounded-full border border-ink/25 px-4 focus-within:border-ink md:w-80">
            <Search className="size-3.5 shrink-0 text-mute" aria-hidden />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setLimit(PAGE);
              }}
              placeholder="Từ khoá, tên truyện, nhà phát hành…"
              className="w-full bg-transparent text-[0.85rem] outline-none placeholder:text-mute"
            />
            <span className="label shrink-0 text-mute">{nf.format(filtered.length)}</span>
          </label>
        </div>
      </div>

      <section className="overflow-x-clip px-5 pb-28 pt-12 md:px-10 md:pt-16" aria-label="Danh sách góp ý">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
          {shown.map((n, i) => (
            <Slip key={n.at + i} n={n} i={i} />
          ))}
        </div>
        {shown.length === 0 && <p className="display py-24 text-center text-3xl text-mute">Chưa có lời nhắn nào khớp.</p>}
        <div ref={sentinel} className="h-px" />
      </section>
    </main>
  );
}

function Slip({ n, i }: { n: Note; i: number }) {
  const tilt = ((i * 37) % 7) - 3;
  return (
    <motion.article
      initial={{ opacity: 0, transform: `translateY(30px) rotate(${tilt * 0.9}deg)` }}
      whileInView={{ opacity: 1, transform: "translateY(0px) rotate(0deg)" }}
      viewport={{ once: true, margin: "0px 0px -4% 0px" }}
      transition={{ duration: 0.9, delay: Math.min((i % PAGE) * 0.015, 0.3), ease: EASE }}
      className="mb-5 break-inside-avoid rounded-[2px] bg-card p-6 shadow-[0_0_0_1px_rgb(22_18_14/0.08),0_18px_30px_-24px_rgb(22_18_14/0.45)] transition-[box-shadow,translate] duration-500 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgb(22_18_14/0.12),0_26px_36px_-22px_rgb(22_18_14/0.5)]"
    >
      <span className="label text-mute">{date(n.at)}</span>
      {n.topic && <h2 className="display mt-3 break-words text-[1.5rem] leading-[1.08]">{n.topic}</h2>}
      {n.content && <p className="mt-3 whitespace-pre-line break-words text-[0.95rem] font-light leading-relaxed">{n.content}</p>}
      {(n.title || n.publisher) && (
        <dl className="hair mt-5 space-y-1.5 border-t pt-4 text-[0.875rem]">
          {n.title && (
            <div className="flex gap-3">
              <dt className="label w-16 shrink-0 pt-0.5 text-shu">Mong có</dt>
              <dd className="min-w-0 break-words">{n.title}</dd>
            </div>
          )}
          {n.publisher && (
            <div className="flex gap-3">
              <dt className="label w-16 shrink-0 pt-0.5 text-shu">Gửi tới</dt>
              <dd className="min-w-0 break-words">{n.publisher}</dd>
            </div>
          )}
        </dl>
      )}
    </motion.article>
  );
}
