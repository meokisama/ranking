"use client";
import { useEffect } from "react";
import {
  NotificationHub,
  useNotification,
} from "@/components/common/Notification";

function DateChecker({ ids }) {
  const notificaion = useNotification();
  useEffect(() => {
    const handleVoteClick = (event) => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), 5, 15); // 15/06
      startDate.setHours(19, 57, 0, 0); // Set to 20:00:00.000

      const endDate = new Date(today.getFullYear(), 5, 25); // 25/06
      endDate.setHours(23, 29, 59, 999); // Optionally set to end of the day

      if (today < startDate) {
        event.preventDefault();
        NotificationHub(
          notificaion,
          "Bình chọn chưa mở!",
          "Chưa tới thời gian bình chọn, vui lòng quay lại vào 20:00 ngày 15/06."
        );
      } else if (today > endDate) {
        event.preventDefault();
        NotificationHub(
          notificaion,
          "Đã khóa bình chọn!",
          "Thời gian bình chọn cho kì này đã kết thúc. Hẹn gặp lại quý độc giả vào kì tiếp theo (14/12/2024)."
        );
      }
    };

    ids.forEach((id) => {
      const voteBtn = document.getElementById(id);
      if (voteBtn) {
        voteBtn.addEventListener("click", handleVoteClick);
      }
    });

    return () => {
      ids.forEach((id) => {
        const voteBtn = document.getElementById(id);
        if (voteBtn) {
          voteBtn.removeEventListener("click", handleVoteClick);
        }
      });
    };
  }, [ids]);

  return <></>;
}

export default DateChecker;
