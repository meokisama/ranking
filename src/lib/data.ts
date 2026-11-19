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
