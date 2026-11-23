import Rise, { Kicker, Lines, Rule } from "@/components/ui/reveal";
import { TIMELINE } from "@/lib/content";
import { pad } from "@/lib/format";

/** The calendar of a period, set out like the running order of a programme. */
export default function Timeline({ period }: { period: string }) {
  return (
    <section className="px-5 py-20 md:px-10 md:py-28">
      <Kicker no="04" right={period}>
        Lịch trình
      </Kicker>
      <Lines className="display mt-6 text-[13vw] md:text-[8vw]">
        <span>
          Hành trình của <i className="text-shu">một kỳ bình chọn</i>
        </span>
      </Lines>
      <Rule className="mt-14 md:mt-20" />
      <ol className="grid md:grid-cols-5">
        {TIMELINE.map((t, i) => (
          <li key={t.title} className="hair relative border-b py-8 md:border-b-0 md:border-r md:px-6 md:py-10 md:first:pl-0 md:last:border-r-0">
            <span
              className={`absolute -top-[5px] left-0 hidden size-[9px] rounded-full md:block ${i === 0 ? "" : "md:left-6"} ${t.key ? "bg-shu" : "border border-ink/40 bg-paper"}`}
              aria-hidden
            />
            <Rise delay={i * 0.08}>
              <p className="label text-mute">{pad(i + 1)}</p>
              <p className={`num mt-4 text-[2.6rem] leading-none md:text-[3vw] ${t.key ? "text-shu" : ""}`}>{t.date}</p>
              <h3 className="display mt-5 text-2xl">
                <i>{t.title}</i>
              </h3>
              <p className="mt-3 max-w-[30ch] text-[0.9rem] font-light text-ink/75">{t.text}</p>
            </Rise>
          </li>
        ))}
      </ol>
    </section>
  );
}
