import React from "react";
import { Button, Table } from "antd";
import { QRCode } from "qrcode.react"; // Import thư viện QRCode

const columns = [
  {
    title: "Mã sản phẩm",
    dataIndex: "code",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "productResponse",
    render: (text, record) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            marginRight: 10,
            width: 80,
            height: 80,
            alignItems: "center",
          }}
        >
          <img
            src={record.image}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div>{record.productResponse?.name || "Chưa có tên sản phẩm"}</div>
      </div>
    ),
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Giá",
    dataIndex: "price",
    render: (text) => `${text?.toLocaleString()} VNĐ` || "Chưa có giá",
  },
  {
    title: "Size",
    dataIndex: "size",
    render: (text, record) => record.size?.name || "Chưa có size",
  },
  {
    title: "Màu",
    dataIndex: "color",
    render: (text, record) => record.color?.name || "Chưa có màu",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status) => {
      switch (status) {
        case 1:
          return "Còn Hàng";
        case 0:
          return "Hết Hàng";
        case 2:
          return "Ngừng Hoạt Động";
        default:
          return "Trạng Thái Không Xác Định";
      }
    },
  },
  {
    title: "Mã QR",
    render: (_, record) => <QRCode value={JSON.stringify(record)} size={100} />,
  },
];

const ProductDetailQRCode = ({ data }) => (
  <Table columns={columns} dataSource={data} rowKey="id" />
);

export default ProductDetailQRCode;
