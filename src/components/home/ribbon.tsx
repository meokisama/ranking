import type { Entry } from "@/lib/data";

/** A slow band of the leading titles, set solid and in outline by turns, each led by its own small cover. */
export default function Ribbon({ items }: { items: Entry[] }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((e, i) => (
        <span key={e.id} className="flex items-center gap-6 pr-10 md:gap-8 md:pr-14">
          {e.cover ? (
            <img
              src={e.cover}
              alt=""
              loading="lazy"
              className={`h-[11vw] w-auto rounded-[2px] shadow-[0_10px_20px_-12px_rgb(22_18_14/0.6)] md:h-[6vw] ${i % 2 ? "rotate-[4deg]" : "-rotate-[4deg]"}`}
            />
          ) : (
            <span className="size-3 rounded-full bg-shu" />
          )}
          <span className={`display display-i whitespace-nowrap text-[13vw] leading-[1.25] md:text-[7vw] ${i % 2 ? "outline-text" : ""}`}>{e.name}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="hair overflow-hidden border-y py-4" style={{ ["--marquee" as string]: `${items.length * 11}s` }}>
      <div className="marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
