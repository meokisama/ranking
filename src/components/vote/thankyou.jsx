import Image from "next/image";
import "./styles/thankyou.scss";

function ThankYou() {
  return (
    <div className="thankyou-wrapper">
      <div className="thankyou-title">
        <h1>Thank You</h1>
        <p className="subtitle">Xin cảm ơn!</p>
      </div>
      <div className="thankyou-content">
        <Image
          src="/thankyou-chibi.webp"
          alt="bxh light novel thankyou image"
          width={400}
          height={322}
          className="h-auto"
        />
        <div className="text-content">
          <div className="thankyou-graph">
            <p>
              Cảm ơn quý độc giả đã hoàn thành đợt bình chọn cho{" "}
              <strong>Bảng Xếp Hạng Light Novel Việt Nam</strong> lần này.
            </p>
            <p>
              Mỗi lá phiếu của các bạn không chỉ là sự ủng hộ, mà còn là một
              ngọn lửa nhiệt huyết thắp sáng con đường mỗi chúng ta đang bước
              đi, con đường hướng tới sự phát triển, tôn vinh giá trị văn học
              Light Novel và nét đẹp văn hóa đọc nước nhà. Tình yêu và sự tín
              nhiệm của các bạn là nguồn cảm hứng vô tận, khơi dậy trong chúng
              tôi lòng đam mê và khát vọng không ngừng để mang đến những sân
              chơi tuyệt vời, xứng đáng với niềm tin yêu của quý độc giả.
            </p>
            <p>
              Chúng tôi vô cùng biết ơn và mong rằng sẽ tiếp tục được đồng hành
              cùng các bạn trên hành trình văn chương đầy rực rỡ và thăng hoa
              phía trước. Trân trọng.
            </p>
            <p>
              Cuối cùng, hãy điền tên của bạn vào ô bên dưới, chụp ảnh màn hình
              và <strong>ấn vào link bên dưới</strong> để tham gia GA của chúng
              tôi!
            </p>
          </div>
          <input type="text" />
          <p className="thankyou-graph" style={{ textAlign: "left" }}>
            <strong>Link bài viết GA:</strong>{" "}
            <a href="https://www.facebook.com/share/p/XiKs4vPbddeELqaS/">
              https://www.facebook.com/share/p/XiKs4vPbddeELqaS/
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;
