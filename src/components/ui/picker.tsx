"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { EASE } from "@/lib/motion";

export type PickerOption = { key: string; label: string; hint?: string; href?: string };

/** A chip that opens a short list below it. Options with `href` navigate; the rest call `onChoose`. */
export default function Picker({
  label,
  value,
  options,
  onChoose,
  align = "left",
  className = "",
}: {
  label: string;
  value: string;
  options: PickerOption[];
  onChoose?: (key: string) => void;
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const current = options.find((o) => o.key === value);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const row = "flex w-full items-center gap-3 rounded-[6px] px-3 py-2.5 text-left text-[0.9rem] transition-colors hover:bg-ink/[0.06]";

  return (
    <div ref={root} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${label}: ${current?.label ?? ""}`}
        onClick={() => setOpen((o) => !o)}
        className="btn-ghost chip w-full max-w-full justify-between"
      >
        <span className="truncate">{current?.label}</span>
        <ChevronDown className={`size-3.5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={id}
            role="listbox"
            aria-label={label}
            data-lenis-prevent
            initial={{ opacity: 0, transform: "translateY(-6px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={{ opacity: 0, transform: "translateY(-6px)", transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: EASE }}
            className={`hair absolute top-full z-50 mt-2 max-h-[min(26rem,60svh)] w-max min-w-full max-w-[calc(100vw-2.5rem)] overflow-y-auto rounded-[10px] border bg-paper p-1.5 shadow-xl ${align === "right" ? "right-0" : "left-0"}`}
          >
            {options.map((o) => {
              const selected = o.key === value;
              const body = (
                <>
                  <Check className={`size-3.5 shrink-0 text-shu ${selected ? "" : "invisible"}`} aria-hidden />
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {o.hint && <span className="label shrink-0 text-mute">{o.hint}</span>}
                </>
              );
              return (
                <li key={o.key} role="option" aria-selected={selected}>
                  {o.href ? (
                    <Link href={o.href} scroll={false} onClick={() => setOpen(false)} className={row}>
                      {body}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onChoose?.(o.key);
                      }}
                      className={row}
                    >
                      {body}
                    </button>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
