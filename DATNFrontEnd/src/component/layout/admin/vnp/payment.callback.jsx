import React, { useEffect, useState } from "react";
import { Result, Spin, Button } from "antd";
import { paymentCallBack } from "../../../../service/api.service";

const PaymentCallback = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(""); // Track payment method
  console.log("orr", orderId);

  useEffect(() => {
    // For normal payment (cash), get status from localStorage
    const paymentStatus = localStorage.getItem("paymentStatus");
    const paymentMessage = localStorage.getItem("paymentMessage");
    if (paymentStatus) {
      setStatus(paymentStatus); // Set status from localStorage
      setMessage(paymentMessage);
    } else {
      // If it's a VNPay response, fetch the status from the API as before
      const fetchPaymentStatus = async () => {
        try {
          const response = await paymentCallBack();
          const { status, message, orderId, paymentMethod } = response.data;
          setStatus(status.toLowerCase());
          setMessage(message);
          if (orderId) {
            setOrderId(orderId);
          }
          setPaymentMethod(paymentMethod); // Set payment method for VNPay
        } catch (error) {
          setStatus("error");
          setMessage(
            error.response?.data?.message || "Đã xảy ra lỗi không xác định"
          );
        }
      };

      fetchPaymentStatus();
    }
  }, []);

  const handleBackToSales = () => {
    // Remove payment information from localStorage
    localStorage.removeItem("paymentStatus");
    localStorage.removeItem("paymentMessage");
    window.location.href = "/";
  };

  const handleViewOrder = () => {
    // Remove payment information from localStorage and redirect to order page
    localStorage.removeItem("paymentStatus");
    localStorage.removeItem("paymentMessage");
    // window.location.href = `/order-details/${orderId}`; // Adjust URL as per your order details page
  };
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Success UI
  if (status === "success") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Result
          status="success"
          title={`Thanh toán ${
            paymentMethod === "VNP" ? "VNPay" : "OCD"
          } thành công!`}
          subTitle={`Đơn hàng của bạn (Code: ${orderId}) đã được xử lý thành công.`}
          extra={[
            <Button type="primary" onClick={handleBackToSales} key="back">
              Quay lại bán hàng
            </Button>,
            <Button type="default" onClick={handleViewOrder} key="viewOrder">
              Xem đơn hàng
            </Button>,
          ]}
        />
      </div>
    );
  }

  // Failed UI
  if (status === "failed") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Result
          status="error"
          title="Thanh toán thất bại"
          subTitle={message || "Hệ thống không thể xử lý thanh toán của bạn."}
          extra={[
            <Button type="primary" onClick={handleBackToSales} key="back">
              Quay lại bán hàng
            </Button>,
          ]}
        />
      </div>
    );
  }

  // Invalid Hash or Unknown Error UI
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Result
        status="warning"
        title="Yêu cầu không hợp lệ"
        subTitle={
          message ||
          "Đã xảy ra lỗi. Vui lòng kiểm tra lại thông tin thanh toán."
        }
        extra={[
          <Button type="primary" onClick={handleBackToSales} key="back">
            Quay lại bán hàng
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaymentCallback;
