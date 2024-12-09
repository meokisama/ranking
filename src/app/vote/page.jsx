"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ROUTES } from "@/constants";
import Footer from "@/components/common/footer";
import VoteHeader from "@/components/vote/vote-header";
import ListComponent from "@/components/vote/list-component";
import SendResult from "@/components/vote/send-result";
import StepBar from "@/components/vote/stepbar";
import PopupModal from "@/components/vote/popup-modal";
import Feedback from "@/components/vote/feedback";
import ThankYou from "@/components/vote/thankyou";
import ranobe from "./data/ranobe.json";
import publisher from "./data/publisher.json";
import ScrollToTop from "@/utils/ScrollToTop";
import ShortSplashScreen from "@/components/common/short-splash-screen";

function filterByIds(data, idsToInclude) {
  return data.filter((item) => idsToInclude.includes(item.id));
}

const sorted_favorite_rookie = filterByIds(
  ranobe,
  [2, 6, 13, 17, 19, 22, 24, 38, 39, 40, 41, 43, 47]
).sort((a, b) => a.seriesName.localeCompare(b.seriesName, "vi"));

const sorted_favorite_oneshot = filterByIds(
  ranobe,
  [
    17, 22, 38, 39, 40, 41, 43, 48, 51, 61, 65, 68, 69, 72, 75, 82, 83, 85, 92,
    95, 96, 105, 108, 113, 114, 118, 124, 131, 132, 133, 134, 136, 137, 138,
    139, 141, 142, 143, 145, 147, 148, 149, 152, 153, 155, 156, 157, 158, 160,
    161, 165, 167, 170, 171, 172, 174, 175, 176, 177, 181, 185, 186, 187, 188,
    190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 204, 205,
    206, 209, 210, 211, 213, 214, 215, 216, 217, 218,
  ]
).sort((a, b) => a.seriesName.localeCompare(b.seriesName, "vi"));

const sorted_favorite_ranobe = ranobe.sort((a, b) =>
  a.seriesName.localeCompare(b.seriesName, "vi")
);

function Vote() {
  const [thanks, setThanks] = useState(false);

  useEffect(() => {
    setThanks(localStorage.getItem("isVoteDone") === "true");
  }, []);

  const [currentComponent, setCurrentComponent] = useState(0);

  // Memoize initial state
  const initialSelectedItems = useMemo(
    () => [
      {
        category_name: "Light Novel được yêu thích nhất",
        category_short: "favoriteRanobe",
        chosenItems: [],
      },
      {
        category_name: "Oneshot được yêu thích nhất",
        category_short: "favoriteOneshot",
        chosenItems: [],
      },
      {
        category_name: "Nhà phát hành được yêu thích nhất",
        category_short: "favoritePublisher",
        chosenItems: [],
      },
      {
        category_name: "Light Novel tân binh của năm",
        category_short: "favoriteRookie",
        chosenItems: [],
      },
      {
        category_name: "Chia sẻ ý kiến và đề xuất",
        category_short: "feedback",
        chosenItems: [],
      },
    ],
    []
  );

  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);

  const handleChildSelection = useCallback(
    (category, title, selectedItemsFromChild) => {
      setSelectedItems((prevSelectedItems) => {
        const updatedSelectedItems = [...prevSelectedItems];
        const existingIndex = updatedSelectedItems.findIndex(
          (item) => item.category_short === category
        );

        if (existingIndex !== -1) {
          // Update existing item
          updatedSelectedItems[existingIndex] = {
            category_name: title,
            category_short: category,
            chosenItems: selectedItemsFromChild,
          };
        } else {
          // Add new item
          updatedSelectedItems.push({
            category_name: title,
            category_short: category,
            chosenItems: selectedItemsFromChild,
          });
        }

        return updatedSelectedItems;
      });
    },
    []
  );

  // useEffect(() => {
  //   console.log(selectedItems);
  // }, [selectedItems]);

  //Change category component
  const handleNext = () => {
    if (currentComponent < components.length - 1) {
      setCurrentComponent(currentComponent + 1);
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    if (currentComponent > 0) {
      setCurrentComponent(currentComponent - 1);
      scrollToTop();
    }
  };

  //onChange for Steps
  const onChange = (current) => {
    setCurrentComponent(current);
    scrollToTop();
  };

  const components = [
    <ListComponent
      id="1"
      key="1"
      title="Light Novel được yêu thích nhất"
      category="favoriteRanobe"
      listData={sorted_favorite_ranobe}
      description={
        <p>
          <em>
            &quot;Best of the best, ngôi đền văn học, nơi những xúc cảm tuyệt
            vời nhất thăng hoa.&quot;
          </em>{" "}
          Đó chính là hạng mục Light Novel được yêu thích nhất. Vẫn như mọi khi,{" "}
          <strong>10</strong> là con số tối đa các tác phẩm mà bạn được phép
          bình chọn. Hãy cân nhắc thật kỹ trước khi đưa ra quyết định cuối cùng!
        </p>
      }
      maxItems={10}
      notification="Chỉ được chọn tối đa 10 tác phẩm. Hãy thay đổi những lựa chọn trước đó nếu muốn chọn một tác phẩm khác!"
      onSelectionChange={handleChildSelection}
    />,
    <ListComponent
      id="2"
      key="2"
      title="Oneshot được yêu thích nhất"
      category="favoriteOneshot"
      listData={sorted_favorite_oneshot}
      description={
        <p>
          <em>
            &quot;Những tác phẩm ngắn gọn nhưng đầy cảm xúc, nơi từng câu chữ
            đều đọng lại trong tâm hồn người đọc.&quot;
          </em>{" "}
          Hạng mục Oneshot được yêu thích nhất chính là nơi vinh danh những câu
          chuyện ngắn nhưng để lại ấn tượng sâu sắc. Bạn sẽ chọn ai trong số
          những tuyệt tác chỉ cần một tập để chinh phục trái tim? Tối đa{" "}
          <strong>10</strong> phiếu lựa chọn bắt đầu!
        </p>
      }
      maxItems={10}
      notification="Chỉ được chọn tối đa 10 tác phẩm. Hãy thay đổi những lựa chọn trước đó nếu muốn chọn một tác phẩm khác!"
      onSelectionChange={handleChildSelection}
    />,
    <ListComponent
      id="3"
      key="3"
      title="Nhà phát hành được yêu thích nhất"
      category="favoritePublisher"
      listData={publisher}
      description={
        <p>
          <em>
            &quot;Người mang những giấc mơ đến gần hơn với bạn, những người giữ
            lửa cho cộng đồng Light Novel nước nhà.&quot;
          </em>{" "}
          Hạng mục này vinh danh các nhà phát hành – những người không chỉ đưa
          tác phẩm đến tận tay bạn đọc mà còn góp phần định hình cả cộng đồng.
          Đừng ngần ngại gửi lời cảm ơn với tối đa <strong>3</strong> phiếu bầu
          đầy trân trọng!
        </p>
      }
      maxItems={3}
      notification="Chỉ được chọn tối đa 3 NPH. Hãy thay đổi những lựa chọn trước đó nếu muốn chọn một NPH khác!"
      onSelectionChange={handleChildSelection}
    />,
    <ListComponent
      id="4"
      key="4"
      title="Light Novel tân binh của năm"
      category="favoriteRookie"
      listData={sorted_favorite_rookie}
      description={
        <p>
          <em>
            &quot;Ngọn gió mới thổi vào làng văn học, những cái tên đầy tiềm
            năng và sáng tạo.&quot;
          </em>{" "}
          Hạng mục Light Novel tân binh của năm là nơi cạnh tranh của các gương
          mặt mới vừa đặt bước chân đầu tiên vào thị trường trong năm nay. Ai sẽ
          là ngôi sao mới ấn tượng nhất? Hãy dành tối đa <strong>5</strong>{" "}
          phiếu bầu để khích lệ họ tiếp tục tỏa sáng!
        </p>
      }
      maxItems={5}
      notification="Chỉ được chọn tối đa 10 tác phẩm. Hãy thay đổi những lựa chọn trước đó nếu muốn chọn một tác phẩm khác!"
      onSelectionChange={handleChildSelection}
    />,
    <Feedback
      id="5"
      key="5"
      title="Chia sẻ ý kiến và đề xuất"
      category="feedback"
      description={
        <p>
          Nơi quý độc giả có thể <strong>tự do đóng góp</strong> ý kiến hay nhận
          xét về tác phẩm, nhà phát hành, dịch giả, series muốn có bản quyền
          hoặc bất kỳ vấn đề nào khác liên quan. Hãy cho chúng tôi biết bạn đang
          nghĩ gì!
        </p>
      }
      onSelectionChange={handleChildSelection}
    />,
    <SendResult key="6" result={selectedItems} />,
  ];

  const isLastComponent = currentComponent === components.length - 1;
  const isPenultimate = currentComponent === components.length - 2;

  //Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return thanks ? (
    <div>
      <ShortSplashScreen />
      <ThankYou />
    </div>
  ) : (
    <div>
      <ShortSplashScreen />
      <PopupModal />
      <div>
        <StepBar
          currentComponent={currentComponent}
          onChange={onChange}
          isLastComponent={isLastComponent}
          isPenultimate={isPenultimate}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
        />
        <VoteHeader />
        <div className="voteContainer">
          {components.map((component, index) => (
            <div
              key={index}
              style={{
                display: currentComponent === index ? "block" : "none",
              }}
            >
              {component}
            </div>
          ))}
          <ScrollToTop />
        </div>
        <Footer text="Trang Chủ" to={ROUTES.HOME} />
      </div>
    </div>
  );
}

export default Vote;
