export default function sitemap() {
  return [
    {
      url: "https://bxh.lightnovel.vn",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://bxh.lightnovel.vn/leaderboard",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://bxh.lightnovel.vn/feedback",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
