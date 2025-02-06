import Header from "@/components/home/header";
import LargeText from "@/components/home/large-text";
import Introduction from "@/components/home/introduction";
import CategoryVote from "@/components/home/category-vote";
import LastTop10 from "@/components/home/last-top10";
import Comment from "@/components/home/comment";
import Media from "@/components/home/media";
import Overview from "@/components/home/overview";
import ResultModal from "@/components/home/result-modal";
import Footer from "@/components/common/footer";
import SocialHub from "@/components/common/social-hub";
import SplashScreen from "@/components/common/splash-screen";
import ScrollToTop from "@/utils/scroll-to-top";

function Home() {
  return (
    <div className="bg-[hsl(var(--main-background))]">
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
    </div>
  );
}

export default Home;
