import React, { useEffect, useState } from "react";
import {
  Tabs,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  message,
} from "antd";
import { NavLink } from "react-router-dom";
import {
  fetchDataOrderStatusByCustomerId,
  retryPayment,
} from "../../../../service/api.service";
import { useCheckout } from "../../../context/checkout.context";
import CancelOrder from "./customer.info.order.canceled.child";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const language = localStorage.getItem("i18nextLng") || "vi";
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);
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
    background: "#000",
    color: "#fff",
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
    { value: "pending", label: t("MES-124") },
    { value: "confirmed", label: t("MES-125") },
    { value: "shipping", label: t("MES-126") },
    { value: "delivered", label: t("MES-127") },
    { value: "completed", label: t("MES-128") },
    { value: "cancelled", label: t("MES-129") },
  ];

  // Hàm để lấy label theo orderStatus
  const getOrderStatusLabel = (orderStatus) => {
    const status = statusOptions.find((option) => option.value === orderStatus);
    return status ? status.label : "Unknown Status";
  };
  const handleCancelSuccess = (cancelledOrderId) => {
    setData((prevData) =>
      prevData.map((order) =>
        order.id === cancelledOrderId
          ? { ...order, status: "cancelled" }
          : order
      )
    );
  };
  const handleRetryPayment = async (orderCode) => {
    try {
      if (orderCode) {
        const retryResponse = await retryPayment(orderCode);
        const paymentUrl = retryResponse.data.paymentUrl;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          message.info("Không nhận được liên kết thanh toán mới.");
        }
      } else {
        message.info("Không tìm thấy đơn hàng để thanh toán.");
      }
    } catch (error) {
      message.error("Thanh toán lại thất bại. Vui lòng thử lại.");
    }
  };
  const renderOrderCard = () => {
    return data.map((order) => {
      const orderId = order.id; // Lấy id của đơn hàng
      const orderStatus = order.status; // Lấy status của đơn hàng
      const orderCode = order.code;
      const trackingId = order.trackingId;
      const vnp = order?.paymentResponses[0]?.paymentMethod;
      const vnpStatus = order?.paymentResponses[0]?.status;
      const productDetails =
        order.orderDetailResponses?.map((detail) => {
          const productDetail = detail.productDetailId || {};
          return {
            code: productDetail.code || "Mã sản phẩm",
            image: productDetail.image || "default-image-url.jpg", // Giá trị mặc định khi không có ảnh
            defaultPrice: productDetail.defaultPrice || 0,
            color: productDetail.colorName || "N/A",
            size: productDetail.sizeName || "N/A",
            price: detail.price || 0, // Giá mặc định nếu không có giá
            quantity: detail.quantity || 1, // Số lượng mặc định nếu không có
            name: productDetail?.productDTO?.name || "",
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
                ? `/info-order-cancelled?code=${orderCode}`
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
                    style={{
                      display: "flex",
                      gap: "10px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                    }}
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
                      <Text strong>{product.name}</Text>
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
                        {product.defaultPrice &&
                          product.price < product.defaultPrice && (
                            <Text delete style={{ marginRight: 8 }}>
                              {formatCurrency(product.defaultPrice)}
                            </Text>
                          )}
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
              {t("MES-144")}:
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
              {t("MES-134")}:
            </Text>
            <Text style={priceStyle}>
              {formatCurrency(order.totalAmount) || 0}
            </Text>{" "}
            {/* Thành tiền mặc định nếu không có */}
          </Row>
          <Row justify="end" style={{ marginTop: 16 }}>
            <CancelOrder
              orderId={orderId}
              orderStatus={orderStatus}
              handleCancelSuccess={handleCancelSuccess}
              t={t}
            />
            {orderStatus === "pending" && vnp === "VNP" && vnpStatus === 0 && (
              <Button
                type="default"
                onClick={() => handleRetryPayment(orderCode)}
                key="retry"
              >
                {t("MES-232")}
              </Button>
            )}
            {orderStatus !== "confirmed" &&
              orderStatus !== "pending" &&
              trackingId && (
                <Button
                  style={secondaryButtonStyle}
                  onClick={() => {
                    window.location.href = `/tracking?tracking_code=${trackingId}`;
                  }}
                >
                  TrackingOrder
                </Button>
              )}
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
          <TabPane tab={t("MES-123")} key="1"></TabPane>
          <TabPane tab={t("MES-124")} key="2"></TabPane>
          <TabPane tab={t("MES-125")} key="3"></TabPane>
          <TabPane tab={t("MES-126")} key="4"></TabPane>
          <TabPane tab={t("MES-127")} key="5"></TabPane>
          <TabPane tab={t("MES-128")} key="6"></TabPane>
          <TabPane tab={t("MES-129")} key="7"></TabPane>
        </Tabs>
      </div>
      <div>
        {data.length > 0 ? (
          renderOrderCard()
        ) : (
          <Text type="secondary">{t("MES-130")}</Text>
        )}
      </div>
    </div>
  );
};

export default CustomerInfoOrder;
