import React from "react";
import {
  Steps,
  Row,
  Col,
  Typography,
  Button,
  Card,
  Divider,
  Table,
} from "antd";

const { Step } = Steps;
const { Title, Text } = Typography;

const CustomerInfoOrderDetail = () => {
  const cardStyle = {
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: 16,
    marginBottom: 16,
  };

  const stepStyle = {
    marginBottom: 32,
  };

  const buttonStyle = {
    padding: "10px 40px",
    backgroundColor: "#EE4D2D",
    color: "#fff",
    fontWeight: 500,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  };

  const hoverButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#D03E1D",
  };

  const addressSectionStyle = {
    marginBottom: 16,
    padding: 16,
    border: "1px solid #ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  };

  const productColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <Row align="middle">
          <Col span={4}>
            <img
              src={record.image}
              alt={record.productName}
              style={{ width: "100%", borderRadius: 8 }}
            />
          </Col>
          <Col span={20}>
            <Text strong>{record.productName}</Text>
            <br />
            <Text type="secondary">{record.options}</Text>
          </Col>
        </Row>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <Text strong style={{ color: "#ff4d4f" }}>
          ₫{total}
        </Text>
      ),
    },
  ];

  const productData = [
    {
      key: "1",
      productName: "Tai Nghe Nhét Tai HiFi S2000 Pro Super Bass Chống Ồn",
      options: "Phân loại hàng: Đen Full Nâng Cấp",
      image: "https://via.placeholder.com/100?text=Tai+Nghe",
      price: "₫50.000",
      quantity: 1,
      total: "57.500",
    },
  ];

  return (
    <div style={{ padding: 16, marginTop: "85px" }}>
      {/* Thanh trạng thái */}
      <Row style={stepStyle}>
        <Steps current={4} style={{ width: "100%" }}>
          <Step title="Đơn Hàng Đã Đặt" description="21:52 19-05-2024" />
          <Step title="Đã Xác Nhận" description="22:22 19-05-2024" />
          <Step title="Đã Giao Cho ĐVVC" description="14:09 20-05-2024" />
          <Step title="Đã Nhận Được Hàng" description="08:25 21-05-2024" />
          <Step title="Đơn Hàng Đã Hoàn Thành" description="08:25 21-05-2024" />
        </Steps>
      </Row>

      {/* Nút hành động */}
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Button
          style={buttonStyle}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        >
          Mua Lại
        </Button>
        <Button style={{ marginLeft: 8 }}>Liên Hệ Người Bán</Button>
      </Row>

      {/* Địa chỉ nhận hàng */}
      <div style={addressSectionStyle}>
        <Title level={5}>Địa Chỉ Nhận Hàng</Title>
        <Text strong>Mạc Đình Duy</Text>
        <br />
        <Text>+84 123456789</Text>
        <br />
        <Text>
          Nhà Văn Hóa Chúc Đồng, Xã Thụy Hương, Huyện Chương Mỹ, Hà Nội
        </Text>
        <Divider />
        <div>
          <Text>08:03 21-05-2024 - Giao hàng thành công</Text>
          <br />
          <Text>08:19 21-05-2024 - Đơn hàng đã đến trạm giao hàng</Text>
        </div>
      </div>

      {/* Sản phẩm */}
      <Card title="Chi Tiết Sản Phẩm" style={cardStyle}>
        <Table
          columns={productColumns}
          dataSource={productData}
          pagination={false}
          bordered
        />
      </Card>

      {/* Tổng tiền */}
      <div style={cardStyle}>
        <Row justify="space-between">
          <Text>Tổng tiền hàng:</Text>
          <Text>₫50.000</Text>
        </Row>
        <Row justify="space-between">
          <Text>Phí vận chuyển:</Text>
          <Text>₫22.200</Text>
        </Row>
        <Row justify="space-between">
          <Text>Giảm giá phí vận chuyển:</Text>
          <Text>-₫14.700</Text>
        </Row>
        <Divider />
        <Row justify="space-between" align="middle">
          <Title level={5}>Thành tiền:</Title>
          <Title level={5} style={{ color: "#ff4d4f" }}>
            ₫57.500
          </Title>
        </Row>
      </div>
    </div>
  );
};

export default CustomerInfoOrderDetail;
