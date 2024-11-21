import {
  Button,
  Col,
  Input,
  message,
  Modal,
  notification,
  Radio,
  Row,
  Select,
  Slider,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import "./product-detail.css";
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
        message: "Lỗi",
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
        message.success(`Thêm ${quantity} sản phẩm thành công`);
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không thể thêm sản phẩm vào giỏ.",
        });
      }
    } else {
      notification.error({
        message: "Lỗi",
        description: "Sản phẩm không có thông tin hợp lệ.",
      });
    }
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
                    <div style={{ display: "flex", gap: "20px" }}>
                      <Input
                        placeholder="Tên sản phẩm"
                        value={filter.productName}
                        onChange={(e) =>
                          updateFilter("productName", e.target.value)
                        }
                        style={{ marginBottom: "10px" }}
                      />
                      <Input
                        placeholder="Mã sản phẩm"
                        value={filter.productCode}
                        onChange={(e) =>
                          updateFilter("productCode", e.target.value)
                        }
                        style={{ marginBottom: "10px" }}
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
                      onChange={handlePriceChange}
                      style={{ width: "100%", marginBottom: "10px" }}
                      tooltipVisible={false}
                    />
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
