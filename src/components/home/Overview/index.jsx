"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Timeline } from "antd";
import CountUp from "react-countup";
import "./Overview.scss";
import { ROUTES } from "@/constants";
import timelineItem from "./Timeline";
import SectionTitle from "../SectionTitle";
import Image from "next/image";

function Overview() {
  const [isWideScreen, setIsWideScreen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 600);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const targetDate = "2024-06-25T23:59:00";
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div className="wrapper overview">
      <SectionTitle
        title={"Tổng Quan"}
        description={"Tổng quan vài điểm nhấn của bảng xếp hạng."}
      />
      <div className="statistic">
        <div className="statisticItem">
          <p>
            0<CountUp end={6} enableScrollSpy={true} scrollSpyDelay={0} />
          </p>
          <span className="staname">Năm tổ chức</span>
        </div>
        <div className="statisticItem">
          <p>
            0<CountUp end={4} enableScrollSpy={true} scrollSpyDelay={0} />
          </p>
          <span className="staname">Hạng mục bình chọn</span>
        </div>
        <div className="statisticItem">
          <p>
            <CountUp end={200} enableScrollSpy={true} scrollSpyDelay={0} />+
          </p>
          <span className="staname">Tác phẩm</span>
        </div>
        <div className="statisticItem">
          <p>
            <CountUp end={3000} enableScrollSpy={true} scrollSpyDelay={0} />+
          </p>
          <span className="staname">Lượt bình chọn mỗi kì</span>
        </div>
      </div>
      <div className="timeline">
        {isWideScreen ? (
          <Timeline mode="alternate" items={timelineItem} />
        ) : (
          <Timeline items={timelineItem} />
        )}
      </div>
      <div className="countdown">
        <div className="cdwrapper">
          <p>Thời gian bình chọn còn lại?</p>
          <div className="timeLeft">
            <div>
              <h2>
                {timeLeft.days < 10 ? "0" + timeLeft.days : timeLeft.days}
              </h2>
              <span>ngày</span>
            </div>
            <div>
              <h2>
                {timeLeft.hours < 10 ? "0" + timeLeft.hours : timeLeft.hours}
              </h2>
              <span>giờ</span>
            </div>
            <div>
              <h2>
                {timeLeft.minutes < 10
                  ? "0" + timeLeft.minutes
                  : timeLeft.minutes}
              </h2>
              <span>phút</span>
            </div>
            <div>
              <h2>
                {timeLeft.seconds < 10
                  ? "0" + timeLeft.seconds
                  : timeLeft.seconds}
              </h2>
              <span>giây</span>
            </div>
          </div>
        </div>
        <div className="voteWrapper">
          <Link
            className="voteBtn"
            id="overview-vote"
            href={ROUTES.VOTE}
            target="_blank"
          >
            <span>Bình Chọn</span>
            <Image
              alt="sakura petal"
              src="/sakura1.svg"
              width={44}
              height={44}
            />
          </Link>
        </div>
        <Image
          id="chibi00"
          alt="chibi su gia bon mua"
          src="/chibi00.webp"
          width={290}
          height={264}
        />
        <Image
          id="chibi01"
          alt="chibi makeine"
          src="/chibi01.webp"
          width={244}
          height={277}
        />
      </div>
    </div>
  );
}

export default Overview;
