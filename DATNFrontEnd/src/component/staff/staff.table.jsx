import { Button, Table } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import React, { Suspense, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import CreateStaff from './create.staff';
import { getAllStaff } from '../../service/api.service';

const PermissionModal = React.lazy(() => import('../permission/permission.modal'));

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
    }, [current, pageSize])

    const loadStaff = async () => {
        const res = await getAllStaff(current, pageSize);
        console.log(res);
        if (res.data) {
            setDataStaff(res.data.content);
            setTotal(res.data.totalElements);
        }

    }

    const onChange = (pagination) => {
        if (pagination && pagination.current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize) {
            setPageSize(pagination.pageSize);
        }
    };

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
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", gap: "20px" }}>
                    <KeyOutlined
                        onClick={() => {
                            setSelectedUserId(record.id);
                            setIsModalOpen(true);
                        }}
                    />
                </div>
            ),
        }
    ];

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
                    showTotal: (total, range) => <div>{range[0]}-{range[1]} on {total} rows</div>
                }}
                onChange={onChange}
            />
            <CreateStaff
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                loadStaff={loadStaff}
            />
            <Suspense fallback={<div>Loading Permission Modal...</div>}>
                <PermissionModal
                    id={selectedUserId}
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </Suspense>
        </>
    )
}

export default StaffTable;