import {
  Button,
  Col,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Radio,
  Row,
  Select,
  Slider,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import "./product-detail.css";
import { SearchOutlined } from "@ant-design/icons";
const { Option } = Select;

const CounterSalesProductDetail = ({
  dataProductDetail,
  onAddToCart,
  selectedBill,
  filter,
  setFilter,
  page,
  total,
  size,
  setPageProductDetail,
  updateFilter,
  updateUrl,
  dataSize,
  dataColor,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [quantity] = useState(1);
  const [loadingPD, setLoadingPD] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productResponse",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              marginRight: 10,
              width: 80,
              height: 80,
              alignItems: "center",
            }}
          >
            <img
              src={record.image}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>{record.productResponse?.name || "Chưa có tên sản phẩm"}</div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Giá Mặc Định",
      dataIndex: "defaultPrice",
      render: (text) => `${text?.toLocaleString()} VNĐ` || "Chưa có giá",
    },
    {
      title: "Giá Khuyến Mãi",
      dataIndex: "discountPrice",
      render: (text) => `${text?.toLocaleString()} VNĐ` || "Chưa có giá",
    },
    {
      title: "Size",
      dataIndex: "size",
      render: (text, record) => record.size?.name || "Chưa có size",
    },
    {
      title: "Màu",
      dataIndex: "color",
      render: (text, record) => record.color?.name || "Chưa có màu",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",

      render: (status) => {
        switch (status) {
          case 1:
            return "Còn Hàng";
          case 0:
            return "Hết Hàng";
          case 2:
            return "Ngừng Hoạt Động";
          default:
            return "Trạng Thái Không Xác Định";
        }
      },
    },
    {
      title: "Thêm vào giỏ",
      render: (_, record) => (
        <Button
          disabled={
            !selectedBill || record.quantity === 0 || record.status === 2
          }
          style={{
            opacity:
              !selectedBill || record.quantity === 0 || record.status === 2
                ? 0.5
                : 1,
          }}
          onClick={() => {
            handleConfirm(record);
          }}
        >
          Thêm vào giỏ
        </Button>
      ),
    },
  ];

  const updatedDataProductDetail = dataProductDetail.map((item) => ({
    ...item,
    status:
      item.product?.status === 0 ||
      item.size?.status === 0 ||
      item.color?.status === 0 ||
      item.sleeve?.status === 0 ||
      item.collar?.status === 0 ||
      item.brand?.status === 0
        ? 2
        : item.quantity > 0
        ? 1
        : 0, // Xét điều kiện trạng thái
  }));

  const handleConfirm = async (record) => {
    setSelectedRow(record);
    if (!selectedBill) {
      message.warning({
        message: "Hóa đơn",
        description: "Vui lòng chọn hóa đơn trước khi thêm sản phẩm.",
      });
      return;
    }
    if (record) {
      const productToAdd = {
        ...record,
      };
      const addCart = await onAddToCart(productToAdd, quantity);
      if (addCart) {
        notification.success({
          message: "Số lượng",
          description: `Thêm ${quantity} sản phẩm thành công`,
          duration: 1,
        });
      }
    } else {
      notification.error({
        message: "Lỗi",
        description: "Sản phẩm không có thông tin hợp lệ.",
      });
    }
  };
  const handlePriceInputChange = (key, value) => {
    if (value < 0 || value > 10000000) {
      notification.warning({
        message: "Giới hạn giá",
        description: "Giá trị phải nằm trong khoảng từ 0 đến 10,000,000 đ.",
      });
      return;
    }

    const newFilters = {
      ...filter,
      [key]: value,
    };

    setFilter(newFilters);

    // Cập nhật Slider
    handlePriceChange([newFilters.minPrice, newFilters.maxPrice]);
  };

  const handlePriceChange = (value) => {
    const newFilters = {
      ...filter,
      minPrice: value[0],
      maxPrice: value[1],
    };

    setFilter(newFilters);
    updateUrl(newFilters);
  };
  const [tempFilterPrice, setTempFilterPrice] = useState({
    minPrice: 0,
    maxPrice: 10000000,
  });
  // Hàm format giá trị với dấu phân cách hàng nghìn
  const formatPrice = (value) => {
    // Kiểm tra nếu giá trị là hợp lệ
    if (value || value === 0) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(value);
    }
    return "";
  };

  const handlePriceInput = (key, value) => {
    // Kiểm tra giá trị có hợp lệ không, nếu không thì không thay đổi
    if (value < 0 || value > 10000000) return;

    // Chuyển đổi giá trị vào để cập nhật filter
    setTempFilterPrice({
      ...tempFilterPrice,
      [key]: value,
    });
  };

  const blockInvalidChars = (e) => {
    // Chặn ký tự không hợp lệ
    if (
      ["e", "E", "+", "-", "."].includes(e.key) ||
      ((e.key < "0" || e.key > "9") && e.key.length === 1)
    ) {
      e.preventDefault();
    }

    // Chặn nhiều dấu chấm
    const currentValue = e.target.value;
    if (e.key === "." && currentValue.includes(".")) {
      e.preventDefault();
    }
  };

  const resetFilters = async () => {
    setLoadingPD(true);
    const defaultFilters = {
      productName: "",
      productCode: "",
      color: "",
      size: "",
      status: "",
      minPrice: undefined,
      maxPrice: undefined,
    };
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setFilter(defaultFilters);
    updateUrl(defaultFilters);
    setLoadingPD(false);
  };
  const showFilterModal = () => {
    if (!selectedBill) {
      notification.warning({
        message: "Cảnh báo",
        description: "Vui lòng nhấn chọn hóa đơn để mua hàng",
        duration: 2,
      });
      return;
    }
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Áp dụng bộ lọc
  const handleApplyFilters = () => {
    // Logic để áp dụng bộ lọc
    setIsModalVisible(false);
  };

  const toggleFilter = () => {
    setExpanded(!expanded);
  };
  const [tempFilter, setTempFilter] = React.useState({
    productName: "",
    productCode: "",
  });
  const updateTempFilter = (key, value) => {
    setTempFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleSearch = () => {
    setFilter(tempFilter); // Cập nhật filter chính
  };
  return (
    <>
      <div id="product">
        <Button style={{ backgroundColor: "#fff" }} onClick={showFilterModal}>
          Chọn sản phẩm
        </Button>
        <Modal
          title="Chọn sản phẩm"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={1000}
        >
          <div style={{ marginBottom: "20px" }}>
            <div className="filter-container">
              <button
                onClick={toggleFilter}
                style={{
                  marginBottom: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  color: "#1890ff",
                }}
              >
                {expanded ? "Ẩn" : "Lọc"}
              </button>
              <div
                className="filter-content"
                style={{
                  maxHeight: expanded ? "1000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.5s ease-in-out",
                  padding: "0 10px",
                }}
              >
                <Row style={{ gap: "20px" }}>
                  <Col span={11}>
                    <p style={{ marginBottom: "10px", fontSize: "16px" }}>
                      Sản phẩm
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                      }}
                    >
                      <Input
                        placeholder="Tên sản phẩm"
                        value={tempFilter.productName}
                        onChange={(e) =>
                          updateTempFilter("productName", e.target.value)
                        }
                        suffix={
                          <SearchOutlined
                            onClick={() => handleSearch("productName")}
                            style={{ cursor: "pointer" }}
                          />
                        }
                        style={{ marginBottom: "10px", width: "50%" }}
                      />
                      <Input
                        placeholder="Mã sản phẩm"
                        value={tempFilter.productCode}
                        onChange={(e) =>
                          updateTempFilter("productCode", e.target.value)
                        }
                        suffix={
                          <SearchOutlined
                            onClick={() => handleSearch("productCode")}
                            style={{ cursor: "pointer" }}
                          />
                        }
                        style={{ marginBottom: "10px", width: "50%" }}
                      />
                    </div>
                  </Col>
                  <Col span={11}>
                    <p style={{ marginBottom: "10px", fontSize: "16px" }}>
                      Trạng thái
                    </p>
                    <Radio.Group
                      value={filter.status}
                      onChange={(e) => updateFilter("status", e.target.value)}
                      style={{ display: "flex", gap: "20px" }}
                    >
                      <Radio value={1}>Hoạt động</Radio>
                      <Radio value={0}>Không hoạt động</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
                <Row style={{ gap: "20px" }}>
                  <Col span={11}>
                    <p style={{ marginBottom: "10px", fontSize: "16px" }}>
                      Màu
                    </p>
                    <Select
                      placeholder="Chọn màu"
                      value={filter.color || undefined}
                      onChange={(value) => updateFilter("color", value)}
                      style={{ width: "100%", marginBottom: "10px" }}
                      allowClear
                    >
                      {dataColor.map((color) => (
                        <Option key={color.id} value={color.name}>
                          {color.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={11}>
                    <p style={{ marginBottom: "10px", fontSize: "16px" }}>
                      Kích thước
                    </p>
                    <Select
                      placeholder="Chọn kích cỡ"
                      value={filter.size || undefined}
                      onChange={(value) => updateFilter("size", value)}
                      style={{ width: "100%", marginBottom: "10px" }}
                      allowClear
                    >
                      {dataSize.map((size) => (
                        <Option key={size.id} value={size.name}>
                          {size.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                    <p style={{ fontSize: "16px" }}>
                      Giá: {(filter.minPrice ?? 0).toLocaleString()} đ -{" "}
                      {(filter.maxPrice ?? 10000000).toLocaleString()} đ
                    </p>
                    <Slider
                      range
                      min={0}
                      max={10000000}
                      value={[
                        filter.minPrice || 0,
                        filter.maxPrice || 10000000,
                      ]}
                      onChange={(value) => handlePriceChange(value)}
                      style={{ width: "100%", marginBottom: "10px" }}
                      tooltipVisible={false}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <InputNumber
                        min={0}
                        max={10000000}
                        value={tempFilterPrice.minPrice}
                        onChange={(value) =>
                          handlePriceInput("minPrice", value)
                        }
                        onKeyDown={blockInvalidChars}
                        style={{ width: "50%" }}
                        placeholder="Từ"
                        formatter={(value) => formatPrice(value)}
                        parser={(value) => value.replace(/[^\d]/g, "")}
                      />
                      <InputNumber
                        min={0}
                        max={10000000}
                        value={tempFilterPrice.maxPrice}
                        onChange={(value) =>
                          handlePriceInput("maxPrice", value)
                        }
                        onKeyDown={blockInvalidChars}
                        style={{ width: "50%" }}
                        placeholder="Đến"
                        formatter={(value) => formatPrice(value)}
                        parser={(value) => value.replace(/[^\d]/g, "")}
                      />
                      <Button
                        type="primary"
                        onClick={() => {
                          setFilter(tempFilterPrice); // Áp dụng giá trị tạm thời vào filter chính
                          updateUrl(tempFilterPrice); // Cập nhật URL nếu cần
                        }}
                      >
                        Lọc giá
                      </Button>
                    </div>
                  </Col>
                </Row>
                <div style={{ marginTop: "10px", textAlign: "end" }}>
                  <Button
                    onClick={resetFilters}
                    loading={loadingPD}
                    type="primary"
                  >
                    Reset Lọc
                  </Button>
                </div>
              </div>
            </div>
            {/* Table for products */}
            <Table
              columns={columns}
              dataSource={updatedDataProductDetail}
              pagination={{
                current: page,
                total: total,
                pageSize: size,
                onChange: setPageProductDetail,
              }}
            />
            <Row justify="end">
              <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                Hủy
              </Button>
              <Button type="primary" onClick={handleApplyFilters}>
                Xác nhận
              </Button>
            </Row>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default CounterSalesProductDetail;
