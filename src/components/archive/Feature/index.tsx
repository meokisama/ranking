import {
  HeartIcon,
  CursorArrowRippleIcon,
  ArrowTrendingUpIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import "./custom.scss";
import SectionTitle from "@/components/home/SectionTitle";

const features = [
  {
    name: "Light Novel được yêu thích nhất",
    description:
      "Chúng tôi tổng hợp danh sách light novel được yêu thích nhất qua các năm. Dựa trên số lượng bình chọn từ hàng ngàn độc giả, bạn có thể dễ dàng tìm thấy những tác phẩm hàng đầu và đang được đón đọc nhiều nhất.",
    icon: HeartIcon,
  },
  {
    name: "Bình chọn của cộng đồng",
    description:
      "Khám phá những light novel được đánh giá cao nhất bởi cộng đồng độc giả. Bảng xếp hạng của chúng tôi phản ánh chính xác những xu hướng và sở thích đọc của người hâm mộ, giúp bạn dễ dàng cập nhật các tác phẩm hot nhất.",
    icon: CursorArrowRippleIcon,
  },
  {
    name: "Xu hướng Light Novel mới nhất",
    description:
      "Đừng bỏ lỡ những xu hướng light novel mới nhất với bảng xếp hạng cập nhật liên tục nửa năm một lần. Chúng tôi tổng hợp cả những tác phẩm mới ra mắt và nhận được nhiều sự quan tâm, giúp bạn bắt kịp với những nội dung mới mẻ và hấp dẫn.",
    icon: ArrowTrendingUpIcon,
  },
  {
    name: "Những tác phẩm kinh điển",
    description:
      "Đừng bỏ lỡ danh sách những light novel kinh điển đã làm say lòng bao thế hệ độc giả. Các tác phẩm này không chỉ nhận được nhiều bình chọn mà còn giữ được sức hút lâu dài, trở thành những cuốn sách không thể thiếu trong tủ sách của bạn.",
    icon: AcademicCapIcon,
  },
];

export default function Example() {
  return (
    <div className="bg-white py-24 sm:py-32 lg:mb-10 feature-custom">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
        {/* <div className="mx-auto max-w-2xl lg:max-w-6xl lg:text-center">
          <h2 className="text-base lg:text-xl font-semibold leading-8 lg:mb-4 text-gray-400">
            Bảng Xếp Hạng Light Novel Việt Nam
          </h2>
          <p className="mt-2 text-3xl lg:text-6xl font-black tracking-tight text-[#fa7667] sm:text-4xl">
            Tiểu Thuyết Đại Cương
          </p>
          <p className="mt-6 text-lg lg:text-2xl leading-8 text-gray-600">
            Đây là đại sảnh xếp hạng Light Novel, một thư viện tập hợp toàn bộ
            những câu chuyện xuất sắc nhất được tôn vinh qua từng kì bình chọn
            trong suốt 6 năm vừa qua.
          </p>
        </div> */}
        <div className="text-center mb-8 lg:mb16">
          <SectionTitle
            title="Tiểu Thuyết Đại Cương"
            description="Đây là thư viện lưu trữ cho Bảng Xếp Hạng Light Novel Việt Nam, đại cương về light novel cho những người vừa bước chân vào lĩnh vực tiểu thuyết nhẹ."
          />
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-32 lg:max-w-[90%]">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16 lg:pl-24">
                <dt className="feature-name text-2xl lg:text-4xl font-normal lg:font-bold leading-7 text-[#fa7667]">
                  <div className="absolute left-0 top-0 flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-[5px] bg-[#fa7667]">
                    <feature.icon
                      aria-hidden="true"
                      className="h-8 w-8 lg:h-10 lg:w-10 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 lg:mt-8 text-base lg:text-[1.7rem] lg:max-w-[90%] lg:text-justify leading-7 lg:leading-10 ml-0 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
