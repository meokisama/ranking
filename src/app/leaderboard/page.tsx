import type { Metadata } from "next";
import LeaderboardView from "@/components/leaderboard/view";
import { currentPeriod } from "@/lib/data";

export const metadata: Metadata = {
  title: `Bảng tổng sắp ${currentPeriod.label}`,
  description: `Kết quả đầy đủ Bảng Xếp Hạng Light Novel Việt Nam ${currentPeriod.long}.`,
};

export default function Page() {
  return <LeaderboardView period={currentPeriod} />;
}
