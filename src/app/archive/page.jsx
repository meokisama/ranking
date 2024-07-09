import { ArchiveHero, Chart } from "@/components/archive";
import { Footer, SocialHub } from "@/components/common";
import { ROUTES } from "@/constants";

export const metadata = {
  title: "Thư Viện",
};

function Archive() {
  return (
    <div>
      <ArchiveHero />
      <Chart />
      <SocialHub />
      <Footer text="Trang Chủ" to={ROUTES.HOME} />
    </div>
  );
}

export default Archive;
