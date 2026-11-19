import Book from "@/components/ui/book";
import Eclipse from "@/components/ui/eclipse";
import type { Entry } from "@/lib/data";
import { nf, pad, percent } from "@/lib/format";
import { subOf } from "./utils";

export default function PodiumItem({ e, votes, first, order }: { e: Entry; votes: number; first: boolean; order: string }) {
  return (
    <li className={`relative ${order}`}>
      {first && <Eclipse className="left-[64%] top-[-22%] w-[170%] -translate-x-1/2" />}
      <span
        className={`display pointer-events-none absolute -top-[0.3em] left-0 select-none leading-none ${
          first ? "text-[38vw] text-shu md:text-[17vw]" : "outline-text text-[30vw] text-paper/35 md:text-[12vw]"
        }`}
        aria-hidden
      >
        {e.rank}
      </span>

      {e.logo ? (
        <div className={`relative ml-auto grid aspect-square place-items-center bg-white p-[12%] ${first ? "w-[72%]" : "w-[62%]"}`}>
          <img src={e.logo} alt={`Logo ${e.name}`} className="max-h-full max-w-full object-contain" />
          {first && <span className="label absolute inset-x-0 bottom-0 bg-shu py-2 text-center text-paper">Quán quân · 第1位</span>}
        </div>
      ) : (
        <Book
          name={e.name}
          cover={e.cover}
          color={e.color}
          sub={subOf(e)}
          eager
          depth={first ? 34 : 26}
          className={`relative ml-auto ${first ? "w-[72%]" : "w-[62%]"}`}
        />
      )}

      <div className="relative mt-9">
        <span className="label text-paper/50">{subOf(e) || `Hạng ${pad(e.rank)}`}</span>
        <h3 className={`display mt-2 leading-[1.1] ${first ? "text-3xl md:text-[2.5vw]" : "text-2xl md:text-[1.7vw]"}`}>{e.name}</h3>
        <div className="mt-5 flex items-end justify-between border-t border-paper/20 pt-4">
          <span className={`display tabular-nums ${first ? "text-6xl text-shu md:text-[5vw]" : "text-4xl md:text-[3vw]"}`}>
            {nf.format(e.count)}
          </span>
          <span className="label text-right text-paper/50">
            phiếu
            <br />
            {percent(e.count, votes)} người bình chọn
          </span>
        </div>
      </div>
    </li>
  );
}
