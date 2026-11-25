export const SITE = {
  name: "Bảng Xếp Hạng Light Novel Việt Nam",
  short: "BXH LNVN",
  url: "https://bxh.lightnovel.vn",
  facebook: "https://www.facebook.com/vnlnr",
  since: 2018,
};

/** Period shown by default (matches a slug in src/data/periods.json). */
export const CURRENT_PERIOD = "2025";

/** Voting window (Vietnam time). Change both for each period. */
export const VOTING = {
  start: "2024-12-14T20:00:00+07:00",
  end: "2024-12-24T23:30:00+07:00",
  /** localStorage key marking that the visitor has voted; change it for each period. */
  storageKey: "bxhlnvn:2-2024",
};

export type VotingState = "upcoming" | "open" | "closed";

export function votingState(now = new Date()): VotingState {
  if (now < new Date(VOTING.start)) return "upcoming";
  if (now > new Date(VOTING.end)) return "closed";
  return "open";
}

export type CategoryKey = "ranobe" | "oneshot" | "rookie" | "publisher" | "illustrator" | "era";

export const CATEGORIES: Record<
  CategoryKey,
  { label: string; short: string; api: string; max: number; unit: string; blurb: string }
> = {
  ranobe: {
    label: "Light Novel được yêu thích nhất",
    short: "Light Novel",
    api: "favoriteRanobe",
    max: 10,
    unit: "tác phẩm",
    blurb:
      "Best of the best: ngôi đền văn học, nơi những xúc cảm tuyệt vời nhất thăng hoa.",
  },
  oneshot: {
    label: "Oneshot được yêu thích nhất",
    short: "Oneshot",
    api: "favoriteOneshot",
    max: 5,
    unit: "tác phẩm",
    blurb:
      "Những tác phẩm chỉ cần một tập để chinh phục trái tim độc giả, nơi từng câu chữ đều đọng lại.",
  },
  rookie: {
    label: "Light Novel tân binh của năm",
    short: "Tân binh",
    api: "favoriteRookie",
    max: 3,
    unit: "tác phẩm",
    blurb:
      "Ngọn gió mới thổi vào làng văn học, những gương mặt vừa đặt bước chân đầu tiên vào thị trường.",
  },
  publisher: {
    label: "Nhà phát hành được yêu thích nhất",
    short: "Nhà phát hành",
    api: "favoritePublisher",
    max: 3,
    unit: "nhà phát hành",
    blurb:
      "Người mang những giấc mơ đến gần hơn với bạn, những người giữ lửa cho cộng đồng Light Novel nước nhà.",
  },
  illustrator: {
    label: "Họa sĩ minh họa được yêu thích nhất",
    short: "Họa sĩ",
    api: "favoriteIllustrator",
    max: 5,
    unit: "họa sĩ",
    blurb: "Những nét vẽ thổi hồn vào từng trang sách, khiến nhân vật bước ra khỏi con chữ.",
  },
  era: {
    label: "End of an Era",
    short: "End of an Era",
    api: "endOfAnEra",
    max: 1,
    unit: "tác phẩm",
    blurb: "Tác phẩm đã định hình cả một thế hệ độc giả Light Novel Việt Nam.",
  },
};
