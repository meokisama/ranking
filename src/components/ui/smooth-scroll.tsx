"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

/**
 * Returns to the top on every route change.
 * Lenis keeps its own scroll position: if Next resets the page while Lenis is still gliding,
 * the next frame Lenis drags it back. So Lenis itself has to be told to jump to 0.
 * Browser back/forward is left alone so the previous position is restored.
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
