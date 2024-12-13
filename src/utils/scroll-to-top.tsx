"use client";
import React, { useEffect, useState } from "react";
import { CaretUpFilled } from "@ant-design/icons";

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
        className="fixed z-[100] border-none cursor-pointer w-14 h-14 right-4 bottom-4 sm:w-20 sm:h-20 items-center justify-center bg-[#404660] opacity-30 rounded-[50%] border-[none] sm:right-8 sm:bottom-8 hover:opacity-90"
      >
        <CaretUpFilled className="text-[aliceblue] text-2xl sm:text-[aliceblue] sm:text-[2rem]" />
      </button>
    </div>
  );
}

export default ScrollToTop;
