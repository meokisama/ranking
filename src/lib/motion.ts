export const EASE = [0.16, 1, 0.3, 1] as const;

/** Rises into place as soon as it mounts: for what is on screen from the start. */
export const fadeUp = (delay = 0, y = 16, duration = 1.2) => ({
  initial: { opacity: 0, transform: `translateY(${y}px)` },
  animate: { opacity: 1, transform: "translateY(0px)" },
  transition: { duration, delay, ease: EASE },
});
