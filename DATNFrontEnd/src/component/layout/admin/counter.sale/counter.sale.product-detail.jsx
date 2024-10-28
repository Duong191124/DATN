import {
  Button,
  Col,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Slider,
  Table,
} from "antd";
import { useState } from "react";

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
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingPD, setLoadingPD] = useState(false);
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
      title: "Giá",
      dataIndex: "price",
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
      render: (text, record) => (record.status === 0 ? "Hết hàng" : "Còn hàng"),
    },
    {
      title: "Thêm vào giỏ",
      render: (_, record) => (
        <Button onClick={() => handleAddToCart(record)}>Thêm vào giỏ</Button>
      ),
    },
  ];

  const handleAddToCart = (record) => {
    if (!selectedBill) {
      notification.error({
        message: "Chưa chọn hóa đơn!",
        description:
          "Vui lòng chọn hóa đơn trước khi thêm sản phẩm vào giỏ hàng.",
      });
      return;
    }
    setSelectedRow(record);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    const productToAdd = {
      ...selectedRow,
      quantity,
    };
    if (selectedRow.productResponse && selectedRow.productResponse.name) {
      onAddToCart(productToAdd, quantity);
      notification.success({
        message: "Sản phẩm đã được thêm vào giỏ hàng",
        description: `${selectedRow.productResponse.name} x ${quantity} đã được thêm vào giỏ hàng.`,
      });
    } else {
      notification.error({
        message: "Lỗi",
        description: "Sản phẩm không có thông tin hợp lệ.",
      });
    }

    setModalVisible(false);
    setQuantity(1);
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
    setLoadingPD(true); // Bắt đầu loading
    const defaultFilters = {
      productName: "",
      productCode: "",
      color: "",
      size: "",
      minPrice: undefined,
      maxPrice: undefined,
    };

    // Giả lập thời gian loading 2 giây (nếu cần)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setFilter(defaultFilters);
    updateUrl(defaultFilters);
    setLoadingPD(false); // Kết thúc loading
  };
  return (
    <>
      <h3 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
        Chi tiết sản phẩm
      </h3>
      <div style={{ marginBottom: "20px" }}>
        <Row justify="space-between" align="middle">
          <h4 style={{ marginBottom: "20px" }}>Bộ lọc</h4>
          <Button onClick={resetFilters} type="primary" loading={loadingPD}>
            Reset
          </Button>
        </Row>
        <Row style={{ gap: "20px" }}>
          <Col span={11}>
            <p style={{ marginBottom: "10px", fontSize: "16px" }}>Sản phẩm</p>
            <div style={{ display: "flex", gap: "20px" }}>
              <Input
                placeholder="Tên sản phẩm"
                value={filter.productName}
                onChange={(e) => updateFilter("productName", e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <Input
                placeholder="Mã sản phẩm"
                value={filter.productCode}
                onChange={(e) => updateFilter("productCode", e.target.value)}
                style={{ marginBottom: "10px" }}
              />
            </div>
          </Col>
          <Col span={11}>
            <p style={{ marginBottom: "10px", fontSize: "16px" }}>Màu</p>
            <Select
              placeholder="Chọn màu"
              value={filter.color || undefined}
              onChange={(value) => updateFilter("color", value)}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              <Option value="red">Đỏ</Option>
              <Option value="black">Đen</Option>
              <Option value="blue">Xanh</Option>
              <Option value="green">Xanh lá</Option>
            </Select>
          </Col>
        </Row>
        <Row style={{ gap: "20px" }}>
          <Col span={11}>
            <p style={{ marginBottom: "10px", fontSize: "16px" }}>Kích thước</p>
            <Select
              placeholder="Chọn kích cỡ"
              value={filter.size || undefined}
              onChange={(value) => updateFilter("size", value)}
              style={{ width: "100%", marginBottom: "10px" }}
              allowClear
            >
              <Option value="S">S</Option>
              <Option value="M">M</Option>
              <Option value="L">L</Option>
              <Option value="XL">XL</Option>
            </Select>
          </Col>
          <Col span={11}>
            <p style={{ marginBottom: "10px", fontSize: "16px" }}>Giá</p>
            <Slider
              range
              min={0}
              max={10000000}
              value={[filter.minPrice || 0, filter.maxPrice || 10000000]}
              onChange={handlePriceChange}
            />
          </Col>
        </Row>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataProductDetail}
        size="small"
        style={{ border: "1px solid #ddd" }}
        pagination={{
          current: page,
          total: total,
          pageSize: size,
          onChange: (newPage) => {
            setPageProductDetail(newPage);
            updateUrl(filter); // Cập nhật URL khi thay đổi trang
          },
        }}
      />
      <Modal
        title={`Nhập số lượng cho sản phẩm ${selectedRow?.productResponse?.name}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirm}>
            Thêm
          </Button>,
        ]}
      >
        <div>
          <span>Nhập số lượng: </span>
          <InputNumber
            min={1}
            max={selectedRow?.quantity || 1}
            value={quantity}
            onChange={(value) => setQuantity(value)}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <span>Thông tin sản phẩm:</span>
          <div>
            <strong>Mã sản phẩm:</strong> {selectedRow?.code}
          </div>
          <div>
            <strong>Size:</strong> {selectedRow?.size?.name}
          </div>
          <div>
            <strong>Màu:</strong> {selectedRow?.color?.name}
          </div>
          <div>
            <strong>Giá:</strong> {selectedRow?.price?.toLocaleString()} VNĐ
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CounterSalesProductDetail;
