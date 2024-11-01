import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message, Popconfirm, Space, Table, Input } from "antd";
import { deletePermissionById } from '../../service/api.service';
import PermissionUpdate from './permission.update';
import debounce from 'lodash/debounce';

const { Search } = Input;

const PermissionTable = ({ dataTable, loadData, setPage, setSize, page, size, total }) => {
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isUpdate, setIsUpdate] = useState(null);
    const [searchText, setSearchText] = useState(''); // State cho giá trị tìm kiếm

    // Hàm xử lý tìm kiếm
    const handleSearch = debounce((value) => {
        setSearchText(value.trim()); // Cập nhật giá trị tìm kiếm
    }, 300);

    // Lọc dữ liệu dựa trên giá trị tìm kiếm
    const filteredData = dataTable.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) || // Tìm kiếm theo tên
        item.id.toString().includes(searchText) // Tìm kiếm theo id
    );

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
        message.success("Delete success");
    };

    const onChange = (pagination, filters, sorter, extra) => {
        if (+page !== +pagination.current || +size !== pagination.pageSize) {
            setPage(pagination.current);
            setSize(pagination.pageSize);
        }
    };

    useEffect(() => {
        loadData();
    }, [page, size]);

    return (
        <>
            {/* Ô tìm kiếm */}
            <div style={{ marginTop: 16 }}>
                <Search
                    placeholder="Search by Id or Name"
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                style={{ marginTop: 30 }}
                columns={columns}
                dataSource={filteredData}  // Dữ liệu đã được lọc
                rowKey={'id'}
                pagination={{
                    defaultPageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '30', "50"],
                    current: page,
                    pageSize: size,
                    showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên {total} rows</div>) },
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
