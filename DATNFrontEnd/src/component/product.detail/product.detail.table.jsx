import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, notification, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import ProductDetailUpdate from "./productDetail.update";
import { deleteProductDetailAPI } from "../../service/api.service";

const ProductDetailTable = (props) => {
  const { dataProductDetail, loadDataProductDetail } = props;
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null); // Thông tin sản phẩm được chọn

  useEffect(() => {
    if (dataProductDetail && dataProductDetail.length > 0) {
      setSelectedProductDetail(dataProductDetail[0]); // Chọn sản phẩm đầu tiên
    }
  }, [dataProductDetail]);

  const handleDeleteProduct = async (id) => {

    const res = await deleteProductDetailAPI(id);
    if (res.data) {
      notification.success({
        message: "Delete Product Detail",
        description: "Product deleted successfully",
      });
      await loadDataProductDetail();
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
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
          </div>
        );
      },
    },
  ];

  return (
    <>

      {selectedProductDetail && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Product:</strong> {selectedProductDetail.productResponse?.name || "Chưa có product"}</p>

        </div>
      )}

      <Table columns={columns} dataSource={dataProductDetail} rowKey={"id"} />

      <ProductDetailUpdate
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        loadDataProductDetail={loadDataProductDetail}
      />
    </>
  );
};

export default ProductDetailTable;