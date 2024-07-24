"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import "./FeedbackContent.scss";
import { feedback_data } from "./feedback_output";

const ITEMS_PER_PAGE = 20;

const fetchFeedbacks = (page) => {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = page * ITEMS_PER_PAGE;
  const data = feedback_data.slice(start, end).reverse();
  return data;
};

const fetchTotalItems = () => {
  return feedback_data.length;
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
    const initialize = () => {
      const total = fetchTotalItems();
      const lastPage = Math.ceil(total / ITEMS_PER_PAGE);
      setPage(lastPage);
    };

    initialize();
  }, []);

  useEffect(() => {
    const loadFeedbacks = () => {
      if (page <= 0) return;
      setLoading(true);
      const newFeedbacks = fetchFeedbacks(page);
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
