import Marquee from "@/components/ui/marquee";

const Star = () => (
  <svg viewBox="0 0 24 24" className="mx-8 size-5 shrink-0 animate-spin-slow md:mx-12 md:size-7" aria-hidden>
    <path fill="currentColor" d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
  </svg>
);

/** Red obi band with scrolling text right below the hero. */
export default function ObiBand({ items }: { items: string[] }) {
  return (
    <div className="relative z-10 -my-px border-y border-ink/20 bg-shu py-4 text-ink md:py-5">
      <Marquee duration={36}>
        {items.map((t) => (
          <span key={t} className="display flex items-center text-2xl md:text-4xl">
            {t}
            <Star />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
