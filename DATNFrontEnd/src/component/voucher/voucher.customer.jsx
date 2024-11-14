// VoucherCustomer.jsx
import React, { useEffect, useState } from 'react';
import { Button, Modal, notification, Table, Checkbox, Input, Space } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { fetchCustomerList, updateVoucherCustomer } from '../../service/api.service';

const VoucherCustomer = ({ appliedCustomers, onApply, onClose, voucherId, onRefresh }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [genderFilter, setGenderFilter] = useState(''); // Trạng thái cho giới tính
    const [selectAll, setSelectAll] = useState(false); // Trạng thái cho chọn tất cả
    const [searchText, setSearchText] = useState(''); // Trạng thái cho tìm kiếm

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
            const filteredCustomerIds = filteredCustomers
                .map(customer => customer.id);
    
            setSelectedCustomers(filteredCustomerIds);
        } else {
            // Bỏ chọn tất cả
            setSelectedCustomers([]);
        }
    };

    // Xử lý thay đổi thanh tìm kiếm
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchText('');
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            width: '10%',
        },
        {
            title: 'Tên Khách Hàng',
            dataIndex: 'username',
            key: 'username',
            sorter: (a, b) => a.username.localeCompare(b.username),
            width: '25%',
        },
        {
            title: 'Giới tính',
            key: 'gender',
            render: (_, record) => (
                <p>{handleGender(record.gender)}</p>
            ),
            filters: [
                { text: 'Nam', value: 'male' },
                { text: 'Nữ', value: 'female' },
                { text: 'Khác', value: 'other' },
            ],
            onFilter: (value, record) => {
                if (value === 'male') return record.gender === 1;
                if (value === 'female') return record.gender === 2;
                return record.gender !== 1 && record.gender !== 2;
            },
            width: '15%',
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
            width: '20%',
        },
        // {
        //     title: 'Chọn',
        //     key: 'select',
        //     render: (_, record) => (
        //         <Checkbox
        //             checked={selectedCustomers.includes(record.id)}
        //             onChange={() => handleSelect(record.id)}
        //         />
        //     ),
        //     width: '10%',
        // },
    ];

    // Lọc khách hàng dựa trên bộ lọc giới tính và thanh tìm kiếm
    const filteredCustomers = customers.filter(customer => {
        // Lọc theo giới tính
        if (genderFilter === 'male') return customer.gender === 1;
        if (genderFilter === 'female') return customer.gender === 2;
        if (genderFilter === 'other') return customer.gender !== 1 && customer.gender !== 2;
        return true; // Trả về tất cả nếu không có bộ lọc
    }).filter(customer => {
        // Lọc theo thanh tìm kiếm (tên hoặc phone)
        const lowerSearch = searchText.toLowerCase();
        return customer.username.toLowerCase().includes(lowerSearch) ||
               customer.phoneNumber.toLowerCase().includes(lowerSearch);
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
            width={800}
        >
            <div style={{ marginBottom: 16 }}>
                {/* Thanh tìm kiếm */}
                <Space style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                        value={searchText}
                        onChange={handleSearch}
                        prefix={<SearchOutlined />}
                        suffix={searchText && <ClearOutlined onClick={handleClearSearch} style={{ cursor: 'pointer' }} />}
                        allowClear
                        style={{ width: 300 }}
                    />
                </Space>
            </div>
           
            <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredCustomers} // Sử dụng danh sách khách hàng đã lọc
                pagination={{ pageSize: 5 }}
                rowSelection={{
                    selectedRowKeys: selectedCustomers,
                    onChange: (selectedRowKeys) => {
                        setSelectedCustomers(selectedRowKeys);
                        setSelectAll(selectedRowKeys.length === filteredCustomers.length);
                    },
                }}
            />
        </Modal>
    );
};

export default VoucherCustomer;
