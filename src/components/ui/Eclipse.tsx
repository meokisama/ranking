import type { CSSProperties } from "react";

/**
 * Vầng nhật thực đỏ son, mô-típ của hero, dựng lại bằng CSS thuần để đặt sau các điểm nhấn khác của trang.
 * Khung vuông: đĩa tối chiếm nửa bề ngang, phần còn lại là quầng sáng và hạt tram.
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
