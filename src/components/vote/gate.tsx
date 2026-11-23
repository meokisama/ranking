"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Kicker, Lines } from "@/components/ui/reveal";
import { VOTING } from "@/lib/config";
import { dateVN } from "@/lib/format";
import { EASE, fadeUp } from "@/lib/motion";

/** Shown instead of the ballot: voting not open yet, already closed, or already voted. */
export default function Gate({ tone, periodLabel }: { tone: "upcoming" | "closed" | "done"; periodLabel: string }) {
  const copy = {
    upcoming: {
      kicker: "Sắp mở hòm phiếu",
      lines: ["Hòm phiếu", "chưa mở"],
      body: `Bình chọn ${periodLabel} sẽ mở lúc ${dateVN(VOTING.start, true)}. Hẹn gặp bạn khi đó.`,
    },
    closed: {
      kicker: "Đã niêm phong hòm phiếu",
      lines: ["Hòm phiếu", "đã niêm phong"],
      body: `Bình chọn ${periodLabel} đã kết thúc lúc ${dateVN(VOTING.end, true)}. Kết quả đã được công bố, hẹn gặp lại bạn ở kỳ tiếp theo.`,
    },
    done: {
      kicker: "Đã ghi nhận lá phiếu",
      lines: ["Cảm ơn bạn", "đã bình chọn"],
      body: "Lá phiếu của bạn đã nằm trong hòm. Kết quả sẽ được công bố sau khi ban tổ chức kiểm phiếu xong.",
    },
  }[tone];

  return (
    <main className="relative flex min-h-svh flex-col justify-end overflow-hidden px-5 pb-12 pt-28 md:px-10 md:pb-16">
      {/* A few ballots left on the table. */}
      <div className="pointer-events-none absolute right-[-6vw] top-[16svh] hidden md:block" aria-hidden>
        {[-14, -5, 6].map((r, i) => (
          <motion.div
            key={r}
            className="absolute right-0 top-0 h-[52svh] w-[37svh] rounded-[2px] bg-card shadow-[0_0_0_1px_rgb(22_18_14/0.08),0_40px_60px_-40px_rgb(22_18_14/0.55)]"
            initial={{ opacity: 0, transform: `translate(${30 + i * 20}vw, -20svh) rotate(${r * 3}deg)` }}
            animate={{ opacity: 1, transform: `translate(${-i * 7}vw, ${i * 3}svh) rotate(${r}deg)` }}
            transition={{ duration: 1.6, delay: 0.15 + i * 0.14, ease: EASE }}
          >
            <div className="flex h-full flex-col gap-3 p-[9%]">
              <span className="label text-mute">Lá phiếu · {periodLabel}</span>
              {Array.from({ length: 11 }, (_, k) => (
                <span key={k} className="h-px bg-ink/15" style={{ width: `${55 + ((k * 37 + i * 13) % 40)}%`, marginTop: "5.5%" }} />
              ))}
              {i === 2 && <span className="mt-auto size-5 self-end rounded-full bg-shu" />}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative">
        <Kicker no="●">
          {copy.kicker} · {periodLabel}
        </Kicker>
        <Lines
          as="h1"
          className="display mt-6 text-[16vw] md:text-[11vw]"
          label={copy.lines.join(" ")}
        >
          {copy.lines[0]}
          <>
            <i className="text-shu">{copy.lines[1]}</i>
            <span className="text-shu">.</span>
          </>
        </Lines>
        <motion.div {...fadeUp(0.5, 20)}>
          <p className="mt-8 max-w-[46ch] text-[0.95rem] font-light text-ink/75">{copy.body}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/leaderboard" className="btn">
              Xem bảng tổng sắp
              <span className="disc">
                <ArrowRight aria-hidden />
              </span>
            </Link>
            <Link href="/feedback" className="btn-ghost">
              Đọc góp ý của độc giả
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
