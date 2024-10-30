import React, { useState, useEffect } from "react";
import { Table, Checkbox, Button, Modal, message } from "antd";

const CounterSaleBillWaiting = ({
  billItems,
  tempBillItems, // Hóa đơn tạm chờ
  onRemoveBill,
  onSelectBill,
  selectedBill,
  onMoveBillToTemp, // Chuyển hóa đơn từ danh sách chờ sang tạm chờ
  onSwapBills, // Hoán đổi giữa hóa đơn tạm chờ và chờ
  setSelectedBill,
  onMoveBillToWaiting, // Chuyển hóa đơn từ tạm chờ sang chờ
}) => {
  const [selectedTempBill, setSelectedTempBill] = useState(null);
  const [selectedWaitingBill, setSelectedWaitingBill] = useState(null);
  const [isTempBillModalVisible, setIsTempBillModalVisible] = useState(false); // Modal for temp bills

  useEffect(() => {}, [selectedTempBill, selectedWaitingBill]);

  const handleRemoveBill = (billId) => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn xóa hóa đơn này không?",
      onOk: () => onRemoveBill(billId),
    });
  };
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
  const handleCheckboxChange = (billId, type) => {
    if (type === "waiting") {
      setSelectedWaitingBill(billId === selectedWaitingBill ? null : billId);
      setSelectedBill(billId === selectedBill ? null : billId);
    } else if (type === "temp") {
      setSelectedTempBill(billId === selectedTempBill ? null : billId);
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
    setSelectedTempBill(null); // Reset lựa chọn sau khi chuyển
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
          checked={selectedBill === record.billId}
          onChange={() => {
            onSelectBill(record.billId);
            handleCheckboxChange(record.billId, "waiting");
          }}
        />
      ),
    },
    { title: "Mã hóa đơn", dataIndex: "billId", key: "billId" },
    {
      title: "Khách hàng",
      key: "customer.name",
      render: (text, record) =>
        record.customer ? record.customer.name : "Chưa có khách hàng",
    },
    {
      title: "Nhân viên",
      key: "staff.name",
      render: (text, record) =>
        record.staff ? record.staff.name : "Chưa có nhân viên",
    },
    { title: "Thời gian", dataIndex: "time", key: "time" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          size="small"
          danger
          onClick={() => handleRemoveBill(record.billId)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const tempColumns = [
    {
      title: "Chọn",
      key: "select",
      render: (_, record) => (
        <Checkbox
          checked={selectedTempBill === record.billId}
          onChange={() => handleCheckboxChange(record.billId, "temp")}
        />
      ),
    },
    { title: "Mã hóa đơn", dataIndex: "billId", key: "billId" },
    {
      title: "Khách hàng",
      key: "customer.name",
      render: (text, record) =>
        record.customer ? record.customer.name : "Chưa có khách hàng",
    },
    {
      title: "Nhân viên",
      dataIndex: "staff.name",
      key: "staff.name",
      render: (text, record) =>
        record.staff ? record.staff.name : "Chưa có nhân viên",
    },
    { title: "Thời gian", dataIndex: "time", key: "time" },
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
        rowKey="billId"
        columns={columns}
        dataSource={billItems}
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
          rowKey="billId"
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
