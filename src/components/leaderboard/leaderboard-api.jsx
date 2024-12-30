"use client";
import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Table, Button, Input, Space, Popover, Rate } from "antd";
import Highlighter from "react-highlight-words";
import "./styles/leaderboard-table.scss";
import {
  publisherFilter,
  handleList,
  addZeroCount,
  mergeAttribute,
  filterCategories,
  filterByIds,
} from "./filter";
import Image from "next/image";
import ranobe from "@/app/vote/data/ranobe.json";
import publisher from "@/app/vote/data/publisher.json";
import { PERIOD_CATEGORIES, CURRENT_PERIOD } from "@/constants";

const initDataSource = PERIOD_CATEGORIES[CURRENT_PERIOD];
const selectArray = filterCategories(initDataSource);

function LeaderBoardTable({ responseData: allRank }) {
  console.log(allRank);
  const [selectedCategory, setSelectedCategory] = useState(selectArray[0]);

  const [dataInput, setDataInput] = useState(
    initDataSource.reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {})
  );

  const [countVote, setCountVote] = useState(null);
  useEffect(() => {
    if (allRank && allRank.data) {
      //Processing id list for original list
      const votedRanobeIds = allRank.data.favoriteRanobes.map(
        (item) => item._id
      );
      const votedOneshotIds = allRank.data.favoriteOneshots.map(
        (item) => item._id
      );
      const votedPublisherIds = allRank.data.favoritePublishers.map(
        (item) => item._id
      );
      const votedRookieIds = allRank.data.favoriteRookies.map(
        (item) => item._id
      );

      //Remove voted items from original list
      const allRemainingRanobe = ranobe.filter(
        (item) => !votedRanobeIds.includes(item.id)
      );

      const allRemainingOneshot = filterByIds(
        ranobe,
        [
          17, 22, 38, 39, 40, 41, 43, 48, 51, 61, 65, 68, 69, 72, 75, 82, 83,
          85, 92, 95, 96, 105, 108, 113, 114, 118, 124, 131, 132, 133, 134, 136,
          137, 138, 139, 141, 142, 143, 145, 147, 148, 149, 152, 153, 155, 156,
          157, 158, 160, 161, 165, 167, 170, 171, 172, 174, 175, 176, 177, 181,
          185, 186, 187, 188, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199,
          200, 201, 202, 204, 205, 206, 209, 210, 211, 213, 214, 215, 216, 217,
          218,
        ]
      ).filter((item) => !votedOneshotIds.includes(item.id));

      const allRemainingRookie = filterByIds(
        ranobe,
        [2, 6, 13, 17, 19, 22, 24, 38, 39, 40, 41, 43, 47]
      ).filter((item) => !votedRookieIds.includes(item.id));

      const allRemainingPublisher = publisher.filter(
        (item) => !votedPublisherIds.includes(item.id)
      );

      //Final list
      const favoriteRanobe = handleList(
        mergeAttribute(allRank.data.favoriteRanobes, "ranobe").concat(
          addZeroCount(allRemainingRanobe)
        )
      );
      const favoriteOneshot = handleList(
        mergeAttribute(allRank.data.favoriteOneshots, "ranobe").concat(
          addZeroCount(allRemainingOneshot)
        )
      );
      const favoriteRookie = handleList(
        mergeAttribute(allRank.data.favoriteRookies, "ranobe").concat(
          addZeroCount(allRemainingRookie)
        )
      );
      const favoritePublisher = handleList(
        mergeAttribute(allRank.data.favoritePublishers, "publisher").concat(
          addZeroCount(allRemainingPublisher)
        )
      );

      setDataInput({
        favoriteRanobe,
        favoriteOneshot,
        favoritePublisher,
        favoriteRookie,
      });
      //Initial for data for table
      setData(favoriteRanobe);
      setCountVote(allRank.data.count);
    }
  }, [allRank]);

  // Initial datalist for table
  const [data, setData] = useState(dataInput.favoriteRanobe);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Nhập tên tác phẩm cần tìm`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 110,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              handleSearch(selectedKeys, confirm, dataIndex);
              clearFilters && handleReset(clearFilters);
            }}
            size="small"
            style={{
              width: 70,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#494949d7" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Xếp hạng",
      dataIndex: "rank",
      align: "center",
      sorter: (a, b) => a.rank - b.rank,
      render: (rank) => {
        const rankColors = ["#e79827", "#7784a5", "#b46933"];
        const rankImages = [
          <Image
            key="gold"
            src="/gold.png"
            alt="gold"
            width={20}
            height={15}
          />,
          <Image
            key="silver"
            src="/silver.png"
            alt="sivler"
            width={20}
            height={15}
          />,
          <Image
            key="bronze"
            src="/bronze.png"
            alt="bronze"
            width={20}
            height={15}
          />,
        ];
        const getRankImage = (rank) =>
          (
            <div className="top-3">
              <div style={{ color: rankColors[rank - 1] }}>
                #{" "}
                <span
                  style={{ fontWeight: "800", color: rankColors[rank - 1] }}
                >
                  {rank}
                </span>
              </div>
              {rankImages[rank - 1]}
            </div>
          ) || (
            <>
              # <span style={{ fontWeight: "800" }}>{rank}</span>
            </>
          );
        return getRankImage(rank);
      },
      sortDirections: ["descend"],
      width: "15%",
    },
    {
      title: "Tác phẩm",
      dataIndex: "seriesName",
      ...getColumnSearchProps("seriesName"),
      width: "45%",
    },
    {
      title: "Nhà phát hành",
      dataIndex: "publisherName",
      align: "center",
      filters: publisherFilter,
      filterSearch: true,
      onFilter: (value, record) => record.publisherName.indexOf(value) === 0,
      width: "20%",
      responsive: ["md"],
    },
    {
      title: "Số bình chọn",
      dataIndex: "count",
      align: "center",
      sorter: (a, b) => b.count - a.count,
      render: (count) => <span style={{ fontWeight: "800" }}>{count}</span>,
      sortDirections: ["descend"],
      width: "20%",
    },
  ];

  //Illustrator series search
  const [searchSeries, setSearchSeries] = useState("");
  const searchSeriesInput = useRef(null);
  const handleSeriesSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchSeries(selectedKeys[0]);
  };
  const handleSeriesReset = (clearFilters) => {
    clearFilters();
    setSearchSeries("");
  };
  const getIllusSearchProps = () => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchSeriesInput}
          placeholder={`Nhập tên tác phẩm cần tìm`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSeriesSearch(selectedKeys, confirm)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSeriesSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 110,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleSeriesReset(clearFilters);
              handleSeriesSearch(selectedKeys, confirm);
              clearFilters && handleSeriesReset(clearFilters);
            }}
            size="small"
            style={{
              width: 70,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#494949d7" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record["series"].some((item) =>
        item.seriesTitle.toString().toLowerCase().includes(value.toLowerCase())
      ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchSeriesInput.current?.select(), 100);
      }
    },
    render: (series) => {
      return series.length === 1 ? (
        <div className="series-title">
          {searchSeries !== "" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
                fontWeight: 700,
                color: "#4e4d4d",
              }}
              searchWords={[searchSeries]}
              autoEscape
              textToHighlight={
                series[0].seriesTitle ? series[0].seriesTitle.toString() : ""
              }
            />
          ) : (
            <p>{series[0].seriesTitle}</p>
          )}
        </div>
      ) : (
        <div className="series-title">
          {series.map((item, index) => (
            <div key={index}>
              {searchSeries !== "" ? (
                <p>
                  <Highlighter
                    highlightStyle={{
                      backgroundColor: "#ffc069",
                      padding: 0,
                      fontWeight: 700,
                      color: "#4e4d4d",
                    }}
                    searchWords={[searchSeries]}
                    autoEscape
                    textToHighlight={
                      item.seriesTitle ? "- " + item.seriesTitle.toString() : ""
                    }
                  />
                </p>
              ) : (
                <p>- {item.seriesTitle}</p>
              )}
            </div>
          ))}
        </div>
      );
    },
  });

  const illustratorColumns = [
    {
      title: "Xếp hạng",
      dataIndex: "rank",
      align: "center",
      sorter: (a, b) => a.rank - b.rank,
      render: (rank) => {
        const rankColors = ["#e79827", "#7784a5", "#b46933"];
        const rankImages = [
          <Image
            key="gold"
            src="/gold.png"
            alt="gold"
            width={20}
            height={15}
          />,
          <Image
            key="silver"
            src="/silver.png"
            alt="sivler"
            width={20}
            height={15}
          />,
          <Image
            key="bronze"
            src="/bronze.png"
            alt="bronze"
            width={20}
            height={15}
          />,
        ];
        const getRankImage = (rank) =>
          (
            <div className="top-3">
              <div style={{ color: rankColors[rank - 1] }}>
                #{" "}
                <span
                  style={{ fontWeight: "800", color: rankColors[rank - 1] }}
                >
                  {rank}
                </span>
              </div>
              {rankImages[rank - 1]}
            </div>
          ) || (
            <>
              # <span style={{ fontWeight: "800" }}>{rank}</span>
            </>
          );
        return getRankImage(rank);
      },
      sortDirections: ["descend"],
      width: "15%",
    },
    {
      title: "Họa sĩ",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
      width: "25%",
    },
    {
      title: "Minh họa",
      dataIndex: "series",
      align: "left",
      width: "40%",
      responsive: ["md"],
      ...getIllusSearchProps(),
    },
    {
      title: "Số bình chọn",
      dataIndex: "count",
      align: "center",
      sorter: (a, b) => b.count - a.count,
      render: (count) => <span style={{ fontWeight: "800" }}>{count}</span>,
      sortDirections: ["descend"],
      width: "20%",
    },
  ];

  const popoverContent = (
    <div className="popover-content">
      {selectArray.map((item) => (
        <p
          key={item.value}
          className={
            selectedCategory.value === item.value ? "selected-category" : ""
          }
          onClick={() => handleChange(item.value)}
        >
          {item.label}
        </p>
      ))}
    </div>
  );

  const [rateValue, setRateValue] = useState(4);
  const rateDesc = [
    "Tốt",
    "Quá tốt",
    "Cực kỳ tốt",
    "Tốt không còn gì để nói",
    "G Cup",
  ];

  const handleChange = (value) => {
    setSelectedCategory(selectArray.find((item) => item.value === value));
    setData(dataInput[value]);
  };

  return (
    <div className="leaderboard">
      <p className="ld-description">
        Đã có kết quả cho bảng xếp hạng kì này! Hãy ấn vào nút cài đặt bên cạnh
        tên hạng mục để chọn và xem thứ hạng cụ thể của hạng mục đó. Có thể ấn
        vào phần tiêu đề của mỗi cột bên dưới để{" "}
        <strong>xem thứ hạng tăng dần/giảm dần</strong>,{" "}
        <strong>tìm kiếm tác phẩm cụ thể</strong> hay{" "}
        <strong>lọc ra các tác phẩm của mỗi nhà xuất bản</strong> tương ứng.
      </p>
      <div className="ld-chibi">
        <Image
          src="/nonoa_chibi.webp"
          alt="nonoa chibi"
          width={138}
          height={224}
        />
      </div>
      <div className="ld-table-header">
        <div className="header-left-panel">
          <div className="category-title">
            <h1>{selectedCategory.label}</h1>
            {selectedCategory.value === "favoritePublisher" ? (
              <p className="h1-description">
                Có tổng cộng <strong>{data.length} nhà phát hành</strong> tham
                gia hạng mục!
              </p>
            ) : selectedCategory.value === "favoriteIllustrator" ? (
              <p className="h1-description">
                Hạng mục này có tổng cộng <strong>{data.length} họa sĩ</strong>{" "}
                tham gia!
              </p>
            ) : (
              <p className="h1-description">
                Hạng mục này có tổng cộng{" "}
                <strong>{data.length} tác phẩm</strong> tham gia!
              </p>
            )}
          </div>
          <Popover
            placement="bottomRight"
            content={popoverContent}
            trigger="click"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </Popover>
        </div>
        <div className="header-right-panel">
          <div className="vote-container">
            <p>Số người bình chọn</p>
            <div className="vote-number">
              <UserOutlined />
              <p>{countVote}</p>
            </div>
          </div>
          <div className="rate-container">
            <p>Đánh giá bảng xếp hạng</p>
            <Rate
              tooltips={rateDesc}
              value={rateValue}
              onChange={setRateValue}
            />
          </div>
          <div className="next-container">
            <p>Kì tiếp theo</p>
            <span>Khai tử BXH</span>
          </div>
        </div>
      </div>
      <div className="ld-table">
        {selectedCategory.value === "favoritePublisher" ? (
          <div className="publisher-table">
            {dataInput.favoritePublisher.map((ln, index) => (
              <div className={`publisher-item ${ln.publisherLogo}`} key={index}>
                <div className="logo-wrapper">
                  <Image
                    alt="publisher logo"
                    src={`/images/publisher/${ln.publisherLogo}.webp`}
                    width={187}
                    height={187}
                    className="h-auto"
                    loading="lazy"
                  />
                </div>
                <div className="publisher-info">
                  <div className="publisher-vote">
                    <h3>Số bình chọn</h3>
                    <p>{ln.count}</p>
                  </div>
                  <div className="publisher-rank">
                    <h3>Xếp hạng</h3>
                    <p>
                      <span>#</span>
                      {ln.rank}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            rowClassName={(record) => `rank-${record.rank}`}
            pagination={{
              position: ["bottomCenter"],
              defaultPageSize: 20,
              locale: { items_per_page: "mục/trang" },
            }}
            bordered
            locale={{
              triggerDesc: "Click để xếp theo thứ tự giảm dần",
              cancelSort: "Click để xếp theo thứ tự tăng dần",
              filterSearchPlaceholder: "Tìm tên nhà phát hành",
            }}
          />
        )}
      </div>
    </div>
  );
}

export default LeaderBoardTable;
