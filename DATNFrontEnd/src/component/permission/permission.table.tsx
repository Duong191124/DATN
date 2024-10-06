import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message, Popconfirm, Space, Table } from "antd";
import { deletePermissionById } from '../../service/api.service';
import PermissionUpdate from './permission.update';

const PermissionTable = ({ dataTable, loadData }) => {
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isUpdate, setIsUpdate] = useState(null);

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            render: (_, __, index) => {
                return <p>{index + 1}</p>;  // Hiển thị thứ tự dựa trên chỉ mục
            },
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',  // Sử dụng dataIndex đúng để hiển thị tên
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => {
                            handleUpdate(record);
                        }}
                    />
                    <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={() => {
                            hanleDelete(record.id);
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

    const handleUpdate = (u) => {
        setIsUpdate(u);
        setIsOpenUpdate(true);
    };

    const hanleDelete = async (id) => {
        await deletePermissionById(id);
        await loadData();
        message.success("delete success")
    };

    return (
        <>
            <Table
                style={{
                    marginTop: 30,
                }}
                columns={columns}
                dataSource={dataTable}
                rowKey={'id'}
            />
            <PermissionUpdate
                isOpenUpdate={isOpenUpdate}
                setIsOpenUpdate={setIsOpenUpdate}
                loadData={loadData}
                isUpdate={isUpdate}
            />
        </>
    );
};

export default PermissionTable;
