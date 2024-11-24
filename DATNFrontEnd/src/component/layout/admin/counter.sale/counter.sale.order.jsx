import React, { useState } from "react";
import { Tabs, Button, Modal, Dropdown, Menu, Spin } from "antd";
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
      canceledOrder(billToCancel.id); // Hủy hóa đơn
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
    </>
  );
};

export default CounterSaleBillWaiting;
