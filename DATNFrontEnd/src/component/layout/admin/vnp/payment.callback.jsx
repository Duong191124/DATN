import React, { useEffect, useState } from "react";
import { Result, Spin, Button } from "antd";
import { paymentCallBack } from "../../../../service/api.service";

const PaymentCallback = () => {
  const [status, setStatus] = useState("loading"); // Trạng thái: loading, success, failed, invalid
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await paymentCallBack();
        const { status, message, orderId } = response.data;
        setStatus(status.toLowerCase());
        setMessage(message);
        if (orderId) {
          setOrderId(orderId);
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || "Đã xảy ra lỗi không xác định"
        );
      }
    };

    fetchPaymentStatus();
  }, []);

  const handleBackToSales = () => {
    window.location.href = "/counter-sales";
  };

  // Loading UI
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Chiếm toàn bộ chiều cao của màn hình
          textAlign: "center", // Căn giữa nội dung trong div
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
          height: "100vh", // Chiếm toàn bộ chiều cao của màn hình
          textAlign: "center", // Căn giữa nội dung trong div
        }}
      >
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={`Đơn hàng của bạn (Code: ${orderId}) đã được xử lý thành công.`}
          extra={[
            <Button type="primary" onClick={handleBackToSales} key="back">
              Quay lại bán hàng
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
          height: "100vh", // Chiếm toàn bộ chiều cao của màn hình
          textAlign: "center", // Căn giữa nội dung trong div
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
        height: "100vh", // Chiếm toàn bộ chiều cao của màn hình
        textAlign: "center", // Căn giữa nội dung trong div
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
