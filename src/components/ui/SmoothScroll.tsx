"use client";
import { ReactLenis } from "lenis/react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.09, wheelMultiplier: 0.9, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
