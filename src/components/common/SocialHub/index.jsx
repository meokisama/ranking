"use client";
import Image from "next/image";
import "./SocialHub.scss";
import { SOCIAL } from "@/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

function SocialHub() {
  const [isVisible, setIsVisible] = useState(false);
  const handleScroll = () => setIsVisible(window.scrollY > 400);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="social-hub">
      <Link href={SOCIAL.facebook} target="_blank">
        <div
          className="facebook"
          style={{ display: isVisible ? "flex" : "none" }}
        >
          <Image
            src="/facebook-circled.svg"
            alt="light novel ranking facebook icon"
            width={30}
            height={30}
          />
        </div>
      </Link>
    </div>
  );
}

export default SocialHub;
