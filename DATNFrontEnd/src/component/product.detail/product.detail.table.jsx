import { DeleteOutlined, DoubleLeftOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, notification, Popconfirm, Table } from "antd";
import { useState } from "react";
import ProductDetailUpdate from "./productDetail.update";
import { deleteProductDetailAPI } from "../../service/api.service";
import UpLoadImageForProductDetail from "./upload.image.product.detail";
import { Link } from "react-router-dom";

const ProductDetailTable = (props) => {
  const { dataProductDetail, loadProductDetail } = props;
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  // Cập nhật dữ liệu sản phẩm với trạng thái tương ứng
  const updatedDataProductDetail = dataProductDetail.map(item => ({
    ...item,
    status: item.quantity > 0 ? 1 : 0, // Nếu quantity > 0 thì status = 1, ngược lại status = 0
  }));

  const columns = [
    {
      title: "Code",
      dataIndex: "code"
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (imageUrl) => (
        <img
          src={imageUrl}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      )
    },
    {
      title: "Size",
      dataIndex: "size",
      render: (text, record) => {
        return record.size?.name || "Chưa có size";
      },
    },
    {
      title: "Color",
      dataIndex: "color",
      render: (text, record) => {
        return record.color?.name || "Chưa có color";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        return status === 1 ? "Còn Hàng" : "Hết Hàng";
      },
    },
    {
      title: "Action",
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
                setDataUpdate(record)
                setIsModalOpen(true)
              }}
            />
          </div>
        );
      },
    },
  ];

  // Lấy tên của sản phẩm đầu tiên trong danh sách
  const productName = dataProductDetail[0]?.productResponse.name || "Chưa có product";

  return (
    <>
      <h1>{productName}</h1>

      <Table
        columns={columns}
        dataSource={updatedDataProductDetail}
        rowKey={"id"}
      // rowClassName={(record) => (record.price === 0 ? "faded-row" : "")} // Thêm điều kiện để làm mờ
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
