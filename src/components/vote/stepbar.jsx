"use client";
import { useState, useEffect } from "react";
import { Steps } from "antd";
import {
  SendOutlined,
  CaretLeftFilled,
  CaretRightFilled,
} from "@ant-design/icons";
import "./styles/stepbar.scss";

function StepBar({
  currentComponent,
  onChange,
  isLastComponent,
  isPenultimate,
  handlePrevious,
  handleNext,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [show, setShow] = useState(true);
  // const [scrollPos, setScrollPos] = useState(0);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollPos = window.scrollY;
  //     const visible = scrollPos > currentScrollPos;
  //     setShow(visible);
  //     setScrollPos(currentScrollPos);
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [scrollPos]);

  return (
    <div className={`step-bar ${show ? "" : "hidden"}`}>
      <div className="control-button">
        <button
          className={currentComponent === 0 ? "inactivate" : ""}
          id="btnPrev"
          onClick={handlePrevious}
        >
          <CaretLeftFilled />
          Hạng mục trước đó
        </button>
        {!isMobile ? (
          <div className="control-step">
            <Steps
              type="navigation"
              current={currentComponent}
              onChange={onChange}
              items={[{}, {}, {}, {}, { icon: <SendOutlined /> }]}
              responsive={false}
              size={isMobile ? "small" : "default"}
            />
          </div>
        ) : null}
        <button
          className={isLastComponent ? "inactivate" : ""}
          id="btnNext"
          onClick={handleNext}
        >
          {isPenultimate || isLastComponent
            ? "Gửi bình chọn"
            : "Hạng mục tiếp theo"}
          <CaretRightFilled />
        </button>
      </div>
    </div>
  );
}

export default StepBar;
