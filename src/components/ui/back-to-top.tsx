"use client";
import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";

export default function BackToTop() {
  const lenis = useLenis();
  return (
    <button
      onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2.2 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
      className="group inline-flex items-center gap-3 text-[0.85rem] text-paper/80 transition-colors hover:text-gold"
    >
      Về đầu sách
      <span className="grid size-9 place-items-center rounded-full border border-gold/50 text-gold transition-colors duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-cloth">
        <ArrowUp className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5" aria-hidden />
      </span>
    </button>
  );
}
