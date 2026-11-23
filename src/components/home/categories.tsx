import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Mark } from "@/components/ui/cover";
import Rise, { Kicker, Lines } from "@/components/ui/reveal";
import { CATEGORIES } from "@/lib/config";
import type { CategoryKey } from "@/lib/config";
import type { Entry } from "@/lib/data";
import { nf, pad } from "@/lib/format";

export type CategoryRow = { key: CategoryKey; top: Entry[]; total: number };

/**
 * The categories as a table of contents. A row floods with vermilion under the pointer
 * and fans out the three covers (or marks) that lead it.
 */
export default function Categories({ rows }: { rows: CategoryRow[] }) {
  return (
    <section className="px-5 py-20 md:px-10 md:py-28">
      <Kicker no="03" right={`${rows.length} hạng mục`}>
        Mục lục
      </Kicker>
      <Lines className="display mt-6 text-[13vw] md:text-[8vw]">
        <span>
          Mỗi hạng mục, <i className="text-shu">một cái tên</i>
        </span>
      </Lines>

      <ol className="hair mt-14 border-t md:mt-20">
        {rows.map((r, i) => {
          const c = CATEGORIES[r.key];
          const w = r.top[0];
          return (
            <li key={r.key} className="hair border-b">
              <Rise delay={i * 0.06} y={18}>
                <Link
                  href={`/leaderboard?cat=${r.key}`}
                  className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 px-0 py-7 transition-[padding,color] duration-700 ease-[var(--ease-out-expo)] hover:px-4 hover:text-paper md:grid-cols-[7rem_minmax(0,1.5fr)_minmax(0,1fr)_auto_5rem] md:gap-x-8 md:py-9 md:hover:px-8"
                >
                  <span
                    className="absolute inset-0 origin-bottom scale-y-0 bg-shu transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
                    aria-hidden
                  />
                  <span className="label relative text-shu transition-colors duration-500 group-hover:text-paper">Chương {pad(i + 1)}</span>
                  <span className="relative min-w-0">
                    <span className="display block text-[9vw] leading-[1] md:text-[4.4vw]">{c.short}</span>
                    <span className="mt-2 block max-w-[52ch] text-[0.85rem] font-light opacity-70">{c.blurb}</span>
                  </span>
                  <span className="relative hidden min-w-0 md:block">
                    <span className="label block opacity-60">Hạng nhất · {nf.format(w.count)} phiếu</span>
                    <span className="display mt-1 line-clamp-2 block text-2xl leading-[1.05]">
                      <i>{w.name}</i>
                    </span>
                  </span>
                  <span className="relative hidden h-24 w-44 md:block" aria-hidden>
                    {r.top.slice(0, 3).map((e, k) => (
                      <span
                        key={e.id}
                        className="absolute bottom-0 w-16 origin-bottom transition-transform duration-700 ease-[var(--ease-out-expo)]"
                        style={{
                          left: `${k * 2.4}rem`,
                          zIndex: 3 - k,
                          transform: `rotate(${(k - 1) * 5}deg)`,
                        }}
                      >
                        <span
                          className="block transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-3"
                          style={{ transitionDelay: `${k * 50}ms` }}
                        >
                          <Mark e={e} />
                        </span>
                      </span>
                    ))}
                  </span>
                  <span className="relative flex items-center justify-end gap-3">
                    <span className="num text-3xl md:text-4xl">{pad(r.total)}</span>
                    <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
                  </span>
                </Link>
              </Rise>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
