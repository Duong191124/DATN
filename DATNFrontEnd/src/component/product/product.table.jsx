import { DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { notification, Popconfirm, Table, Button } from "antd";
import { useState } from "react";
import { deleteProductAPI } from "../../service/api.service";
import UpdateProduct from "./update.product";
import UploadImage from "./update.image.product";
import { Link } from "react-router-dom";


const ProductTable = (props) => {
  const handleDeleteProduct = async (id) => {
    try {
      const res = await deleteProductAPI(id)
      if (res.data) {
        notification.success({
          message: "delete product",
          description: "Delete product successfully"
        })
        await loadProduct()
      }
    } catch (error) {
      if (error.response.status === 500) {
        notification.error({
          message: "delete product",
          description: JSON.stringify(error.response.data)
        })
      }
    }

  }

  const { dataProduct, loadProduct, page, pageSize, total, setPage, setPageSize } = props;
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dataUpdate, setDataUpdate] = useState(null)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: 'Code',
      dataIndex: 'code'
    },
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (imageUrl) => (
        <img
          src={imageUrl}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      )
    },
    {
      title: 'Price',
      dataIndex: 'price'
    },
    {
      title: 'Collar',
      dataIndex: 'collarName'
    },
    {
      title: 'Sleeve',
      dataIndex: 'sleeveName'
    },
    {
      title: 'Category',
      dataIndex: 'categoryName'
    },
    {
      title: 'Brand',
      dataIndex: 'brandName'
    },
    {
      title: 'Status',
      dataIndex: 'status'
    },
    {
      title: 'Description',
      dataIndex: 'description'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <div style={{ display: "flex", gap: "20px" }}>
            <EditOutlined
              style={{ cursor: "pointer", color: "orange" }}
              onClick={() => {
                setIsModalUpdateOpen(true)
                setDataUpdate(record)
              }}
            />
            <Popconfirm
              title="Xoá sản phẩm"
              description="bạn có chắc chắn muốn xoá sản phẩm này không ?"
              onConfirm={() => { handleDeleteProduct(record.id) }}
              okText="yes"
              cancelText="no"
              placement="left"
            >
              <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
            </Popconfirm>
            <UploadOutlined
              style={{ cursor: "pointer" }}
              onClick={() => {
                setDataUpdate(record.id)
                setIsModalOpen(true)
              }}
            />
            {/* Thêm Link để chuyển trang */}
            <Link to={`/admin/products/${record.id}`}>
              <Button>Product-detail</Button>
            </Link>
          </div>
        )
      }
    }
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current) {
      if (+pagination.current !== + page) {
        setPage(+pagination.current)
      }
    }

    if (pagination && pagination.pageSize) {
      if (+pagination.pageSize !== +pageSize) {
        setPageSize(+pagination.pageSize)
      }
    }
  };

  return (
    <>
      < Table
        dataSource={dataProduct}
        columns={columns}
        rowKey={"id"}
        pagination={
          {
            current: page,
            pageSize: pageSize,
            showSizeChanger: true,
            total: total,
            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
          }}
        onChange={onChange}

      />
      <UpdateProduct
        loadProduct={loadProduct}
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
      <UploadImage
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        loadProduct={loadProduct}
        dataUpdate={dataUpdate}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
export default ProductTable