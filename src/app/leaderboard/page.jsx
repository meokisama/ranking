"use client";
import { Footer, SocialHub } from "@/components/common";
import ShortSplashScreen from "@/components/common/short-splash-screen";
import { Banner, LeaderBoardTable } from "@/components/leaderboard";
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
