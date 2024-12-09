"use client";
import Image from "next/image";
import "./styles/social-hub.scss";
import { SOCIAL } from "@/constants";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

function SocialHub() {
  const { theme, setTheme } = useTheme();

  const [isVisible, setIsVisible] = useState(false);
  const handleScroll = () => setIsVisible(window.scrollY > 400);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className="social-hub"
      style={{ display: isVisible ? "block" : "none" }}
    >
      {/* <div className="mb-2">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="facebook cursor-pointer"
        >
          {theme === "light" ? (
            <SunIcon className="text-[hsl(var(--text-color))] h-[25px] w-[21px] -translate-x-1" />
          ) : (
            <MoonIcon className="text-[hsl(var(--text-color))] h-[25px] w-[21px] -translate-x-1" />
          )}
        </button>
      </div> */}
      <Link href={SOCIAL.facebook} target="_blank">
        <div className="facebook">
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
