/**
 * The mark: an open book with a ribbon marking its place, the place being the point of a ranking.
 * The same drawing as src/app/icon.svg. `tone` sets the colours for each surface it sits on.
 */
export default function Logo({
  className = "",
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "gold";
}) {
  const t =
    tone === "gold"
      ? { tile: "none", page: "#e2c07a", seam: "#b02c17", ribbon: "#e2c07a", stroke: "#e2c07a" }
      : { tile: "#d6361b", page: "#f6f1e5", seam: "#b02c17", ribbon: "#16120e", stroke: "none" };
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="15" fill={t.tile} stroke={t.stroke} strokeWidth="1.5" />
      <path d="M9 19.5c8-3 16-2.6 23 1.8v27.4c-7-4-15-4.4-23-1.6z" fill={t.page} />
      <path d="M55 19.5c-8-3-16-2.6-23 1.8v27.4c7-4 15-4.4 23-1.6z" fill={t.page} />
      <path d="M32 21.3v27.4" stroke={t.seam} strokeWidth="1.4" />
      <path d="M39 18.6h6.4v29.6l-3.2-3.3-3.2 3.3z" fill={t.ribbon} stroke={tone === "gold" ? "#b02c17" : "none"} strokeWidth="1.2" />
    </svg>
  );
}
