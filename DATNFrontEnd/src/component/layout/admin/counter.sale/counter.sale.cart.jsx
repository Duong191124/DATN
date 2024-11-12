import { Table, Button, Modal, Input, message, Form } from "antd";
import { useState, useRef } from "react";
import QRCodeScanner from "react-qr-scanner"; // Thêm thư viện quét mã QR
import { findByProductDetailCode } from "../../../../service/api.service"; // API service gọi mã quét sản phẩm
import { number } from "prop-types";
import "./order.css";
const CounterSaleCart = ({
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
  onAddToCart,
  dataProductDetail,
}) => {
  const [isScanning, setIsScanning] = useState(false); // Trạng thái quét QR
  const [productCode, setProductCode] = useState(""); // Mã sản phẩm quét được
  const [productDetail, setProductDetail] = useState(null); // Chi tiết sản phẩm sau khi quét
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm nhập vào

  // Giảm số lượng sản phẩm
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

  // Tăng số lượng sản phẩm
  const handleIncrease = (item) => {
    // Tìm sản phẩm trong mảng dữ liệu chi tiết sản phẩm
    const productDetail = dataProductDetail.find(
      (product) => product.id === item.id
    );

    if (productDetail) {
      const newQuantity = item.quantity + 1; // Số lượng mới sau khi tăng

      // Kiểm tra nếu số lượng mới vượt quá tồn kho
      if (newQuantity > productDetail.quantity) {
        message.warning(
          `Số lượng tồn kho chỉ có ${productDetail.quantity} sản phẩm`
        );
        return; // Dừng lại không cho phép tăng nếu vượt quá tồn kho
      }

      // Nếu không vượt quá tồn kho, cập nhật số lượng
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemove = (item) => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      onOk: () => onRemoveFromCart(item.id),
    });
  };

  // Thay đổi số lượng sản phẩm
  const handleQuantityChange = (e, record) => {
    const newQuantity = Number(e.target.value);
    const productDetail = dataProductDetail.find(
      (productDetail) => productDetail.id === record.id
    );
    // Kiểm tra nếu số lượng mới vượt quá tồn kho
    if (productDetail) {
      if (newQuantity > productDetail.quantity) {
        message.warning(
          `Số lượng tồn khỏ chỉ có ${productDetail.quantity} sản phẩm`
        );
        return;
      }
    }
    // Kiểm tra nếu số lượng nhỏ hơn hoặc bằng 0
    if (newQuantity <= 0) {
      message.warning("Số lượng không thể nhỏ hơn 1");
      onUpdateQuantity(record.id, 1); // Cập nhật lại thành 1
      return;
    }

    // Kiểm tra nếu số lượng lớn hơn 1000
    if (newQuantity >= 1000) {
      message.warning("Số lượng không thể lớn hơn 1000");
      onUpdateQuantity(record.id, 1); // Cập nhật lại thành 1
      return;
    }

    // Nếu tất cả điều kiện hợp lệ, cập nhật số lượng
    onUpdateQuantity(record.id, newQuantity);
  };

  const handleQRCodeScanned = (data) => {
    console.log(data, "Mã QR quét được"); // Kiểm tra xem data có null hay không
    if (data && data.text) {
      setProductCode(data.text); // Cập nhật mã sản phẩm nếu dữ liệu hợp lệ
      fetchProductDetail(data.text); // Gọi API lấy chi tiết sản phẩm
    } else {
      message.error("Không quét được mã QR hợp lệ.");
    }
  };

  // Lấy chi tiết sản phẩm từ API
  const fetchProductDetail = async (code) => {
    try {
      // Gọi API lấy chi tiết sản phẩm dựa trên mã quét
      const response = await findByProductDetailCode(code);
      console.log(response, "aafffvv");
      if (response.data) {
        // Nếu sản phẩm tồn tại, lưu thông tin sản phẩm và số lượng mặc định là 1
        setProductDetail(response.data);
        setQuantity(1); // Số lượng mặc định là 1
      } else {
        message.error("Sản phẩm không tồn tại.");
      }
    } catch (error) {
      message.error("Sản phẩm không tồn tại hoặc không thể quét mã.");
    }
  };
  // Bắt đầu quét mã QR
  const startScanning = () => {
    setIsScanning(true);
  };

  // Dừng quét mã QR
  const stopScanning = () => {
    setIsScanning(false);
  };

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    if (quantity > productDetail.quantity) {
      message.error(`Số lượng không được vượt quá ${productDetail.quantity}`);
      return;
    }
    onAddToCart({
      ...productDetail,
      quantity,
    });
    message.success("Đã thêm sản phẩm vào giỏ hàng.");
  };

  // Cấu hình cột bảng giỏ hàng
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
          <Input
            type="number"
            value={quantity ?? (quantity <= 0 ? 1 : number)}
            onChange={(e) => handleQuantityChange(e, record)} // Thêm hàm xử lý thay đổi số lượng
            style={{
              width: "60px",
              textAlign: "center",
              margin: "0 10px",
              appearance: "none" /* for Webkit browsers */,
              MozAppearance: "textfield",
            }}
          />
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
      title: "Màu sắc",
      dataIndex: "color",
      render: (color) => {
        return color && color.name ? color.name : "Chưa có tên màu";
      },
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      render: (size) => {
        return size && size.name ? size.name : "Chưa có kích thước";
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
      <Table
        rowKey="id"
        columns={columns}
        dataSource={cartItems}
        pagination={false}
        size="small"
        style={{ border: "1px solid #ddd" }}
        className="custom-table"
      />

      <Button
        type="primary"
        onClick={startScanning}
        style={{ marginTop: "20px" }}
      >
        {isScanning ? "Dừng quét QR" : "Quét mã QR sản phẩm"}
      </Button>

      {isScanning && (
        <div style={{ marginTop: "20px" }}>
          <QRCodeScanner
            delay={300} // Tùy chọn để điều chỉnh tốc độ quét
            onScan={handleQRCodeScanned}
            onError={(err) => {
              console.error("Lỗi quét mã QR:", err);
              message.error("Lỗi quét mã QR.");
            }}
            style={{ width: "100%" }}
          />
          <Button
            type="danger"
            onClick={stopScanning}
            style={{ marginTop: "10px" }}
          >
            Dừng quét
          </Button>
        </div>
      )}

      {productDetail && (
        <div style={{ marginTop: "20px" }}>
          <h4>Thông tin sản phẩm quét được</h4>
          <p>
            <strong>Tên sản phẩm:</strong> {productDetail.name}
          </p>
          <p>
            <strong>Số lượng tồn kho:</strong> {productDetail.quantity}
          </p>
          <Form.Item label="Số lượng">
            <Input
              type="number"
              value={quantity}
              min={1}
              max={productDetail.quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: "100px" }}
            />
          </Form.Item>
          <Button type="primary" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </Button>
        </div>
      )}
    </>
  );
};

export default CounterSaleCart;
