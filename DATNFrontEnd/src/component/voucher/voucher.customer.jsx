// VoucherCustomer.jsx
import React, { useEffect, useState } from 'react';
import { Button, Modal, notification, Table, Radio } from 'antd';
import { fetchCustomerList, fetchDataVoucher, updateVoucherCustomer } from '../../service/api.service';

const VoucherCustomer = ({  appliedCustomers, onApply, onClose, voucherId, onRefresh}) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [voucherDetails, setVoucherDetails] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetchCustomerList();
                if (res && res.data && res.data.data) {
                    const customerData = res.data.data.content || [];
                    setCustomers(customerData);
                    if (appliedCustomers.length > 0) {
                        setSelectedCustomer(appliedCustomers[0].id);
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

    const fetchVoucherDetails = async (customerId) => {
        try {
            const res = await fetchDataVoucher(customerId);
            console.log("Data: ", res);
            if (res && res.data.data) {
                setVoucherDetails(res.data.data);
            } else {
                setVoucherDetails(null);
                notification.info({
                    message: 'Thông báo',
                    description: 'Không có voucher cho khách hàng này',
                });
            }
        } catch (error) {
            setVoucherDetails(null);
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi tải chi tiết voucher',
            });
        }
    };

    const handleSelect = (customerId) => {
        setSelectedCustomer(customerId);
        fetchVoucherDetails(customerId);
    };

    const handleApply = async () => {
        try {
            const payload = { customers: selectedCustomer };
            console.log('Payload:', payload);
            console.log('Voucher ID:', voucherId);

            if (!voucherId) {
                throw new Error("Voucher ID is required");
            }
            await updateVoucherCustomer(voucherId, payload);
            notification.success({
                message: 'Thành công',
                description: 'Đã áp dụng voucher cho khách hàng thành công',
            });

            const selectedCustomerDetail = customers.find(customer => customer.id === selectedCustomer);
            onApply(selectedCustomerDetail); // Gọi hàm onApply
            onRefresh(); // Gọi hàm loadData từ VoucherTable
            onClose();
        } catch (error) {
            console.error('Error details:', error.response ? error.response.data : error);
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi áp dụng voucher cho khách hàng',
            });
        }
    };

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
                    checked={selectedCustomer === record.id}
                    onChange={() => handleSelect(record.id)}
                />
            ),
        },
    ];

    return (
        <Modal
            title="Danh sách Khách Hàng"
            open={true}
            onCancel={onClose}
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
                pagination={{ pageSize: 5 }}
            />
        </Modal>
    );
};

export default VoucherCustomer;
