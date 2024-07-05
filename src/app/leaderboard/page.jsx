"use client";
import { SplashScreen, Footer, ScrollToTop } from "@/components/common";
import { Banner, LeaderBoardTable } from "@/components/leaderboard";
import { ROUTES } from "@/constants";

function LeaderBoard() {
  return (
    <div>
      <SplashScreen />
      <div>
        <Banner />
        <LeaderBoardTable />
        <Footer text="Trang Chủ" to={ROUTES.HOME} />
        <ScrollToTop />
      </div>
    </div>
  );
}

export default LeaderBoard;
