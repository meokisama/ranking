import FeedbackHero from "@/components/feedback/feedback-hero";
import FeedbackContent from "@/components/feedback/feedback-content";
import Footer from "@/components/common/footer";
import SocialHub from "@/components/common/social-hub";
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
