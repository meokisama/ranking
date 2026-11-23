"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

const MIN = 3000; // long enough for the mark and the title to finish
const MAX = 4600; // never hold the reader longer than this, ready or not
const OUT = 1300; // the sheet sliding up

/** The title, one face throughout; the words marked are set in vermilion. */
const WORDS: [string, boolean?][] = [["Bảng"], ["xếp"], ["hạng"], ["Light", true], ["Novel", true], ["Việt"], ["Nam"]];
/** A box on the logo's 64-unit grid, as percentages of the mark. */
const box = (x: number, y: number, w: number, h: number) => ({
  left: `${(x / 64) * 100}%`,
  top: `${(y / 64) * 100}%`,
  width: `${(w / 64) * 100}%`,
  height: `${(h / 64) * 100}%`,
});

const TITLE_AT = 0.75; // s, when the first word moves
// Words move whole: splitting them into letters loses the kerning between them, and the title falls apart.
const STAGGER = 0.09; // s between words

/**
 * The flyleaf: a plain sheet of the book's paper before the first page. The mark builds itself on it (the shelf,
 * then the three books, the first place in vermilion with its ribbon, the last leaning on the end), the title is
 * raised word by word, and the sheet slides up once the page beneath is ready. On the front page that means the
 * book in the hero has its cover printed.
 */
export default function Splash() {
  const el = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const path = usePathname();
  const first = useRef(path);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  // Hold the page still while the sheet is down.
  useEffect(() => {
    if (document.documentElement.dataset.splash === "on") lenis?.stop();
  }, [lenis]);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.splash !== "on") return setGone(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    let done = false;

    const leave = () => {
      el.current?.setAttribute("data-state", "out");
      root.dataset.splash = "lifting"; // lets the page's own entrance play as the sheet lifts
      try {
        sessionStorage.setItem("splash", "1");
      } catch {}
      lenisRef.current?.start();
      timers.push(
        window.setTimeout(
          () => {
            root.dataset.splash = "off";
            // Heavy work held back for the sheet starts only now: started during the slide, it made the slide stutter.
            window.dispatchEvent(new Event("splash:gone"));
            setGone(true);
          },
          reduced ? 400 : OUT,
        ),
      );
    };
    const ready = () => {
      if (done) return;
      done = true;
      // performance.now() counts from the navigation, so time spent before hydration counts toward the minimum.
      timers.push(window.setTimeout(leave, Math.max(0, (reduced ? 300 : MIN) - performance.now())));
    };

    if (first.current === "/") {
      if (window.__bookReady) ready();
      else window.addEventListener("book:ready", ready, { once: true });
    } else if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    timers.push(window.setTimeout(ready, Math.max(0, MAX - performance.now())));

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("book:ready", ready);
      window.removeEventListener("load", ready);
    };
  }, []);

  if (gone) return null;

  const at = (i: number) => ({ animationDelay: `${(TITLE_AT + i * STAGGER).toFixed(3)}s` });

  return (
    <div ref={el} className="splash" data-state="in" aria-hidden>
      <div className="splash-inner">
        {/* The mark, drawn in boxes rather than SVG: transforms on HTML run on the compositor, so the mark stays
            smooth while the page underneath is busy getting ready. Positions are the logo's 64-unit grid. */}
        <div className="splash-mark">
          <span className="splash-shelf" style={box(8, 52, 48, 2.5)} />
          <span className="splash-rise bg-ink" style={{ ...box(11, 25, 12, 27), animationDelay: "0.25s" }}>
            <span className="splash-band" style={{ top: `${(4 / 27) * 100}%`, height: `${(2 / 27) * 100}%` }} />
          </span>
          <span className="splash-rise bg-shu" style={{ ...box(25, 13, 13, 39), animationDelay: "0.36s" }} />
          <span className="splash-ribbon" style={box(28.5, 13, 6, 12)} />
          <span className="splash-lean">
            <span className="splash-rise bg-ink" style={{ ...box(40, 31, 11, 21), animationDelay: "0.47s" }}>
              <span className="splash-band" style={{ top: `${(4 / 21) * 100}%`, height: `${(2 / 21) * 100}%` }} />
            </span>
          </span>
        </div>
        <p className="splash-title display">
          {WORDS.map(([word, red], w) => (
            <span key={w} className={`splash-word ${red ? "text-shu" : ""}`}>
              <span style={at(w)}>{word}</span>
              {w === WORDS.length - 1 && (
                <span className="splash-stop text-shu" style={at(w + 4.5)}>
                  .
                </span>
              )}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
