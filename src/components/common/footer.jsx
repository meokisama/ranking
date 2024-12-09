"use client";
import Link from "next/link";
import "./styles/footer.scss";
import { ROUTES, AUTHORS } from "@/constants";
import { useNotification } from "@/utils/Notification";
import DateChecker from "@/utils/DateChecker";
import { useEffect } from "react";

function Footer({ text = "Bình Chọn", to = ROUTES.VOTE }) {
  const notification = useNotification();
  useEffect(() => {
    if (text === "Bình Chọn") {
      const voteBtn = document.getElementById("footer-vote");
      const handleClick = DateChecker(notification);
      voteBtn.addEventListener("click", handleClick);

      return () => voteBtn.removeEventListener("click", handleClick);
    }
  }, [notification, text]);

  return (
    <div className="footer">
      <div>
        <div className="scrolling-authors">
          <p>
            {AUTHORS.map((author, index) => (
              <span key={index}>
                「
                <Link href={author.url} target="_blank">
                  <strong>{author.name}</strong>{" "}
                </Link>
                ({author.description})」
              </span>
            ))}
          </p>
          <p>
            {AUTHORS.map((author, index) => (
              <span key={index}>
                「
                <Link href={author.url} target="_blank">
                  <strong>{author.name}</strong>{" "}
                </Link>
                ({author.description})」
              </span>
            ))}
          </p>
        </div>
        <Link className="btn-url" id="footer-vote" href={to} target="_blank">
          <div className="footer-btn">
            <span>{text}</span>
          </div>
        </Link>
        <p className="credit">© BXH Light Novel Việt Nam 2024</p>
      </div>
    </div>
  );
}

export default Footer;
