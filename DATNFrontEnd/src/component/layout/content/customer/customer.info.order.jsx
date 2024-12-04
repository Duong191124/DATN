import React, { useEffect, useState } from "react";
import { Tabs, Input, Button, Card, Row, Col, Typography, Tag } from "antd";
import { NavLink } from "react-router-dom";
import { fetchDataOrderStatusByCustomerId } from "../../../../service/api.service";
import { useCheckout } from "../../../context/checkout.context";

const { TabPane } = Tabs;
const { Text } = Typography;

const CustomerInfoOrder = () => {
  const [activeTab, setActiveTab] = useState("1"); // Quản lý tab hiện tại
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);
  const userId = localStorage.getItem("userId");
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const { formatCurrency } = useCheckout();
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

  const getStatusByTab = (tabKey) => {
    const statusMap = {
      1: null, // Tất cả
      2: "pending", // Chờ thanh toán
      3: "confirmed", // Vận chuyển
      4: "shipping", // Chờ giao hàng
      5: "delivered", // Hoàn thành
      6: "completed", // Hoàn thành
      7: "cancelled", // Đã hủy
    };
    return statusMap[tabKey] || null;
  };

  const fetchDataByStatus = async () => {
    try {
      const status = getStatusByTab(activeTab);
      const res = await fetchDataOrderStatusByCustomerId(
        userId,
        limit,
        pageSize,
        status
      );
      if (res.data) {
        setData(res.data.data.content);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataByStatus();
  }, [activeTab]);

  const statusOptions = [
    { value: "pending", label: "Chờ xử lý" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "shipping", label: "Đang giao hàng" },
    { value: "delivered", label: "Đã giao" },
    { value: "completed", label: "Đã hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  // Hàm để lấy label theo orderStatus
  const getOrderStatusLabel = (orderStatus) => {
    const status = statusOptions.find((option) => option.value === orderStatus);
    return status ? status.label : "Unknown Status";
  };
  const renderOrderCard = () => {
    return data.map((order) => {
      const orderId = order.id; // Lấy id của đơn hàng
      const orderStatus = order.status; // Lấy status của đơn hàng
      const orderCode = order.code;
      // Lặp qua orderDetailResponses để lấy chi tiết sản phẩm
      const productDetails =
        order.orderDetailResponses?.map((detail) => {
          const productDetail = detail.productDetailId || {}; // Bảo vệ khi productDetailId là null hoặc undefined
          return {
            code: productDetail.code || "Mã sản phẩm",
            image: productDetail.image || "default-image-url.jpg", // Giá trị mặc định khi không có ảnh
            defaultPrice: productDetail.defaultPrice || 0,
            color: productDetail.colorName || "N/A",
            size: productDetail.sizeName || "N/A",
            price: detail.price || 0, // Giá mặc định nếu không có giá
            quantity: detail.quantity || 1, // Số lượng mặc định nếu không có
          };
        }) || []; // Nếu không có orderDetailResponses, trả về mảng rỗng

      return (
        <Card key={orderId} style={cardStyle}>
          {/* Trạng thái đơn hàng */}
          <Row style={{ justifyContent: "end" }}>
            <Text
              style={{ fontWeight: 500, color: "#ff4d4f", fontSize: "16px" }}
            >
              {getOrderStatusLabel(orderStatus) || "Unknown Status"}{" "}
            </Text>
          </Row>

          <NavLink
            to={
              activeTab === "7"
                ? "/info-order-cancelled"
                : `/info-order-detail?code=${orderCode}`
            }
          >
            <Row
              style={{
                borderTop: "1px solid #ddd",
                borderBottom: "1px solid #ddd",
                margin: "10px 0",
                padding: "20px 0",
              }}
            >
              {/* Hình ảnh và chi tiết sản phẩm */}
              {productDetails.length > 0 &&
                productDetails.map((product, index) => (
                  <Col
                    key={index}
                    span={24}
                    style={{ display: "flex", gap: "10px" }}
                  >
                    {/* Hình ảnh sản phẩm */}
                    <div style={{ width: "100px" }}>
                      <img
                        src={product.image}
                        alt={product.code}
                        style={{ width: "100%" }}
                      />
                    </div>

                    {/* Chi tiết sản phẩm */}
                    <div>
                      <Text strong>{product.code}</Text>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Text type="secondary" style={{ marginRight: "10px" }}>
                          Phân loại hàng:
                        </Text>
                        <span
                          style={{
                            display: "inline-block",
                            width: "20px",
                            height: "20px",
                            backgroundColor: product.color,
                            borderRadius: "50%",
                            border: "1px solid #ddd",
                            marginRight: "10px",
                          }}
                        ></span>
                        <Text type="secondary">{`Size: ${product.size}`}</Text>
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        <Text delete style={{ marginRight: 8 }}>
                          {formatCurrency(product.defaultPrice)
                            ? `${formatCurrency(product.defaultPrice)}`
                            : ""}
                        </Text>
                        <Text
                          style={{
                            fontWeight: 500,
                            color: "#ff4d4f",
                            fontSize: "18px",
                          }}
                        >
                          {formatCurrency(product.price)}
                        </Text>
                      </div>
                      <Text>x{product.quantity}</Text> {/* Số lượng */}
                    </div>
                  </Col>
                ))}
            </Row>
          </NavLink>

          {/* Phí ship */}
          <Row justify="end" align="middle" style={{ marginTop: 16 }}>
            <Text
              style={{ fontSize: 14, fontWeight: 600, marginRight: "10px" }}
            >
              Phí ship:
            </Text>
            <Text style={priceStyle}>
              {formatCurrency(order.deliveryFee) || 0}
            </Text>
          </Row>

          {/* Thành tiền */}
          <Row justify="end" align="middle" style={{ marginTop: 16 }}>
            <Text
              style={{ fontSize: 14, fontWeight: 600, marginRight: "10px" }}
            >
              Thành tiền:
            </Text>
            <Text style={priceStyle}>
              {formatCurrency(order.totalAmount) || 0}
            </Text>{" "}
            {/* Thành tiền mặc định nếu không có */}
          </Row>

          {/* Các nút hành động */}
          <Row justify="end" style={{ marginTop: 16 }}>
            <Button
              style={primaryButtonStyle}
              onMouseEnter={() => setPrimaryHover(true)}
              onMouseLeave={() => setPrimaryHover(false)}
            >
              Mua Lại
            </Button>
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
    });
  };

  return (
    <div style={{ padding: 16, marginTop: "85px" }}>
      {/* Sticky Tabs */}
      <div style={stickyTabStyle}>
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={setActiveTab}
        >
          <TabPane tab="Tất cả" key="1"></TabPane>
          <TabPane tab="Chờ thanh toán" key="2"></TabPane>
          <TabPane tab="Đã xác nhận" key="3"></TabPane>
          <TabPane tab="Đang giao hàng" key="4"></TabPane>
          <TabPane tab="Đã giao" key="5"></TabPane>
          <TabPane tab="Đã hoàn thành" key="6"></TabPane>
          <TabPane tab="Đã hủy" key="7"></TabPane>
        </Tabs>
      </div>
      <div>
        {data.length > 0 ? (
          renderOrderCard()
        ) : (
          <Text type="secondary">Không có đơn hàng nào.</Text>
        )}
      </div>
    </div>
  );
};

export default CustomerInfoOrder;
