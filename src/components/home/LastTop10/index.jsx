import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import "./LastTop10.scss";
import { TOP10 } from "@/constants";

function LastTop10() {
  return (
    <div className="last-top10">
      <div className="top10-header">
        <h1>
          <span>Bảng Xếp Hạng</span>
        </h1>
        <p>
          Vinh danh 10 series được bình chọn nhiều nhất cho bảng xếp hạng đợt
          gần nhất, <strong>nửa cuối năm 2023!</strong>
        </p>
      </div>
      <div className="top10-series">
        <div className="container">
          <Swiper
            slidesPerView={4}
            spaceBetween={0}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination]}
            breakpoints={{
              800: {
                slidesPerView: 4,
              },
              0: {
                slidesPerView: 3,
              },
            }}
            className="mySwiper"
          >
            {TOP10.map((panel, index) => (
              <SwiperSlide key={index}>
                <div className="panel">
                  <div className="panel-rank">
                    {panel.rank.includes("png") ? (
                      <img alt="" src={panel.rank} />
                    ) : (
                      <span>{panel.rank}</span>
                    )}
                  </div>
                  <img className="panel-cover" alt="" src={panel.src} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default LastTop10;
