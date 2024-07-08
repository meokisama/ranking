import { NotificationHub } from "@/components/common/Notification";

export default function DateChecker(notification) {
  return (event) => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 5, 15, 19, 57, 0, 0); // 15/06 19:57:00
    const endDate = new Date(today.getFullYear(), 5, 25, 23, 29, 59, 999); // 25/06 23:29:59.999

    if (today < startDate) {
      event.preventDefault();
      NotificationHub(
        notification,
        "Bình chọn chưa mở!",
        "Chưa tới thời gian bình chọn, vui lòng quay lại vào 20:00 ngày 15/06."
      );
    } else if (today > endDate) {
      event.preventDefault();
      NotificationHub(
        notification,
        "Đã khóa bình chọn!",
        "Thời gian bình chọn cho kỳ này đã kết thúc, hẹn gặp lại quý độc giả vào kỳ tiếp theo (14/12/2024)."
      );
    }
  };
}
