import React from "react";
import { Table, Checkbox, Button, Modal } from "antd";

const CounterSaleBillWaiting = ({
  billItems,
  onRemoveBill,
  onSelectBill,
  selectedBill,
}) => {
  const handleRemoveBill = (billId) => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn xóa hóa đơn này không?",
      onOk: () => onRemoveBill(billId),
    });
  };

  const columns = [
    {
      title: "Chọn",
      key: "select",
      render: (_, record) => (
        <Checkbox
          checked={selectedBill === record.billId}
          onChange={() => onSelectBill(record.billId)}
        />
      ),
    },
    { title: "Mã hóa đơn", dataIndex: "billId", key: "billId" },
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
        style={{ border: "1px solid #ddd" }}
      />
    </>
  );
};

export default CounterSaleBillWaiting;
