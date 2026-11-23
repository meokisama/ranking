"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Kicker } from "@/components/ui/reveal";
import { VOICES } from "@/lib/content";
import { pad } from "@/lib/format";
import { EASE } from "@/lib/motion";

/** What the fandoms said before the count: one large quotation at a time, chosen from the names beside it. */
export default function Voices() {
  const [i, setI] = useState(0);
  const v = VOICES[i];
  return (
    <section className="bg-ink px-5 py-20 text-paper md:px-10 md:py-28">
      <Kicker no="05" dark right={`${pad(i + 1)} / ${pad(VOICES.length)}`}>
        Tiếng nói trước giờ kiểm phiếu
      </Kicker>
      <div className="mt-4 h-px bg-paper/20" />

      <div className="mt-12 grid gap-12 md:mt-20 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] md:gap-16">
        <div className="min-h-[22rem] md:min-h-[26rem]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, filter: "blur(10px)", transform: "translateY(24px)" }}
              animate={{ opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.25 } }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <p className={`display leading-[1.06] ${v.content.length > 120 ? "text-[7vw] md:text-[3.5vw]" : "text-[9.5vw] md:text-[5.2vw]"}`}>
                <span className="text-shu">“</span>
                {v.content}
                <span className="text-shu">”</span>
              </p>
              <footer className="mt-9 flex items-center gap-4">
                <img src={v.avatar} alt="" className="size-12 rounded-full object-cover" />
                <div>
                  <cite className="display block text-xl not-italic">{v.author}</cite>
                  <span className="label text-paper/55">{v.role}</span>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <ol className="self-end">
          {VOICES.map((x, k) => (
            <li key={x.author} className="border-t border-paper/20 last:border-b">
              <button
                onClick={() => setI(k)}
                aria-pressed={k === i}
                className={`group flex w-full items-center gap-4 py-4 text-left transition-[padding,color] duration-500 ease-[var(--ease-out-expo)] ${
                  k === i ? "pl-3 text-shu" : "text-paper/60 hover:pl-3 hover:text-paper"
                }`}
              >
                <span className="label w-6">{pad(k + 1)}</span>
                <span className="min-w-0 flex-1 truncate text-[0.95rem]">{x.author}</span>
                <span className={`size-1.5 rounded-full bg-shu transition-opacity ${k === i ? "opacity-100" : "opacity-0"}`} />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
