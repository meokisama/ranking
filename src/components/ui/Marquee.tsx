import type { CSSProperties, ReactNode } from "react";

/** Dải chữ chạy vô tận. Nội dung được nhân đôi, bản sao ẩn với trình đọc màn hình. */
export default function Marquee({
  children,
  duration = 40,
  reverse,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex w-max animate-marquee hover:[animation-play-state:paused]"
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
