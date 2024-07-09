import SectionTitle from "@/components/home/SectionTitle";
import { Chart as BarChart } from "./BarChart";
import { Chart as PieChart } from "./PieChart";
import "./custom.scss";

function Chart() {
  return (
    <div className="custom-chart block my-0 mx-auto max-w-[90%] lg:max-w-screen-xl">
      <SectionTitle
        title="Thống kê"
        description="Tổng quan về số lượng bình chọn cho bảng xếp hạng qua từng năm, mỗi năm hai kì."
      />
      <div className="flex flex-row w-full gap-6 justify-center items-stretch">
        <div className="w-11/12 lg:w-3/5">
          <BarChart />
        </div>
        <div className="hidden lg:flex lg:flex-col lg:gap-6">
          <PieChart />
          <PieChart />
        </div>
      </div>
    </div>
  );
}

export default Chart;
