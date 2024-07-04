import Link from "next/link";
import "./Footer.scss";
import { ROUTES, AUTHORS } from "@/constants";

function Footer({ text = "Bình Chọn", to = ROUTES.VOTE }) {
  return (
    <div className="footer">
      <div>
        <div className="scrolling-authors">
          <p>
            {AUTHORS.map((author, index) => (
              <span key={index}>
                「
                <strong onClick={() => window.open(author.url, "_blank")}>
                  {author.name}
                </strong>{" "}
                ({author.description})」
              </span>
            ))}
          </p>
          <p>
            {AUTHORS.map((author, index) => (
              <span key={index}>
                「
                <strong onClick={() => window.open(author.url, "_blank")}>
                  {author.name}
                </strong>{" "}
                ({author.description})」
              </span>
            ))}
          </p>
        </div>
        <Link className="btnLink" id="footer-vote" href={to} target="_blank">
          <div className="footerBtn">
            <span>{text}</span>
          </div>
        </Link>
        <p
          className="credit"
          onClick={() => window.open(SOCIAL.facebook, "_blank")}
        >
          © BXH Light Novel Việt Nam 2024
        </p>
      </div>
    </div>
  );
}

export default Footer;
