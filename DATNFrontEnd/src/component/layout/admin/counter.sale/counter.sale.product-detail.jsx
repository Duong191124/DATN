import { Button, InputNumber, Modal, notification, Table } from "antd";
import { useState } from "react";

const CounterSalesProductDetail = ({
  dataProductDetail,
  onAddToCart,
  selectedBill,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
  const [modalVisible, setModalVisible] = useState(false); // Kiểm tra trạng thái Modal

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productResponse",
      render: (text, record) => {
        console.log("record", record.productResponse.name);
        return record.productResponse.name;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (text) => `${text.toLocaleString()} VNĐ`,
    },
    {
      title: "Size",
      dataIndex: "sizeId",
      render: (text, record) => {
        return record.size.name;
      },
    },
    {
      title: "Màu",
      dataIndex: "color",
      render: (text, record) => {
        return record.color.name;
      },
    },
    {
      title: "Thêm vào giỏ",
      render: (_, record) => (
        <Button onClick={() => handleAddToCart(record)}>Thêm vào giỏ</Button>
      ),
    },
  ];

  const handleAddToCart = (record) => {
    if (!selectedBill) {
      notification.error({
        message: "Chưa chọn hóa đơn!",
        description:
          "Vui lòng chọn hóa đơn trước khi thêm sản phẩm vào giỏ hàng.",
      });
      return;
    }
    // Nếu đã chọn hóa đơn, mở modal để nhập số lượng
    setSelectedRow(record);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    const productToAdd = {
      ...selectedRow,
      quantity,
    };
    if (selectedRow.productResponse && selectedRow.productResponse.name) {
      onAddToCart(productToAdd, quantity);
      notification.success({
        message: "Sản phẩm đã được thêm vào giỏ hàng",
        description: `${selectedRow.productResponse.name} x ${quantity} đã được thêm vào giỏ hàng.`,
      });
    } else {
      notification.error({
        message: "Lỗi",
        description: "Sản phẩm không có thông tin hợp lệ.",
      });
    }

    setModalVisible(false); // Đóng modal sau khi thêm vào giỏ hàng
    setQuantity(1); // Reset số lượng về mặc định
  };

  return (
    <>
      <h3 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
        Chi tiết sản phẩm
      </h3>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataProductDetail}
        size="small"
        style={{ border: "1px solid #ddd" }}
      />

      <Modal
        title={`Nhập số lượng cho sản phẩm ${selectedRow?.productResponse?.name}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirm}>
            Thêm
          </Button>,
        ]}
      >
        <div>
          <span>Nhập số lượng: </span>
          <InputNumber
            min={1}
            max={selectedRow?.quantity}
            value={quantity}
            onChange={(value) => setQuantity(value)}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <span>Thông tin sản phẩm:</span>
          <div>
            <strong>Mã sản phẩm:</strong> {selectedRow?.code}
          </div>
          <div>
            <strong>Size:</strong> {selectedRow?.size?.name}
          </div>
          <div>
            <strong>Màu:</strong> {selectedRow?.color?.name}
          </div>
          <div>
            <strong>Giá:</strong> {selectedRow?.price?.toLocaleString()} VNĐ
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CounterSalesProductDetail;
