import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { notification, Popconfirm, Table } from "antd";
import { useState } from "react";
import ProductDetailUpdate from "./productDetail.update";
import { deleteProductDetailAPI } from "../../service/api.service";
const ProductDetailTable = (props) => {
  const { dataProductDetail, loadProductDetail } = props;
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState("");

  const handleDeleteProduct = async (id) => {
    const res = await deleteProductDetailAPI(id);
    if (res.data) {
      notification.success({
        message: "delete product",
        description: "Delete product successfully",
      });
      await loadProductDetail();
    } else {
      notification.error({
        message: "delete product",
        description: JSON.stringify(res.message),
      });
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
      title: "Product",
      dataIndex: "productId",
    },
    {
      title: "Size",
      dataIndex: "sizeId",
    },
    {
      title: "Color",
      dataIndex: "colorId",
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
              title="Xoá sản phẩm"
              description="bạn có chắc chắn muốn xoá sản phẩm này không ?"
              onConfirm={() => {
                handleDeleteProduct(record.id);
              }}
              okText="yes"
              cancelText="no"
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
      <Table columns={columns} dataSource={dataProductDetail} rowKey={"id"} />
      <ProductDetailUpdate
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        loadProductDetail={loadProductDetail}
      />
    </>
  );
};
export default ProductDetailTable;
