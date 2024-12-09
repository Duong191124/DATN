import React, { useState } from "react";
import { Button, Modal, Select, Input, notification } from "antd";
import {
  cancelOrderGhn,
  updateStatusOrder,
} from "../../../../service/api.service";

const CancelOrder = ({ orderId, orderStatus, handleCancelSuccess, t }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const cancelReasons = [
    t("MES-159"), // Chuyển sang đơn hàng khác
    t("MES-160"), // Sản phẩm không đúng mô tả
    t("MES-161"), // Lý do cá nhân
    t("MES-162"),
  ];

  const handleCancel = () => {
    setIsModalVisible(true); // Mở modal khi khách hàng nhấn "Hủy"
  };

  const handleSubmitCancel = () => {
    if (cancelReason === t("MES-162") && !cancelNote) {
      notification.warning({
        message: t("MES-165"),
        description: t("MES-167"),
        placement: "top",
      });
      return;
    }
    if (!cancelNote) {
      notification.warning({
        message: t("MES-165"),
        description: t("MES-166"),
        placement: "top",
      });
      return;
    }

    canceledOrder(orderId, "cancelled", cancelNote);
    setIsModalVisible(false); // Đóng modal sau khi gửi yêu cầu
  };

  const canceledOrder = async (orderId, status, cancelNote) => {
    try {
      const res = await updateStatusOrder(orderId, status, cancelNote);
      const trackingId = res.data.data.trackingId;
      await cancelOrderGhn(trackingId);
      notification.info({
        message: t("MES-163"),
        description: t("MES-164"),
        placement: "top",
        duration: 2,
      });
      const updatedOrderStatus = res.data.data.status || "cancelled";
      if (handleCancelSuccess) {
        handleCancelSuccess(orderId, updatedOrderStatus);
      }
    } catch (error) {
      notification.error({
        message: "Lỗi khi hủy đơn hàng",
        description: JSON.stringify(error.message),
        placement: "top",
      });
    }
  };

  return (
    <div>
      {["pending", "confirmed", "shipping"].includes(orderStatus) && (
        <Button style={{ marginRight: 10 }} onClick={handleCancel}>
          {t("MES-156")}
        </Button>
      )}

      <Modal
        title={t("MES-155")}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            {t("MES-112")}
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitCancel}>
            {t("MES-156")}
          </Button>,
        ]}
      >
        <Select
          value={cancelReason}
          onChange={(value) => {
            setCancelReason(value);
            setCancelNote(value); // Cập nhật lý do hủy khi chọn lý do
          }}
          style={{ width: "100%" }}
          placeholder={t("MES-157")}
        >
          {cancelReasons.map((reason, index) => (
            <Select.Option key={index} value={reason}>
              {reason}
            </Select.Option>
          ))}
        </Select>

        {cancelReason === t("MES-162") && (
          <Input
            style={{ marginTop: 10 }}
            placeholder={t("MES-157")}
            value={cancelNote}
            onChange={(e) => setCancelNote(e.target.value)} // Cập nhật lý do hủy khi người dùng nhập
          />
        )}
      </Modal>
    </div>
  );
};

export default CancelOrder;
