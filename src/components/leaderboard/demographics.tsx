"use client";
import { motion } from "motion/react";
import Rise, { Kicker, Lines } from "@/components/ui/reveal";
import type { Period } from "@/lib/data";
import { nf, percent } from "@/lib/format";
import { EASE } from "@/lib/motion";

/** Who held the ballots: the split by gender, and one stack of pages per year of age (or per bracket, when that is all the form asked). */
export default function Demographics({
  gender,
  ages,
  groups,
}: {
  gender: NonNullable<Period["gender"]>;
  ages: Period["ages"];
  groups?: Period["ageGroups"];
}) {
  const other = gender.other ?? 0;
  const total = gender.male + gender.female + other;
  const bars = ages
    ? ages.map((a, i) => ({ key: String(a.age), tick: i % 2 === 0 ? String(a.age) : "", count: a.count }))
    : (groups ?? []).map((g) => ({ key: g.label, tick: g.label, count: g.count }));
  const peak = Math.max(...bars.map((a) => a.count));
  const mode = bars.find((a) => a.count === peak)!;
  const all = bars.reduce((s, a) => s + a.count, 0);
  const young = ages
    ? { count: ages.filter((a) => a.age <= 22).reduce((s, a) => s + a.count, 0), label: "Từ 22 tuổi trở xuống" }
    : { count: bars[0].count, label: `${bars[0].key} tuổi` };

  return (
    <section className="overflow-hidden bg-ink px-5 py-24 text-paper md:px-10 md:py-36" aria-label="Chân dung người bình chọn">
      <Kicker no="C" dark right={`${nf.format(total)} người`}>
        Chân dung người bình chọn
      </Kicker>
      <Lines className="display mt-6 text-[13vw] md:text-[8vw]">
        <>
          Ai đã <i className="text-shu">cầm lá phiếu?</i>
        </>
      </Lines>

      <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] md:gap-20">
        <Rise>
          <h3 className="label text-paper/55">Giới tính</h3>
          <div className="mt-6 flex h-16 overflow-hidden rounded-[2px]">
            <motion.div
              className="bg-paper"
              initial={{ width: "0%" }}
              whileInView={{ width: `${(gender.male / total) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: EASE }}
            />
            <div className="flex-1 bg-shu" />
            {other > 0 && <div className="bg-paper/30" style={{ width: `${(other / total) * 100}%` }} />}
          </div>
          <dl className="mt-5 flex justify-between">
            <div>
              <dd className="num text-6xl md:text-7xl">{percent(gender.male, total)}</dd>
              <dt className="label mt-2 text-paper/55">Nam · {nf.format(gender.male)}</dt>
            </div>
            <div className="text-right">
              <dd className="num text-6xl text-shu md:text-7xl">{percent(gender.female, total)}</dd>
              <dt className="label mt-2 text-paper/55">Nữ · {nf.format(gender.female)}</dt>
            </div>
          </dl>
          {other > 0 && (
            <p className="label mt-4 text-paper/55">
              Không nêu · {nf.format(other)} · {percent(other, total)}
            </p>
          )}
        </Rise>

        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="label text-paper/55">Độ tuổi</h3>
            <span className="label text-paper/55">{ages ? "Mỗi cột là một tuổi" : "Mỗi cột là một nhóm tuổi"}</span>
          </div>
          <div className="mt-10 flex h-56 items-end gap-1 md:h-72 md:gap-1.5">
            {bars.map((a, i) => (
              <div key={a.key} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                <span className="label pointer-events-none absolute -top-7 whitespace-nowrap text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {a.key} tuổi · {nf.format(a.count)}
                </span>
                <motion.span
                  className={`w-full origin-bottom rounded-t-[1px] transition-colors duration-300 group-hover:bg-shu ${a === mode ? "bg-shu" : "bg-paper"}`}
                  style={{ height: `${Math.max(1, (a.count / peak) * 100)}%` }}
                  initial={{ transform: "scaleY(0)" }}
                  whileInView={{ transform: "scaleY(1)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.3, delay: i * 0.03, ease: EASE }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-1 border-t border-paper/25 pt-2 md:gap-1.5">
            {bars.map((a) => (
              <span key={a.key} className="label flex-1 text-center text-[0.56rem] text-paper/55">
                {a.tick}
              </span>
            ))}
          </div>
          <Rise className="mt-12 grid grid-cols-2 gap-8">
            <div className="min-w-0">
              <p className="num text-5xl text-shu sm:text-6xl">{mode.key}</p>
              <p className="label mt-2 text-paper/55">Độ tuổi đông nhất</p>
            </div>
            <div className="min-w-0">
              <p className="num text-6xl">{percent(young.count, all)}</p>
              <p className="label mt-2 text-paper/55">{young.label}</p>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
