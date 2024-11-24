import { Table, Button, Modal, Input, message, notification } from "antd";
import { useState } from "react";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./order.css";

const CounterSaleCart = ({
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
  dataProductDetail,
}) => {
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
    const productDetail = dataProductDetail.find(
      (product) => product.id === item.id
    );

    if (productDetail) {
      const newQuantity = item.quantity + 1;
      if (newQuantity > productDetail.quantity) {
        notification.warning({
          message: "Số lượng",
          description: `Số lượng tồn kho chỉ có ${productDetail.quantity} sản phẩm`,
          duration: 2,
          placement: "bottomLeft",
        });
        return;
      }
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleQuantityChange = (e, record) => {
    const newQuantity = Number(e.target.value);
    const productDetail = dataProductDetail.find(
      (productDetail) => productDetail.id === record.id
    );

    if (productDetail) {
      if (newQuantity > productDetail.quantity) {
        notification.warning({
          message: "Số lượng",
          description: `Số lượng tồn kho chỉ có ${productDetail.quantity} sản phẩm`,
          duration: 2,
          placement: "bottomLeft",
        });
        return;
      }
    }

    if (newQuantity <= 0) {
      notification.warning({
        message: "Số lượng",
        description: "Số lượng không thể nhỏ hơn 1",
        duration: 2,
        placement: "bottomLeft",
      });
      onUpdateQuantity(record.id, 1);
      return;
    }

    if (newQuantity >= 1000) {
      notification.warning({
        message: "Số lượng",
        description: "Số lượng không thể lớn hơn 1000",
        duration: 2,
        placement: "bottomLeft",
      });
      onUpdateQuantity(record.id, 1);
      return;
    }

    onUpdateQuantity(record.id, newQuantity);
  };

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productResponse",
      render: (productResponse) =>
        productResponse?.name || "Chưa có tên sản phẩm",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (quantity, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            icon={<MinusOutlined />}
            onClick={() => handleDecrease(record)}
          />
          <Input
            type="number"
            value={quantity > 0 ? quantity : 1}
            onChange={(e) => handleQuantityChange(e, record)}
            style={{
              width: "60px",
              textAlign: "center",
              margin: "0 10px",
            }}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleIncrease(record)}
          />
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "defaultPrice",
      render: (text, record) => {
        const { discountPrice, defaultPrice } = record;
        return (
          <div>
            {discountPrice && discountPrice < defaultPrice ? (
              <>
                <span style={{ textDecoration: "line-through", color: "gray" }}>
                  {defaultPrice.toLocaleString()} VNĐ
                </span>
                <span style={{ marginLeft: "8px", color: "red" }}>
                  {discountPrice.toLocaleString()} VNĐ
                </span>
              </>
            ) : (
              <span>
                {(discountPrice || defaultPrice).toLocaleString()} VNĐ
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      render: (color) => color?.name || "Chưa có tên màu",
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      render: (size) => size?.name || "Chưa có kích thước",
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => onRemoveFromCart(record.id)}
          danger
        />
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={cartItems}
      pagination={false}
      size="small"
      style={{
        border: "1px solid #ddd",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      className="custom-table"
    />
  );
};

export default CounterSaleCart;
