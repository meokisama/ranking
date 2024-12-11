"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import "./styles/feedback-content.scss";
import axios from "axios";

const fetchFeedbacks = async (page) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_FEEDBACK}?limit=40&page=${page}`
  );
  const data = response.data.data.results
    .filter((item) => item.feedback.topic || item.feedback.content)
    .reverse()
    .map((item) => ({
      feedback: item.feedback,
      createdAt: item.createdAt,
    }));
  return data;
};

const fetchTotalItems = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_FEEDBACK}?limit=1&page=1`
  );
  return response.data.data.total;
};

function FeedbackContent() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const observer = useRef();

  const lastFeedbackElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage - 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    const initialize = async () => {
      const total = await fetchTotalItems();
      const lastPage = Math.ceil(total / 40);
      setPage(lastPage);
    };

    initialize();
  }, []);

  useEffect(() => {
    const loadFeedbacks = async () => {
      if (page <= 0) return;
      setLoading(true);
      const newFeedbacks = await fetchFeedbacks(page);
      newFeedbacks.length === 0
        ? setPage((prevPage) => prevPage - 1)
        : setFeedbacks((prevFeedbacks) => [...prevFeedbacks, ...newFeedbacks]);
      setLoading(false);
    };
    loadFeedbacks();
  }, [page]);

  return (
    <div className="feedback-content">
      <div className="feedback-grid">
        {feedbacks.map((feedback, index) => (
          <div
            ref={feedbacks.length === index + 1 ? lastFeedbackElementRef : null}
            key={index}
            className="feedback-item"
          >
            <p>
              <strong>Chủ đề:</strong>{" "}
              {feedback.feedback.topic !== "" ? feedback.feedback.topic : "___"}
            </p>
            <p>
              <strong>Nội dung:</strong>{" "}
              {feedback.feedback.content !== ""
                ? feedback.feedback.content
                : "___"}
            </p>
            <p>
              <strong>Đề xuất:</strong>{" "}
              {feedback.feedback.title !== "" ? feedback.feedback.title : "___"}
            </p>
            <p>
              <strong>NPH:</strong>{" "}
              {feedback.feedback.publisher !== ""
                ? feedback.feedback.publisher
                : "___"}
            </p>
            <div className="date">
              {" "}
              {new Date(feedback.createdAt).toLocaleString("en-GB")}
            </div>
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>
    </div>
  );
}

export default FeedbackContent;
