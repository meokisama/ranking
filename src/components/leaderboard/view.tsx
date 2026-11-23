import Board from "./board";
import Footer from "@/components/ui/footer";
import { periodHref, periods } from "@/lib/data";
import type { Period } from "@/lib/data";

export default function LeaderboardView({ period }: { period: Period }) {
  return (
    <>
      <Board
        key={period.slug}
        period={period}
        periods={periods.map((p) => ({ slug: p.slug, label: p.label, href: periodHref(p.slug) }))}
      />
      <Footer />
    </>
  );
}
