"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  SearchOutlined,
  FontSizeOutlined,
  FileImageOutlined,
  FilterFilled,
} from "@ant-design/icons";
import { Table, Button, Input, Space, Popover, Divider, Alert } from "antd";
import Highlighter from "react-highlight-words";
import Category from "../Category";
import "./Illustrator.scss";
import {
  NotificationHub,
  useNotification,
} from "@/components/common/Notification";

function Illustrator({
  id,
  title,
  category,
  listData,
  maxItems,
  notification,
  description,
  onSelectionChange,
}) {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [viewerMode, setViewerMode] = useState("titleViewer");
  const searchInput = useRef(null);

  const [chosenItems, setChosenItems] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const storedItems =
      JSON.parse(localStorage.getItem(`bxhlnvn_${category}_rows`)) ?? [];
    const storedKeys =
      JSON.parse(localStorage.getItem(`bxhlnvn_${category}_rowkeys`)) ?? [];

    setChosenItems(storedItems);
    setSelectedRowKeys(storedKeys);
  }, [category]);

  const [showOnlySelected, setShowOnlySelected] = useState(false);

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
          placeholder={`Nhập tên họa sĩ cần tìm`}
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
            fontWeight: 700,
            color: "#4e4d4d",
          }}
          style={{ fontWeight: 700 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        <p style={{ fontWeight: 700 }}>{text}</p>
      ),
  });

  //Viewer mode
  const seriesSearchContent = (
    <div className="series-viewer">
      <p onClick={() => setViewerMode("imageViewer")}>
        <FileImageOutlined />
        <span style={{ paddingLeft: 5 }}>
          Chế độ xem <strong>ảnh bìa</strong>
        </span>
      </p>
      <p onClick={() => setViewerMode("titleViewer")}>
        <FontSizeOutlined />
        <span style={{ paddingLeft: 5 }}>
          Chế độ xem <strong>tiêu đề</strong>
        </span>
      </p>
    </div>
  );

  //Series searching function
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
      if (viewerMode === "imageViewer") {
        return (
          <div className="series-cover">
            {series.map((item, index) => (
              <div className="series-cover-item" key={index}>
                <Popover placement="topLeft" content={item.seriesTitle}>
                  <img src={item.coverUrl} alt="light novel cover" />
                </Popover>
              </div>
            ))}
          </div>
        );
      } else {
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
                        item.seriesTitle
                          ? "- " + item.seriesTitle.toString()
                          : ""
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
      }
    },
  });

  const columns = [
    // {
    //     title: 'ID',
    //     dataIndex: 'id',
    //     width: '5%',
    //     align: 'center',
    //     responsive: ['md'],
    //     sorter: (a, b) => a.id - b.id,
    //     sortDirections: ['descend'],
    // },
    {
      title: "Họa sĩ",
      dataIndex: "name",
      width: "25%",
      align: "center",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name, "vi"),
      sortDirections: ["descend"],
    },
    {
      title: () => (
        <div className="series-column">
          Minh họa
          <Popover
            content={seriesSearchContent}
            trigger="click"
            placement="bottomRight"
          >
            <div className="series-column-search">
              <FilterFilled />
            </div>
          </Popover>
        </div>
      ),
      dataIndex: "series",
      width: "70%",
      ...getIllusSearchProps(),
    },
  ];

  const noti = useNotification();

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

      if (selectedRows.length <= maxItems) {
        setSelectedRowKeys(selectedRowKeys);
        setChosenItems(selectedRows);
        localStorage.setItem(
          `bxhlnvn_${category}_rowkeys`,
          JSON.stringify(selectedRowKeys)
        );
        localStorage.setItem(
          `bxhlnvn_${category}_rows`,
          JSON.stringify(selectedRows)
        );
      } else {
        selectedRowKeys.pop();
        selectedRows.pop();
        NotificationHub(noti, "Số bình chọn không hợp lệ!", notification);
      }
    },
    getCheckboxProps: (record) => ({
      // disabled: selectedRowKeys.length >= maxItems && !selectedRowKeys.includes(record.id),
      name: record.name,
    }),
  };

  const filteredData = showOnlySelected
    ? listData.filter((item) => selectedRowKeys.includes(item.id))
    : listData;

  useEffect(() => {
    onSelectionChange(category, title, chosenItems);
  }, [selectedRowKeys]);

  return (
    <div className="favorite-illustrator">
      <Category title={id + ". " + title} description={description} />
      <Divider />
      <Alert
        message={<strong style={{ color: "#000000ad" }}>Lưu ý</strong>}
        description={
          <p>
            Để thuận tiện cho việc bình chọn: <br />- Ở cột{" "}
            <strong style={{ color: "#000000ad" }}>Họa sĩ</strong> có một nút
            với chức năng tìm kiếm tên họa sĩ mong muốn. <br />- Ở cột{" "}
            <strong style={{ color: "#000000ad" }}>Minh họa</strong>, có hai nút
            chức năng, một là{" "}
            <strong style={{ color: "#000000ad" }}>
              Tìm kiếm theo tên tác phẩm
            </strong>
            , hai là bộ lọc giúp bạn chuyển đổi giữa hai chế độ xem tác phẩm mà
            họa sĩ đó minh họa (đã phát hành ở Việt Nam), là{" "}
            <strong>Xem bằng ảnh bìa</strong> và{" "}
            <strong>Xem bằng tiêu đề</strong>, mặc định hiển thị sẽ là Xem bằng
            tiêu đề. <br />- Cuối cùng, để kiểm tra lại những lựa chọn của mình,
            hãy ấn nút{" "}
            <strong style={{ color: "#000000ad" }}>
              Hiển thị họa sĩ đã chọn
            </strong>{" "}
            ngay bên dưới.
          </p>
        }
        type="info"
        showIcon
      />
      <Divider />
      <div
        style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}
      >
        <Button
          onClick={() => setShowOnlySelected(!showOnlySelected)}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          {showOnlySelected ? "Hiển thị tất cả" : "Hiển thị họa sĩ đã chọn"}
        </Button>
      </div>
      <div className="illustrator-table">
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record.id}
          pagination={{
            position: ["bottomCenter"],
            defaultPageSize: 20,
            locale: { items_per_page: "họa sĩ/trang" },
          }}
          locale={{
            triggerDesc: "Click để xếp theo thứ tự Z-A",
            cancelSort: "Click để xếp theo thứ tự A-Z",
          }}
        />
      </div>
    </div>
  );
}

export default Illustrator;
