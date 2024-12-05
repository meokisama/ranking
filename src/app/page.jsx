import {
  Header,
  LargeText,
  Introduction,
  CategoryVote,
  LastTop10,
  Comment,
  Media,
  Overview,
  ResultModal,
} from "@/components/home";
import { Footer, SocialHub } from "@/components/common";
import ScrollToTop from "@/utils/ScrollToTop";
import SplashScreen from "@/components/common/splash-screen";

function Home() {
  return (
    <div className="bg-[hsl(var(--main-background))]">
      <SplashScreen />
      <div>
        <Header />
        <div className="contentContainer">
          {/* <ResultModal /> */}
          <LargeText />
          <Introduction />
          <Overview />
          <CategoryVote />
          <LastTop10 />
          <Media />
          <Comment />
          <Footer />
          <ScrollToTop />
          <SocialHub />
        </div>
      </div>
    </div>
  );
}

export default Home;
