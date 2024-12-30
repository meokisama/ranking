"use client";
import Footer from "@/components/common/footer";
import SocialHub from "@/components/common/social-hub";
import ShortSplashScreen from "@/components/common/short-splash-screen";
import Banner from "@/components/leaderboard/banner";
// import LeaderBoardTable from "@/components/leaderboard/leaderboard-api";
import LeaderBoardTable from "@/components/leaderboard/leaderboard-table";
import { ROUTES } from "@/constants";
import ScrollToTop from "@/utils/scroll-to-top";
import ProtectedRoute from "@/components/common/protected-route";

interface ResponseData {
  [key: string]: any;
}

interface LeaderBoardProps {
  responseData?: ResponseData;
}

const LeaderBoard: React.FC<LeaderBoardProps> = ({ responseData: data }) => {
  return (
    <div>
      <ShortSplashScreen />
      <div>
        <Banner />
        {/* <LeaderBoardTable responseData={data} /> */}
        <LeaderBoardTable />
        <Footer text="Trang Chủ" to={ROUTES.HOME} />
        <SocialHub />
        <ScrollToTop />
      </div>
    </div>
  );
};

// const ProtectedBoard: React.FC = () => {
//   return <ProtectedRoute component={LeaderBoard} />;
// };

// export default ProtectedBoard;

export default LeaderBoard;
