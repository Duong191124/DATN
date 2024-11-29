import React, { useState } from "react";
import { Tabs, Input, Button, Card, Row, Col, Typography, Tag } from "antd";
import { NavLink } from "react-router-dom";

const { TabPane } = Tabs;
const { Text } = Typography;

const CustomerInfoOrder = () => {
  const [activeTab, setActiveTab] = useState("1"); // Quản lý tab hiện tại
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);
  const cardStyle = {
    marginBottom: 16,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: 16,
  };

  const stickyTabStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "#fff",
    padding: "8px 0",
  };

  const inputStyle = {
    marginBottom: 16,
    borderRadius: 8,
  };

  const priceStyle = {
    fontWeight: 500,
    color: "#ff4d4f",
    fontSize: "24px",
  };
  const primaryButtonStyle = {
    marginRight: 8,
    padding: "20px 55px",
    backgroundColor: primaryHover ? "#D03E1D" : "#EE4D2D",
    color: "#fff",
    fontWeight: 500,
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.1s ease-in",
  };

  const secondaryButtonStyle = {
    padding: "20px 20px",
    background: secondaryHover ? " #999" : "#d9d9d9",
    color: secondaryHover ? "#000" : "#000000D9",
    cursor: "pointer",
    transition: "color 0.3s ease, background 0.1s ease-in",
    border: "1px solid #ddd",
  };

  // Dữ liệu cho từng tab
  const orderData = {
    1: [
      {
        id: 1,
        storeName: "XSmart Store",
        productName: "Tai Nghe Nhét Tai HiFi S2000 Pro Super Bass Chống Ồn",
        options: "Đen Full Nâng Cấp",
        quantity: 1,
        price: "57.500",
        originalPrice: "90.000",
        status: "HOÀN THÀNH",
        image: "https://via.placeholder.com/100?text=Tai+Nghe",
      },
    ],
    2: [
      {
        id: 2,
        storeName: "YUDESHUI Mall",
        productName: "Túi đựng máy tính xách tay đa năng chống sốc",
        options: "Đen, 14 inch",
        quantity: 1,
        price: "90.258",
        originalPrice: "136.000",
        status: "CHỜ THANH TOÁN",
        image: "https://via.placeholder.com/100?text=Túi+Laptop",
      },
    ],
    3: [
      {
        id: 3,
        storeName: "TechShop",
        productName: "Bàn phím cơ không dây Bluetooth",
        options: "Đen",
        quantity: 1,
        price: "1.200.000",
        originalPrice: "1.500.000",
        status: "VẬN CHUYỂN",
        image: "https://via.placeholder.com/100?text=Bàn+Phím",
      },
    ],
    4: [],
    5: [
      {
        id: 4,
        storeName: "GamingGear Pro",
        productName: "Chuột chơi game RGB siêu nhạy",
        options: "Đen",
        quantity: 1,
        price: "750.000",
        originalPrice: "850.000",
        status: "HOÀN THÀNH",
        image: "https://via.placeholder.com/100?text=Chuột",
      },
    ],
    6: [
      {
        id: 5,
        storeName: "GadgetWorld",
        productName: "Ốp lưng iPhone 15 Pro Max",
        options: "Trong suốt",
        quantity: 2,
        price: "200.000",
        originalPrice: "250.000",
        status: "ĐÃ HỦY",
        image: "https://via.placeholder.com/100?text=Ốp+Lưng",
      },
    ],
    7: [
      {
        id: 6,
        storeName: "AccessoryShop",
        productName: "Dây cáp sạc nhanh USB-C",
        options: "1m",
        quantity: 1,
        price: "150.000",
        originalPrice: "200.000",
        status: "TRẢ HÀNG/HOÀN TIỀN",
        image: "https://via.placeholder.com/100?text=Cáp+Sạc",
      },
    ],
  };

  const renderOrderCard = (order) => (
    <Card key={order.id} style={cardStyle}>
      <Row style={{ justifyContent: "end" }}>
        <Text style={{ fontWeight: 500, color: "#ff4d4f", fontSize: "16px" }}>
          {order.status}
        </Text>
      </Row>
      <NavLink
        to={activeTab === "6" ? "/info-order-cancelled" : "/info-order-detail"}
      >
        <Row
          style={{
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
            margin: "10px 0",
            padding: "20px 0",
          }}
        >
          <Col span={2}>
            <div style={{ width: "100px" }}>
              <img
                src={order.image}
                alt={order.productName}
                style={{ width: "100%" }}
              />
            </div>
          </Col>
          <Col span={22}>
            <Row justify="space-between">
              <Col>
                <Tag color="red" style={{ marginRight: 8 }}>
                  Yêu thích+
                </Tag>
                <Text strong>{order.storeName}</Text>
              </Col>
            </Row>
            <Row>
              <Text>{order.productName}</Text>
            </Row>
            <Row>
              <Text type="secondary">Phân loại hàng: {order.options}</Text>
            </Row>
            <Row justify="space-between" style={{ marginTop: 16 }}>
              <Text>x{order.quantity}</Text>
              <div>
                <Text delete style={{ marginRight: 8 }}>
                  {order.originalPrice && `₫${order.originalPrice}`}
                </Text>
                <Text
                  style={{
                    fontWeight: 500,
                    color: "#ff4d4f",
                    fontSize: "18px",
                  }}
                >
                  ₫{order.price}
                </Text>
              </div>
            </Row>
          </Col>
        </Row>
      </NavLink>
      <Row justify="end" align="middle" style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: 600, marginRight: "10px" }}>
          Thành tiền:
        </Text>
        <Text style={priceStyle}>₫{order.price}</Text>
      </Row>
      <Row justify="end" style={{ marginTop: 16 }}>
        {/* Nút "Mua Lại" */}
        <Button
          style={primaryButtonStyle}
          onMouseEnter={() => setPrimaryHover(true)}
          onMouseLeave={() => setPrimaryHover(false)}
        >
          Mua Lại
        </Button>

        {/* Nút "Liên Hệ Người Bán" */}
        <Button
          style={secondaryButtonStyle}
          onMouseEnter={() => setSecondaryHover(true)}
          onMouseLeave={() => setSecondaryHover(false)}
        >
          Liên Hệ Người Bán
        </Button>
      </Row>
    </Card>
  );

  return (
    <div style={{ padding: 16, marginTop: "85px" }}>
      {/* Sticky Tabs */}
      <div style={stickyTabStyle}>
        <Tabs defaultActiveKey="1" onChange={(key) => setActiveTab(key)}>
          <TabPane tab="Tất cả" key="1"></TabPane>
          <TabPane tab="Chờ thanh toán" key="2"></TabPane>
          <TabPane tab="Vận chuyển" key="3"></TabPane>
          <TabPane tab="Chờ giao hàng" key="4"></TabPane>
          <TabPane tab="Hoàn thành" key="5"></TabPane>
          <TabPane tab="Đã hủy" key="6"></TabPane>
          <TabPane tab="Trả hàng/Hoàn tiền" key="7"></TabPane>
        </Tabs>
      </div>
      <div>
        {activeTab === "1" && (
          <Input
            placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
            style={inputStyle}
          />
        )}
        {orderData[activeTab].length > 0 ? (
          orderData[activeTab].map((order) => renderOrderCard(order))
        ) : (
          <Text type="secondary">Không có đơn hàng nào.</Text>
        )}
      </div>
    </div>
  );
};

export default CustomerInfoOrder;
