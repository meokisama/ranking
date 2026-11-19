import { FadeUp, LineRise } from "@/components/ui/reveal";
import { TIMELINE } from "@/lib/content";

export default function Timeline({ period }: { period: string }) {
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
