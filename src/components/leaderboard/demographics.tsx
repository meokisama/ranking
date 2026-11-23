"use client";
import { motion } from "motion/react";
import Rise, { Kicker, Lines } from "@/components/ui/reveal";import { nf, percent } from "@/lib/format";
import { EASE } from "@/lib/motion";

/** Who held the ballots: the split by gender, and one stack of pages per year of age. */
export default function Demographics({ gender, ages }: { gender: { male: number; female: number }; ages: { age: number; count: number }[] }) {
  const total = gender.male + gender.female;
  const peak = Math.max(...ages.map((a) => a.count));
  const mode = ages.find((a) => a.count === peak)!;
  const under22 = ages.filter((a) => a.age <= 22).reduce((s, a) => s + a.count, 0);
  const all = ages.reduce((s, a) => s + a.count, 0);

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
        </Rise>

        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="label text-paper/55">Độ tuổi</h3>
            <span className="label text-paper/55">Mỗi cột là một tuổi</span>
          </div>
          <div className="mt-10 flex h-56 items-end gap-1 md:h-72 md:gap-1.5">
            {ages.map((a, i) => (
              <div key={a.age} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                <span className="label pointer-events-none absolute -top-7 whitespace-nowrap text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {a.age} tuổi · {nf.format(a.count)}
                </span>
                <motion.span
                  className={`w-full origin-bottom rounded-t-[1px] transition-colors duration-300 group-hover:bg-shu ${a.age === mode.age ? "bg-shu" : "bg-paper"}`}
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
            {ages.map((a, i) => (
              <span key={a.age} className="label flex-1 text-center text-[0.56rem] text-paper/55">
                {i % 2 === 0 ? a.age : ""}
              </span>
            ))}
          </div>
          <Rise className="mt-12 grid grid-cols-2 gap-8">
            <div>
              <p className="num text-6xl text-shu">{mode.age}</p>
              <p className="label mt-2 text-paper/55">Độ tuổi đông nhất</p>
            </div>
            <div>
              <p className="num text-6xl">{percent(under22, all)}</p>
              <p className="label mt-2 text-paper/55">Từ 22 tuổi trở xuống</p>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
