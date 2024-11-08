import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Table, Space, Switch, Button, Input } from "antd";
import { useEffect, useState } from "react";
import { softDelete } from "../../service/api.service";
import debounce from "lodash/debounce";

const { Search } = Input;

const CustomerTable = ({
  dataTable,
  loadData,
  setPage,
  setSize,
  page,
  size,
  total,
  setIsModalOpen,
  setDataDetail,
  setIsModalOpenU,
}) => {
  const [showActivate, setShowActivate] = useState(true); // State lưu trạng thái của switch
  const [searchText, setSearchText] = useState(""); // State lưu trữ giá trị tìm kiếm

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => {
        return <p>{index + 1 + size * (page - 1)}</p>; // Hiển thị thứ tự dựa trên chỉ mục
      },
    },
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <p>{record.status === 1 ? "Activate" : "Inactivate"}</p>
      ),
    },
    {
      title: "Date of birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Note",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Gender",
      key: "gender",
      render: (_, record) => <p>{handleGender(record.gender)}</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => {
              handleUpdate(record);
            }}
          />
          <Popconfirm
            title="Are you sure to disable this task?"
            onConfirm={() => {
              handleSoftDelete(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (+page !== +pagination.pageSize || +size !== pagination.current) {
      setPage(pagination.current);
      setSize(pagination.pageSize);
    }
  };

  const handleSoftDelete = async (id) => {
    await softDelete(id);
    await loadData();
  };

  const handleUpdate = (record) => {
    setDataDetail(record);
    setIsModalOpenU(true);
  };

  const handleGender = (gender) => {
    if (gender === 1) {
      return "Male";
    } else if (gender === 2) {
      return "Female";
    } else {
      return "Other";
    }
  };

  const handleStatusChange = (checked) => {
    setShowActivate(checked); // Cập nhật trạng thái của switch
  };

  // Hàm lọc dữ liệu dựa trên trạng thái của switch và tìm kiếm
  const filteredData = dataTable.filter((item) => {
    const isMatch =
      item.username.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phoneNumber.includes(searchText);
    return showActivate
      ? item.status === 1 && isMatch
      : item.status === 0 && isMatch;
  });

  // Hàm xử lý tìm kiếm
  const handleSearch = debounce((value) => {
    setSearchText(value.trim()); // Cập nhật giá trị tìm kiếm
  }, 300);

  useEffect(() => {
    loadData();
  }, [page, size, showActivate]); // Load lại dữ liệu khi trang, kích thước trang hoặc trạng thái switch thay đổi

  return (
    <>
      {/* Switch để chọn lọc hiển thị Activate hay Inactivate */}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Switch
          checked={showActivate}
          onChange={handleStatusChange}
          checkedChildren="Activate"
          unCheckedChildren="Inactivate"
        />
        {/* Ô tìm kiếm */}
        <Search
          placeholder="Search by Username, Email, or Phone"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      {/* Bảng hiển thị */}
      <Table
        style={{ marginTop: 30 }}
        columns={columns}
        dataSource={filteredData} // Dữ liệu đã được lọc
        rowKey={"id"}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "30", "50"],
          current: page,
          pageSize: size,
          showTotal: (total, range) => (
            <div>
              {range[0]}-{range[1]} trên {total} rows
            </div>
          ),
          total: total,
        }}
        onChange={onChange}
      />
    </>
  );
};

export default CustomerTable;
