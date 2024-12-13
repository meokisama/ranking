import Image from "next/image";

function FeedbackHero() {
  return (
    <div className="flex justify-center items-center py-20 px-0">
      <Image
        src="/images/logo.webp"
        alt="bxh light novel logo"
        width={700}
        height={403}
        className="w-[min(700px,80vw)] h-auto"
      />
    </div>
  );
}

export default FeedbackHero;
