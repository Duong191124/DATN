import {
  DeleteOutlined,
  DoubleLeftOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, notification, Popconfirm, Table } from "antd";
import { useState, useRef } from "react";
import ProductDetailUpdate from "./productDetail.update";
import { deleteProductDetailAPI } from "../../service/api.service";
import UpLoadImageForProductDetail from "./upload.image.product.detail";
import { Link } from "react-router-dom";
import ReactQRCode from "react-qr-code"; // Import thư viện react-qr-code
import html2canvas from "html2canvas"; // Import thư viện html2canvas để xuất mã QR thành hình ảnh

const ProductDetailTable = (props) => {
  const { dataProductDetail, loadProductDetail } = props;
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const qrCodeRef = useRef(null); // Thêm ref để tham chiếu đến mã QR

  // Cập nhật dữ liệu sản phẩm với trạng thái tương ứng
  const updatedDataProductDetail = dataProductDetail.map((item) => ({
    ...item,
    status:
      item.product?.status === 0 ||
        item.size?.status === 0 ||
        item.color?.status === 0 ||
        item.sleeve?.status === 0 ||
        item.collar?.status === 0 ||
        item.brand?.status === 0
        ? 2
        : item.quantity > 0
          ? 1
          : 0, // Xét điều kiện trạng thái
  }));

  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
    },
    {
      title: "Giá Mặc Định",
      dataIndex: "defaultPrice",
    },
    {
      title: "Giá Giảm",
      dataIndex: "discountPrice",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (imageUrl) => (
        <img
          src={imageUrl}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Kích Cỡ",
      dataIndex: "size",
      render: (text, record) => {
        return record.size?.name || "Chưa có size";
      },
    },
    {
      title: "Màu Sắc",
      dataIndex: "color",
      render: (text, record) => {
        return record.color?.name || "Chưa có color";
      },
    },
    {
      title: "Cân Nặng",
      dataIndex: "weight",

    },
    {
      title: "Trạng Thái",
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
      title: "Hành Động",
      key: "action",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", gap: "20px" }}>
            <EditOutlined
              style={{ cursor: "pointer", color: "orange" }}
              onClick={() => {
                setIsModalUpdateOpen(true);
                setDataUpdate(record);
              }}
            />

            <UploadOutlined
              style={{ cursor: "pointer" }}
              onClick={() => {
                setDataUpdate(record);
                setIsModalOpen(true);
              }}
            />
          </div>
        );
      },
    },
  ];



  // Lấy tên của sản phẩm đầu tiên trong danh sách
  const productName =
    dataProductDetail[0]?.productResponse.name || "Chưa có product";

  return (
    <>
      <h1>{productName}</h1>

      <Table
        columns={columns}
        dataSource={updatedDataProductDetail}
        rowKey={"id"}
      />

      <ProductDetailUpdate
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        loadProductDetail={loadProductDetail}
      />
      <UpLoadImageForProductDetail
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        loadProductDetail={loadProductDetail}
        dataUpdate={dataUpdate}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductDetailTable;
