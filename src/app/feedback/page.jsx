import { FeedbackHero, FeedbackContent } from "@/components/feedback";
import { Footer, SocialHub } from "@/components/common";
import { ROUTES } from "@/constants";

export const metadata = {
  title: "Feedback",
};

function FeedbackResult() {
  return (
    <div>
      <FeedbackHero />
      <FeedbackContent />
      <SocialHub />
      <Footer text="Trang Chủ" to={ROUTES.HOME} />
    </div>
  );
}

export default FeedbackResult;
