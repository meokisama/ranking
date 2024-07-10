import SectionTitle from "@/components/home/SectionTitle";
import HallOfRank from "../HallOfRank";
import "./custom.scss";
import Image from "next/image";
import { Divider } from "antd";

function Hall() {
  return (
    <div className="hall mt-20 lg:mt-60 max-w-[98%] lg:max-w-screen-xl block my-0 mx-auto">
      <Divider />
      <div className="mb-20 flex justify-center items-center select-none pointer-events-none">
        <Image
          src="/alisa-gura.webp"
          alt="alisa chibi"
          width={200}
          height={201}
          className="w-[110px] h-auto lg:w-[200px]"
        />
        <Image
          src="/alisa-gura.webp"
          alt="alisa chibi"
          width={200}
          height={201}
          className="w-[110px] h-auto lg:w-[200px]"
        />
        <Image
          src="/alisa-gura.webp"
          alt="alisa chibi"
          width={200}
          height={201}
          className="w-[110px] h-auto lg:w-[200px]"
        />
        <Image
          src="/alisa-gura.webp"
          alt="alisa chibi"
          width={200}
          height={201}
          className="w-[110px] h-auto lg:w-[200px]"
        />
        <Image
          src="/alisa-gura.webp"
          alt="alisa chibi"
          width={200}
          height={201}
          className="w-[110px] h-auto lg:w-[200px]"
        />
        <Image
          src="/alisa-gura.webp"
          alt="alisa chibi"
          width={200}
          height={201}
          className="w-[110px] h-auto lg:w-[200px]"
        />
      </div>
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
