export const SITE = {
  name: "Bảng Xếp Hạng Light Novel Việt Nam",
  short: "BXH LNVN",
  url: "https://bxh.lightnovel.vn",
  facebook: "https://www.facebook.com/vnlnr",
  since: 2018,
};

/** Kỳ đang hiển thị mặc định (khớp slug trong src/data/periods.json). */
export const CURRENT_PERIOD = "2-2024";

/** Thời gian mở bình chọn (giờ Việt Nam). Đổi 2 mốc này cho mỗi kỳ. */
export const VOTING = {
  start: "2024-12-14T20:00:00+07:00",
  end: "2024-12-24T23:30:00+07:00",
  /** Khoá localStorage đánh dấu đã bình chọn, đổi cho mỗi kỳ. */
  storageKey: "bxhlnvn:2-2024",
};

export type VotingState = "upcoming" | "open" | "closed";

export function votingState(now = new Date()): VotingState {
  if (now < new Date(VOTING.start)) return "upcoming";
  if (now > new Date(VOTING.end)) return "closed";
  return "open";
}

export type CategoryKey = "ranobe" | "oneshot" | "rookie" | "publisher" | "illustrator";

export const CATEGORIES: Record<
  CategoryKey,
  { label: string; short: string; jp: string; api: string; max: number; unit: string; blurb: string }
> = {
  ranobe: {
    label: "Light Novel được yêu thích nhất",
    short: "Light Novel",
    jp: "作品",
    api: "favoriteRanobe",
    max: 10,
    unit: "tác phẩm",
    blurb:
      "Best of the best: ngôi đền văn học, nơi những xúc cảm tuyệt vời nhất thăng hoa.",
  },
  oneshot: {
    label: "Oneshot được yêu thích nhất",
    short: "Oneshot",
    jp: "単巻",
    api: "favoriteOneshot",
    max: 5,
    unit: "tác phẩm",
    blurb:
      "Những tác phẩm chỉ cần một tập để chinh phục trái tim độc giả, nơi từng câu chữ đều đọng lại.",
  },
  rookie: {
    label: "Light Novel tân binh của năm",
    short: "Tân binh",
    jp: "新作",
    api: "favoriteRookie",
    max: 3,
    unit: "tác phẩm",
    blurb:
      "Ngọn gió mới thổi vào làng văn học, những gương mặt vừa đặt bước chân đầu tiên vào thị trường.",
  },
  publisher: {
    label: "Nhà phát hành được yêu thích nhất",
    short: "Nhà phát hành",
    jp: "出版社",
    api: "favoritePublisher",
    max: 3,
    unit: "nhà phát hành",
    blurb:
      "Người mang những giấc mơ đến gần hơn với bạn, những người giữ lửa cho cộng đồng Light Novel nước nhà.",
  },
  illustrator: {
    label: "Họa sĩ minh họa được yêu thích nhất",
    short: "Họa sĩ",
    jp: "絵師",
    api: "favoriteIllustrator",
    max: 5,
    unit: "họa sĩ",
    blurb: "Những nét vẽ thổi hồn vào từng trang sách, khiến nhân vật bước ra khỏi con chữ.",
  },
};
