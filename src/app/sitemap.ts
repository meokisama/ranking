import type { MetadataRoute } from "next";
import { CURRENT_PERIOD, SITE } from "@/lib/config";
import { periods } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "yearly", priority: 1 },
    { url: `${SITE.url}/leaderboard`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...periods
      .filter((p) => p.slug !== CURRENT_PERIOD)
      .map((p) => ({ url: `${SITE.url}/leaderboard/${p.slug}`, lastModified: now, priority: 0.7 })),
    { url: `${SITE.url}/feedback`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/vote`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
}
