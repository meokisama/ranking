"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { ArrowLeft, ArrowRight, Check, Search } from "lucide-react";
import Cover from "@/components/ui/cover";
import { CATEGORIES, VOTING } from "@/lib/config";
import { fold, pad } from "@/lib/format";
import { EASE } from "@/lib/motion";
import { store } from "@/lib/storage";
import Field from "./field";
import type { Extra, Picks, VoteStep } from "./types";

const ENDPOINT = process.env.NEXT_PUBLIC_SEND_VOTE;
const SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY;
const DRAFT_KEY = `${VOTING.storageKey}:draft`;
const EMPTY: Extra = { topic: "", content: "", title: "", publisher: "", gender: "", age: "" };

const ERRORS: Record<string, string> = {
  rateLimit: "Bạn đã bình chọn trước đó. Mỗi địa chỉ IP chỉ có một lá phiếu.",
  invalidCaptcha: "Captcha không hợp lệ. Hãy xác minh lại, hoặc tải lại trang nếu cần.",
};

/**
 * The mark of a choice: a vermilion seal pressed onto the cover, which fades back under it like a book already
 * set aside. It comes down hard, a little crooked, as a hand-held stamp does.
 */
function Stamp({ n }: { n: number }) {
  return (
    <motion.span
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 -ml-[min(34%,4.75rem)] -mt-[min(34%,4.75rem)] grid aspect-square w-[min(68%,9.5rem)] place-items-center rounded-full border-[4px] border-shu text-shu"
      initial={{ opacity: 0, transform: "scale(1.9) rotate(4deg)" }}
      animate={{ opacity: 1, transform: "scale(1) rotate(-14deg)" }}
      exit={{ opacity: 0, transform: "scale(1.15) rotate(-14deg)", transition: { duration: 0.2 } }}
      transition={{ duration: 0.32, ease: [0.5, 0, 0.75, 0] }}
      aria-hidden
    >
      <span className="absolute inset-[8%] rounded-full border-[1.5px] border-shu" />
      <span className="flex flex-col items-center">
        <span className="font-mono text-[clamp(0.5rem,1.6vw,0.68rem)] font-medium uppercase tracking-[0.18em]">Đã chọn</span>
        <span className="num -my-0.5 text-[clamp(1.8rem,5vw,2.8rem)] font-medium leading-none">{pad(n)}</span>
        <span className="h-[1.5px] w-8 bg-shu" />
      </span>
    </motion.span>
  );
}

/** The ballot: one sheet per category, then a note to the organisers, then the hand-in. */
export default function Ballot({
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
  const total = steps.length + 2; // + feedback + submit
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Picks>({});
  const [extra, setExtra] = useState<Extra>(EMPTY);
  const [q, setQ] = useState("");
  const [onlyPicked, setOnlyPicked] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const loaded = useRef(false);

  // Restore and save a draft so a reload does not lose the selection.
  useEffect(() => {
    try {
      const d = JSON.parse(store.get(DRAFT_KEY) ?? "null");
      if (d?.picks) setPicks(d.picks);
      if (d?.extra) setExtra({ ...EMPTY, ...d.extra });
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (loaded.current) store.set(DRAFT_KEY, JSON.stringify({ picks, extra }));
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

  const missing = steps.filter((s) => !picks[s.key]?.length).map((s) => CATEGORIES[s.key].short);

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
      store.set(VOTING.storageKey, "done");
      store.remove(DRAFT_KEY);
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
    <main className="min-h-svh pb-32">
      <header className="px-5 pt-24 md:px-10 md:pt-28">
        <div className="label flex flex-wrap items-center gap-x-5 gap-y-2 text-mute">
          <span>
            <span className="mr-3 text-shu">●</span>Lá phiếu · {periodLabel}
          </span>
          {preview && <span className="rounded-full bg-ink px-3 py-1 text-paper">Chế độ xem thử · không gửi phiếu</span>}
        </div>

        <ol className="no-scrollbar mt-6 flex gap-1.5 overflow-x-auto" aria-label="Các bước">
          {stepLabels.map((l, i) => {
            const count = steps[i] ? (picks[steps[i].key]?.length ?? 0) : null;
            return (
              <li key={l} className="min-w-28 flex-1">
                <button
                  onClick={() => go(i)}
                  aria-current={i === step ? "step" : undefined}
                  className={`w-full border-t-2 pt-3 text-left transition-colors duration-500 ${
                    i === step ? "border-shu" : i < step ? "border-ink" : "border-ink/15 text-mute hover:text-ink"
                  }`}
                >
                  <span className="label block">
                    {pad(i + 1)}
                    {count !== null && steps[i] && ` · ${count}/${CATEGORIES[steps[i].key].max}`}
                  </span>
                  <span className="display mt-1 block whitespace-nowrap text-xl">{l}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </header>

      <AnimatePresence mode="wait">
        <motion.section
          key={step}
          initial={{ opacity: 0, transform: "translateY(24px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.7, ease: EASE }}
          className="px-5 pt-12 md:px-10 md:pt-16"
        >
          {current && meta && (
            <>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <h1 className="display max-w-[16ch] text-[11vw] md:text-[5.6vw]">{meta.label}</h1>
                  <p className="mt-4 max-w-[56ch] text-[0.95rem] font-light text-ink/75">
                    {meta.blurb} Bạn có tối đa <strong className="font-medium text-shu">{meta.max} phiếu</strong>.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2 md:w-80">
                  <label className="flex h-11 items-center gap-3 rounded-full border border-ink/25 px-4 focus-within:border-ink">
                    <Search className="size-4 shrink-0 text-mute" aria-hidden />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder={`Tìm theo tên ${meta.unit}…`}
                      className="w-full bg-transparent text-[0.9rem] outline-none placeholder:text-mute"
                    />
                  </label>
                  <button onClick={() => setOnlyPicked((v) => !v)} aria-pressed={onlyPicked} className="btn-ghost !h-9 self-start !px-4 !text-[0.8rem]">
                    Chỉ hiện đã chọn ({chosen.length})
                  </button>
                </div>
              </div>

              <ul
                className={`mt-12 grid gap-x-5 gap-y-9 ${
                  current.key === "publisher"
                    ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7"
                }`}
              >
                {visible.map((it) => {
                  const order = chosen.indexOf(it.id);
                  const on = order >= 0;
                  return (
                    <li key={it.id}>
                      <button onClick={() => toggle(it.id)} aria-pressed={on} className="group block w-full text-left">
                        <div className="relative">
                          <div
                            className={`transition-[opacity,filter,translate] duration-500 ease-[var(--ease-out-expo)] ${
                              on ? "opacity-30 grayscale" : "group-hover:-translate-y-1"
                            }`}
                          >
                            {it.logo ? (
                              <div className="relative aspect-square rounded-[2px] bg-white shadow-[0_0_0_1px_rgb(22_18_14/0.1),0_14px_28px_-18px_rgb(22_18_14/0.45)]">
                                <img src={it.logo} alt="" loading="lazy" className="absolute inset-[14%] size-[72%] object-contain" />
                              </div>
                            ) : (
                              <Cover name={it.name} cover={it.cover} color={it.color} sub={it.publisher} />
                            )}
                          </div>
                          <AnimatePresence>{on && <Stamp n={order + 1} />}</AnimatePresence>
                        </div>
                        <span
                          className={`display mt-4 line-clamp-2 block text-[1.1rem] leading-[1.12] transition-colors duration-500 ${
                            on ? "text-shu" : ""
                          }`}
                        >
                          {it.name}
                        </span>
                        {it.publisher && <span className="label mt-1 block truncate text-mute">{it.publisher}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {visible.length === 0 && <p className="display py-20 text-center text-3xl text-mute">Không có kết quả phù hợp.</p>}
            </>
          )}

          {step === steps.length && (
            <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
              <div>
                <h1 className="display text-[11vw] md:text-[5.6vw]">
                  Đôi dòng gửi <i className="text-shu">ban tổ chức</i>
                </h1>
                <p className="mt-5 max-w-[46ch] text-[0.95rem] font-light text-ink/75">
                  Nơi bạn tự do đóng góp ý kiến về tác phẩm, nhà phát hành, dịch giả, series muốn có bản quyền hoặc bất kỳ điều
                  gì liên quan. Phần này không bắt buộc và sẽ được hiển thị ẩn danh ở trang Góp ý.
                </p>
              </div>
              <div className="space-y-9 rounded-[3px] bg-card p-6 shadow-[0_0_0_1px_rgb(22_18_14/0.08)] md:p-10">
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
                <h1 className="display text-[11vw] md:text-[5.6vw]">
                  Soát lại <i className="text-shu">lá phiếu</i>
                </h1>
                <div className="mt-10 space-y-8">
                  {steps.map((s, i) => {
                    const ids = picks[s.key] ?? [];
                    return (
                      <div key={s.key} className="hair border-t pt-4">
                        <div className="flex items-baseline justify-between">
                          <h2 className="display text-2xl">{CATEGORIES[s.key].short}</h2>
                          <button onClick={() => go(i)} className="label link text-mute">
                            Sửa · {ids.length}/{CATEGORIES[s.key].max}
                          </button>
                        </div>
                        {ids.length ? (
                          <ol className="mt-3 space-y-1">
                            {ids.map((id, n) => (
                              <li key={id} className="flex gap-3">
                                <span className="num w-6 shrink-0 text-shu">{pad(n + 1)}</span>
                                {s.items.find((x) => x.id === id)?.name}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="mt-3 text-shu">Chưa chọn. Hạng mục này là bắt buộc.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="h-fit space-y-8 rounded-[3px] bg-card p-6 shadow-[0_0_0_1px_rgb(22_18_14/0.08)] md:sticky md:top-24 md:p-9">
                <h2 className="display text-3xl">Đôi nét về bạn</h2>
                <fieldset>
                  <legend className="label text-mute">Giới tính</legend>
                  <div className="mt-3 flex gap-2">
                    {[
                      ["male", "Nam"],
                      ["female", "Nữ"],
                    ].map(([v, l]) => (
                      <button key={v} onClick={() => setExtra({ ...extra, gender: v })} aria-pressed={extra.gender === v} className="btn-ghost flex-1 justify-center">
                        {extra.gender === v && <Check className="size-4" aria-hidden />}
                        {l}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="block">
                  <span className="label text-mute">Tuổi</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={5}
                    max={100}
                    value={extra.age}
                    onChange={(e) => setExtra({ ...extra, age: e.target.value })}
                    className="num mt-2 w-full border-b border-ink/30 bg-transparent pb-1 text-5xl outline-none focus:border-shu"
                  />
                </label>
                {SITEKEY ? (
                  <HCaptcha sitekey={SITEKEY} onVerify={setToken} onExpire={() => setToken(null)} />
                ) : (
                  <p className="label rounded-[2px] border border-dashed border-ink/30 p-3 leading-relaxed text-mute">
                    Captcha chưa được cấu hình (NEXT_PUBLIC_HCAPTCHA_SITEKEY).
                  </p>
                )}
                <button onClick={submit} disabled={sending} className="btn !h-14 w-full justify-between !pl-6 !text-base">
                  {sending ? "Đang gửi…" : "Bỏ phiếu"}
                  <span className="disc !size-10">
                    <ArrowRight aria-hidden />
                  </span>
                </button>
                <p className="text-[0.8rem] font-light leading-relaxed text-mute">
                  Mỗi địa chỉ IP chỉ được gửi một lá phiếu và không thể sửa sau khi gửi.
                </p>
              </div>
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      <div className="hair fixed inset-x-0 bottom-0 z-40 border-t bg-paper/90 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-5 py-3 md:px-10">
          <button onClick={() => go(step - 1)} disabled={step === 0} className="btn-ghost !h-10 disabled:pointer-events-none disabled:opacity-30">
            <ArrowLeft className="size-4" aria-hidden />
            Quay lại
          </button>
          <span className="label hidden text-mute sm:block">
            {meta ? `Đã chọn ${chosen.length} / ${meta.max} ${meta.unit}` : `Bước ${step + 1} / ${total}`}
          </span>
          {step < total - 1 ? (
            <button onClick={() => go(step + 1)} className="btn !h-10">
              Tiếp tục
              <span className="disc !size-7">
                <ArrowRight aria-hidden />
              </span>
            </button>
          ) : (
            <span className="label text-mute">Bước cuối</span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {notice && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, transform: "translate(-50%, 30px)" }}
            animate={{ opacity: 1, transform: "translate(-50%, 0px)" }}
            exit={{ opacity: 0, transform: "translate(-50%, 16px)" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed bottom-20 left-1/2 z-50 w-[min(92vw,30rem)] rounded-[3px] bg-ink p-5 text-paper shadow-2xl"
          >
            <span className="label block text-shu">Lưu ý</span>
            <span className="mt-1 block leading-snug">{notice}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
