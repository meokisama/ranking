"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

/**
 * Đưa trang về đầu mỗi khi chuyển route.
 * Lenis giữ vị trí cuộn riêng của nó: nếu Next đưa trang về đầu trong lúc Lenis còn đang trượt,
 * khung hình kế tiếp Lenis sẽ kéo trang ngược về chỗ cũ. Vì vậy phải bảo chính Lenis nhảy về 0.
 * Riêng nút lùi/tiến của trình duyệt thì để nguyên cho trình duyệt khôi phục vị trí cũ.
 */
function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  const prev = useRef(pathname);
  const viaHistory = useRef(false);

  useEffect(() => {
    const onPop = () => {
      viaHistory.current = true;
    };
    const onClick = () => {
      viaHistory.current = false;
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    if (viaHistory.current) {
      viaHistory.current = false;
      return;
    }
    if (window.location.hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.09, wheelMultiplier: 0.9, anchors: true }}>
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}
