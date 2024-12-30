"use client";
import Footer from "@/components/common/footer";
import SocialHub from "@/components/common/social-hub";
import ShortSplashScreen from "@/components/common/short-splash-screen";
import Banner from "@/components/leaderboard/banner";
import LeaderBoardTable from "@/components/leaderboard/leaderboard-table";
import { CURRENT_PERIOD, ROUTES } from "@/constants";
import ScrollToTop from "@/utils/scroll-to-top";
import Custom404 from "@/app/not-found";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ConvertPeriodParams {
  period: string;
}

const convertPeriod = ({ period }: ConvertPeriodParams): string | null => {
  const [half, year] = period.split("-");
  if (half === "1") return `first_half_${year}`;
  if (half === "2") return `second_half_${year}`;
  return null;
};

const LeaderBoard = ({ params }: { params: { period: string } }) => {
  const { period } = params;
  const convertedPeriod = convertPeriod({ period });
  const router = useRouter();

  useEffect(() => {
    if (convertedPeriod === CURRENT_PERIOD) {
      router.push(ROUTES.LEADERBOARD);
    }
  }, [convertedPeriod, router]);

  return (
    <div>
      {convertedPeriod ? (
        <div>
          <ShortSplashScreen />
          <div>
            <Banner />
            <LeaderBoardTable period={convertedPeriod} />
            <Footer text="Trang Chủ" to={ROUTES.HOME} />
            <SocialHub />
            <ScrollToTop />
          </div>
        </div>
      ) : (
        <Custom404 />
      )}
    </div>
  );
};
export default LeaderBoard;
