import { DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, notification, Popconfirm, Table } from "antd";
import { useState } from "react";
import ProductDetailUpdate from "./productDetail.update";
import { deleteProductDetailAPI } from "../../service/api.service";
import UpLoadImageForProductDetail from "./upload.image.product.detail";

const ProductDetailTable = (props) => {
  const { dataProductDetail, loadProductDetail } = props;
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  const handleDeleteProduct = async (id) => {
    try {
      const res = await deleteProductDetailAPI(id);
      if (res?.data) {
        notification.success({
          message: "Delete Product Detail",
          description: "Product deleted successfully",
        });
        await loadDataProductDetail();
      } else {
        throw new Error(res.message || "Delete failed");
      }
    } catch (error) {
      notification.error({
        message: "Delete Product Detail",
        description: error.message || "Something went wrong",
      });
    }
  };

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
      title: "Product",
      dataIndex: "productResponse",
      render: (text, record) => {
        return record.productResponse?.name || "Chưa có product";
      },
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
              onConfirm={() => handleDeleteProduct(record.id)}
              okText="Yes"
              cancelText="No"
              placement="left"
            >
              <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
            </Popconfirm>
            <UploadOutlined 
              style={{ cursor: "pointer"}}
              onClick={() => {
                setDataUpdate({ productId: record.productResponse?.id, productDetailId: record.id })
                setIsModalOpen(true)
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={dataProductDetail} rowKey={"id"} />
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
