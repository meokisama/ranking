import Cover from "./cover";

/** A book in CSS 3D: the cover, a spine in the book's own colour, and the block of pages. Straightens on hover. */
export default function Book3D({
  name,
  cover,
  color,
  sub,
  thickness = 26,
  className = "",
}: {
  name: string;
  cover?: string | null;
  color?: string | null;
  sub?: string;
  thickness?: number;
  className?: string;
}) {
  return (
    <div className={`book3d ${className}`}>
      <div className="book3d-body" style={{ ["--t" as string]: `${thickness}px`, ["--c" as string]: color ?? "#8a3b2a" }}>
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
