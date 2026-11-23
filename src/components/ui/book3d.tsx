"use client";
import { useRef } from "react";
import Cover, { FALLBACK } from "./cover";

/**
 * A book in CSS 3D: the cover, a spine in the book's own colour, and the block of pages. Straightens on hover.
 * With `tilt`, the book follows the pointer instead, leaning toward it as if picked up and turned in the hand.
 */
export default function Book3D({
  name,
  cover,
  color,
  sub,
  thickness = 26,
  tilt = false,
  className = "",
}: {
  name: string;
  cover?: string | null;
  color?: string | null;
  sub?: string;
  thickness?: number;
  tilt?: boolean;
  className?: string;
}) {
  const body = useRef<HTMLDivElement>(null);

  const move = (ev: React.PointerEvent<HTMLDivElement>) => {
    const el = body.current;
    if (!tilt || !el || ev.pointerType !== "mouse") return;
    const r = ev.currentTarget.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width - 0.5;
    const y = (ev.clientY - r.top) / r.height - 0.5;
    el.style.transition = "transform 0.45s var(--ease-out-expo)";
    el.style.transform = `rotateY(${(-12 + x * 16).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg) translateY(-10px)`;
  };
  const leave = () => {
    const el = body.current;
    if (!el) return;
    el.style.transition = "";
    el.style.transform = "";
  };

  return (
    <div className={`book3d ${className}`} onPointerMove={tilt ? move : undefined} onPointerLeave={tilt ? leave : undefined}>
      <div ref={body} className="book3d-body" style={{ ["--t" as string]: `${thickness}px`, ["--c" as string]: color ?? FALLBACK }}>
        <div className="book3d-back" />
        <div className="book3d-pages" />
        <div className="book3d-spine" />
        <div className="book3d-face">
          <Cover name={name} cover={cover} color={color} sub={sub} className="!aspect-auto h-full !rounded-none !shadow-none" />
        </div>
      </div>
    </div>
  );
}
