import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { pastPeriods, periodHref } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "yearly", priority: 1 },
    { url: `${SITE.url}/leaderboard`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...pastPeriods.map((p) => ({ url: `${SITE.url}${periodHref(p.slug)}`, lastModified: now, priority: 0.7 })),
    { url: `${SITE.url}/feedback`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/vote`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
}
