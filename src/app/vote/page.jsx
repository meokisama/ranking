"use client";
import { useState, useEffect } from "react";
import { ROUTES } from "@/constants";
import { Footer, ScrollToTop, SplashScreen } from "@/components/common";
import {
  VoteHeader,
  ListComponent,
  SendResult,
  StepBar,
  PopupModal,
  Feedback,
  Illustrator,
  ThankYou,
} from "@/components/vote";
import { favoriteRanobe, favoriteIllustrator, favoritePublisher } from "./List";

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
      category_name: "Họa sĩ minh họa được yêu thích nhất",
      category_short: "favoriteIllustrator",
      chosenItems: [],
    },
    {
      category_name: "Nhà phát hành được yêu thích nhất",
      category_short: "favoritePublisher",
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
      title="Light Novel được yêu thích nhất"
      category="favoriteRanobe"
      listData={favoriteRanobe.sort((a, b) =>
        a.seriesName.localeCompare(b.seriesName, "vi")
      )}
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
    <Illustrator
      id="2"
      title="Họa sĩ minh họa được yêu thích nhất"
      category="favoriteIllustrator"
      listData={favoriteIllustrator.sort((a, b) =>
        a.name.localeCompare(b.name, "vi")
      )}
      description={
        <p>
          Một hạng mục mới với BXH Light Novel được ưa thích nhất nơi chúng ta
          tôn vinh những họa sĩ đã để lại ấn tượng nhiều nhất, khiến chúng ta
          mlem mỗi khi đọc Light Novel và là 99% lý do các bạn quan tâm cái bộ
          truyện đấy. Số lượng lựa chọn ở đây tối đa là{" "}
          <strong>10 họa sĩ</strong>.
        </p>
      }
      maxItems={10}
      notification="Chỉ được chọn tối đa 10 họa sĩ. Hãy thay đổi những lựa chọn trước đó nếu muốn chọn một họa sĩ khác!"
      onSelectionChange={handleChildSelection}
    />,
    <ListComponent
      id="3"
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
    <Feedback
      id="4"
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
    <SendResult result={selectedItems} />,
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
      <SplashScreen />
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
