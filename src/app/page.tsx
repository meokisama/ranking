import Hero from "@/components/home/Hero";
import Preloader from "@/components/home/Preloader";
import Top10 from "@/components/home/Top10";
import Categories from "@/components/home/Categories";
import type { CategoryRow } from "@/components/home/Categories";
import { Manifesto, ObiBand, Partners, Timeline, Voices } from "@/components/home/Sections";
import Footer from "@/components/ui/Footer";
import { SITE } from "@/lib/config";
import type { CategoryKey } from "@/lib/config";
import { currentPeriod, nf } from "@/lib/data";

export default function Home() {
  const p = currentPeriod;
  const ranobe = p.categories.ranobe!;
  const top10 = ranobe.slice(0, 10);

  // Sách bay ở hero: 34 tác phẩm đứng đầu có ảnh bìa.
  const heroBooks = ranobe
    .filter((b) => b.cover)
    .slice(0, 34)
    .map((b) => ({ cover: b.cover!, color: b.color ?? "#24211d", name: b.name, publisher: b.publisher ?? "" }));

  const rows: CategoryRow[] = (Object.keys(p.categories) as CategoryKey[]).map((key) => ({
    key,
    winner: p.categories[key]![0],
    total: p.categories[key]!.length,
  }));

  const publishers = p.categories.publisher?.length ?? 0;

  return (
    <main>
      <Preloader period={p.label} />
      <Hero books={heroBooks} period={p.label} votes={nf.format(p.votes)} titles={ranobe.length} />
      <ObiBand
        items={[
          p.label,
          `${nf.format(p.votes)} lượt bình chọn`,
          `${ranobe.length} tác phẩm`,
          `${publishers} nhà phát hành`,
          "Độc giả Việt Nam chọn",
        ]}
      />
      <Manifesto
        stats={[
          { value: p.votes, label: "Lượt bình chọn hợp lệ" },
          { value: ranobe.length, label: "Tác phẩm được gọi tên" },
          { value: publishers, label: "Nhà phát hành" },
          { value: SITE.since, label: "Năm khởi đầu", plain: true },
        ]}
      />
      <Top10 items={top10} votes={p.votes} total={ranobe.length} period={p.label} />
      <Categories rows={rows} />
      <Timeline period={p.label} />
      <Voices />
      <Partners />
      <Footer />
    </main>
  );
}
