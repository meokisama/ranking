"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import "./Comment.scss";
import { COMMENTS } from "@/constants";
import SectionTitle from "../SectionTitle";

function Comment() {
  return (
    <div className="comment">
      <SectionTitle
        title={"Bình Luận"}
        description={"Phần bình luận từ các bên được phỏng vấn."}
      />
      <div className="commentContent">
        <Swiper
          direction={"vertical"}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            600: {
              direction: "vertical",
            },
            0: {
              direction: "horizontal",
            },
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
        >
          {COMMENTS.map((comment, index) => (
            <SwiperSlide key={index}>
              <div className="slideContent">
                <div className="avatar">
                  <Image
                    className="avatarMain"
                    alt="avatar page"
                    src={comment.avatar}
                    width={94}
                    height={94}
                  />
                  <p>@{comment.username}</p>
                </div>
                <p className="content">{comment.content}</p>
                <span>
                  ━ <span className="author">{comment.author}</span> ━
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="commentImg">
          <Image
            alt="banner makeine"
            src="/makein2.webp"
            width={600}
            height={790}
          />
        </div>
      </div>
    </div>
  );
}

export default Comment;
