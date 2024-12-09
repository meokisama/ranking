"use client";
import Link from "next/link";
import { ROUTES, TIMELINE } from "@/constants";

const timelineItem = TIMELINE.map((item) => ({
  color: "salmon",
  children: (
    <div className={`tlref timeline-item-${item.position}`}>
      <div className="index">
        <img alt="bxh light novel timeline chibi" src={item.index} />
      </div>
      <div className="detail">
        <span className="date">{item.date}</span>
        <p className="des">{item.description}</p>
        {item.optional && (
          <div>
            <Link
              className="detail-optional"
              id="timeline-vote"
              href={ROUTES.VOTE}
              target="_blank"
            >
              <p>Bình Chọn ngay cho tác phẩm yêu thích !!</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  ),
}));

export default timelineItem;
