import React, { useState } from "react";
import {
  Tabs,
  Button,
  Modal,
  Dropdown,
  Menu,
  Spin,
  notification,
  Input,
} from "antd";
import { PlusOutlined, EllipsisOutlined } from "@ant-design/icons";
import "./order.css";
const CounterSaleBillWaiting = ({
  billItems,
  setSelectedBill,
  canceledOrder,
  handleCreateBillWaiting,
  activeTab,
  setActiveTab,
  isCreatingBill,
}) => {
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false); // Modal nhập lý do hủy hóa đơn
  const [cancelReason, setCancelReason] = useState("");
  const [selectedBillDetail, setSelectedBillDetail] = useState(null); // Hóa đơn đang được xem chi tiết

  const handleTabChange = async (key) => {
    if (key === "create") {
      if (isCreatingBill) return;
      const newBill = await handleCreateBillWaiting();
      if (newBill && newBill.code) {
        setSelectedBill(newBill.code);
        setActiveTab(newBill.code);
      }
    } else {
      if (activeTab === key) {
        setActiveTab(null);
        setSelectedBill(null);
        return;
      } else {
        setActiveTab(key);
        setSelectedBill(key);
        return;
      }
    }
  };

  const handleTabClose = (targetKey) => {
    const billToCancel = billItems.find((bill) => bill.code === targetKey);
    if (billToCancel) {
      if (
        billToCancel.orderDetailResponses &&
        billToCancel.orderDetailResponses.length === 0
      ) {
        cancelBill(billToCancel);
      } else {
        showCancelModal(billToCancel);
      }
    }
  };

  const showCancelModal = (bill) => {
    setSelectedBillDetail(bill); // Lưu lại bill cần hủy
    setIsCancelModalVisible(true); // Hiển thị modal nhập lý do
  };

  const closeCancelModal = () => {
    setIsCancelModalVisible(false); // Đóng modal nhập lý do
    setCancelReason(""); // Reset lý do hủy
  };

  const cancelBill = async (bill) => {
    const orderId = bill.id;
    try {
      await canceledOrder(orderId, "Giỏ hàng trống");
      setActiveTab(null);
      setSelectedBill(null);
    } catch (error) {
      notification.warning({
        message: "Hủy hóa đơn thất bại",
        description: error?.message || "Đã có lỗi xảy ra khi hủy hóa đơn.",
        duration: 2,
        placement: "bottomLeft",
      });
    }
  };

  const handleCancelOrder = async () => {
    const orderId = selectedBillDetail?.id;
    const reason = cancelReason.trim();
    if (!reason) {
      notification.info({
        message: "Lý do hủy không hợp lệ",
        description: "Vui lòng nhập lý do hủy đơn hàng.",
        duration: 2,
        placement: "bottomLeft",
      });
      return;
    }
    try {
      await canceledOrder(orderId, reason);
      setCancelReason("");
      setActiveTab(null);
      setSelectedBill(null);
      setIsCancelModalVisible(false);
    } catch (error) {
      notification.warning({
        message: "Hủy hóa đơn thất bại",
        description: error?.message || "Đã có lỗi xảy ra khi hủy hóa đơn.",
        duration: 2,
        placement: "bottomLeft",
      });
    }
  };

  const tabsItems = Array.isArray(billItems)
    ? billItems.map((bill) => ({
        label: (
          <>
            <div
              id="selected-bill"
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              {activeTab === bill.code && (
                <span className="tab-check-icon">✔</span>
              )}
              <span
                style={{ marginLeft: activeTab === bill.code ? "20px" : "0" }}
              >
                Hóa đơn {bill.code}
              </span>
            </div>
          </>
        ),
        key: bill.code,
        closable: true,
      }))
    : [];

  return (
    <>
      <Tabs
        className="custom-tabs"
        hideAdd
        type="editable-card"
        activeKey={activeTab || undefined} // Chỉnh sửa để activeKey được cập nhật đúng
        onChange={handleTabChange}
        onTabClick={handleTabChange}
        onEdit={(targetKey, action) => {
          if (action === "remove") handleTabClose(targetKey);
        }}
        style={{ backgroundColor: "#1890ff", padding: "10px 10px 0 10px" }}
        items={[
          ...tabsItems,
          {
            label: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "16px",
                }}
                id="created-bill"
              >
                <PlusOutlined style={{ color: "#1890ff" }} />
              </div>
            ),
            key: "create", // Tab tạo hóa đơn mới
            closable: false,
          },
        ]}
      />

      <Modal
        title="Nhập lý do hủy hóa đơn"
        visible={isCancelModalVisible}
        onCancel={closeCancelModal}
        footer={[
          <Button key="cancel" onClick={closeCancelModal}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleCancelOrder}>
            Hủy hóa đơn
          </Button>,
        ]}
      >
        <Input
          placeholder="Nhập lý do hủy đơn hàng..."
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default CounterSaleBillWaiting;
