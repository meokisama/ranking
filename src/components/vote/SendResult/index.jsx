"use client";
import { useEffect, useState, useRef } from "react";
import { Card, Empty } from "antd";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import "./SendResult.scss";
import Category from "../Category";
import { MessageHub } from "@/components/common";
import Image from "next/image";

const cardTitleStyles = {
  fontFamily: "Lexend",
  color: "rgb(0 0 0 /70%)",
  fontWeight: 400,
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

function SendResult({ result }) {
  //Captcha
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [token, setToken] = useState(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const isVoteDone = localStorage.getItem("isVoteDone") === "true";
    setDone(isVoteDone);
  }, []);
  const captchaRef = useRef(null);

  const onVerify = (token) => {
    setCaptchaVerified(true);
    setToken(token);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const resultToSend = result.reduce((data, item) => {
      data[item.category_short] = item.chosenItems;
      return data;
    }, {});

    const extractIds = (data) => {
      const newData = {};
      for (const key in data) {
        if (data.hasOwnProperty(key) && key !== "feedback") {
          newData[key] = data[key].map((item) => item.id);
        }
      }
      return newData;
    };

    const finalResult = extractIds(resultToSend);

    finalResult.feedback = {
      topic: resultToSend.feedback[0].topic,
      content: resultToSend.feedback[0].content,
      title: resultToSend.feedback[1].title,
      publisher: resultToSend.feedback[1].publisher,
    };

    const allNotEmpty = Object.keys(finalResult).every((key) => {
      if (key === "feedback") return true;
      return Array.isArray(finalResult[key]) && finalResult[key].length > 0;
    });

    captchaVerified
      ? allNotEmpty
        ? fetch(process.env.NEXT_PUBLIC_SEND_VOTE, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...finalResult,
              token: token,
            }),
          })
            .then(async (response) => {
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Lỗi khi gửi yêu cầu!");
              }
              return response.json();
            })
            .then((data) => {
              //   console.log(data);
              if (data.message === "created") {
                setDone(true);
              }
            })
            .catch((error) => {
              //   console.error('Error:', error);
              if (error.message === "rateLimit") {
                alertRef.current(
                  "Bạn đã bình chọn trước đó! Mỗi địa chỉ IP chỉ có một cơ hội."
                );
              } else if (error.message === "invalidCaptcha") {
                alertRef.current("Captcha không hợp lệ!");
              } else {
                alertRef.current("Lỗi khi gửi yêu cầu!");
              }
            })
        : alertRef.current(
            "Bạn chưa hoàn thành hết các hạng mục bình chọn bắt buộc!"
          )
      : alertRef.current("Vui lòng xác minh captcha trước khi gửi!");
  };

  const alertRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("isVoteDone", JSON.stringify(done));
  }, [done]);

  return (
    <div className="result-container">
      <Category
        title="Xác nhận và Gửi bình chọn"
        description={
          <p>
            Dưới đây là phần tóm tắt các lựa chọn mà bạn đã chọn trước đó. Vui
            lòng kiểm tra kỹ thông tin và xác nhận lại trước khi gửi bình chọn
            cuối cùng cho chúng tôi. Xin cảm ơn!
          </p>
        }
      />
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
                          (<strong>{ln.publisherName}</strong> phát hành)
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
                        fontFamily: "Lexend",
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
                          <strong>{resultItem.chosenItems[0].topic}</strong>
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
                        <strong>{resultItem.chosenItems[1].title}</strong>
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
                            Nhà phát hành mong muốn: <strong>Không có</strong>
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
                      <div className="result-illustrator-item" key={index}>
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
                          fontFamily: "Lexend",
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
                    <img
                      src={`images/publisher/${item.publisherLogo}.webp`}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                description={
                  <span
                    style={{
                      fontFamily: "Lexend",
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

        <div className="captcha">
          {!done ? (
            <form onSubmit={handleSubmit}>
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY}
                // sitekey="10000000-ffff-ffff-ffff-000000000001"
                onVerify={onVerify}
                ref={captchaRef}
              />
              <div className="btn-container">
                <button type="submit">Gửi Bình Chọn</button>
              </div>
            </form>
          ) : (
            <div className="show-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3>Bình chọn đã được ghi nhận!</h3>
              <p>
                Cảm ơn bạn đã tham gia bình chọn cho bảng xếp hạng lần này.
                Chúng tôi sẽ tổng hợp các lượt bình chọn và công bố kết quả của
                bảng xếp hạng trong thời gian sớm nhất!
              </p>
            </div>
          )}
        </div>
      </div>
      <MessageHub>{(msg) => (alertRef.current = msg)}</MessageHub>
    </div>
  );
}

export default SendResult;
