import { NotificationHub } from "@/utils/Notification";
import { VOTING_START_TIME, VOTING_END_TIME } from "@/utils/date-config";

export default function DateChecker(notification: any) {
  return (event: any) => {
    const today = new Date();

    const formattedStartTime = `${VOTING_START_TIME.getHours()
      .toString()
      .padStart(2, "0")}:${VOTING_START_TIME.getMinutes()
      .toString()
      .padStart(2, "0")} ngày ${VOTING_START_TIME.getDate()}/${
      VOTING_START_TIME.getMonth() + 1
    }`;

    const formattedEndTime = `${VOTING_END_TIME.getHours()
      .toString()
      .padStart(2, "0")}:${VOTING_END_TIME.getMinutes()
      .toString()
      .padStart(2, "0")} ngày ${VOTING_END_TIME.getDate()}/${
      VOTING_END_TIME.getMonth() + 1
    }`;

    if (today < VOTING_START_TIME) {
      event.preventDefault();
      NotificationHub(
        notification,
        "Bình chọn chưa mở!",
        `Chưa tới thời gian bình chọn, vui lòng quay lại vào ${formattedStartTime}.`
      );
    } else if (today > VOTING_END_TIME) {
      event.preventDefault();
      NotificationHub(
        notification,
        "Đã khóa bình chọn!",
        `Thời gian bình chọn cho kỳ này đã kết thúc vào ${formattedEndTime}, hẹn gặp lại vào kỳ tiếp theo.`
      );
    }
  };
}
