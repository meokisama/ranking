const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const FALLBACKS = ["#8a3b2a", "#2f4a5c", "#5d5230", "#4a3552", "#2f4a3a", "#6a4326"];

/** A book cover: the real image, or a typeset one when there is none. */
export default function Cover({
  name,
  cover,
  color,
  sub,
  eager,
  className = "",
}: {
  name: string;
  cover?: string | null;
  color?: string | null;
  sub?: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <div className={`cover ${className}`}>
      {cover ? (
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
      ) : (
        <div
          className="@container flex size-full flex-col justify-between p-[10%] text-paper"
          style={{ background: color ?? FALLBACKS[hash(name) % FALLBACKS.length] }}
          role="img"
          aria-label={`Bìa ${name}`}
        >
          <span className="label text-[4.6cqw] opacity-80">Light Novel</span>
          <span className="display line-clamp-5 text-[13cqw] leading-[1.02]">{name}</span>
          <span className="label border-t border-current/30 pt-[5%] text-[4.4cqw] opacity-80">{sub ?? "BXH LNVN"}</span>
        </div>
      )}
    </div>
  );
}

/** Readable ink for a given background colour. */
export const inkOn = (hex?: string | null) => {
  if (!hex) return "#16120e";
  const n = parseInt(hex.replace("#", ""), 16);
  const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.6 ? "#16120e" : "#f8f4ea";
};
