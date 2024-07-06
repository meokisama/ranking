import { FeedbackHero, FeedbackContent } from "@/components/feedback";

export const metadata = {
  title: "Feedback - Bảng Xếp Hạng Light Novel Việt Nam",
};

function FeedbackResult() {
  return (
    <div>
      <FeedbackHero />
      <FeedbackContent />
    </div>
  );
}

export default FeedbackResult;
