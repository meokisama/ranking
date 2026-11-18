"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Cover } from "@/components/ui/Book";
import { CATEGORIES, VOTING, votingState } from "@/lib/config";
import type { CategoryKey, VotingState } from "@/lib/config";
import { pad } from "@/lib/data";

type Item = { id: number; name: string; publisher?: string; cover?: string | null; color?: string | null; logo?: string };
export type VoteStep = { key: CategoryKey; items: Item[] };
type Picks = Partial<Record<CategoryKey, number[]>>;
type Extra = { topic: string; content: string; title: string; publisher: string; gender: string; age: string };

const EASE = [0.16, 1, 0.3, 1] as const;
const ENDPOINT = process.env.NEXT_PUBLIC_SEND_VOTE;
const SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY;
const DRAFT_KEY = `${VOTING.storageKey}:draft`;
const EMPTY: Extra = { topic: "", content: "", title: "", publisher: "", gender: "", age: "" };

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
const when = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });

const ERRORS: Record<string, string> = {
  rateLimit: "Bạn đã bình chọn trước đó. Mỗi địa chỉ IP chỉ có một lá phiếu.",
  invalidCaptcha: "Captcha không hợp lệ. Hãy xác minh lại, hoặc tải lại trang nếu cần.",
};

export default function VoteFlow({ steps, periodLabel }: { steps: VoteStep[]; periodLabel: string }) {
  const [state, setState] = useState<VotingState | null>(null);
  const [preview, setPreview] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    setState(votingState());
    setPreview(new URLSearchParams(window.location.search).has("preview"));
    setVoted(localStorage.getItem(VOTING.storageKey) === "done");
  }, []);

  if (state === null) return <main className="min-h-svh bg-ink" />;
  if (voted) return <Gate tone="done" periodLabel={periodLabel} />;
  if (state !== "open" && !preview) return <Gate tone={state} periodLabel={periodLabel} />;
  return <Ballot steps={steps} periodLabel={periodLabel} preview={state !== "open"} onDone={() => setVoted(true)} />;
}

/* ───────── Màn cổng: chưa mở / đã đóng / đã bỏ phiếu ───────── */

function Gate({ tone, periodLabel }: { tone: "upcoming" | "closed" | "done"; periodLabel: string }) {
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

/* ───────── Lá phiếu ───────── */

function Ballot({
  steps,
  periodLabel,
  preview,
  onDone,
}: {
  steps: VoteStep[];
  periodLabel: string;
  preview: boolean;
  onDone: () => void;
}) {
  const total = steps.length + 2; // + góp ý + gửi phiếu
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Picks>({});
  const [extra, setExtra] = useState<Extra>(EMPTY);
  const [q, setQ] = useState("");
  const [onlyPicked, setOnlyPicked] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const loaded = useRef(false);

  // Khôi phục / lưu bản nháp để lỡ tải lại trang không mất lựa chọn.
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
      if (d?.picks) setPicks(d.picks);
      if (d?.extra) setExtra({ ...EMPTY, ...d.extra });
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (loaded.current) localStorage.setItem(DRAFT_KEY, JSON.stringify({ picks, extra }));
  }, [picks, extra]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4200);
    return () => clearTimeout(t);
  }, [notice]);

  const go = (n: number) => {
    setStep(Math.max(0, Math.min(total - 1, n)));
    setQ("");
    setOnlyPicked(false);
    window.scrollTo({ top: 0 });
  };

  const current = steps[step];
  const meta = current ? CATEGORIES[current.key] : null;
  const chosen = current ? (picks[current.key] ?? []) : [];

  const toggle = (id: number) => {
    if (!current || !meta) return;
    if (chosen.includes(id)) {
      setPicks({ ...picks, [current.key]: chosen.filter((x) => x !== id) });
    } else if (chosen.length >= meta.max) {
      setNotice(`Chỉ được chọn tối đa ${meta.max} ${meta.unit}. Hãy bỏ bớt một lựa chọn trước.`);
    } else {
      setPicks({ ...picks, [current.key]: [...chosen, id] });
    }
  };

  const visible = useMemo(() => {
    if (!current) return [];
    const needle = fold(q.trim());
    return current.items.filter(
      (it) =>
        (!onlyPicked || chosen.includes(it.id)) &&
        (!needle || fold(it.name).includes(needle) || fold(it.publisher ?? "").includes(needle))
    );
  }, [current, q, onlyPicked, chosen]);

  const missing = steps.filter((s) => !(picks[s.key]?.length)).map((s) => CATEGORIES[s.key].short);

  const submit = async () => {
    const age = Number(extra.age);
    if (missing.length) return setNotice(`Còn hạng mục chưa chọn: ${missing.join(", ")}.`);
    if (!extra.gender) return setNotice("Vui lòng chọn giới tính của bạn.");
    if (!age || age < 5 || age > 100) return setNotice("Vui lòng nhập tuổi hợp lệ.");
    if (preview) return setNotice("Đang ở chế độ xem thử, phiếu sẽ không được gửi.");
    if (!ENDPOINT) return setNotice("Chưa cấu hình máy chủ nhận phiếu (NEXT_PUBLIC_SEND_VOTE).");
    if (!token) return setNotice("Vui lòng hoàn thành captcha trước khi gửi.");

    const body: Record<string, unknown> = {
      feedback: { topic: extra.topic, content: extra.content, title: extra.title, publisher: extra.publisher },
      userInfo: { gender: extra.gender, age },
      token,
    };
    for (const s of steps) body[CATEGORIES[s.key].api] = picks[s.key];

    setSending(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.message !== "created") throw new Error(data.message ?? "unknown");
      localStorage.setItem(VOTING.storageKey, "done");
      localStorage.removeItem(DRAFT_KEY);
      onDone();
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setNotice(ERRORS[code] ?? "Không gửi được phiếu. Hãy kiểm tra kết nối và thử lại.");
    } finally {
      setSending(false);
    }
  };

  const stepLabels = [...steps.map((s) => CATEGORIES[s.key].short), "Góp ý", "Gửi phiếu"];

  return (
    <main className="min-h-svh bg-paper pb-36 text-ink">
      <header className="px-5 pt-28 md:px-16 md:pt-36">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="label text-shu">Lá phiếu · {periodLabel}</span>
          {preview && <span className="label bg-ink px-2 py-1 text-paper">Chế độ xem thử · không gửi phiếu</span>}
        </div>

        {/* thanh bước */}
        <ol className="mt-6 flex gap-1 overflow-x-auto" aria-label="Các bước">
          {stepLabels.map((l, i) => {
            const count = steps[i] ? (picks[steps[i].key]?.length ?? 0) : null;
            return (
              <li key={l} className="min-w-28 flex-1">
                <button
                  onClick={() => go(i)}
                  aria-current={i === step ? "step" : undefined}
                  className={`w-full border-t-[3px] pt-3 text-left transition-colors duration-300 ${
                    i === step ? "border-shu" : i < step ? "border-ink" : "border-ink/20 text-ink/45 hover:text-ink"
                  }`}
                >
                  <span className="label block">
                    {pad(i + 1)}
                    {count !== null && steps[i] && ` · ${count}/${CATEGORIES[steps[i].key].max}`}
                  </span>
                  <span className="display mt-1 block whitespace-nowrap text-sm md:text-base">{l}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </header>

      <AnimatePresence mode="wait">
        <motion.section
          key={step}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="px-5 pt-12 md:px-16 md:pt-16"
        >
          {current && meta && (
            <>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <h1 className="display max-w-[16ch] text-[10vw] leading-[0.98] md:text-[5vw]">{meta.label}</h1>
                  <p className="mt-4 max-w-[52ch] font-serif text-lg italic leading-snug text-ink/65">
                    “{meta.blurb}” Bạn có tối đa <strong className="not-italic text-shu">{meta.max} phiếu</strong>.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-3 md:w-80">
                  <label className="flex items-center gap-3 border-b border-ink pb-2">
                    <span className="label text-ink/50">Tìm</span>
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder={`Tên ${meta.unit}…`}
                      className="w-full bg-transparent font-serif text-lg italic outline-none placeholder:text-ink/35"
                    />
                  </label>
                  <button
                    onClick={() => setOnlyPicked((v) => !v)}
                    aria-pressed={onlyPicked}
                    className={`label self-start border px-3 py-2 transition-colors ${
                      onlyPicked ? "border-ink bg-ink text-paper" : "border-ink/30 hover:border-ink"
                    }`}
                  >
                    Chỉ hiện đã chọn ({chosen.length})
                  </button>
                </div>
              </div>

              <ul
                className={`mt-10 grid gap-x-4 gap-y-8 ${
                  current.key === "publisher"
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7"
                }`}
              >
                {visible.map((it) => {
                  const order = chosen.indexOf(it.id);
                  const on = order >= 0;
                  return (
                    <li key={it.id}>
                      <button onClick={() => toggle(it.id)} aria-pressed={on} className="group block w-full text-left">
                        <div
                          className={`relative overflow-hidden transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] ${
                            it.logo ? "aspect-square bg-white" : "aspect-[400/568] bg-paper-2"
                          } ${on ? "-translate-y-2 shadow-[0_18px_30px_-12px_rgb(0_0_0/0.45)] ring-[3px] ring-shu" : "group-hover:-translate-y-1"}`}
                        >
                          {it.logo ? (
                            <div className="grid size-full place-items-center p-5">
                              <img src={it.logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                            </div>
                          ) : (
                            <Cover name={it.name} cover={it.cover} color={it.color} sub={it.publisher} />
                          )}
                          {on && (
                            <motion.span
                              initial={{ y: "100%" }}
                              animate={{ y: 0 }}
                              transition={{ duration: 0.4, ease: EASE }}
                              className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-shu px-3 py-2 text-paper"
                            >
                              <span className="label">Đã chọn</span>
                              <span className="display text-lg leading-none">{pad(order + 1)}</span>
                            </motion.span>
                          )}
                        </div>
                        <span className="mt-3 line-clamp-2 block font-serif text-[15px] leading-snug">{it.name}</span>
                        {it.publisher && <span className="label mt-1 block truncate text-ink/45">{it.publisher}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {visible.length === 0 && (
                <p className="py-20 text-center font-serif text-2xl italic text-ink/50">Không có kết quả phù hợp.</p>
              )}
            </>
          )}

          {step === steps.length && (
            <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
              <div>
                <h1 className="display text-[10vw] leading-[0.98] md:text-[5vw]">
                  Chia sẻ <span className="text-shu">ý kiến</span> và đề xuất
                </h1>
                <p className="mt-5 max-w-[44ch] text-[15px] leading-relaxed text-ink/70">
                  Nơi bạn tự do đóng góp ý kiến về tác phẩm, nhà phát hành, dịch giả, series muốn có bản quyền hoặc bất
                  kỳ điều gì liên quan. Phần này không bắt buộc và sẽ được hiển thị ẩn danh ở trang Góp ý.
                </p>
              </div>
              <div className="space-y-8">
                <Field label="Chủ đề" value={extra.topic} max={120} onChange={(v) => setExtra({ ...extra, topic: v })} />
                <Field label="Nội dung" value={extra.content} max={500} area onChange={(v) => setExtra({ ...extra, content: v })} />
                <Field label="Bộ truyện bạn mong có bản quyền" value={extra.title} max={160} onChange={(v) => setExtra({ ...extra, title: v })} />
                <Field label="Nhà phát hành bạn muốn gửi gắm" value={extra.publisher} max={120} onChange={(v) => setExtra({ ...extra, publisher: v })} />
              </div>
            </div>
          )}

          {step === steps.length + 1 && (
            <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-20">
              <div>
                <h1 className="display text-[10vw] leading-[0.98] md:text-[5vw]">
                  Soát lại <span className="text-shu">lá phiếu</span>
                </h1>
                <div className="mt-10 space-y-8">
                  {steps.map((s, i) => {
                    const ids = picks[s.key] ?? [];
                    return (
                      <div key={s.key} className="border-t border-ink pt-4">
                        <div className="flex items-baseline justify-between">
                          <h2 className="display text-xl">{CATEGORIES[s.key].short}</h2>
                          <button onClick={() => go(i)} className="label link-underline pb-0.5 text-ink/60">
                            Sửa · {ids.length}/{CATEGORIES[s.key].max}
                          </button>
                        </div>
                        {ids.length ? (
                          <ol className="mt-3 space-y-1 font-serif text-lg">
                            {ids.map((id, n) => (
                              <li key={id} className="flex gap-3">
                                <span className="label w-6 shrink-0 pt-1.5 text-shu">{pad(n + 1)}</span>
                                {s.items.find((x) => x.id === id)?.name}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="mt-3 font-serif text-lg italic text-shu">Chưa chọn. Hạng mục này là bắt buộc.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="h-fit space-y-8 border border-ink p-6 md:sticky md:top-28 md:p-8">
                <h2 className="display text-2xl">Đôi nét về bạn</h2>
                <fieldset>
                  <legend className="label text-ink/55">Giới tính</legend>
                  <div className="mt-3 flex gap-2">
                    {[
                      ["male", "Nam"],
                      ["female", "Nữ"],
                    ].map(([v, l]) => (
                      <button
                        key={v}
                        onClick={() => setExtra({ ...extra, gender: v })}
                        aria-pressed={extra.gender === v}
                        className={`display flex-1 border py-3 text-lg transition-colors ${
                          extra.gender === v ? "border-shu bg-shu text-paper" : "border-ink/30 hover:border-ink"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="block">
                  <span className="label text-ink/55">Tuổi</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={5}
                    max={100}
                    value={extra.age}
                    onChange={(e) => setExtra({ ...extra, age: e.target.value })}
                    className="display mt-2 w-full border-b border-ink bg-transparent pb-1 text-5xl outline-none"
                  />
                </label>
                {SITEKEY ? (
                  <HCaptcha sitekey={SITEKEY} onVerify={setToken} onExpire={() => setToken(null)} />
                ) : (
                  <p className="label border border-dashed border-ink/40 p-3 leading-relaxed text-ink/60">
                    Captcha chưa được cấu hình (NEXT_PUBLIC_HCAPTCHA_SITEKEY).
                  </p>
                )}
                <button
                  onClick={submit}
                  disabled={sending}
                  className="group relative h-16 w-full overflow-hidden bg-ink text-paper disabled:opacity-50"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-shu transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
                  <span className="display relative text-xl">{sending ? "Đang gửi…" : "Bỏ phiếu"}</span>
                </button>
                <p className="text-xs leading-relaxed text-ink/55">
                  Mỗi địa chỉ IP chỉ được gửi một lá phiếu và không thể sửa sau khi gửi.
                </p>
              </div>
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      {/* thanh điều hướng đáy */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-paper/15 bg-ink text-paper">
        <div className="flex items-center justify-between gap-4 px-5 py-3 md:px-16 md:py-4">
          <button onClick={() => go(step - 1)} disabled={step === 0} className="label py-2 disabled:opacity-30">
            ← Quay lại
          </button>
          <span className="label hidden text-paper/55 sm:block">
            {meta ? `Đã chọn ${chosen.length} / ${meta.max} ${meta.unit}` : `Bước ${step + 1} / ${total}`}
          </span>
          {step < total - 1 ? (
            <button onClick={() => go(step + 1)} className="label bg-paper px-5 py-3 text-ink transition-colors hover:bg-shu hover:text-paper">
              Tiếp tục →
            </button>
          ) : (
            <span className="label text-paper/55">Bước cuối</span>
          )}
        </div>
      </div>

      {/* thông báo */}
      <AnimatePresence>
        {notice && (
          <motion.div
            role="alert"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed bottom-24 left-1/2 z-50 w-[min(92vw,30rem)] -translate-x-1/2 bg-shu p-4 text-paper shadow-2xl"
          >
            <span className="label block opacity-80">Lưu ý</span>
            <span className="mt-1 block font-serif text-lg leading-snug">{notice}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  max,
  area,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  area?: boolean;
}) {
  const cls =
    "mt-2 w-full border-b border-ink bg-transparent pb-2 font-serif text-xl outline-none transition-colors focus:border-shu";
  return (
    <label className="block">
      <span className="label flex justify-between text-ink/55">
        {label}
        <span>
          {value.length}/{max}
        </span>
      </span>
      {area ? (
        <textarea rows={5} maxLength={max} value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-y`} />
      ) : (
        <input maxLength={max} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}
