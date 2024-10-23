import { Button, message, Popconfirm, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, KeyOutlined } from '@ant-design/icons';
import React, { Suspense, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import CreateStaff from './create.staff';
import { deleteStaff, getAllStaff, updateStatus } from '../../service/api.service';

const UpdatePermissionForUserModal = React.lazy(() =>
  import("../permission/update.permission.modal")
);

const StaffTable = () => {
  const [dataStaff, setDataStaff] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadStaff();
  }, [current, pageSize]);

  const loadStaff = async () => {
    const res = await getAllStaff(current, pageSize);
    if (res.data) {
      setDataStaff(res.data.data.content);
      setTotal(res.data.data.totalElements);
    }
  };

  const onChange = (pagination) => {
    if (pagination && pagination.current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize) {
      setPageSize(pagination.pageSize);
    }
  };

  const handleDelete = async (id) => {
    await deleteStaff(id);
    await loadStaff();
    message.success("delete success")
  }

  const handleStatus = async (id) => {
    await updateStatus(id)
    await loadStaff();
    message.success("update status success")
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
    },
    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => (
        <p>{record.status == 1 ? "Activate" : "Inactivate"}</p>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <KeyOutlined
            onClick={() => {
              setSelectedUserId(record.id);
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this staff?"
            onConfirm={() => {
              handleDelete(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined />
          </Popconfirm>
          <Popconfirm
            title="Are you sure to enable status this staff?"
            onConfirm={() => {
              handleStatus(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <EditOutlined />
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2>Staff Management</h2>
        <Button
          type="primary"
          onClick={() => setIsDrawerOpen(true)}
          icon={<PlusOutlined />}
        >
          New account
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataStaff}
        rowKey="id"
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => (
            <div>
              {range[0]}-{range[1]} on {total} rows
            </div>
          ),
        }}
        onChange={onChange}
      />
      <CreateStaff
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        loadStaff={loadStaff}
      />
      <Suspense fallback={<div>Loading Permission Modal...</div>}>
        <UpdatePermissionForUserModal
          id={selectedUserId}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Suspense>
    </>
  );
};

export default StaffTable;
