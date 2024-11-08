import React, { useState, useEffect } from "react";
import { Table, Checkbox, Button, Modal, message } from "antd";

const CounterSaleBillWaiting = ({
  billItems,
  tempBillItems,
  onRemoveBill,
  onSelectBill,
  selectedBill,
  onMoveBillToTemp,
  onSwapBills,
  setSelectedBill,
  onMoveBillToWaiting,
  canceledOrder,
}) => {
  const [selectedTempBill, setSelectedTempBill] = useState(null);
  const [selectedWaitingBill, setSelectedWaitingBill] = useState(null);
  const [isTempBillModalVisible, setIsTempBillModalVisible] = useState(false); // Modal for temp bills

  useEffect(() => {}, [selectedTempBill, selectedWaitingBill]);

  const handleSwapBills = () => {
    if (!selectedTempBill || !selectedWaitingBill) {
      message.error(
        "Vui lòng chọn một hóa đơn tạm chờ và một hóa đơn chờ để hoán đổi."
      );
      return;
    }
    // Hoán đổi logic ở đây
    onSwapBills(selectedTempBill, selectedWaitingBill);
    // Reset lại lựa chọn sau khi hoán đổi
    setSelectedTempBill(null);
    setSelectedWaitingBill(null);
    message.success("Hoán đổi hóa đơn thành công.");
    setSelectedWaitingBill(null);
    setSelectedBill(null);
  };
  // Hàm để thay đổi trạng thái chọn hóa đơn
  const handleCheckboxChange = (code, type) => {
    if (type === "waiting") {
      setSelectedWaitingBill(code === selectedWaitingBill ? null : code);
      setSelectedBill(code === selectedBill ? null : code);
    } else if (type === "temp") {
      setSelectedTempBill(code === selectedTempBill ? null : code);
    }
  };
  const handleMoveToTemp = () => {
    if (!selectedWaitingBill) {
      message.error("Vui lòng chọn hóa đơn từ danh sách chờ.");
      return;
    }
    onMoveBillToTemp(selectedWaitingBill);
    setSelectedWaitingBill(null);
    setSelectedBill(null);
  };
  const handleMoveToWaiting = () => {
    if (!selectedTempBill) {
      message.error("Vui lòng chọn hóa đơn từ danh sách tạm chờ.");
      return;
    }
    onMoveBillToWaiting(selectedTempBill);
    setSelectedTempBill(null);
    setSelectedBill(null);
  };
  // Hàm mở modal "Hóa đơn tạm chờ"
  const openTempBillsModal = () => {
    setIsTempBillModalVisible(true);
  };

  const columns = [
    {
      title: "Chọn",
      key: "select",
      render: (_, record) => (
        <Checkbox
          checked={selectedBill === record.code}
          onChange={() => {
            onSelectBill(record.code);
            handleCheckboxChange(record.code, "waiting");
          }}
        />
      ),
    },
    { title: "Mã hóa đơn", dataIndex: "code", key: "code" },
    {
      title: "Khách hàng",
      key: "customer.name",
      render: (text, record) =>
        record.customerResponse
          ? record.customerResponse.name
          : "Chưa có khách hàng",
    },
    {
      title: "Nhân viên",
      key: "staff.name",
      render: (text, record) =>
        record.staffResponse ? record.staffResponse.name : "Chưa có nhân viên",
    },
    { title: "Thời gian", dataIndex: "orderDate", key: "orderDate" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (text === "pending" ? "Chờ xử lý" : text),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button size="small" danger onClick={() => canceledOrder(record.id)}>
          Hủy
        </Button>
      ),
    },
  ];

  const tempColumns = [
    {
      title: "Chọn",
      key: "select",
      render: (_, record) => (
        console.log("reccc", record),
        (
          <Checkbox
            checked={selectedTempBill === record.code}
            onChange={() => handleCheckboxChange(record.code, "temp")}
          />
        )
      ),
    },
    {
      title: "Mã hóa đơn",
      key: "code",
      render: (text, record) =>
        record.code ? record.code : "Chưa có mã hóa đơn",
    },
    {
      title: "Khách hàng",
      key: "customer.name",
      render: (text, record) =>
        record.customerResponse
          ? record.customerResponse.name
          : "Chưa có khách hàng",
    },
    {
      title: "Nhân viên",
      key: "staff.name",
      render: (text, record) =>
        record.staffResponse ? record.staffResponse.name : "Chưa có nhân viên",
    },
    {
      title: "Thời gian",
      key: "time",
      render: (text, record) =>
        record.orderDate ? record.orderDate : "Chưa có thời gian",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button size="small" onClick={handleMoveToWaiting}>
          Lấy ra hóa đơn
        </Button>
      ),
    },
  ];

  return (
    <>
      <h3 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
        Hóa đơn chờ
      </h3>
      <Table
        rowKey="code"
        columns={columns}
        // dataSource={billItems}
        dataSource={Array.isArray(billItems) ? billItems : []}
        pagination={false}
        style={{ border: "1px solid #ddd", marginBottom: "20px" }}
      />
      <Button
        type="primary"
        onClick={handleMoveToTemp}
        disabled={!selectedWaitingBill}
      >
        Chuyển sang hóa đơn tạm chờ
      </Button>

      {/* Nút mở modal "Hóa đơn tạm chờ" */}
      <Button
        type="default"
        onClick={openTempBillsModal}
        style={{ margin: "20px 0px 0px 20px" }}
      >
        Hóa đơn tạm chờ
      </Button>

      {/* Modal hiển thị hóa đơn tạm chờ */}
      <Modal
        title="Hóa đơn tạm chờ"
        visible={isTempBillModalVisible}
        onCancel={() => setIsTempBillModalVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setIsTempBillModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        <Table
          rowKey="code"
          columns={tempColumns}
          dataSource={tempBillItems}
          pagination={false}
          style={{
            border: "1px solid #ddd",
            marginBottom: "20px",
          }}
        />
        <Button
          type="primary"
          onClick={handleSwapBills}
          disabled={!selectedTempBill || !selectedWaitingBill}
        >
          Hoán đổi hóa đơn
        </Button>
      </Modal>
    </>
  );
};

export default CounterSaleBillWaiting;
