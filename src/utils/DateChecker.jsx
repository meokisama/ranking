import { NotificationHub } from "@/utils/Notification";

export default function DateChecker(notification) {
  return (event) => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 11, 14, 19, 57, 0, 0); // 14/12 19:57:00
    const endDate = new Date(today.getFullYear(), 11, 24, 23, 29, 59, 999); // 24/12 23:29:59.999

    if (today < startDate) {
      event.preventDefault();
      NotificationHub(
        notification,
        "Bình chọn chưa mở!",
        "Chưa tới thời gian bình chọn, vui lòng quay lại vào 20:00 ngày 14/12."
      );
    } else if (today > endDate) {
      event.preventDefault();
      NotificationHub(
        notification,
        "Đã khóa bình chọn!",
        "Thời gian bình chọn cho kỳ này đã kết thúc, tạm biệt và hiện chưa có kế hoạch cho kỳ tiếp theo."
      );
    }
  };
}
