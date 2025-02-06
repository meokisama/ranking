"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/constants";
import "./styles/header.scss";
import Sakura from "./sakura";
import Image from "next/image";
import { useNotification } from "@/utils/Notification";
import DateChecker from "@/utils/date-checker";

function Header() {
  const [imgHeight, setImgHeight] = useState<number>();
  const [shouldHide, setShouldHide] = useState<boolean>(false);
  const bannerRef = useRef<any>(null);
  const imgRef = useRef<any>(null);

  useEffect(() => {
    const bannerElement = bannerRef.current;
    const imgElement = imgRef.current;

    const handleResize = () => {
      if (imgElement) {
        setImgHeight(bannerElement.clientHeight);
        setShouldHide(window.innerWidth < 900);
      }
    };

    window.addEventListener("resize", handleResize);

    const handleImageLoad = () => {
      if (imgElement) {
        setImgHeight(bannerElement.clientHeight);
      }
    };

    if (imgElement) {
      imgElement.addEventListener("load", handleImageLoad);
    }

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (imgElement) {
        imgElement.removeEventListener("load", handleImageLoad);
      }
    };
  }, []);

  const notification = useNotification();
  useEffect(() => {
    const voteBtn = document.getElementById("header-vote");
    if (!voteBtn) return;
    const handleClick = DateChecker(notification);
    voteBtn.addEventListener("click", handleClick);

    return () => voteBtn.removeEventListener("click", handleClick);
  }, [notification]);

  return (
    <div className="header">
      <div className="header-content" ref={bannerRef}>
        <Sakura density={60} />
        <div className="text-content">
          <div className="text-title">
            <div className="mt-16 mb-4">
              <motion.h1
                initial={{ opacity: 0, y: "-100px" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  damping: 10,
                  mass: 0.75,
                  stiffness: 300,
                  delay: 8.5,
                }}
              >
                <span id="text01">Bảng Xếp Hạng </span>
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: "-100px" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  damping: 10,
                  mass: 0.75,
                  stiffness: 300,
                  delay: 8.7,
                }}
              >
                <span id="text02"> Light Novel</span>
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: "-100px" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  damping: 10,
                  mass: 0.75,
                  stiffness: 300,
                  delay: 8.9,
                }}
              >
                <span id="text03"> Việt Nam</span>
              </motion.h1>
            </div>
            <Image
              id="rot-sakura-1"
              alt="sakura petal"
              width={178}
              height={171}
              src="/sakura1.svg"
            />
            <Image
              id="rot-sakura-2"
              alt="sakura petal"
              width={125}
              height={120}
              src="/sakura2.svg"
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: "50px" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 9.2 }}
          >
            Bạn là nhà thám hiểm rong ruổi trong những thế giới giả tưởng kỳ bí,
            là nhà lãnh đạo của những cuộc phiêu lưu bất tận được thêu dệt bởi
            những con chữ! Đến, và đem quyền lực của bạn để bình chọn cho những
            Light Novel độc đáo nhất, góp phần làm nên một bảng xếp hạng xuất
            sắc nhất lịch sử Light Novel Việt Nam. Hãy là phù thủy của chính câu
            chuyện bạn yêu thích, và hãy để cái tên của câu chuyện đó ghi danh
            bảng vàng!
          </motion.p>
          <div id="text-btn">
            <motion.div
              initial={{ opacity: 0, x: "-100px" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                damping: 10,
                mass: 0.75,
                stiffness: 300,
                delay: 9.4,
              }}
              className="w-1/2 lg:w-1/4"
            >
              <Link id="header-vote" href={ROUTES.VOTE} target="_blank">
                <span>Bình Chọn</span>
                <Image
                  alt="sakura petal"
                  width={32}
                  height={32}
                  src="/sakura1.svg"
                />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: "-100px" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                damping: 10,
                mass: 0.75,
                stiffness: 300,
                delay: 9.6,
              }}
              className="w-1/2 lg:w-1/4"
            >
              <Link
                id="leaderboard-btn"
                href={ROUTES.LEADERBOARD}
                target="_blank"
              >
                <span>Xem kết quả</span>
                <Image
                  alt="sakura petal"
                  width={32}
                  height={32}
                  src="/sakura1.svg"
                />
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="img-content">
          <Image
            alt="hero image"
            src="/headerimg.webp"
            width={785}
            height={826}
            ref={imgRef}
          />
        </div>
      </div>
      {shouldHide ? null : <div style={{ height: imgHeight }}></div>}
    </div>
  );
}

export default Header;
