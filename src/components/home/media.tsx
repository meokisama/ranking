import "./styles/media.scss";
import SectionTitle from "./section-title";
import { COLLAB_PAGES } from "@/constants";
import Link from "next/link";
import Image from "next/image";

function Media() {
  return (
    <div className="wrapper media">
      <SectionTitle
        title="Truyền Thông"
        description="Các bên hỗ trợ truyền thông cho bảng xếp hạng!"
      />
      <div className="media-content">
        {COLLAB_PAGES.map((media, index) => (
          <div
            key={index}
            className={`mediaItem ${
              index % 2 == 0 ? "media-item-left" : "mediaItem-right"
            }`}
          >
            <div className="media-avatar">
              <Link href={media.url} target="_blank">
                <Image
                  alt="bxh light novel fanpage avatar"
                  src={media.avatar}
                  width={94}
                  height={94}
                />
              </Link>
            </div>
            <div className="media-info">
              <span className="username">@{media.username}</span>
              <span className="full-name">{media.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Media;
