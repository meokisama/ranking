/**
 * The mark: three books on a shelf, standing as a podium. The tallest, in the middle, is the first place,
 * vermilion with a ribbon marking it; the last leans against the end, as books on a real shelf do.
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
      ? { tile: "none", stroke: "#e2c07a", book: "#e2c07a", band: "#b02c17", first: "#16120e", ribbon: "#e2c07a", shelf: "#e2c07a" }
      : { tile: "#16120e", stroke: "none", book: "#f1ebde", band: "#16120e", first: "#d6361b", ribbon: "#f1ebde", shelf: "#f1ebde" };
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="14" fill={t.tile} stroke={t.stroke} strokeWidth="1.5" />
      <rect x="11" y="25" width="12" height="27" rx="1" fill={t.book} />
      <rect x="11" y="29" width="12" height="2" fill={t.band} />
      <rect x="25" y="13" width="13" height="39" rx="1" fill={t.first} />
      <path d="M28.5 13h6v12l-3-2.6-3 2.6z" fill={t.ribbon} />
      <g transform="rotate(14 40 52)">
        <rect x="40" y="31" width="11" height="21" rx="1" fill={t.book} />
        <rect x="40" y="35" width="11" height="2" fill={t.band} />
      </g>
      <rect x="8" y="52" width="48" height="2.5" rx="1" fill={t.shelf} />
    </svg>
  );
}
