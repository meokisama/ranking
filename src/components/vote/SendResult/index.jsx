"use client";
import { useEffect, useState, useRef } from "react";
import { Card, Empty, Select } from "antd";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import "./SendResult.scss";
import Category from "../Category";
import Image from "next/image";
import { NotificationHub, useNotification } from "@/utils/Notification";
import { InputNumber } from "antd";

const cardTitleStyles = {
  fontFamily: "var(--font-lexend)",
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
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(null);

  useEffect(() => {
    setGender(JSON.parse(localStorage.getItem("bxhlnvn_gender")) ?? null);
    setAge(JSON.parse(localStorage.getItem("bxhlnvn_age")) ?? null);
  }, []);

  useEffect(() => {
    const isVoteDone = localStorage.getItem("isVoteDone") === "true";
    setDone(isVoteDone);
  }, []);
  const captchaRef = useRef(null);

  const onVerify = (token) => {
    setCaptchaVerified(true);
    setToken(token);
  };

  const noti = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate gender and age
    if (!gender) {
      NotificationHub(
        noti,
        "Thiếu thông tin!",
        "Vui lòng chọn giới tính của bạn."
      );
      return;
    }

    if (!age) {
      NotificationHub(noti, "Thiếu thông tin!", "Vui lòng nhập tuổi của bạn.");
      return;
    }

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

    // Add gender and age to finalResult
    finalResult.userInfo = {
      gender: gender,
      age: age,
    };

    const allNotEmpty = Object.keys(finalResult).every((key) => {
      if (key === "feedback") return true;
      return Array.isArray(finalResult[key]) && finalResult[key].length > 0;
    });

    // console.log(JSON.stringify(finalResult));

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
                NotificationHub(
                  noti,
                  "Bình chọn đã bị chặn!",
                  "Bạn đã bình chọn trước đó! Mỗi địa chỉ IP chỉ có một cơ hội."
                );
              } else if (error.message === "invalidCaptcha") {
                NotificationHub(
                  noti,
                  "Captcha không hợp lệ!",
                  "Captcha xác minh không hợp lệ, có thể tải lại trang nếu cần."
                );
              } else {
                NotificationHub(noti, "Lỗi!", "Lỗi khi gửi yêu cầu!");
              }
            })
        : NotificationHub(
            noti,
            "Chưa hoàn thành bình chọn!",
            "Bạn chưa hoàn thành hết các hạng mục bình chọn bắt buộc!"
          )
      : NotificationHub(
          noti,
          "Xác minh captcha!",
          "Vui lòng xác minh captcha trước khi gửi!"
        );
  };

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
                    <img
                      src={`images/publisher/${item.publisherLogo}.webp`}
                      alt="light novel publisher logo"
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

        <Card
          title={
            <span style={cardTitleStyles}>Thông tin người bình chọn (*)</span>
          }
        >
          <div
            style={{
              fontFamily: "var(--font-lexend)",
              fontWeight: 300,
              color: "#636161e0",
            }}
          >
            <p>
              Từ kỳ bình chọn lần này, chúng tôi sẽ thu thập thêm thông tin về
              giới tính và độ tuổi của các bạn. Điều này không chỉ giúp chúng
              tôi hiểu rõ hơn về những nhóm độc giả yêu thích light novel, mà
              còn mở ra cơ hội phân tích sâu sắc hơn về xu hướng và sự thay đổi
              trong thị hiếu của từng đối tượng.
            </p>
            <p>
              Với mục tiêu phản ánh chân thực nhất bức tranh sở thích của cộng
              đồng, chúng tôi hy vọng rằng những dữ liệu này sẽ là nền tảng để
              xây dựng một thế giới light novel ngày càng phong phú và gần gũi
              hơn với từng độc giả.
            </p>
          </div>
          <div className="flex flex-row mt-16">
            <Select
              // defaultValue="male"
              placeholder="Giới tính"
              style={{
                width: 120,
                marginRight: 10,
              }}
              onChange={(value) => {
                setGender(value);
                localStorage.setItem("bxhlnvn_gender", JSON.stringify(value));
              }}
              options={[
                {
                  value: "male",
                  label: "Nam",
                },
                {
                  value: "female",
                  label: "Nữ",
                },
              ]}
              value={gender}
            />
            <InputNumber
              min={5}
              max={100}
              onChange={(value) => {
                setAge(value);
                localStorage.setItem("bxhlnvn_age", JSON.stringify(value));
              }}
              addonBefore={
                <span
                  style={{
                    fontFamily: "var(--font-lexend) !important",
                    color: "#636161e0",
                  }}
                >
                  Tuổi
                </span>
              }
              value={age}
            />
          </div>
        </Card>

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
    </div>
  );
}

export default SendResult;
