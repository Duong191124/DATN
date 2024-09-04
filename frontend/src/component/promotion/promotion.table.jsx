import React from 'react';
import { Space, Table, Tag } from 'antd';

const PromotionTable = (props) => {

    const dataPromotion = props

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Tags',
            key: 'tags',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];
    return (
        // <Table columns={columns} dataSource={dataPromotion} />
        <div>Page</div>
    )
}

export default PromotionTable;