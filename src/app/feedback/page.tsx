import type { Metadata } from "next";
import Wall from "@/components/feedback/Wall";
import type { Note } from "@/components/feedback/Wall";
import Footer from "@/components/ui/Footer";
import feedback from "@/data/feedback.json";
import { periods } from "@/lib/data";

export const metadata: Metadata = {
  title: "Góp ý của độc giả",
  description: "Những lời nhắn độc giả gửi tới ban tổ chức Bảng Xếp Hạng Light Novel Việt Nam.",
};

export default function Page() {
  return (
    <>
      <Wall notes={feedback as Note[]} periods={periods.map((p) => ({ slug: p.slug, label: p.label }))} />
      <Footer />
    </>
  );
}
