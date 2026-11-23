import { ArrowUpRight } from "lucide-react";
import Rise, { Kicker, Lines } from "@/components/ui/reveal";
import { PARTNERS } from "@/lib/content";

/** The communities that carried the vote, listed the way a book thanks its friends. */
export default function Partners() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-28">
      <Kicker no="06" right={`${PARTNERS.length} cộng đồng`}>
        Lời cảm ơn
      </Kicker>
      <div className="mt-6 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16">
        <div>
          <Lines className="display text-[13vw] md:text-[6vw]">
            {"Những người"}
            <i key="i" className="text-shu">
              bạn đồng hành
            </i>
          </Lines>
          <p className="mt-7 max-w-[38ch] text-[0.95rem] font-light text-ink/75">
            Các cộng đồng và fanpage đã cùng lan toả cuộc bình chọn. Bảng xếp hạng có được là nhờ họ.
          </p>
        </div>
        <ul className="hair grid min-w-0 grid-cols-1 border-t sm:grid-cols-2 sm:gap-x-8">
          {PARTNERS.map((p, i) => (
            <li key={p.name} className="hair min-w-0 border-b">
              <Rise delay={(i % 2) * 0.05} y={12}>
                <a href={p.url} target="_blank" rel="noreferrer" className="group flex items-center gap-4 py-3.5">
                  <img
                    src={`/images/media/${p.avatar}`}
                    alt=""
                    loading="lazy"
                    className="size-9 shrink-0 rounded-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                  />
                  <span className="display min-w-0 flex-1 truncate text-[1.3rem] leading-[1.2] transition-colors duration-500 group-hover:text-shu">
                    {p.name}
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 opacity-0 transition-[opacity,transform] duration-500 group-hover:rotate-45 group-hover:opacity-100"
                    aria-hidden
                  />
                </a>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
