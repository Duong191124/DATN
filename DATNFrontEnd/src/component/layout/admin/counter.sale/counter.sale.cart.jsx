import { Table, Button, Modal } from "antd";
import { useState } from "react";

const CounterSaleCart = ({ cartItems, onRemoveFromCart, onUpdateQuantity }) => {
  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có muốn xóa sản phẩm này không?",
        onOk: () => onRemoveFromCart(item.id),
      });
    } else {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = (item) => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };
  const handleRemove = (item) => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      onOk: () => onRemoveFromCart(item.id),
    });
  };

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productResponse",
      render: (productResponse) => {
        return productResponse && productResponse.name
          ? productResponse.name
          : "Chưa có tên sản phẩm";
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (quantity, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button onClick={() => handleDecrease(record)}>-</Button>
          <span style={{ margin: "0 10px" }}>{quantity}</span>
          <Button onClick={() => handleIncrease(record)}>+</Button>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (price) => {
        return price ? `${price.toLocaleString()} VNĐ` : "Chưa có giá";
      },
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button onClick={() => handleRemove(record)} danger>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <>
      <h3 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
        Giỏ hàng
      </h3>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={cartItems}
        pagination={false}
        size="small"
        style={{ border: "1px solid #ddd" }}
      />
    </>
  );
};

export default CounterSaleCart;
