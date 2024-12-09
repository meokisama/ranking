"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import "./styles/popup-modal.scss";

function PopupModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(showModal, 6000);
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

  return (
    <>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={[]}
        width={820}
        zIndex={479}
        destroyOnClose={true}
      >
        <div className="popup-modal">
          <div className="popup-banner">
            <div className="bannerimg">
              <img
                src="/popup_img.webp"
                alt="bxh light novel popup modal image"
              />
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
          <div className="popup-content">
            <p id="greeting">Quý độc giả thân mến,</p>
            <p>
              Sau đây là phần bình chọn chính thức cho{" "}
              <strong>Bảng Xếp Hạng Light Novel Việt Nam</strong>. Bảng xếp hạng
              kì này sẽ được chia làm những hạng mục sau:
            </p>
            <div className="split-categories">
              <span>
                <strong>1.</strong> Light Novel được yêu thích nhất <br />
                <strong>2.</strong> Oneshot được yêu thích nhất <br />
              </span>
              <span>
                <strong>3.</strong> Nhà phát hành được yêu thích nhất <br />
                <strong>4.</strong> Light Novel tân binh của năm <br />
              </span>
            </div>
            <p>
              Hãy bắt đầu khám phá và bình chọn cho những tác phẩm bạn yêu thích
              nhất. Ý kiến của bạn sẽ giúp tạo ra một bảng xếp hạng phản ánh
              chính xác sự đa dạng và sở thích của cộng đồng. Cảm ơn bạn đã tham
              gia và hãy sẵn sàng cho một cuộc hành trình đầy thú vị lần này!
              Trân trọng.
            </p>
            <span id="start-btn" onClick={handleOk}>
              BẮT ĐẦU
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default PopupModal;
