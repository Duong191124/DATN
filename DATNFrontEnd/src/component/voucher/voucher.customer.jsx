import React, { useEffect, useState } from 'react';
import { Button, Modal, notification, Table, Radio } from 'antd';
import { fetchCustomerList } from '../../service/api.service';

const VoucherCustomer = ({ appliedCustomers, onApply, onClose }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null); // Chỉ chọn 1 khách hàng

    // Lấy danh sách khách hàng từ API
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetchCustomerList();
                if (res && res.data && res.data.data) {
                    const customerData = res.data.data.content || []; // Sử dụng giá trị mặc định là mảng rỗng
                    setCustomers(customerData);
                    if (appliedCustomers.length > 0) {
                        setSelectedCustomer(appliedCustomers[0].id); // Đặt khách hàng đã áp dụng đầu tiên
                    }
                } else {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không thể tải danh sách khách hàng',
                    });
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi tải danh sách khách hàng',
                });
            }
        };
        fetchCustomers();
    }, [appliedCustomers]);

    // Xử lý chọn khách hàng
    const handleSelect = (customerId) => {
        setSelectedCustomer(customerId); // Chỉ chọn 1 khách hàng
    };

    // Áp dụng khách hàng đã chọn
    const handleApply = () => {
        const selectedCustomerDetail = customers.find(customer => customer.id === selectedCustomer);
        onApply([selectedCustomerDetail]); // Truyền mảng chứa 1 khách hàng được chọn
        onClose(); // Đóng modal sau khi áp dụng
    };

    // Cấu hình các cột của bảng
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên Khách Hàng',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Chọn',
            key: 'select',
            render: (_, record) => (
                <Radio
                    checked={selectedCustomer === record.id} // Chỉ chọn 1 khách hàng
                    onChange={() => handleSelect(record.id)}
                />
            ),
        },
    ];

    return (
        <Modal
            title="Danh sách Khách Hàng"
            open={true}
            onCancel={onClose} // Đóng modal khi nhấn nút hủy
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="apply" type="primary" onClick={handleApply} disabled={!selectedCustomer}>
                    Áp dụng
                </Button>,
            ]}
        >
            <Table
                rowKey="id"
                columns={columns}
                dataSource={customers}
                pagination={{ pageSize: 5 }} // Số lượng khách hàng hiển thị mỗi trang
            />
        </Modal>
    );
};

export default VoucherCustomer;
