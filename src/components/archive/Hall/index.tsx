import SectionTitle from "@/components/home/SectionTitle";
import HallOfRank from "../HallOfRank";
import "./custom.scss";

function Hall() {
  return (
    <div className="hall mt-20 lg:mt-60 max-w-[98%] lg:max-w-screen-xl block my-0 mx-auto overflow-hidden">
      <div className="hall-section-title text-center mb-8 lg:mb16">
        <SectionTitle
          title="Đại Sảnh"
          description="Toàn bộ xếp hạng được bình chọn bởi cộng đồng tính từ 2018."
        />
      </div>
      <HallOfRank />
    </div>
  );
}

export default Hall;
