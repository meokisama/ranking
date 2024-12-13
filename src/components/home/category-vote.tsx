import "./styles/category-vote.scss";
import SectionTitle from "./section-title";
import { CATEGORIES } from "@/constants";
import Image from "next/image";

function CategoryVote() {
  return (
    <div className=" wrapper category-vote">
      <SectionTitle
        title="Hạng Mục"
        description="Những hạng mục bình chọn cho bảng xếp hạng năm nay!"
      />
      <div className="category-container">
        <div className="category-img">
          <Image
            id="haruhi"
            alt="light novel makeine character"
            src="/makein.webp"
            width={418}
            height={923}
          />
        </div>
        <div className="category-text">
          {CATEGORIES.map((category, index) => (
            <div className="category-item" key={index}>
              <div className="category-index">0{index + 1}</div>
              <div className="category-name">
                <p>{category}</p>
              </div>
            </div>
          ))}
          <div className="category-item">
            <div className="category-index">&</div>
            <div className="category-name">
              <p>Tự do đóng góp ý kiến và đề xuất</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryVote;
