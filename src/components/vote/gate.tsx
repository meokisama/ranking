"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { VOTING } from "@/lib/config";
import { EASE } from "@/lib/motion";

const when = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });

/** Gate shown instead of the ballot: voting not open yet, already closed, or already voted. */
export default function Gate({ tone, periodLabel }: { tone: "upcoming" | "closed" | "done"; periodLabel: string }) {
  const copy = {
    upcoming: {
      jp: "準備中",
      kicker: "Sắp mở cổng",
      title: ["Cổng bình chọn", "chưa mở"],
      body: `Bình chọn ${periodLabel} sẽ mở lúc ${when(VOTING.start)}. Hẹn gặp bạn khi đó.`,
    },
    closed: {
      jp: "投票終了",
      kicker: "Đã khoá hòm phiếu",
      title: ["Cổng bình chọn", "đã đóng"],
      body: `Bình chọn ${periodLabel} đã kết thúc lúc ${when(VOTING.end)}. Kết quả đã được công bố, hẹn gặp lại bạn ở kỳ tiếp theo.`,
    },
    done: {
      jp: "ありがとう",
      kicker: "Đã ghi nhận lá phiếu",
      title: ["Cảm ơn bạn", "đã bình chọn"],
      body: "Lá phiếu của bạn đã nằm trong hòm. Kết quả sẽ được công bố sau khi ban tổ chức kiểm phiếu xong.",
    },
  }[tone];

  return (
    <main className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink px-5 pb-14 pt-32 text-paper md:px-16 md:pb-20">
      <div className="pointer-events-none absolute -right-[10vw] -top-[10vw] size-[60vw] rounded-full text-shu/35 tone-lg" aria-hidden />
      <motion.div
        className="tategaki pointer-events-none absolute right-6 top-32 text-[9vw] leading-none text-shu md:right-16 md:text-[6.5vw]"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: EASE }}
        aria-hidden
      >
        {copy.jp}
      </motion.div>

      <span className="label relative text-shu">
        {copy.kicker} · {periodLabel}
      </span>
      <h1 className="display relative mt-5 text-[14vw] leading-[0.92] md:text-[10vw]">
        {copy.title.map((l, i) => (
          <span key={l} className="block overflow-hidden pt-[0.14em]">
            <motion.span
              className={`block ${i === 1 ? "outline-text" : ""}`}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 0.1 + i * 0.1, ease: EASE }}
            >
              {l}
            </motion.span>
          </span>
        ))}
      </h1>
      <p className="relative mt-8 max-w-[44ch] text-[15px] leading-relaxed text-paper/70">{copy.body}</p>
      <div className="relative mt-10 flex flex-wrap items-center gap-6">
        <Link href="/leaderboard" className="group relative inline-flex h-14 items-center gap-4 overflow-hidden bg-paper px-6 text-ink">
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-shu transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
          <span className="label relative transition-colors duration-300 group-hover:text-paper">Xem bảng tổng sắp →</span>
        </Link>
        <Link href="/feedback" className="label link-underline pb-1">
          Đọc góp ý của độc giả
        </Link>
      </div>
    </main>
  );
}
