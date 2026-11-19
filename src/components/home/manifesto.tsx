import { CountUp, FadeUp, ScrollWords } from "@/components/ui/reveal";
import { ABOUT, MANIFESTO } from "@/lib/content";

export default function Manifesto({ stats }: { stats: { value: number; label: string; plain?: boolean }[] }) {
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
