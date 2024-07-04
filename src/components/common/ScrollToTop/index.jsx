import React, { useEffect, useState } from "react";
import { CaretUpFilled } from "@ant-design/icons";
import "./ScrollToTop.scss";

function ScrollToTop() {
  //Scroll to top
  const [isVisible, setIsVisible] = useState(false);
  const handleScroll = () => setIsVisible(window.scrollY > 400);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="scroll-to-top">
      <button
        id="toTop"
        onClick={scrollToTop}
        style={{
          display: isVisible ? "flex" : "none",
        }}
      >
        <CaretUpFilled />
      </button>
    </div>
  );
}

export default ScrollToTop;
