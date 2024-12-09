"use client";
import Footer from "@/components/common/footer";
import SocialHub from "@/components/common/social-hub";
import ShortSplashScreen from "@/components/common/short-splash-screen";
import Banner from "@/components/leaderboard/banner";
import LeaderBoardTable from "@/components/leaderboard/leaderboard-table";
import { ROUTES } from "@/constants";
import ScrollToTop from "@/utils/ScrollToTop";

function LeaderBoard() {
  return (
    <div>
      <ShortSplashScreen />
      <div>
        <Banner />
        <LeaderBoardTable />
        <Footer text="Trang Chủ" to={ROUTES.HOME} />
        <SocialHub />
        <ScrollToTop />
      </div>
    </div>
  );
}

export default LeaderBoard;
