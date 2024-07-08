"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants";
import "./Header.scss";
import Sakura from "../Sakura";
import Image from "next/image";
import { useNotification } from "@/components/common/Notification";
import DateChecker from "../DateChecker";

function Header() {
  const [imgHeight, setImgHeight] = useState(null);
  const [shouldHide, setShouldHide] = useState(false);
  const bannerRef = useRef(null);
  const imgRef = useRef(null);

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
    const handleClick = DateChecker(notification);
    voteBtn.addEventListener("click", handleClick);

    return () => voteBtn.removeEventListener("click", handleClick);
  }, [notification]);

  return (
    <div className="header">
      <div className="headerContent" ref={bannerRef}>
        <Sakura density={60} />
        <div className="textContent">
          <div className="textTitle">
            <h1>
              <span id="text01">Bảng Xếp Hạng </span>
              <br />
              <span id="text02"> Light Novel</span>
              <br />
              <span id="text03"> Việt Nam</span>
            </h1>
            <Image
              id="rotSakura1"
              alt="sakura petal"
              width={178}
              height={171}
              src="/sakura1.svg"
            />
            <Image
              id="rotSakura2"
              alt="sakura petal"
              width={125}
              height={120}
              src="/sakura2.svg"
            />
          </div>
          <p>
            Bạn là nhà thám hiểm rong ruổi trong những thế giới giả tưởng kỳ bí,
            là nhà lãnh đạo của những cuộc phiêu lưu bất tận được thêu dệt bởi
            những con chữ! Đến, và đem quyền lực của bạn để bình chọn cho những
            Light Novel độc đáo nhất, góp phần làm nên một bảng xếp hạng xuất
            sắc nhất lịch sử Light Novel Việt Nam. Hãy là phù thủy của chính câu
            chuyện bạn yêu thích, và hãy để cái tên của câu chuyện đó ghi danh
            bảng vàng!
          </p>
          <div id="textBtn">
            <Link id="header-vote" href={ROUTES.VOTE} target="_blank">
              <span>Bình Chọn</span>
              <Image
                alt="sakura petal"
                width={32}
                height={32}
                src="/sakura1.svg"
              />
            </Link>
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
          </div>
        </div>
        <div className="imgContent">
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
