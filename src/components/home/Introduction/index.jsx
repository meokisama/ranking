import Link from "next/link";
import "./Introduction.scss";
import { INTRODUCTION_INFO, SOCIAL } from "@/constants";

function Introduction() {
  return (
    <div className="introduction">
      <img id="saki" src="/saki.webp" alt="" />
      <div className="inner">
        <div className="holder">
          <div className="social-icon">
            <Link href={SOCIAL.facebook} target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-brand-facebook"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
              </svg>
            </Link>
            <span>Facebook</span>
          </div>
          <div className="about-wrapper">
            <div className="about-content">
              <div className="about-ranking">
                <span>{INTRODUCTION_INFO[0].title}</span>
                {INTRODUCTION_INFO[0].content}
              </div>
              <div className="about-organizer">
                <span>{INTRODUCTION_INFO[1].title}</span>
                {INTRODUCTION_INFO[1].content}
              </div>
            </div>
          </div>
          <div className="dotwrapper">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Introduction;
