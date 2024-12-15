"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Timeline } from "antd";
import CountUp from "react-countup";
import "./styles/overview.scss";
import { ROUTES, TIME_PERIOD } from "@/constants";
import timelineItem from "./timeline";
import SectionTitle from "./section-title";
import Image from "next/image";
import { useNotification } from "@/utils/Notification";
import DateChecker from "@/utils/date-checker";
import { VOTING_END_TIME } from "@/utils/date-config";

interface TimeLeft {
  title?: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function Overview() {
  const [isWideScreen, setIsWideScreen] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    title: "Thời gian bình chọn còn lại",
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hydrated, setHydrated] = useState<boolean>(false);
  const notification = useNotification();

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

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const targetDate = VOTING_END_TIME;
    const difference = targetDate.getTime() - new Date().getTime();

    if (difference > 0) {
      return {
        title: "Thời gian bình chọn còn lại",
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, calculateTimeLeft]);

  useEffect(() => {
    if (hydrated) {
      const overviewBtn = document.getElementById("overview-vote");
      const timelineBtn = document.getElementById("timeline-vote");

      if (!overviewBtn || !timelineBtn) return;

      const handleClick = DateChecker(notification);

      overviewBtn.addEventListener("click", handleClick);
      timelineBtn.addEventListener("click", handleClick);

      return () => {
        overviewBtn.removeEventListener("click", handleClick);
        timelineBtn.removeEventListener("click", handleClick);
      };
    }
  }, [hydrated, notification]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <div className="wrapper overview">
      <SectionTitle
        title={"Tổng Quan"}
        description={"Tổng quan vài điểm nhấn của bảng xếp hạng."}
      />
      <div className="statistic">
        <div className="statistic-item">
          <p>
            0<CountUp end={6} enableScrollSpy={true} scrollSpyDelay={0} />
          </p>
          <span className="staname">Năm tổ chức</span>
        </div>
        <div className="statistic-item">
          <p>
            0<CountUp end={4} enableScrollSpy={true} scrollSpyDelay={0} />
          </p>
          <span className="staname">Hạng mục bình chọn</span>
        </div>
        <div className="statistic-item">
          <p>
            <CountUp end={200} enableScrollSpy={true} scrollSpyDelay={0} />+
          </p>
          <span className="staname">Tác phẩm</span>
        </div>
        <div className="statistic-item">
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
          <p>{timeLeft.title}</p>
          <div className="time-left">
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
          alt="bxh light novel chibi su gia bon mua"
          src="/chibi00.webp"
          width={290}
          height={264}
        />
        <Image
          id="chibi01"
          alt="bxh light novel chibi makeine"
          src="/chibi01.webp"
          width={244}
          height={277}
        />
      </div>
    </div>
  );
}

export default Overview;
