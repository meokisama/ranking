import type { CSSProperties } from "react";

/**
 * Vermilion eclipse, the hero's motif, rebuilt in plain CSS to sit behind other highlights.
 * Square frame: the dark disc spans half the width, the rest is corona and halftone.
 */
export default function Eclipse({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`eclipse ${className}`} style={style} aria-hidden>
      <span className="eclipse-tone" />
      <span className="eclipse-halo" />
      <span className="eclipse-disc" />
    </div>
  );
}
