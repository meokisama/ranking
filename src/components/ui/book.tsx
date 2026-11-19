import type { CSSProperties } from "react";

const FALLBACKS = ["#b8432b", "#1f4b5c", "#6b5a2e", "#4a2f4f", "#2f4a36", "#7a3b1f"];
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Cover: the real image, or a typeset fallback when there is none. */
export function Cover({
  name,
  cover,
  color,
  sub,
  eager,
}: {
  name: string;
  cover?: string | null;
  color?: string | null;
  sub?: string;
  eager?: boolean;
}) {
  if (cover) {
    return (
      <img
        src={cover}
        alt={`Bìa ${name}`}
        width={400}
        height={568}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="size-full object-cover"
        draggable={false}
      />
    );
  }
  const bg = color ?? FALLBACKS[hash(name) % FALLBACKS.length];
  return (
    <div
      className="@container relative flex size-full flex-col justify-between overflow-hidden p-[9%] text-paper"
      style={{ background: bg }}
      role="img"
      aria-label={`Bìa ${name}`}
    >
      <div className="absolute inset-0 text-black/15 tone" aria-hidden />
      <span className="label relative text-[5cqw] opacity-80">Light Novel</span>
      <span className="display relative line-clamp-5 text-[11.5cqw] leading-[1.08]">{name}</span>
      <span className="relative border-t border-current/40 pt-[4%] font-mono text-[4.6cqw] uppercase tracking-wider opacity-80">
        {sub ?? "BXH LNVN"}
      </span>
    </div>
  );
}

/** CSS 3D book: cover, spine and page block. Straightens on hover. */
export default function Book({
  name,
  cover,
  color,
  sub,
  depth = 26,
  eager,
  className = "",
  style,
}: {
  name: string;
  cover?: string | null;
  color?: string | null;
  sub?: string;
  depth?: number;
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`book-stage ${className}`} style={style}>
      <div
        className="book"
        style={
          {
            "--d": `${depth}px`,
            "--book-color": color ?? "#24211d",
            ...(cover ? { "--cover": `url("${cover}")` } : {}),
          } as CSSProperties
        }
      >
        <div className="back" />
        <div className="spine" />
        <div className="pages" />
        <div className="top" />
        <div className="face">
          <Cover name={name} cover={cover} color={color} sub={sub} eager={eager} />
        </div>
      </div>
    </div>
  );
}
