import "./Media.scss";
import SectionTitle from "../SectionTitle";
import { COLLAB_PAGES } from "@/constants";

function Media() {
  return (
    <div className="wrapper media">
      <SectionTitle
        title="Truyền Thông"
        description="Các bên hỗ trợ truyền thông cho bảng xếp hạng!"
      />
      <div className="mediaContent">
        {COLLAB_PAGES.map((media, index) => (
          <div
            key={index}
            className={`mediaItem ${
              index % 2 == 0 ? "mediaItemLeft" : "mediaItemRight"
            }`}
          >
            <div className="mediaAvatar">
              <img
                onClick={() => window.open(media.url, "_blank")}
                alt=""
                src={media.avatar}
              />
            </div>
            <div className="mediaInfo">
              <span className="username">@{media.username}</span>
              <span className="fullName">{media.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Media;
