export const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const FALLBACKS = ["#8a3b2a", "#2f4a5c", "#5d5230", "#4a3552", "#2f4a3a", "#6a4326"];
/** The cloth of a book with no colour of its own. */
export const FALLBACK = FALLBACKS[0];

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

/** A publisher's logo on a white board: square, or `tall` to stand in a row of covers. */
export function LogoBoard({ src, tall, eager, className = "" }: { src: string; tall?: boolean; eager?: boolean; className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-[2px] bg-white shadow-[0_0_0_1px_rgb(22_18_14/0.12)] ${
        tall ? "aspect-[400/568] p-[16%]" : "aspect-square p-[14%]"
      } ${className}`}
    >
      <img src={src} alt="" loading={eager ? "eager" : "lazy"} draggable={false} className="max-h-full max-w-full object-contain" />
    </span>
  );
}

type Marked = { name: string; cover?: string | null; color?: string | null; logo?: string };

/** What stands for an entry: its cover, or for a publisher its logo board. */
export function Mark({
  e,
  sub,
  tall,
  eager,
  className = "",
}: {
  e: Marked;
  sub?: string;
  tall?: boolean;
  eager?: boolean;
  className?: string;
}) {
  return e.logo ? (
    <LogoBoard src={e.logo} tall={tall} eager={eager} className={className} />
  ) : (
    <Cover name={e.name} cover={e.cover} color={e.color} sub={sub} eager={eager} className={className} />
  );
}

/** Readable ink for a given background colour. */
export const inkOn = (hex?: string | null) => {
  if (!hex) return "#16120e";
  const n = parseInt(hex.replace("#", ""), 16);
  const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.6 ? "#16120e" : "#f8f4ea";
};
