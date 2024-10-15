import React, { useState } from "react";
import { Modal, Table, Button, notification, Pagination } from "antd";

const CounterSaleStaff = ({
  staffList,
  onStaffSelect,
  total,
  page,
  size,
  setPage,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null); // Nhân viên đã chọn

  const columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "id",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
    },
    {
      title: "Chọn",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleStaffSelect(record)}
          disabled={selectedStaff !== null && selectedStaff.id !== record.id} // Chỉ cho phép chọn 1 nhân viên
        >
          {selectedStaff?.id === record.id ? "Đã chọn" : "Chọn"}
        </Button>
      ),
    },
    {
      title: "Hủy chọn",
      render: (_, record) => (
        <Button
          type="default"
          danger
          onClick={() => handleStaffDeselect(record)}
          disabled={selectedStaff?.id !== record.id} // Chỉ hiển thị "Hủy chọn" khi nhân viên này đã chọn
        >
          Hủy chọn
        </Button>
      ),
    },
  ];
  // Hàm xử lý chọn nhân viên
  const handleStaffSelect = (staff) => {
    if (selectedStaff?.id === staff.id) {
      return;
    }
    setSelectedStaff(staff); // Lưu nhân viên đã chọn vào state
    onStaffSelect(staff); // Gọi callback từ component cha
    notification.success({
      message: "Nhân viên đã được chọn",
      description: `Nhân viên ${staff.name} đã được chọn để thanh toán.`,
    });
  };

  // Hàm xử lý hủy chọn nhân viên
  const handleStaffDeselect = (staff) => {
    if (selectedStaff?.id === staff.id) {
      setSelectedStaff(null); // Hủy chọn nhân viên hiện tại
      onStaffSelect(null); // Thông báo cho component cha rằng không có nhân viên nào được chọn
      notification.info({
        message: "Đã hủy chọn nhân viên",
        description: `Nhân viên ${staff.name} đã bị hủy chọn.`,
      });
    }
  };

  return (
    <>
      <h3 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
        Nhân viên
      </h3>
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        style={{ marginBottom: "10px" }}
      >
        <span>+</span> Chọn nhân viên
      </Button>
      {/* Modal chọn nhân viên */}
      <Modal
        title="Chọn nhân viên để thanh toán"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={staffList}
          pagination={false}
          size="middle"
          rowClassName="clickable-row"
        />
        <Pagination
          style={{ marginTop: "10px" }}
          current={page}
          total={total}
          pageSize={size}
          onChange={(newPage) => setPage(newPage)} // Cập nhật trang khi người dùng thay đổi
        />
      </Modal>
    </>
  );
};

export default CounterSaleStaff;
