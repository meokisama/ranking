"use client";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import Cover from "@/components/ui/cover";
import Rise, { Kicker, Rule } from "@/components/ui/reveal";
import { ABOUT, MANIFESTO } from "@/lib/content";
import type { Entry } from "@/lib/data";
import { nf } from "@/lib/format";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

function Count({ value, plain }: { value: number; plain?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const fmt = (v: number) => (plain ? String(Math.round(v)) : nf.format(Math.round(v)));
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const c = animate(plain ? value - 40 : 0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = fmt(v)),
    });
    return () => c.stop();
  }, [inView, value]);
  return <span ref={ref}>{fmt(value)}</span>;
}

/** Two columns of covers drifting against the scroll, beside the manifesto. */
function Drift({ covers }: { covers: Entry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const up = useTransform(scrollYProgress, [0, 1], ["8%", "-22%"]);
  const down = useTransform(scrollYProgress, [0, 1], ["-24%", "6%"]);
  const cols = [covers.filter((_, i) => i % 2 === 0), covers.filter((_, i) => i % 2 === 1)];
  return (
    <div ref={ref} className="relative hidden h-[40rem] overflow-hidden md:block" aria-hidden>
      <div className="absolute inset-0 grid grid-cols-2 gap-4">
        {cols.map((col, c) => (
          <motion.div key={c} style={{ y: c ? down : up }} className="flex flex-col gap-4">
            {col.map((e) => (
              <Cover key={e.id} name={e.name} cover={e.cover} color={e.color} />
            ))}
          </motion.div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
    </div>
  );
}

/** The preface: the manifesto inks itself in as it is read, beside a slow drift of covers; then the figures. */
export default function Preface({ stats, covers }: { stats: { value: number; label: string; plain?: boolean }[]; covers: Entry[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = MANIFESTO.split(" ");

  return (
    <section className="px-5 pb-20 pt-24 md:px-10 md:pb-28 md:pt-32">
      <Kicker no="01" right="Từ năm 2018">
        Lời tựa
      </Kicker>
      <Rule className="mt-4" />
      <div className="mt-10 grid items-center gap-12 md:mt-14 md:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] md:gap-16">
        <div>
          <p ref={ref} className="display text-[8.6vw] leading-[1.04] md:text-[3.9vw]">
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 3) / words.length)]}>
                {w}
              </Word>
            ))}
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {ABOUT.map((a, i) => (
              <Rise key={a.no} delay={i * 0.1}>
                <h2 className="flex items-baseline gap-3">
                  <span className="label text-shu">{a.no}</span>
                  <span className="display text-2xl">{a.title}</span>
                </h2>
                <div className="mt-4 space-y-3 text-[0.9rem] font-light text-ink/80">
                  {a.body.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </Rise>
            ))}
          </div>
        </div>
        <Drift covers={covers} />
      </div>

      <dl className="hair mt-16 grid grid-cols-2 border-t md:mt-20 md:grid-cols-4">
        {stats.map((s, i) => (
          <Rise key={s.label} delay={i * 0.08} className="hair border-b py-7 md:border-b-0 md:border-r md:px-8 md:py-9 md:first:pl-0 md:last:border-r-0">
            <dd className="num text-[15vw] leading-none md:text-[6vw]">
              <Count value={s.value} plain={s.plain} />
            </dd>
            <dt className="label mt-4 text-mute">{s.label}</dt>
          </Rise>
        ))}
      </dl>
    </section>
  );
}
