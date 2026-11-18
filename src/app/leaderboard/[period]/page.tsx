import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import LeaderboardView from "@/components/leaderboard/view";
import { CURRENT_PERIOD } from "@/lib/config";
import { getPeriod, periods } from "@/lib/data";

type Props = { params: Promise<{ period: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  periods.filter((p) => p.slug !== CURRENT_PERIOD).map((p) => ({ period: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPeriod((await params).period);
  return p ? { title: `Bảng tổng sắp ${p.label}`, description: `Kết quả đầy đủ ${p.long}.` } : {};
}

export default async function Page({ params }: Props) {
  const { period } = await params;
  if (period === CURRENT_PERIOD) redirect("/leaderboard");
  const p = getPeriod(period);
  if (!p) notFound();
  return <LeaderboardView period={p} />;
}
