import Categories from "@/components/home/categories";
import type { CategoryRow } from "@/components/home/categories";
import CoverWall from "@/components/home/cover-wall";
import Hero from "@/components/home/hero";
import Partners from "@/components/home/partners";
import Preface from "@/components/home/preface";
import Ribbon from "@/components/home/ribbon";
import Timeline from "@/components/home/timeline";
import Voices from "@/components/home/voices";
import Footer from "@/components/ui/footer";
import { SITE } from "@/lib/config";
import type { CategoryKey } from "@/lib/config";
import { currentPeriod } from "@/lib/data";

export default function Home() {
  const p = currentPeriod;
  const ranobe = p.categories.ranobe!;
  const publishers = p.categories.publisher?.length ?? 0;

  const rows: CategoryRow[] = (Object.keys(p.categories) as CategoryKey[]).map((key) => ({
    key,
    top: p.categories[key]!.slice(0, 3),
    total: p.categories[key]!.length,
  }));

  return (
    <main>
      <Hero
        items={ranobe.slice(0, 5)}
        votes={p.votes}
        total={ranobe.length}
        period={p.label}
        publishers={publishers}
        shelf={ranobe.filter((e) => e.cover).slice(0, 56).map((e) => e.cover!)}
      />
      <Preface
        covers={ranobe.filter((e) => e.cover).slice(10, 22)}
        stats={[
          { value: p.votes, label: "Lượt bình chọn hợp lệ" },
          { value: ranobe.length, label: "Tác phẩm được gọi tên" },
          { value: publishers, label: "Nhà phát hành" },
          { value: SITE.since, label: "Năm khởi đầu", plain: true },
        ]}
      />
      <CoverWall items={ranobe.slice(0, 10)} total={ranobe.length} votes={p.votes} />
      <Categories rows={rows} />
      <Ribbon items={ranobe.slice(0, 6)} />
      <Timeline period={p.label} />
      <Voices />
      <Partners />
      <Footer />
    </main>
  );
}
