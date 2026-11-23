import periodsJson from "@/data/periods.json";
import type { CategoryKey } from "./config";
import { CURRENT_PERIOD } from "./config";

export type Entry = {
  rank: number;
  id: number;
  name: string;
  count: number;
  publisher?: string;
  cover?: string | null;
  color?: string | null;
  logo?: string;
  works?: string[];
};

export type Period = {
  slug: string;
  label: string;
  long: string;
  votes: number;
  gender: { male: number; female: number } | null;
  ages: { age: number; count: number }[] | null;
  categories: Partial<Record<CategoryKey, Entry[]>>;
};

export const periods = periodsJson as unknown as Period[];

export const getPeriod = (slug: string) => periods.find((p) => p.slug === slug);
export const currentPeriod = getPeriod(CURRENT_PERIOD)!;
/** Every period but the current one, which lives at /leaderboard itself. */
export const pastPeriods = periods.filter((p) => p.slug !== CURRENT_PERIOD);

export const periodHref = (slug: string) => (slug === CURRENT_PERIOD ? "/leaderboard" : `/leaderboard/${slug}`);
/** "Kỳ II · 2024" → ["Kỳ II", "2024"], for setting the year apart. */
export const labelParts = (label: string) => label.split(" · ") as [string, string];
/** The year a period belongs to, from its slug ("2-2024" → "2024"). */
export const periodYear = (p: Period) => p.slug.split("-")[1];
