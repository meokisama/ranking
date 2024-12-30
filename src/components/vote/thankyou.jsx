"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import "./styles/thankyou.scss";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, Empty } from "antd";
import { initialChosenItems } from "@/components/leaderboard/filter";

const cardTitleStyles = {
  fontFamily: "var(--font-lexend)",
  color: "rgb(0 0 0 /70%)",
  fontWeight: 400,
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

function ThankYou() {
  const [result, setResult] = useState(initialChosenItems());

  useEffect(() => {
    const updatedResult = result.map((item) => {
      const localStorageKey = `bxhlnvn_${item.category_short}`;

      if (item.category_short === "feedback") {
        const feedbackItem =
          JSON.parse(localStorage.getItem("bxhlnvn_feedback")) || {};
        const recommendItem =
          JSON.parse(localStorage.getItem("bxhlnvn_recommend")) || {};

        const feedback = {
          name: feedbackItem.name || "Ý kiến đánh giá",
          topic: feedbackItem.topic || "",
          content: feedbackItem.content || "",
        };

        const recommend = {
          name: recommendItem.name || "Đề xuất bản quyền",
          title: recommendItem.title || "",
          publisher: recommendItem.publisher || "",
        };

        return {
          ...item,
          chosenItems: [feedback, recommend],
        };
      }

      const chosenItems =
        JSON.parse(localStorage.getItem(localStorageKey)) || [];
      return {
        ...item,
        chosenItems,
      };
    });

    setResult(updatedResult);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="thankyou-wrapper">
      <div className="thankyou-title">
        <h1>Thank You</h1>
        <p className="subtitle">Xin cảm ơn!</p>
      </div>
      <div className="thankyou-content">
        <Image
          src="/thankyou-chibi.webp"
          alt="bxh light novel thankyou image"
          width={400}
          height={322}
          className="h-auto"
        />
        <div className="text-content">
          <div className="thankyou-graph">
            <p>
              Cảm ơn quý độc giả đã hoàn thành đợt bình chọn cho{" "}
              <strong>Bảng Xếp Hạng Light Novel Việt Nam</strong> lần này.
            </p>
            <p>
              Mỗi lá phiếu của các bạn không chỉ là sự ủng hộ, mà còn là một
              ngọn lửa nhiệt huyết thắp sáng con đường mỗi chúng ta đang bước
              đi, con đường hướng tới sự phát triển, tôn vinh giá trị văn học
              Light Novel và nét đẹp văn hóa đọc nước nhà. Tình yêu và sự tín
              nhiệm của các bạn là nguồn cảm hứng vô tận, khơi dậy trong chúng
              tôi lòng đam mê và khát vọng không ngừng để mang đến những sân
              chơi tuyệt vời, xứng đáng với niềm tin yêu của quý độc giả.
            </p>
            <p>
              Chúng tôi vô cùng biết ơn và mong rằng sẽ tiếp tục được đồng hành
              cùng các bạn trên hành trình văn chương đầy rực rỡ và thăng hoa
              phía trước. Trân trọng.
            </p>
            <p>
              Cuối cùng, bạn có thể <strong>xem lại bình chọn</strong> của mình
              bằng cách nhấn vào nút bên dưới.
            </p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <div className="footer-btn">
                <span>Xem lại</span>
              </div>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[825px] overflow-auto focus-visible:outline-none">
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <div className="vote-content">
                {result.map((resultItem, index) => (
                  <Card
                    key={index}
                    title={
                      <span style={cardTitleStyles}>
                        {index + 1 + ". " + resultItem.category_name}
                      </span>
                    }
                  >
                    {resultItem.category_short !== "favoritePublisher" &&
                    resultItem.category_short !== "feedback" &&
                    resultItem.category_short !== "favoriteIllustrator" ? (
                      resultItem.chosenItems.length !== 0 ? (
                        <div className="list-item">
                          {resultItem.chosenItems.map((ln, index) => (
                            <div key={index} className="result-item">
                              <div className="result-cover">
                                <Image
                                  alt="light novel cover"
                                  src={ln.coverUrl}
                                  width={150}
                                  height={203}
                                />
                              </div>
                              <div className="info">
                                <h4>{ln.seriesName}</h4>
                                <p>
                                  (<strong>{ln.publisherName}</strong> phát
                                  hành)
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty
                          description={
                            <span
                              style={{
                                fontFamily: "var(--font-lexend)",
                                fontWeight: 300,
                                color: "#636161e0",
                              }}
                            >
                              Bạn chưa bình chọn hạng mục này...
                            </span>
                          }
                        />
                      )
                    ) : resultItem.category_short === "feedback" ? (
                      <div className="feedback-result">
                        {resultItem.chosenItems[0] &&
                        resultItem.chosenItems[0].content ? (
                          <div className="feedback-item">
                            <h4>a. {resultItem.chosenItems[0].name}</h4>
                            <div className="feedback-content">
                              <p>
                                Chủ đề:{" "}
                                {resultItem.chosenItems[0].topic ? (
                                  <strong>
                                    {resultItem.chosenItems[0].topic}
                                  </strong>
                                ) : (
                                  <strong>Không có</strong>
                                )}
                              </p>
                              <div>
                                Nội dung: <br />
                                <p className="topic-content">
                                  {resultItem.chosenItems[0].content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p style={{ fontWeight: 300, color: "#636161e0" }}>
                            Hiện tại bạn không chia sẻ ý kiến nào.
                          </p>
                        )}
                        {resultItem.chosenItems[1] &&
                        resultItem.chosenItems[1].title ? (
                          <div className="recommend-item">
                            <h4>b. {resultItem.chosenItems[1].name}</h4>
                            <div className="recommend-content">
                              <p>
                                Tác phẩm đề xuất:{" "}
                                <strong>
                                  {resultItem.chosenItems[1].title}
                                </strong>
                              </p>
                              <p>
                                {resultItem.chosenItems[1].publisher ? (
                                  <>
                                    Mong muốn{" "}
                                    <strong>
                                      {resultItem.chosenItems[1].publisher}
                                    </strong>{" "}
                                    phát hành
                                  </>
                                ) : (
                                  <>
                                    Nhà phát hành mong muốn:{" "}
                                    <strong>Không có</strong>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p style={{ fontWeight: 300, color: "#636161e0" }}>
                            Hiện tại bạn không đề xuất tác phẩm nào.
                          </p>
                        )}
                      </div>
                    ) : resultItem.category_short === "favoriteIllustrator" ? (
                      <div className="result-illustrator">
                        {resultItem.chosenItems.length !== 0 ? (
                          <div className="result-illustrator-container">
                            {resultItem.chosenItems.map((item, index) => (
                              <div
                                className="result-illustrator-item"
                                key={index}
                              >
                                <strong>({index + 1})</strong>
                                <span key={index}>「{item.name}」</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Empty
                            description={
                              <span
                                style={{
                                  fontFamily: "var(--font-lexend)",
                                  fontWeight: 300,
                                  color: "#636161e0",
                                }}
                              >
                                Bạn chưa bình chọn hạng mục này...
                              </span>
                            }
                          />
                        )}
                      </div>
                    ) : resultItem.chosenItems.length !== 0 ? (
                      <div className="result-publisher-wrapper">
                        {resultItem.chosenItems.map((item, index) => (
                          <div
                            className={`result-publisher ${item.publisherLogo}`}
                            key={index}
                          >
                            <Image
                              src={`/images/publisher/${item.publisherLogo}.webp`}
                              alt="light novel publisher logo"
                              width={130}
                              height={130}
                              className="h-auto"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Empty
                        description={
                          <span
                            style={{
                              fontFamily: "var(--font-lexend)",
                              fontWeight: 300,
                              color: "#636161e0",
                            }}
                          >
                            Bạn chưa bình chọn hạng mục này...
                          </span>
                        }
                      />
                    )}
                  </Card>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;
