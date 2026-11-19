import type { CategoryKey } from "@/lib/config";

export type VoteItem = {
  id: number;
  name: string;
  publisher?: string;
  cover?: string | null;
  color?: string | null;
  logo?: string;
};
export type VoteStep = { key: CategoryKey; items: VoteItem[] };
export type Picks = Partial<Record<CategoryKey, number[]>>;
export type Extra = { topic: string; content: string; title: string; publisher: string; gender: string; age: string };
