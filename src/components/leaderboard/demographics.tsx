"use client";
import { motion } from "motion/react";
import { nf, percent } from "@/lib/format";
import { EASE } from "@/lib/motion";

export default function Demographics({
  gender,
  ages,
  votes,
}: {
  gender: { male: number; female: number };
  ages: { age: number; count: number }[];
  votes: number;
}) {
  const total = gender.male + gender.female;
  const peak = Math.max(...ages.map((a) => a.count));
  const mode = ages.find((a) => a.count === peak)!;
  const under22 = ages.filter((a) => a.age <= 22).reduce((s, a) => s + a.count, 0);

  return (
    <section className="relative overflow-hidden bg-ink px-5 py-24 text-paper md:px-16 md:py-36" aria-label="Chân dung người bình chọn">
      <span className="label text-shu">Chân dung người bình chọn</span>
      <h2 className="display mt-5 text-[12vw] leading-[0.95] md:text-[6.4vw]">
        Ai đã <span className="outline-text">bỏ phiếu?</span>
      </h2>

      <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-[1fr_1.5fr] md:gap-20">
        <div>
          <h3 className="label text-paper/50">Giới tính</h3>
          <div className="mt-6 flex h-28 w-full overflow-hidden md:h-36">
            <motion.div
              className="relative flex items-end bg-paper p-3 text-ink"
              initial={{ width: "0%" }}
              whileInView={{ width: `${(gender.male / total) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: EASE }}
            >
              <span className="display text-4xl md:text-5xl">{percent(gender.male, total)}</span>
            </motion.div>
            <div className="relative flex-1 bg-shu">
              <div className="absolute inset-0 text-ink/25 tone" />
            </div>
          </div>
          <dl className="mt-4 flex justify-between">
            <div>
              <dt className="label text-paper/50">Nam</dt>
              <dd className="mt-1 font-serif text-xl italic">{nf.format(gender.male)} người</dd>
            </div>
            <div className="text-right">
              <dt className="label text-shu">Nữ · {percent(gender.female, total)}</dt>
              <dd className="mt-1 font-serif text-xl italic">{nf.format(gender.female)} người</dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="label text-paper/50">
              Độ tuổi ({ages[0].age}-{ages[ages.length - 1].age})
            </h3>
            <span className="label text-paper/50">
              Đông nhất: <span className="text-shu">{mode.age} tuổi</span>
            </span>
          </div>
          <div className="mt-6 flex h-52 items-end gap-[3px] md:h-64" role="img" aria-label={`Phân bố độ tuổi, đông nhất là ${mode.age} tuổi với ${mode.count} người`}>
            {ages.map((a, i) => (
              <div key={a.age} className="group relative flex h-full flex-1 items-end">
                <motion.div
                  className={`w-full origin-bottom ${a.count === peak ? "bg-shu" : "bg-paper/85 group-hover:bg-paper"}`}
                  style={{ height: `${Math.max(0.6, (a.count / peak) * 100)}%` }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: i * 0.025, ease: EASE }}
                />
                <span className="label pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap bg-paper px-2 py-1 text-ink group-hover:block">
                  {a.age} tuổi · {nf.format(a.count)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between border-t border-paper/20 pt-2">
            {[ages[0].age, 15, 20, 25, 30, 35, ages[ages.length - 1].age].map((t) => (
              <span key={t} className="label text-paper/45">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-8 max-w-[40ch] font-serif text-xl italic leading-snug text-paper/70">
            {percent(under22, votes)} người bình chọn từ 22 tuổi trở xuống. Light Novel vẫn là câu chuyện của tuổi trẻ.
          </p>
        </div>
      </div>
    </section>
  );
}
