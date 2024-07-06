import Image from "next/image";
import "./globals.scss";
import Link from "next/link";
import { ROUTES } from "@/constants";

const Custom404 = () => {
  return (
    <div className="custom-404">
      <Image
        src="/chibi404.png"
        alt="404 not found chibi"
        width={200}
        height={339}
      />
      <div className="text-404">
        <h3>Hiện không tìm thấy trang này...</h3>
        <p>
          Địa chỉ bạn đang tìm kiếm không tồn tại, vui lòng quay lại trang chủ
          để xem thông tin về
          <strong style={{ color: "gray" }}>
            {" "}
            Bảng Xếp Hạng Light Novel Việt Nam
          </strong>
          .
        </p>
        <Link href={ROUTES.HOME}>
          <button>Quay lại</button>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
