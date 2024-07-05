import {
  LargeText,
  Introduction,
  CategoryVote,
  LastTop10,
  Comment,
  Media,
  Overview,
  ResultModal,
} from "@/components/home";
import DateChecker from "@/components/home/DateChecker";
import { Footer, ScrollToTop, SplashScreen } from "@/components/common";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/home/Header"), {
  ssr: false,
});

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
        <DateChecker
          ids={["votebtn", "overview-vote", "timeline-vote", "footer-vote"]}
        />
      </div>
    </main>
  );
}

export default Home;
