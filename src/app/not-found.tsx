import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Kicker, Lines } from "@/components/ui/reveal";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col justify-end overflow-hidden px-5 pb-12 pt-28 md:px-10 md:pb-16">
      <span className="num pointer-events-none absolute -right-[2vw] top-[8svh] text-[46vw] leading-none text-ink/[0.06]" aria-hidden>
        404
      </span>
      <div className="relative">
        <Kicker no="●">Trang bị thiếu</Kicker>
        <Lines
          as="h1"
          className="display mt-6 text-[14vw] md:text-[9.5vw]"
          label="Trang này không có trong cuốn sách"
        >
          {"Trang này không có"}
          <span>
            <i className="text-shu">trong cuốn sách</i>
            <span className="text-shu">.</span>
          </span>
        </Lines>
        <p className="mt-8 max-w-[40ch] text-[0.95rem] font-light text-ink/75">Có thể đường dẫn đã cũ, hoặc trang đã được xếp lại ở một kỳ khác.</p>
        <div className="mt-9">
          <Link href="/" className="btn">
            Về trang bìa
            <span className="disc">
              <ArrowRight aria-hidden />
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
