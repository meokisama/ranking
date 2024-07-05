import Image from "next/image";
import "./LargeText.scss";

function LargeText() {
  return (
    <div className="largeText">
      <Image
        alt="nonoa chibi"
        src="/nonoa_chibi.webp"
        width={190}
        height={308}
      />
      <div className="container">
        <h1 className="text">Vietnam</h1>
        <h1 className="text">light novel</h1>
        <h1 className="text">ranking</h1>
      </div>
    </div>
  );
}

export default LargeText;
