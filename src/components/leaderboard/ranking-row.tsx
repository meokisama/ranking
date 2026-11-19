"use client";
import { motion } from "motion/react";
import { Cover } from "@/components/ui/book";
import type { Entry } from "@/lib/data";
import { nf, pad, percent } from "@/lib/format";
import { EASE } from "@/lib/motion";
import { subOf } from "./utils";

export default function RankingRow({ e, max, votes, delay }: { e: Entry; max: number; votes: number; delay: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className="group relative grid grid-cols-[2.6rem_3rem_1fr_auto] items-center gap-x-4 border-b border-ink/15 py-3 md:grid-cols-[4.5rem_3.4rem_minmax(0,1.1fr)_minmax(0,1fr)_7rem] md:gap-x-6"
    >
      <span className={`display text-2xl tabular-nums md:text-3xl ${e.rank <= 3 ? "text-shu" : e.rank <= 10 ? "" : "text-ink/35"}`}>
        {pad(e.rank)}
      </span>
      <div className="aspect-[400/568] w-full overflow-hidden bg-paper-2 shadow-sm transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-3 group-hover:scale-[1.6]">
        {e.logo ? (
          <div className="grid size-full place-items-center bg-white p-1">
            <img src={e.logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <Cover name={e.name} cover={e.cover} color={e.color} />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-serif text-lg leading-snug md:text-xl">{e.name}</h3>
        <span className="label block truncate text-ink/50">{subOf(e)}</span>
      </div>
      <div className="col-span-4 col-start-1 mt-2 h-[3px] bg-ink/10 md:col-span-1 md:col-start-4 md:mt-0" aria-hidden>
        <motion.div
          className={`h-full origin-left ${e.rank <= 3 ? "bg-shu" : "bg-ink"}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: e.count / max }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.1, ease: EASE }}
        />
      </div>
      <div className="col-start-4 row-start-1 text-right md:col-start-5">
        <span className="display text-xl tabular-nums md:text-2xl">{nf.format(e.count)}</span>
        <span className="label block text-ink/45">{percent(e.count, votes)}</span>
      </div>
    </motion.li>
  );
}
