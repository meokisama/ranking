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
import { Footer, SocialHub, SplashScreen } from "@/components/common";
import ScrollToTop from "@/utils/ScrollToTop";

function Home() {
  return (
    <main style={{ backgroundColor: "#fff7f8" }}>
      <SplashScreen />
      <div>
        <Header />
        <div className="contentContainer">
          <ResultModal />
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
    </main>
  );
}

export default Home;
