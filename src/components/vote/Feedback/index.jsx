import { useState, useEffect } from "react";
import { Divider, Input, Checkbox } from "antd";
import Category from "../Category";
import "./Feedback.scss";

const { TextArea } = Input;

function Feedback({ id, title, category, description, onSelectionChange }) {
  const [feedback, setFeedback] = useState(
    JSON.parse(localStorage.getItem("bxhlnvn_feedback")) ?? {
      name: "Ý kiến đánh giá",
      topic: "",
      content: "",
    }
  );
  const [allowFeedback, setAllowFeedback] = useState(true);
  const [recommend, setRecommend] = useState(
    JSON.parse(localStorage.getItem("bxhlnvn_recommend")) ?? {
      name: "Đề xuất bản quyền",
      title: "",
      publisher: "",
    }
  );
  const [allowRecommend, setAllowRecommend] = useState(true);

  const onFeedbackCheckboxChange = (e) => {
    setAllowFeedback(!e.target.checked);
    if (e.target.checked)
      setFeedback({ name: "Ý kiến đánh giá", topic: "", content: "" });
  };
  const onRecommendCheckboxChange = (e) => {
    setAllowRecommend(!e.target.checked);
    if (e.target.checked)
      setRecommend({ name: "Đề xuất bản quyền", title: "", publisher: "" });
  };
  //Pass chosen items to parent component
  useEffect(() => {
    onSelectionChange(category, title, [feedback, recommend]);
  }, [feedback, recommend]);

  //Write to local storage
  useEffect(() => {
    localStorage.setItem("bxhlnvn_feedback", JSON.stringify(feedback));
    localStorage.setItem("bxhlnvn_recommend", JSON.stringify(recommend));
  }, [feedback, recommend]);

  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="feedback">
      <Category title={id + ". " + title} description={description} />
      <Divider />
      <div className="slogan">
        <h1>Make Light Novel Great Again!</h1>
      </div>
      <Divider />
      <div className="feedback-section">
        <div className="feedback-wrapper">
          <div className="feedback-container">
            <h2>1. Ý kiến đánh giá</h2>
            <p className="description">
              Chia sẻ ý kiến và nhận xét về tác phẩm, nhà phát hành, dịch giả
              hoặc bất kỳ vấn đề nào khác liên quan. Những đóng góp này không
              chỉ giúp chúng tôi cải thiện chất lượng mà còn góp phần tạo nên
              một cộng đồng sôi động và sáng tạo, nơi mỗi ý tưởng đều được lắng
              nghe, đón nhận và trân trọng.
            </p>
            <div className="input-area">
              <Input
                placeholder="Chủ đề muốn nói (Không bắt buộc)"
                style={{ marginBottom: 5 }}
                allowClear
                addonBefore={isWideScreen && <p>Chủ đề</p>}
                disabled={!allowFeedback}
                onChange={(e) =>
                  setFeedback({ ...feedback, topic: e.target.value })
                }
                value={feedback.topic}
              />
              <TextArea
                showCount
                rows={10}
                placeholder="Nội dung chi tiết..."
                maxLength={500}
                allowClear
                disabled={!allowFeedback}
                onChange={(e) =>
                  setFeedback({ ...feedback, content: e.target.value })
                }
                value={feedback.content}
              />
            </div>
            <Checkbox onChange={onFeedbackCheckboxChange}>
              Tôi không muốn chia sẻ
            </Checkbox>
          </div>

          <div className="recommend-container">
            <h2>2. Đề xuất bản quyền</h2>
            <p className="description">
              Giới thiệu về một tác phẩm tâm đắc mà bạn mong muốn được các nhà
              phát hành ở Việt Nam mua bản quyền.
            </p>
            <div className="input-area">
              <Input
                placeholder="Tên tác phẩm đề xuất"
                style={{ marginBottom: 5 }}
                allowClear
                addonBefore={isWideScreen && <p>Tên tác phẩm đề xuất</p>}
                disabled={!allowRecommend}
                onChange={(e) =>
                  setRecommend({ ...recommend, title: e.target.value })
                }
                value={recommend.title}
              />
              <Input
                placeholder="Nhà phát hành mong muốn (Không bắt buộc)"
                style={{ marginBottom: 5 }}
                allowClear
                addonBefore={isWideScreen && <p>Nhà phát hành mong muốn</p>}
                disabled={!allowRecommend}
                onChange={(e) =>
                  setRecommend({ ...recommend, publisher: e.target.value })
                }
                value={recommend.publisher}
              />
            </div>
            <Checkbox onChange={onRecommendCheckboxChange}>
              Tôi không muốn đề xuất
            </Checkbox>
          </div>
        </div>
        <div className="feedback-image">
          <img src="/haruhi.webp" alt="haruhi image" />
        </div>
      </div>
    </div>
  );
}

export default Feedback;
