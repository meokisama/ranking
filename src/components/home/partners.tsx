import Marquee from "@/components/ui/marquee";
import { FadeUp, LineRise } from "@/components/ui/reveal";
import { PARTNERS } from "@/lib/content";
import { nf } from "@/lib/format";

export default function Partners() {
  const half = Math.ceil(PARTNERS.length / 2);
  const rows = [PARTNERS.slice(0, half), PARTNERS.slice(half)];
  return (
    <section className="bg-paper py-28 text-ink md:py-40">
      <div className="mb-14 flex flex-col justify-between gap-6 px-5 md:mb-20 md:flex-row md:items-end md:px-16">
        <h2 className="display text-[13vw] leading-[0.95] md:text-[7vw]">
          <LineRise lines={["Cùng đồng hành"]} />
        </h2>
        <FadeUp className="max-w-[36ch] text-[15px] leading-relaxed text-ink/70">
          {nf.format(PARTNERS.length)} trang và cộng đồng đã cùng lan toả bảng xếp hạng tới độc giả khắp cả nước.
        </FadeUp>
      </div>
      <div className="space-y-4">
        {rows.map((row, r) => (
          <Marquee key={r} duration={70} reverse={r === 1}>
            {row.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group mr-4 flex items-center gap-4 border border-ink/20 py-3 pl-3 pr-7 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
              >
                <img
                  src={`/images/media/${p.avatar}`}
                  alt=""
                  width={56}
                  height={56}
                  loading="lazy"
                  className="size-14 rounded-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                />
                <span className="whitespace-nowrap font-serif text-xl italic">{p.name}</span>
              </a>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
