import type { CSSProperties, ReactNode } from "react";

const FALLBACKS = ["#b8432b", "#1f4b5c", "#6b5a2e", "#4a2f4f", "#2f4a36", "#7a3b1f"];
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Bìa: ảnh thật, hoặc bìa chữ tự dàn khi không có ảnh. */
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

/** Cuốn sách 3D dựng bằng CSS: bìa, gáy, ruột giấy. Tự nghiêng khi rê chuột. */
export default function Book({
  name,
  cover,
  color,
  sub,
  obi,
  depth = 26,
  eager,
  className = "",
  style,
}: {
  name: string;
  cover?: string | null;
  color?: string | null;
  sub?: string;
  obi?: ReactNode;
  depth?: number;
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`book-stage ${className}`} style={style}>
      <div
        className="book"
        style={{ "--d": `${depth}px`, "--book-color": color ?? "#24211d" } as CSSProperties}
      >
        <div className="back" />
        <div className="spine" />
        <div className="pages" />
        <div className="face">
          <Cover name={name} cover={cover} color={color} sub={sub} eager={eager} />
          {obi}
        </div>
      </div>
    </div>
  );
}

/** Obi — dải giấy đỏ quấn quanh sách đoạt giải. */
export function Obi({ rank, line }: { rank: number; line: string }) {
  return (
    <div className="obi @container">
      <span className="font-jp text-[5.2cqw] leading-none opacity-90">第{rank}位</span>
      <span className="display mt-[2%] text-[8.4cqw] leading-none">{line}</span>
    </div>
  );
}
