import Link from "next/link";
import Marquee from "./Marquee";
import { CREDITS } from "@/lib/content";
import { SITE } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-24 text-paper md:pt-32">
      <div className="grid gap-12 px-5 md:grid-cols-[1.4fr_1fr_1fr] md:px-16">
        <div>
          <span className="label text-shu">Hẹn gặp lại kỳ sau</span>
          <p className="mt-5 max-w-[26ch] font-serif text-3xl italic leading-tight md:text-4xl">
            Cảm ơn mọi lá phiếu, mọi lời góp ý, mọi cuốn sách đã được gọi tên.
          </p>
          <a
            href={SITE.facebook}
            target="_blank"
            rel="noreferrer"
            className="label link-underline mt-8 inline-block pb-1 text-paper"
          >
            Theo dõi trên Facebook ↗
          </a>
        </div>
        <nav aria-label="Liên kết chân trang">
          <span className="label text-paper/45">Khám phá</span>
          <ul className="mt-5 space-y-2 font-serif text-xl">
            {[
              ["/", "Trang chủ"],
              ["/leaderboard", "Bảng tổng sắp"],
              ["/feedback", "Góp ý của độc giả"],
              ["/vote", "Bình chọn"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="link-underline pb-0.5">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <span className="label text-paper/45">Thực hiện</span>
          <ul className="mt-5 space-y-2 font-serif text-xl">
            {CREDITS.map((c) => (
              <li key={c.name} className="flex items-baseline justify-between gap-4 md:justify-start">
                <a href={c.url} target="_blank" rel="noreferrer" className="link-underline pb-0.5">
                  {c.name}
                </a>
                <span className="label text-paper/45">{c.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-20 flex items-center justify-between border-t border-paper/15 px-5 py-5 md:mt-28 md:px-16">
        <span className="label text-paper/45">
          © {SITE.since}—{new Date().getFullYear()} BXH LNVN
        </span>
        <span className="label font-jp normal-case tracking-[0.3em] text-paper/45">おわり</span>
      </div>

      <Marquee duration={50} className="-mb-[3.2vw] select-none text-paper" >
        <span className="display whitespace-nowrap pr-[4vw] text-[22vw] leading-[0.95]" aria-hidden>
          Light Novel <span className="text-shu">Việt Nam</span> <span className="outline-text">ライトノベル</span>
        </span>
      </Marquee>
    </footer>
  );
}
