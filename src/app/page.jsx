"use client";

import React, { useEffect, useState } from "react";
import {
  Header,
  LargeText,
  Introduction,
  Overview,
  CategoryVote,
  LastTop10,
  Comment,
  Media,
  ResultModal,
} from "@/components/home";
import DateChecker from "@/components/home/DateChecker";
import { SplashScreen, Footer, ScrollToTop } from "@/components/common";
import ReactGA from "react-ga4";

ReactGA.initialize(process.env.NEXT_PUBLIC_GA4);

function Home() {
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "Homepage Pageview",
    });
  }, []);

  //Hide Splash Screen on small screen
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1000);
  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1000);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main style={{ backgroundColor: "#fff7f8" }}>
      {isWideScreen && <SplashScreen />}
      <Header />
      <div className="contentContainer">
        <ResultModal />
        <LargeText />
        <Introduction />
        <Overview />
        <CategoryVote />
        <LastTop10 />
        <Media />
        <Comment />
        <Footer />
        <ScrollToTop />
      </div>
      <DateChecker
        ids={["votebtn", "overview-vote", "timeline-vote", "footer-vote"]}
      />
    </main>
  );
}

export default Home;
