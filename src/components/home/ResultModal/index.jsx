import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Modal } from "antd";
import { ROUTES } from "@/constants";
import "./ResultModal.scss";

function ResultModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(showModal, 4000);
    return () => clearTimeout(timer);
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={[]}
        width={isMobile ? 500 : 800}
        zIndex={479}
        destroyOnClose={true}
      >
        <div className="result-modal">
          <div className="result-banner">
            <div className="bannerimg">
              <img src="/bannerimg.webp" alt="" />
            </div>
            <div className="bannertext">
              <h1>
                <span id="bannertext01">Bảng Xếp Hạng </span>
                <br />
                <span id="bannertext02"> Light Novel</span>
                <br />
                <span id="bannertext03"> Việt Nam</span>
              </h1>
            </div>
          </div>
          <div className="result-content">
            <p id="greeting">Quý độc giả thân mến,</p>
            <p>
              Chúng tôi xin trân trọng thông báo rằng quá trình bình chọn cho{" "}
              <strong>Bảng Xếp Hạng Light Novel Việt Nam</strong> đã kết thúc và
              kết quả chính thức đã được công bố! Vui lòng ấn vào nút{" "}
              <strong style={{ color: "#fa7667" }}>Xem kết quả</strong> bên dưới
              để xem danh sách đầy đủ kết quả cho các hạng mục bình chọn.
            </p>
            <p>
              Một lần nữa xin được cảm ơn sự tham gia nhiệt tình từ quý độc giả
              dành cho bảng xếp hạng lần này và chúng tôi hy vọng cộng đồng sẽ
              tiếp tục ủng hộ bảng xếp hạng cũng như thưởng thức những tác phẩm
              light novel tuyệt vời tiếp theo trong tương lai. Trân trọng.
            </p>
            <Link href={ROUTES.LEADERBOARD} target="_blank">
              <span>XEM KẾT QUẢ</span>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ResultModal;
