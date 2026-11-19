import type { CSSProperties, ReactNode } from "react";

/** Dải chữ chạy vô tận. Nội dung được nhân đôi, bản sao ẩn với trình đọc màn hình. */
export default function Marquee({
  children,
  duration = 40,
  reverse,
  pauseOnHover = true,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  /** Dừng khi rê chuột (mặc định bật). */
  pauseOnHover?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`flex w-max animate-marquee ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
