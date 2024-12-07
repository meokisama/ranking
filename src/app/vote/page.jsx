"use client";
import { useState, useEffect } from "react";
import { ROUTES } from "@/constants";
import { Footer } from "@/components/common";
import {
  VoteHeader,
  ListComponent,
  SendResult,
  StepBar,
  PopupModal,
  Feedback,
  ThankYou,
} from "@/components/vote";
import { ranobe, favoritePublisher } from "./List";
import ScrollToTop from "@/utils/ScrollToTop";

function filterByIds(data, idsToInclude) {
  return data.filter((item) => idsToInclude.includes(item.id));
}

const sorted_favorite_rookie = filterByIds(
  ranobe,
  [219, 218, 217, 216, 215, 214, 213, 212, 211, 209, 208, 207, 206]
).sort((a, b) => a.seriesName.localeCompare(b.seriesName, "vi"));

const sorted_favorite_oneshot = filterByIds(
  ranobe,
  [
    218, 216, 212, 211, 210, 208, 207, 206, 202, 199, 196, 195, 194, 192, 190,
    188, 185, 184, 180, 179, 178, 166, 164, 159, 157, 155, 151, 139, 136, 135,
    134, 133, 132, 131, 126, 125, 124, 122, 119, 114, 113, 112, 110, 107, 105,
    101, 100, 98, 97, 95, 94, 93, 90, 88, 84, 83, 80, 79, 78, 74, 72, 69, 68,
    67, 65, 59, 58, 57, 55, 54, 47, 44, 43, 40, 39, 38, 31, 27, 26, 21, 18, 16,
    14, 12, 10, 9, 7, 5,
  ]
).sort((a, b) => a.seriesName.localeCompare(b.seriesName, "vi"));

const sorted_favorite_ranobe = filterByIds(
  ranobe,
  [
    1, 2, 3, 4, 6, 8, 11, 13, 15, 17, 19, 20, 22, 23, 24, 25, 28, 29, 30, 32,
    33, 34, 35, 36, 37, 41, 42, 45, 46, 48, 49, 50, 51, 52, 53, 56, 60, 61, 62,
    63, 64, 66, 70, 71, 73, 75, 76, 77, 81, 82, 85, 86, 87, 89, 91, 92, 96, 99,
    102, 103, 104, 106, 108, 109, 111, 115, 116, 117, 118, 120, 121, 123, 127,
    128, 129, 130, 137, 138, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149,
    150, 152, 153, 154, 156, 158, 160, 161, 162, 163, 165, 167, 168, 169, 170,
    171, 172, 173, 174, 175, 176, 177, 181, 182, 183, 186, 187, 189, 191, 193,
    197, 198, 200, 201, 203, 204, 205, 209, 213, 214, 215, 217, 219,
  ]
).sort((a, b) => a.seriesName.localeCompare(b.seriesName, "vi"));

function Vote() {
  const [thanks, setThanks] = useState(false);
  useEffect(() => {
    setThanks(localStorage.getItem("isVoteDone") === "true" ? true : false);
  }, []);

  const [currentComponent, setCurrentComponent] = useState(0);

  //Get selected items from each category
  const [selectedItems, setSelectedItems] = useState([
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
  ]);
  const handleChildSelection = (category, title, selectedItemsFromChild) => {
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
  };

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
          Best of the best, ngôi đền văn học, nơi những xúc cảm tuyệt vời nhất
          thăng hoa. Đó chính là hạng mục Light Novel được ưa thích nhất. Vẫn
          như mọi khi, <strong>10</strong> chính là con số tối đa các tác phẩm
          mà bạn được bình chọn, hãy suy nghĩ khôn ngoan trước khi đưa ra lựa
          chọn cuối cùng!
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
          Best of the best, ngôi đền văn học, nơi những xúc cảm tuyệt vời nhất
          thăng hoa. Đó chính là hạng mục Light Novel được ưa thích nhất. Vẫn
          như mọi khi, <strong>10</strong> chính là con số tối đa các tác phẩm
          mà bạn được bình chọn, hãy suy nghĩ khôn ngoan trước khi đưa ra lựa
          chọn cuối cùng!
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
      listData={favoritePublisher}
      description={
        <p>
          Bày tỏ tình cảm và tri ân dành cho các đơn vị xuất bản đã mang đến
          những bộ Light Novel tuyệt vời cho cộng đồng. Con số tối đa được chọn
          là <strong>3 nhà phát hành</strong> trong một lần bình chọn.
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
          Best of the best, ngôi đền văn học, nơi những xúc cảm tuyệt vời nhất
          thăng hoa. Đó chính là hạng mục Light Novel được ưa thích nhất. Vẫn
          như mọi khi, <strong>10</strong> chính là con số tối đa các tác phẩm
          mà bạn được bình chọn, hãy suy nghĩ khôn ngoan trước khi đưa ra lựa
          chọn cuối cùng!
        </p>
      }
      maxItems={10}
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
    <ThankYou />
  ) : (
    <div>
      {/* <SplashScreen /> */}
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
