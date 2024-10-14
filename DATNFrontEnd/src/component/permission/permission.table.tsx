import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message, Pagination, Popconfirm, Space, Table } from "antd";
import { deletePermissionById } from '../../service/api.service';
import PermissionUpdate from './permission.update';

const PermissionTable = ({ dataTable, loadData, setPage, setSize, page, size, total }) => {
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isUpdate, setIsUpdate] = useState(null);

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            render: (_, __, index) => {
                return <p>{(index + 1) + (size * (page - 1))}</p>;  // Hiển thị thứ tự dựa trên chỉ mục
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

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('check data onChange ', pagination)
        if (+page != +pagination.pageSize || +size != pagination.current) {
            setPage(pagination.current)
            setSize(pagination.pageSize)
            console.log("check page: ", page);
            console.log("check sixe: ", size);
        }
    };

    useEffect(() => {
        loadData();
    }, [page, size])

    return (
        <>
            <Table
                style={{
                    marginTop: 30,
                }}
                columns={columns}
                dataSource={dataTable}
                rowKey={'id'}
                pagination={{
                    defaultPageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '30', "50"],
                    current: page,
                    pageSize: size,
                    showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) },
                    total: total
                }}
                onChange={onChange}
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
