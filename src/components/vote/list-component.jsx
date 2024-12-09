"use client";
import React, { useState, useEffect } from "react";
import { Tooltip, Divider, Empty } from "antd";
import "./styles/list-component.scss";
import Category from "./category";
import Image from "next/image";
import { NotificationHub, useNotification } from "@/utils/Notification";

//Vietnamese accents to Latin
const removeAccents = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

function ListComponent({
  id,
  title,
  description,
  listData,
  maxItems,
  notification,
  category,
  onSelectionChange,
}) {
  const [chosenItems, setChosenItems] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showSelected, setShowSelected] = useState(false);
  const noti = useNotification();

  //Reset compoent when parent change to next category
  useEffect(() => {
    setChosenItems(
      JSON.parse(localStorage.getItem(`bxhlnvn_${category}`)) ?? []
    );
  }, [category]);

  //Select item logic
  const handleClick = (id) => {
    const isChosen = chosenItems.find((item) => item.id === id);
    //Show alert if reach max number of items
    if (chosenItems.length >= maxItems && !isChosen) {
      NotificationHub(noti, "Số bình chọn không hợp lệ!", notification);
      return;
    }

    const selectedObject = listData.find((item) => item.id === id);

    setChosenItems((prev) => {
      const newResult = isChosen
        ? prev.filter((item) => item.id !== id)
        : [...prev, selectedObject];
      localStorage.setItem(`bxhlnvn_${category}`, JSON.stringify(newResult));
      return newResult;
    });
  };

  //Pass chosen items to parent component
  useEffect(() => {
    onSelectionChange(category, title, chosenItems);
  }, [category, chosenItems, onSelectionChange, title]);

  //Search function
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  let filteredList = listData.filter((ln) =>
    removeAccents(
      category !== "favoritePublisher"
        ? ln.seriesName.toLowerCase()
        : ln.publisherName.toLowerCase()
    ).includes(removeAccents(searchInput.toLowerCase()))
  );
  //Show selected items
  const handleShowSelected = () => {
    setShowSelected(!showSelected);
  };

  const displayList = showSelected ? chosenItems : filteredList;

  return (
    <div className="ranobe-container">
      <Category title={id + ". " + title} description={description} />
      <Divider style={{ marginBottom: "4rem" }} />
      {category !== "favoritePublisher" ? (
        <div className="filter-container">
          <input
            type="text"
            placeholder="Lọc theo tên bất kể hoa thường dấu hoặc không dấu..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <button onClick={handleShowSelected}>
            {showSelected ? (
              <span>
                Hiển thị <strong>Tất Cả</strong>
              </span>
            ) : (
              <span>
                Hiển thị <strong>Đã Chọn</strong>
              </span>
            )}
          </button>
        </div>
      ) : null}
      {category !== "favoritePublisher" ? (
        <div className="ranobe-list">
          {displayList.map((ln) => (
            <div
              key={ln.id}
              className={`ranobe-item ${
                chosenItems.find((item) => item.id === ln.id)
                  ? "ranobe-chosen"
                  : ""
              }`}
              onClick={() => handleClick(ln.id)}
            >
              <div className="cover-wrapper">
                <Image
                  alt="light novel cover"
                  src={ln.coverUrl}
                  width={175}
                  height={240}
                  loading="lazy"
                />
              </div>
              <div className="info">
                <h4>{ln.seriesName}</h4>
                <p>
                  (
                  <strong style={{ color: "#5f5f5f" }}>
                    {ln.publisherName}
                  </strong>{" "}
                  phát hành)
                </p>
              </div>
              {/* <span className="ranobe-id">{ln.id}</span> */}
              <div className="check-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="publisher-list">
          {displayList.map((ln) => (
            <Tooltip key={ln.id} title={ln.publisherName}>
              <div
                className={`publisher-item ${ln.publisherLogo} ${
                  chosenItems.find((item) => item.id === ln.id)
                    ? "publisher-chosen"
                    : ""
                }`}
                onClick={() => handleClick(ln.id)}
              >
                <div className="logo-wrapper">
                  <Image
                    alt="light novel publisher logo"
                    src={`/images/publisher/${ln.publisherLogo}.webp`}
                    width={278}
                    height={278}
                    className="h-auto"
                    loading="lazy"
                  />
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Tooltip>
          ))}
        </div>
      )}
      {showSelected && chosenItems.length === 0 ? (
        <Empty
          style={{ marginTop: 100 }}
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
      ) : null}
    </div>
  );
}

export default ListComponent;
