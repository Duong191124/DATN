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
}) => {
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // Modal chi tiết hóa đơn
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false); // Modal nhập lý do hủy hóa đơn
  const [cancelReason, setCancelReason] = useState("");
  const [selectedBillDetail, setSelectedBillDetail] = useState(null); // Hóa đơn đang được xem chi tiết
  const handleTabChange = (key) => {
    if (key === "create") {
      const newBill = handleCreateBillWaiting();
      if (newBill && newBill.code) {
        setSelectedBill(newBill.code);
        setActiveTab(newBill.code);
      }
    } else {
      setActiveTab(key); // Cập nhật tab đang chọn
      setSelectedBill(key); // Đặt hóa đơn được chọn là tab hiện tại
    }
  };

  const handleTabClose = (targetKey) => {
    const billToCancel = billItems.find((bill) => bill.code === targetKey);
    if (billToCancel) {
      showCancelModal(billToCancel); // Hiển thị modal nhập lý do hủy
    }
  };

  const showDetailModal = (bill) => {
    setSelectedBillDetail(bill);
    setIsDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedBillDetail(null);
  };

  const showCancelModal = (bill) => {
    setSelectedBillDetail(bill); // Lưu lại bill cần hủy
    setIsCancelModalVisible(true); // Hiển thị modal nhập lý do
  };

  const closeCancelModal = () => {
    setIsCancelModalVisible(false); // Đóng modal nhập lý do
    setCancelReason(""); // Reset lý do hủy
  };
  const handleCancelOrder = async () => {
    const orderId = selectedBillDetail?.id;
    const reason = cancelReason.trim();
    if (!reason) {
      notification.error({
        message: "Lý do hủy không hợp lệ",
        description: "Vui lòng nhập lý do hủy đơn hàng.",
      });
      return;
    }
    try {
      await canceledOrder(orderId, reason); // Gọi API hủy đơn với lý do
      setIsCancelModalVisible(false); // Đóng modal sau khi hủy
    } catch (error) {
      notification.warning({
        message: "Hủy hóa đơn thất bại",
        description: error?.message || "Đã có lỗi xảy ra khi hủy hóa đơn.",
        duration: 2,
        placement: "bottomLeft",
      });
    }
  };
  const moreOptionsMenu = (bill) => (
    <Menu>
      <Menu.Item key="details" onClick={() => showDetailModal(bill)}>
        Xem chi tiết
      </Menu.Item>
    </Menu>
  );

  // Chỉ hiển thị danh sách hóa đơn, không có dấu cộng trong các hóa đơn
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
              <Dropdown
                overlay={moreOptionsMenu(bill)}
                trigger={["click"]}
                placement="bottomRight"
              >
                <EllipsisOutlined
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                />
              </Dropdown>
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
        activeKey={activeTab}
        onChange={handleTabChange}
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
            key: "create",
            closable: false,
          },
        ]}
      />

      {/* Modal chi tiết hóa đơn */}
      <Modal
        title={`Chi tiết Hóa Đơn ${selectedBillDetail?.code || ""}`}
        visible={isDetailModalVisible}
        onCancel={closeDetailModal}
        footer={[
          <Button key="close" onClick={closeDetailModal}>
            Đóng
          </Button>,
        ]}
      >
        {selectedBillDetail && (
          <div>
            <p>
              Khách hàng:{" "}
              {selectedBillDetail.customerResponse?.name ||
                "Chưa có khách hàng"}
            </p>
            <p>
              Nhân viên:{" "}
              {selectedBillDetail.staffResponse?.name || "Chưa có nhân viên"}
            </p>
            <p>
              Thời gian: {selectedBillDetail.orderDate || "Chưa có thời gian"}
            </p>
          </div>
        )}
      </Modal>
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
