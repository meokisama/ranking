"use client";
import FeedbackHero from "@/components/feedback/feedback-hero";
import FeedbackContent from "@/components/feedback/feedback-content";
// import FeedbackContent from "@/components/feedback/api";
import Footer from "@/components/common/footer";
import SocialHub from "@/components/common/social-hub";
import ProtectedRoute from "@/components/common/protected-route";
import { ROUTES } from "@/constants";

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

// function ProtectedBoard() {
//   return <ProtectedRoute component={FeedbackResult} />;
// }

// export default ProtectedBoard;

export default FeedbackResult;
