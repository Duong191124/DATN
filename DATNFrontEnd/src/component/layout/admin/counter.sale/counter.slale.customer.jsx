import React, { useState } from "react";
import { Modal, Table, Button, notification, Pagination } from "antd";

const CounterSaleCustomer = ({
  customerList,
  onCustomerSelect,
  total,
  page,
  size,
  setPage,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Nhân viên đã chọn

  const columns = [
    {
      title: "Mã khách hàng",
      dataIndex: "id",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
    },
    {
      title: "Chọn",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleCustomerSelect(record)}
          disabled={
            selectedCustomer !== null && selectedCustomer.id !== record.id
          } // Chỉ cho phép chọn 1 nhân viên
        >
          {selectedCustomer?.id === record.id ? "Đã chọn" : "Chọn"}
        </Button>
      ),
    },
    {
      title: "Hủy chọn",
      render: (_, record) => (
        <Button
          type="default"
          danger
          onClick={() => handleCustomerDeselect(record)}
          disabled={selectedCustomer?.id !== record.id} // Chỉ hiển thị "Hủy chọn" khi nhân viên này đã chọn
        >
          Hủy chọn
        </Button>
      ),
    },
  ];
  // Hàm xử lý chọn customer
  const handleCustomerSelect = (customer) => {
    if (selectedCustomer?.id === customer.id) {
      return;
    }
    setSelectedCustomer(customer);
    onCustomerSelect(customer);
    notification.success({
      message: "Khách hàng đã được chọn",
      description: `Khách hàng ${customer.name} đã được chọn để thanh toán.`,
    });
  };

  // Hàm xử lý hủy chọn customer
  const handleCustomerDeselect = (customer) => {
    if (selectedCustomer?.id === customer.id) {
      setSelectedCustomer(null); // Hủy chọn nhân viên hiện tại
      onCustomerSelect(null); // Thông báo cho component cha rằng không có nhân viên nào được chọn
      notification.info({
        message: "Đã hủy chọn khách hàng",
        description: `Khách hàng ${customer.name} đã bị hủy chọn.`,
      });
    }
  };

  return (
    <>
      <h3 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
        Khách hàng
      </h3>
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        style={{ marginBottom: "10px" }}
      >
        <span>+</span> Chọn khách hàng
      </Button>
      <Modal
        title="Chọn khách hàng để thanh toán"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={customerList}
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

export default CounterSaleCustomer;
