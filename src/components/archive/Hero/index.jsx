import Image from "next/image";
import "./Hero.scss";
import Link from "next/link";
import { ROUTES, SOCIAL } from "@/constants";

function ArchiveHero() {
  return (
    <div className="archive-hero">
      <div className="archive-banner">
        <div className="text-content">
          <div className="logo-header">
            <Image
              src="/sakura1.svg"
              alt="logo header chibi"
              width={400}
              height={400}
              id="sakura-petal"
            />
          </div>
          <h1>
            Đại sảnh xếp hạng Light Novel <span>lớn nhất Đông Lào!</span>
          </h1>
          <div>
            <p>
              Đây là đại sảnh Light Novel, một thư viện tập hợp toàn bộ xếp hạng
              của những câu chuyện xuất sắc nhất được tôn vinh qua từng thời kì
              bình chọn trong suốt 6 năm qua của{" "}
              <strong style={{ fontWeight: "600", color: "#fa7667" }}>
                Bảng Xếp Hạng Light Novel Việt Nam
              </strong>
              .
            </p>
            <p>
              Mỗi câu chuyện là một mảnh ghép được vun đắp bởi những độc giả
              thầm lặng đại diện cho từng thời đại thăng trầm của lịch sử Light
              Novel nước nhà. Ngay bây giờ, hãy là một con mọt sách, rong ruổi
              qua những câu chuyện đầy mê hoặc đó, bước chân vào những cuộc hành
              trình được sáng tạo bởi những bộ não vượt thời gian!
            </p>
          </div>
          <div className="content-action">
            <Link href={SOCIAL.facebook} target="_blank">
              <Image
                src="/facebook-circled.svg"
                alt="light novel ranking logo"
                width={50}
                height={50}
              />
            </Link>
          </div>
        </div>
        <div className="image-content">
          <Image
            src="/alisa-gura.webp"
            alt="alisa chibi"
            width={600}
            height={603}
          />
        </div>
      </div>
      <div className="scrolling-text">
        <p>Vietnam Light Novel Ranking</p>
        <p>Vietnam Light Novel Ranking</p>
      </div>
    </div>
  );
}

export default ArchiveHero;
