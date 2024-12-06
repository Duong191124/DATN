import { DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { notification, Popconfirm, Table, Button, Input, Select } from "antd";
import { useState } from "react";
import { deleteProductAPI } from "../../service/api.service";
import UpdateProduct from "./update.product";
import UploadImage from "./update.image.product";
import { Link } from "react-router-dom";

const { Option } = Select;

const ProductTable = (props) => {
  const { dataProduct, loadProduct, page, pageSize, total, setPage, setPageSize } = props;
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);



  const columns = [
    {
      title: 'STT',  // Tiêu đề cột Số thứ tự
      render: (_, __, index) => {
        // Tính số thứ tự dựa trên trang hiện tại và số lượng phần tử mỗi trang
        return (page - 1) * pageSize + index + 1;
      }
    },
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: 'Mã SP',
      dataIndex: 'code'
    },
    {
      title: 'Tên SP',
      dataIndex: 'name'
    },
    {
      title: 'Ảnh SP',
      dataIndex: 'image',
      render: (imageUrl) => (
        <img
          src={imageUrl}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      )
    },
    {
      title: 'Cổ Áo',
      dataIndex: 'collarName'
    },
    {
      title: 'Tay áo',
      dataIndex: 'sleeveName'
    },
    {
      title: 'Loại SP',
      dataIndex: 'categoryName'
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brandName'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => {
        return status === 1 ? "Đang hoạt động" : "Ngưng hoạt động";
      }
    },
    {
      title: 'Mô tả',
      dataIndex: 'description'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        const isDisabled = record.status === 0; // Kiểm tra điều kiện để vô hiệu hóa

        return (
          <div style={{ display: "flex", gap: "20px" }}>
            <EditOutlined
              style={{ color: "orange" }}
              onClick={() => {
                setIsModalUpdateOpen(true);
                setDataUpdate(record);

              }}
            />
            <UploadOutlined
              style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
              onClick={() => {
                if (!isDisabled) {
                  setDataUpdate(record.id);
                  setIsModalOpen(true);
                }
              }}
            />
            <Link to={`/admin/products/${record.id}`}>
              <Button style={{ color: "blue" }} disabled={isDisabled}> {/* Vô hiệu hóa nút nếu status = 0 */}
                Product-detail
              </Button>
            </Link>
          </div>
        );
      }
    }


  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current) {
      if (+pagination.current !== +page) {
        setPage(+pagination.current);
      }
    }

    if (pagination && pagination.pageSize) {
      if (+pagination.pageSize !== +pageSize) {
        setPageSize(+pagination.pageSize);
      }
    }
  };

  return (
    <>


      <Table
        dataSource={dataProduct} // Sử dụng dữ liệu đã lọc
        columns={columns}
        rowKey={"id"}
        pagination={{
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
  );
};

export default ProductTable;
