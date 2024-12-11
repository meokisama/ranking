"use client";
import Footer from "@/components/common/footer";
import SocialHub from "@/components/common/social-hub";
import ShortSplashScreen from "@/components/common/short-splash-screen";
import Banner from "@/components/leaderboard/banner";
// import LeaderBoardTable from "@/components/leaderboard/leaderboard-table";
import LeaderBoardTable from "@/components/leaderboard/leaderboard-api";
import { ROUTES } from "@/constants";
import ScrollToTop from "@/utils/ScrollToTop";
import ProtectedRoute from "@/components/common/protected-route";

function LeaderBoard({ responseData: data }) {
  return (
    <div>
      <ShortSplashScreen />
      <div>
        <Banner />
        <LeaderBoardTable responseData={data} />
        <Footer text="Trang Chủ" to={ROUTES.HOME} />
        <SocialHub />
        <ScrollToTop />
      </div>
    </div>
  );
}

function ProtectedBoard() {
  return <ProtectedRoute component={LeaderBoard} />;
}

// export default LeaderBoard;
export default ProtectedBoard;
