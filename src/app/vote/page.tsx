import type { Metadata } from "next";
import VoteFlow from "@/components/vote/vote-flow";
import type { VoteStep } from "@/components/vote/types";
import vote from "@/data/vote.json";
import { currentPeriod } from "@/lib/data";

export const metadata: Metadata = {
  title: "Bình chọn",
  description: "Bỏ phiếu cho Light Novel, Oneshot, Tân binh và Nhà phát hành bạn yêu thích nhất.",
};

// Step order of the current period's ballot.
const steps: VoteStep[] = [
  { key: "ranobe", items: vote.books },
  { key: "oneshot", items: vote.books.filter((b) => b.oneshot) },
  { key: "publisher", items: vote.publishers },
  { key: "rookie", items: vote.books.filter((b) => b.rookie) },
];

export default function Page() {
  return <VoteFlow steps={steps} periodLabel={currentPeriod.label} />;
}
