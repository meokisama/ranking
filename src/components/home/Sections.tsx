import Marquee from "@/components/ui/Marquee";
import { CountUp, FadeUp, LineRise, ScrollWords } from "@/components/ui/Reveal";
import { ABOUT, MANIFESTO, PARTNERS, TIMELINE, VOICES } from "@/lib/content";
import { nf } from "@/lib/data";

const Star = () => (
  <svg viewBox="0 0 24 24" className="mx-8 size-5 shrink-0 animate-spin-slow md:mx-12 md:size-7" aria-hidden>
    <path fill="currentColor" d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
  </svg>
);

/** Dải obi đỏ chạy chữ ngay dưới hero. */
export function ObiBand({ items }: { items: string[] }) {
  return (
    <div className="relative z-10 -my-px border-y border-ink/20 bg-shu py-4 text-ink md:py-5">
      <Marquee duration={36}>
        {items.map((t) => (
          <span key={t} className="display flex items-center text-2xl md:text-4xl">
            {t}
            <Star />
          </span>
        ))}
      </Marquee>
    </div>
  );
}

export function Manifesto({ stats }: { stats: { value: number; label: string; plain?: boolean }[] }) {
  return (
    <section className="relative overflow-hidden bg-paper px-5 py-28 text-ink md:px-16 md:py-44">
      <div className="pointer-events-none absolute -right-24 top-20 size-[38vw] rounded-full text-shu/25 tone-lg" aria-hidden />
      <div className="tategaki pointer-events-none absolute right-6 top-28 hidden text-sm text-ink/40 md:block" aria-hidden>
        読者が選ぶ、ベトナムのライトノベル
      </div>

      <span className="label relative text-shu">Lời ngỏ</span>
      <ScrollWords
        text={MANIFESTO}
        className="relative mt-8 serif-display max-w-[22ch] text-[9vw] leading-[1.08] md:max-w-[24ch] md:text-[5.2vw]"
      />

      <div className="relative mt-24 grid gap-14 md:mt-36 md:grid-cols-2 md:gap-20">
        {ABOUT.map((a, i) => (
          <FadeUp key={a.no} delay={i * 0.12}>
            <div className="flex items-baseline gap-4 border-t border-ink pt-5">
              <span className="label text-shu">{a.no}</span>
              <h3 className="display text-2xl md:text-3xl">{a.title}</h3>
            </div>
            <div className="mt-6 space-y-4 text-[15px] leading-[1.75] text-ink/75 md:pl-10">
              {a.body.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
          </FadeUp>
        ))}
      </div>

      <dl className="relative mt-24 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-36 md:grid-cols-4">
        {stats.map((s, i) => (
          <FadeUp key={s.label} delay={i * 0.08} className="border-t border-ink/25 pt-4">
            <dd className="display text-[15vw] leading-none tabular-nums md:text-[6.4vw]">
              {s.plain ? s.value : <CountUp to={s.value} />}
            </dd>
            <dt className="label mt-3 text-ink/60">{s.label}</dt>
          </FadeUp>
        ))}
      </dl>
    </section>
  );
}

export function Timeline({ period }: { period: string }) {
  return (
    <section className="relative bg-paper-2 px-5 py-28 text-ink md:px-16 md:py-40">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="display text-[13vw] leading-[0.95] md:text-[7vw]">
          <LineRise lines={["Hành trình", <span key="b" className="outline-text">hai mươi ngày</span>]} />
        </h2>
        <span className="label text-ink/60">{period} · Tháng 12</span>
      </div>

      <ol className="mt-16 grid gap-px bg-ink/20 md:mt-24 md:grid-cols-5">
        {TIMELINE.map((t, i) => (
          <li key={t.title} className={t.key ? "bg-shu text-paper" : "bg-paper-2"}>
            <FadeUp delay={i * 0.08} className="flex h-full flex-col p-6 md:min-h-[21rem] md:p-7">
              <span className="label flex items-center justify-between opacity-70">
                <span>Chặng {i + 1}</span>
                {t.key && <span className="font-jp normal-case tracking-normal">投票</span>}
              </span>
              <span className="display mt-10 text-4xl leading-none tabular-nums md:mt-auto md:text-[2.5vw]">{t.date}</span>
              <h3 className="mt-4 font-serif text-2xl italic">{t.title}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${t.key ? "text-paper/85" : "text-ink/65"}`}>{t.text}</p>
            </FadeUp>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Voices() {
  const [lead, ...rest] = VOICES;
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-28 text-paper md:px-16 md:py-40">
      <span className="display pointer-events-none absolute -top-[0.12em] right-4 select-none text-[52vw] leading-none text-shu md:text-[30vw]" aria-hidden>
        ”
      </span>
      <span className="label relative text-shu">Tiếng nói trước giờ G</span>

      <FadeUp className="relative mt-10">
        <blockquote className="serif-display max-w-[20ch] text-[8.4vw] italic leading-[1.1] md:text-[4.6vw]">
          {lead.content}
        </blockquote>
        <Byline v={lead} />
      </FadeUp>

      <div className="relative mt-24 grid gap-x-12 gap-y-14 md:mt-32 md:grid-cols-2">
        {rest.map((v, i) => (
          <FadeUp key={v.author} delay={(i % 2) * 0.1} className="border-t border-paper/20 pt-7">
            <blockquote className="font-serif text-xl leading-snug text-paper/90 md:text-[1.6rem]">{v.content}</blockquote>
            <Byline v={v} />
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function Byline({ v }: { v: (typeof VOICES)[number] }) {
  return (
    <footer className="mt-7 flex items-center gap-3">
      <img src={v.avatar} alt="" width={40} height={40} loading="lazy" className="size-10 rounded-full object-cover grayscale" />
      <span>
        <span className="block text-sm font-medium">{v.author}</span>
        <span className="label text-paper/50">{v.role}</span>
      </span>
    </footer>
  );
}

export function Partners() {
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
