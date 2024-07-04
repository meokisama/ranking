import { useEffect, useRef } from "react";
import { MessageHub } from "@/components/common";

function DateChecker({ ids }) {
  const alertRef = useRef(null);

  useEffect(() => {
    const handleVoteClick = (event) => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), 5, 15); // 15/06
      startDate.setHours(19, 57, 0, 0); // Set to 20:00:00.000

      const endDate = new Date(today.getFullYear(), 5, 25); // 25/06
      endDate.setHours(23, 29, 59, 999); // Optionally set to end of the day

      if (today < startDate) {
        event.preventDefault();
        alertRef.current(
          "Chưa tới thời gian bình chọn, vui lòng quay lại vào 20:00 ngày 15/06."
        );
      } else if (today > endDate) {
        event.preventDefault();
        alertRef.current(
          "Thời gian bình chọn kì này đã kết thúc vào ngày 25/06."
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

  return <MessageHub>{(msg) => (alertRef.current = msg)}</MessageHub>;
}

export default DateChecker;
