// VoucherCustomer.jsx
import React, { useEffect, useState } from 'react';
import { Button, Modal, notification, Table, Checkbox } from 'antd';
import { fetchCustomerList, updateVoucherCustomer } from '../../service/api.service';

const VoucherCustomer = ({ appliedCustomers, onApply, onClose, voucherId, onRefresh }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [genderFilter, setGenderFilter] = useState(''); // Trạng thái cho giới tính
    const [selectAll, setSelectAll] = useState(false); // Trạng thái cho chọn tất cả

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetchCustomerList();
                if (res && res.data && res.data.data) {
                    const customerData = res.data.data.content || [];
                    setCustomers(customerData);

                    if (appliedCustomers && appliedCustomers.length > 0) {
                        const appliedCustomerIds = appliedCustomers.map(customer => customer.id);
                        setSelectedCustomers(appliedCustomerIds);
                    } else {
                        setSelectedCustomers([]); 
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

        if (appliedCustomers !== undefined) {
            fetchCustomers();
        }
    }, [appliedCustomers]);

    const handleGender = (gender) => {
        if (gender === 1) {
            return "Nam";
        } else if (gender === 2) {
            return "Nữ";
        } else {
            return "Khác";
        }
    };

    const handleSelect = (customerId) => {
        setSelectedCustomers(prev => {
            const newSelected = prev.includes(customerId) 
                ? prev.filter(id => id !== customerId) 
                : [...prev, customerId]; 
            return newSelected;
        });
    };

    const handleApply = async () => {
        try {
            const payload = { customers: selectedCustomers.length > 0 ? selectedCustomers : [] };
            if (!voucherId) {
                throw new Error("Voucher ID is required");
            }
            await updateVoucherCustomer(voucherId, payload);
            notification.success({
                message: 'Thành công',
                description: 'Đã áp dụng voucher cho khách hàng thành công',
            });

            const selectedCustomerDetails = customers.filter(customer => selectedCustomers.includes(customer.id));
            onApply(selectedCustomerDetails);
            onRefresh();
            onClose();
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi áp dụng voucher cho khách hàng',
            });
        }
    };

    // Xử lý thay đổi bộ lọc giới tính
    const handleGenderFilterChange = (value) => {
        if (genderFilter === value) {
            setGenderFilter(''); // Bỏ chọn khi chọn lại giới tính hiện tại
        } else {
            setGenderFilter(value);
        }
        setSelectAll(false); // Đặt lại chọn tất cả khi thay đổi bộ lọc
    };

    // Xử lý chọn tất cả
    const handleSelectAllChange = (e) => {
        const { checked } = e.target;
        setSelectAll(checked);
    
        if (checked) {
            // Chọn tất cả dựa trên bộ lọc giới tính
            const filteredCustomerIds = customers
                .filter(customer => {
                    if (genderFilter === 'male') return customer.gender === 1;
                    if (genderFilter === 'female') return customer.gender === 2;
                    return true; // Nếu không có bộ lọc, chọn tất cả
                })
                .map(customer => customer.id);
    
            setSelectedCustomers(filteredCustomerIds);
        } else {
            // Bỏ chọn tất cả
            setSelectedCustomers([]);
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
            title: 'Giới tính',
            key: 'gender',
            render: (_, record) => (
                <p>{handleGender(record.gender)}</p>
            )
        },
        {
            title: 'Chọn',
            key: 'select',
            render: (_, record) => (
                <Checkbox
                    checked={selectedCustomers.includes(record.id)}
                    onChange={() => handleSelect(record.id)}
                />
            ),
        },
    ];

    const filteredCustomers = customers.filter(customer => {
        if (genderFilter === 'male') return customer.gender === 1;
        if (genderFilter === 'female') return customer.gender === 2;
        return true; // Trả về tất cả nếu không có bộ lọc
    });

    return (
        <Modal
            title="Danh sách Khách Hàng"
            open={true}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="apply" type="primary" onClick={handleApply}>
                    Áp dụng
                </Button>,
            ]}
        >
            <div>
                <div>
                    <Checkbox checked={selectAll} onChange={handleSelectAllChange}>Chọn tất cả</Checkbox>
                </div>
                <div>
                    <Checkbox checked={genderFilter === 'male'} onChange={() => handleGenderFilterChange('male')}>Nam</Checkbox>
                    <Checkbox checked={genderFilter === 'female'} onChange={() => handleGenderFilterChange('female')}>Nữ</Checkbox>
                    <Checkbox checked={genderFilter === ''} onChange={() => handleGenderFilterChange('')}>Tất cả giới tính</Checkbox> {/* Checkbox cho Tất cả giới tính */}
                </div>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={filteredCustomers} // Sử dụng danh sách khách hàng đã lọc
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </Modal>
    );
};

export default VoucherCustomer;
