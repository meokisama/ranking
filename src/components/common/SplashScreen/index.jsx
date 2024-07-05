"use client";
import {
  useSpring,
  useTrail,
  useSpringRef,
  useChain,
  animated,
} from "@react-spring/web";
import { useState, useEffect } from "react";

import "./SplashScreen.scss";

function SplashScreen() {
  const [shouldUnmount, setShouldUnmount] = useState(false);

  const arrayText = [
    "BẢNG XẾP HẠNG",
    "LIGHT NOVEL",
    "LỚN NHẤT VIỆT NAM",
    "ĐÃ TRỞ LẠI!",
  ];

  const textInRef = useSpringRef();
  const textInProps = useTrail(arrayText.length, {
    ref: textInRef,
    from: { opacity: 0, transform: "translateY(-150px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 10 },
  });

  const propsDownRef = useSpringRef();
  const propsDown = useSpring({
    ref: propsDownRef,
    from: { transform: "translateY(0)" },
    to: { transform: "translateY(100vh)" },
    config: { tension: 250, friction: 10 },
  });

  const propsLeftRef = useSpringRef();
  const propsLeft = useSpring({
    ref: propsLeftRef,
    from: { transform: "translateX(0)" },
    to: { transform: "translateX(-100%)" },
    config: { tension: 250, friction: 10 },
    delay: 500,
  });

  const propsRightRef = useSpringRef();
  const propsRight = useSpring({
    ref: propsRightRef,
    from: { transform: "translateX(0)" },
    to: { transform: "translateX(100%)" },
    config: { tension: 250, friction: 10 },
    delay: 500,
  });

  useChain(
    [textInRef, propsDownRef, propsLeftRef, propsRightRef],
    [0, 0.5, 1, 1]
  );

  useEffect(() => {
    document.body.style.position = "fixed";
    const timeoutId = setTimeout(() => {
      document.body.style.position = "";
      setShouldUnmount(true);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  return shouldUnmount ? null : (
    <div className="splashScreen">
      <div className="splashTextBG">
        <animated.div className="left" style={propsLeft}>
          <span>Vietnam</span>
          <span>Light Novel</span>
          <span>Ranking</span>
        </animated.div>
        <animated.div className="right" style={propsRight}>
          <span>BXH</span>
          <span>Light Novel</span>
          <span>Việt Nam</span>
        </animated.div>
      </div>
      <animated.div className="splashText" style={propsDown}>
        {arrayText.map((text, index) => (
          <animated.div key={index} style={textInProps[index]}>
            <span>{text}</span>
          </animated.div>
        ))}
      </animated.div>
    </div>
  );
}

export default SplashScreen;
