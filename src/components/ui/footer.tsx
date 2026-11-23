import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CREDITS } from "@/lib/content";
import { CATEGORIES, CURRENT_PERIOD, SITE } from "@/lib/config";
import type { CategoryKey } from "@/lib/config";
import { currentPeriod, periods } from "@/lib/data";
import { nf, pad } from "@/lib/format";
import BackToTop from "./back-to-top";
import Cover from "./cover";
import Logo from "./logo";
import { Lines } from "./reveal";

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const ink = (hex?: string | null) => {
  if (!hex) return "#f8f4ea";
  const n = parseInt(hex.replace("#", ""), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 > 0.6 ? "#16120e" : "#f8f4ea";
};

/** Bars drawn from a seed: the same code for the same period, every time. Decorative, so hidden from readers. */
function Barcode({ seed }: { seed: string }) {
  let h = hash(seed);
  const bars: [number, number][] = [];
  let x = 0;
  for (let i = 0; i < 46; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const w = 1 + ((h >>> 16) % 3);
    if (i % 2 === 0 || i < 3 || i > 42) bars.push([x, i < 3 || i > 42 || i === 22 || i === 23 ? 1 : w]);
    x += i % 2 ? 1 + ((h >>> 20) % 2) : w;
  }
  return (
    <svg viewBox={`0 0 ${x} 30`} className="h-12 w-40" preserveAspectRatio="none" aria-hidden>
      {bars.map(([bx, bw], i) => (
        <rect key={i} x={bx} width={bw} height={i < 2 || i > bars.length - 3 ? 30 : 26} fill="currentColor" />
      ))}
    </svg>
  );
}

const NAV = [
  ["/", "Trang bìa", "Mười trang đầu của kỳ này"],
  ["/leaderboard", "Bảng tổng sắp", "Mọi cái tên, mọi hạng mục"],
  ["/feedback", "Góp ý của độc giả", "Những lời nhắn kèm lá phiếu"],
  ["/vote", "Bình chọn", "Hòm phiếu của kỳ tới"],
] as const;

/**
 * The end of the book, in two parts. On paper: the closing line and the shelf the period left behind,
 * one spine per title, thicker for more votes, drawn out and turned to its cover under the pointer.
 * Then the back cover, in the red cloth of the book in the hero: the blurb, the contents, the periods, the makers,
 * and the imprint box with its bar code.
 */
export default function Footer() {
  const all = currentPeriod.categories.ranobe!;
  const list = all.slice(0, 22);
  const max = list[0].count;

  return (
    <footer>
      {/* ---- the last page ---- */}
      <section className="hair overflow-x-clip border-t px-5 pb-20 pt-24 md:px-10 md:pb-28 md:pt-32">
        <span className="label text-mute">
          <span className="mr-3 text-shu">●</span>Lời cuối sách
        </span>
        <div className="mt-6 grid items-end gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <Lines className="display text-[14vw] lg:text-[6.4vw]">
              {"Câu chuyện vẫn"}
              <span>
                <i className="text-shu">được viết tiếp</i>
                <span className="text-shu">.</span>
              </span>
            </Lines>
            <p className="mt-8 max-w-[44ch] text-[0.95rem] font-light text-ink/75">
              {currentPeriod.label} khép lại với {nf.format(currentPeriod.votes)} lá phiếu. Kỳ tiếp theo, kệ sách lại được xếp lại từ đầu, và cuốn
              sách bạn yêu có thể đứng ở đó.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/leaderboard" className="btn">
                Mở bảng tổng sắp
                <span className="disc">
                  <ArrowRight aria-hidden />
                </span>
              </Link>
              <a href={SITE.facebook} target="_blank" rel="noreferrer" className="btn-ghost">
                Theo dõi trên Facebook
              </a>
            </div>
          </div>

          <div className="min-w-0">
            <div className="shelf-row overflow-x-clip [--row:19rem] md:[--row:24rem]" aria-label={`Kệ sách ${currentPeriod.label}`}>
              {list.map((e) => {
                // Heights scattered from the title, the same each time; thickness from the votes.
                const short = ((hash(`h${e.name}`) % 1000) / 1000) * 3.2;
                const thick = Math.round(40 + 34 * (e.count / max));
                const bg = e.color ?? "#8a3b2a";
                return (
                  <div key={e.id} className="shelf-slot">
                    <Link
                      href="/leaderboard"
                      aria-label={`Hạng ${e.rank}: ${e.name}, ${nf.format(e.count)} phiếu`}
                      className="shelf-book"
                      style={{ width: thick, height: `calc(var(--row) - ${short.toFixed(2)}rem)` }}
                    >
                      <span className="shelf-body">
                        <span className="shelf-cover" aria-hidden>
                          <Cover name={e.name} cover={e.cover} color={e.color} sub={e.publisher} className="!aspect-auto h-full !rounded-none !shadow-none" />
                        </span>
                        <span className="shelf-face" style={{ background: bg, color: ink(bg) }}>
                          <span className="num shrink-0 text-[0.95rem] leading-none">{pad(e.rank)}</span>
                          <span className="h-px w-full shrink-0 bg-current opacity-25" />
                          <span className="shelf-title display text-[0.92rem] leading-none tracking-[0.02em]">{e.name}</span>
                          <span className="label shrink-0 text-[0.5rem] opacity-70 [writing-mode:vertical-rl]">{e.publisher}</span>
                        </span>
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
            <div className="h-[3px] bg-ink" />
            <div className="h-3 bg-gradient-to-b from-ink/15 to-transparent" />
            <p className="label mt-2 flex justify-between text-mute">
              <span>Kệ sách {currentPeriod.label} · + {all.length - list.length} cuốn nữa</span>
              <span>Rê chuột để rút sách ra · gáy dày theo số phiếu</span>
            </p>
          </div>
        </div>
      </section>

      {/* ---- the back cover: the same red cloth as the book in the hero, a gold frame, the blurb, the imprint ---- */}
      <section className="back-cover relative overflow-hidden px-5 py-14 text-paper md:px-10 md:py-20">
        <div className="pointer-events-none absolute inset-3 border border-gold/55 md:inset-6" aria-hidden />
        <div className="pointer-events-none absolute inset-[18px] border border-gold/25 md:inset-[30px]" aria-hidden />

        <div className="relative px-4 pt-6 md:px-10 md:pt-8">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-4" aria-label={`${SITE.name}, về trang bìa`}>
              <Logo tone="gold" className="size-12 shrink-0 md:size-14" />
              <span className="label hidden leading-relaxed text-gold sm:block">
                Bảng xếp hạng
                <br />
                Light Novel Việt Nam
              </span>
            </Link>
            <BackToTop />
          </div>

          {/*
            The epigraph, as a back cover prints one. George R. R. Martin, A Dance with Dragons (2011), spoken by Jojen Reed:
            "A reader lives a thousand lives before he dies. The man who never reads lives only one." Translation ours.
          */}
          <figure className="mx-auto mt-16 max-w-3xl text-center md:mt-24">
            <span className="label text-gold">Đề từ</span>
            <blockquote className="display mt-6 text-[8vw] leading-[1.1] md:text-[3.6vw]" lang="vi">
              <span className="text-gold">“</span>
              Người đọc sách sống một nghìn cuộc đời trước khi chết. <i>Người không đọc chỉ sống một.</i>
              <span className="text-gold">”</span>
            </blockquote>
            <figcaption className="mt-7">
              <span className="display block text-xl italic">George R. R. Martin</span>
              <span className="label mt-1 block text-paper/60">Vũ điệu rồng · 2011</span>
            </figcaption>
          </figure>

          <div className="mx-auto mt-16 flex max-w-xs items-center gap-4 md:mt-24" aria-hidden>
            <span className="h-px flex-1 bg-gold/50" />
            <span className="size-1.5 rotate-45 bg-gold" />
            <span className="h-px flex-1 bg-gold/50" />
          </div>

          <div className="mt-16 grid gap-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:gap-14">
            <nav aria-label="Mục lục">
              <span className="label text-gold">Mục lục</span>
              <ol className="mt-5 space-y-3">
                {NAV.map(([href, label], i) => (
                  <li key={href}>
                    <Link href={href} className="group flex items-baseline gap-4">
                      <span className="num w-6 text-sm text-gold/70">{pad(i + 1)}</span>
                      <span className="display text-[1.6rem] leading-none transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 group-hover:text-gold">
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            <div>
              <span className="label text-gold">Các kỳ bình chọn</span>
              <ul className="mt-5 space-y-4">
                {periods.map((p) => (
                  <li key={p.slug}>
                    <Link href={p.slug === CURRENT_PERIOD ? "/leaderboard" : `/leaderboard/${p.slug}`} className="group block">
                      <span className="display block text-[1.6rem] leading-none transition-colors duration-500 group-hover:text-gold">
                        {p.label.split(" · ")[0]} <i>{p.label.split(" · ")[1]}</i>
                      </span>
                      <span className="label mt-1.5 block text-paper/55">{nf.format(p.votes)} lá phiếu</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="label text-gold">Thực hiện</span>
              <dl className="mt-5 space-y-3">
                {CREDITS.map((c) => (
                  <div key={c.name} className="flex items-baseline gap-3">
                    <dt className="label w-20 shrink-0 text-paper/55">{c.role}</dt>
                    <dd>
                      <a href={c.url} target="_blank" rel="noreferrer" className="display text-[1.4rem] italic leading-none transition-colors duration-500 hover:text-gold">
                        {c.name}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
              <a href={SITE.facebook} target="_blank" rel="noreferrer" className="label mt-7 inline-flex items-center gap-2 text-paper/75 transition-colors hover:text-gold">
                Facebook <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            </div>

            {/* The imprint box every book carries on its back: a code and a bar code. */}
            <div className="w-fit self-end bg-paper px-4 pb-3 pt-4 text-ink">
              <Barcode seed={`${currentPeriod.slug}-${currentPeriod.votes}`} />
              <p className="label mt-2 flex justify-between gap-4 text-[0.6rem] text-ink/70">
                <span>BXH · LNVN</span>
                <span>{currentPeriod.slug.split("-").reverse().join("·")}</span>
              </p>
              <p className="num mt-0.5 text-[0.95rem] tracking-[0.2em]">{String(currentPeriod.votes).padStart(4, "0")} · {pad(all.length)}</p>
            </div>
          </div>

          <div className="mt-16 flex flex-col justify-between gap-3 border-t border-gold/30 pb-4 pt-5 text-paper/55 md:mt-20 md:flex-row">
            <span className="label">
              {/* the year of the latest period, not of the build: the page is static */}© {SITE.since} – {currentPeriod.slug.split("-")[1]} · {SITE.short}
            </span>
            <span className="text-[0.8rem] font-light">Mọi tên sách và hình bìa thuộc về tác giả và nhà phát hành.</span>
          </div>
        </div>
      </section>
    </footer>
  );
}
