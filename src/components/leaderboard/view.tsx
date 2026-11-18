import Board from "./Board";
import Footer from "@/components/ui/Footer";
import { CURRENT_PERIOD } from "@/lib/config";
import { periods } from "@/lib/data";
import type { Period } from "@/lib/data";

export const periodHref = (slug: string) => (slug === CURRENT_PERIOD ? "/leaderboard" : `/leaderboard/${slug}`);

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
