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
import { Footer, ScrollToTop, SplashScreen } from "@/components/common";

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
        </div>
      </div>
    </main>
  );
}

export default Home;
