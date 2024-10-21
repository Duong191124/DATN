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

  const handleDeleteProduct = async (id) => {
    try {
      const res = await deleteProductDetailAPI(id);
      if (res.status == 204) {
        notification.success({
          message: "delete product-detail",
          description: "delete product-detail successfully"
        })
        await loadProductDetail();
      }
    } catch (error) {
      console.log(error)
    }

  }

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
            <Popconfirm
              title="Delete product"
              description="Are you sure you want to delete this product?"
              onConfirm={() => { handleDeleteProduct(record.id) }}
              okText="Yes"
              cancelText="No"
              placement="left"
            >
              <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
            </Popconfirm>
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

      <Table columns={columns} dataSource={dataProductDetail} rowKey={"id"} />
      <Link to={"/admin/products"}>
        <div style={{ display: "flex", flexDirection: columns, color: "black" }}>
          <DoubleLeftOutlined />
          <h4 style={{ margin: "5px" }}> go to product pages </h4>
        </div>
      </Link>
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
