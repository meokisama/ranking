import { NotificationHub } from "@/utils/Notification";
import { VOTING_START_TIME, VOTING_END_TIME } from "@/utils/date-config";

export default function DateChecker(notification: any) {
  return (event: any) => {
    const today = new Date();

    const formattedStartTime = `${VOTING_START_TIME.getDate()}/${
      VOTING_START_TIME.getMonth() + 1
    }`;

    if (today < VOTING_START_TIME) {
      event.preventDefault();
      NotificationHub(
        notification,
        "Bình chọn chưa mở!",
        `Chưa tới thời gian bình chọn, vui lòng quay lại vào 20:00 ngày ${formattedStartTime}.`
      );
    } else if (today > VOTING_END_TIME) {
      event.preventDefault();
      NotificationHub(
        notification,
        "Đã khóa bình chọn!",
        "Thời gian bình chọn cho kỳ này đã kết thúc, tạm biệt và hiện chưa có kế hoạch cho kỳ tiếp theo."
      );
    }
  };
}
