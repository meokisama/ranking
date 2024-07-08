import { FeedbackHero, FeedbackContent } from "@/components/feedback";

export const metadata = {
  title: "Feedback",
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
