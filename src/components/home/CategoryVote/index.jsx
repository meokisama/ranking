import "./CategoryVote.scss";
import SectionTitle from "../SectionTitle";
import { CATEGORIES } from "@/constants";

function CategoryVote() {
  return (
    <div className=" wrapper categoryVote">
      <SectionTitle
        title="Hạng Mục"
        description="Những hạng mục bình chọn cho bảng xếp hạng năm nay!"
      />
      <div className="categoryContainer">
        <div className="categoryImg">
          <img id="haruhi" alt="" src="/makein.webp" />
        </div>
        <div className="categoryText">
          {CATEGORIES.map((category, index) => (
            <div className="categoryItem" key={index}>
              <div className="categoryIndex">0{index + 1}</div>
              <div className="categoryName">
                <p>{category}</p>
              </div>
            </div>
          ))}
          <div className="categoryItem">
            <div className="categoryIndex">&</div>
            <div className="categoryName">
              <p>Tự do đóng góp ý kiến và đề xuất</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryVote;
