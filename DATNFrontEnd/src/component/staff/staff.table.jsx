// import { Table } from 'antd';
// import { KeyOutlined } from '@ant-design/icons';
// import React, { Suspense, useEffect } from 'react';
// import { useState } from 'react';

// const PermissionModal = React.lazy(() => import('../permission/permission.modal'));

// const StaffTable = React.memo((props) => {
//     const { dataStaff } = props;
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedUserId, setSelectedUserId] = useState(null);
        

<<<<<<< Updated upstream
//     const columns = [
//         {
//             title: 'Id',
//             dataIndex: 'id',
//         },
//         {
//             title: 'Username',
//             dataIndex: 'username',
//         },
//         {
//             title: 'Action',
//             key: 'action',
//             render: (_, record) => (
//                 <div style={{ display: "flex", gap: "20px" }}>
//                     <KeyOutlined
//                         onClick={() => {
//                             setSelectedUserId(record.id);
//                             setIsModalOpen(true);
//                         }}
//                     />
//                 </div>
//             ),
//         }
//     ];
=======
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
            dataIndex: 'phone_number'
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Update at',
            dataIndex: 'updated_at',
        },
        {
            title: 'Created at',
            dataIndex: 'created_at',
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
>>>>>>> Stashed changes


//     return (
//         <>
//             <Table
//                 columns={columns}
//                 dataSource={dataStaff}
//                 rowKey="id"
//             />
//             <Suspense fallback={<div>Loading...</div>}>
//                 <PermissionModal
//                     id={selectedUserId}
//                     open={isModalOpen}
//                     onClose={() => setIsModalOpen(false)}
//                 />
//             </Suspense>
//         </>
//     )
// })

// export default StaffTable;