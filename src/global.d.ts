declare global {
  interface Window {
    /** Set by the hero's book once its cover is on screen; the splash waits for it (see components/ui/splash.tsx). */
    __bookReady?: boolean;
  }
}

export {};
