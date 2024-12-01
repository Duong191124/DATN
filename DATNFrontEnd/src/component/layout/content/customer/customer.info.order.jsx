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
  const { formatCurrency } = useCheckout()
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

  const fetchDataByStatus = async () => {
    try {
      const res = await fetchDataOrderStatusByCustomerId(userId, limit, pageSize);
      console.log(res);
      if (res.data) {
        setData(res.data.data.content);
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchDataByStatus()
  }, [])

  const statusOptions = [
    { value: "pending", label: "Chờ xử lý" },
    { value: "process", label: "Đang xử lý" },
    { value: "delivery", label: "Đang giao" },
    { value: "shipped", label: "Đã giao" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  // Hàm để lấy label theo orderStatus
  const getOrderStatusLabel = (orderStatus) => {
    const status = statusOptions.find(option => option.value === orderStatus);
    return status ? status.label : "Unknown Status";
  };

  const renderOrderCard = () => {
    return data.map((order) => {
      const orderId = order.id; // Lấy id của đơn hàng
      const orderStatus = order.status; // Lấy status của đơn hàng

      // Lặp qua orderDetailResponses để lấy chi tiết sản phẩm
      const productDetails = order.orderDetailResponses?.map((detail) => {
        const productDetail = detail.productDetailId || {}; // Bảo vệ khi productDetailId là null hoặc undefined
        return {
          code: productDetail.code || "Mã sản phẩm",
          image: productDetail.image || "default-image-url.jpg", // Giá trị mặc định khi không có ảnh
          defaultPrice: productDetail.defaultPrice || 0,
          color: productDetail.colorId || "N/A",
          size: productDetail.sizeId || "N/A",
          price: detail.price || 0, // Giá mặc định nếu không có giá
          quantity: detail.quantity || 1 // Số lượng mặc định nếu không có
        };
      }) || []; // Nếu không có orderDetailResponses, trả về mảng rỗng

      return (
        <Card key={orderId} style={cardStyle}>
          {/* Trạng thái đơn hàng */}
          <Row style={{ justifyContent: "end" }}>
            <Text style={{ fontWeight: 500, color: "#ff4d4f", fontSize: "16px" }}>
              {getOrderStatusLabel(orderStatus) || "Unknown Status"} {/* Hiển thị trạng thái mặc định */}
            </Text>
          </Row>

          <NavLink to={activeTab === "6" ? "/info-order-cancelled" : "/info-order-detail"}>
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
                  <Col key={index} span={24} style={{ display: "flex", gap: "10px" }}>
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
                      <div>
                        <Text type="secondary">
                          Phân loại hàng:{" "}
                          {`Màu: ${product.color}, Size: ${product.size}`}
                        </Text>
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        <Text delete style={{ marginRight: 8 }}>
                          {formatCurrency(product.defaultPrice) ? `${formatCurrency(product.defaultPrice)}` : ""}
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
            <Text style={{ fontSize: 14, fontWeight: 600, marginRight: "10px" }}>
              Phí ship:
            </Text>
            <Text style={priceStyle}>{formatCurrency(order.deliveryFee) || 0}</Text>
          </Row>

          {/* Thành tiền */}
          <Row justify="end" align="middle" style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: 600, marginRight: "10px" }}>
              Thành tiền:
            </Text>
            <Text style={priceStyle}>{formatCurrency(order.totalAmount) || 0}</Text> {/* Thành tiền mặc định nếu không có */}
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
