"use client";
import { Children, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/**
 * A heading whose lines rise out of a mask, each tipping level as it lands.
 * Each child is one line, and a line may hold markup (an italic word, a red full stop).
 */
export function Lines({
  children,
  className = "",
  as: Tag = "h2",
  delay = 0,
  label,
}: {
  /** One child per line. */
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  label?: string;
}) {
  const [ref, seen] = useSeen<HTMLHeadingElement>();
  return (
    <Tag ref={ref as never} className={className} data-lines={seen ? "in" : "wait"} aria-label={label}>
      {Children.toArray(children).map((l, i) => (
        <span key={i} className="line-mask" aria-hidden={label ? true : undefined}>
          <span style={{ animationDelay: `${delay + i * 0.1}s` }}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Content that rises into place the first time it is seen. */
export default function Rise({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: `translateY(${y}px)` }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** A hairline that draws itself from the left. */
export function Rule({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`h-px origin-left bg-ink/20 ${className}`}
      initial={{ transform: "scaleX(0)" }}
      whileInView={{ transform: "scaleX(1)" }}
      viewport={{ once: true }}
      transition={{ duration: 1.6, delay, ease: EASE }}
      aria-hidden
    />
  );
}

/** The small numbered kicker above every section. */
export function Kicker({ no, children, right }: { no: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="label flex items-baseline justify-between gap-6 text-mute">
      <span>
        <span className="mr-3 text-shu">{no}</span>
        {children}
      </span>
      {right && <span className="text-right">{right}</span>}
    </div>
  );
}
