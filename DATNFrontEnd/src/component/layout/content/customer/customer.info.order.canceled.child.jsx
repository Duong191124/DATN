import React, { useState } from "react";
import { Button, Modal, Select, Input, notification } from "antd";
import {
  cancelOrderGhn,
  updateStatusOrder,
} from "../../../../service/api.service";

const CancelOrder = ({ orderId, orderStatus }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const cancelReasons = [
    "Chuyển sang đơn hàng khác",
    "Sản phẩm không đúng mô tả",
    "Lý do cá nhân",
    "Khác",
  ];

  const handleCancel = () => {
    setIsModalVisible(true); // Mở modal khi khách hàng nhấn "Hủy"
  };

  const handleSubmitCancel = () => {
    if (cancelReason === "Khác" && !cancelNote) {
      notification.warning({
        message: "Vui lòng nhập lý do hủy",
        description: "Hãy nhập lý do hủy!",
        placement: "top",
      });
      return;
    }
    if (!cancelNote) {
      notification.warning({
        message: "Vui lòng chọn lý do hủy",
        description: "Hãy chọn hoặc nhập lý do hủy đơn hàng!",
        placement: "top",
      });
      return;
    }

    canceledOrder(orderId, "cancelled", cancelNote); // Gửi yêu cầu hủy đơn với lý do
    setIsModalVisible(false); // Đóng modal sau khi gửi yêu cầu
  };

  const canceledOrder = async (orderId, status, cancelNote) => {
    try {
      const res = await updateStatusOrder(orderId, status, cancelNote);
      const trackingId = res.data.data.trackingId;
      await cancelOrderGhn(trackingId);
      notification.info({
        message: "Cập nhật trạng thái",
        description: "Đơn hàng đã bị hủy.",
      });
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
          Hủy
        </Button>
      )}

      <Modal
        title="Lý do hủy đơn hàng"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitCancel}>
            Hủy đơn
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
          placeholder="Chọn lý do hủy"
        >
          {cancelReasons.map((reason, index) => (
            <Select.Option key={index} value={reason}>
              {reason}
            </Select.Option>
          ))}
        </Select>

        {cancelReason === "Khác" && (
          <Input
            style={{ marginTop: 10 }}
            placeholder="Nhập lý do hủy"
            value={cancelNote}
            onChange={(e) => setCancelNote(e.target.value)} // Cập nhật lý do hủy khi người dùng nhập
          />
        )}
      </Modal>
    </div>
  );
};

export default CancelOrder;
