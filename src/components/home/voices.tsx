import { FadeUp } from "@/components/ui/reveal";
import { VOICES } from "@/lib/content";

export default function Voices() {
  const [lead, ...rest] = VOICES;
  return (
    <section className="haze relative overflow-hidden bg-ink px-5 py-28 text-paper md:px-16 md:py-40">
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
