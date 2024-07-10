import SectionTitle from "@/components/home/SectionTitle";
import "./custom.scss";
import Image from "next/image";

function Hall() {
  return (
    <div className="hall mt-10 lg:mt-40 max-w-[90%] lg:max-w-screen-xl block my-0 mx-auto">
      <Image
        src="/alisa-gura.webp"
        alt="alisa gawr gura chibi"
        width={200}
        height={201}
        className="block my-0 mx-auto relative z-[2] h-auto w-[100px] translate-y-[55.5%] sm:w-[200px] sm:translate-y-[34.5%]"
      />
      <div className="hall-section-title text-center mb-8 lg:mb16">
        <SectionTitle
          title="Đại Sảnh"
          description="Toàn bộ xếp hạng được bình chọn bởi cộng đồng tính từ 2018."
        />
      </div>
    </div>
  );
}

export default Hall;
