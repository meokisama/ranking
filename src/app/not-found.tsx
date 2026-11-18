import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-ink px-5 text-paper">
      <div className="pointer-events-none absolute inset-0 text-shu/25 tone-lg" aria-hidden />
      <span className="display pointer-events-none absolute select-none text-[58vw] leading-none text-shu" aria-hidden>
        404
      </span>
      <div className="relative bg-paper p-8 text-ink md:p-12">
        <span className="label text-shu">落丁 · Trang bị thiếu</span>
        <h1 className="display mt-4 max-w-[14ch] text-4xl md:text-6xl">Trang này không có trong cuốn sách</h1>
        <p className="mt-5 max-w-[36ch] font-serif text-lg italic text-ink/70">
          Có thể đường dẫn đã cũ, hoặc trang đã được xếp lại ở một kỳ khác.
        </p>
        <Link href="/" className="label link-underline mt-8 inline-block pb-1">
          ← Về trang bìa
        </Link>
      </div>
    </main>
  );
}
