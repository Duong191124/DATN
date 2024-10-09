import React, { useState } from 'react';
import { Table, Checkbox } from 'antd';

const initialData = [
    {
        key: '1',
        action: 'Method 1',
        type: 'user',
        staff: true,
        admin: false,
    },
    {
        key: '2',
        action: 'Method 2',
        type: 'user',
        staff: false,
        admin: true,
    },
    {
        key: '3',
        action: 'Method 3',
        type: 'product',
        staff: true,
        admin: true,
    },
    {
        key: '4',
        action: 'Method 4',
        type: 'product',
        staff: false,
        admin: false,
    },
];

const PermissionTable = (props) => {

    const {dataPermission, loadPermission} = props;

    const [data, setData] = useState(initialData);

    const handleCheckboxChange = (key, type) => {
        const newData = data.map(item => {
            if (item.key === key) {
                return { ...item, [type]: !item[type] };
            }
            return item;
        });
        setData(newData);
    };

    // Nhóm dữ liệu theo type
    const groupedData = {};
    data.forEach(item => {
        if (!groupedData[item.type]) {
            groupedData[item.type] = [];
        }
        groupedData[item.type].push(item);
    });

    // Chuyển đổi thành một danh sách dữ liệu cho bảng
    const tableData = [];
    Object.entries(groupedData).forEach(([type, items]) => {
        tableData.push({
            key: `${type}-title`,
            action: `${type.charAt(0).toUpperCase() + type.slice(1)} Actions`,
            type: type,
            staff: null,
            admin: null,
        });
        tableData.push(...items);
    });

    const columns = [
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => {
                if (record.key.includes('-title')) return <strong>{text}</strong>;
                return text;
            },
        },
        {
            title: 'Staff',
            dataIndex: 'staff',
            render: (text, record) => (
                !record.key.includes('-title') && (
                    <Checkbox checked={record.staff}
                        onChange={() => handleCheckboxChange(record.key, 'staff')}
                    />
                )
            ),
        },
        {
            title: 'Admin',
            dataIndex: 'admin',
            render: (text, record) => (
                !record.key.includes('-title') && (
                    <Checkbox checked={record.admin}
                        onChange={() => handleCheckboxChange(record.key, 'admin')}
                    />
                )
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={dataPermission}
            pagination={false}
            rowKey="key"
        />
    );
}

export default PermissionTable;