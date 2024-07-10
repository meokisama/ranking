import { ArchiveHero, Chart, Feature, Hall } from "@/components/archive";
import { Footer, SocialHub } from "@/components/common";
import { ROUTES } from "@/constants";
import ScrollToTop from "@/utils/ScrollToTop";

export const metadata = {
  title: "Thư Viện",
};

function Archive() {
  return (
    <div>
      <ArchiveHero />
      <Feature />
      <Chart />
      <Hall />
      <SocialHub />
      <ScrollToTop />
      <Footer text="Trang Chủ" to={ROUTES.HOME} />
    </div>
  );
}

export default Archive;
